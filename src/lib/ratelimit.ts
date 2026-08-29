import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { ContactEnv } from "./contact-env";

/**
 * Three submissions per hour per hashed IP.
 *
 * Sliding window rather than fixed: a fixed window lets a bot send three at
 * 10:59 and three more at 11:00. `analytics` is off — it costs an extra Redis
 * command per call and the free tier's request budget is the constraint here.
 */

let limiter: Ratelimit | null = null;

export function getRatelimit(env: ContactEnv): Ratelimit {
  if (!limiter) {
    limiter = new Ratelimit({
      redis: new Redis({ url: env.upstashUrl, token: env.upstashToken }),
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "portfolio:contact",
      analytics: false,
    });
  }
  return limiter;
}
