import React, { useEffect, useState } from 'react'; // Import necessary React hooks
import Layout from '../Layout'; // Import layout component for consistent page structure
import "./style.scss"; // Import styles specific to this component
import BasicCard from '../Common/BasicCard'; // Import BasicCard component to display statistics

import PowerIcon from "../../Assets/Power Logo.svg";
import ConsumptionIcon from "../../Assets/Consumption Logo.svg";
import CostIcon from "../../Assets/Total Cost.svg";
import EnergyIcon from "../../Assets/Energy Logo.svg";

import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, Checkbox, ListItemText } from '@mui/material'; // Import Material-UI components for UI elements
import OutlinedInput from '@mui/material/OutlinedInput'; // Import outlined input style for select fields
import Chip from '@mui/material/Chip'; // Import Chip component for displaying selected items
import ProductionCard from '../Common/ProductionCard'; // Import MachineUsageCard component for displaying individual machine details
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation between routes
import { getMachineList, getProductionDashboard } from '../../store/main/actions';
import { connect } from 'react-redux';

// Constants for dropdown menu styling
const ITEM_HEIGHT = 48; // Height of each item in the dropdown
const ITEM_PADDING_TOP = 8; // Padding at the top of the dropdown
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, // Maximum height for the dropdown
            width: 250, // Width of the dropdown
        },
    },
};

