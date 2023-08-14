import { prisma } from "@/config";

async function enrollInActivity(userId: number, activityId: number) {
  return await prisma.enrollment.update({
    data: {
      Activity: {
        connect: {
          id: activityId
        }
      }
    },
    where: { userId }
  })
}

async function getActivitiesEnrollments(activityId: number) {
  return await prisma.activity.count({
    where: {
      id: activityId,
      Enrollment: {
        some: {}
      }
    }
  })
}

async function unEnrollInActivity(enrollmentId: number, activityId: number) {
  return await prisma.$queryRaw`
    DELETE FROM "_ActivityToEnrollment" WHERE "A" = ${activityId} AND "B" = ${enrollmentId}
  `;
}

const activityRepository = {
  enrollInActivity,
  getActivitiesEnrollments,
  unEnrollInActivity
}

export default activityRepository;