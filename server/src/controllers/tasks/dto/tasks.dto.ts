import type { DbClient } from "@/db/create-db-client";
import type { task } from "@/db/schema";
import type { InferInsertModel } from "drizzle-orm";
import z from "zod";

export const CreateValueSchema = z.object({
  task_name: z.string().min(1, "Task name is required"),
  task_date: z.string().min(1, "Task date is required"),
  task_type: z.string().min(1, "Task type is required"),
  task_link: z.string().min(1, "Task link is required"),
  task_isComplete: z.boolean(),
});
export const UpdateValueSchema = z.object({
  task_name: z.string().min(1, "Task name is required"),
  task_date: z.string().min(1, "Task date is required"),
  task_type: z.string().min(1, "Task type is required"),
  task_link: z.string().min(1, "Task link is required"),
  task_isComplete: z.boolean("Task is complete is required"),
});

export type CreateTaskArgs = {
  dbClient: DbClient;
  values: CreateTaskInput;
};
export type GetTaskArgs = {
  userId: string;
  dbClient: DbClient;
};
export type UpdateTaskArgs = {
  dbClient: DbClient;
  task_id: string;
  values: UpdateTaskInput;
};

export type DeleteTaskArgs = {
  dbClient: DbClient;
  task_id: string;
};

export type CreateTaskInput = Omit<
  InferInsertModel<typeof task>,
  "task_id" | "created_at" | "updated_at"
>;
export type UpdateTaskInput = z.infer<typeof UpdateValueSchema>;
