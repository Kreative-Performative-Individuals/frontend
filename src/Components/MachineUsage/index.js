import React, { useEffect, useState } from 'react'; // Import necessary React hooks
import Layout from '../Layout'; // Import layout component for consistent page structure
import "./style.scss"; // Import styles specific to this component
import BasicCard from '../Common/BasicCard'; // Import BasicCard component to display statistics
import GroupIcon from "../../Assets/Group.svg"; // Import icon for total machines
import WorkingIcon from "../../Assets/Working Machines.svg"; // Import icon for working machines
import IdleIcon from "../../Assets/Idle Machines.svg"; // Import icon for idle machines
import OfflineIcon from "../../Assets/Offline Machines.svg"; // Import icon for offline machines
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, Checkbox, ListItemText } from '@mui/material'; // Import Material-UI components for UI elements
import OutlinedInput from '@mui/material/OutlinedInput'; // Import outlined input style for select fields
import Chip from '@mui/material/Chip'; // Import Chip component for displaying selected items
import MachineUsageCard from '../Common/MachineUsageCard'; // Import MachineUsageCard component for displaying individual machine details
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation between routes
import { connect } from 'react-redux';
import { getMachineList } from '../../store/main/actions';

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
const MachineUsage = ({ getMachineList, machineList }) => {

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
        const filteredMachines = machines.filter((machine) => {
            const typeMatch = types.length === 0 || types.includes(machine.machineType); // Check if type matches
            const statusMatch = statuses.length === 0 || statuses.includes(machine.machineStatus); // Check if status matches
            return typeMatch && statusMatch; // Return true if both type and status match
        });
        setMachineInView(filteredMachines); // Update the state with the filtered machines
    };

    // Reset filters and show all machines
    const handleReset = () => {
        setMachineInView(machines); // Show all machines
        setMachineType([]); // Clear selected types
        setMachineStatus([]); // Clear selected statuses
    };

    // Predefined machine types and statuses for filtering
    const machineTypes = ["Metal Cutting", "Laser Cutting", "Laser Welding", "Assembly", "Testing", "Riveting"];
    const machineStatuses = ["Active", "Offline", "Idle"];

    // Sample machine data for demonstration
    const machines = [ { machineId: "010001", machineName: "Assembly Machine 1", machineType: "Metal Cutting", machineStatus: "Working", chartData: [9, 6, 8] } ];

    // Effect to set initial machine view when the component mounts
    useEffect(() => {
        getMachineList();
        // eslint-disable-next-line
    }, []);

    // Function to handle card click and navigate to machine detail page
    const handleCardClick = (machineId) => {
        navigate(`/machines/${machineId}`); // Navigate to the machine detail page using the machineId
    };

    useEffect(() => {
        console.log(machineList)
        setMachineInView(machineList); // Set all machines to be visible initially
    }, [machineList])


    return (
        <Layout>
            <Box className="machines">
                <Box className="machineStatsConatiner">
                    {/* Display statistics for total, working, idle, and offline machines */}
                    <BasicCard heading="Total Machines" value={machineList && machineList.length} icon={GroupIcon} iconBackground="rgba(130, 128, 255, 0.25)" />
                    <BasicCard heading="Working Machines" value="10" icon={WorkingIcon} iconBackground="rgba(254, 197, 61, 0.25)" />
                    <BasicCard heading="Idle Machines" value="2" icon={IdleIcon} iconBackground="rgba(74, 217, 145, 0.25)" />
                    <BasicCard heading="Offline Machines" value="4" icon={OfflineIcon} iconBackground="rgba(254, 144, 102, 0.25)" />
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
                    {machineInView.map((machine, index) => (
                        <MachineUsageCard
                            key={machine.asset_id}
                            machineName={machine.name} // Pass machine name to the card
                            machineType={machine.type} // Pass machine type to the card
                            machineStatus={machine.status} // Pass machine status to the card
                            chartData={machines[0].chartData} // Pass chart data to the card
                            onClick={() => handleCardClick(machine.asset_id)} // Pass click handler to navigate
                        />
                    ))}
                    {/* {machineInView.map((machine, index) => (
                        <MachineUsageCard
                            key={index}
                            machineName={machine.machineName} // Pass machine name to the card
                            machineType={machine.machineType} // Pass machine type to the card
                            machineStatus={machine.machineStatus} // Pass machine status to the card
                            chartData={machine.chartData} // Pass chart data to the card
                            onClick={() => handleCardClick(machine.machineId)} // Pass click handler to navigate
                        />
                    ))} */}
                </Box>
            </Box>
        </Layout>
    )
}

const mapStatetoProps = ({ main }) => ({
    machineList: main.machines,
    loading: main.loading
});

export default connect(mapStatetoProps, { getMachineList })(MachineUsage);