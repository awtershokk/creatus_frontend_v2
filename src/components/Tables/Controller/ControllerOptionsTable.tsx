import React, {useState, useEffect, useCallback, useRef} from 'react';
import { FaStar, FaFolder, FaTimes} from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { MODBUS_API_URL } from "../../../api/modbusApi";
import HistoryTable from "../HistoryTable";
import TabBarForController from "../../Buttons/TabsBarForController.tsx";
import SearchForController from "../../Search/SearchForController.tsx";
import ToggleSwitchForController from "../../Buttons/ToggleSwitch.tsx";
import RenderDataForController from "./Render/RenderDataForController.tsx";
import LoadingSpinner from "../../Menu/LoadingSpinner.tsx";
import EditControllerParametrModal from "../../Modal/Edit/EditControllerParametrModal.tsx";

interface ParameterItem {
    id: number;
    param: string;
    value: string | number;
    type: string;
    hint: string;
    unified: boolean;
    editable: boolean;
    favorites: boolean;
    children: ParameterItem[];
}

interface HistoryDataItem {
    timestamp: string;
    value: string | number;
}

const ControllerOptionTable: React.FC = () => {
    const [data, setData] = useState<ParameterItem[]>([]);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [currentParameter, setCurrentParameter] = useState<string>('');
    const [currentParameterValue, setCurrentParameterValue] = useState<string | number>('');
    const [currentParameterType, setCurrentParameterType] = useState<string>('');
    const [currentRowIndex, setCurrentRowIndex] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [groupParameters, setGroupParameters] = useState<boolean>(false);
    const [checkboxState, setCheckboxState] = useState<{ [key: string]: boolean }>({});
    const [selectedCount, setSelectedCount] = useState<number>(0);
    const [selectedParameterIds, setSelectedParameterIds] = useState<number[]>([]);
    const [historyData, setHistoryData] = useState<HistoryDataItem[]>([]);
    const [currentParameterId, setCurrentParameterId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const handleCheckboxChange = (index: string, id: number) => {
        setCheckboxState(prevState => {
            const newState = { ...prevState, [index]: !prevState[index] };
            const newSelectedCount = Object.values(newState).filter(val => val).length;

            if (newSelectedCount > 10) {
                return prevState;
            }

            let newSelectedParameterIds: number[];
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

    const getApiUrl = (): string => {
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
                const result = await response.json();
                if (response.ok) {
                    const transformedData = transformApiData(result.data);
                    setData(transformedData);
                    setIsLoading(false);
                } else {
                    console.error('ошибка:', result.message);
                }
            } catch (error) {
                console.error('ошибка:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    const transformApiData = (apiData: any[]): ParameterItem[] => {
        const transformDataRecursive = (data: any[]): ParameterItem[] => {
            return data.map(item => ({
                id: item.modbusParameterId,
                param: item.label,
                value: item.value,
                type: item.type,
                hint: item.hint,
                unified: !!item.modbusParameterId,
                editable: item.write || false,
                favorites: item.favorites || false,
                children: item.data ? transformDataRecursive(item.data) : []
            }));
        };

        return transformDataRecursive(apiData);
    };

    const handleToggleExpand = useCallback((key: string) => {
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const sendFavoriteRequest = async (parameter: ParameterItem, isAdding: boolean) => {
        const parameterId = parameter.id;
        const status = isAdding ? '1' : '0';
        const url = `${MODBUS_API_URL}/ecl/parameter/favorites/1/${parameterId}/${status}`;
        try {
            const response = await fetch(url, { method: 'PUT' });
            if (!response.ok) {
                throw new Error('Ошибка при обновлении избранного');
            }
        } catch (error) {
            console.error('ошибка:', error);
        }
    };

    const handleToggleFavorite = useCallback((parameter: ParameterItem, context: string) => {
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
            const updateFavorites = (items: ParameterItem[]): ParameterItem[] => {
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

    const handleOpenModal = useCallback((parameter: string, parameterValue: string | number, parameterType: string, index: string, id: number) => {
        setCurrentParameter(parameter);
        setCurrentParameterValue(parameterValue);
        setCurrentParameterType(parameterType);
        setCurrentRowIndex(index);
        setCurrentParameterId(id);
        setShowModal(true);
    }, []);

    const handleSaveModal = useCallback(async (newValue: string | number) => {
        const updateItem = (items: ParameterItem[], idx: number[]) => {
            if (idx.length === 1) {
                items[idx[0]].value = newValue;
            } else {
                updateItem(items[idx[0]].children, idx.slice(1));
            }
        };

        const newData = [...data];
        if (currentRowIndex) {
            updateItem(newData, currentRowIndex.split('-').map(Number));
        }
        setData(newData);
        setShowModal(false);

        const url = `${MODBUS_API_URL}/ecl/parameter/write/1/${currentParameterId}`;
        const body = {
            value: newValue
        };

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

    const searchInChildren = (item: ParameterItem, term: string): boolean => {
        const matches = item.param.toLowerCase().includes(term.toLowerCase());
        if (matches) return true;
        return item.children && item.children.some(child => searchInChildren(child, term));
    };

    const filterData = (data: ParameterItem[], term: string): ParameterItem[] => {
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
            <Tooltip id="button-tooltip" className="bg-black z-50 text-white px-3 py-2 rounded-lg shadow-lg" {...props} >
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
                            <div
                                className={`flex items-center pl-2 ml-${ level * 4}`}
                            >
                                {!item.children.length && (
                                    <div className="flex items-center mr-1">
                                        <FaStar
                                            onClick={() => handleToggleFavorite(item, context)}
                                            className="cursor-pointer ml-4"
                                            color={favorites.includes(`${context}-${item.param}`) || item.favorites ? 'gold' : 'white'}
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
                            item.editable ? 'bg-white' : 'bg-gray-300'
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

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleGroupParametersChange = () => {
        setGroupParameters(!groupParameters);
    };

    const fetchHistoryData = async (selectedIds) => {
        try {
            const requestBody = { modbusParameters: selectedIds };

            const response = await fetch(`${MODBUS_API_URL}/ecl/parameter/statistics/1`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            setHistoryData(result.data);
        } catch (error) {
            console.error('Ошибка при отправке запроса статистики:', error);
        }
    };

    const sendStatisticsRequest = async (selectedIds) => {
        await fetchHistoryData(selectedIds);
    };

    const historyTableRef = useRef(null);
    useEffect(() => {
        if (historyData.length > 0) {
            historyTableRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [historyData]);

    return (
        <div className="flex-grow">
            <div className="h-full w-full md:w-[53%]">
                <div className="table-wrapper">

                    <SearchForController searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                    <TabBarForController activeTab={activeTab} onTabChange={handleTabChange} />

                    <ToggleSwitchForController groupParameters={groupParameters} onChange={handleGroupParametersChange} />
                    {isLoading ? (
                        <div className="flex justify-center items-center h-[350px] w-[600px]">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div className="max-h-[350px] h-auto overflow-y-auto w-[600px] noscroll">
                            <div className="params-table-container">
                                <table className="table table-bordered w-full">
                                    <thead>
                                    <tr>
                                        <th className="bg-gray-500 text-white px-3 py-1">Параметр</th>
                                        <th className="bg-gray-600 text-white px-1 py-1">Значение</th>
                                    </tr>
                                    </thead>
                                    <tbody className="text-center">
                                    <RenderDataForController
                                        activeTab={activeTab}
                                        filteredData={filteredData}
                                        favorites={favorites}
                                        renderRow={renderRow}
                                    />
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="selection-info flex items-center mt-1 mb-3 text-black">
                        <span>Выбрано: {selectedCount} / 10</span>
                        <FaTimes
                            className="cursor-pointer ml-2 text-gray-500"
                            onClick={handleClearSelection}
                        />
                    </div>
                </div>


            </div>
            {historyData.length >= 1 && (
                <div className="w-[800px] mb-4 " ref={historyTableRef}>
                        <HistoryTable data={historyData}/>
                </div>
            )}
            {showModal && currentParameter !== '' && (
                    <EditControllerParametrModal
                    onHide={() => setShowModal(false)}
                    parameter={currentParameter}
                    parameterValue={currentParameterValue}
                    parameterType={currentParameterType}
                    onSave={handleSaveModal}
                    />
                )
            }

        </div>
    );
};

export default ControllerOptionTable;