// Main MachineUsage component
const Production = ({ getProductionDashboard, productionDashboard, loading }) => {

    const navigate = useNavigate(); // Initialize the navigate function for routing
    const [machineType, setMachineType] = useState([]); // State for selected machine types
    const [machineStatus, setMachineStatus] = useState([]); // State for selected machine statuses
    const [machineInView, setMachineInView] = useState([]); // State for machines currently displayed

    // Handle change in machine type selection
    const handleChange = (event) => {
        const {
            target: { value }, // Get the selected values from the event
        } = event;
        setMachineType(value); // Update the state with selected machine types
        filterMachines(value, machineStatus); // Filter machines based on selected types and current statuses
    };

    // Handle change in machine status selection
    const handleStatusChange = (event) => {
        const {
            target: { value }, // Get the selected values from the event
        } = event;
        setMachineStatus(value); // Update the state with selected machine statuses
        filterMachines(machineType, value); // Filter machines based on current types and new statuses
    };

    // Function to filter machines based on selected types and statuses
    const filterMachines = (types, statuses) => {
        // Filter the machines array based on type and status
        const filteredMachines = productionDashboard.machines.filter((machine) => {
            const typeMatch = types.length === 0 || types.includes(machine.type); // Check if type matches
            const statusMatch = statuses.length === 0 || statuses.includes(machine.status); // Check if status matches
            return typeMatch && statusMatch; // Return true if both type and status match
        });
        setMachineInView(filteredMachines); // Update the state with the filtered machines
    };

    // Reset filters and show all machines
    const handleReset = () => {
        setMachineInView(productionDashboard.machines); // Show all machines
        setMachineType([]); // Clear selected types
        setMachineStatus([]); // Clear selected statuses
    };

    // Predefined machine types and statuses for filtering
    const machineTypes = ["Metal Cutting", "Laser Cutting", "Laser Welding", "Assembly", "Testing", "Riveting"];
    const machineStatuses = ["Working", "Offline", "Idle", "Independent"];

    // Effect to set initial machine view when the component mounts
    useEffect(() => {
        getProductionDashboard();
        // eslint-disable-next-line
    }, []);



    // Function to handle card click and navigate to machine detail page
    const handleCardClick = (machine) => {
        navigate(`/production/${machine.asset_id}?machineName=${machine.name}&machineStatus=${machine.status}`); // Navigate to the machine detail page using the machineId
    };

    useEffect(() => {
        if (productionDashboard !== undefined) {
            if (productionDashboard.machines !== undefined) {
                setMachineInView(productionDashboard.machines); // Set all machines to be visible initially
            }
        }
    }, [productionDashboard])



    const cardData = [
        {
            id: 1,
            heading: "Total Power",
            value: `${productionDashboard.totalPower} kW`,
            duration: "Today",
            isStat: false,
            icon: PowerIcon,
            iconBackground: "rgba(130, 128, 255, 0.25)",
        },
        {
            id: 2,
            heading: "Total Consumption",
            duration: "Today",
            value: `${productionDashboard.totalConsumption} kWh`,
            isStat: false,
            statUpOrDown: "Up",
            statPercent: "1.3%",
            statText: "Up from yesterday",
            icon: ConsumptionIcon,
            iconBackground: "rgba(254, 197, 61, 0.25)",
        },
        {
            id: 3,
            heading: "Total Cost",
            duration: "Today",
            value: `${productionDashboard.totalCost} €`,
            isStat: false,
            statUpOrDown: "Down",
            statPercent: "4.3%",
            statText: "Down from yesterday",
            icon: CostIcon,
            iconBackground: "rgba(74, 217, 145, 0.25)",
        },
        {
            id: 4,
            heading: "Energy Contributions",
            duration: "Today",
            value: `${productionDashboard.energyContributions} hours`,
            isStat: false,
            statUpOrDown: "Up",
            statPercent: "1.3%",
            statText: "Up from yesterday",
            icon: EnergyIcon,
            iconBackground: "rgba(254, 144, 102, 0.25)",
        },
    ];

    return (
        <Layout>
            <Box className="production">
                <Box className="machineStatsConatiner">
                    {/* Display statistics for total, working, idle, and offline machines */}
                    {cardData.map(({ id, heading, duration, value, isStat, statUpOrDown, statPercent, statText, icon, iconBackground }) => (
                        <BasicCard
                            key={id} // Using unique ID as key
                            heading={heading}
                            duration={duration}
                            value={!loading ? value : "Loading.."}
                            isStat={isStat}
                            statUpOrDown={statUpOrDown}
                            statPercent={statPercent}
                            statText={statText}
                            icon={icon}
                            iconBackground={iconBackground}
                        />
                    ))}
                </Box>

                <Box className="machinesHeader">
                    <Typography variant="p" className='headerHeading'>Machines</Typography>

                    <Box className="headerFilters">
                        {/* Dropdown for selecting machine types */}
                        <FormControl style={{ width: "100%" }}>
                            <InputLabel id="machineTypeSelector">Machine Type</InputLabel>
                            <Select
                                labelId="machineTypeSelector"
                                id="machineTypeSelect"
                                value={machineType}
                                label="Machine Type"
                                multiple
                                MenuProps={MenuProps}
                                onChange={handleChange} // Handle change in machine type selection
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} /> // Display selected machine types as chips
                                        ))}
                                    </Box>
                                )}
                            >
                                {machineTypes.map((type, index) => (
                                    <MenuItem key={index} value={type}>
                                        <Checkbox checked={machineType.indexOf(type) > -1} /> {/* Checkbox for selected types */}
                                        <ListItemText primary={type} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* Dropdown for selecting machine statuses */}
                        <FormControl style={{ width: "100%" }}>
                            <InputLabel id="machineStatusSelector">Machine Status</InputLabel>
                            <Select
                                labelId="machineStatusSelector"
                                id="machineStatusSelect"
                                value={machineStatus}
                                label="Machine Status"
                                multiple
                                onChange={handleStatusChange} // Handle change in machine status selection
                                input={<OutlinedInput id="select-multiple-chip-status" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} /> // Display selected machine statuses as chips
                                        ))}
                                    </Box>
                                )}
                            >
                                {machineStatuses.map((status, index) => (
                                    <MenuItem key={index} value={status}>
                                        <Checkbox checked={machineStatus.indexOf(status) > -1} /> {/* Checkbox for selected statuses */}
                                        <ListItemText primary={status} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button onClick={handleReset}>Reset</Button> {/* Button to reset filters */}
                    </Box>
                </Box>

                <Box className="machinesList">
                    {/* Map through the filtered machines and display each as a MachineUsageCard */}
                    {machineInView.map((machine, index) => (
                        <ProductionCard
                            key={index}
                            machineName={machine.name} // Pass machine name to the card
                            machineType={machine.type} // Pass machine type to the card
                            machineStatus={machine.status} // Pass machine status to the card
                            onClick={() => handleCardClick(machine)} // Pass click handler to navigate
                            efficiency={machine.efficiency}
                            success_rate={machine.success_rate}
                            failure_rate={machine.failure_rate}
                            good_cycles={machine.good_cycles}
                            bad_cycles={machine.bad_cycles}
                            total_cycles={machine.total_cycles}
                            average_cycle_time={machine.average_cycle_time}
                        />
                    ))}
                    {loading && ( <div>Loading ...</div> )}
                </Box>
            </Box>
        </Layout>
    )
}

const mapStatetoProps = ({ main }) => ({
    productionDashboard: main.productionDashboard,
    loading: main.loading
});

export default connect(mapStatetoProps, { getProductionDashboard, getMachineList })(Production); // Exporting the Production component for use in other parts of the application