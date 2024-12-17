import React from "react"; // Importing React to use JSX and create functional components.
import Typography from "@mui/material/Typography"; // Importing Typography from Material-UI for consistent text styling.
import { Link } from "react-router-dom"; // Importing Link from React Router for internal client-side navigation.

function Copyright(props) {
  return (
    // Typography is a Material-UI component that allows for styled text with predefined themes.
    <Typography
      variant="body2" // Specifies the typography style to be "body2," ideal for smaller, footer-style text.
      color="text.secondary" // Sets the text color to "text.secondary," defined in the app's Material-UI theme.
      align="center" // Centers the text horizontally within its parent container.
      {...props} // Spreads additional props passed to the component, making it easily extensible.
    >
      {"Copyright © "} {/* Static text indicating the start of the copyright message. */}
      
      {/* Link component for internal navigation. It wraps the company name as a clickable link. */}
      <Link 
        color="inherit" // Ensures the link's color matches its parent Typography's text color.
        to="/#" // Defines the link's destination; currently set as a placeholder path.
        target="_blank" // Opens the link in a new browser tab when clicked.
        aria-label="Kreative, Performative Individuals Homepage" // Adds an accessible label for screen readers to describe the link's purpose.
      >
        Kreative, Performative Individuals {/* The entity or organization's name. */}
      </Link>{" "}
      
      {new Date().getFullYear()} {/* Dynamically retrieves the current year to keep the copyright statement up-to-date. */}
      
      {"."} {/* Adds a period at the end of the copyright statement for proper punctuation. */}
    </Typography>
  );
}

export default Copyright; // Exports the component for use in other parts of the application.
