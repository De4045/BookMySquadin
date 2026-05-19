import bcrypt from "bcryptjs";
import { logger } from "./logger.js";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export type User = typeof usersTable.$inferSelect;

const SALT_ROUNDS = 12;
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

interface LoginAttempt {
  count: number;
  lockedUntil?: number;
  lastAttemptAt: number;
}

const loginAttempts = new Map<string, LoginAttempt>();

// ─── DB helpers ─────────────────────────────────────────────────────────────

export async function getUserById(id: number): Promise<User | undefined> {
  const rows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  return rows[0];
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const rows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase().trim()))
    .limit(1);
  return rows[0];
}

export async function getAllUsers(): Promise<User[]> {
  return db.select().from(usersTable);
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "vendor" | "venue" | "admin";
  phone?: string;
  city?: string;
  bio?: string;
  isActive?: boolean;
}): Promise<User> {
  const rows = await db
    .insert(usersTable)
    .values({
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      role: data.role,
      phone: data.phone,
      city: data.city,
      bio: data.bio,
      isActive: data.isActive ?? true,
    })
    .returning();
  return rows[0]!;
}

export async function updateUser(
  id: number,
  fields: Partial<{
    name: string;
    phone: string | null;
    city: string | null;
    bio: string | null;
    isActive: boolean;
    lastLoginAt: Date;
  }>,
): Promise<User | undefined> {
  const rows = await db
    .update(usersTable)
    .set(fields)
    .where(eq(usersTable.id, id))
    .returning();
  return rows[0];
}

export function safeUser(u: User) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    phone: u.phone,
    city: u.city,
    bio: u.bio,
  };
}

// ─── Rate limiting (in-memory, ephemeral) ───────────────────────────────────

export function isLockedOut(
  email: string,
): { locked: boolean; remainingMs?: number } {
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

export function recordFailedAttempt(
  email: string,
): { count: number; locked: boolean } {
  const key = email.toLowerCase().trim();
  const existing = loginAttempts.get(key) ?? {
    count: 0,
    lastAttemptAt: Date.now(),
  };
  const count = existing.count + 1;
  const locked = count >= MAX_ATTEMPTS;
  const lockedUntil = locked
    ? Date.now() + LOCKOUT_DURATION_MS
    : existing.lockedUntil;
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

// ─── Validation ─────────────────────────────────────────────────────────────

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{}|;:,.<>?/~`]).{8,}$/;

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter.";
  if (!/\d/.test(password))
    return "Password must contain at least one number.";
  if (!PASSWORD_REGEX.test(password))
    return "Password must contain at least one special character.";
  return null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

// ─── Seed ───────────────────────────────────────────────────────────────────

export async function seedUsers(): Promise<void> {
  const [adminHash, vendorHash, customerHash] = await Promise.all([
    bcrypt.hash("Infinity@123", SALT_ROUNDS),
    bcrypt.hash("Vendor@2025!", SALT_ROUNDS),
    bcrypt.hash("Customer@2025!", SALT_ROUNDS),
  ]);

  // Upsert demo/seed accounts — admin password is always forced to latest value
  await db
    .insert(usersTable)
    .values([
      {
        name: "Book My Squad Admin",
        email: "bookmysquad0@gmail.com",
        passwordHash: adminHash,
        role: "admin",
        isActive: true,
      },
      {
        name: "Royal Photography Studio",
        email: "vendor@bookmysquad.in",
        passwordHash: vendorHash,
        role: "vendor",
        isActive: true,
        phone: "+91 98765 43210",
        city: "Mumbai",
        bio: "Premium wedding photography & cinematography. Serving couples across India since 2018. Specialising in candid moments, cinematic films and fine-art albums.",
      },
      {
        name: "Anjali Mehta",
        email: "customer@bookmysquad.in",
        passwordHash: customerHash,
        role: "user",
        isActive: true,
        phone: "+91 87654 32109",
        city: "Delhi",
      },
    ])
    .onConflictDoUpdate({
      target: usersTable.email,
      set: { passwordHash: adminHash },
    });

  // Force-update the admin password in case the row already existed
  await db
    .update(usersTable)
    .set({ passwordHash: adminHash })
    .where(eq(usersTable.email, "bookmysquad0@gmail.com"));

  // Remove old admin seed email if it still exists (idempotent migration)
  await db
    .delete(usersTable)
    .where(eq(usersTable.email, "admin@dreamweddinghub.com"));

  logger.info(
    "Seed: bookmysquad0@gmail.com / Infinity@123 | vendor@bookmysquad.in / Vendor@2025! | customer@bookmysquad.in / Customer@2025!",
  );
}
