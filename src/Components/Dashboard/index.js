import React, { useEffect, useState } from "react";
import BasicCard from "../Common/BasicCard"; // Importing the BasicCard component for displaying stats
import Layout from "../Layout"; // Layout component for page structure
import "./style.scss"; // Styles for the Dashboard
import TotalMachineIcon from "../../Assets/Total Machines Icon.svg"; // Importing icons for different stats
import TotalConsumption from "../../Assets/Consumption Logo.svg";
import TotalCost from "../../Assets/Total Cost.svg";
import TotalAlerts from "../../Assets/Total Alerts.svg";
import MachineUsageCard from "../Common/MachineUsageCard"; // Card to display machine usage stats
import { useNavigate } from "react-router-dom"; // Hook for navigation between routes
import { Box, Button, Divider, List, ListItem, Typography } from "@mui/material"; // Material UI Typography for text elements
import ProductionCard from "../Common/ProductionCard"; // Card for production-related data
import EnergyCard from "../Common/EnergyCard"; // Card for energy-related data
import { connect } from "react-redux"; // Connecting to the Redux store
import { getDashboardParams } from "../../store/main/actions"; // Action to fetch dashboard parameters
import { truncateToFiveDecimals, formatDate } from "../../constants/_helper"; // Utility function to truncate decimal values
import { getLocal } from "../../constants/localstorage"; // Function to get data from local storage

