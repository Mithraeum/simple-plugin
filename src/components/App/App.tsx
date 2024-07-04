import React, { FC, HTMLAttributes } from "react";
import { makeStyles } from "tss-react/mui";
import WorldAddressInput from "../WorldAddressInput/WorldAddressInput";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SearchAddressInput from "../SearchAddressInput/SearchAddressInput";
import SettlementsList from "../SettlementsList/SettlementsList";

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
      <ConnectButton />
      <WorldAddressInput />
      <SearchAddressInput />
      <SettlementsList />
    </div>
  );
};

export default App;
