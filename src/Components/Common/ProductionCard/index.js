import React from 'react'; // Import React library
import "./style.scss"; // Import styles specific to this component
import { Box, Typography } from '@mui/material'; // Import Material-UI components for layout and typography
// import { GaugeComponent } from 'react-gauge-component';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const ProductionCard = ({ machineName, machineType = "Metal Cutting", machineStatus, efficiency, density, success_rate, failure_rate, onClick }) => {

    return (
        <React.Fragment>
            <Box className="productionCard" onClick={onClick} style={{ cursor: 'pointer' }}>
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

                <Box className="productionCardBody">
                    <Box className="statRow">
                        <Typography>Average Cycle Time</Typography>
                        <Typography>03:00</Typography>
                    </Box>
                    <Box className="statRow">
                        <Typography>Cycle Count</Typography>
                        <Typography>5000</Typography>
                    </Box>
                    <Box>
                        <div className='cycleBar'>
                            <div style={{ width: "60%", backgroundColor: '#4AD991' }} />
                            <div style={{ width: "40%", backgroundColor: '#FF0000   ' }} />
                        </div>
                    </Box>
                </Box>

                <Box className="productionCardFooter">
                    <Box className="gaugeContainer">
                        <Gauge width={75} height={75} value={efficiency} startAngle={-90} endAngle={90} sx={(theme) => ({ [`& .${gaugeClasses.valueArc}`]: { fill: '#4AD991' }, [`& .${gaugeClasses.valueText}`]: { display: 'none' } })} />
                        <Typography className='gaugeLegend'>Efficiency</Typography>
                    </Box>
                    <Box className="gaugeContainer">
                        <Gauge width={75} height={75} value={density} startAngle={-90} endAngle={90} sx={(theme) => ({ [`& .${gaugeClasses.valueArc}`]: { fill: '#4AD991' }, [`& .${gaugeClasses.valueText}`]: { display: 'none' } })} />
                        <Typography className='gaugeLegend'>Density</Typography>
                    </Box>
                    <Box className="gaugeContainer">
                        <Gauge width={75} height={75} value={success_rate} startAngle={-90} endAngle={90} sx={(theme) => ({ [`& .${gaugeClasses.valueArc}`]: { fill: '#4AD991' }, [`& .${gaugeClasses.valueText}`]: { display: 'none' } })} />
                        <Typography className='gaugeLegend'>Success Rate</Typography>
                    </Box>
                    <Box className="gaugeContainer">
                        <Gauge width={75} height={75} value={failure_rate} startAngle={-90} endAngle={90} sx={(theme) => ({ [`& .${gaugeClasses.valueArc}`]: { fill: '#4AD991' }, [`& .${gaugeClasses.valueText}`]: { display: 'none' } })} />
                        <Typography className='gaugeLegend'>Failure Rate</Typography>
                    </Box>

                </Box>

            </Box>
        </React.Fragment>
    );
}

export default ProductionCard; // Export the component for use in other parts of the application