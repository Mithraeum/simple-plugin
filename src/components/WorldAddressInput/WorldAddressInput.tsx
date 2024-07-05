import React, { useEffect } from "react";
import { Box, TextField } from "@mui/material";
import { useStore } from "../../store/store";

const WorldAddressInput = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const addressFromQuery = queryParameters.get("worldAddress");

  const worldAddress = useStore((state) => state.worldAddress);
  const setWorldAddress = useStore((state) => state.setWorldAddress);

  useEffect(() => {
    if (!addressFromQuery) {
      return;
    }
    setWorldAddress(addressFromQuery);
  }, [addressFromQuery]);

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <TextField
        sx={{ m: 1, width: "100%" }}
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
