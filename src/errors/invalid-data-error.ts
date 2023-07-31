import { ApplicationError } from "@/protocols";

type ApplicationInvalidDataError = ApplicationError & {
    details: string[];
};

export function invalidDataError(details: string[]): ApplicationInvalidDataError {
    return ({
        name: "InvalidDataError",
        message: "Invalid data",
        details,
    });
};