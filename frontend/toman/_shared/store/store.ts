import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ModalSlice, createModalSlice } from './slices/modalSlice';

type StoreState = ModalSlice;

const useStore = create<StoreState>()(
  immer((...a) => ({
    ...createModalSlice(...a),
  }))
);

export default useStore;
