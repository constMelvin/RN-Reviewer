import type { Context } from "hono";
import type { HonoEnv } from "@/@types/hono";
import { createDbClient } from "@/db/create-db-client";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";
import { UnauthorizedError } from "@/utils/errors";

export const getProfileController = async (c: Context<HonoEnv>) => {
	const sessionUser = c.get("user");
	if (!sessionUser?.id) throw new UnauthorizedError("Not authenticated.");

	const db = createDbClient();
	const [profile] = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			username: user.username,
			displayUsername: user.displayUsername,
			image: user.image,
			themeColor: user.themeColor,
		})
		.from(user)
		.where(eq(user.id, sessionUser.id))
		.limit(1);

	if (!profile) throw new UnauthorizedError("User not found.");

	return c.json(profile, 200);
};
