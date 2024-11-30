import type { Request, Response, NextFunction } from "express";

const RATE_LIMIT = 50;
const RATE_WINDOW = 60 * 60 * 1000; 

const requests = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  req: Request,
  res: Response,
  next: NextFunction
): void | Promise<void> {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  
  const now = Date.now();
  const userRequests = requests.get(ip) || { count: 0, resetTime: now + RATE_WINDOW };

  if (now > userRequests.resetTime) {
    userRequests.count = 0;
    userRequests.resetTime = now + RATE_WINDOW;
  }

  userRequests.count++;
  requests.set(ip, userRequests);

  if (userRequests.count > RATE_LIMIT) {
    res.status(429).json({ message: "Too many requests" });
    return;
  }

  next();
} 