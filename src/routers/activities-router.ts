import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { enrollInActivity, getActivitiesEnrollments, unEnrollInActivity } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
    .all("/*", authenticateToken)
    .post("/:activityId", enrollInActivity)
    .get("/:activityId", getActivitiesEnrollments)
    .delete("/:activityId", unEnrollInActivity);

export { activitiesRouter };
