import React, { FC, useEffect, useState } from "react";
import { useMithraeumSdk } from "../../hooks/useMithraeumSdk";
import { Box, TextField } from "@mui/material";
import {
  GameEntities,
  MithraeumSdk,
  SettlementEntity,
} from "@mithraeum/mithraeum-sdk";
import { ethers } from "ethers";
import {
  BehaviorSubject,
  combineLatest,
  map,
  of,
  Subject,
  switchMap,
} from "rxjs";
import { useStore } from "../../store/store";
import { bind } from "@react-rxjs/core";

const [useSettlements, settlements$] = bind(
  (sdk: MithraeumSdk, address: string) => {
    if (!ethers.isAddress(address)) {
      return of([]);
    }

    const isSettlement$: Subject<boolean> = new BehaviorSubject(false);

    try {
      isSettlement$.pipe(
        map((isSettlement) => {
          return sdk
            .getGameEntity(GameEntities.WorldAsset, address)
            .assetType$()
            .pipe(
              map((assetType) => {
                return assetType === "BASIC";
              }),
            );
        }),
      );
    } catch (e: any) {
      console.error(e);
    }

    return isSettlement$.pipe(
      switchMap((isSettlement) => {
        if (isSettlement) {
          return of([
            sdk.getGameEntity(
              GameEntities.Settlement,
              address,
            ) as SettlementEntity,
          ]);
        } else {
          const user = sdk.getGameEntity(GameEntities.User, address);

          return user.banners$().pipe(
            switchMap((banners) => {
              return combineLatest(
                banners.map((banner) => banner.settlement$()),
              );
            }),
            map((settlements) => {
              return settlements.filter(
                (settlement) => !!settlement,
              ) as SettlementEntity[];
            }),
          );
        }
      }),
    );
  },
  [],
);

const SearchAddressInput: FC = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const addressFromQuery = queryParameters.get("userAddress");

  const [searchValue, setSearchValue] = useState(addressFromQuery || "");

  const sdk = useMithraeumSdk();
  const settlements = useSettlements(sdk, searchValue);

  const setSettlements = useStore((state) => state.setSettlements);

  useEffect(() => {
    setSettlements(settlements);
  }, [settlements]);

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <TextField
        sx={{ m: 1, width: "100%" }}
        label="Settlement address or Wallet address"
        value={searchValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchValue(event.target.value);
        }}
      />
    </Box>
  );
};

export default SearchAddressInput;