// Dashboard component
function Dashboard( { getDashboardParams, loading, dashboardParams } ) {

  // useNavigate hook for routing between pages
  const navigate = useNavigate();
  
  // useState hook to manage the recently viewed machines (from local storage)
  const [recentlyViewed, setRecentlyViewed] = useState(JSON.parse(getLocal("recents"))); // eslint-disable-line
  const [mostlyViewed, setMostlyViewed] = useState(JSON.parse(getLocal("mostlyViewed"))); // eslint-disable-line

  // Destructure the recently viewed data
  const machinesUsage = recentlyViewed?.machines || []; // Extract machine usage data
  const productionMachines = recentlyViewed?.production || []; // Extract production machine data
  const energyMachines = recentlyViewed?.energy || []; // Extract energy machine data
  
  const mostlyViewedConfigurations = mostlyViewed || [];

  // useEffect hook to fetch dashboard parameters once on component mount
  useEffect(() => {
    getDashboardParams(); // Fetch dashboard params from the Redux store
    // eslint-disable-next-line
  }, []);

  const getSelectedMachineNames = (groupedSelectedMachines) => {
    const names = Object.values(groupedSelectedMachines)
      .flat()
      .map((machine) => `${machine.name}`);
    return names;
  };

  const onOpenConfiguration = (id) => {
    navigate(`/data-viewer?viewId=${id}`)
  }
  
  // Card data for various statistics displayed on the dashboard
  const cardData = [
    {
      id: 1,
      heading: "Total Machines", // Card heading
      durationPresent: false, // No duration field for this card
      value: !loading && dashboardParams && dashboardParams.totalMachines, // Total machine count
      isStat: false, // No statistics for this card
      icon: TotalMachineIcon, // Icon for the card
      iconBackground: "rgba(130, 128, 255, 0.25)", // Background color for the icon
    },
    {
      id: 2,
      heading: "Total Consumption", // Card heading
      duration: "per day", // Duration of consumption (daily)
      value: `${!loading && dashboardParams && truncateToFiveDecimals(dashboardParams.totalConsumptionPerDay)} kWH`, // Total consumption value
      isStat: false, // No statistics for this card
      statUpOrDown: "Up", // Upward change (for percentage)
      statPercent: "1.3%", // Percentage change
      statText: "Up from yesterday", // Contextual text for the stat
      icon: TotalConsumption, // Icon for the card
      iconBackground: "rgba(254, 197, 61, 0.25)", // Background color for the icon
    },
    {
      id: 3,
      heading: "Total Cost", // Card heading
      duration: "per day", // Duration for total cost (daily)
      value: `${!loading && dashboardParams && truncateToFiveDecimals(dashboardParams.totalCostPerDay)} €`, // Total cost value
      isStat: false, // No statistics for this card
      statPercent: "4.3%", // Percentage change for cost
      statText: "Down from yesterday", // Context for the stat change
      icon: TotalCost, // Icon for the card
      iconBackground: "rgba(74, 217, 145, 0.25)", // Background color for the icon
    },
    {
      id: 4,
      heading: "Total Alerts", // Card heading
      duration: "per day", // Duration for alerts (daily)
      value: !loading && dashboardParams && dashboardParams.totalAlarm, // Total number of alerts
      isStat: false, // No statistics for this card
      icon: TotalAlerts, // Icon for the card
      iconBackground: "rgba(254, 144, 102, 0.25)", // Background color for the icon
    },
  ];
  
  return (
    <React.Fragment>
      <Layout>
        <div className="dashboardStatsContainer">
          {/* Render BasicCard components for each cardData */}
          {cardData.map(({ id, heading, duration, value, isStat, statUpOrDown, statPercent, statText, icon, iconBackground }) => (
            <BasicCard
              key={id} // Using unique ID as key
              heading={heading}
              duration={duration}
              value={value}
              isStat={isStat}
              statUpOrDown={statUpOrDown}
              statPercent={statPercent}
              statText={statText}
              icon={icon}
              iconBackground={iconBackground}
            />
          ))}
        </div>

        <div className="mostlyViewedContainer">
          
          {/* Display the recently viewed machines */}
          <div className="mostlyViewed">
            {/* Render MachineUsageCard for machine usage data */}
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" gutterBottom>
                Mostly Viewed Configurations
              </Typography>
              {mostlyViewedConfigurations && mostlyViewedConfigurations.length > 0 ? (
                <List>
                  {mostlyViewedConfigurations.sort((a, b) => b.viewCount - a.viewCount).slice(0, 5).map((configuration, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            <strong>KPI:</strong> {configuration.data.kpi}
                          </Typography>
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            <strong>Operation:</strong>{" "}
                            {configuration.data.operation === "all" ? "All" : configuration.data.operation}
                          </Typography>
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            <strong>Selected Machines:</strong>{" "}
                            {getSelectedMachineNames(configuration.data.machines).length}
                          </Typography>
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            <strong>Range:</strong>{" "}
                            {`${formatDate(configuration.data.timeframe.startDate).substring(
                              0,
                              10
                            )} - ${formatDate(configuration.data.timeframe.endDate).substring(0, 10)}`}
                          </Typography>
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            <strong>Chart Type:</strong> {configuration.data.chartType}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ ml: 2 }}
                            onClick={() => onOpenConfiguration(configuration.id)}
                          >
                            View
                          </Button>
                        </Box>
                      </ListItem>
                      {index < mostlyViewedConfigurations.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
                  No Viewed Configurations
                </Typography>
              )}
            </Box>
          </div>
        </div>
        
        {/* Recently Viewed Machines */}
        <div className="recentlyViewedContainer">
          <Typography variant="h6" className='headerHeading'>Recently Viewed</Typography>
          {machinesUsage.length === 0 && productionMachines.length === 0 && energyMachines.length === 0 && (
            <Typography variant="h6" sx={{ ml: 2, mt: 2 }}>No Recently Viewed</Typography>
          )}
          
          <div className="recentlyViewed">
            {machinesUsage && machinesUsage.map((machine, index) => (
              <MachineUsageCard
                key={index}
                machineName={machine.name} // Pass machine name to the card
                machineType={machine.type} // Pass machine type to the card
                machineStatus={machine.status} // Pass machine status to the card
                chartData={machine.chartData} // Pass chart data to the card
                onClick={() => navigate(`/machines/${machine.asset_id}`)} // Pass click handler to navigate
              />
            ))}
            
            {productionMachines && productionMachines.map((machine, index) => (
              <ProductionCard
                  key={index}
                  machineName={machine.name} // Pass machine name to the card
                  machineType={machine.type} // Pass machine type to the card
                  machineStatus={machine.status} // Pass machine status to the card
                  onClick={() => navigate(`/production/${machine.asset_id}?machineName=${machine.name}&machineStatus=${machine.status}`)} // Pass click handler to navigate
                  efficiency={machine.efficiency}
                  success_rate={machine.success_rate}
                  failure_rate={machine.failure_rate}
                  good_cycles={machine.good_cycles}
                  bad_cycles={machine.bad_cycles}
                  total_cycles={machine.total_cycles}
                  average_cycle_time={machine.average_cycle_time}
              />
            ))}
            
            {energyMachines && energyMachines.map((machine, index) => (
              <EnergyCard
                  key={index}
                  machineName={machine.name} // Pass machine name to the card
                  machineType={machine.type} // Pass machine type to the card
                  machineStatus={machine.status} // Pass machine status to the card
                  total_consumption={machine.total_consumption}
                  working_consumption={machine.working_consumption}
                  total_cycles_sum={machine.total_cycles_sum}
                  onClick={() => navigate(`/energy/${machine.asset_id}?machineName=${machine.name}&machineStatus=${machine.status}`)} // Pass click handler to navigate
              />
            ))}
          </div>
        </div>


        
      </Layout>
    </React.Fragment>
  );
}

// mapStateToProps function to connect the Redux state to the component
const mapStatetoProps = ({ main }) => ({
  dashboardParams: main.dashboardParams,
  loading: main.loading // Fetch dashboard params and loading state from Redux store
});

export default connect(mapStatetoProps, { getDashboardParams })(Dashboard); // Connect the component to Redux and dispatch the action to fetch dashboard parameters
