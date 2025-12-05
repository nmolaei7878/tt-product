import { StateCreator } from 'zustand';

interface ModalState {
  modals: Record<string, boolean>;
}

interface ModalActions {
  openModal: (modalName: string) => void;
  closeModal: (modalName: string) => void;
}

export type ModalSlice = ModalState & ModalActions;

export const createModalSlice: StateCreator<ModalSlice> = (set: any) => ({
  modals: {},
  openModal: (modalName) =>
    set((state: any) => {
      state.modals[modalName] = true;
    }),
  closeModal: (modalName) =>
    set((state: any) => {
      state.modals[modalName] = false;
    }),
});
