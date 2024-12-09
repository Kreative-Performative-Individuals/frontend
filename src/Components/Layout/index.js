import React, { useState } from "react"; // Import React and useState hook
import { styled, createTheme, ThemeProvider } from "@mui/material/styles"; // Import Material-UI styling utilities
import MuiDrawer from "@mui/material/Drawer"; // Import Material-UI Drawer component
import Box from "@mui/material/Box"; // Import Material-UI Box component
import MuiAppBar from "@mui/material/AppBar"; // Import Material-UI AppBar component
import Toolbar from "@mui/material/Toolbar"; // Import Material-UI Toolbar component
import List from "@mui/material/List"; // Import Material-UI List component
import Typography from "@mui/material/Typography"; // Import Material-UI Typography component
import Divider from "@mui/material/Divider"; // Import Material-UI Divider component
import IconButton from "@mui/material/IconButton"; // Import Material-UI IconButton component
import DehazeIcon from '@mui/icons-material/Dehaze'; // Import Dehaze icon for the menu button
import { MainListItems } from "./listItems"; // Import main and secondary list items for the sidebar
import Copyright from "../Authentication/Copyright"; // Import Copyright component
// import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonIcon from '@mui/icons-material/Person';
import { getLocal } from "../../constants/localstorage";
import Chatbot from "./ChatUI";
import LogoutIcon from '@mui/icons-material/Logout'; // Import Logout icon
import { useNavigate } from "react-router-dom"; // Import useNavigate hook from react-router-dom

// import setDefaultToken, { getLocal } from "../../constants/localstorage"; // Import local storage utility functions

const drawerWidth = 220; // Set the width of the drawer

// Styled AppBar component with dynamic styles based on the drawer state
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: prop => prop !== "open" // Prevent the 'open' prop from being forwarded
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1, // Ensure AppBar is above the Drawer
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        marginLeft: drawerWidth, // Adjust margin when drawer is open
        width: `calc(100% - ${drawerWidth}px)`, // Adjust width when drawer is open
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}));

// Styled Drawer component with dynamic styles based on the drawer state
const Drawer = styled(MuiDrawer, {
    shouldForwardProp: prop => prop !== "open" // Prevent the 'open' prop from being forwarded
})(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth, // Set the width of the drawer
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        boxSizing: "border-box",
        ...(!open && {
            overflowX: "hidden", // Hide overflow when drawer is collapsed
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }),
            width: theme.spacing(7), // Set collapsed width
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(9) // Set collapsed width for larger screens
            }
        })
    }
}));

const defaultTheme = createTheme(); // Create a default theme for Material-UI

const Layout = ({ children }) => {
    const [open, setOpen] = useState(true); // State to manage drawer open/close
    // const [mainToken, setMainToken] = useState(false); // State for authentication token (commented out)

    const toggleDrawer = () => {
        setOpen(!open); // Toggle the drawer open/close state
    };

    const [smoView, setSmoView] = React.useState(false);
    const [userMail, setUserMail] = React.useState("");

    React.useEffect(() => {
        const user = getLocal("authUser");
        const userData = JSON.parse(user);
        if (userData) {
            setUserMail(userData.email);
            if (userData.email.includes("smo")) {
                setSmoView(true);
            }
        } else {
            navigate("/signin")
        }
        // eslint-disable-next-line
    }, [])

    const navigate = useNavigate(); // Initialize navigate function for routing
    // useEffect(() => {
    //   const token = getLocal("token"); // Retrieve token from local storage
    //   if (token) {
    //     setDefaultToken("Authorization", token); // Set default token for API calls
    //     setMainToken(token); // Set main token state
    //   } else {
    //     navigate("/signin"); // Redirect to signin if no token
    //   }
    //   // eslint-disable-next-line
    // }, []);

    const handleLogout = () => {
        navigate("/logout");
    }



    return (
        <React.Fragment>
            <ThemeProvider theme={defaultTheme}> {/* Provide the default theme to the component */}
            <Chatbot />
                <Box sx={{ display: "flex" }}>
                    {/* <Css Baseline /> */}
                    <AppBar position="absolute" open={open} style={{ backgroundColor: "#fff", color: "#202224" }}>
                        <Toolbar
                            sx={{
                                pr: "24px"
                            }}
                        >
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={toggleDrawer} // Toggle drawer on button click
                                sx={{
                                    marginRight: "36px",
                                }}
                            >
                                <DehazeIcon /> {/* Icon for the drawer toggle button */}
                            </IconButton>
                            <Typography sx={{ flexGrow: 1 }} ></Typography>
                            <div>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>

                                    {/* <NotificationsNoneIcon sx={{ fontSize: "35px" }} /> */}

                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <div><PersonIcon sx={{ fontSize: "40px" }} /></div>
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                            <Typography sx={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>{userMail}</Typography>
                                            <Typography sx={{ color: "#565656", fontSize: "12px", marginTop: "-4px" }}>{smoView ? "SMO" : "FFM"}</Typography>
                                        </Box>
                                    </Box>

                                    <Box onClick={handleLogout} style={{ cursor: "pointer" }}>
                                        <LogoutIcon />
                                    </Box>

                                </Box>
                            </div>
                        </Toolbar>
                    </AppBar>

                    <Drawer variant="permanent" open={open}> {/* Permanent drawer that remains open */}
                        <div style={{ position: open && "fixed" }}>
                            <Toolbar
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <div style={{ fontWeight: "bold", color: "#202224", fontSize: "20px" }}>
                                    <span style={{ color: "#4880FF" }}>Krea</span>tive {/* Brand name */}
                                </div>
                            </Toolbar>
                            <Divider /> {/* Divider for visual separation */}
                            <List component="nav">
                                <MainListItems /> {/* Main sidebar items */}
                                <Divider sx={{ my: 1 }} />
                            </List>

                            {/* <List component="nav" style={{ marginTop: "12rem" }}>
                                <Divider sx={{ my: 1 }} />
                                {secondaryListItems}
                            </List> */}
                        </div>
                    </Drawer>

                    <Box
                        component="main"
                        sx={{
                            backgroundColor: "#F5F6FA", // Main content background color
                            flexGrow: 1,
                            // height: "95vh", // Set height for the main content area
                            overflow: "auto", // Enable scrolling if content overflows
                            padding: "1rem" // Padding for the main content
                        }}
                    >
                        <Toolbar /> {/* Toolbar for spacing */}

                        {/* Dashboard Layout */}
                        {children} {/* Render child components here */}

                        {/* Copyright */}
                        <Copyright sx={{ pt: 4 }} /> {/* Copyright component at the bottom */}

                    </Box>
                </Box>
            </ThemeProvider>
        </React.Fragment>
    )
}

export default Layout; // Export the Layout component