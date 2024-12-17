import React, { useEffect, useRef, useState } from 'react'; // Import React and hooks
import { useLocation, useParams } from 'react-router-dom'; // Import hooks for routing
import Layout from '../Layout'; // Import Layout component
import PowerIcon from "../../Assets/Power Logo.svg"; // Import icon assets
import ConsumptionIcon from "../../Assets/Consumption Logo.svg";
import CostIcon from "../../Assets/Total Cost.svg";
import EnergyIcon from "../../Assets/Energy Logo.svg";

import StackedBarChartIcon from '@mui/icons-material/StackedBarChart'; // Import MUI icons for chart types
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';

import { Box, Button, Typography } from '@mui/material'; // Import MUI components
import './style.scss'; // Import styles
import BasicCard from '../Common/BasicCard'; // Import BasicCard component for statistics display
import ProductionDetailLineChart from './ProductionDetailLineChart'; // Import chart component
import { getProductionDetail } from '../../store/main/actions'; // Import Redux action to fetch production details
import { connect } from 'react-redux'; // Import connect for Redux integration
import { usePDF } from 'react-to-pdf'; // Import PDF export hook
import DateFilter from '../Common/DateFilter'; // Import DateFilter component for date selection
import { addOneDay, getLastDayOfMonth, getOneDay5MonthsAgo, formatDate, showDateOnly, truncateToFiveDecimals, runDBQuery } from '../../constants/_helper'; // Import helper functions

