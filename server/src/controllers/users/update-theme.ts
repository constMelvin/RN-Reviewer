import type { Context } from "hono";
import type { HonoEnv } from "@/@types/hono";
import { createDbClient } from "@/db/create-db-client";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";
import { BadRequestError, UnauthorizedError } from "@/utils/errors";
import { z } from "zod";

const VALID_THEMES = ["yellow", "sky", "violet", "rose", "emerald", "slate"] as const;

const UpdateThemeSchema = z.object({
	themeColor: z.enum(VALID_THEMES),
});

export const updateThemeController = async (c: Context<HonoEnv>) => {
	const sessionUser = c.get("user");
	if (!sessionUser?.id) throw new UnauthorizedError("Not authenticated.");

	const body = await c.req.json();
	const validation = UpdateThemeSchema.safeParse(body);

	if (!validation.success) {
		throw new BadRequestError(
			`Invalid theme. Valid options: ${VALID_THEMES.join(", ")}`
		);
	}

	const { themeColor } = validation.data;
	const db = createDbClient();

	const [updated] = await db
		.update(user)
		.set({ themeColor })
		.where(eq(user.id, sessionUser.id))
		.returning({ themeColor: user.themeColor });

	return c.json({ data: updated, message: "Theme updated successfully." }, 200);
};
