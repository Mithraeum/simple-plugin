import { create } from "zustand";
import { SettlementEntity } from "@mithraeum/mithraeum-sdk";
import { environment } from "../environment/environment";

interface SettlementsState {
  worldAddress: string;
  setWorldAddress: (worldAddress: string) => void;

  settlements: SettlementEntity[];
  setSettlements: (settlements: SettlementEntity[]) => void;
}

export const useStore = create<SettlementsState>()((set) => ({
  worldAddress: environment.worldAddress,
  setWorldAddress: (worldAddress) => set((state) => ({ worldAddress })),

  settlements: [],
  setSettlements: (settlements) => set((state) => ({ settlements })),
}));
