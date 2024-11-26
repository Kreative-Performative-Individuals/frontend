import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/system";

const defaultTheme = createTheme();
const AuthLayout = ({ children }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{
        height: "100vh",
        backgroundColor: "#4880FF",
        margin: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>

        {children}

      </Box>
    </ThemeProvider>
  );
};

export default AuthLayout;
