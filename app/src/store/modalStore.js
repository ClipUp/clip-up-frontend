import { create } from "zustand";

const useModalStore = create((set) => ({
  isOpen: false,
  children: null,
  openModal: (children) => set({ isOpen: true, children }),
  closeModal: () => set({ isOpen: false, children: null }),
}));


const useContextMenuStore = create((set) => ({
  contextMenu: {
    isOpen: false,
    position: { x: 0, y: 0 },
    id: null,
    menuList: [],
  },
  openContextMenu: (id, x, y, menuList) => set({ contextMenu: { isOpen: true, position: { x, y }, id, menuList } }),
  closeContextMenu: () => set({ contextMenu: { isOpen: false, position: { x: 0, y: 0 }, id: null } }),
}));

export { useModalStore, useContextMenuStore };
