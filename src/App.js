import React from "react"; // Import React library for building UI components
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"; // Import routing components for navigation
import SignUp from "./Components/Authentication/SignUp"; // Import SignUp component
import SignIn from "./Components/Authentication/SignIn"; // Import SignIn component
import Dashboard from "./Components/Dashboard"; // Import Dashboard component
import Logout from "./Components/Logout"; // Import Logout component
import MachineUsage from "./Components/MachineUsage"; // Import MachineUsage component
import MachineDetail from "./Components/MachineDetail"; // Import MachineDetail component
import Production from "./Components/Production"; // Import Production component
import ProductionDetail from "./Components/ProductionDetail"; // Import ProductionDetail component
import Energy from "./Components/Energy"; // Import Energy component
import EnergyDetail from "./Components/EnergyDetail"; // Import EnergyDetail component
import RealTime from "./Components/RealTime"; // Import RealTime component
import FinancialReport from "./Components/Financial"; // Import FinancialReport component

function App() {
  // Create a router object that defines all application routes and their corresponding components
  const router = createBrowserRouter([
    {
      path: "/signup", // Route for the SignUp page
      element: <SignUp />, // Render the SignUp component for this route
    },
    {
      path: "/signin", // Route for the SignIn page
      element: <SignIn />, // Render the SignIn component for this route
    },
    {
      path: "/dashboard", // Route for the Dashboard page
      element: <Dashboard />, // Render the Dashboard component for this route
    },
    {
      path: "/machines", // Route for viewing machine usage
      element: <MachineUsage />, // Render the MachineUsage component for this route
    },
    {
      path: "/machines/:machineId", // Route for viewing details of a specific machine
      element: <MachineDetail />, // Render the MachineDetail component for this route
    },
    {
      path: "/production", // Route for viewing production data
      element: <Production />, // Render the Production component for this route
    },
    {
      path: "/production/:machineId", // Route for viewing production details of a specific machine
      element: <ProductionDetail />, // Render the ProductionDetail component for this route
    },
    {
      path: "/energy", // Route for viewing energy usage data
      element: <Energy />, // Render the Energy component for this route
    },
    {
      path: "/energy/:machineId", // Route for viewing energy details of a specific machine
      element: <EnergyDetail />, // Render the EnergyDetail component for this route
    },
    {
      path: "/financial", // Route for viewing financial reports
      element: <FinancialReport />, // Render the FinancialReport component for this route
    },
    {
      path: "/real-time", // Route for viewing real-time machine data
      element: <RealTime />, // Render the RealTime component for this route
    },
    {
      path: "/logout", // Route for logging out of the application
      element: <Logout />, // Render the Logout component for this route
    },
    {
      path: "*", // Wildcard route to handle undefined paths
      element: <Navigate to="/signin" replace />, // Redirect any unmatched routes to the SignIn page
    },
  ]);

  return (
    <React.Fragment>
      {/* RouterProvider integrates the defined router into the application */}
      <RouterProvider router={router} />
    </React.Fragment>
  );
}

export default App; // Export the App component as the default export
