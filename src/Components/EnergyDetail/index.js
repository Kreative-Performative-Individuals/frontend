import React, { useEffect, useRef, useState } from 'react'; // Import React
import { useLocation, useParams } from 'react-router-dom'; // Import useParams for routing
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
import './style.scss';
import BasicCard from '../Common/BasicCard';
import EnergyDetailLineChart from './EnergyDetailLineChart';
import { usePDF } from 'react-to-pdf';
import { addOneDay, capitalizeFirstLetter, formatDate, getLastDayOfMonth, getOneDay5MonthsAgo, runDBQuery, showDateOnly, truncateToFiveDecimals } from '../../constants/_helper';
import DateFilter from '../Common/DateFilter';


const EnergyDetail = () => {
    const { machineId } = useParams(); // Get machineId from URL parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const machineName = queryParams.get("machineName");
    const machineStatus = queryParams.get("machineStatus");

    const reportDateRef = useRef(null);
    const filterRef = useRef(null);

    const [machineDetail, setMachineDetail] = useState({});

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

    const { toPDF, targetRef } = usePDF({filename: `${machineName} Energy Detail ${reportDate()}.pdf`});


    const getQueryResult = async (initialize_date, ending_date) => {
        const query = `SELECT json_build_object( 'total_power', SUM(CASE WHEN kpi = 'power' THEN avg ELSE 0 END), 'total_consumption', SUM(CASE WHEN kpi = 'consumption' THEN sum ELSE 0 END), 'total_cost', SUM(CASE WHEN kpi = 'cost' THEN sum ELSE 0 END), 'working_consumption', SUM(CASE WHEN kpi = 'consumption' AND operation = 'working' THEN sum ELSE 0 END), 'idle_consumption', SUM(CASE WHEN kpi = 'consumption' AND operation = 'idle' THEN sum ELSE 0 END), 'total_cycles', SUM(CASE WHEN kpi = 'cycles' THEN sum ELSE 0 END)) AS result FROM real_time_data WHERE time >= '${initialize_date}' AND time <= '${ending_date}' AND asset_id = '${machineId}';`
        const result = await runDBQuery(query);
        setMachineDetail(result.data.data[0][0]);
    }
    
    const getChartQueryResult = async (initialize_date, ending_date) => {
        const query = `SELECT time, SUM(CASE WHEN kpi = 'consumption' THEN sum ELSE 0 END) AS total_consumption, SUM(CASE WHEN kpi = 'consumption' AND operation = 'working' THEN sum ELSE 0 END) AS working_consumption, SUM(CASE WHEN kpi = 'consumption' AND operation = 'idle' THEN sum ELSE 0 END) AS idle_consumption from real_time_data WHERE  time >= '${initialize_date}' AND time <= '${ending_date}' AND asset_id = '${machineId}' GROUP BY time ORDER BY time;`
        const result = await runDBQuery(query);
        transformDataForChart(result.data.data)
    }

    function transformDataForChart(data) {
        const result = {
            labels: [],
            total_consumption: [],
            working_consumption: [],
            idle_consumption: []
        };
    
        data.forEach(item => {
            const formattedDate = item[0].split('T')[0];
            result.labels.push(formattedDate);
            result.total_consumption.push(item[1]);
            result.working_consumption.push(item[2]);
            result.idle_consumption.push(item[3]);
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
            heading: "Total Power",
            value: `${truncateToFiveDecimals(machineDetail.total_power)} kW`,
            duration: reportDate(),
            isStat: false,
            icon: PowerIcon,
            iconBackground: "rgba(130, 128, 255, 0.25)",
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
            <Box className="productionDetail" ref={targetRef}>
                <Box className="productionDetailHead">
                    <Box className="productionDetailIntro">
                        <Typography className='machineName'>{machineName}</Typography>
                        <Box className={`machineStatus ${machineStatus === "working" ? "working" : ""} ${machineStatus === "Offline" ? "offline" : ""} ${machineStatus === "Idle" ? "idle" : ""} ${machineStatus === "Under Maintenance" ? "maintenance" : ""}`}>
                            {capitalizeFirstLetter(machineStatus)}
                        </Box>
                    </Box>

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

                        <Button className="button" onClick={downloadReport}>Download Report</Button>
                    </Box>
                </Box>
                <Typography sx={{ fontSize: "20px", fontWeight: "500", mt: 3, display: "none" }} ref={reportDateRef}>
                    Report Date {reportDate()}
                </Typography>
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
