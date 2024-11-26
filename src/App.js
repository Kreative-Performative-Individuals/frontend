import React from "react"; // Import React library
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"; // Import necessary components from react-router-dom
import SignUp from "./Components/Authentication/SignUp"; // Import SignUp component
import SignIn from "./Components/Authentication/SignIn"; // Import SignIn component
import Dashboard from "./Components/Dashboard"; // Import Dashboard component
import Logout from "./Components/Logout"; // Import Logout component
import MachineUsage from "./Components/MachineUsage"; // Import MachineUsage component
import MachineDetail from "./Components/MachineDetail";
import Production from "./Components/Production";
import ProductionDetail from "./Components/ProductionDetail";
import Energy from "./Components/Energy";
import EnergyDetail from "./Components/EnergyDetail";

function App() {
  // Create a router object with defined routes
  const router = createBrowserRouter([
    {
      path: "/signup", // Route for SignUp
      element: <SignUp />, // Component to render for this route
    },
    {
      path: "/signin", // Route for SignIn
      element: <SignIn />, // Component to render for this route
    },
    {
      path: "/dashboard", // Route for Dashboard
      element: <Dashboard />, // Component to render for this route
    },
    {
      path: "/machines", // Route for MachineUsage
      element: <MachineUsage />, // Component to render for this route
    },
    {
      path: "/machines/:machineId", // Route for specific machine details
      element: <MachineDetail />, // Component to render for this route
    },
    {
      path: "/production", // Route for MachineUsage
      element: <Production />, // Component to render for this route
    },
    {
      path: "/production/:machineId", // Route for specific machine details
      element: <ProductionDetail />, // Component to render for this route
    },
    {
      path: "/energy", // Route for MachineUsage
      element: <Energy />, // Component to render for this route
    },
    {
      path: "/energy/:machineId", // Route for specific machine details
      element: <EnergyDetail />, // Component to render for this route
    },
    {
      path: "/logout", // Route for Logout
      element: <Logout />, // Component to render for this route
    },
    {
      path: "*", // Wildcard route for handling unknown paths
      element: <Navigate to="/signin" replace />, // Redirect to SignIn for any unmatched routes
    }
  ]);

  return (
    <React.Fragment>
      <RouterProvider router={router} /> {/* Provide the router to the application */}
    </React.Fragment>
  );
}

export default App; // Export the App component as the default export