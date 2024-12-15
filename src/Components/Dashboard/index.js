import React, { useEffect, useState } from "react";
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
import { getLocal } from "../../constants/localstorage";

function Dashboard( { getDashboardParams, loading, dashboardParams } ) {

  const navigate = useNavigate();
  
  const [recentlyViewed, setRecentlyViewed] = useState(JSON.parse(getLocal("recents"))); // eslint-disable-line

  console.log(recentlyViewed)
  const machinesUsage = recentlyViewed?.machines || [];
  const productionMachines = recentlyViewed?.production || [];
  const energyMachines = recentlyViewed?.energy || [];

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
          {machinesUsage.length === 0 && productionMachines.length === 0 && energyMachines.length === 0 && (
            <Typography variant="h6" sx={{ ml: 2, mt: 2 }}>No Recently Viewed</Typography>
          ) }
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
                  onClick={() => navigate(`/energy/${machine.asset_id}?machineName=${machine.name}&machineStatus=${machine.status}`)}
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