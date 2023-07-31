import Joi from "joi";
import { singUpInData } from "@/protocols";

export const userSchema = Joi.object<singUpInData>({
    email: Joi.string().email().required(),
    password: Joi.string().min(10).required()
});
