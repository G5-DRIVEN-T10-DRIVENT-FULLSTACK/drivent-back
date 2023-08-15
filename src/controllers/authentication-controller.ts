import authenticationService, { SignInParams } from "@/services/authentication-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import axios from 'axios';
import { unauthorizedError } from '@/errors';

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

export async function signInGitHub(req: Request, res: Response) {
  try {
    const token = await exchangeCodeForAccessToken(req.body.code);
    const user = await fetchUser(token);
    const result = await authenticationService.checkIfUserExists(user.login);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

async function exchangeCodeForAccessToken(code: string) {
  const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';

  const { REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

  const body = {
    code,
    grant_type: 'authorization_code',
    redirect_url: REDIRECT_URL,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };

  const { data } = await axios.post(GITHUB_ACCESS_TOKEN_URL, body, {
    headers: {
      Content_type: 'application/json',
    },
  });

  const token = data.split('&')[0].split('=')[1];
  return token;
}

async function fetchUser(token: string) {
  try {
    const { data: user } = await axios.get('http://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return user;
  } catch (error) {
    throw unauthorizedError();
  }
}

