import React from 'react';
import { Bar, Line, Radar, PolarArea, Pie } from 'react-chartjs-2';
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
} from 'chart.js';
import { truncateToFiveDecimals } from '../../constants/_helper';

// Register necessary components from Chart.js
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

const FinancialLineChart = ({ chartData, chartType }) => {

    // Prepare the chart data structure
    const data = {
        labels: chartData.labels, // Labels for the x-axis (e.g., dates)
        datasets: [
            {
                label: 'Cost Sum', // Label for the first dataset
                data: chartData.cost_sum, // Data for the 'Cost Sum' line
                fill: false, // Disable fill under the line
                borderColor: '#3366CC', // Line color
                backgroundColor: '#3366CC', // Background color for points
                tension: 0.25, // Curve tension of the line
                pointStyle: 'circle', // Style for points on the line
                pointRadius: 8, // Size of points
                pointHoverRadius: 12, // Size of points when hovered
            },
            {
                label: 'Cost Min', // Label for the second dataset
                data: chartData.cost_min, // Data for the 'Cost Min' line
                fill: false, // Disable fill under the line
                borderColor: '#DC3912', // Line color
                backgroundColor: '#DC3912', // Background color for points
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12
            },
            {
                label: 'Cost Max', // Label for the third dataset
                data: chartData.cost_max, // Data for the 'Cost Max' line
                fill: false, // Disable fill under the line
                borderColor: '#FF9900', // Line color
                backgroundColor: '#FF9900', // Background color for points
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12
            },
            {
                label: 'Cost Mean', // Label for the fourth dataset
                data: chartData.cost_avg, // Data for the 'Cost Mean' line
                fill: false, // Disable fill under the line
                borderColor: '#66CC66', // Line color
                backgroundColor: '#66CC66', // Background color for points
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12,
            },
        ],
    };

    // Function to create data for Polar charts
    function createPolarData(chartData) {
        const labels = chartData.datasets.map(dataset => dataset.label); // Extract dataset labels
        const data = chartData.datasets.map(dataset => {
            if (Array.isArray(dataset.data)) {
                // Sum the data points for each dataset if it's an array
                return dataset.data.reduce((sum, value) => sum + parseFloat(value), 0);
            }
            return 0;
        });
        const backgroundColor = chartData.datasets.map(dataset => dataset.backgroundColor); // Extract background colors for the polar chart
        const polarData = {
            labels: labels, // Polar chart labels
            datasets: [
                {
                    data: data, // Sum of values for each dataset
                    backgroundColor: backgroundColor, // Colors for each slice
                },
            ],
        };
    
        return polarData; // Return the prepared polar chart data
    }
    
    // Prepare polar data using the createPolarData function
    const polarData = createPolarData(data);

    // Chart options to customize appearance and behavior
    const options = {
        responsive: true, // Make the chart responsive to screen size
        plugins: {
            legend: {
                position: 'bottom', // Position the legend at the bottom
            },
            title: {
                display: false // Disable chart title
            },
            tooltip: {
                mode: 'index', // Display tooltip for all points at a given x position
                intersect: false, // Tooltips are shown even when hovering between points
                callbacks: {
                    label: (tooltipItem) => {
                        const datasetLabel = tooltipItem.dataset.label; // Dataset label
                        const value = tooltipItem.raw; // Raw value of the point
                        return `${datasetLabel}: ${truncateToFiveDecimals(value)} €`; // Format tooltip label
                    },
                },
            },
            interaction: {
                mode: 'index', // Enable interaction mode
                intersect: false, // Allow interaction even between points
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Cost (in €)', // Y-axis label
                },
                stacked: chartType === "stacked", // Stack bars if chartType is 'stacked'
                beginAtZero: true, // Start Y-axis from 0
            },
            x: {
                title: {
                    display: true,
                    text: 'Date', // X-axis label
                },
                stacked: chartType === "stacked", // Stack bars if chartType is 'stacked'
                beginAtZero: false, // Start X-axis from the first date
            },
        },
    };

    // Render the chart based on the selected chart type
    return (
        <div style={{ backgroundColor: "#fff" }}>
            {chartType === "line" && <Line data={data} options={options} />} {/* Line chart */}
            {(chartType === "bar" || chartType === "stacked") && <Bar data={data} options={options} />} {/* Bar or Stacked bar chart */}
            {chartType === "pie" && <Pie data={polarData} options={options} />} {/* Pie chart */}
            {chartType === "radar" && <Radar data={data} options={options} />} {/* Radar chart */}
            {chartType === "polar" && <PolarArea data={polarData} options={options} />} {/* Polar chart */}
        </div>
    )
}

export default FinancialLineChart;
