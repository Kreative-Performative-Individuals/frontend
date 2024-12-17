import * as React from "react"; // Importing React for JSX and functional component creation.
import CssBaseline from "@mui/material/CssBaseline"; // CssBaseline resets the default styling for consistent cross-browser design.
import { createTheme, ThemeProvider } from "@mui/material/styles"; // ThemeProvider applies Material-UI themes, and createTheme generates a custom theme.
import { Box } from "@mui/system"; // Box is a Material-UI utility component for layout and styling.

const defaultTheme = createTheme(); // Create a default Material-UI theme. Can be customized as needed.

const AuthLayout = ({ children }) => { 
  // AuthLayout component defines a consistent layout for authentication-related pages (SignIn, SignUp).
  
  return (
    <ThemeProvider theme={defaultTheme}> 
      {/* ThemeProvider applies the default theme to all components inside it. */}
      
      <CssBaseline />
      {/* CssBaseline ensures that the app has a consistent baseline of styles across browsers. */}
      
      <Box 
        sx={{ 
          // `sx` prop allows inline styling with Material-UI's system.
          height: "100vh", // Sets the height to fill the full viewport height.
          backgroundColor: "#4880FF", // Applies a blue background color.
          margin: "0", // Removes any default margin.
          display: "flex", // Enables flexbox for layout control.
          alignItems: "center", // Vertically centers the children inside the Box.
          justifyContent: "center" // Horizontally centers the children inside the Box.
        }}
      >
        {children} 
        {/* Render any children components passed to AuthLayout. 
        For example, SignIn or SignUp forms will be displayed here. */}
      </Box>
    </ThemeProvider>
  );
};

export default AuthLayout; 
// Exporting the component for use in other parts of the app, such as wrapping authentication pages.
