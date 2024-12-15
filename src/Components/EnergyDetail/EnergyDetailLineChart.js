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
import { truncateToFiveDecimals } from '../../constants/_helper';


// Register components with Chart.js
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



const EnergyDetailLineChart = ({ chartData, chartType }) => {

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Total Consumption',
                data: chartData.total_consumption,
                fill: false,
                borderColor: '#3366CC',
                backgroundColor: '#3366CC',
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12,
            },
            {
                label: 'Working Consumption',
                data: chartData.working_consumption,
                fill: false,
                borderColor: '#DC3912',
                backgroundColor: '#DC3912',
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12
            },
            {
                label: 'Idle Consumption',
                data: chartData.idle_consumption,
                fill: false,
                borderColor: '#FF9900',
                backgroundColor: '#FF9900',
                tension: 0.25,
                pointStyle: 'circle',
                pointRadius: 8,
                pointHoverRadius: 12
            },
        ],
    };

    function createPolarData(chartData) {
        const labels = chartData.datasets.map(dataset => dataset.label);
        const data = chartData.datasets.map(dataset => {
            if (Array.isArray(dataset.data)) {
                return dataset.data.reduce((sum, value) => sum + parseFloat(value), 0);
            }
            return 0;
        });
        const backgroundColor = chartData.datasets.map(dataset => dataset.backgroundColor);
        const polarData = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: backgroundColor,
                },
            ],
        };
    
        return polarData;
    }
    
    const polarData = createPolarData(data);
    

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
                        return `${datasetLabel}: ${truncateToFiveDecimals(value)} kWh`;
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
                    text: 'Consumption (in kWh)', // Y-axis label
                },
                stacked: chartType === "stacked",
                beginAtZero: true,
            },
            x: {
                title: {
                    display: true,
                    text: 'Date', // X-axis label
                },
                stacked: chartType === "stacked",
                beginAtZero: false,
            },
        },
    };


    return (
        <div style={{ backgroundColor: "#fff" }}>
            {chartType === "line" && <Line data={data} options={options} />}
            {(chartType === "bar" || chartType === "stacked") && <Bar data={data} options={options} />}
            {chartType === "pie" && <Pie data={polarData} options={options} />}
            {chartType === "radar" && <Radar data={data} options={options} />}
            {chartType === "polar" && <PolarArea data={polarData} options={options} />}
        </div>
    )
}

export default EnergyDetailLineChart