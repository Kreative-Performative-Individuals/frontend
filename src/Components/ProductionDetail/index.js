import React, { useEffect, useRef, useState } from 'react'; // Import React
import { useLocation, useParams } from 'react-router-dom'; // Import useParams for routing
import Layout from '../Layout';
import PowerIcon from "../../Assets/Power Logo.svg";
import ConsumptionIcon from "../../Assets/Consumption Logo.svg";
import CostIcon from "../../Assets/Total Cost.svg";
import EnergyIcon from "../../Assets/Energy Logo.svg";

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
    const location = useLocation(); // Access the current location object
    const queryParams = new URLSearchParams(location.search); // Parse the query string

    const { toPDF, targetRef } = usePDF({filename: `${machineId} Machine Usage.pdf`});
    const reportDateRef = useRef(null);
    const filterRef = useRef(null);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [chartData, setChartData] = useState({});

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
    const machineName = queryParams.get("machineName");
    const machineStatus = queryParams.get("machineStatus");
    const total_cycles = productionDetail.total_cycles;
    const good_cycles = productionDetail.good_cycles;
    const bad_cycles = productionDetail.bad_cycles;
    const avg_cycle_time = productionDetail.average_cycle_time;
    const efficiency = productionDetail.efficiency;
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
                            <Button className="chartFilterButton left"><LineChartSVG /></Button>
                            <Button className="chartFilterButton"><AreaChartSVG /></Button>
                            <Button className="chartFilterButton right"><BarChartSVG /></Button>
                        </Box>
                    </Box>
                    <Box></Box>
                </Box>
                <Box className="machineDetailDetails">
                    <Box><ProductionDetailLineChart chartData={chartData} /></Box>
                    <Box className="additionalDetails">
                        <BasicCard heading={"Efficiency"} duration={reportDate()} value={`${efficiency} %`} isIcon={false} />
                        <BasicCard heading={"Success Rate"} duration={reportDate()} value={`${success_rate > 100 ? "100" : success_rate} %`} isIcon={false} />
                        <BasicCard heading={"Failure Rate"} duration={reportDate()} value={`${failure_rate} %`} isIcon={false} />
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