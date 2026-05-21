import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "vendor" | "venue" | "admin";
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role?: string) => Promise<User>;
  logout: () => Promise<void>;
}

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function parseJson<T>(response: Response): Promise<T | null> {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  }

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/auth/me`, { credentials: "include" });
      if (res.ok) {
        const data = (await parseJson<User>(res)) ?? null;
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = (await parseJson<{ error?: string }>(res)) ?? {
        error: res.statusText || "Login failed",
      };
      throw new Error(err.error ?? "Login failed");
    }
    const data = (await parseJson<User>(res)) as User;
    if (!data) {
      throw new Error("Login response was not valid JSON.");
    }
    setUser(data);
    return data;
  };

  const register = async (name: string, email: string, password: string, role = "user"): Promise<User> => {
    const res = await fetch(`${BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!res.ok) {
      const err = (await parseJson<{ error?: string }>(res)) ?? {
        error: res.statusText || "Registration failed",
      };
      throw new Error(err.error ?? "Registration failed");
    }
    const data = (await parseJson<User>(res)) as User;
    if (!data) {
      throw new Error("Registration response was not valid JSON.");
    }
    setUser(data);
    return data;
  };

  const logout = async () => {
    await fetch(`${BASE}/api/auth/logout`, { method: "POST", credentials: "include" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
