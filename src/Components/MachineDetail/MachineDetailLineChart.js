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
import { hoursToReadableFormat } from '../../constants/_helper';

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



const MachineDetailLineChart = ({ chartData }) => {
    
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Working Time',
                data: chartData.working,
                fill: false,
                borderColor: '#3366CC',
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12
            },
            {
                label: 'Idle Time',
                data: chartData.idle,
                fill: false,
                borderColor: '#DC3912',
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12
            },
            {
                label: 'Offline Time',
                data: chartData.offline,
                fill: false,
                borderColor: '#FF9900',
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12
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
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (tooltipItem) => {
                        const datasetLabel = tooltipItem.dataset.label;
                        const value = tooltipItem.raw;
                        return `${datasetLabel}: ${hoursToReadableFormat(value)}`;
                    },
                },
            },
            interaction: {
                mode: 'index', 
                intersect: false,
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Time (in hrs)', // Y-axis label
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

export default MachineDetailLineChart