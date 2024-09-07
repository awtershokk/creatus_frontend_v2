import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import moment from 'moment';

Chart.register(zoomPlugin);

function GraphPage({ selectedRoomId }) {
    const chartRef = useRef(null);
    const [selectedChart, setSelectedChart] = useState('temperature');
    const [chartInstance, setChartInstance] = useState(null);
    const [temperatureData, setTemperatureData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);
    const [temperatureLimits, setTemperatureLimits] = useState({ min: 1, max: 100 });
    const [humidityLimits, setHumidityLimits] = useState({ min: 1, max: 100 });
    const [labels, setLabels] = useState([]);
    const [timeRange, setTimeRange] = useState('day');

    const calculateYScale = (data, limits) => {
        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);

        if (minValue === maxValue || isNaN(minValue) || isNaN(maxValue)) {
            return { min: 0, max: 100, stepSize: 10 };
        }

        const range = maxValue - minValue;
        const stepSize = range / 10;

        const adjustedMin = Math.min(minValue - stepSize, limits.min - stepSize);
        const adjustedMax = Math.max(maxValue + stepSize, limits.max + stepSize);

        return { min: adjustedMin, max: adjustedMax, stepSize };
    };

    const createChartDataWithColors = (labels, data, limits, title) => {
        const borderColors = data.map(value => {
            if (value > limits.max || value < limits.min) {
                return 'red';
            }
            return 'rgb(54, 162, 235)';
        });

        return {
            labels,
            datasets: [
                {
                    label: `Калиброванная ${title}`,
                    data: data,
                    borderColor: borderColors,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    segment: {
                        borderColor: (ctx) => {
                            const currentValue = ctx.p0.parsed.y;
                            const previousValue = ctx.p1.parsed.y;
                            if ((currentValue > limits.max || currentValue < limits.min) ||
                                (previousValue > limits.max || previousValue < limits.min)) {
                                return 'red';
                            }
                            return 'rgb(54, 162, 235)';
                        },
                    },
                },
                {
                    label: `Верхний предел ${title}`,
                    data: Array(labels.length).fill(limits.max),
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                    borderDash: [5, 5],
                },
                {
                    label: `Нижний предел ${title}`,
                    data: Array(labels.length).fill(limits.min),
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    borderDash: [5, 5],
                },
            ],
        };
    };

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/room/${selectedRoomId}`);
                const data = await response.json();
                const roomData = data.data;

                setTemperatureLimits({
                    min: roomData.temperatureMinimum,
                    max: roomData.temperatureMaximum,
                });
                setHumidityLimits({
                    min: roomData.humidityMinimum,
                    max: roomData.humidityMaximum,
                });
            } catch (error) {
                console.error('Ошибка при получении данных о комнате', error);
            }
        };

        const fetchRecordings = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/room/all/Measurements/${selectedRoomId}`);
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных с сервера');
                }
                const data = await response.json();
                const recordings = data.data;

                if (!recordings || recordings.length === 0) {
                    console.error('Нет доступных значений');
                    return;
                }

                let filteredRecordings;
                let newLabels;
                let temperatureData = [];
                let humidityData = [];

                switch (timeRange) {
                    case 'day':
                        filteredRecordings = recordings.filter(record =>
                            moment(record.createdAt).isSame(moment(), 'day')
                        );
                        newLabels = filteredRecordings.map(record => moment(record.createdAt).format("HH:mm"));
                        temperatureData = filteredRecordings.map(record => record.temperature);
                        humidityData = filteredRecordings.map(record => record.humidity);
                        break;
                    case 'week':
                        filteredRecordings = recordings.filter(record =>
                            moment(record.createdAt).isAfter(moment().subtract(1, 'weeks'))
                        );
                        // Используем формат с датой и временем для отображения всех измерений в течение недели
                        newLabels = filteredRecordings.map(record => moment(record.createdAt).format("DD.MM.YYYY HH:mm"));
                        temperatureData = filteredRecordings.map(record => record.temperature);
                        humidityData = filteredRecordings.map(record => record.humidity);
                        break;
                    case 'month':
                        const dailyData = {};

                        recordings.forEach(record => {
                            const day = moment(record.createdAt).format("DD.MM.YYYY");

                            if (!dailyData[day]) {
                                dailyData[day] = { temperatureSum: 0, humiditySum: 0, count: 0 };
                            }

                            dailyData[day].temperatureSum += record.temperature;
                            dailyData[day].humiditySum += record.humidity;
                            dailyData[day].count += 1;
                        });

                        newLabels = Object.keys(dailyData);
                        temperatureData = newLabels.map(day => dailyData[day].temperatureSum / dailyData[day].count);
                        humidityData = newLabels.map(day => dailyData[day].humiditySum / dailyData[day].count);
                        break;
                    default:
                        filteredRecordings = recordings;
                        newLabels = filteredRecordings.map(record => moment(record.createdAt).format("DD.MM.YYYY HH:mm"));
                        temperatureData = filteredRecordings.map(record => record.temperature);
                        humidityData = filteredRecordings.map(record => record.humidity);
                        break;
                }

                console.log('Temperature Data:', temperatureData);
                console.log('Humidity Data:', humidityData);

                setLabels(newLabels);
                setTemperatureData(temperatureData);
                setHumidityData(humidityData);
            } catch (error) {
                console.error('Нет доступных значений', error);
            }
        };

        fetchRoomData();
        fetchRecordings();
    }, [selectedRoomId, timeRange]);

    const createChart = () => {
        if (!chartRef.current) return;

        const canvas = chartRef.current.getContext('2d');
        const data = selectedChart === 'temperature' ? temperatureData : humidityData;
        const limits = selectedChart === 'temperature' ? temperatureLimits : humidityLimits;
        const yScale = calculateYScale(data, limits);

        const config = {
            type: 'line',
            data: createChartDataWithColors(
                labels,
                data,
                limits,
                selectedChart === 'temperature' ? 'температура' : 'влажность'
            ),
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: selectedChart === 'temperature' ? 'График температуры' : 'График влажности',
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x',
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
                            },
                            mode: 'x',
                        },
                    },
                },
                scales: {
                    x: {
                        type: 'category',
                        labels: labels,
                    },
                    y: {
                        beginAtZero: false,
                        min: yScale.min,
                        max: yScale.max,
                        ticks: {
                            stepSize: yScale.stepSize,
                        },
                    },
                },
            },
        };

        return new Chart(canvas, config);
    };

    useEffect(() => {
        if (chartInstance) {
            chartInstance.destroy();
        }

        const newChartInstance = createChart();
        setChartInstance(newChartInstance);

        return () => {
            if (newChartInstance) {
                newChartInstance.destroy();
            }
        };
    }, [selectedChart, labels, temperatureData, humidityData, temperatureLimits, humidityLimits]);

    const handleTemperatureClick = () => {
        setSelectedChart('temperature');
    };

    const handleHumidityClick = () => {
        setSelectedChart('humidity');
    };

    const handleTimeRangeClick = (range) => {
        setTimeRange(range);
    };

    return (
        <div>
            {/* Temperature and Humidity Tabs */}
            <div className="tabs inline-flex border-b border-gray-700 mb-4 justify-center">
                <button
                    className={`tab py-2 px-4 text-sm font-medium border-b-2 ${
                        selectedChart === 'temperature' ? 'border-gray-800 text-gray-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={handleTemperatureClick}
                >
                    Температура
                </button>
                <button
                    className={`tab py-2 px-4 text-sm font-medium border-b-2 ${
                        selectedChart === 'humidity' ? 'border-gray-800 text-gray-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={handleHumidityClick}
                >
                    Влажность
                </button>
            </div>
            <div></div>
            {/* Time Range Tabs */}
            <div className="tabs inline-flex border-b border-gray-700 mb-4 ">
                <button
                    className={`tab py-2 px-4 text-sm font-medium border-b-2 ${
                        timeRange === 'day' ? 'border-gray-800 text-gray-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={() => handleTimeRangeClick('day')}
                >
                    День
                </button>
                <button
                    className={`tab py-2 px-4 text-sm font-medium border-b-2 ${
                        timeRange === 'week' ? 'border-gray-800 text-gray-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={() => handleTimeRangeClick('week')}
                >
                    Неделя
                </button>
                <button
                    className={`tab py-2 px-4 text-sm font-medium border-b-2 ${
                        timeRange === 'month' ? 'border-gray-800 text-gray-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={() => handleTimeRangeClick('month')}
                >
                    Месяц
                </button>
            </div>

            <div className="w-screen h-auto">
                <canvas ref={chartRef}/>
            </div>
        </div>


    );
}

export default GraphPage;
