import React, { useEffect, useRef, useState } from 'react'; // Import React for component creation
import { useLocation, useParams } from 'react-router-dom'; // Import hooks for handling routing and URL parameters
import Layout from '../Layout'; // Import Layout component for consistent page structure
import PowerIcon from "../../Assets/Power Logo.svg"; // Import icons used for card visuals
import ConsumptionIcon from "../../Assets/Consumption Logo.svg";
import CostIcon from "../../Assets/Total Cost.svg";
import EnergyIcon from "../../Assets/Energy Logo.svg";

// Importing chart-related icons from MUI
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';

// Importing MUI components for layout and UI
import { Box, Button, Typography } from '@mui/material';
import './style.scss'; // Import the custom styles for this component
import BasicCard from '../Common/BasicCard'; // Import BasicCard component to display data in card format
import EnergyDetailLineChart from './EnergyDetailLineChart'; // Import the chart component
import { usePDF } from 'react-to-pdf'; // Import hook to handle PDF generation

// Helper functions for formatting and querying data
import { addOneDay, capitalizeFirstLetter, formatDate, getLastDayOfMonth, getOneDay5MonthsAgo, runDBQuery, showDateOnly, truncateToFiveDecimals } from '../../constants/_helper';
import DateFilter from '../Common/DateFilter'; // Import date filter component

