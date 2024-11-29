import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AuthLayout from "..";
import { Link } from "react-router-dom";
import Copyright from "../Copyright";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { userLogin } from "../../../store/main/actions";
import "../style.scss";

function SignIn({ userLogin, loading, loginError, isAuth, errMsg }) {

  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log();
    await userLogin({
      email: data.get("email"),
      password: data.get("password")
    }, navigate)
  };
  return (
    <AuthLayout>
      <Box className="authContainer" >

        <Typography className="heading"> Login to account </Typography>
        <Typography className="subHeading"> Please enter your email and password to continue </Typography>

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
          
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Box item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Box>
            <Box item>
              <Link to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
          {!loading && (
            <Box sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 1, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          )}
          <Copyright sx={{ mt: 5 }} />
        </Box>
      </Box>
    </AuthLayout>
  );
}

const mapStatetoProps = ({ main }) => ({
  loading: main.loading,
  loginError: main.loginError,
  isAuth: main.isAuth,
  errMsg: main.errMsg
})

export default connect(mapStatetoProps, { userLogin })(SignIn);
