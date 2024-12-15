import React from 'react'; // Import React library
import { Box, Typography } from '@mui/material'; // Import Material-UI components for layout and typography
import "./style.scss"; // Import styles specific to this component
import { capitalizeFirstLetter, truncateToFiveDecimals } from '../../../constants/_helper'; // Helper functions for formatting values

// EnergyCard component that displays machine details and energy data
const EnergyCard = ({ machineName, machineType, machineStatus, total_consumption, working_consumption, total_cycles_sum, onClick }) => {

    return (
        <React.Fragment>
            {/* The main container for the energy card, includes an onClick event handler */}
            <Box className="energyCard" onClick={onClick} style={{ cursor: 'pointer' }}>
                
                {/* Header section with machine name, type, and status */}
                <Box className="cardHead">
                    <Box>
                        {/* Displaying machine name and type */}
                        <Typography className='machineName'>{machineName}</Typography>
                        <Typography className='machineType'>{machineType}</Typography>
                    </Box>
                    {/* Machine status section with conditional styling */}
                    <Box className={`machineStatus ${machineStatus === "working" && "working"} ${machineStatus === "offline" && "offline"} ${machineStatus === "idle" && "idle"} ${machineStatus === "independent" && "Independent"}`}>
                        {capitalizeFirstLetter(machineStatus)} {/* Capitalizing the first letter of the status */}
                    </Box>
                </Box>

                {/* Energy consumption details */}
                <Box className="energyCardBody">
                    <Typography className='rowHeading'>Consumption</Typography>
                    <Box className="statRow">
                        {/* Displaying total, working, and idle energy consumption */}
                        <CardBoxStyle heading={"Total"} value={`${truncateToFiveDecimals(total_consumption)} kWh`} />
                        <CardBoxStyle heading={"Working"} value={`${truncateToFiveDecimals(working_consumption)} kWh`} />
                        <CardBoxStyle heading={"Idle"} value={`${truncateToFiveDecimals(total_consumption - working_consumption)} kWh`} />
                    </Box>

                    {/* Sustainability metrics */}
                    <Typography className='rowHeading'>Sustainability</Typography>
                    <Box className="statRow">
                        {/* Displaying total carbon footprint and carbon footprint per cycle */}
                        <CardBoxStyle heading={"Total Carbon Footprint"} value={`${truncateToFiveDecimals(total_consumption*400)} kgCO2`} />
                        <CardBoxStyle heading={"Carbon Footprint / Cycle"} value={`${total_cycles_sum === 0 ? "Not Available" : `${truncateToFiveDecimals((total_consumption*400)/ total_cycles_sum) || 0} CO2e/unit`}`} />
                    </Box>

                    {/* Energy efficiency metrics */}
                    <Typography className='rowHeading'>Energy</Typography>
                    <Box className="statRow">
                        {/* Displaying energy efficiency and power mean */}
                        <CardBoxStyle heading={"Energy Efficiency"} value={`${total_cycles_sum === 0 ? "Not Available" : `${truncateToFiveDecimals((total_consumption*400) / total_cycles_sum) || 0} kWh/cycle`}`} />
                        <CardBoxStyle heading={"Power Mean"} value={"0.002 kWh"} />
                    </Box>
                </Box>

            </Box>
        </React.Fragment>
    );
}

export default EnergyCard;

// CardBoxStyle is a presentational component used to display individual data points within the energy card
const CardBoxStyle = ({heading, value}) => {
    return (
        <Box className="boxStyle">
            {/* Heading and value for each piece of data */}
            <Typography className='heading' >{heading}</Typography>
            <Typography className='value' >{value}</Typography>
        </Box>
    )
}