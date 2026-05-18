import type { Request, Response, NextFunction } from "express";
import { getUserById } from "../lib/usersStore.js";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const session = req.session as unknown as Record<string, unknown>;
  const userId = session["userId"] as number | undefined;

  if (!userId) {
    res.status(401).json({ error: "Authentication required. Please sign in." });
    return;
  }

  const user = getUserById(userId);
  if (!user) {
    req.session.destroy(() => {});
    res.status(401).json({ error: "Session invalid. Please sign in again." });
    return;
  }

  if (!user.isActive) {
    req.session.destroy(() => {});
    res.status(403).json({ error: "Your account has been deactivated. Please contact support." });
    return;
  }

  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const session = req.session as unknown as Record<string, unknown>;
  const userId = session["userId"] as number | undefined;

  if (!userId) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  const user = getUserById(userId);
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Admin access required." });
    return;
  }

  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const session = req.session as unknown as Record<string, unknown>;
    const userId = session["userId"] as number | undefined;

    if (!userId) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    const user = getUserById(userId);
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: `Access restricted to: ${roles.join(", ")}.` });
      return;
    }

    next();
  };
}
