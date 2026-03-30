
import { auth } from "@/lib/auth";
import type { Context } from "hono";

export const signOutUser = async (c: Context) => {
	try {
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});
		console.log(session);
		await auth.api.signOut({
			headers: c.req.raw.headers,
		});
		return c.json({ message: "Success!" });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Something went wrong!";
		return c.json({ message }, 500);
	}
};
