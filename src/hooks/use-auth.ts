"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import type { LoginCredentials } from "@/types";

export function useAuth() {
  const router = useRouter();
  const {
    user,
    organization,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  } = useAuthStore();

  const signIn = useCallback(
    async (credentials: LoginCredentials) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data.user, data.organization);
      router.push("/dashboard");
      return data;
    },
    [login, router]
  );

  const signOut = useCallback(async () => {
    await logout();
  }, [logout]);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      if (user.role === "OWNER" || user.role === "ADMIN") return true;
      if (user.permissions && typeof user.permissions === "object") {
        return !!(user.permissions as Record<string, boolean>)[permission];
      }
      return false;
    },
    [user]
  );

  return {
    user,
    organization,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    refreshUser,
    hasPermission,
  };
}
