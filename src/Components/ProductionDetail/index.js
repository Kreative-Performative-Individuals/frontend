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
import ProductionDetailLineChart from './ProductionDetailLineChart';
import { getProductionDetail } from '../../store/main/actions';
import { connect } from 'react-redux';
import { usePDF } from 'react-to-pdf';
import DateFilter from '../Common/DateFilter';
import { addOneDay, getLastDayOfMonth, getOneDay5MonthsAgo, formatDate, showDateOnly, truncateToFiveDecimals, runDBQuery } from '../../constants/_helper';

const ProductionDetail = ({ getProductionDetail, productionDetail }) => {
    const { machineId } = useParams(); // Get machineId from URL parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const machineName = queryParams.get("machineName");
    const machineStatus = queryParams.get("machineStatus");

    const reportDateRef = useRef(null);
    const filterRef = useRef(null);

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

    const { toPDF, targetRef } = usePDF({filename: `${machineName} Production Detail ${reportDate()}.pdf`});

    // SELECT * FROM real_time_data WHERE kpi IN ('cycles', 'good_cycles', 'bad_cycles') AND asset_id = 'ast-yhccl1zjue2t';
    const getQueryResult = async (initialize_date, ending_date) => {
        const query = `SELECT time, SUM(CASE WHEN kpi = 'cycles' THEN sum ELSE 0 END) AS cycles, SUM(CASE WHEN kpi = 'good_cycles' THEN sum ELSE 0 END) AS good_cycles, SUM(CASE WHEN kpi = 'bad_cycles' THEN sum ELSE 0 END) AS bad_cycles FROM real_time_data WHERE kpi IN ('cycles', 'good_cycles', 'bad_cycles') AND time >= '${initialize_date}'  AND time <= '${ending_date}' AND asset_id = '${machineId}' GROUP BY time ORDER BY time;`
        const result = await runDBQuery(query);
        transformDataForChart(result.data.data);
    }

    function transformDataForChart(data) {
        const result = {
            labels: [],
            cycles: [],
            good_cycles: [],
            bad_cycles: []
        };
    
        data.forEach(item => {
            const formattedDate = item[0].split('T')[0];
            result.labels.push(formattedDate);
            result.cycles.push(item[1]);
            result.good_cycles.push(item[2]);
            result.bad_cycles.push(item[3]);
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
            getProductionDetail({machineName, init_date: formatDate(start), end_date: formatDate(end)});
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
            getProductionDetail({machineName, init_date: formatDate(date), end_date})
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
            getProductionDetail({machineName, init_date: formatDate(date), end_date})
            getQueryResult(formatDate(date), end_date);
        }
    };

    useEffect(() => {
        const payload = {
            init_date: "2024-05-02 00:00:00",
            end_date: "2024-05-03 00:00:00",
            machineName: machineName
        }
        getProductionDetail(payload);
        getQueryResult("2024-04-26 00:00:00", "2024-05-03 00:00:00")
        // eslint-disable-next-line
    }, [])

    // Retrieve specific query parameters
    
    const total_cycles = productionDetail.total_cycles;
    const good_cycles = productionDetail.good_cycles;
    const bad_cycles = productionDetail.bad_cycles;
    const avg_cycle_time = productionDetail.average_cycle_time;
    const efficiency = productionDetail.efficiency >= 0 ? productionDetail.efficiency : 0;
    const success_rate = productionDetail.success_rate;
    const failure_rate = productionDetail.failure_rate;

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
                        <Box className={`machineStatus ${machineStatus === "Working" || machineStatus === "Active" ? "working" : ""} ${machineStatus === "Offline" ? "offline" : ""} ${machineStatus === "Idle" ? "idle" : ""} ${machineStatus === "Under Maintenance" ? "maintenance" : ""}`}>
                            {machineStatus === "Active" ? "Working" : machineStatus}
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
