import app from "./index";
import { envConfig } from "./env";

const server = Bun.serve({
	fetch: app.fetch,
	port: envConfig.PORT,
});

console.log(`Server is running on http://localhost:${server.port}`);
