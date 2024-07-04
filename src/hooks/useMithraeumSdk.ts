import { FallbackProvider, JsonRpcProvider, Network } from "ethers";
import { useEthersProvider } from "./useEthersProvider";
import { MithraeumSdk } from "@mithraeum/mithraeum-sdk";
import { useMemo } from "react";

const environment = {
  paymasterApiUrl: "https://paymaster-api.mithraeum.io",
  coreGraphApiUrl:
    "https://api.studio.thegraph.com/query/72578/mithraeum-gnosis-dev/version/latest",
  multiCallContractAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
  armyViewContractAddress: "0xD78aeBd0a74Db7EdEf9Ed0990E876d6E468cdc0D",
  settlementViewAddress: "0x468CE4b8B0F32C06717acC12D72ac46A0330546A",
  settlementsListingsAddress: "0x658e466c58D37b2fAde1590b16c7f380fdA73110",
  eraViewContractAddress: "0xDB29431227BD63322459c5805b25bcfe253bf853",
  disableEventsListeners: false,
  logsPollingInterval: 30000,
  worldAddress: "0x5fb9731537D68eAB2901d4ebEE34Fc06e14B0051",
};

const createSdk = (
  provider: JsonRpcProvider | FallbackProvider | undefined,
) => {
  return new MithraeumSdk(provider!, {
    version: "MithraeumSdk.0.0.1",
    multiCallAddress: environment.multiCallContractAddress,
    worldAddress: environment.worldAddress,
    armyViewContractAddress: environment.armyViewContractAddress,
    settlementViewAddress: environment.settlementViewAddress,
    settlementsListingsAddress: environment.settlementsListingsAddress,
    eraViewContractAddress: environment.eraViewContractAddress,
    timeDelta: 0,
    indexerUrl: environment.coreGraphApiUrl,
    disableEventsListening: environment.disableEventsListeners,
    logsPollingInterval: environment.logsPollingInterval,
    paymasterApiUrl: environment.paymasterApiUrl,
  });
};

export const useMithraeumSdk = () => {
  const provider = useEthersProvider();

  return useMemo(() => {
    return createSdk(provider);
  }, [provider]);
};
