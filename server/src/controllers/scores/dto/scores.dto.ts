import type { DbClient } from "@/db/create-db-client";
import type { scores } from "@/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";

export const CreateScoreSchema = z.object({
  exam_type: z.string().min(1),
  subject: z.string().min(1),
  score: z.number().min(1).optional(),
  score_total: z.number().min(1).optional(),
});
export const EditScoreSchema = z.object({
  score_id: z.string().uuid(),
  exam_type: z.string().min(1),
  subject: z.string().min(1),
  score: z.number().min(1).optional(),
  score_total: z.number().min(1).optional(),
});

export type ScoreArgs = {
  dbClient: DbClient;
  userId: string;
};

export type CreateScoreArgs = {
  dbClient: DbClient;
  values: InferInsertModel<typeof scores>;
};

export type EditScoreArgs = {
  dbClient: DbClient;
  values: Partial<z.infer<typeof EditScoreSchema>>;
  id: string;
};

export type DeleteScoreArgs = {
  dbClient: DbClient;
  id: string;
};

export type CreateScoreInput = z.infer<typeof CreateScoreSchema>;
export type EditScoreInput = z.infer<typeof EditScoreSchema>;
export type Score = InferSelectModel<typeof scores>;
