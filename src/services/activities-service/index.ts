import activityRepository from "@/repositories/activities-repository";
import enrollmentsService from "../enrollments-service";
import { notFoundError } from "@/errors";

async function enrollInActivity(userId: number, activityId: number) {
  return await activityRepository.enrollInActivity(userId, activityId);
}

async function getActivitiesEnrollments(activityId: number) {
  return await activityRepository.getActivitiesEnrollments(activityId);
}

async function unEnrollInActivity(userId: number, activityId: number) {
  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
  return await activityRepository.unEnrollInActivity(enrollment.id, activityId);
}

const activityService = {
  enrollInActivity,
  getActivitiesEnrollments,
  unEnrollInActivity
}

export default activityService;