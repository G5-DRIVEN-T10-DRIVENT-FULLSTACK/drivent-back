import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ObjectSchema } from "joi";
import { invalidDataError } from "@/errors";

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction);

function validate(schema: ObjectSchema, type: "body") {
    return ((req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req[type as keyof typeof req], {
            abortEarly: false
        });

        if (!error) {
            return next();
        }
        else {
            return res.status(httpStatus.BAD_REQUEST).send(invalidDataError(error.details.map((e) => e.message)));
        }
    });
}

export function validateBody<T>(schema: ObjectSchema<T>): ValidationMiddleware {
    return (validate(schema, "body"));
}