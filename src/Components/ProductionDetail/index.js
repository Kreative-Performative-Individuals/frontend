import React from 'react'; // Import React
import { useParams } from 'react-router-dom'; // Import useParams for routing
import Layout from '../Layout';
import PowerIcon from "../../Assets/Power Logo.svg";
import ConsumptionIcon from "../../Assets/Consumption Logo.svg";
import CostIcon from "../../Assets/Total Cost.svg";
import EnergyIcon from "../../Assets/Energy Logo.svg";

import { Box, Button, FormControl, InputLabel, MenuItem, Typography } from '@mui/material';
import Select from '@mui/material/Select';
import './style.scss';
import BasicCard from '../Common/BasicCard';
import ProductionDetailLineChart from './ProductionDetailLineChart';

const ProductionDetail = () => {
    const { machineId } = useParams(); // Get machineId from URL parameters

    const machines = [
        { machineId: "010001", machineName: "Assembly Machine 1", machineType: "Metal Cutting", machineStatus: "Working", efficiency: "90", density: "80", success_rate: "92", failure_rate: "8" },
        { machineId: "010002", machineName: "Assembly Machine 2", machineType: "Laser Cutting", machineStatus: "Offline", efficiency: "90", density: "80", success_rate: "92", failure_rate: "8" },
        { machineId: "010003", machineName: "Assembly Machine 3", machineType: "Laser Welding", machineStatus: "Idle", efficiency: "90", density: "80", success_rate: "92", failure_rate: "8" },
        { machineId: "010004", machineName: "Assembly Machine 4", machineType: "Assembly", machineStatus: "Under Maintenance", efficiency: "90", density: "80", success_rate: "92", failure_rate: "8" },
        { machineId: "010005", machineName: "Assembly Machine 5", machineType: "Testing", machineStatus: "Working", efficiency: "90", density: "80", success_rate: "92", failure_rate: "8" },
        { machineId: "010006", machineName: "Assembly Machine 6", machineType: "Riveting", machineStatus: "Offline", efficiency: "90", density: "80", success_rate: "92", failure_rate: "8" },
        { machineId: "010007", machineName: "Assembly Machine 7", machineType: "Riveting", machineStatus: "Idle", efficiency: "90", density: "80", success_rate: "92", failure_rate: "8" },
        { machineId: "010008", machineName: "Assembly Machine 8", machineType: "Testing", machineStatus: "Under Maintenance", efficiency: "90", density: "80", success_rate: "92", failure_rate: "8" },
    ];

    // Find the machine based on the machineId from the URL
    const currentMachine = machines.find(machine => machine.machineId === machineId);

    // If no machine is found, you can handle it accordingly
    if (!currentMachine) {
        return <Typography variant="h6">Machine not found</Typography>;
    }

    const { machineName, machineStatus } = currentMachine; // Destructure the machine details

    const cardData = [
        {
            id: 1,
            heading: "Total Cycles",
            duration: "Today",
            value: "4500",
            statUpOrDown: "Up",
            statPercent: "1.3%",
            statText: "Up from yesterday",
            icon: PowerIcon,
            iconBackground: "rgba(130, 128, 255, 0.25)",
        },
        {
            id: 2,
            heading: "Good Cycles",
            duration: "Today",
            value: "4350",
            statUpOrDown: "Up",
            statPercent: "1.3%",
            statText: "Up from yesterday",
            icon: ConsumptionIcon,
            iconBackground: "rgba(254, 197, 61, 0.25)",
        },
        {
            id: 3,
            heading: "Bad Cycles",
            duration: "Today",
            value: "150",
            statUpOrDown: "Down",
            statPercent: "4.3%",
            statText: "Down from yesterday",
            icon: CostIcon,
            iconBackground: "rgba(74, 217, 145, 0.25)",
        },
        {
            id: 4,
            heading: "Average Cycle Time",
            duration: "Today",
            value: "00:30:00",
            statUpOrDown: "Up",
            statPercent: "1.3%",
            statText: "Up from yesterday",
            icon: EnergyIcon,
            iconBackground: "rgba(254, 144, 102, 0.25)",
        },
    ];

    return (
        <Layout>
            <Box className="productionDetail">
                <Box className="productionDetailHead">
                    <Box className="productionDetailIntro">
                        <Typography className='machineName'>{machineName}</Typography>
                        <Box className={`machineStatus ${machineStatus === "Working" ? "working" : ""} ${machineStatus === "Offline" ? "offline" : ""} ${machineStatus === "Idle" ? "idle" : ""} ${machineStatus === "Under Maintenance" ? "maintenance" : ""}`}>
                            {machineStatus}
                        </Box>
                    </Box>

                    <Box className="productionDetailFilters">

                        <Box sx={{ minWidth: 200, backgroundColor: "#fff" }}>
                            <FormControl fullWidth>
                                <InputLabel id="custom-range-select-label">Custom Range</InputLabel>
                                <Select
                                    labelId="custom-range-select-label"
                                    id="demo-simple-select"
                                    label="Custom Range"
                                    placeholder="Custom Range"
                                >
                                    <MenuItem value={"Custom Range"}>Custom Range</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ minWidth: 120, backgroundColor: "#fff" }}>
                            <FormControl fullWidth>
                                <InputLabel id="date-select-label">Date</InputLabel>
                                <Select
                                    labelId="date-select-label"
                                    id="date-select"
                                    label="Date"
                                    placeholder="Date"
                                >
                                    <MenuItem value={"Date"}>Date</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ minWidth: 120, backgroundColor: "#fff" }}>
                            <FormControl fullWidth>
                                <InputLabel id="month-select-label">Month</InputLabel>
                                <Select
                                    labelId="month-select-label"
                                    id="month-select"
                                    label="Month"
                                    placeholder="Month"
                                >
                                    <MenuItem value={"Month"}>Month</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Button className="button">Download Report</Button>
                    </Box>
                </Box>
                <Box className="productionDetailStats">
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
                <Box className="machineDetailChartFilter">
                    <Box className="header">
                        <Typography>Utilization</Typography>
                        <Box className="Filters">
                            <Button className="chartFilterButton left"><LineChartSVG /></Button>
                            <Button className="chartFilterButton"><AreaChartSVG /></Button>
                            <Button className="chartFilterButton right"><BarChartSVG /></Button>
                        </Box>
                    </Box>
                    <Box></Box>
                </Box>
                <Box className="machineDetailDetails">
                    <Box><ProductionDetailLineChart /></Box>
                    <Box className="additionalDetails">
                        <BasicCard heading={"Efficiency"} duration={"Today"} value={"100%"} isIcon={false} />
                        <BasicCard heading={"Success Rate"} duration={"Today"} value={"99.99%"} isIcon={false} />
                        <BasicCard heading={"Failure Rate"} duration={"Today"} value={"0%"} isIcon={false} />
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
}

