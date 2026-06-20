import type {
  CreateScoreArgs,
  DeleteScoreArgs,
  EditScoreArgs,
  ScoreArgs,
} from "@/controllers/scores/dto/scores.dto";
import { ScoreData } from "@/data/score.data";
import { BadRequestError } from "@/utils/errors";

export const ScoreService = {
  getScore: async ({ dbClient, userId }: ScoreArgs) => {
    return ScoreData.getScore({ dbClient, userId });
  },
  create: async ({ dbClient, values }: CreateScoreArgs) => {
    if (
      !values.user_id ||
      !values.subject ||
      !values.exam_type ||
      !values.score ||
      !values.score_total
    )
      throw new BadRequestError("Input fields is required.");

    return ScoreData.create({ dbClient, values });
  },
  editScore: async ({ dbClient, values, id }: EditScoreArgs) => {
    return ScoreData.editScore({ dbClient, values, id });
  },
  deleteScore: async ({ dbClient, id }: DeleteScoreArgs) => {
    return ScoreData.deleteScore({ dbClient, id });
  },
};
