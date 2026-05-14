import rateLimit from "express-rate-limit";

const json = (msg: string) => ({ error: msg });

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: json("Too many sign-in attempts from this IP. Please wait 15 minutes and try again."),
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: json("Too many accounts created from this IP. Please try again in an hour."),
});

export const enquiryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: json("You've submitted too many enquiries. Please wait a moment before trying again."),
});

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: json("Too many requests. Please slow down."),
});