export default ProductionDetail;


const AreaChartSVG = () => {
    return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.46667 0H0V21.2667V22H0.730124H0.733335H21.2667H21.2699H22V21.2681V21.2681V3.66667C22 3.34789 21.7941 3.06561 21.4905 2.96833C21.1869 2.87103 20.8553 2.98103 20.6699 3.24044L13.9189 12.6919L10.12 7.62667C9.97721 7.43628 9.75088 7.32701 9.51299 7.33363C9.27508 7.34023 9.05519 7.46187 8.92317 7.65989L1.46667 18.8446V0Z" fill="black" />
        </svg>
    )
}
const BarChartSVG = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.8889 9.55566V18.1112" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 5.88892V18.1111" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M20.5556 1H3.44444C2.09441 1 1 2.09441 1 3.44444V20.5556C1 21.9056 2.09441 23 3.44444 23H20.5556C21.9056 23 23 21.9056 23 20.5556V3.44444C23 2.09441 21.9056 1 20.5556 1Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7.11108 13.2222V18.1111" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}
const LineChartSVG = () => {
    return (
        <svg width="25" height="13" viewBox="0 0 25 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.632 0C21.3509 0 20.3416 1.04814 20.3416 2.29037C20.3416 2.56211 20.3804 2.83385 20.4581 3.06677L15.7997 7.0264C15.4891 6.8323 15.1009 6.75466 14.6739 6.75466C14.2469 6.75466 13.8199 6.87112 13.4705 7.10404L10.8307 4.96894C10.9084 4.73602 10.9472 4.54193 10.9472 4.27019C10.9472 2.98913 9.89907 1.97981 8.65683 1.97981C7.37578 1.97981 6.36646 3.02795 6.36646 4.27019C6.36646 4.61957 6.4441 4.93013 6.56056 5.20186L3.22205 8.54037C2.95031 8.42391 2.60093 8.34627 2.29037 8.34627C1.00932 8.34627 0 9.39441 0 10.6366C0 11.9177 1.04814 12.927 2.29037 12.927C3.53261 12.927 4.58075 11.8789 4.58075 10.6366C4.58075 10.2873 4.50311 9.97671 4.38665 9.70497L7.72516 6.36646C7.99689 6.48292 8.34627 6.56056 8.65683 6.56056C9.08385 6.56056 9.51087 6.4441 9.86025 6.21118L12.5388 8.26863C12.4612 8.50155 12.4612 8.69565 12.4612 8.96739C12.4612 10.2484 13.5093 11.2578 14.7516 11.2578C15.9938 11.2578 17.0419 10.2096 17.0419 8.96739C17.0419 8.69565 17.0031 8.42391 16.9255 8.191L21.5839 4.23137C21.8944 4.42547 22.2826 4.50311 22.7096 4.50311C23.9907 4.50311 25 3.45497 25 2.21273C24.9612 1.04814 23.8742 0 22.632 0ZM2.25155 11.3354C1.90217 11.3354 1.59161 11.0248 1.59161 10.6755C1.59161 10.2873 1.90217 10.0155 2.25155 10.0155C2.60093 10.0155 2.91149 10.3261 2.91149 10.6755C2.91149 11.0248 2.63975 11.3354 2.25155 11.3354ZM7.95808 4.30901C7.95808 3.92081 8.26863 3.64907 8.61801 3.64907C8.96739 3.64907 9.27795 3.95963 9.27795 4.30901C9.27795 4.65839 8.96739 4.96894 8.61801 4.96894C8.26863 4.96894 7.95808 4.65839 7.95808 4.30901ZM14.7127 9.66615C14.3245 9.66615 14.0528 9.35559 14.0528 9.00621C14.0528 8.65683 14.3634 8.34627 14.7127 8.34627C15.0621 8.34627 15.3727 8.65683 15.3727 9.00621C15.3339 9.39441 15.1009 9.66615 14.7127 9.66615ZM22.632 2.95031C22.2826 2.95031 21.972 2.63975 21.972 2.29037C21.972 1.90217 22.2826 1.63044 22.632 1.63044C23.0202 1.63044 23.2919 1.94099 23.2919 2.29037C23.2919 2.67857 22.9814 2.95031 22.632 2.95031Z" fill="black" />
        </svg>

    )
}