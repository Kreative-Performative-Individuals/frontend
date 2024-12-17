import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Bar, Line, Radar, Pie, PolarArea } from "react-chartjs-2"; // Import chart components from react-chartjs-2
import {
  callKpiEngineChart,
  getAllDatesBetween
} from "../../../constants/_helper";

const ChartComponent = ({ component, startDate, endDate }) => {
  const labels = getAllDatesBetween(startDate, endDate);
  const [response, setResponse] = useState({
    value: []
  });
  const { kpi_name, chartType, machine, operation } = component.config;
  const payload = {
    name: kpi_name,
    machines: [machine],
    operations: [operation],
    time_aggregation: "sum",
    start_date: startDate,
    end_date: endDate,
    step: 2
  };
  async function handleRequest() {
    const { data } = await callKpiEngineChart(payload);
    setResponse(data);
  }
  useEffect(() => {
    handleRequest();
    // eslint-disable-next-line
  }, []);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "value",
        data: response.value,
        fill: true,
        borderColor: "#3366CC",
        backgroundColor: "#3366CC",
        tension: 0.25,
        pointStyle: "circle",
        pointRadius: 8,
        pointHoverRadius: 12
      }
    ]
  };

  function createPolarData(chartData) {
    // Extract labels from dataset labels
    const labels = chartData.datasets.map(dataset => dataset.label);
    // Sum up the data for each dataset for polar charts
    const data = chartData.datasets.map(dataset => {
      if (Array.isArray(dataset.data)) {
        return dataset.data.reduce((sum, value) => sum + parseFloat(value), 0); // Sum values if it's an array
      }
      return 0;
    });
    // Extract background color for each dataset
    const backgroundColor = chartData.datasets.map(
      dataset => dataset.backgroundColor
    );
    // Structure the data for polar charts
    const polarData = {
      labels: labels,
      datasets: [
        {
          data: data, // The summed data for the chart
          backgroundColor: backgroundColor // Background colors for the segments
        }
      ]
    };

    return polarData; // Return the generated polar data
  }

  const polarData = createPolarData(chartData); // Create polar data using the function

  const options = {
    responsive: true, // Ensure the chart is responsive to window resizing
    plugins: {
      legend: {
        position: "bottom" // Position the legend at the bottom of the chart
      },
      title: {
        display: false // Disable the default title display
      },
      tooltip: {
        mode: "index", // Tooltip will be triggered for all items at the same index
        intersect: false, // Tooltips will be triggered even if the cursor does not intersect a point
        callbacks: {
          label: tooltipItem => {
            const datasetLabel = tooltipItem.dataset.label; // Get the dataset label
            const value = tooltipItem.raw; // Get the value of the tooltip
            return `${datasetLabel}: ${value}`; // Display value with label
          }
        }
      },
      interaction: {
        mode: "index", // Interaction mode is index-based (e.g., hover over one point)
        intersect: false // Interaction occurs even if the cursor doesn't intersect a point
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Values" // Label for y-axis
        },
        stacked: chartType === "stacked", // Stack the bars if chart type is 'stacked'
        beginAtZero: true // Start y-axis from zero
      },
      x: {
        title: {
          display: true,
          text: "Date" // Label for x-axis
        },
        stacked: chartType === "stacked", // Stack the bars if chart type is 'stacked'
        beginAtZero: false // Do not start x-axis from zero
      }
    }
  };

  return (
    <Box key={component.id} style={{ margin: "20px 0", width: "100%" }} className="page-break">
      {chartType === "line" && <Line options={options} data={chartData} />}{" "}
      {/* Render Line chart */}
      {(chartType === "bar" ||
        chartType === "stacked") &&
        <Bar options={options} data={chartData} />}{" "}
      {/* Render Bar or Stacked Bar chart */}
      {chartType === "radar" && <Radar options={options} data={chartData} />}{" "}
      {/* Render Radar chart */}
      {chartType === "pie" && <Pie options={options} data={polarData} />}
      {chartType === "polar" && <PolarArea options={options} data={polarData} />}
    </Box>
  );
};

export default ChartComponent;
