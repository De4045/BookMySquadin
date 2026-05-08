import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "vendor" | "admin";
  createdAt: string;
}

const SALT_ROUNDS = 12;

const users: User[] = [];

let nextId = 2;

(async () => {
  const creatorHash = await bcrypt.hash("DreamWedding@2025", SALT_ROUNDS);
  users.push({
    id: 1,
    name: "Dream Wedding Hub Admin",
    email: "admin@dreamweddinghub.com",
    passwordHash: creatorHash,
    role: "admin",
    createdAt: new Date().toISOString(),
  });
  logger.info("Creator account seeded");
})();

router.post("/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
    return;
  }

  const emailLower = email.toLowerCase().trim();

  if (users.find((u) => u.email === emailLower)) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user: User = {
    id: nextId++,
    name: name.trim(),
    email: emailLower,
    passwordHash,
    role: role === "vendor" ? "vendor" : "user",
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  const session = req.session as Record<string, unknown>;
  session["userId"] = user.id;

  req.log.info({ userId: user.id, email: emailLower }, "New user registered");

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const emailLower = email.toLowerCase().trim();
  const user = users.find((u) => u.email === emailLower);

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const session = req.session as Record<string, unknown>;
  session["userId"] = user.id;

  req.log.info({ userId: user.id }, "User logged in");

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.log.error({ err }, "Session destroy error");
      res.status(500).json({ error: "Logout failed" });
      return;
    }
    res.clearCookie("sid");
    res.json({ message: "Logged out successfully" });
  });
});

router.get("/auth/me", (req, res) => {
  const session = req.session as Record<string, unknown>;
  const userId = session["userId"] as number | undefined;

  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
});

export default router;
