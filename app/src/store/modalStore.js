import { create } from "zustand";

export const useModalStore = create((set) => ({
  isOpen: false,
  children: null,
  openModal: (children) => set({ isOpen: true, children }),
  closeModal: () => set({ isOpen: false, children: null }),
}));