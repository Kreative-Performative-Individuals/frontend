import React, { useEffect, useRef, useState } from 'react'; // Import React hooks for managing state and side-effects
import { useParams } from 'react-router-dom'; // Import useParams to get dynamic parameters from URL (machineId)
import Layout from '../Layout'; // Import Layout component for the page structure
import PowerIcon from "../../Assets/Power Logo.svg"; // Import power icon for displaying in cards
import ConsumptionIcon from "../../Assets/Consumption Logo.svg"; // Import consumption icon for displaying in cards
import CostIcon from "../../Assets/Total Cost.svg"; // Import cost icon for displaying in cards
import EnergyIcon from "../../Assets/Energy Logo.svg"; // Import energy icon for displaying in cards

import StackedBarChartIcon from '@mui/icons-material/StackedBarChart'; // Import icons for chart types
import TimelineIcon from '@mui/icons-material/Timeline'; // Import icon for line chart
import BarChartIcon from '@mui/icons-material/BarChart'; // Import icon for bar chart
import PieChartIcon from '@mui/icons-material/PieChart'; // Import icon for pie chart
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot'; // Import icon for radar chart
import DonutSmallIcon from '@mui/icons-material/DonutSmall'; // Import icon for polar chart

import { Box, Button, Typography } from '@mui/material'; // Import MUI components like Box, Button, Typography
import BasicCard from '../Common/BasicCard'; // Import BasicCard component for displaying stats
import MachineDetailLineChart from './MachineDetailLineChart'; // Import custom line chart component for machine data
import DateFilter from '../Common/DateFilter'; // Import DateFilter component to filter data by date
import { getMachineDetail } from '../../store/main/actions'; // Import the action to fetch machine details
import { getOneDay5MonthsAgo, capitalizeFirstLetter, truncateToFiveDecimals, formatDate, getLastDayOfMonth, addOneDay, showDateOnly, secondsToReadableFormat, runDBQuery } from '../../constants/_helper'; // Import helper functions for date and data formatting
import { connect } from 'react-redux'; // Import Redux connect for mapping state and dispatch actions
import { usePDF } from 'react-to-pdf'; // Import usePDF for generating PDF reports

import './style.scss'; // Import styles for the component