const EnergyDetail = () => {
    const { machineId } = useParams(); // Extract machineId from the URL parameters
    const location = useLocation(); // Get the current URL location
    const queryParams = new URLSearchParams(location.search); // Parse the URL query parameters
    const machineName = queryParams.get("machineName"); // Extract machine name from query params
    const machineStatus = queryParams.get("machineStatus"); // Extract machine status from query params

    const reportDateRef = useRef(null); // Reference to control visibility of report date
    const filterRef = useRef(null); // Reference to control visibility of filters

    // State variables for storing data and controlling the UI
    const [machineDetail, setMachineDetail] = useState({}); // Store detailed machine data (power, consumption, etc.)
    const [selectedDate, setSelectedDate] = useState(null); // Selected day for date range
    const [selectedMonth, setSelectedMonth] = useState(null); // Selected month for date range
    const [startDate, setStartDate] = useState(null); // Start date of the selected range
    const [endDate, setEndDate] = useState(null); // End date of the selected range
    const [chartData, setChartData] = useState({}); // Store chart data
    const [chartType, setChartType] = useState("line"); // Default chart type

    // Function to generate the report date range
    const reportDate = () => {
        const { init_date, end_date } = getOneDay5MonthsAgo(); // Get date range from helper function
        const dateOfReport = startDate && endDate ? `${showDateOnly(formatDate(startDate))} - ${showDateOnly(formatDate(endDate))}` 
        : selectedDate ? showDateOnly(formatDate(selectedDate)) 
        : selectedMonth ? `${showDateOnly(formatDate(selectedMonth))} - ${showDateOnly(getLastDayOfMonth(selectedMonth))}` 
        : (`${showDateOnly(init_date)} - ${showDateOnly(end_date)}`) // Determine the report date range
        return dateOfReport
    }

    const { toPDF, targetRef } = usePDF({filename: `${machineName} Energy Detail ${reportDate()}.pdf`}); // PDF export setup

    // Function to get machine data from the database
    const getQueryResult = async (initialize_date, ending_date) => {
        const query = `SELECT json_build_object( 'total_power', SUM(CASE WHEN kpi = 'power' THEN avg ELSE 0 END), 'total_consumption', SUM(CASE WHEN kpi = 'consumption' THEN sum ELSE 0 END), 'total_cost', SUM(CASE WHEN kpi = 'cost' THEN sum ELSE 0 END), 'working_consumption', SUM(CASE WHEN kpi = 'consumption' AND operation = 'working' THEN sum ELSE 0 END), 'idle_consumption', SUM(CASE WHEN kpi = 'consumption' AND operation = 'idle' THEN sum ELSE 0 END), 'total_cycles', SUM(CASE WHEN kpi = 'cycles' THEN sum ELSE 0 END)) AS result FROM real_time_data WHERE time >= '${initialize_date}' AND time <= '${ending_date}' AND asset_id = '${machineId}';`
        const result = await runDBQuery(query); // Execute the query
        setMachineDetail(result.data.data[0][0]); // Set the returned data to machineDetail state
    }

    // Function to get chart data from the database
    const getChartQueryResult = async (initialize_date, ending_date) => {
        const query = `SELECT time, SUM(CASE WHEN kpi = 'consumption' THEN sum ELSE 0 END) AS total_consumption, SUM(CASE WHEN kpi = 'consumption' AND operation = 'working' THEN sum ELSE 0 END) AS working_consumption, SUM(CASE WHEN kpi = 'consumption' AND operation = 'idle' THEN sum ELSE 0 END) AS idle_consumption from real_time_data WHERE  time >= '${initialize_date}' AND time <= '${ending_date}' AND asset_id = '${machineId}' GROUP BY time ORDER BY time;`
        const result = await runDBQuery(query); // Execute the query for chart data
        transformDataForChart(result.data.data) // Transform data for chart
    }

    // Function to transform database data into a format suitable for the chart
    function transformDataForChart(data) {
        const result = {
            labels: [], // Labels for the x-axis (dates)
            total_consumption: [], // Total consumption data
            working_consumption: [], // Working consumption data
            idle_consumption: [] // Idle consumption data
        };

        data.forEach(item => {
            const formattedDate = item[0].split('T')[0]; // Format the date
            result.labels.push(formattedDate); // Add date to labels
            result.total_consumption.push(item[1]); // Add total consumption to chart data
            result.working_consumption.push(item[2]); // Add working consumption to chart data
            result.idle_consumption.push(item[3]); // Add idle consumption to chart data
        });

        setChartData(result); // Set the transformed chart data
    }

    // Handle date range change for filtering data
    const onDateRangeChange = (dates) => {
        const [start, end] = dates; // Extract start and end date
        setStartDate(start); // Update start date state
        setEndDate(end); // Update end date state
        setSelectedDate(null); // Reset selected date
        setSelectedMonth(null); // Reset selected month
        if (start && end) {
            getQueryResult(formatDate(start), formatDate(end)); // Fetch data for the new date range
            getChartQueryResult(formatDate(start), formatDate(end)); // Fetch chart data for the new range
        }
    };

    // Handle month change for filtering data
    const onDateMonthChange = (date) => {
        setSelectedMonth(date); // Update selected month
        setSelectedDate(null); // Reset selected date
        setStartDate(null); // Reset start date
        setEndDate(null); // Reset end date
        if (date) {
            const end_date = getLastDayOfMonth(date); // Get the last day of the selected month
            getQueryResult(formatDate(date), end_date); // Fetch data for the month
            getChartQueryResult(formatDate(date), end_date); // Fetch chart data for the month
        }
    };

    // Handle day change for filtering data
    const onDateDayChange = (date) => {
        setSelectedDate(date); // Update selected date
        setSelectedMonth(null); // Reset selected month
        setStartDate(null); // Reset start date
        setEndDate(null); // Reset end date
        if (date) {
            const end_date = addOneDay(date); // Get the next day after selected date
            getQueryResult(formatDate(date), end_date); // Fetch data for the selected date
            getChartQueryResult(formatDate(date), end_date); // Fetch chart data for the selected date
        }
    };

    // Initial data fetch on component mount
    useEffect(() => {
        const { init_date, end_date, oneWeekBeforeEndData } = getOneDay5MonthsAgo(); // Get initial date range
        getQueryResult(init_date, end_date); // Fetch initial data
        getChartQueryResult(oneWeekBeforeEndData, end_date); // Fetch chart data for one week before the end date
        // eslint-disable-next-line
    }, [])

    // Data for the cards displaying key metrics (power, consumption, cost)
    const cardData = [
        {
            id: 1,
            heading: "Total Power",
            value: `${truncateToFiveDecimals(machineDetail.total_power)} kW`, // Format power value
            duration: reportDate(), // Set report duration
            isStat: false,
            icon: PowerIcon, // Set icon for power
            iconBackground: "rgba(130, 128, 255, 0.25)", // Icon background color
        },
        {
            id: 2,
            heading: "Total Consumption",
            duration: reportDate(),
            value: `${truncateToFiveDecimals(machineDetail.total_consumption)} kWh`,
            isStat: false,
            icon: ConsumptionIcon,
            iconBackground: "rgba(254, 197, 61, 0.25)",
        },
        {
            id: 3,
            heading: "Total Cost",
            duration: reportDate(),
            value: `${truncateToFiveDecimals(machineDetail.total_cost)} €`,
            isStat: false,
            icon: CostIcon,
            iconBackground: "rgba(74, 217, 145, 0.25)",
        },
        {
            id: 4,
            heading: "Energy Contributions",
            duration: reportDate(),
            value: `Not Available` || "-",
            isStat: false,
            icon: EnergyIcon,
            iconBackground: "rgba(254, 144, 102, 0.25)",
        },
    ];

    // Function to handle report download
    const downloadReport = () => {
        targetRef.current.style.padding = '40px'; // Adjust padding for PDF export
        filterRef.current.style.display = 'none'; // Hide filters for clean PDF export
        reportDateRef.current.style.display = 'block'; // Display the report date
        toPDF(); // Trigger the PDF download
        targetRef.current.style.padding = '0px'; // Reset padding
        filterRef.current.style.display = 'flex'; // Restore filter visibility
        reportDateRef.current.style.display = 'none'; // Hide report date
    };

    return (
        <Layout>
            {/* Main container for the energy detail page */}
            <Box className="productionDetail" ref={targetRef}>
                {/* Section for heading and status of the machine */}
                <Box className="productionDetailHead">
                    <Box className="productionDetailIntro">
                        <Typography className='machineName'>{machineName}</Typography> {/* Machine name */}
                        <Box className={`machineStatus ${machineStatus === "working" ? "working" : ""} ${machineStatus === "Offline" ? "offline" : ""} ${machineStatus === "Idle" ? "idle" : ""} ${machineStatus === "Under Maintenance" ? "maintenance" : ""}`}>
                            {capitalizeFirstLetter(machineStatus)} {/* Machine status */}
                        </Box>
                    </Box>

                    {/* Filters and report download */}
                    <Box className="productionDetailFilters" ref={filterRef}>
                        <DateFilter
                            startDate={startDate} // Pass date filter state values
                            endDate={endDate}
                            selectedDate={selectedDate}
                            selectedMonth={selectedMonth}
                            onDateDayChange={onDateDayChange} // Handle day change
                            onDateMonthChange={onDateMonthChange} // Handle month change
                            onDateRangeChange={onDateRangeChange} // Handle range change
                        />

                        <Button className="button" onClick={downloadReport}>Download Report</Button> {/* Button to trigger PDF download */}
                    </Box>
                </Box>
                {/* Report Date */}
                <Typography sx={{ fontSize: "20px", fontWeight: "500", mt: 3, display: "none" }} ref={reportDateRef}>Report Date: {reportDate()}</Typography>

                <Box className="productionDetailStats">
                    {cardData.map(({ id, heading, duration, value, isStat, statUpOrDown, statPercent, statText, icon, iconBackground }) => (
                        <BasicCard
                            key={id} // Using unique ID as key for each BasicCard to optimize rendering
                            heading={heading} // The title or heading for the card
                            duration={duration} // The duration for which the data is applicable
                            value={value} // The main data value to display
                            isStat={isStat} // Boolean to determine if it's a statistical value
                            statUpOrDown={statUpOrDown} // Direction of statistical change (up or down)
                            statPercent={statPercent} // Percentage change for the statistic
                            statText={statText} // Text describing the statistic (e.g., "change in percentage")
                            icon={icon} // Icon to display for the card
                            iconBackground={iconBackground} // Background color for the icon
                        />
                    ))}
                </Box>
                {/* Chart Type Selection */}
                <Box className="machineDetailChartFilter">
                    <Box className="header">
                        <Typography>Utilization</Typography> {/* Title for the chart section */}
                        <Box className="Filters">
                            {/* Buttons to select chart type */}
                            <Button 
                                title='Line Chart' 
                                className={`chartFilterButton left ${chartType === "line" && "active"}`} 
                                onClick={() => setChartType("line")} 
                            >
                                <TimelineIcon /> {/* Icon for line chart */}
                            </Button>
                            <Button 
                                title='Bar Chart' 
                                className={`chartFilterButton ${chartType === "bar" && "active"}`} 
                                onClick={() => setChartType("bar")} 
                            >
                                <BarChartIcon /> {/* Icon for bar chart */}
                            </Button>
                            <Button 
                                title='Stacked Bar Chart' 
                                className={`chartFilterButton ${chartType === "stacked" && "active"}`}  
                                onClick={() => setChartType("stacked")} 
                            >
                                <StackedBarChartIcon /> {/* Icon for stacked bar chart */}
                            </Button>
                            <Button 
                                title='Pie Chart' 
                                className={`chartFilterButton ${chartType === "pie" && "active"}`} 
                                onClick={() => setChartType("pie")} 
                            >
                                <PieChartIcon /> {/* Icon for pie chart */}
                            </Button>
                            <Button 
                                title='Radar Chart' 
                                className={`chartFilterButton ${chartType === "radar" && "active"}`} 
                                onClick={() => setChartType("radar")} 
                            >
                                <ScatterPlotIcon /> {/* Icon for radar chart */}
                            </Button>
                            <Button 
                                title='Polar Chart' 
                                className={`chartFilterButton right ${chartType === "polar" && "active"}`} 
                                onClick={() => setChartType("polar")} 
                            >
                                <DonutSmallIcon /> {/* Icon for polar chart */}
                            </Button>
                        </Box>
                    </Box>
                </Box>
                
                {/* Displaying energy consumption and efficiency details */}
                <Box className="machineDetailDetails">
                    <Box><EnergyDetailLineChart chartData={chartData} chartType={chartType} /></Box>
                    <Box className="additionalDetails">
                        <BasicCard heading={"Working Consumption"} duration={reportDate()} value={`${truncateToFiveDecimals(machineDetail.working_consumption)} kWh`} isIcon={false} />
                        <BasicCard heading={"Idle Consumption"} duration={reportDate()} value={`${truncateToFiveDecimals(machineDetail.idle_consumption)} kWh`} isIcon={false} />
                        <BasicCard heading={"Total Carbon Footprint"} duration={reportDate()} value={`${truncateToFiveDecimals(machineDetail.total_consumption*400)} kgCO2`} isIcon={false} />
                        <BasicCard heading={"Energy Efficiency"} duration={reportDate()} value={`${machineDetail.total_cycles === 0 ? "Not Available" : `${truncateToFiveDecimals((machineDetail.total_consumption*400) / machineDetail.total_cycles) || 0} kWh/cycle`}`} isIcon={false} />
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
}

export default EnergyDetail;
