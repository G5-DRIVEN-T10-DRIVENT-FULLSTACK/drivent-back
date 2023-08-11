import { prisma } from "@/config";

async function findFirst() {
  return prisma.event.findFirst({
    include: {
      ActivityPlace: {
        include: {
          Activity: {
            include: {
              ActivityPlace: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }
    }
  });
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
