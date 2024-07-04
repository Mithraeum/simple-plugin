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
} from "@mui/material";
import { useMithraeumSdk } from "../../hooks/useMithraeumSdk";
import { useEthersSigner } from "../../hooks/useEthersSigner";

const SettlementsList: FC = () => {
  const sdk = useMithraeumSdk();
  const settlementEntities = useStore((state) => state.settlements);
  const setActiveSettlement = useStore((state) => state.setActiveSettlement);
  const signer = useEthersSigner();

  const onHarvestAll = (settlementAddress: string) => {
    sdk.services.settlement.harvestAll(settlementAddress, signer!);
  };

  return settlementEntities.length ? (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: "100%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Settlement Address</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {settlementEntities.map((settlement) => (
            <TableRow
              key={settlement.address}
              sx={{
                cursor: "pointer",
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell
                component="th"
                scope="row"
                onClick={() => setActiveSettlement(settlement)}
              >
                {settlement.address}
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
  ) : (
    <></>
  );
};

export default SettlementsList;
