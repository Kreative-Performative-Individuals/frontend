import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AuthLayout from "..";
import Copyright from "../Copyright";
import { registerUser } from "../../../store/main/actions";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../style.scss";

function SignUp({ registerUser, isLoading, isError }) {

  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const registerData = {
      email: data.get("email"),
      password: data.get("password")
    }
    await registerUser(registerData, navigate);
  };
  return (
    <AuthLayout>
      <Box className="authContainer" >

        <Typography className="heading"> Create an account </Typography>
        <Typography className="subHeading"> Create an account to continue </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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


          {!isLoading && (
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
            <Box item>
              <Link to="/signin" variant="body2">
                {"Already have an account? Signin"}
              </Link>
            </Box>
          </Box>

          <Copyright sx={{ mt: 5 }} />
        </Box>
      </Box>
    </AuthLayout>
  );
}

const mapStatetoProps = ({ main }) => ({
  isLoading: main.loading,
  isError: main.error,
})

export default connect(mapStatetoProps, { registerUser })(SignUp);
