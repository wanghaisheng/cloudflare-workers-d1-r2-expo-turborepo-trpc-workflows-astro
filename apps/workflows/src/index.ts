import {DailyRecapWorkflow} from "./workflows/daily-recap";
import { GetUsersForRecapWorkflow } from "./workflows/get-users-for-recap";

export {
	DailyRecapWorkflow,
	GetUsersForRecapWorkflow
}

export default {
	scheduled(event, env: Env, ctx) {
		console.log("cron processed");
		ctx.waitUntil(env.GET_USERS_WORKFLOW.create());
	}
} satisfies ExportedHandler<Env>;
