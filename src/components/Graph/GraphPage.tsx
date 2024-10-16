import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import moment from 'moment';
import GraphFilter from "../Filters/GraphFilter.tsx";
import Label from "../Text/Label.tsx";
import { formatDateTime } from "../../utils/formatDateTime.ts";
import { fetchRoom } from "../../api/requests/roomApi.ts";
import api from "../../api/api.ts";

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
    const [filters, setFilters] = useState({
        dateRange: { start: null, end: null }
    });


    // Функция для вычисления шкалы Y
    const calculateYScale = (data, limits) => {
        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);

        // Calculate range and stepSize
        let range = maxValue - minValue;


        // If minValue is equal to maxValue, set stepSize to 10 and add offset
        if (minValue === maxValue) {
            range = 1;
        }

        // Adjust min and max
        const adjustedMin = Math.min(minValue - range, limits.min - range);
        const adjustedMax = Math.max(maxValue + range, limits.max + range);

        return { min: adjustedMin, max: adjustedMax };
    };


    const createChartDataWithColors = (labels, data, limits, title) => {
        return {
            labels,
            datasets: [
                {
                    label: `Калиброванная ${title}`,
                    data: data,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    segment: {
                        borderColor: (ctx) => {
                            const currentValue = ctx.p0.parsed.y;
                            const previousValue = ctx.p1.parsed.y;
                            if ((currentValue > limits.max || previousValue > limits.max)){
                                return 'red';
                            }
                            if (currentValue < limits.min || previousValue < limits.min){
                                return 'rgb(0,13,174)';
                            }
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
                const roomData = await fetchRoom(selectedRoomId);
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
                const response = await api.get(`/room/all/Measurements/${selectedRoomId}`);
                if (response.status !== 200) {
                    throw new Error('Ошибка при получении данных с сервера');
                }
                const recordings = response.data.data;

                if (!recordings || recordings.length === 0) {
                    console.error('Нет доступных значений');
                    return;
                }

                // Сортировка записей по createdAt (временная метка)
                const sortedRecordings = recordings.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));

                let filteredRecordings;
                let newLabels;
                let temperatureData = [];
                let humidityData = [];

                // Логика фильтрации по диапазону дат, если применен фильтр
                if (filters.dateRange.start) {
                    const startDate = moment(filters.dateRange.start).startOf('day').valueOf();
                    const endDate = moment(filters.dateRange.end || filters.dateRange.start).endOf('day').valueOf();

                    filteredRecordings = sortedRecordings.filter(record =>
                        Number(record.createdAt) >= startDate && Number(record.createdAt) <= endDate
                    );

                    newLabels = filteredRecordings.map(record => {
                        const { date, time } = formatDateTime(record.createdAt);
                        return `${date} ${time}`;
                    });

                    temperatureData = filteredRecordings.map(record => record.temperature);
                    humidityData = filteredRecordings.map(record => record.humidity);
                } else {
                    // Логика фильтрации по времени (день, неделя, месяц)
                    switch (timeRange) {
                        case 'day':
                            filteredRecordings = sortedRecordings.filter(record =>
                                moment(Number(record.createdAt)).isSame(moment(), 'day')
                            );
                            newLabels = filteredRecordings.map(record => {
                                const { date, time } = formatDateTime(record.createdAt);
                                return `${date} ${time}`;
                            });
                            temperatureData = filteredRecordings.map(record => record.temperature);
                            humidityData = filteredRecordings.map(record => record.humidity);
                            break;

                        case 'week':
                            // Фильтрация за последние 7 дней
                            const weekStartDate = moment().subtract(7, 'days').startOf('day');
                            filteredRecordings = sortedRecordings.filter(record =>
                                moment(Number(record.createdAt)).isBetween(weekStartDate, moment(), 'day', '[]')
                            );
                            newLabels = filteredRecordings.map(record => {
                                const { date, time } = formatDateTime(record.createdAt);
                                return `${date} ${time}`;
                            });
                            temperatureData = filteredRecordings.map(record => record.temperature);
                            humidityData = filteredRecordings.map(record => record.humidity);
                            break;

                        case 'month':
                            // Фильтрация за последние 30 дней
                            const monthStartDate = moment().subtract(30, 'days').startOf('day');
                            filteredRecordings = sortedRecordings.filter(record =>
                                moment(Number(record.createdAt)).isBetween(monthStartDate, moment(), 'day', '[]')
                            );
                            newLabels = filteredRecordings.map(record => {
                                const { date, time } = formatDateTime(record.createdAt);
                                return `${date} ${time}`;
                            });
                            temperatureData = filteredRecordings.map(record => record.temperature);
                            humidityData = filteredRecordings.map(record => record.humidity);
                            break;

                        default:
                            filteredRecordings = sortedRecordings;
                            newLabels = filteredRecordings.map(record => {
                                const { date, time } = formatDateTime(record.createdAt);
                                return `${date} ${time}`;
                            });
                            temperatureData = filteredRecordings.map(record => record.temperature);
                            humidityData = filteredRecordings.map(record => record.humidity);
                            break;
                    }
                }

                setLabels(newLabels);
                setTemperatureData(temperatureData);
                setHumidityData(humidityData);
            } catch (error) {
                console.error('Ошибка при получении данных', error);
            }
        };



        fetchRoomData();
        fetchRecordings();
    }, [selectedRoomId, timeRange, filters.dateRange]);

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

    // Проверка наличия данных
    const hasData = selectedChart === 'temperature' ? temperatureData.length > 0 : humidityData.length > 0;

    return (
        <div>
            <div className="flex inline mb-2">
                <div className='mr-2'>
                    <Label text="Параметр:"/>
                </div>

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
            </div>

            <div className="flex inline ">
                <div className='mr-2'>
                    <Label text="Период:"/>
                </div>
                <div className="tabs inline-flex border-b border-gray-700 mb-4">
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
                <div className="">
                </div>
            </div>
            <div className='mb-2 inline'>
                <div className='mb-2'>
                    <Label text="Фильтры:"/>
                </div>
                <GraphFilter onFilterChange={setFilters} timeRange={timeRange}/>
            </div>


            <div className="w-[850px] h-auto mb-4">
                {hasData ? (
                    <canvas ref={chartRef}/>
                ) : (
                    <div className="items-center">
                        <Label text="Нет данных для отображения"></Label>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GraphPage;
