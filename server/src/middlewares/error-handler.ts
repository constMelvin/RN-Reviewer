

import type { Context } from "hono";
import { makeError } from "../utils/errors";

export async function errorHandlerMiddleware(err: Error, c: Context) {
	const { error, statusCode } = makeError(err);

	// pinoLogger.error(error.message, error);
	// const errorContextData = {
	//   context: JSON.stringify(c, null, 2),
	//   statusCode: statusCode,
	//   error: error,
	// };
	// sentryClient.captureException(err, { contexts: { data: errorContextData } });
	return c.json(error, { status: statusCode } as any);
}
