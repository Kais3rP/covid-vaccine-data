import { createTheme } from "@mui/material/styles";
import { barColors } from "../data";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#000055",
    },
    secondary: {
      main: "#DDE",
    },
    error: {
      main: "#0E0",
    },
    warning: {
      main: "#00E",
    },
    background: {
      paper: "#fffff1",
    },
    text: {
      primary: "#DDD",
      secondary: "#46505A",
    },
    action: {
      active: "#000",
    },
    success: {
      dark: "#009688",
      main: "#000",
    },
  },
  shadows: { main: "0px 0px 2px 2px #AAA", 4: "0px 0px 2px 2px #AAA" },
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          backgroundColor: "#000",
        },
      },
    },
  },
});
