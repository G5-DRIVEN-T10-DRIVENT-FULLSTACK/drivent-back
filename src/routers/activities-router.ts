import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { enrollInActivity, getActivitiesEnrollments, unEnrollInActivity, getActivitiesByDay } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .post("/:activityId", enrollInActivity)
  .get("/:activityId", getActivitiesEnrollments)
  .delete("/:activityId", unEnrollInActivity)
  .get("/day/:date", getActivitiesByDay);

export { activitiesRouter };
