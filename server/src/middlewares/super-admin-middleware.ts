import type { HonoEnv } from "@/@types/hono";
import { ForbiddenError, UnauthorizedError } from "@/utils/errors";
import { auth } from "@/lib/auth";
import { createDbClient } from "@/db/create-db-client";
import { isUserLogin } from "@/utils/isUserLogin";
import type { Context, MiddlewareHandler, Next } from "hono";

export const superAdminMiddleware: MiddlewareHandler = async (
	c: Context<HonoEnv>,
	next: Next
) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session || !session.user) {
		throw new UnauthorizedError("Unauthorized to access this route!");
	}

	if (!(await isUserLogin(c, session.user.id)))
		throw new UnauthorizedError("User is not authenticated");

	// Check super admin role
	const dbClient = createDbClient();
	const { user: userTable } = await import("@/db/schema");
	const { eq } = await import("drizzle-orm");

	const [dbUser] = await dbClient
		.select({ role: userTable.role })
		.from(userTable)
		.where(eq(userTable.id, session.user.id))
		.limit(1);

	if (!dbUser || dbUser.role !== "super_admin") {
		throw new ForbiddenError("Access denied. Super Admin privileges required.");
	}

	c.set("session", session);
	c.set("user", session.user);
	c.set("dbClient", dbClient);

	await next();
};
