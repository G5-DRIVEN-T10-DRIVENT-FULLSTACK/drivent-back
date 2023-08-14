import { AuthenticatedRequest } from "@/middlewares";
import activityService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function enrollInActivity(req: AuthenticatedRequest, res: Response) {
  const activityId = Number(req.params.activityId);
  const { userId } = req;

  try {
    await activityService.enrollInActivity(userId, activityId);
    res.sendStatus(httpStatus.CREATED);
  } catch (err) {
    console.log(err);
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getActivitiesEnrollments(req: AuthenticatedRequest, res: Response) {
  const activityId = Number(req.params.activityId);

  try {
    const activityEnrollments = await activityService.getActivitiesEnrollments(activityId);
    res.send({ activityEnrollments });
  } catch (err) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function unEnrollInActivity(req: AuthenticatedRequest, res: Response) {
  const activityId = Number(req.params.activityId);
  const { userId } = req;

  try {
    await activityService.unEnrollInActivity(userId, activityId);
    res.sendStatus(httpStatus.OK);
  } catch (err) {
    console.log(err);
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}