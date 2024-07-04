import { Theme } from "@mui/material/styles";

export const getTypography = (baseTheme: Theme): any => {
  return {
    h1: {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 94,
      lineHeight: "123px",
      color: baseTheme.palette.primary.main,
    },
    h2: {
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: 58,
      lineHeight: "76px",
      color: baseTheme.palette.primary.main,

      [baseTheme.breakpoints.down("md")]: {
        marginBottom: baseTheme.spacing(1.5),

        fontWeight: 700,
        fontSize: 32,
        lineHeight: "42px",
        letterSpacing: "0.05em",
        textShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)",
      },
    },
    h3: {
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: 32,
      lineHeight: "42px",
      letterSpacing: "0.05em",
      color: baseTheme.palette.primary.main,
    },
    subtitle1: {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 26,
      lineHeight: "30px",
      color: baseTheme.palette.text.primary,
    },
    subtitle2: {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "26px",
      color: baseTheme.palette.text.primary,
    },
    body1: {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 18,
      lineHeight: "147%",
      color: baseTheme.palette.text.primary,

      [baseTheme.breakpoints.down("md")]: {
        fontSize: 14,
      },
    },
    body2: {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "21px",
      color: baseTheme.palette.text.primary,
      letterSpacing: 0,
    },
    button: {
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: 22,
      lineHeight: "29px",
      textTransform: "capitalize",
    },
    caption: {
      fontStyle: "italic",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "18px",
      color: baseTheme.palette.text.primary,
    },
    overline: {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "15px",
      textTransform: "uppercase",
      color: baseTheme.palette.text.primary,
    },
  };
};
