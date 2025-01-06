import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Layout from '../Layout';
import MachineForm from './FilteringMachines';
import { Box, Button, Typography, MenuItem, FormControl, Select, InputLabel, TextField } from '@mui/material';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Importing the CSS for the DatePicker component

// Import MUI icons for chart types
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';

import DataChart from './DataChart';
import { formatDate, runDBQuery, saveToMostlyViewed } from '../../constants/_helper';
import { getKpiClassInstance, save_filter_machine_list } from "../../store/main/actions";

import "./style.scss";
import DateDataChart from './DateDataChart';
import { useLocation } from 'react-router-dom';
import { getLocal } from '../../constants/localstorage';

const DataViewer = ({ save_filter_machine_list, filteredMachineList, getKpiClassInstance, kpiClassInstane }) => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const viewId = searchParams.get('viewId'); 

  const [selectedMachines, setSelectedMachines] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [selectedKPI, setSelectedKPI] = useState('');
  const [selectedOperation, setSelectedOperation] = useState('');
  const [openMachineModal, setOpenMachineModal] = useState(false);
  const [selectedChart, setSelectedChart] = useState("");
  const [kpiList, setKpiList] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], dataValues: [] });
  const [secondChartData, setSecondChartData] = useState({ labels: [], dataValues: [] });
  const [showChart, setShowChart] = useState(false);
  const [selectedMachineName, setSelectedMachineName] = useState('');
  const [selectedMachineBgColor, setSelectedMachineBgColor] = useState('');

  const [mostlyViewed, setMostlyViewed] = useState(JSON.parse(getLocal("mostlyViewed"))); // eslint-disable-line

  useEffect(() => {
    if (viewId) {
      const { data } = mostlyViewed.find(config => config.id === viewId)
      setDateRange(data.timeframe);
      setSelectedKPI(data.kpi);
      setSelectedOperation(data.operation);
      setSelectedChart(data.chartType);
      save_filter_machine_list(data.machines)
      setSelectedMachines(Object.values(data.machines).flat())
    }
    // eslint-disable-next-line
  }, [viewId])

  // Extract selected machine names
  const getSelectedMachineNames = (groupedSelectedMachines) => {
    const names = Object.values(groupedSelectedMachines)
      .flat()
      .map((machine) => `'${machine.name}'`);
    return names.join(', ');
  };

  const onDateRangeChange = (dates) => {
    const [start, end] = dates; // Extract start and end date from the selected range
    setDateRange({ startDate: start, endDate: end });
  };

  const splitKpiName = (input) => {
    const parts = input.split('_');
    const kpi = parts.slice(0, -1).join('_');  // Join all parts except the last one for kpi
    const sum = parts[parts.length - 1];  // The last part is for sum
    return { kpi, sum };
  };

  const handleGenerateCharts = async () => {
    try {
      setSelectedMachineName("");
      setSelectedMachineBgColor("");
      setSecondChartData({ labels: [], dataValues: [] })
      const {endDate, startDate} = dateRange;
      const kpiSplited = splitKpiName(selectedKPI)
      const operationCondition = selectedOperation !== 'all' ? `AND operation = '${selectedOperation}'` : '';
      const query = `SELECT name AS x_axis, ROUND( CASE WHEN SUM(${kpiSplited.sum}) = 'NaN' THEN 0 ELSE SUM(${kpiSplited.sum}) END::numeric, 5) AS y_axis FROM real_time_data WHERE kpi = '${kpiSplited.kpi}' ${operationCondition} AND time BETWEEN '${formatDate(startDate)}' AND '${formatDate(endDate)}' AND name IN (${getSelectedMachineNames(filteredMachineList)}) GROUP BY name ORDER BY name;`;
      const {data} = await runDBQuery(query);
      const apiData = data.data;
      const labels = apiData.map(item => item[0]);
      const dataValues = apiData.map(item => item[1]);
      setChartData({ labels: labels, dataValues: dataValues, kpiName: selectedKPI, chartType: selectedChart });
      setShowChart(true);
      saveToMostlyViewed({ machines: filteredMachineList, timeframe: dateRange, kpi: selectedKPI, operation: selectedOperation, chartType: selectedChart })
    } catch (error) {
      setShowChart(false);
      alert("Error", error.message)
    }
  };
  const handleGenerateDateCharts = async () => {
    try {
      const {endDate, startDate} = dateRange;
      const kpiSplited = splitKpiName(selectedKPI)
      const operationCondition = selectedOperation !== 'all' ? `AND operation = '${selectedOperation}'` : '';
      const query = `SELECT time, SUM(${kpiSplited.sum}) AS value FROM real_time_data WHERE kpi = '${kpiSplited.kpi}' ${operationCondition} AND time BETWEEN '${formatDate(startDate)}' AND '${formatDate(endDate)}' AND name = '${selectedMachineName}' GROUP BY time ORDER BY time;`;
      const {data} = await runDBQuery(query);
      const apiData = data.data;
      const labels = apiData.map(item => item[0].split('T')[0]);
      const dataValues = apiData.map(item => item[1]);
      setSecondChartData({ labels: labels, dataValues: dataValues, kpiName: selectedKPI, chartType: selectedChart });
    } catch (error) {
      alert("Error", error.message)
    }
  };

  const handleToggle = () => {
    setOpenMachineModal(!openMachineModal);
  };

  useEffect(() => {
    getKpiClassInstance({label: "kpi"});
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (kpiClassInstane) {
      const kpisToRemove = ["availability", "carbon_footprint_per_cycle", "cost_per_cycle", "energy_efficiency", "failure_rate", "mean_time_between_failures", "non_operative_time", "operative_consumption", "overall_equipment_effectiveness", "power_cumulative", "power_mean", "success_rate", "total_carbon_footprint", "total_consumption", "total_energy_cost", "utilization_rate"];
      const requiredKpis = kpiClassInstane.filter(str => !kpisToRemove.includes(str));
      setKpiList(requiredKpis);
    }
      // eslint-disable-next-line
  }, [kpiClassInstane]);
  
  useEffect(() => {
      if (selectedMachineName) {
        handleGenerateDateCharts();
      }
      // eslint-disable-next-line
  }, [selectedMachineName]);

  return (
    <Layout>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Data Viewer
      </Typography>
      <Box sx={{ display: "flex", gap: 5, width: "100%" }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: 2,
            flexWrap: 'wrap',
            width: "27%",
            bgcolor: "white",
            padding: 5,
            borderRadius: 5
          }}
        >
          {/* Machine List */}
          <Box sx={{ width: "100%" }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Machine List
            </Typography>
            <Button
              variant={getSelectedMachineNames(filteredMachineList).length > 0 ? "contained" : "outlined"}
              onClick={() => setOpenMachineModal(true)}
              fullWidth
            >
              { getSelectedMachineNames(filteredMachineList).length > 0 ? "Edit Selected Machines" : "Select Machines" }
            </Button>

            <MachineForm open={openMachineModal} onClose={handleToggle} selectedMachines={selectedMachines} setSelectedMachines={setSelectedMachines} />
          </Box>

          {/* Date Range */}
          <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Timeframe
            </Typography>
            <DatePicker
              selected={dateRange.startDate}
              onChange={onDateRangeChange}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              selectsRange
              maxDate={new Date()}
              autoComplete='off'
              customInput={
                <TextField
                  fullWidth
                  label="Select Timeframe"
                  variant="outlined"
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    bgcolor: 'white', // Background color
                  }}
                />
              }
            />
          </Box>

          {/* KPI Dropdown */}
          <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Select KPI
              </Typography>
            <FormControl fullWidth>
              <InputLabel id="kpi-label">Select KPI</InputLabel>
              <Select
                labelId="kpi-label"
                value={selectedKPI}
                onChange={(e) => setSelectedKPI(e.target.value)}
                variant="outlined"
                label="Select KPI"
                sx={{ bgcolor: 'white' }}
              >
                {kpiList && kpiList.sort((a, b) => a.localeCompare(b)).map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item.replaceAll("_", " ") // Replace underscores with spaces
                        .toLowerCase() // Convert the entire string to lowercase
                        .split(" ") // Split the string into words
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
                        .join(" ")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Operation Dropdown */}
          <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Select Operation
              </Typography>
            <FormControl fullWidth>
              <InputLabel id="kpi-label">Select Operation</InputLabel>
              <Select
                labelId="kpi-label"
                value={selectedOperation}
                onChange={(e) => setSelectedOperation(e.target.value)}
                variant="outlined"
                label="Select Operation"
                sx={{ bgcolor: 'white' }}
              >
                <MenuItem value="working">Working</MenuItem>
                <MenuItem value="idle">Idle</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
                <MenuItem value="independent">Independent</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box className="FiltersContainer">
            <Typography>Select Chart Type</Typography>
            <Box className="Filters">
              <Button title='Line Chart' className={`chartFilterButton left ${selectedChart === "line" && "active"}`} onClick={() => setSelectedChart("line")} ><TimelineIcon /></Button>
              <Button title='Bar Chart' className={`chartFilterButton ${selectedChart === "bar" && "active"}`} onClick={() => setSelectedChart("bar")} ><BarChartIcon /></Button>
              <Button title='Pie Chart' className={`chartFilterButton ${selectedChart === "pie" && "active"}`} onClick={() => setSelectedChart("pie")} ><PieChartIcon /></Button>
              <Button title='Radar Chart' className={`chartFilterButton ${selectedChart === "radar" && "active"}`} onClick={() => setSelectedChart("radar")} ><ScatterPlotIcon /></Button>
              <Button title='Polar Chart' className={`chartFilterButton right ${selectedChart === "polar" && "active"}`} onClick={() => setSelectedChart("polar")} ><DonutSmallIcon /></Button>
            </Box>
          </Box>

          <Box sx={{ width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateCharts}
              fullWidth
              sx={{ height: '56px' }}
            >
              Generate Charts
            </Button>
          </Box>
        </Box>

        {showChart && (
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
              width: "100%",
              bgcolor: "white",
              padding: 5,
              borderRadius: 5
            }}
          >

            <Typography variant="h6">
              {chartData.kpiName.replaceAll("_", " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} {"Chart | "}
              {formatDate(dateRange.startDate).substring(0,10)} - {formatDate(dateRange.endDate).substring(0,10)}
            </Typography>
            <DataChart chartData={chartData} setSelectedMachineName={setSelectedMachineName} setSelectedMachineBgColor={setSelectedMachineBgColor} />

            {selectedMachineName && (
              <Box sx={{ width: "100%" }}>
                <Typography variant="h6">
                  {selectedMachineName} {" | "} {chartData.kpiName.replaceAll("_", " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} {"Chart"}
                </Typography>
                <DateDataChart chartData={secondChartData} bgcolor={selectedMachineBgColor} />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Layout>
  );
};

const mapStatetoProps = ({ main }) => ({
  filteredMachineList: main.filteredMachineList,
  kpiClassInstane: main.kpiClassInstane.instances,
});

export default connect(mapStatetoProps, { save_filter_machine_list, getKpiClassInstance })(DataViewer);
