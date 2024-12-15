import React, { useEffect, useRef, useState } from 'react'; // Import React
import { useParams } from 'react-router-dom'; // Import useParams for routing
import Layout from '../Layout';
import PowerIcon from "../../Assets/Power Logo.svg";
import ConsumptionIcon from "../../Assets/Consumption Logo.svg";
import CostIcon from "../../Assets/Total Cost.svg";
import EnergyIcon from "../../Assets/Energy Logo.svg";

import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';

import { Box, Button, Typography } from '@mui/material';
import BasicCard from '../Common/BasicCard';
import MachineDetailLineChart from './MachineDetailLineChart';
import DateFilter from '../Common/DateFilter';
import { getMachineDetail } from '../../store/main/actions';
import { getOneDay5MonthsAgo, capitalizeFirstLetter, truncateToFiveDecimals, formatDate, getLastDayOfMonth, addOneDay, showDateOnly, runDBQuery } from '../../constants/_helper';
import { connect } from 'react-redux';
import { usePDF } from 'react-to-pdf';

import './style.scss';

const MachineDetail = ({ getMachineDetail, singleMachineDetail }) => {
    const { machineId } = useParams(); // Get machineId from URL parameters
    const { toPDF, targetRef } = usePDF({filename: `${machineId} Machine Usage.pdf`});
    const reportDateRef = useRef(null);
    const filterRef = useRef(null);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [chartData, setChartData] = useState({});
    const [chartType, setChartType] = useState("line");

    const onDateRangeChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        setSelectedDate(null);
        setSelectedMonth(null);
        if (start && end) {
            getMachineDetail({machineId, init_date: formatDate(start), end_date: formatDate(end)});
            getQueryResult(formatDate(start), formatDate(end));
        }
    };
    const onDateMonthChange = (date) => {
        setSelectedMonth(date);
        setSelectedDate(null);
        setStartDate(null);
        setEndDate(null);
        if (date) {
            const end_date = getLastDayOfMonth(date)
            getMachineDetail({machineId, init_date: formatDate(date), end_date})
            getQueryResult(formatDate(date), end_date);
        }
    };
    const onDateDayChange = (date) => {
        setSelectedDate(date);
        setSelectedMonth(null);
        setStartDate(null);
        setEndDate(null);
        if (date) {
            const end_date = addOneDay(date)
            getMachineDetail({machineId, init_date: formatDate(date), end_date})
            getQueryResult(formatDate(date), end_date);
        }
    };

    function transformDataForChart(data) {
        const result = {
            labels: [],
            working: [],
            idle: [],
            offline: []
        };

        const convertToHours = (data) => (data / 3600).toFixed(2);
    
        data.forEach(item => {
            const formattedDate = item[0].split('T')[0];
            result.labels.push(formattedDate);
            result.working.push(convertToHours(item[1]));
            result.idle.push(convertToHours(item[2]));
            result.offline.push(convertToHours(item[3]));
        });
    
        setChartData(result);
    }

    const { init_date, end_date, oneWeekBeforeEndData } = getOneDay5MonthsAgo();
    // const { startDate, endDate } = convertDateRangeToDates(dateRange);
    const getQueryResult = async (initialize_date, ending_date) => {
        const query = `SELECT time, SUM(CASE WHEN operation = 'working' THEN sum ELSE 0 END) AS working_time, SUM(CASE WHEN operation = 'idle' THEN sum ELSE 0 END) AS idle_time, SUM(CASE WHEN operation = 'offline' THEN sum ELSE 0 END) AS offline_time FROM  real_time_data WHERE  kpi = 'time'  AND time >= '${initialize_date}'  AND time <= '${ending_date}' AND asset_id = '${machineId}' GROUP BY time ORDER BY time;`
        const result = await runDBQuery(query);
        transformDataForChart(result.data.data);
    }
    
    
    useEffect(() => {
        getMachineDetail({ machineId, init_date, end_date });
        getQueryResult(oneWeekBeforeEndData, end_date)
        // eslint-disable-next-line
    }, []);

    const downloadReport = () => {
        targetRef.current.style.padding = '40px';
        filterRef.current.style.display = 'none';
        reportDateRef.current.style.display = 'block';
        toPDF();
        targetRef.current.style.padding = '0px';
        filterRef.current.style.display = 'block';
        reportDateRef.current.style.display = 'none';
    };

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
            <Box className="machineDetail" ref={targetRef}>
                <Box className="machineDetailHead">
                    <Box className="machineDetailIntro">
                        <Typography className='machineName'>{singleMachineDetail?.machineName}</Typography>
                        <Box className={`machineStatus ${singleMachineDetail?.machineStatus === "working" ? "working" : ""} ${singleMachineDetail?.machineStatus === "offline" ? "offline" : ""} ${singleMachineDetail?.machineStatus === "idle" ? "idle" : ""}`}>
                            {capitalizeFirstLetter(singleMachineDetail ? singleMachineDetail?.machineStatus : "")}
                        </Box>
                    </Box>

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

                <Typography sx={{ fontSize: "20px", fontWeight: "500", mt: 3, display: "none" }} ref={reportDateRef}>
                    Report Date {reportDate()}
                </Typography>
                
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
                    <Box></Box>
                </Box>
                <Box className="machineDetailDetails">
                    <Box>
                        {
                            <MachineDetailLineChart chartData={chartData} chartType={chartType} />
                        }
                    </Box>
                    <Box className="additionalDetails">
                        <BasicCard heading={"Utilization Rate"} duration={reportDate()} value={`${singleMachineDetail.utilization_rate === -1 ? "Not Available" : `${singleMachineDetail.utilization_rate} %`}`} isIcon={false} />
                        <BasicCard heading={"Availability"} duration={reportDate()} value={`${singleMachineDetail.availability === -1 || singleMachineDetail.availability === 0 ? "Not Available" : `${singleMachineDetail.availability} %`}`} isIcon={false} />
                        <BasicCard heading={"Downtime"} duration={reportDate()} value={`${singleMachineDetail.downtime === -1 || singleMachineDetail.downtime === 0 ? "Not Available" : `${singleMachineDetail.downtime} hours`}`} isIcon={false} />
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
