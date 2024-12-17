import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { Alert, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import "./style.scss";
import { connect } from 'react-redux';
import { getMachineList, getForecasting } from '../../store/main/actions';
import DatePicker from 'react-datepicker';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Forecast = ({ getMachineList, machines, getForecasting, forecast, loading, error, errMsg }) => {

    const [filters, setFilters] = useState({
        kpi: "",
        operation: "",
        transformation: "",
        forecasting: true
    });
    const [machineDetail, setMachineDetail] = useState({
        machine_name: "",
        asset_id: ""
    })

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    
    // const [forecastData, setForecastData] = useState([]);
    const [chartData, setChartData] = useState({});

    const onDateRangeChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    useEffect(() => {
        getMachineList();
        // eslint-disable-next-line
    }, []);


    const kpiClassInstane = [
        "consumption",
        "cost",
        "cycles",
        "good_cycles",
        "bad_cycles",
        "power",
        "time",
        "average_cycle_time"
    ];


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    function formatDate(date) {
        const pad = (num) => String(num).padStart(2, '0'); // Helper to pad single digits
    
        const year = date.getUTCFullYear();
        const month = pad(date.getUTCMonth() + 1); // Months are zero-based
        const day = pad(date.getUTCDate());
        const hours = pad(date.getUTCHours());
        const minutes = pad(date.getUTCMinutes());
        const seconds = pad(date.getUTCSeconds());
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}+00:00`;
    }

    const handleForecast = () => {
        setChartData({})
        getForecasting({ ...machineDetail, ...filters, timestamp_start: formatDate(startDate), timestamp_end: formatDate(endDate) });
    }

    useEffect(() => {
        if (forecast.length !== 0) {
            transformDataForChart(JSON.parse(forecast));
        }
        // eslint-disable-next-line
    }, [forecast])

    function transformDataForChart(data) {
        const result = {
            labels: [],
            sum: [],
            avg: [],
            min: [],
            max: []
        };
        if (filters.forecasting) {
            data.forEach(item => {
                result.labels.push((new Date(item.time).toISOString()).substring(0, 10));
                result.sum.push(item.sum ? item.sum[0] || 0 : 0);
                result.avg.push(item.avg ? item.avg[0] || 0 : 0);
                result.min.push(item.min ? item.min[0] || 0 : 0);
                result.max.push(item.max ? item.max[0] || 0 : 0);
            });
        } else {
            data.forEach(item => {
                result.labels.push((item.time).substring(0, 19));
                result.sum.push(item.sum || 0);
                result.avg.push(item.avg || 0);
                result.min.push(item.min || 0);
                result.max.push(item.max || 0);
            });
        }

        setChartData(result); // Update chart data state
    }

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Sum',
                data: chartData.sum,
                fill: false,
                borderColor: '#3366CC',
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12
            },
            {
                label: 'Min',
                data: chartData.min,
                fill: false,
                borderColor: '#DC3912',
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12
            },
            {
                label: 'Max',
                data: chartData.max,
                fill: false,
                borderColor: '#FF9900',
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12
            },
            {
                label: 'Average',
                data: chartData.avg,
                fill: false,
                borderColor: '#109618',
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (tooltipItem) => {
                        const datasetLabel = tooltipItem.dataset.label;
                        const value = tooltipItem.raw;
                        return `${datasetLabel}: ${value}`;
                    },
                },
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            y: { beginAtZero: false },
            x: { beginAtZero: false }
        },
    };

    return (
        <Layout>
            <Box className="forecast">
                <Typography style={{ fontSize: "24px", fontWeight: "500" }}>Forecasting</Typography>

                <Box style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "25px" }}>
                    <Box sx={{ minWidth: 350 }}>
                        <FormControl fullWidth>
                            <InputLabel id="machine-select">Select Machine</InputLabel>
                            <Select name="name" id="machine" labelId="machine-select" label="Select Machine" 
                                value={machineDetail.asset_id}
                                MenuProps={{ PaperProps: {
                                    style: {
                                    maxHeight: 350,
                                    overflowY: 'auto',
                                    }
                                }}}
                            >
                                {machines.sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                                    <MenuItem key={item.asset_id} value={item.asset_id} onClick={() => setMachineDetail({asset_id: item.asset_id, machine_name: item.name })} >{item.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 350 }}>
                        <FormControl fullWidth>
                            <InputLabel id="report-kpi-label">Selct KPI</InputLabel>
                            <Select 
                                labelId="report-kpi-label" id="report-kpi" label="Select KPI" 
                                name='kpi'
                                MenuProps={{ PaperProps: {
                                    style: {
                                    maxHeight: 350,
                                    overflowY: 'auto',
                                    }
                                }}}
                                value={filters.kpi}
                                onChange={handleChange}
                            >
                            {kpiClassInstane && kpiClassInstane.sort((a, b) => a.localeCompare(b)).map((kpi, i) => (
                                <MenuItem value={kpi} key={i}>{kpi}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "25px" }}>
                    <Box sx={{ minWidth: 250 }}>
                        <FormControl fullWidth>
                            <InputLabel id="operation">Operation</InputLabel>
                            <Select name="operation" id="operation-select" labelId="operation" label="Operation" value={filters.operation} onChange={handleChange}>
                                <MenuItem value={"working"}>{"Working"}</MenuItem>
                                <MenuItem value={"idle"}>{"Idle"}</MenuItem>
                                <MenuItem value={"offline"}>{"Offline"}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 200 }}>
                        <FormControl fullWidth>
                            <InputLabel id="transformation">Transformation</InputLabel>
                            <Select name="transformation" id="transformation-select" labelId="transformation" label="Transformation" value={filters.transformation} onChange={handleChange}>
                                <MenuItem value={"T"}>{"Trending"}</MenuItem>
                                <MenuItem value={"S"}>{"Seasonality"}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 225 }}>
                        <FormControl fullWidth>
                            <InputLabel id="forecasting">Forecasting</InputLabel>
                            <Select name="forecasting" id="forecasting-select" labelId="forecasting" label="Forecasting" value={filters.forecasting} onChange={handleChange}>
                                <MenuItem value={true}>{"True"}</MenuItem>
                                <MenuItem value={false}>{"False"}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box className="submitRow">
                    <FormControl style={{ height: "100%", marginRight: "2rem" }}>
                        <DatePicker
                        selected={null} 
                        onChange={onDateRangeChange} 
                        startDate={startDate} 
                        endDate={endDate} 
                        selectsRange 
                        placeholderText="Select Time Range" 
                        />
                    </FormControl>

                    <Button variant='contained' onClick={handleForecast}>Forecast</Button>

                </Box>
                
                {chartData.labels && chartData.labels?.length !== 0 && (
                    <div className='chartSection'>
                        <div className='chartContainer'>
                                <Line data={data} options={options} />
                        </div>
                    </div>
                )}
                {loading && (
                    <div className='chartSection'>
                        <div className='chartContainer'>
                            <Box style={{ display: "flex", alignItems: "center", justifyContent: "center" }} ><CircularProgress /></Box>
                        </div>
                    </div>
                )}
                {error && (
                    <div className='chartSection'>
                        <Alert severity="error">{errMsg.data.detail}</Alert>
                    </div>
                )}
            </Box>
        </Layout>
    )
}

const mapStatetoProps = ({ main }) => ({
    machines: main.machines,
    forecast: main.forecast,
    loading: main.loading,
    error: main.error,
    errMsg: main.errMsg.response
  });
  
  export default connect(mapStatetoProps, { getMachineList, getForecasting })(Forecast);
