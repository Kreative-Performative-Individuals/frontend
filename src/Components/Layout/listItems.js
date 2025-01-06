import * as React from "react"; // Import React library
import ListItemButton from "@mui/material/ListItemButton"; // Import Material-UI ListItemButton to handle clickable list items
import ListItemIcon from "@mui/material/ListItemIcon"; // Import Material-UI ListItemIcon to display icons in list items
import ListItemText from "@mui/material/ListItemText"; // Import Material-UI ListItemText to display text in list items
import DashboardIcon from "@mui/icons-material/Dashboard"; // Import Dashboard icon
import FactoryIcon from '@mui/icons-material/Factory'; // Import Factory icon
import BusinessIcon from '@mui/icons-material/Business'; // Import Business icon
import BoltIcon from '@mui/icons-material/Bolt'; // Import Bolt icon for Energy
import EuroIcon from '@mui/icons-material/Euro'; // Import Euro icon for Financials
import QueryStatsIcon from '@mui/icons-material/QueryStats'; // Import QueryStats icon for Reports
import UpdateIcon from '@mui/icons-material/Update'; // Import UpdateIcon icon for Forecasting
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna'; // Import SettingsInputAntennaIcon icon for Real Time
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation from react-router-dom for navigation
import "./style.scss"; // Import custom styles for the sidebar
import { getLocal } from "../../constants/localstorage"; // Import a helper function to get data from local storage

// MainListItems component which contains the list of items in the sidebar
const MainListItems = () => {
  const location = useLocation(); // Get the current location from the router, to highlight the active link
  const [smoView, setSmoView] = React.useState(false); // State to track if the user is an SMO (Specialized Manufacturing Owner)

  // useEffect to check if the user is an SMO by reading data from local storage
  React.useEffect(() => {
    const user = getLocal("authUser"); // Get the 'authUser' data from local storage
    const userData = JSON.parse(user); // Parse the user data to JSON object
    if (userData && userData.email.includes("smo")) { // Check if the email contains "smo"
        setSmoView(true); // Set the SMO view flag to true if the user is an SMO
    }
  }, []) // Empty dependency array means this effect runs only once after component mounts

  return (
    <React.Fragment>
      <div className="sidebar"> {/* Sidebar container */}
        {/* List Item for Dashboard, highlights active link if the current location is "/dashboard" */}
        <div className={`listItem ${location.pathname === "/dashboard" && "active"}`}>
          <ListItemButton component={Link} to="/dashboard" className="listBtn">
            <ListItemIcon>
              <DashboardIcon className="iconStyle" /> {/* Dashboard icon */}
            </ListItemIcon>
            <ListItemText primary="Dashboard" /> {/* Dashboard text */}
          </ListItemButton>
        </div>

        {/* List Item for Machine Usage, highlights active link if the current location includes "machines" */}
        <div className={`listItem ${location.pathname.includes("machines") && "active"}`}>
          <ListItemButton component={Link} to="/machines" className="listBtn">
            <ListItemIcon>
              <BusinessIcon className="iconStyle" /> {/* Business icon for Machine Usage */}
            </ListItemIcon>
            <ListItemText primary="Machine Usage" /> {/* Machine Usage text */}
          </ListItemButton>
        </div>

        {/* List Item for Production, highlights active link if the current location includes "production" */}
        <div className={`listItem ${location.pathname.includes("production") && "active"}`}>
          <ListItemButton component={Link} to="/production" className="listBtn">
            <ListItemIcon>
              <FactoryIcon className="iconStyle" /> {/* Factory icon for Production */}
            </ListItemIcon>
            <ListItemText primary="Production" /> {/* Production text */}
          </ListItemButton>
        </div>

        {/* List Item for Energy, highlights active link if the current location includes "energy" */}
        <div className={`listItem ${location.pathname.includes("energy") && "active"}`}>
          <ListItemButton component={Link} to="/energy" className="listBtn">
            <ListItemIcon>
              <BoltIcon className="iconStyle" /> {/* Bolt icon for Energy */}
            </ListItemIcon>
            <ListItemText primary="Energy" /> {/* Energy text */}
          </ListItemButton>
        </div>

        {/* Conditionally render Financials menu item only if the user is an SMO */}
        {smoView && (
          <div className={`listItem ${location.pathname === "/financial" && "active"}`}>
            <ListItemButton component={Link} to="/financial" className="listBtn">
              <ListItemIcon>
                <EuroIcon className="iconStyle" /> {/* Euro icon for Financials */}
              </ListItemIcon>
              <ListItemText primary="Financials" /> {/* Financials text */}
            </ListItemButton>
          </div>
        )}

        {/* Conditionally render Reports menu item only if the user is an SMO */}
        {smoView && (
          <div className={`listItem ${location.pathname.includes("reports") && "active"}`}>
            <ListItemButton component={Link} to="/reports" className="listBtn">
              <ListItemIcon>
                <QueryStatsIcon className="iconStyle" /> {/* QueryStats icon for Reports */}
              </ListItemIcon>
              <ListItemText primary="Reports" /> {/* Reports text */}
            </ListItemButton>
          </div>
        )}
        
        {/* List Item for Forecast, highlights active link if the current location is "/forecast" */}
        <div className={`listItem ${location.pathname.includes("forecast") && "active"}`}>
          <ListItemButton component={Link} to="/forecast" className="listBtn">
            <ListItemIcon>
              <UpdateIcon className="iconStyle" /> {/* QueryStats icon for Forecast */}
            </ListItemIcon>
            <ListItemText primary="Forecast" /> {/* forecast text */}
          </ListItemButton>
        </div>
        
        {/* List Item for Real Time Session, highlights active link if the current location is "/real-time" */}
        <div className={`listItem ${location.pathname === "/real-time" && "active"}`}>
          <ListItemButton component={Link} to="/real-time" className="listBtn">
            <ListItemIcon>
              <SettingsInputAntennaIcon className="iconStyle" /> {/* QueryStats icon for Real Time Session */}
            </ListItemIcon>
            <ListItemText primary="Real Time Session" /> {/* Real Time Session text */}
          </ListItemButton>
        </div>
        
        {/* <div className={`listItem ${location.pathname === "/custom-kpi" && "active"}`}>
          <ListItemButton component={Link} to="/custom-kpi" className="listBtn">
            <ListItemIcon>
              <SettingsInputAntennaIcon className="iconStyle" />
            </ListItemIcon>
            <ListItemText primary="Custom KPI" />
          </ListItemButton>
        </div> */}
        
        <div className={`listItem ${location.pathname === "/data-viewer" && "active"}`}>
          <ListItemButton component={Link} to="/data-viewer" className="listBtn">
            <ListItemIcon>
              <DataThresholdingIcon className="iconStyle" /> {/* DataThresholdingIcon icon for Data Viewer */}
            </ListItemIcon>
            <ListItemText primary="Data Viewer" /> {/* Data Viewer text */}
          </ListItemButton>
        </div>

      </div>
    </React.Fragment>
  );
}

// Export the MainListItems component
export { MainListItems };
