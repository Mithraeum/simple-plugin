import { create } from "zustand";
import { SettlementEntity } from "@mithraeum/mithraeum-sdk";

interface SettlementsState {
  settlements: SettlementEntity[];
  setSettlements: (settlements: SettlementEntity[]) => void;
}

export const useSettlementStore = create<SettlementsState>()((set) => ({
  settlements: [],
  setSettlements: (settlements) => set((state) => ({ settlements })),
}));
