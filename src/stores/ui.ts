"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  theme: "light" | "dark" | "system";
  activeNotifications: number;
  commandPaletteOpen: boolean;
  aiWidgetOpen: boolean;
  notificationCenterOpen: boolean;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setActiveNotifications: (count: number) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setAiWidgetOpen: (open: boolean) => void;
  setNotificationCenterOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: "system",
      activeNotifications: 0,
      commandPaletteOpen: false,
      aiWidgetOpen: false,
      notificationCenterOpen: false,

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setTheme: (theme) => set({ theme }),

      setActiveNotifications: (count) => set({ activeNotifications: count }),

      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      setAiWidgetOpen: (open) => set({ aiWidgetOpen: open }),

      setNotificationCenterOpen: (open) => set({ notificationCenterOpen: open }),
    }),
    {
      name: "twinerp-ui",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
