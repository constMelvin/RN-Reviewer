import type {
	CreateAgendaArgs,
	GetTodayArgs,
	MarkAgendaArgs,
} from "@/controllers/agenda/dto/agenda.dto";
import { daily_agenda } from "@/db/schema";
import { format } from "date-fns";
import { and, eq } from "drizzle-orm";

const TODAY = () => format(new Date(), "yyyy-MM-dd");
const YESTERDAY = () => format(new Date(Date.now() - 86400000), "yyyy-MM-dd");

export const AgendaData = {
	getToday: async ({ dbClient, userId }: GetTodayArgs) => {
		return dbClient
			.select()
			.from(daily_agenda)
			.where(
				and(
					eq(daily_agenda.user_id, userId),
					eq(daily_agenda.date, TODAY())
				)
			);
	},
	getMissed: async ({ dbClient, userId }: GetTodayArgs) => {
		return dbClient
			.select()
			.from(daily_agenda)
			.where(
				and(
					eq(daily_agenda.user_id, userId),
					eq(daily_agenda.date, YESTERDAY()),
					eq(daily_agenda.is_done, false)
				)
			);
	},
	create: async ({ dbClient, userId, title }: CreateAgendaArgs) => {
		return dbClient
			.insert(daily_agenda)
			.values({ user_id: userId, title, date: TODAY() })
			.returning();
	},
	markDone: async ({ dbClient, id, userId }: MarkAgendaArgs) => {
		return dbClient
			.update(daily_agenda)
			.set({ is_done: true })
			.where(
				and(eq(daily_agenda.id, id), eq(daily_agenda.user_id, userId))
			)
			.returning();
	},
};
