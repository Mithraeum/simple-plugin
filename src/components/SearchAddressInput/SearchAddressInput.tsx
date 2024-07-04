import React, { FC, HTMLAttributes, useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { useMithraeumSdk } from "../../hooks/useMithraeumSdk";
import { Box, Stack, Switch, TextField, Typography } from "@mui/material";
import {
  GameEntities,
  SettlementEntity,
  UserEntity,
} from "@mithraeum/mithraeum-sdk";
import { ethers } from "ethers";
import { combineLatest, filter, map, switchMap } from "rxjs";
import { useSettlementStore } from "../../store/store";

enum AddressType {
  SETTLEMENT,
  WALLET,
}

const useStyles = makeStyles({ name: "SearchAddressInput" })((theme) => ({
  root: {},
}));

type Props = {} & HTMLAttributes<HTMLDivElement>;

const SearchAddressInput: FC<Props> = () => {
  const [searchValue, setSearchValue] = useState("");
  const [addressType, setAddressType] = useState<AddressType>(
    AddressType.SETTLEMENT,
  );
  const sdk = useMithraeumSdk();
  const setSettlements = useSettlementStore((state) => state.setSettlements);

  useEffect(() => {
    if (!ethers.isAddress(searchValue)) {
      return;
    }

    const entity =
      addressType === AddressType.SETTLEMENT
        ? sdk.getGameEntity(GameEntities.Settlement, searchValue)
        : sdk.getGameEntity(GameEntities.User, searchValue);

    let settlements: SettlementEntity[] = [];

    if (entity instanceof SettlementEntity) {
      const settlementEntity = entity as SettlementEntity;

      // settlements = [settlementEntity];
      setSettlements([settlementEntity]);

      // const resourceProductionBuildings$ =
      //   sdk.services.settlement.resourceProductionBuildings$(
      //     settlementEntity.address,
      //   );
    } else if (entity instanceof UserEntity) {
      const userEntity = entity as UserEntity;

      const settlements$ = userEntity.banners$().pipe(
        switchMap((banners) =>
          combineLatest(banners.map((banner) => banner.settlement$())),
        ),
        map((settlements) => {
          return settlements.filter(
            (settlement) => !!settlement,
          ) as SettlementEntity[];
        }),
      );
    } else {
      throw new Error("Wrong address");
    }

    console.log("settlements", settlements);
  }, [sdk, searchValue, addressType]);

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
