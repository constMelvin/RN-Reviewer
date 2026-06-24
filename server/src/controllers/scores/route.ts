import { authMiddleware } from "@/middlewares/auth-middleware";
import { Hono } from "hono";
import {
  createScoreController,
  deleteScoreController,
  editScoreController,
  getScoreController,
} from "./scores.controller";
import { zValidator } from "@hono/zod-validator";
import { CreateScoreSchema, EditScoreSchema } from "./dto/scores.dto";
import { BadRequestError } from "@/utils/errors";

export const scoreRoutes = new Hono()
  .use("*", authMiddleware)
  .get("/", getScoreController)
  .post(
    "/",
    zValidator("json", CreateScoreSchema, (res) => {
      if (!res.success)
        throw new BadRequestError("Error on Routes: Input Fields is Required.");
    }),
    (c) => createScoreController(c, c.req.valid("json")),
  )
  .put(
    "/",
    zValidator("json", EditScoreSchema, (res) => {
      if (!res.success)
        throw new BadRequestError("Error on Routes: Input Fields is Required.");
    }),
    (c) => editScoreController(c, c.req.valid("json")),
  )
  .delete("/:id", (c) => deleteScoreController(c));
