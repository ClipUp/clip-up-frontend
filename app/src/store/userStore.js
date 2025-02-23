import { create } from "zustand";
import { devtools } from 'zustand/middleware';

export const useAuthStore = create(
  devtools(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      logout: () => set({ accessToken: null }),
    })
  )
);
