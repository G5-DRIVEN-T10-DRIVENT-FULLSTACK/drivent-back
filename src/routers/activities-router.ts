import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { enrollInActivity, getActivitiesEnrollments, getActivitiesByDay, unEnrollInActivity } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
    .all("/*", authenticateToken)
    .post("/:activityId", enrollInActivity)
    .get("/:activityId", getActivitiesEnrollments)
    .get("/day/:date", getActivitiesByDay)
    .delete("/:activityId", unEnrollInActivity);

export { activitiesRouter };
