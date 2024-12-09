import React from 'react'; // Import React library
import "./style.scss"; // Import styles specific to this component
import { Box, Typography } from '@mui/material'; // Import Material-UI components for layout and typography
import MachineUsageChart from './MachineUsageChart'; // Import the chart component to display machine usage data

// MachineUsageCard component definition
const MachineUsageCard = ({ machineName, machineType="Metal Cutting", machineStatus, chartData, onClick }) => {
    // Render the machine usage card
    return (
        <React.Fragment>
            <Box className="machineUsageCard" onClick={onClick} style={{ cursor: 'pointer' }}>
                {/* Card header containing machine name, type, and status */}
                <Box className="cardHead">
                    <Box>
                        <Typography className='machineName'>{machineName}</Typography> {/* Display machine name */}
                        <Typography className='machineType'>{machineType}</Typography> {/* Display machine type */}
                    </Box>
                    {/* Display machine status with conditional styling based on status */}
                    <Box className={`machineStatus ${machineStatus === "Active" && "working"} ${machineStatus === "Offline" && "offline"} ${machineStatus === "Idle" && "idle"} ${machineStatus === "Under Maintenance" && "maintenance"}`}>
                        {machineStatus}
                    </Box>
                </Box>
                {/* Render the usage chart for the machine */}
                <Box>
                    <MachineUsageChart chartData={chartData} /> {/* Pass chart data to the chart component */}
                </Box>
            </Box>
        </React.Fragment>
    );
}

export default MachineUsageCard; // Export the component for use in other parts of the application