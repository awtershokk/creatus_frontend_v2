import React, { useState, useEffect, useCallback } from 'react';
import {FaStar, FaFolder, FaTimes, FaSearch, FaSpinner} from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { MODBUS_API_URL } from "../../../api/modbusApi.js";


const ControllerOptionTable = () => {
    const [data, setData] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [favorites, setFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentParameter, setCurrentParameter] = useState('');
    const [currentParameterValue, setCurrentParameterValue] = useState('');
    const [currentParameterType, setCurrentParameterType] = useState('');
    const [currentRowIndex, setCurrentRowIndex] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [groupParameters, setGroupParameters] = useState(false);

    const [checkboxState, setCheckboxState] = useState({});
    const [selectedCount, setSelectedCount] = useState(0);

    const [selectedParameterIds, setSelectedParameterIds] = useState([]);

    const [historyData, setHistoryData] = useState([]);

    const [currentParameterId, setCurrentParameterId] = useState(null);

    const handleCheckboxChange = (index, id) => {
        setCheckboxState(prevState => {
            const newState = { ...prevState, [index]: !prevState[index] };
            const newSelectedCount = Object.values(newState).filter(val => val).length;

            if (newSelectedCount > 10) {
                return prevState;
            }

            let newSelectedParameterIds;
            if (newState[index]) {
                newSelectedParameterIds = [...selectedParameterIds, id];
            } else {
                newSelectedParameterIds = selectedParameterIds.filter(pid => pid !== id);
            }

            setSelectedParameterIds(newSelectedParameterIds);
            setSelectedCount(newSelectedCount);

            sendStatisticsRequest(newSelectedParameterIds);

            return newState;
        });
    };


    const handleClearSelection = () => {
        setCheckboxState({});
        setSelectedCount(0);
        setSelectedParameterIds([]);
        setHistoryData([]);
    };

    useEffect(() => {
        if (selectedParameterIds.length > 0) {
            fetchHistoryData(selectedParameterIds);
        } else {
            setHistoryData([]);
        }
    }, [selectedParameterIds]);

    const getApiUrl = () => {
        const groupingFlag = groupParameters ? '1' : '0';
        switch (activeTab) {
            case 'settings':
                return `/ecl/parameter/all/1/2/${groupingFlag}`;
            case 'favorites':
                return `/ecl/parameter/all/1/1/${groupingFlag}`;
            case 'inputs':
                return `/ecl/parameter/all/1/3/${groupingFlag}`;
            case 'outputs':
                return `/ecl/parameter/all/1/4/${groupingFlag}`;
            case 'control':
                return `/ecl/parameter/all/1/5/${groupingFlag}`;
            case 'accidents':
                return `/ecl/parameter/all/1/6/${groupingFlag}`;
            case 'values':
                return `/ecl/parameter/all/1/7/${groupingFlag}`;
            case 'input_node':
                return `/ecl/parameter/all/1/8/${groupingFlag}`;
            default:
                return `/ecl/parameter/all/1/0/${groupingFlag}`;
        }
    };

    const apiUrl = getApiUrl();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${MODBUS_API_URL}/${apiUrl}`);
                console.log(response)
                const result = await response.json();
                if (response.ok) {
                    const transformedData = transformApiData(result.data);
                    setData(transformedData);
                } else {
                    console.error('ошибка:', result.message);
                }
            } catch (error) {
                console.error('ошибка:', error);
            }
        };

        fetchData();
    }, [apiUrl]);

    const transformApiData = (apiData) => {
        const transformDataRecursive = (data) => {
            return data.map(item => {
                const transformedItem = {
                    id: item.modbusParameterId,
                    param: item.label,
                    value: item.value,
                    type: item.type,
                    hint: item.hint,
                    unified: !!item.modbusParameterId,
                    editable: item.write || false,
                    favorites: item.favorites || false,
                    children: item.data ? transformDataRecursive(item.data) : []
                };
                return transformedItem;
            });
        };

        return transformDataRecursive(apiData);
    };

    const handleToggleExpand = useCallback((key) => {
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const sendFavoriteRequest = async (parameter, isAdding) => {
        const parameterId = parameter.id;
        const status = isAdding ? '1' : '0';
        const url = `http://localhost:7001/api/ecl/parameter/favorites/1/${parameterId}/${status}`;
        try {
            const response = await fetch(url, { method: 'PUT' });
            if (!response.ok) {
                throw new Error('Ошибка при обновлении избранного');
            }
        } catch (error) {
            console.error('ошибка:', error);
        }
    };

    const handleToggleFavorite = useCallback((parameter, context) => {
        setFavorites((prev) => {
            const identifier = `${context}-${parameter.param}`;
            const isFavorite = prev.some(fav => fav === identifier);
            sendFavoriteRequest(parameter, !isFavorite);
            if (isFavorite) {
                return prev.filter((fav) => fav !== identifier);
            } else {
                return [...prev, identifier];
            }
        });

        setData((prevData) => {
            const updateFavorites = (items) => {
                return items.map(item => {
                    if (item.id === parameter.id) {
                        return { ...item, favorites: !item.favorites };
                    }
                    if (item.children.length > 0) {
                        return { ...item, children: updateFavorites(item.children) };
                    }
                    return item;
                });
            };
            return updateFavorites(prevData);
        });
    }, []);

    const handleOpenModal = useCallback((parameter, parameterValue, parameterType, index, id) => {
        setCurrentParameter(parameter);
        setCurrentParameterValue(parameterValue);
        setCurrentParameterType(parameterType);
        setCurrentRowIndex(index);
        setCurrentParameterId(id);
        setShowModal(true);
    }, []);

    const handleSaveModal = useCallback(async (newValue) => {
        const updateItem = (items, idx) => {
            if (idx.length === 1) {
                items[idx[0]].value = newValue;
            } else {
                updateItem(items[idx[0]].children, idx.slice(1));
            }
        };

        const newData = [...data];
        updateItem(newData, currentRowIndex.split('-').map(Number));
        setData(newData);
        setShowModal(false);

        const url = `http://localhost:7001/api/ecl/parameter/write/1/${currentParameterId}`;
        const body = {
            value: newValue
        };
        console.log(`URL: ${url}`)
        console.log(`body: ${body.value}`)

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error('Ошибка при сохранении параметра');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }, [data, currentRowIndex, currentParameterId]);


    const searchInChildren = (item, term) => {
        const matches = item.param.toLowerCase().includes(term.toLowerCase());
        if (matches) return true;
        return item.children && item.children.some(child => searchInChildren(child, term));
    };

    const filterData = (data, term) => {
        return data.filter(item => searchInChildren(item, term));
    };

    const filteredData = filterData(data, searchTerm);

    const renderRow = (item, index, level = 0, context = '') => {
        const rowIndex = `${index}`;
        const newContext = `${context}-${item.param}`;

        if (!searchInChildren(item, searchTerm)) {
            return null;
        }

        const renderTooltip = (props) => (
            <Tooltip id="button-tooltip" className="bg-black text-white px-3 py-2 rounded-lg shadow-lg" {...props} >
                {item.hint}
            </Tooltip>
        );



        return (
            <React.Fragment key={rowIndex}>
                <tr
                    className={`table-row ${showModal && currentRowIndex === rowIndex ? 'bg-gray-300' : 'bg-gray-600'}`}
                >
                    <td className="bg-gray-600 border-b border-black px-1 py-2">
                        <OverlayTrigger
                            placement="top"
                            overlay={item.hint && !item.children.length ? renderTooltip : <span></span>}
                            delay={{ show: 250, hide: 400 }}
                        >
                            {/* Инлайн-стиль для отступа слева на основе уровня вложенности */}
                            <div
                                className={`flex items-center pl-2 ml-${ level * 4}`} // Отступ слева для всех уровней, включая 0 уровень
                            >
                                {!item.children.length && (
                                    <div className="flex items-center mr-1">
                                        <FaStar
                                            onClick={() => handleToggleFavorite(item, context)}
                                            className="cursor-pointer ml-4"
                                            color={favorites.includes(`${context}-${item.param}`) || item.favorites ? 'gold' : 'grey'}
                                        />
                                        <input
                                            type="checkbox"
                                            className="ml-2 cursor-pointer z-10"
                                            checked={checkboxState[rowIndex] || false}
                                            onChange={() => handleCheckboxChange(rowIndex, item.id)}
                                            disabled={!checkboxState[rowIndex] && selectedCount >= 10}
                                        />
                                    </div>
                                )}
                                {item.children.length > 0 && (
                                    <span className="mr-2">
                                <FaFolder/>
                            </span>
                                )}
                                <span className="single-line">{item.param}</span>
                                {item.children.length > 0 && (
                                    <span
                                        onClick={() => handleToggleExpand(rowIndex)}
                                        className="ml-2 cursor-pointer"
                                    >
                                {expanded[rowIndex] ? <FiChevronUp/> : <FiChevronDown/>}
                            </span>
                                )}
                            </div>
                        </OverlayTrigger>
                    </td>
                    <td
                        className={`${
                            item.editable ? 'bg-gray-200' : 'bg-gray-300'
                        } cursor-pointer text-black border-b border-black`}
                        onClick={() =>
                            item.editable &&
                            handleOpenModal(item.param, item.value, item.type, rowIndex, item.id)
                        }
                    >
                        {item.value}
                    </td>
                </tr>
                {item.children.length > 0 &&
                    expanded[rowIndex] &&
                    item.children.map((child, idx) =>
                        renderRow(child, `${rowIndex}-${idx}`, level + 1, newContext)
                    )}
            </React.Fragment>
        );


    };

    const renderTableData = () => {
        let dataToRender = filteredData;

        if (activeTab === 'favorites') {
            const filterFavorites = (items) => {
                return items.reduce((acc, item) => {
                    if (item.favorites || favorites.includes(`-${item.param}`)) {
                        acc.push(item);
                    } else if (item.children.length > 0) {
                        const filteredChildren = filterFavorites(item.children);
                        if (filteredChildren.length > 0) {
                            acc.push({ ...item, children: filteredChildren });
                        }
                    }
                    return acc;
                }, []);
            };
            dataToRender = filterFavorites(filteredData);
        } else if (activeTab === 'settings') {
            const filterSettings = (items) => {
                return items.reduce((acc, item) => {
                    if (item.editable) {
                        acc.push(item);
                    } else if (item.children.length > 0) {
                        const filteredChildren = filterSettings(item.children);
                        if (filteredChildren.length > 0) {
                            acc.push({ ...item, children: filteredChildren });
                        }
                    }
                    return acc;
                }, []);
            };
            dataToRender = filterSettings(filteredData);
        }

        if (dataToRender.length === 0 && activeTab != 'favorites') {
            return (
                <tr>
                    <FaSpinner className="spinner" />
                </tr>
            );
        } else if (dataToRender.length === 0 && activeTab === 'favorites') {
            return (
                <tr>
                    <td colSpan="2" className="text-center">В избранном ничего нет</td>
                </tr>
            );
        }

        return dataToRender.map((item, index) => renderRow(item, index));
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleGroupParametersChange = () => {
        setGroupParameters(!groupParameters);
    };

    const fetchHistoryData = async (selectedIds) => {
        try {
            const requestBody = { modbusParameters: selectedIds };

            const response = await fetch('http://localhost:7001/api/ecl/parameter/statistics/1', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Статистика:', result);
            setHistoryData(result.data);
        } catch (error) {
            console.error('Ошибка при отправке запроса статистики:', error);
        }
    };

    const sendStatisticsRequest = async (selectedIds) => {
        await fetchHistoryData(selectedIds);
    };

    return (
        <div className="flex flex-wrap">
            <div className="w-full md:w-[53%]">
                <div className="table-wrapper">
                    <div className="search-container relative w-[530px] flex items-center mt-4 mb-3">
                        <FaSearch className="search-icon absolute left-2 text-gray-500"/>
                        <input
                            type="text"
                            placeholder="Поиск по параметрам"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input form-control text-black w-full bg-white border border-black rounded py-1 pl-8 pr-8"
                        />
                        {searchTerm && (
                            <button className="clear-search-button absolute right-2 text-gray-400"
                                    onClick={() => setSearchTerm('')}>
                                <FaTimes/>
                            </button>
                        )}
                    </div>

                    <div className="tabs-container flex space-x-2 mb-3">
                        <button
                            className={`tab px-3 py-1 rounded ${activeTab === 'all' ? 'bg-gray-600' : 'bg-gray-500'}`}
                            onClick={() => handleTabChange('all')}
                        >
                            Все
                        </button>

                        <button
                            className={`tab px-3 py-1 rounded flex items-center ${activeTab === 'favorites' ? 'bg-gray-600' : 'bg-gray-500'}`}
                            onClick={() => handleTabChange('favorites')}
                        >
                            <FaStar className="mr-1"/>
                            Избранное
                        </button>

                        <button
                            className={`tab px-3 py-1 rounded ${activeTab === 'settings' ? 'bg-gray-600' : 'bg-gray-500'}`}
                            onClick={() => handleTabChange('settings')}
                        >
                            Уставки
                        </button>

                        <button
                            className={`tab px-3 py-1 rounded ${activeTab === 'inputs' ? 'bg-gray-600' : 'bg-gray-500'}`}
                            onClick={() => handleTabChange('inputs')}
                        >
                            Входы
                        </button>

                        <button
                            className={`tab px-3 py-1 rounded ${activeTab === 'outputs' ? 'bg-gray-600' : 'bg-gray-500'}`}
                            onClick={() => handleTabChange('outputs')}
                        >
                            Выходы
                        </button>

                        <button
                            className={`tab px-3 py-1 rounded ${activeTab === 'control' ? 'bg-gray-600' : 'bg-gray-500'}`}
                            onClick={() => handleTabChange('control')}
                        >
                            Настройки
                        </button>

                        <button
                            className={`tab px-3 py-1 rounded ${activeTab === 'accidents' ? 'bg-gray-600' : 'bg-gray-500'}`}
                            onClick={() => handleTabChange('accidents')}
                        >
                            Аварии
                        </button>
                    </div>

                    <div className="tabs-container space-x-2 flex mb-3 mt-2">
                        <button
                            className={`tab px-3 py-1 rounded ${activeTab === 'values' ? 'bg-gray-600' : 'bg-gray-500'}`}
                            onClick={() => handleTabChange('values')}
                        >
                            Текущие значения
                        </button>

                        <button
                            className={`tab px-3 py-1 rounded ${activeTab === 'input_node' ? 'bg-gray-600' : 'bg-gray-500'}`}
                            onClick={() => handleTabChange('input_node')}
                        >
                            Узел ввода
                        </button>
                    </div>


                    <div className="group-parameters mt-6 ">
                        <label htmlFor="group-parameters-switch" className="flex items-center cursor-pointer mb-3">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="group-parameters-switch"
                                    checked={groupParameters}
                                    onChange={handleGroupParametersChange}
                                    className="sr-only"
                                />
                                <div
                                    className={`block w-10 h-6 rounded-full ${groupParameters ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                <div
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                        groupParameters ? 'transform translate-x-4' : ''
                                    }`}
                                ></div>
                            </div>
                            <span className="ml-3 text-black font-medium">Группировать параметры</span>
                        </label>
                    </div>

                    <div className="ecltable-container max-h-[445px] overflow-y-auto w-[600px] noscroll">
                        <div className="params-table-container">
                            <table className="table table-bordered w-full">
                                <thead>
                                <tr>
                                    <th className='bg-gray-500 text-white px-3 py-1'>Параметр</th>
                                    <th className='bg-gray-600 text-white px-1 py-1'>Значение</th>
                                </tr>
                                </thead>
                                <tbody className="text-center">
                                {renderTableData()}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="selection-info flex items-center mt-1 mb-3 text-black">
                        <span>Выбрано: {selectedCount} / 10</span>
                        <FaTimes
                            className="cursor-pointer ml-2 text-gray-500"
                            onClick={handleClearSelection}
                        />
                    </div>
                </div>

                {/*{historyData.length >= 1 && (*/}
                {/*    <div className="w-full md:w-[45%] ml-[545px] mt-[-665px]">*/}
                {/*        <div className="history-table">*/}
                {/*            <HistoryTable data={historyData}/>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        </div>
    );
};

export default ControllerOptionTable;
