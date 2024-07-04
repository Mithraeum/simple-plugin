import { Components, Theme } from "@mui/material/styles";

export const getOverridesComponent = (baseTheme: Theme): Components => {
  return {
    MuiCssBaseline: {
      styleOverrides: `
        html {
          height: 100%;
          scroll-behavior: smooth;
          font-size: 16px;
        }

        body {
          box-sizing: border-box;
          height: 100%;
          margin: 0;
          padding: 0;
          display: flex;
          overflow-x: hidden;
        }
        #root {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
      `,
    },
  };
};
