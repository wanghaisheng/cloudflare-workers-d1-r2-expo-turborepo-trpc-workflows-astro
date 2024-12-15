import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { userMeta } from "@acme/db";
import { eq } from 'drizzle-orm';

const artStyles = ['classical painting', 'ethereal animated fairy', 'childrens book', '3d animated style'] as const;

export const userRouter = {
  updateArtStyle: protectedProcedure
    .input(z.enum(artStyles))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.userId) throw new Error("Not authenticated");
      
      await ctx.db
        .update(userMeta)
        .set({ artStyle: input })
        .where(eq(userMeta.userId, ctx.user.userId));

      return { success: true };
    }),
    
  getPreferences: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user.userId) throw new Error("Not authenticated");
      
      const preferences = await ctx.db
        .select()
        .from(userMeta)
        .where(eq(userMeta.userId, ctx.user.userId))
        .limit(1);

      // If no preferences exist, create default preferences
      if (preferences.length === 0) {
        const defaultPreferences = {
          userId: ctx.user.userId,
          email: ctx.user.userId,
          createdAt: new Date(),
          timezone: 'America/Los_Angeles',
          artStyle: 'classical painting' as const,
        };

        await ctx.db.insert(userMeta).values(defaultPreferences);
        return defaultPreferences;
      }

      return preferences[0];
    }),
};
