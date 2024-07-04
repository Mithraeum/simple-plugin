import React, { FC } from "react";
import { useSettlementStore } from "../../store/store";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const SettlementsList: FC = () => {
  const settlementEntities = useSettlementStore((state) => state.settlements);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: "100%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Settlement Address</TableCell>
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
              <TableCell component="th" scope="row">
                {settlement.address}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SettlementsList;
