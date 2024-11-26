import * as React from "react"; // Import React library
import ListItemButton from "@mui/material/ListItemButton"; // Import Material-UI ListItemButton
import ListItemIcon from "@mui/material/ListItemIcon"; // Import Material-UI ListItemIcon
import ListItemText from "@mui/material/ListItemText"; // Import Material-UI ListItemText
import DashboardIcon from "@mui/icons-material/Dashboard"; // Import Dashboard icon
import FactoryIcon from '@mui/icons-material/Factory'; // Import Factory icon
import BusinessIcon from '@mui/icons-material/Business'; // Import Business icon
import BoltIcon from '@mui/icons-material/Bolt'; // Import Bolt icon
import EuroIcon from '@mui/icons-material/Euro'; // Import Euro icon
import QueryStatsIcon from '@mui/icons-material/QueryStats'; // Import QueryStats icon
import LogoutIcon from '@mui/icons-material/Logout'; // Import Logout icon
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation from react-router-dom
import "./style.scss"; // Import custom styles
import { getLocal } from "../../constants/localstorage";

const MainListItems = () => {
  const location = useLocation(); // Get the current location from the router

  const [smoView, setSmoView] = React.useState(false);

    React.useEffect(() => {
        const user = getLocal("authUser");
        const userData = JSON.parse(user);
        if (userData.email.includes("smo")) {
            setSmoView(true);
        }
    }, [])
  return (
    <React.Fragment>
      <div className="sidebar">
        {/* Each list item checks if the current pathname matches and applies the 'active' class accordingly */}
        <div className={`listItem ${location.pathname === "/dashboard" && "active"}`}>
          <ListItemButton component={Link} to="/dashboard" className="listBtn">
            <ListItemIcon>
              <DashboardIcon className="iconStyle" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </div>
  
        <div className={`listItem ${location.pathname.includes("machines") && "active"}`}>
          <ListItemButton component={Link} to="/machines" className="listBtn">
            <ListItemIcon>
              <BusinessIcon className="iconStyle" />
            </ListItemIcon>
            <ListItemText primary="Machine Usage" />
          </ListItemButton>
        </div>

        <div className={`listItem ${location.pathname.includes("production") && "active"}`}>
          <ListItemButton component={Link} to="/production" className="listBtn">
            <ListItemIcon>
              <FactoryIcon className="iconStyle" />
            </ListItemIcon>
            <ListItemText primary="Production" />
          </ListItemButton>
        </div>
  
        <div className={`listItem ${location.pathname.includes("energy") && "active"}`}>
          <ListItemButton component={Link} to="/energy" className="listBtn">
            <ListItemIcon>
              <BoltIcon className="iconStyle" />
            </ListItemIcon>
            <ListItemText primary="Energy" />
          </ListItemButton>
        </div>
  
        {smoView && (
          <div className={`listItem ${location.pathname === "/financial" && "active"}`}>
            <ListItemButton component={Link} to="/financial" className="listBtn">
              <ListItemIcon>
                <EuroIcon className="iconStyle" />
              </ListItemIcon>
              <ListItemText primary="Financials" />
            </ListItemButton>
          </div>
        )}
  
        <div className={`listItem ${location.pathname === "/custom-kpi" && "active"}`}>
          <ListItemButton component={Link} to="/custom-kpi" className="listBtn">
            <ListItemIcon>
              <DashboardIcon className="iconStyle" />
            </ListItemIcon>
            <ListItemText primary="Custom KPIs" />
          </ListItemButton>
        </div>
  
        <div className={`listItem ${location.pathname === "/reports" && "active"}`}>
          <ListItemButton component={Link} to="/reports" className="listBtn">
            <ListItemIcon>
              <QueryStatsIcon className="iconStyle" />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItemButton>
        </div>
      </div>
    </React.Fragment>
  );
}

// Secondary list items (e.g., Logout button)
const secondaryListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/logout">
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  </React.Fragment>
);

// Export the main and secondary list items
export { MainListItems, secondaryListItems };