import React, { useEffect, useState } from 'react'; // Import necessary React hooks
import Layout from '../Layout'; // Import layout component for consistent page structure
import "./style.scss"; // Import styles specific to this component
import BasicCard from '../Common/BasicCard'; // Import BasicCard component to display statistics
import PowerIcon from "../../Assets/Power Logo.svg"; // Import icon for total machines
import WorkingIcon from "../../Assets/Working Machines.svg"; // Import icon for working machines
import IdleIcon from "../../Assets/Idle Machines.svg"; // Import icon for idle machines
import OfflineIcon from "../../Assets/Offline Machines.svg"; // Import icon for offline machines
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, Checkbox, ListItemText, CircularProgress } from '@mui/material'; // Import Material-UI components for UI elements
import OutlinedInput from '@mui/material/OutlinedInput'; // Import outlined input style for select fields
import Chip from '@mui/material/Chip'; // Import Chip component for displaying selected items
import MachineUsageCard from '../Common/MachineUsageCard'; // Import MachineUsageCard component for displaying individual machine details
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation between routes
import { connect } from 'react-redux'; // Connect to Redux store
import { getMachineList } from '../../store/main/actions'; // Action to fetch machine list
import { formatMachineUsageTime, runDBQuery, updateRecentlyViewed } from '../../constants/_helper'; // Helper functions for formatting, querying DB, and updating recently viewed machines

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
const MachineUsage = ({ getMachineList, machineList, loading }) => {

    const navigate = useNavigate(); // Initialize the navigate function for routing
    const [machineType, setMachineType] = useState([]); // State for selected machine types
    const [machineStatus, setMachineStatus] = useState([]); // State for selected machine statuses
    const [machineInView, setMachineInView] = useState([]); // State for machines currently displayed
    const [machineUsageData, setMachineUsageData] = useState([]); // State for machine usage data

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
        const filteredMachines = machineList.filter((machine) => {
            const typeMatch = types.length === 0 || types.includes(machine.machineType); // Check if type matches
            const statusMatch = statuses.length === 0 || statuses.includes(machine.machineStatus); // Check if status matches
            return typeMatch && statusMatch; // Return true if both type and status match
        });
        setMachineInView(filteredMachines); // Update the state with the filtered machines
    };

    // Reset filters and show all machines
    const handleReset = () => {
        setMachineInView(machineList); // Show all machines
        setMachineType([]); // Clear selected types
        setMachineStatus([]); // Clear selected statuses
    };

    // Predefined machine types and statuses for filtering
    const machineTypes = ["Metal Cutting", "Laser Cutting", "Laser Welding", "Assembly", "Testing", "Riveting"];
    const machineStatuses = ["Working", "Offline", "Idle"];

    // Query the database to fetch machine usage data
    const getQueryResult = async() => {
        // const { init_date, end_date } = getOneDay5MonthsAgo();
        const query = `
            SELECT asset_id,
                JSON_BUILD_OBJECT(
                    'working', COALESCE(SUM(CASE WHEN operation = 'working' THEN sum ELSE 0 END), 0),
                    'idle', COALESCE(SUM(CASE WHEN operation = 'idle' THEN sum ELSE 0 END), 0),
                    'offline', COALESCE(SUM(CASE WHEN operation = 'offline' THEN sum ELSE 0 END), 0),
                    'independent', COALESCE(SUM(CASE WHEN operation = 'independent' THEN sum ELSE 0 END), 0)
                ) AS operation_sums
            FROM real_time_data
            WHERE kpi = 'time' and time >= '2024-08-06 12:00:00' and time <= '2024-08-07 12:00:00'
            GROUP BY asset_id;
        `
        const result = await runDBQuery(query); // Run the query to get machine usage data
        const formatted = formatMachineUsageTime(result?.data?.data) // Format the data for display
        setMachineUsageData(formatted) // Set the formatted machine usage data
    }

    // Effect to set initial machine view when the component mounts
    useEffect(() => {
        getMachineList(); // Fetch the machine list from the Redux store
        getQueryResult() // Fetch machine usage data
        // eslint-disable-next-line
    }, []);

    // Function to handle card click and navigate to machine detail page
    const handleCardClick = (machine) => {
        const chartData = machineUsageData[machine.asset_id] // Get chart data for the clicked machine
        updateRecentlyViewed("machines", {...machine, chartData: chartData}); // Update recently viewed machines in the Redux store
        navigate(`/machines/${machine.asset_id}`); // Navigate to the machine detail page using the machineId
    };

    // Effect to set all machines to be visible initially
    useEffect(() => {
        setMachineInView(machineList); // Set all machines to be visible initially
    }, [machineList])

    return (
        <Layout>
            {loading ? ( // Show loader while data is being fetched
                <Box className="loader"><CircularProgress /></Box>
            ) : (
                <Box className="machines">
                    <Box className="machineStatsConatiner">
                        {/* Display statistics for total, working, idle, and offline machines */}
                        <BasicCard heading="Total Machines" value={machineList && machineList.length} icon={PowerIcon} iconBackground="rgba(130, 128, 255, 0.25)" />
                        <BasicCard heading="Working Machines" value={machineList && machineList.length} icon={WorkingIcon} iconBackground="rgba(254, 197, 61, 0.25)" />
                        <BasicCard heading="Idle Machines" value="0" icon={IdleIcon} iconBackground="rgba(74, 217, 145, 0.25)" />
                        <BasicCard heading="Offline Machines" value="0" icon={OfflineIcon} iconBackground="rgba(254, 144, 102, 0.25)" />
                    </Box>

                    <Box className="machinesHeader">
                        <Typography variant="p" className='headerHeading'>Machine Usage</Typography>

                        <div className="headerFilters">
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
                                    displayEmpty
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
                        </div>
                    </Box>

                    <Box className="machinesList">
                        {/* Map through the filtered machines and display each as a MachineUsageCard */}
                        {machineInView.sort((a, b) => a.name.localeCompare(b.name)).map((machine, index) => (
                            <MachineUsageCard
                                key={machine.asset_id}
                                machineName={machine.name} // Pass machine name to the card
                                machineType={machine.type} // Pass machine type to the card
                                machineStatus={machine.status} // Pass machine status to the card
                                chartData={machineUsageData[machine.asset_id]} // Pass chart data to the card
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
    machineList: main.machines,
    loading: main.loading
});

export default connect(mapStatetoProps, { getMachineList })(MachineUsage);