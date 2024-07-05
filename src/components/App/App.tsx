import React, { FC, HTMLAttributes } from "react";
import { makeStyles } from "tss-react/mui";
import WorldAddressInput from "../WorldAddressInput/WorldAddressInput";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SearchAddressInput from "../SearchAddressInput/SearchAddressInput";
import SettlementsList from "../SettlementsList/SettlementsList";
import { Subscribe } from "@react-rxjs/core";
import Loader from "../Loader/Loader";
import { Box } from "@mui/material";

const useStyles = makeStyles({ name: "App" })((theme) => ({
  root: {
    margin: theme.spacing(10, 1, 0),
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
}));

type Props = {} & HTMLAttributes<HTMLDivElement>;

const App: FC<Props> = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <ConnectButton />

      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Subscribe fallback={<Loader />}>
          <WorldAddressInput />
          <SearchAddressInput />
          <SettlementsList />
        </Subscribe>
      </Box>
    </div>
  );
};

export default App;
