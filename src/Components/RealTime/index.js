import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket"
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import Layout from "../Layout";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
} from 'chart.js';
import { capitalizeFirstLetter } from "../../constants/_helper";
import { getMachineList } from "../../store/main/actions";
import { connect } from "react-redux";
import { kpiEngineWS } from "../../constants/apiRoutes";

ChartJS.register(
    LinearScale,
);

const RealTime = ({ getMachineList, machines }) => {

  const emptyChartData = {
    labels: [],
    value: [],
  }

  const [connected, setConnected] = useState(false);
  const [chartData, setChartData] = useState(emptyChartData);
  const [filterData, setFilterData] = useState({
      "name": "",
      "machines": "",
      "operations": "",
      "time_aggregation": ""
  });

  const WS_URL = `${kpiEngineWS}/real-time/`
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket( WS_URL, { share: false, shouldReconnect: () => false })

  useEffect(() => {
    getMachineList();
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      setConnected(true)
    }
  }, [readyState])
  
  useEffect(() => {
    const response = JSON.parse(lastJsonMessage);
    if (response && response.value) {
      setChartData((prevData) => {
        const newLabels = [...prevData.labels, response.label];
        const newValues = [...prevData.value, response.value];

        if (newLabels.length > 30) {
          newLabels.shift(); // Remove the oldest label
          newValues.shift(); // Remove the oldest value
        }
  
        return {
          labels: newLabels,
          value: newValues,
        };
      });
    }
    // eslint-disable-next-line
  }, [lastJsonMessage]);
  

  const data = {
    labels: chartData?.labels,
    datasets: [
      {
        label: "Values",
        data: chartData?.value,
        fill: false,
        borderColor: '#3366CC',
        tension: 0.25,
        pointStyle: 'circle',
        pointRadius: 8,
        pointHoverRadius: 12
      }
    ]
  }

  const payload = {
    "message": "start",
    "request": {
        "name": filterData.name,
        "machines": [filterData.machines],
        "operations": [filterData.operations],
        "start_date": "2024-12-03 00:00:00",
        "time_aggregation": filterData.time_aggregation
    }
  }
  
  const stopSession = () => {
    sendJsonMessage({"message": "stop"});
  }
  const sendMessage = () => {
    sendJsonMessage(payload)
  }

  const options = {
    responsive: true,
    plugins: {
        legend: { position: 'bottom', },
        title: { display: false },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    },
    scales: {
        y: {
            title: {
                display: true,
                text: 'Value', // Label for y-axis
            },
        },
        x: {
            title: {
                display: true,
                text: 'Date', // Label for x-axis
            },
        },
    },
};

const machineList = machines.map((item) => item.name);
const operations = ["working", "offline", "idle"];
const name = ["consumption", "cost", "power", "time", "energy"];
const time_aggregation = ["sum", "avg", "min", "max"];

  return (
    <Layout>
      <Box style={{ padding: "1rem" }}>
        <Typography variant="h5" >Start a Real Time Session</Typography>
        <Box style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "25px" }}>
          <FormControl variant="outlined" style={{ width: "300px", backgroundColor: "#fff" }}>
            <InputLabel id="machine-select-label">Machines</InputLabel>
            <Select
              labelId="machine-select-label"
              id="machine-select"
              value={filterData.machines}
              onChange={(e) => setFilterData((prev) => ({...prev, machines: e.target.value }))}
              label="Machines"
            >
              {machineList.map((machine, i) => (
                <MenuItem key={i} value={machine}>{machine}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" style={{ width: "200px", backgroundColor: "#fff" }}>
            <InputLabel id="operation-select-label">Operations</InputLabel>
            <Select
              labelId="operation-select-label"
              id="operation-select"
              value={filterData.operations}
              onChange={(e) => setFilterData((prev) => ({...prev, operations: e.target.value }))}
              label="Operation"
            >
              {operations.map((operation, i) => (
                <MenuItem key={i} value={operation}>{capitalizeFirstLetter(operation)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" style={{ width: "200px", backgroundColor: "#fff" }}>
            <InputLabel id="name-select-label">Name</InputLabel>
            <Select
              labelId="name-select-label"
              id="name-select"
              value={filterData.name}
              onChange={(e) => setFilterData((prev) => ({...prev, name: e.target.value }))}
              label="Machines"
            >
              {name.map((kpi_name, i) => (
                <MenuItem key={i} value={kpi_name}>{capitalizeFirstLetter(kpi_name)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" style={{ width: "200px", backgroundColor: "#fff" }}>
            <InputLabel id="time_aggregation-select-label">Time Aggregation</InputLabel>
            <Select
              labelId="time_aggregation-select-label"
              id="time_aggregation-select"
              value={filterData.time_aggregation}
              onChange={(e) => setFilterData((prev) => ({...prev, time_aggregation: e.target.value }))}
              label="Time Aggregation"
            >
              {time_aggregation.map((time_agg, i) => (
                <MenuItem key={i} value={time_agg}>{capitalizeFirstLetter(time_agg)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => sendMessage()} disabled={!connected} >Start Session</Button>
          <Button variant="contained" onClick={() => stopSession()}>Stop Session</Button>
          <Button variant="contained" onClick={() => setChartData(emptyChartData)}>Reset Chart</Button>
        </Box>
      </Box>

      {connected && chartData && (
        <Box style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "25px", maxHeight: "70%", maxWidth: "70%" }}>
          <Line data={data} options={options} />
        </Box>
      )}

    </Layout>
  );
};

const mapStatetoProps = ({ main }) => ({
  machines: main.machines,
  loading: main.loading
});

export default connect(mapStatetoProps, { getMachineList })(RealTime);
