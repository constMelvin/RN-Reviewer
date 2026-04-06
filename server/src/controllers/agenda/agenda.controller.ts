import { AgendaServices } from "@/services/agenda.services";
import { BadRequestError, ForbiddenError } from "@/utils/errors";
import { isUserLogin } from "@/utils/isUserLogin";
import type { Context } from "hono";
import {
	CreateAgendaSchema,
	type AgendaParams,
	type CreateAgendaInput,
} from "./dto/agenda.dto";

export const getAgendaController = async (c: Context) => {
	const user = c.get("user");
	const dbClient = c.get("dbClient");
	const verified = await isUserLogin(c, user.id);

	if (!verified) throw new ForbiddenError("User not authenticated");
	const data = await AgendaServices.getToday({ dbClient, userId: user.id });
	return c.json(data, 200);
};

export const getMissedController = async (c: Context) => {
	const user = c.get("user");
	const dbClient = c.get("dbClient");
	const verified = await isUserLogin(c, user.id);

	if (!verified) throw new ForbiddenError("User not authenticated");
	const data = await AgendaServices.getMissed({ dbClient, userId: user.id });
	return c.json(data, 200);
};

export const createAgendaController = async (
	c: Context,
	body: CreateAgendaInput
) => {
	const user = c.get("user");
	const dbClient = c.get("dbClient");
	const verified = await isUserLogin(c, user.id);
	if (!verified) throw new ForbiddenError("User not authenticated.");
	const data = await AgendaServices.create({
		dbClient,
		userId: user.id,
		title: body.title,
	});
	return c.json(data[0], 201);
};

export const markDoneController = async (c: Context, params: AgendaParams) => {
	const user = c.get("user");
	const dbClient = c.get("dbClient");
	const verified = await isUserLogin(c, user.id);
	if (!verified) throw new ForbiddenError("User not authenticated.");
	const data = await AgendaServices.markDone({
		dbClient,
		id: params.id,
		userId: user.id,
	});
	return c.json(data[0], 200);
};
