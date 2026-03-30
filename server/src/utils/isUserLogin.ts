import { HonoEnv } from "@/@types/hono";
import { auth } from "@/lib/auth";
import { Context } from "hono";

export async function isUserLogin(c: Context<HonoEnv>, userId: string) {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	return !!session && session.user.id === userId;
}
