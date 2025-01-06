import React from "react";
import { Box } from "@mui/material";
import { Bar } from "react-chartjs-2"; // Import chart components from react-chartjs-2
import { hoursToReadableFormat, truncateToFiveDecimals } from "../../constants/_helper";

const DateDataChart = ({ chartData, bgcolor }) => {
  
  const kpi = chartData.kpiName || "";

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: kpi,
        data: kpi.includes("time")
          ? chartData.dataValues.map(seconds => seconds / 3600)
          : chartData.dataValues,
        fill: true,
        borderColor: bgcolor,
        backgroundColor: bgcolor,
        tension: 0.25,
        pointStyle: "circle",
        pointRadius: 8,
        pointHoverRadius: 12
      }
    ]
  };

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
            return `${datasetLabel}: ${kpi.includes("time")
              ? hoursToReadableFormat(value)
              : kpi.includes("consumption")
                ? `${truncateToFiveDecimals(value)} kWh`
                : kpi.includes("cost")
                  ? `${truncateToFiveDecimals(value)} €`
                  : kpi.includes("power")
                    ? `${truncateToFiveDecimals(value)} kW`
                    : value}`;
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
          text: kpi
            ? kpi.includes("time")
              ? `${kpi} (in hrs)`
              : kpi.includes("cycles")
                ? `${kpi} (in #)`
                : kpi.includes("consumption")
                  ? `${kpi} (in kWh)`
                  : kpi.includes("cost")
                    ? `${kpi} (in €)`
                    : kpi.includes("power") ? `${kpi} (in kW)` : kpi
            : "Values"
        },
        beginAtZero: true // Start y-axis from zero
      },
      x: {
        title: {
          display: true,
          text: "Date" // Label for x-axis
        },
        beginAtZero: false // Do not start x-axis from zero
      }
    }
  };
  return (
    <Box style={{ margin: "20px 0", width: "100%" }} className="page-break">
      <Bar options={options} data={data} />
    </Box>
  );
};

export default DateDataChart;
