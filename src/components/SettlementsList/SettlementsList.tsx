import React, { FC } from "react";
import { useStore } from "../../store/store";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { environment, useMithraeumSdk } from "../../hooks/useMithraeumSdk";
import { useEthersSigner } from "../../hooks/useEthersSigner";
import { bind } from "@react-rxjs/core";
import { MithraeumSdk, SettlementEntity } from "@mithraeum/mithraeum-sdk";
import { combineLatest, map, of, switchMap } from "rxjs";
import { MithraeumAssets } from "@mithraeum/mithraeum-assets";

const [useBannerNames, settlements$] = bind(
  (sdk: MithraeumSdk, settlements: SettlementEntity[]) => {
    if (settlements.length === 0) {
      return of([]);
    }

    const mithraeumAssets = new MithraeumAssets(
      environment.nftPartsContractAddress,
    );

    const bannerNames = settlements.map((settlement) => {
      return sdk.services.settlement.banner$(settlement.address).pipe(
        switchMap((banner) => {
          return banner.data$().pipe(
            map((data) => {
              const options = mithraeumAssets.generateBannerOptions(
                data as any,
              );
              return options.name;
            }),
          );
        }),
      );
    });

    return combineLatest(bannerNames);
  },
);

const SettlementsList: FC = () => {
  const sdk = useMithraeumSdk();
  const settlementEntities = useStore((state) => state.settlements);
  const bannerNames = useBannerNames(sdk, settlementEntities);
  const setActiveSettlement = useStore((state) => state.setActiveSettlement);
  const signer = useEthersSigner();

  const onHarvestAll = (settlementAddress: string) => {
    sdk.services.settlement.harvestAll(settlementAddress, signer!);
  };

  return settlementEntities.length ? (
    <>
      <Typography variant={"subtitle1"}>
        Select settlement address for the info:
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Settlement Address</TableCell>
              <TableCell>Banner name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {settlementEntities.map((settlement, index) => (
              <TableRow
                key={settlement.address}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveSettlement(settlement)}
                >
                  {settlement.address}
                </TableCell>
                <TableCell component="th" scope="row">
                  {bannerNames[index]}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Button
                    variant={"contained"}
                    onClick={() => onHarvestAll(settlement.address)}
                  >
                    Harvest All
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  ) : (
    <></>
  );
};

export default SettlementsList;
