import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import {
  getUserById,
  getUserByEmail,
  getAllUsers,
  createUser,
  updateUser,
  safeUser,
  isLockedOut,
  recordFailedAttempt,
  resetLoginAttempts,
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
    res
      .status(400)
      .json({ error: "Name must be between 2 and 80 characters." });
    return;
  }

  const pwdError = validatePasswordStrength(password);
  if (pwdError) {
    res.status(400).json({ error: pwdError });
    return;
  }

  if (await getUserByEmail(emailLower)) {
    res
      .status(409)
      .json({ error: "An account with this email already exists." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const assignedRole: "user" | "vendor" | "venue" =
    role === "vendor" ? "vendor" : role === "venue" ? "venue" : "user";

  const user = await createUser({
    name: trimmedName,
    email: emailLower,
    passwordHash,
    role: assignedRole,
  });

  const session = req.session as unknown as Record<string, unknown>;
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

  const user = await getUserByEmail(emailLower);

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
    res
      .status(403)
      .json({
        error: "Your account has been deactivated. Contact support.",
      });
    return;
  }

  resetLoginAttempts(emailLower);

  const session = req.session as unknown as Record<string, unknown>;
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

router.get("/auth/me", async (req, res) => {
  const session = req.session as unknown as Record<string, unknown>;
  const userId = session["userId"] as number | undefined;

  if (!userId) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  const user = await getUserById(userId);
  if (!user || !user.isActive) {
    res.status(401).json({ error: "Session invalid." });
    return;
  }

  res.json(safeUser(user));
});

router.get("/admin/users", requireAdmin, async (_req, res) => {
  const all = await getAllUsers();
  res.json({ users: all.map(safeUser), total: all.length });
});

router.get("/admin/stats", requireAdmin, async (_req, res) => {
  const all = await getAllUsers();
  const breakdown = {
    admins:    all.filter((u) => u.role === "admin").length,
    vendors:   all.filter((u) => u.role === "vendor").length,
    venues:    all.filter((u) => u.role === "venue").length,
    customers: all.filter((u) => u.role === "user").length,
  };
  res.json({
    totalUsers:    all.length,
    breakdown,
    totalVenues:   436,
    totalVendors:  255,
    cities:        24,
  });
});

router.patch("/admin/users/:id/deactivate", requireAdmin, async (req, res) => {
  const targetId = parseInt(String(req.params["id"] ?? ""), 10);
  const session = req.session as unknown as Record<string, unknown>;
  const adminId = session["userId"] as number;

  if (targetId === adminId) {
    res.status(400).json({ error: "Cannot deactivate your own account." });
    return;
  }

  const user = await getUserById(targetId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  await updateUser(targetId, { isActive: false });
  req.log.info({ adminId, targetId }, "User deactivated by admin");
  res.json({
    message: `User ${user.name} deactivated.`,
    user: safeUser({ ...user, isActive: false }),
  });
});

router.patch("/admin/users/:id/activate", requireAdmin, async (req, res) => {
  const targetId = parseInt(String(req.params["id"] ?? ""), 10);
  const user = await getUserById(targetId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  await updateUser(targetId, { isActive: true });
  const session = req.session as unknown as Record<string, unknown>;
  req.log.info(
    { adminId: session["userId"], targetId },
    "User activated by admin",
  );
  res.json({
    message: `User ${user.name} activated.`,
    user: safeUser({ ...user, isActive: true }),
  });
});

router.patch("/auth/profile", requireAuth, async (req, res) => {
  const session = req.session as unknown as Record<string, unknown>;
  const userId = session["userId"] as number;
  const user = await getUserById(userId);
  if (!user) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  const { name, phone, city, bio } = req.body as {
    name?: string;
    phone?: string;
    city?: string;
    bio?: string;
  };

  const fields: Parameters<typeof updateUser>[1] = {};

  if (name !== undefined) {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 80) {
      res.status(400).json({ error: "Name must be 2–80 characters." });
      return;
    }
    fields.name = trimmed;
  }
  if (phone !== undefined) fields.phone = String(phone).trim().slice(0, 20);
  if (city !== undefined) fields.city = String(city).trim().slice(0, 60);
  if (bio !== undefined) fields.bio = String(bio).trim().slice(0, 500);

  const updated = await updateUser(userId, fields);
  req.log.info({ userId }, "User profile updated");
  res.json(safeUser(updated ?? { ...user, ...fields }));
});

export { requireAuth };
export default router;
