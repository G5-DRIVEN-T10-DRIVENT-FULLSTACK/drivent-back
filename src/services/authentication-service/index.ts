import sessionRepository from "@/repositories/session-repository";
import userRepository from "@/repositories/user-repository";
import { exclude } from "@/utils/prisma-utils";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { invalidCredentialsError } from "./errors";
import { v4 as uuidv4 } from 'uuid';
import userService from '../users-service';

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, "password"),
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<User, "email" | "password">;

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
};

type GetUserOrFailResult = Pick<User, "id" | "email" | "password">;

async function checkIfUserExists(login: string): Promise<SignInResult> {
  const gitHubEmail = login + '@github.com';
  const userExists = await userRepository.findByEmail(gitHubEmail);

  if (!userExists) {
    const password = uuidv4();
    await userService.createUser({ email: gitHubEmail, password });
  }

  const user = await userRepository.findByEmail(gitHubEmail);
  const token = await createSession(user.id);

  return {
    user: exclude(user, 'password'),
    token,
  };
}

const authenticationService = {
  signIn,
  checkIfUserExists,
};

export default authenticationService;
export * from "./errors";
