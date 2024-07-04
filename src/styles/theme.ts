import { createTheme, Theme } from "@mui/material/styles";
import {
  bgColor,
  borderColor,
  grey,
  grey2,
  primaryColor,
  primaryText,
} from "./colors";

import { getOverridesComponent } from "./overridesComponent";
import { getTypography } from "./typography";

export const createCustomTheme = (): Theme => {
  const baseTheme = createTheme({
    spacing: (x: number) => `${x * 8}px`,
    palette: {
      mode: "dark",
      primary: {
        main: primaryColor,
      },
      grey: {
        500: borderColor,
        600: grey,
        700: grey2,
      },
      text: {
        primary: primaryText,
      },
      background: {
        default: bgColor,
      },
    },
  });

  return createTheme({
    ...baseTheme,
    components: getOverridesComponent(baseTheme),
    typography: getTypography(baseTheme),
  });
};
