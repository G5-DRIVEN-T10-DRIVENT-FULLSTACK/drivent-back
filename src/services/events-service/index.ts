import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event } from "@prisma/client";
import dayjs from "dayjs";
import redis, { DEFAULT_EXP } from "@/config/redis";

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const cacheKey = "FirstEvent";
  const cachedEvent = await redis.get(cacheKey);

  if (cachedEvent) return JSON.parse(cachedEvent);

  const event = await eventRepository.findFirst();
  if (!event) throw notFoundError();

  const cachedEventResult = exclude(event, "createdAt", "updatedAt");
  redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(cachedEventResult));

  return exclude(event, "createdAt", "updatedAt");
}

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function isCurrentEventActive(): Promise<boolean> {
  const cacheKey = "isCurrentEventActive";
  const cachedCurrentEventActive = await redis.get(cacheKey);

  if (cachedCurrentEventActive) return JSON.parse(cachedCurrentEventActive);

  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  const cachedCurrentEvent = now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
  redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(cachedCurrentEvent));

  return cachedCurrentEvent;
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
