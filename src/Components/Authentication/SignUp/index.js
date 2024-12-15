import * as React from "react"; // Import React library
import Button from "@mui/material/Button"; // Import MUI Button component
import TextField from "@mui/material/TextField"; // Import MUI TextField component
import { Link } from "react-router-dom"; // Import Link for navigation
import Box from "@mui/material/Box"; // Import MUI Box for layout
import Typography from "@mui/material/Typography"; // Import MUI Typography for text styling
import AuthLayout from ".."; // Import AuthLayout for consistent authentication page design
import Copyright from "../Copyright"; // Import Copyright component
import { registerUser } from "../../../store/main/actions"; // Import registerUser action
import { connect } from "react-redux"; // Import connect to link Redux state and actions
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation
import "../style.scss"; // Import component-specific styles

function SignUp({ registerUser, isLoading, isError }) {
  const navigate = useNavigate(); // Initialize navigate for redirection

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const data = new FormData(event.currentTarget); // Extract form data
    const registerData = {
      email: data.get("email"), // Get email from form
      password: data.get("password"), // Get password from form
    };
    await registerUser(registerData, navigate); // Dispatch registerUser action with data and navigate function
  };

  return (
    <AuthLayout>
      <Box className="authContainer">
        {/* Container for the sign-up form */}
        <Typography className="heading"> Create an account </Typography>
        {/* Heading text */}
        <Typography className="subHeading">
          {" "}
          Create an account to continue{" "}
        </Typography>
        {/* Subheading text */}

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* Form for user input */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          {/* Input field for email */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {/* Input field for password */}

          {!isLoading && (
            // Conditionally render the sign-up button based on loading state
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {/* Link to sign-in page */}
            <Box>
              <Link to="/signin" variant="body2">
                {"Already have an account? Signin"}
              </Link>
            </Box>
          </Box>

          <Copyright sx={{ mt: 5 }} />
          {/* Copyright component */}
        </Box>
      </Box>
    </AuthLayout>
  );
}

// Map Redux state to component props
const mapStatetoProps = ({ main }) => ({
  isLoading: main.loading, // Loading state
  isError: main.error, // Error state
});

// Connect Redux state and actions to the component
export default connect(mapStatetoProps, { registerUser })(SignUp);
