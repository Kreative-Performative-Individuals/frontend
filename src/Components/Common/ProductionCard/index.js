import React from 'react'; // Import React library
import "./style.scss"; // Import styles specific to this component
import { Box, Typography } from '@mui/material'; // Import Material-UI components for layout and typography
// import { GaugeComponent } from 'react-gauge-component';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const ProductionCard = ({ machineName, machineType = "Metal Cutting", machineStatus, efficiency=100, success_rate=100, failure_rate=0, good_cycles=10, bad_cycles=0, total_cycles=10, average_cycle_time=0, onClick }) => {

    return (
        <React.Fragment>
            <Box className="productionCard" onClick={onClick} style={{ cursor: 'pointer' }}>
                <Box className="cardHead">
                    <Box>
                        <Typography className='machineName'>{machineName}</Typography> {/* Display machine name */}
                        <Typography className='machineType'>{machineType}</Typography> {/* Display machine type */}
                    </Box>
                    {/* Display machine status with conditional styling based on status */}
                    <Box className={`machineStatus ${machineStatus === "Active" && "working"} ${machineStatus === "Offline" && "offline"} ${machineStatus === "Idle" && "idle"} ${machineStatus === "Under Maintenance" && "maintenance"}`}>
                        {machineStatus === "Active" ? "Working" : machineStatus}
                    </Box>
                </Box>

                <Box className="productionCardBody">
                    <Box className="statRow">
                        <Typography>Average Cycle Time</Typography>
                        <Typography>{average_cycle_time}</Typography>
                    </Box>
                    <Box className="statRow">
                        <Typography>Cycle Count</Typography>
                        <Typography>{total_cycles}</Typography>
                    </Box>
                    <Box>
                        <div className='cycleBar'>
                            <div title={`${good_cycles} Good Cycles`} style={{ width:((good_cycles / (good_cycles + bad_cycles))*100)+"%", backgroundColor: '#4AD991' }} />
                            <div title={`${bad_cycles} Bad Cycles`} style={{ width:((bad_cycles / (good_cycles + bad_cycles))*100)+"%", backgroundColor: '#FF0000   ' }} />
                        </div>
                    </Box>
                </Box>

                <Box className="productionCardFooter">
                    <Box className="gaugeContainer">
                        <Gauge width={100} height={100} value={efficiency < 0 ? 0 : efficiency > 100 ? 100 : efficiency} startAngle={-90} endAngle={90} sx={(theme) => ({ [`& .${gaugeClasses.valueArc}`]: { fill: '#4AD991' }, [`& .${gaugeClasses.valueText}`]: { display: 'none' } })} />
                        <Typography className='gaugeLegend'>Efficiency</Typography>
                    </Box>
                    <Box className="gaugeContainer">
                        <Gauge width={100} height={100} value={success_rate < 0 ? 0 : success_rate > 100 ? 100 : success_rate} startAngle={-90} endAngle={90} sx={(theme) => ({ [`& .${gaugeClasses.valueArc}`]: { fill: '#4AD991' }, [`& .${gaugeClasses.valueText}`]: { display: 'none' } })} />
                        <Typography className='gaugeLegend'>Success Rate</Typography>
                    </Box>
                    <Box className="gaugeContainer">
                        <Gauge width={100} height={100} value={failure_rate < 0 ? 0 : failure_rate > 100 ? 100 : failure_rate} startAngle={-90} endAngle={90} sx={(theme) => ({ [`& .${gaugeClasses.valueArc}`]: { fill: '#4AD991' }, [`& .${gaugeClasses.valueText}`]: { display: 'none' } })} />
                        <Typography className='gaugeLegend'>Failure Rate</Typography>
                    </Box>

                </Box>

            </Box>
        </React.Fragment>
    );
}

export default ProductionCard; // Export the component for use in other parts of the application