import { create } from "zustand";

const useModalStore = create((set) => ({
  isOpen: false,
  children: null,
  openModal: (children) => set({ isOpen: true, children }),
  closeModal: () => set({ isOpen: false, children: null }),
}));

const useConfirmStore = create((set) => ({
  isOpen: false,
  title: "",
  children: null,
  confirmText: "확인",
  cancelText: "취소",
  variant: "primary",
  resolve: null,

  showConfirm: ({ title, children, confirmText, cancelText, variant = "primary" }) =>
    new Promise((resolve) => {
      set({ isOpen: true, title, children, confirmText, cancelText, variant, resolve });
    }),

  closeConfirm: (result) =>
    set((state) => {
      if (state.resolve) state.resolve(result);
      return { isOpen: false, title:"", children: null, confirmText: "확인", cancelText: "취소", variant: "primary", resolve: null };
    }),
}));

const useProgressAlertStore = create((set) => ({
  isOpen: false,
  title: "",
  progress: 0,
  confirmText: "확인",
  cancelText: "취소",
  variant: "primary",
  resolve: null,

  setProgress: (progress) =>
    set((state) => {
      return { ...state, progress };
    }),

  showProgress: ({ title, confirmText, cancelText, variant = "primary" }) =>
    new Promise((resolve) => {
      set({ isOpen: true, title, confirmText, cancelText, variant, resolve });
    }),

  closeProgress: (result) =>
    set((state) => {
      if (state.resolve) state.resolve(result);
      return { isOpen: false, title: "", progress: 0, confirmText: "확인", cancelText: "취소", variant: "primary", resolve: null };
    }),
}));

const useSpinnerAlertStore = create((set) => ({
  isOpen: false,
  title: "",
  progress: 0,
  confirmText: "확인",
  cancelText: "취소",
  variant: "primary",
  resolve: null,

  showSpinner: ({ title, confirmText, cancelText, variant = "primary" }) =>
    new Promise((resolve) => {
      set({ isOpen: true, title, confirmText, cancelText, variant, resolve });
    }),

  closeSpinner: (result) =>
    set((state) => {
      if (state.resolve) state.resolve(result);
      return { isOpen: false, title: "", progress: 0, confirmText: "확인", cancelText: "취소", variant: "primary", resolve: null };
    }),
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

const useProfileContextMenuStore = create((set) => ({
  contextMenu: {
    isOpen: false,
    position: { x: 0, y: 0 },
    id: null,
    menuList: [],
  },
  openContextMenu: (id, x, y, menuList) => set({ contextMenu: { isOpen: true, position: { x, y }, id, menuList } }),
  closeContextMenu: () => set({ contextMenu: { isOpen: false, position: { x: 0, y: 0 }, id: null } }),
}));

const useToastStore = create((set) => ({
  toastMessages: [],
  addToast: (message) => {
    set((state) => ({
      toastMessages: [...state.toastMessages, message],
    }));
    setTimeout(() => {
      set((state) => ({
        toastMessages: state.toastMessages.slice(1),
      }));
    }, 3000);
  },
}));

export { useModalStore, useConfirmStore, useProgressAlertStore, useSpinnerAlertStore, useContextMenuStore, useProfileContextMenuStore, useToastStore };