// Component to display production details for a specific machine
const ProductionDetail = ({ getProductionDetail, productionDetail }) => {
    const { machineId } = useParams(); // Get machineId from URL parameters
    const location = useLocation(); // Access current location object to get query parameters
    const queryParams = new URLSearchParams(location.search); // Parse query parameters
    const machineName = queryParams.get("machineName"); // Extract machineName from query parameters
    const machineStatus = queryParams.get("machineStatus"); // Extract machineStatus from query parameters

    const reportDateRef = useRef(null); // Reference to report date element
    const filterRef = useRef(null); // Reference to filters section

    // State variables for managing date range and chart data
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [chartData, setChartData] = useState({});
    const [chartType, setChartType] = useState("line"); // Default chart type set to "line"

    // Function to generate the report date range
    const reportDate = () => {
        const { init_date, end_date } = getOneDay5MonthsAgo(); // Get the initial and end date from helper function
        const dateOfReport = startDate && endDate ? `${showDateOnly(formatDate(startDate))} - ${showDateOnly(formatDate(endDate))}` 
        : selectedDate ? showDateOnly(formatDate(selectedDate)) 
        : selectedMonth ? `${showDateOnly(formatDate(selectedMonth))} - ${showDateOnly(getLastDayOfMonth(selectedMonth))}` 
        : (`${showDateOnly(init_date)} - ${showDateOnly(end_date)}`) // Format and return the date range
        return dateOfReport
    }

    // usePDF hook for generating PDF from the report section
    const { toPDF, targetRef } = usePDF({filename: `${machineName} Production Detail ${reportDate()}.pdf`});

    // Function to execute database query and get production data
    const getQueryResult = async (initialize_date, ending_date) => {
        const query = `SELECT time, SUM(CASE WHEN kpi = 'cycles' THEN sum ELSE 0 END) AS cycles, 
                        SUM(CASE WHEN kpi = 'good_cycles' THEN sum ELSE 0 END) AS good_cycles, 
                        SUM(CASE WHEN kpi = 'bad_cycles' THEN sum ELSE 0 END) AS bad_cycles 
                       FROM real_time_data 
                       WHERE kpi IN ('cycles', 'good_cycles', 'bad_cycles') 
                       AND time >= '${initialize_date}'  
                       AND time <= '${ending_date}' 
                       AND asset_id = '${machineId}' 
                       GROUP BY time 
                       ORDER BY time;`
        const result = await runDBQuery(query); // Run the query and get results
        transformDataForChart(result.data.data); // Transform the query result for charting
    }

    // Function to transform database query result into chart-friendly format
    function transformDataForChart(data) {
        const result = {
            labels: [],
            cycles: [],
            good_cycles: [],
            bad_cycles: []
        };
    
        data.forEach(item => {
            const formattedDate = item[0].split('T')[0]; // Extract date and format
            result.labels.push(formattedDate); // Push date to labels
            result.cycles.push(item[1]); // Push cycle data
            result.good_cycles.push(item[2]); // Push good cycle data
            result.bad_cycles.push(item[3]); // Push bad cycle data
        });
    
        setChartData(result); // Update the chart data state
    }

    // Handler for changing date range
    const onDateRangeChange = (dates) => {
        const [start, end] = dates; // Destructure the selected start and end dates
        setStartDate(start); // Update start date state
        setEndDate(end); // Update end date state
        setSelectedDate(null); // Clear selected day/month
        setSelectedMonth(null);
        if (start && end) {
            getProductionDetail({machineName, init_date: formatDate(start), end_date: formatDate(end)}); // Fetch production details based on selected range
            getQueryResult(formatDate(start), formatDate(end)); // Run database query with selected range
        }
    };

    // Handler for changing the selected month
    const onDateMonthChange = (date) => {
        setSelectedMonth(date); // Set the selected month
        setSelectedDate(null); // Clear selected day
        setStartDate(null); // Clear start date
        setEndDate(null); // Clear end date
        if (date) {
            const end_date = getLastDayOfMonth(date) // Get the last day of the selected month
            getProductionDetail({machineName, init_date: formatDate(date), end_date}) // Fetch production details for selected month
            getQueryResult(formatDate(date), end_date); // Run database query for selected month
        }
    };

    // Handler for changing the selected day
    const onDateDayChange = (date) => {
        setSelectedDate(date); // Set the selected day
        setSelectedMonth(null); // Clear selected month
        setStartDate(null); // Clear start date
        setEndDate(null); // Clear end date
        if (date) {
            const end_date = addOneDay(date) // Get the next day
            getProductionDetail({machineName, init_date: formatDate(date), end_date}) // Fetch production details for selected day
            getQueryResult(formatDate(date), end_date); // Run database query for selected day
        }
    };

    useEffect(() => {
        const payload = {
            init_date: "2024-05-02 00:00:00",
            end_date: "2024-05-03 00:00:00",
            machineName: machineName
        }
        getProductionDetail(payload); // Fetch production details on component mount
        getQueryResult("2024-04-26 00:00:00", "2024-05-03 00:00:00") // Run query on initial load
        // eslint-disable-next-line
    }, [])

    // Destructure the production details from props
    const total_cycles = productionDetail.total_cycles;
    const good_cycles = productionDetail.good_cycles;
    const bad_cycles = productionDetail.bad_cycles;
    const avg_cycle_time = productionDetail.average_cycle_time;
    const efficiency = productionDetail.efficiency >= 0 ? productionDetail.efficiency : 0; // Ensure non-negative efficiency
    const success_rate = productionDetail.success_rate;
    const failure_rate = productionDetail.failure_rate;

    // Card data to display key statistics
    const cardData = [
        {
            id: 1,
            heading: "Total Cycles",
            duration: "Today",
            value: total_cycles,
            isStat: false,
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
            value: good_cycles,
            isStat: false,
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
            value: bad_cycles,
            isStat: false,
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
            value: avg_cycle_time,
            isStat: false,
            statUpOrDown: "Up",
            statPercent: "1.3%",
            statText: "Up from yesterday",
            icon: EnergyIcon,
            iconBackground: "rgba(254, 144, 102, 0.25)",
        },
    ];

    // Function to download the report as PDF
    const downloadReport = () => {
        targetRef.current.style.padding = '40px'; // Adjust padding for PDF rendering
        filterRef.current.style.display = 'none'; // Hide filter section
        reportDateRef.current.style.display = 'block'; // Show report date
        toPDF(); // Generate PDF
        targetRef.current.style.padding = '0px'; // Reset padding
        filterRef.current.style.display = 'flex'; // Restore filter section visibility
        reportDateRef.current.style.display = 'none'; // Hide report date
    };

    return (
        <Layout>
            {/* Main layout for production details */}
            <Box className="productionDetail" ref={targetRef}>
                <Box className="productionDetailHead">
                    {/* Machine details */}
                    <Box className="productionDetailIntro">
                        <Typography className='machineName'>{machineName}</Typography>
                        <Box className={`machineStatus ${machineStatus === "Working" || machineStatus === "Active" ? "working" : ""} ${machineStatus === "Offline" ? "offline" : ""} ${machineStatus === "Idle" ? "idle" : ""} ${machineStatus === "Under Maintenance" ? "maintenance" : ""}`}>
                            {machineStatus === "Active" ? "Working" : machineStatus}
                        </Box>
                    </Box>

                    {/* Filters and DatePicker */}
                    <Box className="productionDetailFilters" ref={filterRef}>
                        <DateFilter
                            startDate={startDate}
                            endDate={endDate}
                            selectedDate={selectedDate}
                            selectedMonth={selectedMonth}
                            onDateDayChange={onDateDayChange}
                            onDateMonthChange={onDateMonthChange}
                            onDateRangeChange={onDateRangeChange}
                        />
                        <Button className="button" onClick={downloadReport}>Download Report</Button> {/* Button to download PDF */}
                    </Box>
                </Box>

                {/* Report date text */}
                <Typography sx={{ fontSize: "20px", fontWeight: "500", mt: 3, display: "none" }} ref={reportDateRef}>
                    Report Date {reportDate()}
                </Typography>
                
                <Box className="productionDetailStats">
                    {cardData.map(({ id, heading, duration, value, isStat, statUpOrDown, statPercent, statText, icon, iconBackground }) => (
                        <BasicCard
                            key={id} // Using unique ID as key
                            heading={heading}
                            duration={reportDate()}
                            value={value ? truncateToFiveDecimals(value) : "-"}
                            isStat={isStat}
                            statUpOrDown={statUpOrDown}
                            statPercent={statPercent}
                            statText={statText}
                            icon={icon}
                            iconBackground={iconBackground}
                        />
                    ))}
                </Box>

                <Typography sx={{ fontSize: "20px", fontWeight: "500", mt: 3, display: "none" }} ref={reportDateRef}>
                    Report Date {reportDate()}
                </Typography>

                <Box className="machineDetailChartFilter">
                    <Box className="header">
                        <Typography>Utilization</Typography>
                        <Box className="Filters">
                            <Button title='Line Chart' className={`chartFilterButton left ${chartType === "line" && "active"}`} onClick={() => setChartType("line")} ><TimelineIcon /></Button>
                            <Button title='Bar Chart' className={`chartFilterButton ${chartType === "bar" && "active"}`} onClick={() => setChartType("bar")} ><BarChartIcon /></Button>
                            <Button title='Stacked Bar Chart' className={`chartFilterButton ${chartType === "stacked" && "active"}`}  onClick={() => setChartType("stacked")} ><StackedBarChartIcon /></Button>
                            <Button title='Pie Chart' className={`chartFilterButton ${chartType === "pie" && "active"}`} onClick={() => setChartType("pie")} ><PieChartIcon /></Button>
                            <Button title='Radar Chart' className={`chartFilterButton ${chartType === "radar" && "active"}`} onClick={() => setChartType("radar")} ><ScatterPlotIcon /></Button>
                            <Button title='Polar Chart' className={`chartFilterButton right ${chartType === "polar" && "active"}`} onClick={() => setChartType("polar")} ><DonutSmallIcon /></Button>
                        </Box>
                    </Box>
                    <Box></Box>
                </Box>
                <Box className="machineDetailDetails">
                    <Box><ProductionDetailLineChart chartData={chartData} chartType={chartType} /></Box>
                    <Box className="additionalDetails">
                        <BasicCard heading={"Efficiency"} duration={reportDate()} value={`${truncateToFiveDecimals(efficiency)} %`} isIcon={false} />
                        <BasicCard heading={"Success Rate"} duration={reportDate()} value={`${success_rate > 100 ? "100" : truncateToFiveDecimals(success_rate)} %`} isIcon={false} />
                        <BasicCard heading={"Failure Rate"} duration={reportDate()} value={`${truncateToFiveDecimals(failure_rate)} %`} isIcon={false} />
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
}

const mapStatetoProps = ({ main }) => ({
    productionDetail: main.productionDetail,
    loading: main.loading
});

export default connect(mapStatetoProps, { getProductionDetail })(ProductionDetail); // Exporting the Production component for use in other parts of the application
