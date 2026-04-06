import type {
	CreateTaskArgs,
	GetTaskArgs,
	UpdateTaskArgs,
} from "@/controllers/tasks/dto/tasks.dto";
import { TaskData } from "@/data/tasks/task.data";

export const TaskService = {
	createHandler: async ({ dbClient, values }: CreateTaskArgs) => {
		return await TaskData.createTask({ dbClient, values });
	},
	getTaskHandler: async ({ userId, dbClient }: GetTaskArgs) => {
		return await TaskData.getTaskByUser({ userId, dbClient });
	},
	updateTaskHandler: async ({
		dbClient,
		task_id,
		values,
	}: UpdateTaskArgs) => {
		return await TaskData.updateTask({ dbClient, task_id, values });
	},
};
