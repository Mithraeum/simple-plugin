import React, { FC, HTMLAttributes, useEffect, useState } from "react";
import { useMithraeumSdk } from "../../hooks/useMithraeumSdk";
import { Box, Stack, Switch, TextField, Typography } from "@mui/material";
import {
  GameEntities,
  MithraeumSdk,
  SettlementEntity,
} from "@mithraeum/mithraeum-sdk";
import { ethers } from "ethers";
import { combineLatest, map, of, switchMap } from "rxjs";
import { useStore } from "../../store/store";
import { bind } from "@react-rxjs/core";

enum AddressType {
  SETTLEMENT,
  WALLET,
}

const [useSettlements, settlements$] = bind(
  (sdk: MithraeumSdk, address: string) => {
    if (!ethers.isAddress(address)) {
      return of([]);
    }

    const isSettlement$ = sdk
      .getGameEntity(GameEntities.WorldAsset, address)
      .assetType$()
      .pipe(
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
            switchMap((banners) =>
              combineLatest(banners.map((banner) => banner.settlement$())),
            ),
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
);

type Props = {} & HTMLAttributes<HTMLDivElement>;

const SearchAddressInput: FC<Props> = () => {
  const [searchValue, setSearchValue] = useState("");
  const [addressType, setAddressType] = useState<AddressType>(
    AddressType.SETTLEMENT,
  );
  const sdk = useMithraeumSdk();
  const settlements = useSettlements(sdk, searchValue);

  const setSettlements = useStore((state) => state.setSettlements);

  useEffect(() => {
    console.log("settlements", settlements);

    setSettlements(settlements);
  }, [settlements]);

  const changeAddressType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressType((value) => {
      if (value === AddressType.WALLET) {
        return AddressType.SETTLEMENT;
      } else {
        return AddressType.WALLET;
      }
    });
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        sx={{ m: 1, width: "50%" }}
        label="Settlement address or Wallet address"
        value={searchValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchValue(event.target.value);
        }}
      />

      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Settlement</Typography>
        <Switch
          checked={addressType === AddressType.WALLET}
          onChange={changeAddressType}
          inputProps={{ "aria-label": "controlled" }}
        />
        <Typography>Wallet</Typography>
      </Stack>
    </Box>
  );
};

export default SearchAddressInput;
