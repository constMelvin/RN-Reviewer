import { Hono } from "hono";
import type { HonoEnv } from "@/@types/hono";
import { superAdminMiddleware } from "@/middlewares/super-admin-middleware";
import {
	getUsers,
	getUserDetail,
	getOnlineUsers,
	updateUserRole,
	deleteUser,
} from "@/services/admin/users.service";

export const adminUsersRoutes = new Hono<HonoEnv>()
	.use("*", superAdminMiddleware)

	// GET /admin/users?page=1&limit=20&search=&role=
	.get("/", async (c) => {
		const page = parseInt(c.req.query("page") || "1");
		const limit = parseInt(c.req.query("limit") || "20");
		const search = c.req.query("search") || undefined;
		const role = c.req.query("role") || undefined;
		const data = await getUsers(page, limit, search, role);
		return c.json(data);
	})

	// GET /admin/users/online
	.get("/online", async (c) => {
		const data = await getOnlineUsers();
		return c.json(data);
	})

	// GET /admin/users/:id
	.get("/:id", async (c) => {
		const id = c.req.param("id");
		const data = await getUserDetail(id);
		if (!data) {
			return c.json({ error: "User not found" }, 404);
		}
		return c.json(data);
	})

	// PATCH /admin/users/:id/role
	.patch("/:id/role", async (c) => {
		const id = c.req.param("id");
		const body = await c.req.json();
		const { role } = body;

		if (!role) {
			return c.json({ error: "Role is required" }, 400);
		}

		try {
			const updated = await updateUserRole(id, role);
			return c.json(updated);
		} catch (err: any) {
			return c.json({ error: err.message }, 400);
		}
	})

	// DELETE /admin/users/:id
	.delete("/:id", async (c) => {
		const id = c.req.param("id");
		const currentUser = c.get("user");

		// Prevent self-deletion
		if (id === currentUser.id) {
			return c.json({ error: "Cannot delete your own account" }, 400);
		}

		const deleted = await deleteUser(id);
		if (!deleted) {
			return c.json({ error: "User not found" }, 404);
		}
		return c.json({ message: "User deleted", user: deleted });
	});
