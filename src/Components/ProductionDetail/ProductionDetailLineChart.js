import React from 'react';
import { Bar, Line, Radar, PolarArea, Pie } from 'react-chartjs-2'; // Import chart components from react-chartjs-2
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
} from 'chart.js'; // Import necessary components from Chart.js


// Register components with Chart.js
ChartJS.register(
    CategoryScale, // Category scale for the x-axis
    BarElement, // For rendering bar charts
    LinearScale, // Linear scale for the y-axis
    PointElement, // Point elements for line charts
    RadialLinearScale, // For radar chart scales
    LineElement, // Line elements for line charts
    Title, // Title plugin
    Tooltip, // Tooltip plugin for displaying tooltips
    Legend, // Legend plugin for displaying chart legend
    RadarController // Radar chart controller for radar charts
);

const ProductionDetailLineChart = ({ chartData, chartType }) => {
    // Define the chart data structure
    const data = {
        labels: chartData.labels, // Labels for x-axis (e.g., dates)
        datasets: [
            {
                label: 'Total Cycles', // Label for total cycles
                data: chartData.cycles, // Data for total cycles
                fill: false, // Do not fill area under the line
                borderColor: '#3366CC', // Border color for the line
                backgroundColor: '#3366CC', // Background color for points
                tension: 0.25, // Tension for line smoothness
                pointStyle: 'circle', // Shape of the points
                pointRadius: 8, // Radius of the points
                pointHoverRadius: 12 // Radius of points on hover
            },
            {
                label: 'Good Cycles', // Label for good cycles
                data: chartData.good_cycles, // Data for good cycles
                fill: false, // Do not fill area under the line
                borderColor: '#DC3912', // Border color for the line
                backgroundColor: '#DC3912', // Background color for points
                tension: 0.25, // Tension for line smoothness
                pointStyle: 'circle', // Shape of the points
                pointRadius: 8, // Radius of the points
                pointHoverRadius: 12 // Radius of points on hover
            },
            {
                label: 'Bad Cycles', // Label for bad cycles
                data: chartData.bad_cycles, // Data for bad cycles
                fill: false, // Do not fill area under the line
                borderColor: '#FF9900', // Border color for the line
                backgroundColor: '#FF9900', // Background color for points
                tension: 0.25, // Tension for line smoothness
                pointStyle: 'circle', // Shape of the points
                pointRadius: 8, // Radius of the points
                pointHoverRadius: 12 // Radius of points on hover
            },
        ],
    };

    // Function to create data for polar charts (Pie, Radar, PolarArea)
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
        const backgroundColor = chartData.datasets.map(dataset => dataset.backgroundColor);
        // Structure the data for polar charts
        const polarData = {
            labels: labels,
            datasets: [
                {
                    data: data, // The summed data for the chart
                    backgroundColor: backgroundColor, // Background colors for the segments
                },
            ],
        };
    
        return polarData; // Return the generated polar data
    }
    
    const polarData = createPolarData(data); // Create polar data using the function

    // Chart options for configuration
    const options = {
        responsive: true, // Ensure the chart is responsive to window resizing
        plugins: {
            legend: {
                position: 'bottom', // Position the legend at the bottom of the chart
            },
            title: {
                display: false // Disable the default title display
            },
            tooltip: {
                mode: 'index', // Tooltip will be triggered for all items at the same index
                intersect: false, // Tooltips will be triggered even if the cursor does not intersect a point
                callbacks: {
                    label: (tooltipItem) => {
                        const datasetLabel = tooltipItem.dataset.label; // Get the dataset label
                        const value = tooltipItem.raw; // Get the value of the tooltip
                        return `${datasetLabel}: ${value} Cycles`; // Display value with label
                    },
                },
            },
            interaction: {
                mode: 'index', // Interaction mode is index-based (e.g., hover over one point)
                intersect: false, // Interaction occurs even if the cursor doesn't intersect a point
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Cycles', // Label for y-axis
                },
                stacked: chartType === "stacked", // Stack the bars if chart type is 'stacked'
                beginAtZero: true, // Start y-axis from zero
            },
            x: {
                title: {
                    display: true,
                    text: 'Date', // Label for x-axis
                },
                stacked: chartType === "stacked", // Stack the bars if chart type is 'stacked'
                beginAtZero: false, // Do not start x-axis from zero
            },
        },
    };

    return (
        <div style={{ backgroundColor: "#fff" }}>
            {/* Render chart based on the chartType */}
            {chartType === "line" && <Line data={data} options={options} />} {/* Line chart */}
            {(chartType === "bar" || chartType === "stacked") && <Bar data={data} options={options} />} {/* Bar or Stacked bar chart */}
            {chartType === "pie" && <Pie data={polarData} options={options} />} {/* Pie chart */}
            {chartType === "radar" && <Radar data={data} options={options} />} {/* Radar chart */}
            {chartType === "polar" && <PolarArea data={polarData} options={options} />} {/* Polar area chart */}
        </div>
    )
}

export default ProductionDetailLineChart;
