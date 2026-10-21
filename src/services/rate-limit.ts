import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, } from "astro:env/server";
import { Ratelimit } from "@upstash/ratelimit"; 
import { Redis } from "@upstash/redis";
import { RATE_LIMIT } from "@/constants/contact";
  
const redis = new Redis({
    url:   UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
  })

// Create a new ratelimiter, that allows 3 requests per 10 minutes
export const contactRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT.requests, RATE_LIMIT.window),
    analytics: false,
    prefix: "ratelimit:contact",
  });