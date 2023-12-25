import { createTheme } from "@mui/material";

export const ColorPalette = {
  fontDark: "#101727",
  fontLight: "#F5F5F5",
  purple: "#b624ff",
  red: "#ff3131",
  orange: "#ff8c00", // Added orange color
};

export const MuiTheme = createTheme({
  components: {
    MuiTooltip: {
      defaultProps: {
        disableInteractive: true,
      },
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },

  palette: {
    primary: {
      main: ColorPalette.orange, // Changed primary color to orange
    },
    secondary: {
      main: "#bababa",
    },
    error: {
      main: ColorPalette.red,
    },
  },
});
