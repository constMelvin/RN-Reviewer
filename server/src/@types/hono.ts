
import { DbClient } from "@/db/create-db-client";
import type { Session } from "./auth";

export type HonoEnv = {
	Variables: {
		session: Session;
		user: any;
		dbClient: DbClient;
	};
};
