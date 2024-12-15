import { WorkflowEntrypoint } from "cloudflare:workers";
import type { WorkflowEvent, WorkflowStep } from "cloudflare:workers";
import { getDB, userMeta } from "@acme/db";
import { eq, isNull, or, gt, lt, and } from 'drizzle-orm';

// Type for the workflow parameters
interface GetUsersForRecapParams {
    batchSize?: number;
    lastProcessedUserId?: string;
}

export class GetUsersForRecapWorkflow extends WorkflowEntrypoint<Env, GetUsersForRecapParams> {
    async run(event: WorkflowEvent<GetUsersForRecapParams>, step: WorkflowStep) {
        const batchSize = event.payload.batchSize ?? 100; // Process users in batches
        const lastProcessedUserId = event.payload.lastProcessedUserId;

        // Get users who haven't had a recap recently
        const users = await step.do('Get batch of active users', async () => {
            const db = getDB(this.env);
            const now = new Date();
            const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            const baseCondition = or(
                isNull(userMeta.lastRecapAt),
                lt(userMeta.lastRecapAt, twentyFourHoursAgo)
            );
            
            const whereCondition = lastProcessedUserId 
                ? and(baseCondition, gt(userMeta.userId, lastProcessedUserId))
                : baseCondition;

            const query = db.select()
                .from(userMeta)
                .where(whereCondition)
                .limit(batchSize);

            return await query;
        });

        // Process users in parallel, with retry logic
        await step.do(
            'Trigger individual recaps',
            {
                retries: {
                    limit: 5,
                    delay: '1 minute',
                    backoff: 'exponential',
                },
                timeout: '5 minutes',
            },
            async () => {
                // Process users in parallel with Promise.all
                await Promise.all(users.map(async (user) => {
                    try {
                        // Start a new workflow instance for each user
                        await this.env.DAILY_RECAP_WORKFLOW.create({
                            params: {
                                userId: user.userId,
                                timezone: user.timezone
                            }
                        });

                        // Update lastRecapAt to prevent duplicate processing
                        const db = getDB(this.env);
                        await db
                            .update(userMeta)
                            .set({ lastRecapAt: new Date() })
                            .where(eq(userMeta.userId, user.userId));
                    } catch (error) {
                        console.error(`Failed to process user ${user.userId}:`, error);
                        throw error; // Let the retry mechanism handle it
                    }
                }));
            }
        );

        // If we processed a full batch, trigger another workflow for the next batch
        if (users.length === batchSize) {
            const lastUser = users[users.length - 1];
            if (!lastUser) return;
            
            await step.do('Trigger next batch', async () => {
                await this.env.GET_USERS_WORKFLOW.create({
                    params: {
                        batchSize,
                        lastProcessedUserId: lastUser.userId
                    }
                });
            });
        }
    }
} 