import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown, FaChevronUp, FaTimesCircle } from 'react-icons/fa';
import { ru } from 'date-fns/locale';

interface IncidentFiltersProps {
    onFilterChange: (filters: {
        dateRange?: { start: Date | null; end: Date | null };
        type?: string;
        status?: string;
        criticality?: string;
    }) => void;
}

const criticalityData = ["Предупреждение", "Средняя", "Высокая"];
const statusData = ["Активный", "Устранен"];
const typeData = ["Д.1", "Д.2", "Д.3", "Т.1", "Т.2", "П.1", "П.2"];

const IncidentFilters: React.FC<IncidentFiltersProps> = ({ onFilterChange }) => {
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isCriticalityOpen, setIsCriticalityOpen] = useState(false);

    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [selectedType, setSelectedType] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedCriticality, setSelectedCriticality] = useState('');

    const [displayType, setDisplayType] = useState('Тип объекта');
    const [displayStatus, setDisplayStatus] = useState('Статус');
    const [displayCriticality, setDisplayCriticality] = useState('Критичность');

    const dateRef = useRef<HTMLDivElement>(null);
    const typeRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);
    const criticalityRef = useRef<HTMLDivElement>(null);

    const closeAllFilters = () => {
        setIsDateOpen(false);
        setIsTypeOpen(false);
        setIsStatusOpen(false);
        setIsCriticalityOpen(false);
    };

    const toggleFilter = (filter: string) => {
        switch (filter) {
            case 'date':
                setIsDateOpen(!isDateOpen);
                setIsTypeOpen(false);
                setIsStatusOpen(false);
                setIsCriticalityOpen(false);
                break;
            case 'type':
                setIsTypeOpen(!isTypeOpen);
                setIsDateOpen(false);
                setIsStatusOpen(false);
                setIsCriticalityOpen(false);
                break;
            case 'status':
                setIsStatusOpen(!isStatusOpen);
                setIsDateOpen(false);
                setIsTypeOpen(false);
                setIsCriticalityOpen(false);
                break;
            case 'criticality':
                setIsCriticalityOpen(!isCriticalityOpen);
                setIsDateOpen(false);
                setIsTypeOpen(false);
                setIsStatusOpen(false);
                break;
            default:
                break;
        }
    };

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setDateRange({ start, end });
        onFilterChange({ dateRange: { start, end }, type: selectedType, status: selectedStatus, criticality: selectedCriticality });
    };

    const handleTypeChange = (item: string) => {
        setSelectedType(item);
        setDisplayType(item);
        onFilterChange({ dateRange, type: item, status: selectedStatus, criticality: selectedCriticality });
    };

    const handleStatusChange = (item: string) => {
        setSelectedStatus(item);
        setDisplayStatus(item);
        onFilterChange({ dateRange, type: selectedType, status: item, criticality: selectedCriticality });
    };

    const handleCriticalityChange = (item: string) => {
        setSelectedCriticality(item);
        setDisplayCriticality(item);
        onFilterChange({ dateRange, type: selectedType, status: selectedStatus, criticality: item });
    };

    const handleResetDateFilter = () => {
        setDateRange({ start: null, end: null });
        onFilterChange({ dateRange: { start: null, end: null }, type: selectedType, status: selectedStatus, criticality: selectedCriticality });
    };

    const handleResetTypeFilter = () => {
        setSelectedType('');
        setDisplayType('Тип объекта');
        onFilterChange({ dateRange, type: '', status: selectedStatus, criticality: selectedCriticality });
    };

    const handleResetStatusFilter = () => {
        setSelectedStatus('');
        setDisplayStatus('Статус');
        onFilterChange({ dateRange, type: selectedType, status: '', criticality: selectedCriticality });
    };

    const handleResetCriticalityFilter = () => {
        setSelectedCriticality('');
        setDisplayCriticality('Критичность');
        onFilterChange({ dateRange, type: selectedType, status: selectedStatus, criticality: '' });
    };

    const handleResetAllFilters = () => {
        setDateRange({ start: null, end: null });
        setSelectedType('');
        setDisplayType('Тип объекта');
        setSelectedStatus('');
        setDisplayStatus('Статус');
        setSelectedCriticality('');
        setDisplayCriticality('Критичность');
        onFilterChange({ dateRange: { start: null, end: null }, type: '', status: '', criticality: '' });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dateRef.current && !dateRef.current.contains(event.target as Node) &&
                typeRef.current && !typeRef.current.contains(event.target as Node) &&
                statusRef.current && !statusRef.current.contains(event.target as Node) &&
                criticalityRef.current && !criticalityRef.current.contains(event.target as Node)
            ) {
                closeAllFilters();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatDateRange = () => {
        if (dateRange.start && !dateRange.end) {
            return dateRange.start.toLocaleDateString();
        } else if (dateRange.start && dateRange.end) {
            return `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`;
        }
        return 'Выберите даты';
    };

    return (
        <div>
            <div className="flex flex-wrap space-x-4 mt-3">
                {/* Фильтр по дате */}
                <div className="relative" ref={dateRef}>
                    <button
                        onClick={() => toggleFilter('date')}
                        className="flex items-center text-black px-4 py-1 rounded-full border border-black"
                    >
                        {"Период дат"} {isDateOpen ? <FaChevronUp className="ml-1"/> :
                        <FaChevronDown className="ml-1"/>}
                    </button>
                    {isDateOpen && (
                        <div className="absolute z-20 bg-white p-4 mt-2 shadow-md rounded">
                            <DatePicker
                                selected={dateRange.start}
                                onChange={handleDateChange}
                                startDate={dateRange.start}
                                endDate={dateRange.end}
                                selectsRange
                                placeholderText="Выберите диапазон дат"
                                className="border p-2 rounded"
                                locale={ru}
                                inline
                            />

                        </div>
                    )}
                </div>

                {/* Фильтр по типу объекта */}
                <div className="relative" ref={typeRef}>
                    <button
                        onClick={() => toggleFilter('type')}
                        className="flex items-center text-black px-4 py-1 rounded-full border border-black"
                    >
                        {"Тип"} {isTypeOpen ? <FaChevronUp className="ml-1"/> : <FaChevronDown className="ml-1"/>}
                    </button>
                    {isTypeOpen && (
                        <div className="absolute z-20 bg-white p-4 mt-2 shadow-md rounded">
                            {typeData.map((item, index) => (
                                <React.Fragment key={item}>
                                    <button
                                        onClick={() => {
                                            handleTypeChange(item);
                                            setIsTypeOpen(false);
                                        }}
                                        className={`block w-full text-left text-black text-sm px-4 py-2 rounded hover:bg-gray-200 ${selectedType === item ? 'bg-gray-300' : ''}`}
                                    >
                                        {item}
                                    </button>


                                    {index < typeData.length - 1 && (
                                        <div className="my-2 border-t border-gray-300"></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>

                {/* Фильтр по статусу */}
                <div className="relative" ref={statusRef}>
                    <button
                        onClick={() => toggleFilter('status')}
                        className="flex items-center text-black px-4 py-1 rounded-full border border-black"
                    >
                        {"Статус"} {isStatusOpen ? <FaChevronUp className="ml-1"/> : <FaChevronDown className="ml-1"/>}
                    </button>
                    {isStatusOpen && (
                        <div className="absolute z-20 bg-white p-4 mt-2 shadow-md rounded">
                            {statusData.map((item, index) => (
                                <React.Fragment key={item}>
                                    <button
                                        onClick={() => {
                                            handleStatusChange(item);
                                            setIsStatusOpen(false);
                                        }}
                                        className={`block w-full text-left text-black text-sm px-4 py-2 rounded hover:bg-gray-200 ${selectedStatus === item ? 'bg-gray-300' : ''}`}
                                    >
                                        {item}
                                    </button>

                                    {index < statusData.length - 1 && (
                                        <div className="my-2 border-t border-gray-300"></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>

                {/* Фильтр по критичности */}
                <div className="relative" ref={criticalityRef}>
                    <button
                        onClick={() => toggleFilter('criticality')}
                        className="flex items-center text-black px-4 py-1 rounded-full border border-black"
                    >
                        {"Критичность"} {isCriticalityOpen ? <FaChevronUp className="ml-1"/> : <FaChevronDown className="ml-1"/>}
                    </button>
                    {isCriticalityOpen && (
                        <div className="absolute z-20 bg-white text-sm p-4 mt-2 shadow-md rounded">
                            {criticalityData.map((item, index) => (
                                <React.Fragment key={item}>
                                    <button

                                        onClick={() => {
                                            handleCriticalityChange(item);
                                            setIsCriticalityOpen(false);
                                        }}
                                        className={`block w-full text-left text-black px-4 py-2 rounded hover:bg-gray-200 ${selectedCriticality === item ? 'bg-gray-300' : ''}`}
                                    >
                                        {item}
                                    </button>

                                    {index < criticalityData.length - 1 && (
                                        <div className="my-2 border-t border-gray-300"></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>

            </div>


            <div className="flex space-x-2 mt-4 mb-1 items-center">
                {selectedType && (
                    <div className="flex items-center bg-gray-300 text-black text-xs px-1 py-1 rounded-full">
                        {displayType} <FaTimesCircle className="ml-1 text-xs cursor-pointer" onClick={handleResetTypeFilter}/>
                    </div>
                )}
                {selectedStatus && (
                    <div className="flex items-center bg-gray-300 text-black text-xs px-1 py-1 rounded-full">
                        {displayStatus} <FaTimesCircle className="ml-1 text-xs cursor-pointer"
                                                 onClick={handleResetStatusFilter}/>
                    </div>
                )}
                {selectedCriticality && (
                    <div className="flex items-center bg-gray-300 text-black text-xs px-1 py-1 rounded-full">
                        {displayCriticality} <FaTimesCircle className="ml-1 text-xs cursor-pointer"
                                                      onClick={handleResetCriticalityFilter}/>
                    </div>
                )}
                {dateRange.start && (
                    <div className="flex items-center bg-gray-300 text-black text-xs px-1 py-1 rounded-full">
                        {formatDateRange()} <FaTimesCircle className="ml-1 text-xs cursor-pointer"
                                                     onClick={handleResetDateFilter}/>
                    </div>
                )}

                {(selectedType || selectedStatus || selectedCriticality || dateRange.start) && (
                    <button
                        onClick={handleResetAllFilters}
                        className="px-2 py-1 bg-gray-300  text-black text-xs rounded-full"
                    >
                        Сбросить все
                    </button>
                )}
            </div>



        </div>
    );
};

export default IncidentFilters;
