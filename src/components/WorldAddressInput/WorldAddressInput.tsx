import React, { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";
import { GameEntities } from "@mithraeum/mithraeum-sdk";
import { useMithraeumSdk } from "../../hooks/useMithraeumSdk";

const WorldAddressInput = () => {
  const [worldAddress, setWorldAddress] = useState("");
  const sdk = useMithraeumSdk();

  useEffect(() => {
    if (!sdk) {
      return;
    }

    const sdkWorldAddress = sdk?.getGameEntity(GameEntities.World).address;

    setWorldAddress(sdkWorldAddress);
  }, [sdk]);

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        sx={{ m: 1, width: "50%" }}
        label="World Address"
        value={worldAddress}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setWorldAddress(event.target.value);
        }}
      />
    </Box>
  );
};

export default WorldAddressInput;
