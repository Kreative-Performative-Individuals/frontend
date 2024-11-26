import React from 'react'
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';


// Register components with Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);



const EnergyDetailLineChart = () => {

    const data = {
        labels: ['01/03/2024', '02/03/2024', '03/03/2024', '04/03/2024', '05/03/2024'],
        datasets: [
            {
                label: 'Total Consumption',
                data: [0.66, 0.70, 0.6, 0.65, 0.70],
                fill: false,
                borderColor: '#3366CC',
                tension: 0.1,
                pointStyle: 'circle',
                pointRadius: 10,
                pointHoverRadius: 15
            },
            {
                label: 'Working Consumption',
                data: [0.62, 0.65, 0.59, 0.6, 0.6],
                fill: false,
                borderColor: '#DC3912',
                tension: 0.1,
                pointStyle: 'circle',
                pointRadius: 10,
                pointHoverRadius: 15
            },
            {
                label: 'Idle Consumption',
                data: [0.04, 0.05, 0.01, 0.05, 0.1],
                fill: false,
                borderColor: '#FF9900',
                tension: 0.1,
                pointStyle: 'circle',
                pointRadius: 10,
                pointHoverRadius: 15
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
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Consumption (in kWh)', // Y-axis label
                },
                beginAtZero: true,
            },
            x: {
                title: {
                    display: true,
                    text: 'Date', // X-axis label
                },
                beginAtZero: false,
            },
        },

    };


    return (
        <div style={{ backgroundColor: "#fff" }}>
            <Line data={data} options={options} />
        </div>
    )
}

export default EnergyDetailLineChart