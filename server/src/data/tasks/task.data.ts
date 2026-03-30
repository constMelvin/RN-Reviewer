import {
	CreateTaskArgs,
	GetTaskArgs,
	UpdateTaskArgs,
} from "@/controllers/tasks/dto/tasks.dto";
import { task } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";

export const TaskData = {
	createTask: async ({ dbClient, values }: CreateTaskArgs) => {
		const taskCreated = await dbClient
			.insert(task)
			.values(values)
			.returning();

		return taskCreated;
	},
	getTaskByUser: async ({ userId, dbClient }: GetTaskArgs) => {
		const tasks = await dbClient
			.select()
			.from(task)
			.where(and(eq(task.user_id, userId), ne(task.task_isComplete, true)));
		// const tasks = await dbClient.select().from(task);

		return tasks;
	},
	updateTask: async ({ dbClient, task_id, values }: UpdateTaskArgs) => {
		const updatedData = await dbClient
			.update(task)
			.set(values)
			.where(eq(task.task_id, task_id))
			.returning();

		return updatedData;
	},
};
