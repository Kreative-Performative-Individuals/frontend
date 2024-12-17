import * as React from "react"; // Import React library
import Button from "@mui/material/Button"; // Import MUI Button component
import TextField from "@mui/material/TextField"; // Import MUI TextField component
import Box from "@mui/material/Box"; // Import MUI Box component for layout
import Typography from "@mui/material/Typography"; // Import MUI Typography for text styling
import AuthLayout from ".."; // Import AuthLayout for consistent authentication page design
import { Link } from "react-router-dom"; // Import Link for navigation
import Copyright from "../Copyright"; // Import the Copyright component for footer
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation
import { connect } from "react-redux"; // Import connect to link Redux state and actions
import { userLogin } from "../../../store/main/actions"; // Import userLogin action for dispatching login functionality
import "../style.scss"; // Import component-specific styles
import { ButtonGroup } from "@mui/material"; // Import MUI ButtonGroup for grouping buttons

function SignIn({ userLogin, loading, loginError, isAuth, errMsg }) {
  const navigate = useNavigate(); // Initialize navigate for redirection
  const [userAuth, setUserAuth] = React.useState({
    email: "", // User's email
    password: "", // User's password
    role: undefined, // User's role (optional)
  });

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const data = new FormData(event.currentTarget); // Extract form data
    const email = data.get("email"); // Get email from form
    const password = data.get("password"); // Get password from form
    if (email && password) {
      // If both email and password are provided
      await userLogin(
        {
          email: email,
          password: password,
        },
        navigate // Pass navigate to allow redirection after login
      );
    }
  };

  return (
    <AuthLayout>
      <Box className="authContainer">
        {/* Container for the sign-in form */}
        <Typography className="heading"> Login to account </Typography>
        {/* Heading text */}

        <Box
          sx={{ display: "flex", alignItems: "center", gap: "1rem", mt: 1, mb: 1 }}
        >
          <Typography> Demo Login as </Typography>
          {/* Demo login section */}
          <ButtonGroup variant="outlined" aria-label="Demo Accounts">
            <Button
              variant={userAuth.role === "smo" ? "contained" : "outlined"}
              onClick={() =>
                setUserAuth({
                  email: "smo@kreative.org",
                  password: "P@ssword",
                  role: "smo",
                })
              }
            >
              SMO
            </Button>
            <Button
              variant={userAuth.role === "ffm" ? "contained" : "outlined"}
              onClick={() =>
                setUserAuth({
                  email: "ffm@kreative.org",
                  password: "P@ssword",
                  role: "ffm",
                })
              }
            >
              FFM
            </Button>
          </ButtonGroup>
        </Box>

        <Typography className="subHeading">
          {" "}
          Please enter your email and password to continue{" "}
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
            value={userAuth.email}
            onChange={(e) =>
              setUserAuth((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={userAuth.password}
            onChange={(e) =>
              setUserAuth((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            {/* Links for forgot password and sign-up */}
            <Box>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Box>
            <Box>
              <Link to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>

          {!loading && (
            <Box sx={{ textAlign: "center" }}>
              {/* Sign-in button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 1, mb: 2 }}
                disabled={!userAuth.email || !userAuth.password}
              >
                Sign In
              </Button>
            </Box>
          )}
          <Copyright sx={{ mt: 5 }} />
          {/* Copyright component */}
        </Box>
      </Box>
    </AuthLayout>
  );
}

// Map Redux state to component props
const mapStatetoProps = ({ main }) => ({
  loading: main.loading, // Loading state
  loginError: main.loginError, // Login error status
  isAuth: main.isAuth, // Authentication status
  errMsg: main.errMsg, // Error message
});

// Connect Redux state and actions to the component
export default connect(mapStatetoProps, { userLogin })(SignIn);
