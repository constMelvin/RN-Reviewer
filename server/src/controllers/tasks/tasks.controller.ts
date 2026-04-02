import type { Context } from "hono";
import {
	BadRequestError,
	ForbiddenError,
	InternalServerError,
	NotFoundError,
} from "@/utils/errors";
import { TaskService } from "@/services/task.services";
import {
	type CreateTaskInput,
	CreateValueSchema,
	type UpdateTaskInput,
} from "./dto/tasks.dto";
import { isUserLogin } from "@/utils/isUserLogin";

export const createTaskController = async (
	c: Context,
	body: CreateTaskInput
) => {
	try {
		const dbClient = c.get("dbClient");
		const user = c.get("user");
		const validation = CreateValueSchema.safeParse(body);
		if (!validation.success)
			throw new BadRequestError("No Input Task Found from the body.");

		console.log("C Line 28: " + isUserLogin(c, user.id));
		const values = {
			task_name: validation.data.task_name,
			task_date: validation.data.task_date,
			task_type: validation.data.task_type,
			task_link: validation.data.task_link,
			user_id: user.id,
		};

		const createTask = await TaskService.createHandler({
			dbClient,
			values,
		});

		return c.json(createTask[0], 201);
	} catch (error) {
		throw new InternalServerError(`error ${error}`);
	}
};

export const getAllTaskController = async (c: Context) => {
	const user = c.get("user");
	const dbClient = c.get("dbClient");

	const verifyUser = await isUserLogin(c, user.id);

	if (!verifyUser) throw new ForbiddenError("User not authenticated.");

	const tasks = await TaskService.getTaskHandler({
		userId: user.id,
		dbClient,
	});
	// const tasks = await TaskService.getTaskHandler({
	// 	userId: "user.id",
	// 	dbClient,
	// });

	if (!tasks)
		throw new NotFoundError(`No task found from userId: ${user.name}`);

	return c.json(tasks, 200);
};

export const updateTaskController = async (
	c: Context,
	values: UpdateTaskInput
) => {
	const dbClient = c.get("dbClient");
	const task_id = c.req.param("id");
	if (!task_id) throw new NotFoundError("Not found task_id params");

	const updatedData = await TaskService.updateTaskHandler({
		dbClient,
		task_id,
		values,
	});

	return c.json(updatedData[0], 200);
};
