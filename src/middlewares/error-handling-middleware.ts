import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ApplicationError } from "@/protocols";

export function handleApplicationErrors(
    err: ApplicationError | Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    console.log(err.name);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "InternalServerError",
        message: "Internal Server Error"
    });
}