import React from "react";
import { Bar, Line, Radar, PolarArea, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  RadialLinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadarController
} from "chart.js";
import {
  hoursToReadableFormat,
  truncateToFiveDecimals
} from "../../constants/_helper";

ChartJS.register(
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadarController
);

const DataChart = ({ chartData, setSelectedMachineName, setSelectedMachineBgColor }) => {
  const colors = [
    "#1f77b4", // Blue
    "#ff7f0e", // Orange
    "#2ca02c", // Green
    "#d62728", // Red
    "#9467bd", // Purple
    "#8c564b", // Brown
    "#e377c2", // Pink
    "#7f7f7f", // Gray
    "#bcbd22", // Yellow-green
    "#17becf", // Cyan
    "#f7b733", // Gold
    "#00d8ff", // Light Blue
    "#ff5e5e", // Light Red
    "#ffb74d", // Light Orange
    "#a5d6a7", // Light Green
    "#ce93d8", // Light Purple
    "#ff8a65", // Light Pink
    "#cfd8dc", // Light Gray
    "#dce775", // Lime
    "#64b5f6", // Sky Blue
    "#ffcc80", // Peach
    "#81c784", // Mint Green
    "#ba68c8", // Lavender
    "#ffab91", // Coral
    "#b0bec5", // Blue Gray
    "#ff7043" // Salmon
  ];

  const kpi = chartData.kpiName || "";
  const chartType = chartData.chartType || "";

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: kpi,
        data: kpi.includes("time")
          ? chartData.dataValues.map(seconds => seconds / 3600)
          : chartData.dataValues,
        fill: true,
        tension: 0.25,
        pointStyle: "circle",
        pointRadius: 8,
        pointHoverRadius: 12,
        backgroundColor: chartData.dataValues.map(
          (_, index) => colors[index] || "rgba(75, 192, 192, 0.2)"
        ), // Dynamically set colors
        borderColor: chartData.dataValues.map(
          (_, index) => colors[index] || "rgba(75, 192, 192, 1)"
        ), // Dynamically set border color
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        display:
          chartType === "line" ||
          chartType === "bar" ||
          chartType === "stacked" ||
          chartType === "radar"
            ? false
            : true
      },
      title: {
        display: false
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: tooltipItem => {
            const datasetLabel = tooltipItem.dataset.label;
            const value = tooltipItem.raw;
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
        mode: "index",
        intersect: false
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
        stacked: chartType === "stacked",
        beginAtZero: true
      },
      x: {
        title: {
          display: true,
          text: "Machines"
        },
        stacked: chartType === "stacked",
        beginAtZero: false
      }
    },
    onClick: (event, elements) => {
        if (elements.length > 0) {
          // Get the first clicked element
          const clickedElement = elements[0];
          const datasetIndex = clickedElement.datasetIndex;
          const dataIndex = clickedElement.index;

          const label = data.labels[dataIndex];
          // const value = data.datasets[datasetIndex].data[dataIndex];
          const backgroundColor = data.datasets[datasetIndex].backgroundColor[dataIndex];
          setSelectedMachineName(label);
          setSelectedMachineBgColor(backgroundColor);
        } else {
          console.log("Clicked outside the chart elements!");
        }
    }

  };

  return (
    <div style={{ backgroundColor: "#fff", width: "100%" }}>
      {chartType === "line" && <Line data={data} options={options} />}
      {(chartType === "bar" || chartType === "stacked") && <Bar data={data} options={options} />}
      {chartType === "radar" && <Radar data={data} options={options} />}
      {chartType === "pie" && <Pie data={data} options={options} />}
      {chartType === "polar" && <PolarArea data={data} options={options} />}
    </div>
  );
};

export default DataChart;
