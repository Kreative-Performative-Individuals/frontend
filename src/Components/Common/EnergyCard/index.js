import React from 'react'; // Import React library
import { Box, Typography } from '@mui/material'; // Import Material-UI components for layout and typography
import "./style.scss"; // Import styles specific to this component


const EnergyCard = ({ machineName, machineType = "Metal Cutting", machineStatus, onClick }) => {

    return (
        <React.Fragment>
            <Box className="energyCard" onClick={onClick} style={{ cursor: 'pointer' }}>
                <Box className="cardHead">
                    <Box>
                        <Typography className='machineName'>{machineName}</Typography> {/* Display machine name */}
                        <Typography className='machineType'>{machineType}</Typography> {/* Display machine type */}
                    </Box>
                    {/* Display machine status with conditional styling based on status */}
                    <Box className={`machineStatus ${machineStatus === "Working" && "working"} ${machineStatus === "Offline" && "offline"} ${machineStatus === "Idle" && "idle"} ${machineStatus === "Under Maintenance" && "maintenance"}`}>
                        {machineStatus}
                    </Box>
                </Box>

                <Box className="energyCardBody">
                    <Typography className='rowHeading'>Consumption</Typography>
                    <Box className="statRow">
                        <CardBoxStyle heading={"Total"} value={"0.66 kWh"} />
                        <CardBoxStyle heading={"Working"} value={"0.62 kWh"} />
                        <CardBoxStyle heading={"Idle"} value={"0.04 kWh"} />
                    </Box>
                    <Typography className='rowHeading'>Efficiency</Typography>
                    <Box className="statRow">
                        <CardBoxStyle heading={"Energy Efficiency Ratio"} value={"9:1"} />
                        <CardBoxStyle heading={"Energy Consumption / unit"} value={"0.002 kWh"} />
                    </Box>
                    <Typography className='rowHeading'>Sustainability</Typography>
                    <Box className="statRow">
                        <CardBoxStyle heading={"Renewable Energy Usage %"} value={"87%"} />
                        <CardBoxStyle heading={"Carbon Footprint"} value={"20 kgCO2e"} />
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