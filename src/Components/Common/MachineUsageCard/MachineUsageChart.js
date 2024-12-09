import React from 'react'; // Import React library
import { Doughnut } from 'react-chartjs-2'; // Import Doughnut chart from react-chartjs-2
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Import necessary components from Chart.js
import "./style.scss"; // Import styles specific to this component
import { secondsToHHMMSS, secondsToReadableFormat } from '../../../constants/_helper';

// Register components with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// MachineUsageChart component definition
const MachineUsageChart = ({ chartData }) => {
    
    const arrayForChart = Object.values(chartData);

    const data = {
        labels: ['Working Time', 'Idle Time', 'Offline Time', "Independent Time"], // Labels for the chart segments
        datasets: [
            {
                label: 'Usage', // Label for the dataset
                data: arrayForChart, // Data values for each segment
                backgroundColor: ['#448EFC', '#FF8743', '#FF4D4F', '#E1E4E8'], // Colors for each segment
                hoverBackgroundColor: ['#448EFC', '#FF8743', '#FF4D4F', '#E1E4E8'], // Colors when hovered
                hoverOffset: 4, // Offset for hover effect
            },
        ],
    };

    // Chart options for customization
    const options = {
        responsive: true, // Make the chart responsive
        maintainAspectRatio: false, // Allow the chart to stretch
        plugins: {
            legend: {
                position: 'right', // Position of the legend
                labels: {
                    boxWidth: 10, // Width of the legend box
                    padding: 5, // Padding around legend labels
                    generateLabels: (chart) => {
                        // Generate custom labels with data value for the legend
                        const data = chart.data.datasets[0].data; // Access dataset values
                        return chart.data.labels.map((label, index) => {
                            return {
                                text: `${label}: ${secondsToHHMMSS(data[index])}`, // Custom label with data value
                                fillStyle: chart.data.datasets[0].backgroundColor[index], // Set the color
                            };
                        });
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        // Access the data value for the hovered segment
                        const value = tooltipItem.raw; // Get the raw value
                        return `Usage: ${secondsToReadableFormat(value)}`; // Custom text with the value + " hours"
                    },
                },
            },
        },
        elements: {
            arc: {
                borderWidth: 0, // Remove the border from the slices
            },
        },
        layout: {
            padding: 0, // Remove internal padding of the chart
        },
    };

    function hasAllZeroValues(arr) {
        return arr.every(value => value === 0);
    }

    // Render the doughnut chart inside a container
    return (
        <div className='chart-container' >
            {!hasAllZeroValues(arrayForChart) && (
                <Doughnut data={data} options={options} />
            )}
        </div>
    );
}

export default MachineUsageChart; // Export the component for use in other parts of the application