import React, { useEffect, useRef, useState } from 'react'
import Layout from '../Layout'

import { Box, Button, Typography } from '@mui/material';

import BasicCard from '../Common/BasicCard'

import GroupIcon from "../../Assets/Group.svg";
import WorkingIcon from "../../Assets/Working Machines.svg";
import CostIcon from "../../Assets/Total Cost.svg";
import OfflineIcon from "../../Assets/Offline Machines.svg";

import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';

import FinancialLineChart from './FinancialLineChart'

import "./style.scss";
import { addOneDay, formatDate, getLastDayOfMonth, getOneDay5MonthsAgo, runDBQuery, showDateOnly, truncateToFiveDecimals } from '../../constants/_helper';
import { usePDF } from 'react-to-pdf';
import DateFilter from '../Common/DateFilter';

const FinancialReport = () => {

    const reportDateRef = useRef(null);
    const filterRef = useRef(null);

    const [financialDetail, setFinancialDetail] = useState({});

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [chartData, setChartData] = useState({});
    const [chartType, setChartType] = useState("line");

    const reportDate = () => {
        const { init_date, end_date } = getOneDay5MonthsAgo();
        const dateOfReport = startDate && endDate ? `${showDateOnly(formatDate(startDate))} - ${showDateOnly(formatDate(endDate))}` 
        : selectedDate ? showDateOnly(formatDate(selectedDate)) 
        : selectedMonth ? `${showDateOnly(formatDate(selectedMonth))} - ${showDateOnly(getLastDayOfMonth(selectedMonth))}` 
        : (`${showDateOnly(init_date)} - ${showDateOnly(end_date)}`)
        return dateOfReport
    }

    const { toPDF, targetRef } = usePDF({filename: `Financial Report - ${reportDate()}.pdf`});
    const getQueryResult = async (initialize_date, ending_date) => {
        const query = `SELECT jsonb_build_object( 'cost_sum', SUM(CASE WHEN kpi = 'cost' THEN sum ELSE 0 END), 'cost_avg', SUM(CASE WHEN kpi = 'cost' THEN avg ELSE 0 END), 'cost_min', SUM(CASE WHEN kpi = 'cost' THEN min ELSE 0 END), 'cost_max', SUM(CASE WHEN kpi = 'cost' THEN max ELSE 0 END), 'total_consumption', SUM(CASE WHEN kpi = 'consumption' THEN max ELSE 0 END), 'total_cycles', SUM(CASE WHEN kpi = 'cycles' THEN max ELSE 0 END)) AS result FROM real_time_data WHERE time >= '${initialize_date}' AND time <= '${ending_date}';`
        const result = await runDBQuery(query);
        setFinancialDetail(result.data.data[0][0]);
    }
    
    const getChartQueryResult = async (initialize_date, ending_date) => {
        const query = `SELECT time, SUM(CASE WHEN kpi = 'cost' THEN sum ELSE 0 END) AS cost_sum, SUM(CASE WHEN kpi = 'cost' THEN avg ELSE 0 END) AS cost_avg, SUM(CASE WHEN kpi = 'cost' THEN min ELSE 0 END) AS cost_min, SUM(CASE WHEN kpi = 'cost' THEN max ELSE 0 END) AS cost_max from real_time_data WHERE time >= '${initialize_date}' AND time <= '${ending_date}' GROUP BY time ORDER BY time;`
        const result = await runDBQuery(query);
        transformDataForChart(result.data.data)
    }

    function transformDataForChart(data) {
        const result = {
            labels: [],
            cost_sum: [],
            cost_avg: [],
            cost_min: [],
            cost_max: []
        };
    
        data.forEach(item => {
            const formattedDate = item[0].split('T')[0];
            result.labels.push(formattedDate);
            result.cost_sum.push(item[1]);
            result.cost_avg.push(item[2]);
            result.cost_min.push(item[3]);
            result.cost_max.push(item[4]);
        });
    
        setChartData(result);
    }



    const onDateRangeChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        setSelectedDate(null);
        setSelectedMonth(null);
        if (start && end) {
            getQueryResult(formatDate(start), formatDate(end));
            getChartQueryResult(formatDate(start), formatDate(end));
        }
    };
    const onDateMonthChange = (date) => {
        setSelectedMonth(date);
        setSelectedDate(null);
        setStartDate(null);
        setEndDate(null);
        if (date) {
            const end_date = getLastDayOfMonth(date)
            getQueryResult(formatDate(date), end_date)
            getChartQueryResult(formatDate(date), end_date);
        }
    };
    const onDateDayChange = (date) => {
        setSelectedDate(date);
        setSelectedMonth(null);
        setStartDate(null);
        setEndDate(null);
        if (date) {
            const end_date = addOneDay(date)
            getQueryResult(formatDate(date), end_date)
            getChartQueryResult(formatDate(date), end_date);
        }
    };

    useEffect(() => {
        const { init_date, end_date, oneWeekBeforeEndData } = getOneDay5MonthsAgo();
        getQueryResult(init_date, end_date);
        getChartQueryResult(oneWeekBeforeEndData, end_date)
        // eslint-disable-next-line
    }, [])

    const cardData = [
        {
            id: 1,
            heading: "Cost Sum",
            value: `${truncateToFiveDecimals(financialDetail.cost_sum)} €`,
            isStat: false,
            icon: GroupIcon,
            iconBackground: "rgba(130, 128, 255, 0.25)",
        },
        {
            id: 2,
            heading: "Cost Mean",
            value: `${truncateToFiveDecimals(financialDetail.cost_avg)} €`,
            isStat: false,
            icon: WorkingIcon,
            iconBackground: "rgba(254, 197, 61, 0.25)",
        },
        {
            id: 3,
            heading: "Cost Min",
            value: `${truncateToFiveDecimals(financialDetail.cost_min)} €`,
            isStat: false,
            icon: CostIcon,
            iconBackground: "rgba(74, 217, 145, 0.25)",
        },
        {
            id: 4,
            heading: "Cost Max",
            value: `${truncateToFiveDecimals(financialDetail.cost_max)} €`,
            isStat: false,
            icon: OfflineIcon,
            iconBackground: "rgba(254, 144, 102, 0.25)",
        },
    ];

    const downloadReport = () => {
        targetRef.current.style.padding = '40px';
        filterRef.current.style.display = 'none';
        reportDateRef.current.style.display = 'block';
        toPDF();
        targetRef.current.style.padding = '0px';
        filterRef.current.style.display = 'flex';
        reportDateRef.current.style.display = 'none';
    };

    return (
        <Layout>
            <Box className="financialReport" ref={targetRef}>
                <Box className="financialReportHead">
                    <Box className="financialReportIntro">
                        <Typography className='financialHeading'>Financial Report</Typography>
                    </Box>
                    <Box className="financialReportFilters" ref={filterRef}>
                    
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
                <Box className="financialReportStats">
                    {cardData.map(({ id, heading, value, isStat, statUpOrDown, statPercent, statText, icon, iconBackground }) => (
                        <BasicCard
                            key={id} // Using unique ID as key
                            heading={heading}
                            duration={reportDate()}
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
                <Box className="financialReportChartFilter">
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
                <Box className="financialDetails">
                    <Box><FinancialLineChart chartData={chartData} chartType={chartType} /></Box>
                    <Box className="additionalDetails">
                        <BasicCard heading={"Cost Per Cycle"} duration={reportDate()} value={`${truncateToFiveDecimals((financialDetail.cost_sum) / financialDetail.total_cycles)} €`} isIcon={false} />
                        <BasicCard heading={"Total Energy Cost"} duration={reportDate()} value={`${truncateToFiveDecimals(financialDetail.total_consumption * financialDetail.cost_avg)} €`} isIcon={false} />
                    </Box>
                </Box>
            </Box>
        </Layout>
    )
}

export default FinancialReport;