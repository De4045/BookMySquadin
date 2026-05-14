import bcrypt from "bcryptjs";
import { logger } from "./logger.js";

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "vendor" | "venue" | "admin";
  createdAt: string;
  isActive: boolean;
  lastLoginAt?: string;
}

interface LoginAttempt {
  count: number;
  lockedUntil?: number;
  lastAttemptAt: number;
}

const SALT_ROUNDS = 12;
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export const users: User[] = [];
let nextId = 2;

const loginAttempts = new Map<string, LoginAttempt>();

(async () => {
  const adminHash = await bcrypt.hash("DreamWedding@2025", SALT_ROUNDS);
  users.push({
    id: 1,
    name: "Dream Wedding Hub Admin",
    email: "admin@dreamweddinghub.com",
    passwordHash: adminHash,
    role: "admin",
    createdAt: new Date().toISOString(),
    isActive: true,
  });
  logger.info("Admin account seeded");
})();

export function getUserById(id: number): User | undefined {
  return users.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email.toLowerCase().trim());
}

export function createUser(data: Omit<User, "id">): User {
  const user: User = { ...data, id: nextId++ };
  users.push(user);
  return user;
}

export function safeUser(u: User) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
  };
}

export function isLockedOut(email: string): { locked: boolean; remainingMs?: number } {
  const key = email.toLowerCase().trim();
  const attempt = loginAttempts.get(key);
  if (!attempt?.lockedUntil) return { locked: false };
  const remaining = attempt.lockedUntil - Date.now();
  if (remaining <= 0) {
    loginAttempts.set(key, { count: 0, lastAttemptAt: Date.now() });
    return { locked: false };
  }
  return { locked: true, remainingMs: remaining };
}

export function recordFailedAttempt(email: string): { count: number; locked: boolean } {
  const key = email.toLowerCase().trim();
  const existing = loginAttempts.get(key) ?? { count: 0, lastAttemptAt: Date.now() };
  const count = existing.count + 1;
  const locked = count >= MAX_ATTEMPTS;
  const lockedUntil = locked ? Date.now() + LOCKOUT_DURATION_MS : existing.lockedUntil;
  loginAttempts.set(key, { count, lockedUntil, lastAttemptAt: Date.now() });
  return { count, locked };
}

export function resetLoginAttempts(email: string): void {
  loginAttempts.delete(email.toLowerCase().trim());
}

export function remainingAttempts(email: string): number {
  const attempt = loginAttempts.get(email.toLowerCase().trim());
  if (!attempt) return MAX_ATTEMPTS;
  return Math.max(0, MAX_ATTEMPTS - attempt.count);
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{}|;:,.<>?/~`]).{8,}$/;
export function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/\d/.test(password)) return "Password must contain at least one number.";
  if (!PASSWORD_REGEX.test(password)) return "Password must contain at least one special character.";
  return null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}
