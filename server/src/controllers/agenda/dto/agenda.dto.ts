import type { DbClient } from "@/db/create-db-client";
import z from "zod";

export type GetTodayArgs = {
	dbClient: DbClient;
	userId: string;
};

export type CreateAgendaArgs = {
	dbClient: DbClient;
	userId: string;
	title: string;
};

export type MarkAgendaArgs = {
	dbClient: DbClient;
	userId: string;
	id: string;
};

export const CreateAgendaSchema = z.object({
	title: z.string().min(1),
	date: z.string(),
});

export const AgendaParamsSchema = z.object({
	id: z.string().uuid(),
});

export type CreateAgendaInput = z.infer<typeof CreateAgendaSchema>;
export type AgendaParams = z.infer<typeof AgendaParamsSchema>;
