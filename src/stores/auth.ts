"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Organization } from "@/types";

interface AuthState {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setOrganization: (org: Organization | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, organization: Organization) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      organization: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setOrganization: (organization) => set({ organization }),
      setLoading: (isLoading) => set({ isLoading }),

      login: (user, organization) =>
        set({ user, organization, isAuthenticated: true }),

      logout: async () => {
        set({ isLoading: true });
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } finally {
          set({ user: null, organization: null, isAuthenticated: false, isLoading: false });
          window.location.href = "/login";
        }
      },

      refreshUser: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/me");
          if (res.ok) {
            const data = await res.json();
            set({
              user: data.user,
              organization: data.organization,
              isAuthenticated: true,
            });
          } else {
            set({ user: null, organization: null, isAuthenticated: false });
          }
        } catch {
          // Network error — keep current state
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "twinerp-auth",
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
