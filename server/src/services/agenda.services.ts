import type {
	CreateAgendaArgs,
	GetTodayArgs,
	MarkAgendaArgs,
} from "@/controllers/agenda/dto/agenda.dto";
import { AgendaData } from "@/data/agenda/agenda.data";

export const AgendaServices = {
	getToday: async ({ dbClient, userId }: GetTodayArgs) => {
		return AgendaData.getToday({ dbClient, userId });
	},
	getMissed: async ({ dbClient, userId }: GetTodayArgs) => {
		return AgendaData.getMissed({ dbClient, userId });
	},
	create: async ({ dbClient, title, userId }: CreateAgendaArgs) => {
		return AgendaData.create({ dbClient, title, userId });
	},
	markDone: async ({ dbClient, id, userId }: MarkAgendaArgs) => {
		return AgendaData.markDone({ dbClient, id, userId });
	},
};
