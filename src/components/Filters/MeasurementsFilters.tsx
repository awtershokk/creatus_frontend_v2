import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown, FaChevronUp, FaTimesCircle } from 'react-icons/fa';
import { ru } from 'date-fns/locale';

interface MeasurementsFiltersProps {
    onFilterChange: (filters: { dateRange?: { start: Date | null; end: Date | null } }) => void;
}

const MeasurementsFilters: React.FC<MeasurementsFiltersProps> = ({ onFilterChange }) => {
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const dateRef = useRef<HTMLDivElement>(null);

    const toggleFilter = () => {
        setIsDateOpen(!isDateOpen);
    };

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setDateRange({ start, end });
        onFilterChange({ dateRange: { start, end } });
    };

    const handleResetDateFilter = () => {
        setDateRange({ start: null, end: null });
        onFilterChange({ dateRange: { start: null, end: null } });
    };

    const handleResetAllFilters = () => {
        handleResetDateFilter();
    };

    const formatDateRange = () => {
        if (dateRange.start && !dateRange.end) {
            return dateRange.start.toLocaleDateString();
        } else if (dateRange.start && dateRange.end) {
            return `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`;
        }
        return 'Выберите даты';
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
                setIsDateOpen(false);
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
                <div className="relative" ref={dateRef}>
                    <button
                        onClick={toggleFilter}
                        className="flex items-center text-black px-4 py-1 rounded-full border border-black"
                    >
                        {"Период дат"} {isDateOpen ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                    </button>
                    {isDateOpen && (
                        <div className="absolute z-10 bg-white p-4 mt-2 shadow-md rounded">
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
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={handleResetDateFilter}
                                    className="text-sm text-red-500 flex items-center"
                                >
                                    Сбросить <FaTimesCircle className="ml-1" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            <div className="flex space-x-2 mt-4 mb-1 items-center">
                {dateRange.start && (
                    <div className="flex items-center bg-gray-300 text-black text-xs px-2 py-1 rounded-full">
                        {formatDateRange()} <FaTimesCircle className="ml-1 text-xs cursor-pointer" onClick={handleResetDateFilter} />
                    </div>
                )}


                {dateRange.start && (
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
