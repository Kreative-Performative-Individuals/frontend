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



const MachineDetailLineChart = () => {

    const data = {
        labels: ['01/03/2024', '02/03/2024', '03/03/2024', '04/03/2024', '05/03/2024'],
        datasets: [
            {
                label: 'Working Time',
                data: [8, 11, 7, 13, 9],
                fill: false,
                borderColor: '#3366CC',
                tension: 0.1,
                pointStyle: 'circle',
                pointRadius: 10,
                pointHoverRadius: 15
            },
            {
                label: 'Idle Time',
                data: [4, 5, 3, 7, 2],
                fill: false,
                borderColor: '#DC3912',
                tension: 0.1,
                pointStyle: 'circle',
                pointRadius: 10,
                pointHoverRadius: 15
            },
            {
                label: 'Offline Time',
                data: [12, 8, 14, 4, 13],
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
    };


    return (
        <div style={{ backgroundColor: "#fff" }}>
            <Line data={data} options={options} />
        </div>
    )
}

export default MachineDetailLineChart