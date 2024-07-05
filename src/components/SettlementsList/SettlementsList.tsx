import React, { FC, useState } from "react";
import { useStore } from "../../store/store";
import {
  Box,
  Button,
  Collapse,
  IconButton,
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
import { bind, Subscribe } from "@react-rxjs/core";
import { MithraeumSdk, SettlementEntity } from "@mithraeum/mithraeum-sdk";
import { combineLatest, map, of, switchMap } from "rxjs";
import { MithraeumAssets } from "@mithraeum/mithraeum-assets";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import BuildingsList from "../BuildingsList/BuildingsList";
import Loader from "../Loader/Loader";

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
  const signer = useEthersSigner();

  const [openSettlementsAddresses, setOpenSettlementsAddresses] = useState<
    string[]
  >([]);

  const onHarvestAll = (settlementAddress: string) => {
    sdk.services.settlement.harvestAll(settlementAddress, signer!);
  };

  const onSetOpen = (settlementAddress: string) => {
    setOpenSettlementsAddresses((arr) => {
      if (arr.includes(settlementAddress)) {
        return arr.filter((cur) => cur != settlementAddress);
      } else {
        return [...arr, settlementAddress];
      }
    });
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
              <TableCell></TableCell>
              <TableCell>Settlement Address</TableCell>
              <TableCell>Banner name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {settlementEntities.map((settlement, index) => (
              <React.Fragment key={settlement.address}>
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => onSetOpen(settlement.address)}
                    >
                      {openSettlementsAddresses.includes(settlement.address) ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={() => onSetOpen(settlement.address)}
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

                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openSettlementsAddresses.includes(settlement.address)}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ margin: 1 }}>
                        <Subscribe fallback={<Loader />}>
                          <BuildingsList settlement={settlement} />
                        </Subscribe>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
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
