import { Redis } from "@upstash/redis";

// Upstash Redis client — uses REST API, works in Edge + serverless environments
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
