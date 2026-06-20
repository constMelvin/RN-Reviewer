import type {
  CreateScoreArgs,
  DeleteScoreArgs,
  EditScoreArgs,
  ScoreArgs,
} from "@/controllers/scores/dto/scores.dto";
import { scores } from "@/db/schema";
import { eq } from "drizzle-orm";

export const ScoreData = {
  getScore: async ({ dbClient, userId }: ScoreArgs) => {
    return dbClient.select().from(scores).where(eq(scores.user_id, userId));
  },
  create: async ({ dbClient, values }: CreateScoreArgs) => {
    return dbClient.insert(scores).values(values).returning();
  },
  editScore: async ({ dbClient, values, id }: EditScoreArgs) => {
    return dbClient
      .update(scores)
      .set(values)
      .where(eq(scores.score_id, id))
      .returning();
  },
  deleteScore: async ({ dbClient, id }: DeleteScoreArgs) => {
    return dbClient.delete(scores).where(eq(scores.score_id, id)).returning();
  },
};
