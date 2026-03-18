"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import crypto from "crypto";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const loginMutation = useMutation(api.auth.login);
  const logoutMutation = useMutation(api.auth.logout);

  const userQuery = useQuery(
    api.auth.getCurrentUser,
    sessionId ? { sessionId } : "skip"
  );

  const storedSessionId = typeof window !== "undefined" ? sessionStorage.getItem("sessionId") : null;
  
  useEffect(() => {
    if (storedSessionId && !sessionId) {
      setSessionId(storedSessionId);
    }
  }, [storedSessionId, sessionId]);

  useEffect(() => {
    if (userQuery !== undefined) {
      setUser(userQuery);
      setIsLoading(false);
    }
  }, [userQuery]);

  const login = async (email: string, password: string) => {
    const passwordHash = hashPassword(password);
    const result = await loginMutation({ email, passwordHash });
    sessionStorage.setItem("sessionId", result.sessionId);
    setSessionId(result.sessionId);
    setUser(result.user);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
    } catch (error) {
      console.error("Logout API error:", error);
    }
    sessionStorage.removeItem("sessionId");
    setUser(null);
    setSessionId(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}