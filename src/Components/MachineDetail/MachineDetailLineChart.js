import React from 'react'
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
import { hoursToReadableFormat } from '../../constants/_helper';

// Register components with Chart.js for use in rendering charts
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

// Main component for rendering different types of charts (Line, Bar, Radar, Pie, PolarArea)
const MachineDetailLineChart = ({ chartData, chartType }) => {
    
    // Define the chart data structure with labels and datasets for working, idle, and offline times
    const data = {
        labels: chartData.labels, // Dates or categories on X-axis
        datasets: [
            {
                label: 'Working Time',
                data: chartData.working, // Data for working time
                fill: false,
                borderColor: '#3366CC', // Color for the line
                backgroundColor: '#3366CC', // Color for points
                tension: 0.25,
                pointStyle: 'circle', // Shape of the points
                pointRadius: 8, // Size of the points
                pointHoverRadius: 12 // Size of points on hover
            },
            {
                label: 'Idle Time',
                data: chartData.idle, // Data for idle time
                fill: false,
                borderColor: '#DC3912', // Color for the line
                backgroundColor: '#DC3912', // Color for points
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12
            },
            {
                label: 'Offline Time',
                data: chartData.offline, // Data for offline time
                fill: false,
                borderColor: '#FF9900', // Color for the line
                backgroundColor: '#FF9900', // Color for points
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12
            },
        ],
    };

    // Function to create polar chart data from the existing dataset
    function createPolarData(chartData) {
        // Extract labels from dataset
        const labels = chartData.datasets.map(dataset => dataset.label);
        
        // Sum the values of each dataset to create the polar chart data
        const data = chartData.datasets.map(dataset => {
            if (Array.isArray(dataset.data)) {
                return dataset.data.reduce((sum, value) => sum + parseFloat(value), 0); // Sum the data points for each category
            }
            return 0; // Default to 0 if no data
        });
        
        // Extract background color for each dataset
        const backgroundColor = chartData.datasets.map(dataset => dataset.backgroundColor);
        
        // Return the formatted polar chart data
        const polarData = {
            labels: labels,
            datasets: [
                {
                    data: data, // Summed data for each category
                    backgroundColor: backgroundColor, // Background color for the chart
                },
            ],
        };
    
        return polarData; // Return the formatted data
    }
    
    // Call the function to create polar data
    const polarData = createPolarData(data);
    console.log(polarData); // Log the polar data for debugging

    // Define chart options such as responsiveness, tooltip, and scale behavior
    const options = {
        responsive: true, // Make the chart responsive to screen size changes
        plugins: {
            legend: {
                position: 'bottom', // Position the legend at the bottom
            },
            title: {
                display: false // Disable title display
            },
            tooltip: {
                mode: 'index', // Tooltip mode: shows tooltip for all datasets at the same X position
                intersect: false, // Tooltip appears even if the pointer doesn't intersect the line
                callbacks: {
                    label: (tooltipItem) => {
                        const datasetLabel = tooltipItem.dataset.label; // Get the label of the dataset
                        const value = tooltipItem.raw; // Get the value of the data point
                        return `${datasetLabel}: ${hoursToReadableFormat(value)}`; // Format the value to readable hours
                    },
                },
            },
            interaction: {
                mode: 'index', // Interaction mode: triggers on index (X-axis value)
                intersect: false,
            },
        },
        scales: {
            y: {
                title: {
                    display: true, // Display Y-axis title
                    text: 'Time (in hrs)', // Y-axis title text
                },
                stacked: chartType === "stacked", // Enable stacking if chartType is "stacked"
                beginAtZero: true, // Ensure Y-axis starts from 0
            },
            x: {
                title: {
                    display: true, // Display X-axis title
                    text: 'Date', // X-axis title text
                },
                stacked: chartType === "stacked", // Enable stacking if chartType is "stacked"
                beginAtZero: false, // Don't start X-axis from zero (for time-based data)
            },
        },
    };

    // Render different chart types based on the 'chartType' prop
    return (
        <div style={{ backgroundColor: "#fff" }}>
            {chartType === "line" && <Line data={data} options={options} />} {/* Render Line chart */}
            {(chartType === "bar" || chartType === "stacked") && <Bar data={data} options={options} />} {/* Render Bar or Stacked Bar chart */}
            {chartType === "radar" && <Radar data={data} options={options} />} {/* Render Radar chart */}
            {chartType === "pie" && <Pie data={polarData} options={options} />} {/* Render Pie chart */}
            {chartType === "polar" && <PolarArea data={polarData} options={options} />} {/* Render Polar Area chart */}
        </div>
    )
}

export default MachineDetailLineChart
