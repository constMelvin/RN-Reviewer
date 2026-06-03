import { createDbClient } from "@/db/create-db-client";
import { auth } from "@/lib/auth";
import type { HonoEnv } from "@/@types/hono";
import { UnauthorizedError } from "@/utils/errors";
import type { Context, MiddlewareHandler, Next } from "hono";
import { isUserLogin } from "@/utils/isUserLogin";

export const authMiddleware: MiddlewareHandler = async (
	c: Context<HonoEnv>,
	next: Next
) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session || !session.user) {
		throw new UnauthorizedError("Unauthorized");
	}

	if (!(await isUserLogin(c, session.user.id)))
		throw new UnauthorizedError("User is not authenticated");

	const dbClient = createDbClient();

	c.set("session", session);
	c.set("user", session.user);
	c.set("dbClient", dbClient);

	await next();
};
