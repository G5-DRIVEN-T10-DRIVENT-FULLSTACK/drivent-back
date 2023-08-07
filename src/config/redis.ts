import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL
});

(async () => {
  console.log("connecting redis...");
  await redis.connect();
})();

export const DEFAULT_EXP = 30; // seconds
export default redis;