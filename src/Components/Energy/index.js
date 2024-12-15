import React, { useEffect, useState } from 'react'; // Import necessary React hooks
import Layout from '../Layout'; // Import layout component for consistent page structure
import "./style.scss"; // Import styles specific to this component
import BasicCard from '../Common/BasicCard'; // Import BasicCard component to display statistics

import PowerIcon from "../../Assets/Power Logo.svg"; // Import Power icon
import ConsumptionIcon from "../../Assets/Consumption Logo.svg"; // Import Consumption icon
import CostIcon from "../../Assets/Total Cost.svg"; // Import Cost icon
import EnergyIcon from "../../Assets/Energy Logo.svg"; // Import Energy icon

import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, Checkbox, ListItemText, CircularProgress } from '@mui/material'; // Import Material-UI components for UI elements
import OutlinedInput from '@mui/material/OutlinedInput'; // Import outlined input style for select fields
import Chip from '@mui/material/Chip'; // Import Chip component for displaying selected items
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation between routes
import EnergyCard from '../Common/EnergyCard'; // Import EnergyCard component for displaying individual machine data
import { getEnergyDashboard } from '../../store/main/actions'; // Import action for fetching energy dashboard data
import { connect } from 'react-redux'; // Import Redux connect to map state and dispatch
import { truncateToFiveDecimals, updateRecentlyViewed } from '../../constants/_helper'; // Import helper functions for truncating decimals and updating recently viewed data

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
const Energy = ({ getEnergyDashboard, energyDashboard, loading }) => {

    const navigate = useNavigate(); // Initialize the navigate function for routing
    const [machineType, setMachineType] = useState([]); // State for selected machine types
    const [machineStatus, setMachineStatus] = useState([]); // State for selected machine statuses
    const [machineInView, setMachineInView] = useState([]); // State for machines currently displayed

    useEffect(() => {
        if (Object.keys(energyDashboard).length === 0) {
            getEnergyDashboard() // Fetch energy dashboard data if not already available
        }
        // eslint-disable-next-line
    }, []);
    
    useEffect(() => {
        setMachineInView(energyDashboard.machines) // Update the state with the machines data from the energy dashboard
        // eslint-disable-next-line
    }, [energyDashboard])

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
        const filteredMachines = energyDashboard.machines.filter((machine) => {
            const typeMatch = types.length === 0 || types.includes(machine.type); // Check if type matches
            const statusMatch = statuses.length === 0 || statuses.includes(machine.status); // Check if status matches
            return typeMatch && statusMatch; // Return true if both type and status match
        });
        setMachineInView(filteredMachines); // Update the state with the filtered machines
    };

    // Reset filters and show all machines
    const handleReset = () => {
        setMachineInView(energyDashboard.machines); // Show all machines
        setMachineType([]); // Clear selected types
        setMachineStatus([]); // Clear selected statuses
    };

    // Predefined machine types and statuses for filtering
    const machineTypes = ["Metal Cutting", "Laser Cutting", "Laser Welding", "Assembly", "Testing", "Riveting"];
    const machineStatuses = ["Working", "Offline", "Idle", "Under Maintenance"];

    // Function to handle card click and navigate to machine detail page
    const handleCardClick = (machine) => {
        updateRecentlyViewed("energy", machine); // Update the recently viewed machines list
        navigate(`/energy/${machine.asset_id}?machineName=${machine.name}&machineStatus=${machine.status}`); // Navigate to the machine detail page using the machineId
    };

    const cardData = [
        {
            id: 1,
            heading: "Total Power",
            duration: "Today",
            value: `${truncateToFiveDecimals(energyDashboard.total_power)} kW`,
            isStat: false,
            icon: PowerIcon, // Power icon
            iconBackground: "rgba(130, 128, 255, 0.25)", // Icon background color
        },
        {
            id: 2,
            heading: "Total Consumption",
            duration: "Today",
            value: `${truncateToFiveDecimals(energyDashboard.total_consumption)} kWh`,
            isStat: false,
            icon: ConsumptionIcon, // Consumption icon
            iconBackground: "rgba(254, 197, 61, 0.25)", // Icon background color
        },
        {
            id: 3,
            heading: "Total Cost",
            duration: "Today",
            value: `${truncateToFiveDecimals(energyDashboard.total_cost)} €`,
            isStat: false,
            icon: CostIcon, // Cost icon
            iconBackground: "rgba(74, 217, 145, 0.25)", // Icon background color
        },
        {
            id: 4,
            heading: "Energy Contributions",
            duration: "Today",
            value: "0 hours",
            icon: EnergyIcon, // Energy icon
            iconBackground: "rgba(254, 144, 102, 0.25)", // Icon background color
        },
    ];

    return (
        <Layout>
            {loading ? (
                <Box className="loader"><CircularProgress /></Box> // Show loader while the data is being fetched
            ) : (
                <Box className="energy">
                    <Box className="energyStatsConatiner">
                        {/* Display statistics for total, working, idle, and offline machines */}
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
                    </Box>

                    <Box className="energyHeader">
                        <Typography variant="p" className='headerHeading'>Machines</Typography> {/* Header for Machines section */}

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
                        {machineInView && machineInView.sort((a, b) => a.name.localeCompare(b.name)).map((machine, index) => (
                            <EnergyCard
                                key={index}
                                machineName={machine.name} // Pass machine name to the card
                                machineType={machine.type} // Pass machine type to the card
                                machineStatus={machine.status} // Pass machine status to the card
                                total_consumption={machine.total_consumption}
                                working_consumption={machine.working_consumption}
                                total_cycles_sum={machine.total_cycles_sum}
                                onClick={() => handleCardClick(machine)} // Pass click handler to navigate
                            />
                        ))}
                    </Box>
                </Box>
            )}
        </Layout>
    )
}

const mapStatetoProps = ({ main }) => ({
    energyDashboard: main.energyDashboard,
    loading: main.loading // Map state to props
});

export default connect(mapStatetoProps, { getEnergyDashboard })(Energy); // Connect the component to Redux store
