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
  });
}

async function getActivitiesEnrollments(activityId: number) {
  return await prisma.activity.count({
    where: {
      id: activityId,
      Enrollment: {
        some: {}
      }
    }
  });
}

async function unEnrollInActivity(enrollmentId: number, activityId: number) {
  return await prisma.$queryRaw`
    DELETE FROM "_ActivityToEnrollment" WHERE "A" = ${activityId} AND "B" = ${enrollmentId}
  `;
}

async function activitiesByDay(date: any) {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);
  const activities = await prisma.activity.findMany({
    where: {
      startTime: {
        gte: startOfDay,
        lte: endOfDay
      }
    }, 
    orderBy: {
      startTime: "asc"
    }
  });

  return activities;
}

const activityRepository = {
  enrollInActivity,
  getActivitiesEnrollments,
  unEnrollInActivity,
  activitiesByDay
};

export default activityRepository;
