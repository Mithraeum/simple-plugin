import React, { FC, useEffect, useState } from "react";
import { useMithraeumSdk } from "../../hooks/useMithraeumSdk";
import { Box, TextField } from "@mui/material";
import {
  convertIdToType,
  GameEntities,
  MithraeumSdk,
  SettlementEntity,
  WorldAsset__factory,
} from "@mithraeum/mithraeum-sdk";
import { ethers } from "ethers";
import {
  catchError,
  combineLatest,
  from,
  map,
  Observable,
  of,
  switchMap,
} from "rxjs";
import { useStore } from "../../store/store";
import { bind } from "@react-rxjs/core";

const [useSettlements, settlements$] = bind(
  (sdk: MithraeumSdk, address: string) => {
    if (!ethers.isAddress(address)) {
      return of([]);
    }

    const isSettlement$: Observable<boolean> = from(
      WorldAsset__factory.connect(address, sdk.provider).assetTypeId(),
    ).pipe(
      catchError((e) => {
        return of(null);
      }),
      map((assetTypeId) => {
        if (!assetTypeId) {
          return null;
        }
        return convertIdToType(assetTypeId);
      }),
      map((assetType) => {
        return assetType === "BASIC";
      }),
    );

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
