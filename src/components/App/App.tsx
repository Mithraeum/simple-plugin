import React, { FC, HTMLAttributes } from "react";
import { makeStyles } from "tss-react/mui";
import WorldAddressInput from "../WorldAddressInput/WorldAddressInput";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SearchAddressInput from "../SearchAddressInput/SearchAddressInput";
import SettlementsList from "../SettlementsList/SettlementsList";
import { Subscribe } from "@react-rxjs/core";
import Loader from "../Loader/Loader";
import BuildingsList from "../BuildingsList/BuildingsList";

const useStyles = makeStyles({ name: "App" })((theme) => ({
  root: {
    margin: theme.spacing(1),
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
}));

type Props = {} & HTMLAttributes<HTMLDivElement>;

const App: FC<Props> = () => {
  const { classes, cx } = useStyles();

  return (
    <div className={classes.root}>
      <Subscribe fallback={<Loader />}>
        <ConnectButton />
        <WorldAddressInput />
        <SearchAddressInput />
        <SettlementsList />
        <BuildingsList />
      </Subscribe>
    </div>
  );
};

export default App;
