import React from 'react'; // Import React library
import "./style.scss"; // Import styles specific to this component
import { Box, Typography } from '@mui/material'; // Import Material-UI components for layout and typography
// import { GaugeComponent } from 'react-gauge-component';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'; // Import Gauge component from MUI Charts
import { capitalizeFirstLetter } from '../../../constants/_helper';

// ProductionCard component definition
const ProductionCard = ({
    machineName, // The name of the machine
    machineType = "Metal Cutting",
    machineStatus, // The current status of the machine (Active, Offline, Idle, Under Maintenance)
    efficiency = 100, // Efficiency percentage (default: 100)
    success_rate = 100, // Success rate percentage (default: 100)
    failure_rate = 0, // Failure rate percentage (default: 0)
    good_cycles = 0, // Number of good cycles (default: 0)
    bad_cycles = 0, // Number of bad cycles (default: 0)
    total_cycles = 0, // Total number of cycles (default: 0)
    average_cycle_time = 0, // Average cycle time (default: 0)
    onClick // Click handler for the card
}) => {

    return (
        <React.Fragment>
            <Box className="productionCard" onClick={onClick} style={{ cursor: 'pointer' }}>
                {/* Card header containing machine name, type, and status */}
                <Box className="cardHead">
                    <Box>
                        <Typography className='machineName'>{machineName}</Typography> {/* Display machine name */}
                        <Typography className='machineType'>{capitalizeFirstLetter(machineType)}</Typography> {/* Display machine type */}
                    </Box>
                    {/* Display machine status with conditional styling based on status */}
                    <Box className={`machineStatus ${machineStatus === "Active" && "working"} ${machineStatus === "Offline" && "offline"} ${machineStatus === "Idle" && "idle"} ${machineStatus === "Under Maintenance" && "maintenance"}`}>
                        {machineStatus === "Active" ? "Working" : machineStatus} {/* Display the machine status */}
                    </Box>
                </Box>

                {/* Card body with statistics */}
                <Box className="productionCardBody">
                    <Box className="statRow">
                        <Typography>Average Cycle Time</Typography> {/* Display average cycle time */}
                        <Typography>{average_cycle_time}</Typography> {/* Display average cycle time value */}
                    </Box>
                    <Box className="statRow">
                        <Typography>Cycle Count</Typography> {/* Display total cycle count */}
                        <Typography>{total_cycles}</Typography> {/* Display total cycle count value */}
                    </Box>
                    <Box>
                        {/* Display a bar showing the distribution of good and bad cycles */}
                        <div className='cycleBar'>
                            <div title={`${good_cycles} Good Cycles`} style={{ width:((good_cycles / (good_cycles + bad_cycles))*100)+"%", backgroundColor: '#4AD991' }} />
                            <div title={`${bad_cycles} Bad Cycles`} style={{ width:((bad_cycles / (good_cycles + bad_cycles))*100)+"%", backgroundColor: '#FF0000   ' }} />
                        </div>
                    </Box>
                </Box>

                {/* Card footer containing gauges for efficiency, success rate, and failure rate */}
                <Box className="productionCardFooter">
                    <Box className="gaugeContainer">
                        {/* Efficiency gauge */}
                        <Gauge
                            width={100} // Set the width of the gauge
                            height={100} // Set the height of the gauge
                            value={efficiency < 0 ? 0 : efficiency > 100 ? 100 : efficiency} // Ensure value is between 0 and 100
                            startAngle={-90} // Set the start angle of the gauge
                            endAngle={90} // Set the end angle of the gauge
                            sx={(theme) => ({
                                [`& .${gaugeClasses.valueArc}`]: { fill: '#4AD991' }, // Set gauge color
                                [`& .${gaugeClasses.valueText}`]: { display: 'none' } // Hide the text inside the gauge
                            })}
                        />
                        <Typography className='gaugeLegend'>Efficiency</Typography> {/* Label for the efficiency gauge */}
                    </Box>
                    <Box className="gaugeContainer">
                        {/* Success rate gauge */}
                        <Gauge
                            width={100} // Set the width of the gauge
                            height={100} // Set the height of the gauge
                            value={success_rate < 0 ? 0 : success_rate > 100 ? 100 : success_rate} // Ensure value is between 0 and 100
                            startAngle={-90} // Set the start angle of the gauge
                            endAngle={90} // Set the end angle of the gauge
                            sx={(theme) => ({
                                [`& .${gaugeClasses.valueArc}`]: { fill: '#4AD991' }, // Set gauge color
                                [`& .${gaugeClasses.valueText}`]: { display: 'none' } // Hide the text inside the gauge
                            })}
                        />
                        <Typography className='gaugeLegend'>Success Rate</Typography> {/* Label for the success rate gauge */}
                    </Box>
                    <Box className="gaugeContainer">
                        {/* Failure rate gauge */}
                        <Gauge
                            width={100} // Set the width of the gauge
                            height={100} // Set the height of the gauge
                            value={failure_rate < 0 ? 0 : failure_rate > 100 ? 100 : failure_rate} // Ensure value is between 0 and 100
                            startAngle={-90} // Set the start angle of the gauge
                            endAngle={90} // Set the end angle of the gauge
                            sx={(theme) => ({
                                [`& .${gaugeClasses.valueArc}`]: { fill: '#4AD991' }, // Set gauge color
                                [`& .${gaugeClasses.valueText}`]: { display: 'none' } // Hide the text inside the gauge
                            })}
                        />
                        <Typography className='gaugeLegend'>Failure Rate</Typography> {/* Label for the failure rate gauge */}
                    </Box>

                </Box>

            </Box>
        </React.Fragment>
    );
}

export default ProductionCard; // Export the component for use in other parts of the application
