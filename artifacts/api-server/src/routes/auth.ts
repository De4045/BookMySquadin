import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import {
  users,
  getUserById,
  getUserByEmail,
  createUser,
  safeUser,
  isLockedOut,
  recordFailedAttempt,
  resetLoginAttempts,
  remainingAttempts,
  validatePasswordStrength,
  validateEmail,
} from "../lib/usersStore.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

const SALT_ROUNDS = 12;

router.post("/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email and password are required." });
    return;
  }

  const trimmedName = name.trim();
  const emailLower = email.toLowerCase().trim();

  if (!validateEmail(emailLower)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  if (trimmedName.length < 2 || trimmedName.length > 80) {
    res.status(400).json({ error: "Name must be between 2 and 80 characters." });
    return;
  }

  const pwdError = validatePasswordStrength(password);
  if (pwdError) {
    res.status(400).json({ error: pwdError });
    return;
  }

  if (getUserByEmail(emailLower)) {
    res.status(409).json({ error: "An account with this email already exists." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const assignedRole: "user" | "vendor" | "venue" =
    role === "vendor" ? "vendor" : role === "venue" ? "venue" : "user";

  const user = createUser({
    name: trimmedName,
    email: emailLower,
    passwordHash,
    role: assignedRole,
    createdAt: new Date().toISOString(),
    isActive: true,
  });

  const session = req.session as Record<string, unknown>;
  session["userId"] = user.id;

  req.log.info({ userId: user.id, role: assignedRole }, "New user registered");

  res.status(201).json(safeUser(user));
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const emailLower = email.toLowerCase().trim();

  const lockStatus = isLockedOut(emailLower);
  if (lockStatus.locked) {
    const minutes = Math.ceil((lockStatus.remainingMs ?? 0) / 60000);
    res.status(429).json({
      error: `Account temporarily locked due to too many failed attempts. Try again in ${minutes} minute${minutes !== 1 ? "s" : ""}.`,
    });
    return;
  }

  const user = getUserByEmail(emailLower);

  if (!user) {
    recordFailedAttempt(emailLower);
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    const { count, locked } = recordFailedAttempt(emailLower);
    const left = Math.max(0, 5 - count);
    if (locked) {
      res.status(429).json({
        error: "Too many failed attempts. Account locked for 15 minutes.",
      });
    } else {
      res.status(401).json({
        error: `Invalid email or password. ${left} attempt${left !== 1 ? "s" : ""} remaining before lockout.`,
      });
    }
    return;
  }

  if (!user.isActive) {
    res.status(403).json({ error: "Your account has been deactivated. Contact support." });
    return;
  }

  resetLoginAttempts(emailLower);

  const session = req.session as Record<string, unknown>;
  session["userId"] = user.id;

  req.log.info({ userId: user.id }, "User logged in");

  res.json(safeUser(user));
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.log.error({ err }, "Session destroy error");
      res.status(500).json({ error: "Logout failed." });
      return;
    }
    res.clearCookie("sid");
    res.json({ message: "Logged out successfully." });
  });
});

router.get("/auth/me", (req, res) => {
  const session = req.session as Record<string, unknown>;
  const userId = session["userId"] as number | undefined;

  if (!userId) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  const user = getUserById(userId);
  if (!user || !user.isActive) {
    res.status(401).json({ error: "Session invalid." });
    return;
  }

  res.json(safeUser(user));
});

router.get("/admin/users", requireAdmin, (_req, res) => {
  res.json({
    users: users.map(safeUser),
    total: users.length,
  });
});

router.get("/admin/stats", requireAdmin, (_req, res) => {
  const breakdown = {
    admins:    users.filter((u) => u.role === "admin").length,
    vendors:   users.filter((u) => u.role === "vendor").length,
    venues:    users.filter((u) => u.role === "venue").length,
    customers: users.filter((u) => u.role === "user").length,
  };
  res.json({
    totalUsers: users.length,
    breakdown,
    totalVenues: 436,
    totalVendors: 255,
    cities: 24,
  });
});

router.patch("/admin/users/:id/deactivate", requireAdmin, (req, res) => {
  const targetId = parseInt(String(req.params.id ?? ""), 10);
  const session = req.session as unknown as Record<string, unknown>;
  const adminId = session["userId"] as number;

  if (targetId === adminId) {
    res.status(400).json({ error: "Cannot deactivate your own account." });
    return;
  }

  const user = getUserById(targetId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  user.isActive = false;
  req.log.info({ adminId, targetId }, "User deactivated by admin");
  res.json({ message: `User ${user.name} deactivated.`, user: safeUser(user) });
});

router.patch("/admin/users/:id/activate", requireAdmin, (req, res) => {
  const targetId = parseInt(String(req.params.id ?? ""), 10);
  const user = getUserById(targetId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  user.isActive = true;
  const session = req.session as unknown as Record<string, unknown>;
  req.log.info({ adminId: session["userId"], targetId }, "User activated by admin");
  res.json({ message: `User ${user.name} activated.`, user: safeUser(user) });
});

export { requireAuth };
export default router;