// Main component to display machine details
const MachineDetail = ({ getMachineDetail, singleMachineDetail }) => {
    const { machineId } = useParams(); // Get machineId from URL parameters to identify the machine
    const { toPDF, targetRef } = usePDF({filename: `${machineId} Machine Usage.pdf`}); // Initialize PDF generation
    const reportDateRef = useRef(null); // Reference for the report date element
    const filterRef = useRef(null); // Reference for the filter element

    // State to manage date selection and chart data
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [chartData, setChartData] = useState({});
    const [chartType, setChartType] = useState("line");

    // Handler for date range change
    const onDateRangeChange = (dates) => {
        const [start, end] = dates; // Extract start and end date from the selected range
        setStartDate(start);
        setEndDate(end);
        setSelectedDate(null);
        setSelectedMonth(null);
        if (start && end) {
            // Fetch machine details and query data for the selected date range
            getMachineDetail({ machineId, init_date: formatDate(start), end_date: formatDate(end) });
            getQueryResult(formatDate(start), formatDate(end));
        }
    };

    // Handler for month change
    const onDateMonthChange = (date) => {
        setSelectedMonth(date);
        setSelectedDate(null);
        setStartDate(null);
        setEndDate(null);
        if (date) {
            const end_date = getLastDayOfMonth(date); // Get last day of selected month
            // Fetch machine details and query data for the selected month
            getMachineDetail({ machineId, init_date: formatDate(date), end_date });
            getQueryResult(formatDate(date), end_date);
        }
    };

    // Handler for day change
    const onDateDayChange = (date) => {
        setSelectedDate(date);
        setSelectedMonth(null);
        setStartDate(null);
        setEndDate(null);
        if (date) {
            const end_date = addOneDay(date); // Add one day to the selected date
            // Fetch machine details and query data for the selected day
            getMachineDetail({ machineId, init_date: formatDate(date), end_date });
            getQueryResult(formatDate(date), end_date);
        }
    };

    // Function to transform raw data for chart display
    function transformDataForChart(data) {
        const result = {
            labels: [],
            working: [],
            idle: [],
            offline: []
        };

        // Helper function to convert seconds to hours and format to two decimals
        const convertToHours = (data) => (data / 3600).toFixed(2);

        // Iterate through data and extract relevant information for charting
        data.forEach(item => {
            const formattedDate = item[0].split('T')[0]; // Extract the date part from the timestamp
            result.labels.push(formattedDate); // Add formatted date to labels
            result.working.push(convertToHours(item[1])); // Add working time to chart data
            result.idle.push(convertToHours(item[2])); // Add idle time to chart data
            result.offline.push(convertToHours(item[3])); // Add offline time to chart data
        });

        setChartData(result); // Update chart data state
    }

    // Get initial date and 5 months ago date using helper function
    const { init_date, end_date, oneWeekBeforeEndData } = getOneDay5MonthsAgo();

    // Function to fetch query result for machine usage
    const getQueryResult = async (initialize_date, ending_date) => {
        // SQL query to get machine usage data based on date range
        const query = `SELECT time, SUM(CASE WHEN operation = 'working' THEN sum ELSE 0 END) AS working_time, SUM(CASE WHEN operation = 'idle' THEN sum ELSE 0 END) AS idle_time, SUM(CASE WHEN operation = 'offline' THEN sum ELSE 0 END) AS offline_time FROM  real_time_data WHERE  kpi = 'time'  AND time >= '${initialize_date}'  AND time <= '${ending_date}' AND asset_id = '${machineId}' GROUP BY time ORDER BY time;`
        
        // Fetch the data from the database using the query
        const result = await runDBQuery(query);
        transformDataForChart(result.data.data); // Transform the data for chart
    }

    // Fetch machine details and usage data on component mount
    useEffect(() => {
        getMachineDetail({ machineId, init_date, end_date });
        getQueryResult(oneWeekBeforeEndData, end_date)
        // eslint-disable-next-line
    }, []);

    // Function to download the report as PDF
    const downloadReport = () => {
        targetRef.current.style.padding = '40px'; // Adjust padding for better layout in PDF
        filterRef.current.style.display = 'none'; // Hide the filters in PDF
        reportDateRef.current.style.display = 'block'; // Show the report date in PDF
        toPDF(); // Generate the PDF
        targetRef.current.style.padding = '0px'; // Restore padding after PDF generation
        filterRef.current.style.display = 'block'; // Restore filter visibility
        reportDateRef.current.style.display = 'none'; // Hide the report date again
    };

    // Function to return the formatted date range for the report
    const reportDate = () => {
        const { init_date, end_date } = getOneDay5MonthsAgo();
        const dateOfReport = startDate && endDate ? `${showDateOnly(formatDate(startDate))} - ${showDateOnly(formatDate(endDate))}` 
        : selectedDate ? showDateOnly(formatDate(selectedDate)) 
        : selectedMonth ? `${showDateOnly(formatDate(selectedMonth))} - ${showDateOnly(getLastDayOfMonth(selectedMonth))}` 
        : (`${showDateOnly(init_date)} - ${showDateOnly(end_date)}`)
        return dateOfReport
    }

    return (
        <Layout>
            {/* Main machine details container */}
            <Box className="machineDetail" ref={targetRef}>
                <Box className="machineDetailHead">
                    {/* Section showing machine name and status */}
                    <Box className="machineDetailIntro">
                        <Typography className='machineName'>{singleMachineDetail?.machineName}</Typography>
                        <Box className={`machineStatus ${singleMachineDetail?.machineStatus === "working" ? "working" : ""} ${singleMachineDetail?.machineStatus === "offline" ? "offline" : ""} ${singleMachineDetail?.machineStatus === "idle" ? "idle" : ""}`}>
                            {capitalizeFirstLetter(singleMachineDetail ? singleMachineDetail?.machineStatus : "")}
                        </Box>
                    </Box>

                    {/* Section with date filters and report download button */}
                    <Box className="machineDetailFilters" ref={filterRef}>
                        <DateFilter
                            startDate={startDate}
                            endDate={endDate}
                            selectedDate={selectedDate}
                            selectedMonth={selectedMonth}
                            onDateDayChange={onDateDayChange}
                            onDateMonthChange={onDateMonthChange}
                            onDateRangeChange={onDateRangeChange}
                        />
                        <Button className="button" onClick={downloadReport}>Download Report</Button>
                    </Box>
                </Box>

                {/* Report date section */}
                <Typography sx={{ fontSize: "20px", fontWeight: "500", mt: 3, display: "none" }} ref={reportDateRef}>
                    Report Date {reportDate()}
                </Typography>

                {/* Machine stats display */}
                <Box className="machineDetailStats">
                    <BasicCard
                        heading="Total Power"
                        value={`${singleMachineDetail ? truncateToFiveDecimals(singleMachineDetail?.totalPower) : "-"} kw`}
                        icon={PowerIcon}
                        iconBackground="rgba(130, 128, 255, 0.25)"
                        duration={reportDate()}
                    />
                    <BasicCard
                        heading="Total Consumption"
                        value={`${singleMachineDetail ? truncateToFiveDecimals(singleMachineDetail?.totalConsumption) : "-"} kWh`}
                        icon={ConsumptionIcon}
                        iconBackground="rgba(254, 197, 61, 0.25)"
                        isStat={false}
                        duration={reportDate()}
                        statPercent="4.3%"
                        statUpOrDown="Up"
                        statText="Up from yesterday"
                    />
                    <BasicCard
                        heading="Total Cost"
                        value={`${singleMachineDetail ? truncateToFiveDecimals(singleMachineDetail?.totalCost) : "-"} €`}
                        icon={CostIcon}
                        iconBackground="rgba(74, 217, 145, 0.25)"
                        isStat={false}
                        duration={reportDate()}
                        statPercent="1.7%"
                        statUpOrDown="Down"
                        statText="Down from yesterday"
                    />
                    <BasicCard
                        heading="Energy Contributions"
                        value={`${"Not Available"}` || "-"}
                        icon={EnergyIcon}
                        iconBackground="rgba(254, 144, 102, 0.25)"
                        isStat={false}
                        duration={reportDate()}
                        statPercent="1.7%"
                        statUpOrDown="Down"
                        statText="Down from yesterday"
                    />
                </Box>

                {/* Chart type selection */}
                <Box className="machineDetailChartFilter">
                    <Box className="header">
                        <Typography>Utilization</Typography>
                        <Box className="Filters" >
                            <Button title='Line Chart' className={`chartFilterButton left ${chartType === "line" && "active"}`} onClick={() => setChartType("line")} ><TimelineIcon /></Button>
                            <Button title='Bar Chart' className={`chartFilterButton ${chartType === "bar" && "active"}`} onClick={() => setChartType("bar")} ><BarChartIcon /></Button>
                            <Button title='Stacked Bar Chart' className={`chartFilterButton ${chartType === "stacked" && "active"}`}  onClick={() => setChartType("stacked")} ><StackedBarChartIcon /></Button>
                            <Button title='Pie Chart' className={`chartFilterButton ${chartType === "pie" && "active"}`} onClick={() => setChartType("pie")} ><PieChartIcon /></Button>
                            <Button title='Radar Chart' className={`chartFilterButton ${chartType === "radar" && "active"}`} onClick={() => setChartType("radar")} ><ScatterPlotIcon /></Button>
                            <Button title='Polar Chart' className={`chartFilterButton right ${chartType === "polar" && "active"}`} onClick={() => setChartType("polar")} ><DonutSmallIcon /></Button>
                        </Box>
                    </Box>
                </Box>

                {/* Chart and additional details */}
                <Box className="machineDetailDetails">
                    <Box>
                        {
                            <MachineDetailLineChart chartData={chartData} chartType={chartType} />
                        }
                    </Box>
                    <Box className="additionalDetails">
                        <BasicCard heading={"Utilization Rate"} duration={reportDate()} value={`${singleMachineDetail.utilization_rate === -1 ? "Not Available" : `${singleMachineDetail.utilization_rate} %`}`} isIcon={false} />
                        <BasicCard heading={"Availability"} duration={reportDate()} value={`${singleMachineDetail.availability === -1 || singleMachineDetail.availability === 0 ? "Not Available" : `${truncateToFiveDecimals(singleMachineDetail.availability)} %`}`} isIcon={false} />
                        <BasicCard heading={"Downtime"} duration={reportDate()} value={`${singleMachineDetail.downtime === -1 || singleMachineDetail.downtime === 0 ? "Not Available" : `${secondsToReadableFormat(parseInt(singleMachineDetail.downtime))}`}`} isIcon={false} />
                        <BasicCard heading={"Mean time b/w Failure"} duration={reportDate()} value={`${singleMachineDetail.mean_time_between_failures === -1 ? "Not Available" : `${singleMachineDetail.mean_time_between_failures} hour`}`} isIcon={false} />
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
}

const mapStatetoProps = ({ main }) => ({
    singleMachineDetail: main.singleMachineDetail,
    loading: main.loading
});

export default connect(mapStatetoProps, { getMachineDetail })(MachineDetail);
