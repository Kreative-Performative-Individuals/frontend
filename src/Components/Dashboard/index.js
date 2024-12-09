import React, { useEffect } from "react";
import BasicCard from "../Common/BasicCard";
import Layout from "../Layout";
import "./style.scss";
import TotalMachineIcon from "../../Assets/Total Machines Icon.svg";
import TotalConsumption from "../../Assets/Consumption Logo.svg";
import TotalCost from "../../Assets/Total Cost.svg";
import TotalAlerts from "../../Assets/Total Alerts.svg";
import MachineUsageCard from "../Common/MachineUsageCard";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import ProductionCard from "../Common/ProductionCard";
import EnergyCard from "../Common/EnergyCard";
import { connect } from "react-redux";
import { getDashboardParams } from "../../store/main/actions";
import { truncateToFiveDecimals } from "../../constants/_helper";

function Dashboard( { getDashboardParams, loading, dashboardParams } ) {

  const navigate = useNavigate();
  
  useEffect(() => {
    getDashboardParams();
    // eslint-disable-next-line
  }, []);
  
  const cardData = [
    {
      id: 1,
      heading: "Total Machines",
      durationPresent: false,
      value: !loading && dashboardParams && dashboardParams.totalMachines,
      isStat: false,
      icon: TotalMachineIcon,
      iconBackground: "rgba(130, 128, 255, 0.25)",
    },
    {
      id: 2,
      heading: "Total Consumption",
      duration: "per day",
      value: `${!loading && dashboardParams && truncateToFiveDecimals(dashboardParams.totalConsumptionPerDay)} kWH`,
      isStat: false,
      statUpOrDown: "Up",
      statPercent: "1.3%",
      statText: "Up from yesterday",
      icon: TotalConsumption,
      iconBackground: "rgba(254, 197, 61, 0.25)",
    },
    {
      id: 3,
      heading: "Total Cost",
      duration: "per day",
      value: `${!loading && dashboardParams && truncateToFiveDecimals(dashboardParams.totalCostPerDay)} €`,
      isStat: false,
      statPercent: "4.3%",
      statText: "Down from yesterday",
      icon: TotalCost,
      iconBackground: "rgba(74, 217, 145, 0.25)",
    },
    {
      id: 4,
      heading: "Total Alerts",
      duration: "per day",
      value: !loading && dashboardParams && dashboardParams.totalAlarm,
      isStat: false,
      icon: TotalAlerts,
      iconBackground: "rgba(254, 144, 102, 0.25)",
    },
  ];
  
  const machines = [
    { machineId: "010001", machineName: "Assembly Machine 1", machineType: "Metal Cutting", machineStatus: "Working", chartData: [9, 6, 8, 1], efficiency: "90", density: "80", success_rate: "92", failure_rate: "8" },
    { machineId: "010002", machineName: "Assembly Machine 2", machineType: "Laser Cutting", machineStatus: "Offline", chartData: [14, 2, 4, 4], efficiency: "90", density: "80", success_rate: "92", failure_rate: "8" },
    { machineId: "010003", machineName: "Assembly Machine 3", machineType: "Laser Welding", machineStatus: "Idle", chartData: [7, 12, 3, 2], efficiency: "90", density: "80", success_rate: "92", failure_rate: "8" },
  ];

  const handleCardClick = (machineId) => {
    navigate(`/machines/${machineId}`); // Navigate to the machine detail page using the machineId
  };

  return (
    <React.Fragment>
      <Layout>
        <div className="dashboardStatsContainer">
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
        <div className="recentlyViewedContainer">
          <Typography variant="p" className='headerHeading'>Recently Viewed</Typography>
          <div className="recentlyViewed">
            {machines.map((machine, index) => (
              <MachineUsageCard
                key={index}
                machineName={machine.machineName} // Pass machine name to the card
                machineType={machine.machineType} // Pass machine type to the card
                machineStatus={machine.machineStatus} // Pass machine status to the card
                chartData={machine.chartData} // Pass chart data to the card
                onClick={() => handleCardClick(machine.machineId)} // Pass click handler to navigate
              />
            ))}
            {machines.map((machine, index) => (
              <ProductionCard
                key={index}
                machineName={machine.machineName} // Pass machine name to the card
                machineType={machine.machineType} // Pass machine type to the card
                machineStatus={machine.machineStatus} // Pass machine status to the card
                onClick={() => handleCardClick(machine.machineId)} // Pass click handler to navigate
                efficiency={machine.efficiency}
                density={machine.density}
                success_rate={machine.success_rate}
                failure_rate={machine.failure_rate}
              />
            ))}
            {machines.map((machine, index) => (
              <EnergyCard
                key={index}
                machineName={machine.machineName} // Pass machine name to the card
                machineType={machine.machineType} // Pass machine type to the card
                machineStatus={machine.machineStatus} // Pass machine status to the card
                onClick={() => handleCardClick(machine.machineId)} // Pass click handler to navigate
              />
            ))}
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
}

const mapStatetoProps = ({ main }) => ({
  dashboardParams: main.dashboardParams,
  loading: main.loading
});

export default connect(mapStatetoProps, { getDashboardParams })(Dashboard);