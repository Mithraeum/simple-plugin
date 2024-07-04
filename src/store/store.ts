import { create } from "zustand";
import { SettlementEntity } from "@mithraeum/mithraeum-sdk";

interface SettlementsState {
  settlements: SettlementEntity[];
  setSettlements: (settlements: SettlementEntity[]) => void;

  activeSettlement: SettlementEntity | null;
  setActiveSettlement: (settlements: SettlementEntity) => void;
}

export const useStore = create<SettlementsState>()((set) => ({
  settlements: [],
  setSettlements: (settlements) => set((state) => ({ settlements })),

  activeSettlement: null,
  setActiveSettlement: (activeSettlement) =>
    set((state) => ({ activeSettlement })),
}));
