import { singInPost, signInGitHub } from "@/controllers";
import { validateBody } from "@/middlewares";
import { signInSchema } from "@/schemas";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter.post('/sign-in/github', signInGitHub);
authenticationRouter.post("/sign-in", validateBody(signInSchema), singInPost);

export { authenticationRouter };
