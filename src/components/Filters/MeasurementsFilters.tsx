import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown, FaChevronUp, FaTimesCircle } from 'react-icons/fa';
import { ru } from 'date-fns/locale';
import Tooltip from "../Buttons/Tooltip.tsx";
import Label from "../Text/Label.tsx";

interface MeasurementsFiltersProps {
    onFilterChange: (filters: {
        dateRange?: { start: Date | null; end: Date | null },
        timeRange?: { start: Date | null; end: Date | null },
        temperatureDeviation?: { min: number | null; max: number | null },
        humidityDeviation?: { min: number | null; max: number | null }
    }) => void;
}

const MeasurementsFilters: React.FC<MeasurementsFiltersProps> = ({ onFilterChange }) => {
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);
    const [isTempOpen, setIsTempOpen] = useState(false);
    const [isHumidityOpen, setIsHumidityOpen] = useState(false);

    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [timeRange, setTimeRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [temperatureDeviation, setTemperatureDeviation] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
    const [humidityDeviation, setHumidityDeviation] = useState<{ min: number | null; max: number | null }>({ min: null, max: null }); // Новый стейт для фильтра влажности

    const [showDateTooltip, setShowDateTooltip] = useState(false);
    const [showTimeTooltip, setShowTimeTooltip] = useState(false);
    const [showTempTooltip, setShowTempTooltip] = useState(false);
    const [showHumidityTooltip, setShowHumidityTooltip] = useState(false);

    const dateRef = useRef<HTMLDivElement>(null);
    const timeRef = useRef<HTMLDivElement>(null);
    const tempRef = useRef<HTMLDivElement>(null);
    const humidityRef = useRef<HTMLDivElement>(null);

    const toggleDateFilter = () => {
        setIsDateOpen(!isDateOpen);
        if (!isDateOpen) {
            setShowTimeTooltip(false);
            setShowDateTooltip(false);
            setShowTempTooltip(false);
            setShowHumidityTooltip(false);
        }
    };

    const toggleTimeFilter = () => {
        setIsTimeOpen(!isTimeOpen);
        if (!isTimeOpen) {
            setShowDateTooltip(false);
            setShowTimeTooltip(false);
            setShowTempTooltip(false);
            setShowHumidityTooltip(false);
        }
    };

    const toggleTempFilter = () => {
        setIsTempOpen(!isTempOpen);
        if (!isTempOpen) {
            setShowDateTooltip(false);
            setShowTimeTooltip(false);
            setShowTempTooltip(false);
            setShowHumidityTooltip(false);
        }
    };

    const toggleHumidityFilter = () => {
        setIsHumidityOpen(!isHumidityOpen);
        if (!isHumidityOpen) {
            setShowDateTooltip(false);
            setShowTimeTooltip(false);
            setShowTempTooltip(false);
            setShowHumidityTooltip(false);
        }
    };

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setDateRange({ start, end });
        onFilterChange({ dateRange: { start, end }, timeRange, temperatureDeviation, humidityDeviation });
    };

    const handleTimeStartChange = (start: Date | null) => {
        setTimeRange(prev => ({ ...prev, start }));
        onFilterChange({ dateRange, timeRange: { start, end: timeRange.end }, temperatureDeviation, humidityDeviation });
    };

    const handleTimeEndChange = (end: Date | null) => {
        setTimeRange(prev => ({ ...prev, end }));
        onFilterChange({ dateRange, timeRange: { start: timeRange.start, end }, temperatureDeviation, humidityDeviation });
    };

    const handleTempChange = (field: 'min' | 'max', value: string) => {
        const parsedValue = value === '' ? null : parseFloat(value);
        setTemperatureDeviation(prev => ({ ...prev, [field]: parsedValue }));
        onFilterChange({ dateRange, timeRange, temperatureDeviation: { ...temperatureDeviation, [field]: parsedValue }, humidityDeviation });
    };

    const handleHumidityChange = (field: 'min' | 'max', value: string) => {
        const parsedValue = value === '' ? null : parseFloat(value);
        setHumidityDeviation(prev => ({ ...prev, [field]: parsedValue }));
        onFilterChange({ dateRange, timeRange, temperatureDeviation, humidityDeviation: { ...humidityDeviation, [field]: parsedValue } });
    };

    const handleResetAllFilters = () => {
        setDateRange({ start: null, end: null });
        setTimeRange({ start: null, end: null });
        setTemperatureDeviation({ min: null, max: null });
        setHumidityDeviation({ min: null, max: null }); // Сброс фильтра влажности
        onFilterChange({ dateRange: { start: null, end: null }, timeRange: { start: null, end: null }, temperatureDeviation: { min: null, max: null }, humidityDeviation: { min: null, max: null } });
    };

    const formatDateRange = () => {
        if (dateRange.start && !dateRange.end) {
            return dateRange.start.toLocaleDateString();
        } else if (dateRange.start && dateRange.end) {
            return `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`;
        }
        return 'Выберите даты';
    };

    const formatTimeRange = () => {
        const formatTime = (time: Date | null) => (time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
        if (timeRange.start && timeRange.end) {
            return `${formatTime(timeRange.start)} - ${formatTime(timeRange.end)}`;
        }
        return timeRange.start ? formatTime(timeRange.start) : 'Выберите время';
    };

    const formatTemperatureDeviation = () => {
        if (temperatureDeviation.min !== null && temperatureDeviation.max !== null) {
            return `${temperatureDeviation.min}°C - ${temperatureDeviation.max}°C`;
        } else if (temperatureDeviation.min !== null) {
            return `> ${temperatureDeviation.min}°C`;
        } else if (temperatureDeviation.max !== null) {
            return `< ${temperatureDeviation.max}°C`;
        }
        return 'Выберите диапазон температуры';
    };

    const formatHumidityDeviation = () => {
        if (humidityDeviation.min !== null && humidityDeviation.max !== null) {
            return `${humidityDeviation.min}% - ${humidityDeviation.max}%`;
        } else if (humidityDeviation.min !== null) {
            return `> ${humidityDeviation.min}%`;
        } else if (humidityDeviation.max !== null) {
            return `< ${humidityDeviation.max}%`;
        }
        return 'Выберите диапазон влажности';
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
                setIsDateOpen(false);
            }
            if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
                setIsTimeOpen(false);
            }
            if (tempRef.current && !tempRef.current.contains(event.target as Node)) {
                setIsTempOpen(false);
            }
            if (humidityRef.current && !humidityRef.current.contains(event.target as Node)) {
                setIsHumidityOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>

            <div className="flex flex-wrap space-x-4 mt-3">
                <div className="mr-0.5">
                    <Label text="Фильтры:"/>
                </div>
                {/* Фильтр по дате */}
                <div className="relative" ref={dateRef}>
                    <button
                        onClick={toggleDateFilter}
                        className="flex items-center text-black px-4 py-1 rounded-full border border-black"
                    >
                        {"Период дат"} {isDateOpen ? <FaChevronUp className="ml-1"/> :
                        <FaChevronDown className="ml-1"/>}
                    </button>
                    {isDateOpen && (
                        <div className="absolute z-20 bg-white p-4 mt-2 shadow-md rounded">
                            <Tooltip
                                message="Выберите диапазон дат в который хотите посмотреть значения."
                                isVisible={showDateTooltip}
                                toggleVisibility={() => setShowDateTooltip(!showDateTooltip)}
                            />
                            <div className="mb-4"></div>
                            <DatePicker
                                selected={dateRange.start}
                                onChange={handleDateChange}
                                startDate={dateRange.start}
                                endDate={dateRange.end}
                                selectsRange
                                inline
                                locale={ru}
                                dateFormat="dd.MM.yyyy"
                            />
                        </div>
                    )}
                </div>

                {/* Фильтр по времени */}
                <div className="relative" ref={timeRef}>
                    <button
                        onClick={toggleTimeFilter}
                        className="flex items-center text-black px-4 py-1 rounded-full border border-black"
                    >
                        {"Период времени"} {isTimeOpen ? <FaChevronUp className="ml-1"/> :
                        <FaChevronDown className="ml-1"/>}
                    </button>

                    {isTimeOpen && (
                        <div className="absolute z-20 bg-white p-4 mt-2 shadow-md rounded">
                            <Tooltip
                                message="Выберите начальное и конечное время для фильтрации данных. Возможен ручной ввод."
                                isVisible={showTimeTooltip}
                                toggleVisibility={() => setShowTimeTooltip(!showTimeTooltip)}
                            />
                            <div className="flex flex-col space-y-2">
                                <div className="text-black">
                                    <label className="block text-sm">Время от</label>
                                    <DatePicker
                                        selected={timeRange.start}
                                        onChange={handleTimeStartChange}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Время"
                                        placeholderText="00:00"
                                        dateFormat="HH:mm"
                                        locale={ru}
                                        className="bg-white pl-2 text-black border border-black rounded"
                                    />
                                </div>
                                <div className="text-black">
                                    <label className="block text-sm">Время до</label>
                                    <DatePicker
                                        selected={timeRange.end}
                                        onChange={handleTimeEndChange}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Время"
                                        dateFormat="HH:mm"
                                        placeholderText="00:00"
                                        locale={ru}
                                        className="bg-white pl-2 text-black border border-black rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Фильтр по отклонению температуры */}
                <div className="relative" ref={tempRef}>
                    <button
                        onClick={toggleTempFilter}
                        className="flex items-center text-black px-4 py-1 rounded-full border border-black"
                    >
                        {"Отклонение температуры"} {isTempOpen ? <FaChevronUp className="ml-1"/> :
                        <FaChevronDown className="ml-1"/>}
                    </button>

                    {isTempOpen && (
                        <div className="absolute z-20 bg-white p-4 mt-2 shadow-md rounded">
                            <Tooltip
                                message="Введите минимальное и максимальное отклонение температуры в градусах Цельсия."
                                isVisible={showTempTooltip}
                                toggleVisibility={() => setShowTempTooltip(!showTempTooltip)}
                            />
                            <div className="mb-2"></div>
                            <div className="flex flex-col space-y-2">
                                <div className="text-black">
                                    <label className="block text-sm">Минимальное отклонение</label>
                                    <input
                                        type="number"
                                        value={temperatureDeviation.min !== null ? temperatureDeviation.min : ''}
                                        onChange={(e) => handleTempChange('min', e.target.value)}
                                        placeholder="Напр. -5"
                                        className="bg-white pl-2 text-black border border-black rounded w-full"
                                    />
                                </div>
                                <div className="text-black">
                                    <label className="block text-sm">Максимальное отклонение</label>
                                    <input
                                        type="number"
                                        value={temperatureDeviation.max !== null ? temperatureDeviation.max : ''}
                                        onChange={(e) => handleTempChange('max', e.target.value)}
                                        placeholder="Напр. +5"
                                        className="bg-white pl-2 text-black border border-black rounded w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Фильтр по отклонению влажности */}
                <div className="relative" ref={humidityRef}>
                    <button
                        onClick={toggleHumidityFilter}
                        className="flex items-center text-black px-4 py-1 rounded-full border border-black"
                    >
                        {"Отклонение влажности"} {isHumidityOpen ? <FaChevronUp className="ml-1"/> :
                        <FaChevronDown className="ml-1"/>}
                    </button>

                    {isHumidityOpen && (
                        <div className="absolute z-20 bg-white p-4 mt-2 shadow-md rounded">
                            <Tooltip
                                message="Введите минимальное и максимальное отклонение влажности в процентах."
                                isVisible={showHumidityTooltip}
                                toggleVisibility={() => setShowHumidityTooltip(!showHumidityTooltip)}
                            />
                            <div className="mb-2"></div>
                            <div className="flex flex-col space-y-2">
                                <div className="text-black">
                                    <label className="block text-sm">Минимальное отклонение</label>
                                    <input
                                        type="number"
                                        value={humidityDeviation.min !== null ? humidityDeviation.min : ''}
                                        onChange={(e) => handleHumidityChange('min', e.target.value)}
                                        placeholder="Напр. 30"
                                        className="bg-white pl-2 text-black border border-black rounded w-full"
                                    />
                                </div>
                                <div className="text-black">
                                    <label className="block text-sm">Максимальное отклонение</label>
                                    <input
                                        type="number"
                                        value={humidityDeviation.max !== null ? humidityDeviation.max : ''}
                                        onChange={(e) => handleHumidityChange('max', e.target.value)}
                                        placeholder="Напр. 70"
                                        className="bg-white pl-2 text-black border border-black rounded w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            <div className="flex space-x-2 mt-4 mb-2 items-center">
                {dateRange.start && (
                    <div className="flex items-center bg-gray-300 text-black text-xs px-2 py-1 rounded-full">
                        {formatDateRange()} <FaTimesCircle className="ml-1 text-xs cursor-pointer"
                                                           onClick={handleResetAllFilters}/>
                    </div>
                )}

                {(timeRange.start || timeRange.end) && (
                    <div className="flex items-center bg-gray-300 text-black text-xs px-2 py-1 rounded-full">
                        {formatTimeRange()} <FaTimesCircle className="ml-1 text-xs cursor-pointer"
                                                           onClick={handleResetAllFilters}/>
                    </div>
                )}

                {(temperatureDeviation.min !== null || temperatureDeviation.max !== null) && (
                    <div className="flex items-center bg-gray-300 text-black text-xs px-2 py-1 rounded-full">
                        {formatTemperatureDeviation()} <FaTimesCircle className="ml-1 text-xs cursor-pointer"
                                                                      onClick={handleResetAllFilters}/>
                    </div>
                )}

                {(humidityDeviation.min !== null || humidityDeviation.max !== null) && ( // Отображение фильтра по влажности
                    <div className="flex items-center bg-gray-300 text-black text-xs px-2 py-1 rounded-full">
                        {formatHumidityDeviation()} <FaTimesCircle className="ml-1 text-xs cursor-pointer"
                                                                   onClick={handleResetAllFilters}/>
                    </div>
                )}

                {(dateRange.start || timeRange.start || timeRange.end || temperatureDeviation.min !== null || temperatureDeviation.max !== null || humidityDeviation.min !== null || humidityDeviation.max !== null) && (
                    <button
                        onClick={handleResetAllFilters}
                        className="px-2 py-1 bg-gray-300 text-black text-xs rounded-full"
                    >
                        Сбросить все
                    </button>
                )}
            </div>
        </div>
    );
};

export default MeasurementsFilters;
