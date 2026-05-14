import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "vendor" | "venue" | "admin";
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

  const allowedRoles: User["role"][] = ["vendor", "venue", "user"];
  const assignedRole: User["role"] =
    role === "vendor" ? "vendor"
    : role === "venue" ? "venue"
    : "user";

  const user: User = {
    id: nextId++,
    name: name.trim(),
    email: emailLower,
    passwordHash,
    role: allowedRoles.includes(assignedRole) ? assignedRole : "user",
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

// Admin: list all users
router.get("/admin/users", (req, res) => {
  const session = req.session as Record<string, unknown>;
  const userId = session["userId"] as number | undefined;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const me = users.find(u => u.id === userId);
  if (!me || me.role !== "admin") { res.status(403).json({ error: "Admin access required" }); return; }

  res.json({
    users: users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    })),
    total: users.length,
  });
});

// Admin: aggregate stats
router.get("/admin/stats", (req, res) => {
  const session = req.session as Record<string, unknown>;
  const userId = session["userId"] as number | undefined;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const me = users.find(u => u.id === userId);
  if (!me || me.role !== "admin") { res.status(403).json({ error: "Admin access required" }); return; }

  const breakdown = {
    admins:  users.filter(u => u.role === "admin").length,
    vendors: users.filter(u => u.role === "vendor").length,
    venues:  users.filter(u => u.role === "venue").length,
    customers: users.filter(u => u.role === "user").length,
  };

  res.json({
    totalUsers: users.length,
    breakdown,
    totalVenues: 436,
    totalVendors: 255,
    cities: 24,
  });
});

export default router;
