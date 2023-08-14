import { prisma } from "@/config";
import redis from '@/config/redis';

async function findFirst() {
  const eventRedis = await redis.get('event');

  if (eventRedis) {
    return JSON.parse(eventRedis);
  }

  const value = await prisma.event.findFirst({
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
  await redis.set('event', JSON.stringify(value));
  return value;
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
