import { FallbackProvider, JsonRpcProvider } from "ethers";
import { useEthersProvider } from "./useEthersProvider";
import { MithraeumSdk } from "@mithraeum/mithraeum-sdk";
import { useMemo } from "react";
import { useStore } from "../store/store";
import { environment } from "../environment/environment";

const createSdk = (
  provider: JsonRpcProvider | FallbackProvider | undefined,
  worldAddress: string,
) => {
  return new MithraeumSdk(provider!, {
    version: "MithraeumSdk.0.0.1",
    worldAddress,
    multiCallAddress: environment.multiCallContractAddress,
    armyViewContractAddress: environment.armyViewContractAddress,
    settlementViewAddress: environment.settlementViewAddress,
    settlementsListingsAddress: environment.settlementsListingsAddress,
    eraViewContractAddress: environment.eraViewContractAddress,
    timeDelta: 0,
    indexerUrl: environment.coreGraphApiUrl,
    disableEventsListening: environment.disableEventsListeners,
    logsPollingInterval: environment.logsPollingInterval,
  });
};

export const useMithraeumSdk = () => {
  const provider = useEthersProvider();
  const worldAddress = useStore((state) => state.worldAddress);

  return useMemo(() => {
    return createSdk(provider, worldAddress);
  }, [provider, worldAddress]);
};
