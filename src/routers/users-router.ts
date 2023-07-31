import { Router } from "express";
import { validateBody } from "@/middlewares";
import { createUserController } from "@/controllers";
import { userSchema } from "@/schemas";

export const usersRouter = Router();

//usersRouter.post("/", validateBody(userSchema), createUserController)