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



const FinancialLineChart = () => {

    const data = {
        labels: ['01/03/2024', '02/03/2024', '03/03/2024', '04/03/2024', '05/03/2024'],
        datasets: [
            {
                label: 'Operational Cost',
                data: [4800, 6000, 5750, 6500, 6000],
                fill: false,
                borderColor: '#3366CC',
                tension: 0.1,
                pointStyle: 'circle',
                pointRadius: 10,
                pointHoverRadius: 15
            }
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
                    text: 'Cost (in €)', // Y-axis label
                },
                beginAtZero: false,
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

export default FinancialLineChart