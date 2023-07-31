import express, { Express } from 'express';
import cors from 'cors';

import { loadEnv, connectDB, disconnectDB } from "@/config";

loadEnv();

import { handleApplicationErrors } from "@/middlewares";

//import { usersRouter } from "@/routers";

const app = express();

app
    .use(cors())
    .use(express.json())
    .get("/health", (_req, res) => res.send("Online!"))

export function init(): Promise<Express> {
    connectDB();
    return Promise.resolve(app);
}

export async function close(): Promise<void> {
    await disconnectDB();
}

export default app;
