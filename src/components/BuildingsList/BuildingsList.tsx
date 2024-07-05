import React, { FC } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useStore } from "../../store/store";
import { bind } from "@react-rxjs/core";
import {
  GameEntities,
  MithraeumSdk,
  SettlementEntity,
} from "@mithraeum/mithraeum-sdk";
import { combineLatest, map, of, switchMap } from "rxjs";
import { useMithraeumSdk } from "../../hooks/useMithraeumSdk";
import { useEthersSigner } from "../../hooks/useEthersSigner";
import { bigintToNumber } from "../helpers/bigintToNumber";

const [useBuildings, buildings$] = bind(
  (sdk: MithraeumSdk, settlement: SettlementEntity | null) => {
    if (!settlement) {
      return of([]);
    }

    const buildings$ = of(settlement).pipe(
      switchMap((settlement) => {
        return sdk.services.settlement.resourceProductionBuildings$(
          settlement.address,
        );
      }),
    );

    const buildingsTypes$ = buildings$.pipe(
      switchMap((buildings) => {
        return combineLatest(
          buildings.map((building) => building.buildingType$()),
        );
      }),
    );

    const buildingsTreasury$ = buildings$.pipe(
      switchMap((buildings) => {
        return combineLatest(
          buildings.map((building) =>
            building
              .currentTreasury$()
              .pipe(sdk.helpers.valueGainInterpolation()),
          ),
        );
      }),
    );

    const buildingsMaxTreasury$ = buildings$.pipe(
      switchMap((buildings) => {
        return combineLatest(
          buildings.map((building) => building.currentMaxTreasury$()),
        );
      }),
    );

    const buildingsReadyToBeDistributed$ = buildings$.pipe(
      switchMap((buildings) => {
        return combineLatest(
          buildings.map((building) =>
            building
              .combinedProduction$()
              .pipe(sdk.helpers.valueGainInterpolation()),
          ),
        );
      }),
    );

    return combineLatest([
      buildings$,
      buildingsTypes$,
      buildingsTreasury$,
      buildingsMaxTreasury$,
      buildingsReadyToBeDistributed$,
    ]).pipe(
      map(
        ([
          buildings,
          buildingTypes,
          buildingsTreasury,
          buildingsMaxTreasury,
          buildingsReadyToBeDistributed,
        ]) => {
          return buildings.map((building, index) => {
            return {
              building,
              buildingType: buildingTypes[index],
              buildingTreasury: buildingsTreasury[index],
              buildingMaxTreasury: buildingsMaxTreasury[index],
              buildingReadyToBeDistributed:
                buildingsReadyToBeDistributed[index],
            };
          });
        },
      ),
    );
  },
);

const BuildingsList: FC = () => {
  const sdk = useMithraeumSdk();
  const activeSettlement = useStore((state) => state.activeSettlement);
  const buildings = useBuildings(sdk, activeSettlement);
  const signer = useEthersSigner();

  const onHarvest = (buildingAddress: string) => {
    const buildingEntity = sdk.getGameEntity(
      GameEntities.Building,
      buildingAddress,
    );

    buildingEntity.distribute(signer!);
  };

  return activeSettlement ? (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: "100%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Building type</TableCell>
            <TableCell>Treasury</TableCell>
            <TableCell>To harvest</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {buildings.map(
            ({
              building,
              buildingType,
              buildingTreasury,
              buildingMaxTreasury,
              buildingReadyToBeDistributed,
            }) => (
              <TableRow
                key={building.address}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {buildingType}
                </TableCell>
                <TableCell component="th" scope="row">
                  <>
                    {bigintToNumber(buildingTreasury)}/
                    {bigintToNumber(buildingMaxTreasury)}
                  </>
                </TableCell>
                <TableCell component="th" scope="row">
                  {bigintToNumber(buildingReadyToBeDistributed).toFixed(2)}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Button
                    variant={"contained"}
                    onClick={() => onHarvest(building.address)}
                  >
                    Harvest
                  </Button>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <></>
  );
};

export default BuildingsList;