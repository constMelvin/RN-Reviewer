import { ScoreService } from "@/services/score.services";
import type { Context } from "hono";
import type { CreateScoreInput } from "./dto/scores.dto";

export const getScoreController = async (c: Context) => {
	const dbClient = c.get("dbClient");
	const user = c.get("user");

	const data = await ScoreService.getScore({ dbClient, userId: user.id });

	return c.json(data, 200);
};

export const createScoreController = async (
	c: Context,
	body: CreateScoreInput
) => {
	const dbClient = c.get("dbClient");
	const user = c.get("user");
	const values = {
		user_id: user.id,
		subject: body.subject,
		exam_type: body.exam_type,
		score: body.score,
		score_total: body.score_total,
	};
	const data = await ScoreService.create({
		dbClient,
		values,
	});

	return c.json(data[0], 201);
};
