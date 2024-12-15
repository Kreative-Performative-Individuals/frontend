import React from 'react'; // Import React library
import { Box, Typography } from '@mui/material'; // Import Material-UI components for layout and typography
import "./style.scss"; // Import styles specific to this component
import { capitalizeFirstLetter, truncateToFiveDecimals } from '../../../constants/_helper';


const EnergyCard = ({ machineName, machineType, machineStatus, total_consumption, working_consumption, total_cycles_sum, onClick }) => {

    return (
        <React.Fragment>
            <Box className="energyCard" onClick={onClick} style={{ cursor: 'pointer' }}>
                <Box className="cardHead">
                    <Box>
                        <Typography className='machineName'>{machineName}</Typography> {/* Display machine name */}
                        <Typography className='machineType'>{machineType}</Typography> {/* Display machine type */}
                    </Box>
                    {/* Display machine status with conditional styling based on status */}
                    <Box className={`machineStatus ${machineStatus === "working" && "working"} ${machineStatus === "offline" && "offline"} ${machineStatus === "idle" && "idle"} ${machineStatus === "independent" && "Independent"}`}>
                        {capitalizeFirstLetter(machineStatus)}
                    </Box>
                </Box>

                <Box className="energyCardBody">
                    <Typography className='rowHeading'>Consumption</Typography>
                    <Box className="statRow">
                        <CardBoxStyle heading={"Total"} value={`${truncateToFiveDecimals(total_consumption)} kWh`} />
                        <CardBoxStyle heading={"Working"} value={`${truncateToFiveDecimals(working_consumption)} kWh`} />
                        <CardBoxStyle heading={"Idle"} value={`${truncateToFiveDecimals(total_consumption - working_consumption)} kWh`} />
                    </Box>
                    <Typography className='rowHeading'>Sustainability</Typography>
                    <Box className="statRow">
                        <CardBoxStyle heading={"Total Carbon Footprint"} value={`${truncateToFiveDecimals(total_consumption*400)} kgCO2`} />
                        <CardBoxStyle heading={"Carbon Footprint / Cycle"} value={`${total_cycles_sum === 0 ? "Not Available" : `${truncateToFiveDecimals((total_consumption*400)/ total_cycles_sum) || 0} CO2e/unit`}`} />
                    </Box>
                    <Typography className='rowHeading'>Energy</Typography>
                    <Box className="statRow">
                        <CardBoxStyle heading={"Energy Efficiency"} value={`${total_cycles_sum === 0 ? "Not Available" : `${truncateToFiveDecimals((total_consumption*400) / total_cycles_sum) || 0} kWh/cycle`}`} />
                        <CardBoxStyle heading={"Power Mean"} value={"0.002 kWh"} />
                    </Box>
                    
                </Box>

            </Box>
        </React.Fragment>
    );
}

export default EnergyCard;

const CardBoxStyle = ({heading, value}) => {
    return (
        <Box className="boxStyle">
            <Typography className='heading' >{heading}</Typography>
            <Typography className='value' >{value}</Typography>
        </Box>
    )
}