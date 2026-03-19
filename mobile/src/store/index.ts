import { create } from "zustand";

interface AppStore {
  selectedRoom: any;
  setSelectedRoom: (roomData: any) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  selectedRoom: null,
  setSelectedRoom: (roomData) => set({ selectedRoom: roomData }),
}));
