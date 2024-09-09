// import React, { useState, useEffect, useCallback } from 'react';
// import {FaStar, FaFolder, FaTimes, FaSearch, FaSpinner} from 'react-icons/fa';
// import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
// import { Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
// import './ControllerOptionsTable.css';
// // import HistoryTable from "./HistoryTable";
//
// const EclTable = () => {
//     const [data, setData] = useState([]);
//     const [expanded, setExpanded] = useState({});
//     const [favorites, setFavorites] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [currentParameter, setCurrentParameter] = useState('');
//     const [currentParameterValue, setCurrentParameterValue] = useState('');
//     const [currentParameterType, setCurrentParameterType] = useState('');
//     const [currentRowIndex, setCurrentRowIndex] = useState(null);
//     const [activeTab, setActiveTab] = useState('all');
//     const [groupParameters, setGroupParameters] = useState(false);
//
//     const [checkboxState, setCheckboxState] = useState({});
//     const [selectedCount, setSelectedCount] = useState(0);
//
//     const [selectedParameterIds, setSelectedParameterIds] = useState([]);
//
//     const [historyData, setHistoryData] = useState([]);
//
//     const [currentParameterId, setCurrentParameterId] = useState(null);
//
//     const handleCheckboxChange = (index, id) => {
//         setCheckboxState(prevState => {
//             const newState = { ...prevState, [index]: !prevState[index] };
//             const newSelectedCount = Object.values(newState).filter(val => val).length;
//
//             if (newSelectedCount > 10) {
//                 return prevState;
//             }
//
//             let newSelectedParameterIds;
//             if (newState[index]) {
//                 newSelectedParameterIds = [...selectedParameterIds, id];
//             } else {
//                 newSelectedParameterIds = selectedParameterIds.filter(pid => pid !== id);
//             }
//
//             setSelectedParameterIds(newSelectedParameterIds);
//             setSelectedCount(newSelectedCount);
//
//             sendStatisticsRequest(newSelectedParameterIds);
//
//             return newState;
//         });
//     };
//
//
//     const handleClearSelection = () => {
//         setCheckboxState({});
//         setSelectedCount(0);
//         setSelectedParameterIds([]);
//         setHistoryData([]);
//     };
//
//     useEffect(() => {
//         if (selectedParameterIds.length > 0) {
//             fetchHistoryData(selectedParameterIds);
//         } else {
//             setHistoryData([]);
//         }
//     }, [selectedParameterIds]);
//
//     const getApiUrl = () => {
//         const groupingFlag = groupParameters ? '1' : '0';
//         switch (activeTab) {
//             case 'settings':
//                 return `http://localhost:7001/api/ecl/parameter/all/1/2/${groupingFlag}`;
//             case 'favorites':
//                 return `http://localhost:7001/api/ecl/parameter/all/1/1/${groupingFlag}`;
//             case 'inputs':
//                 return `http://localhost:7001/api/ecl/parameter/all/1/3/${groupingFlag}`;
//             case 'outputs':
//                 return `http://localhost:7001/api/ecl/parameter/all/1/4/${groupingFlag}`;
//             case 'control':
//                 return `http://localhost:7001/api/ecl/parameter/all/1/5/${groupingFlag}`;
//             case 'accidents':
//                 return `http://localhost:7001/api/ecl/parameter/all/1/6/${groupingFlag}`;
//             case 'values':
//                 return `http://localhost:7001/api/ecl/parameter/all/1/7/${groupingFlag}`;
//             case 'input_node':
//                 return `http://localhost:7001/api/ecl/parameter/all/1/8/${groupingFlag}`;
//             default:
//                 return `http://localhost:7001/api/ecl/parameter/all/1/0/${groupingFlag}`;
//         }
//     };
//
//     const apiUrl = getApiUrl();
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch(apiUrl);
//                 const result = await response.json();
//                 if (response.ok) {
//                     const transformedData = transformApiData(result.data);
//                     setData(transformedData);
//                 } else {
//                     console.error('ошибка:', result.message);
//                 }
//             } catch (error) {
//                 console.error('ошибка:', error);
//             }
//         };
//
//         fetchData();
//     }, [apiUrl]);
//
//     const transformApiData = (apiData) => {
//         const transformDataRecursive = (data) => {
//             return data.map(item => {
//                 const transformedItem = {
//                     id: item.modbusParameterId,
//                     param: item.label,
//                     value: item.value,
//                     type: item.type,
//                     hint: item.hint,
//                     unified: !!item.modbusParameterId,
//                     editable: item.write || false,
//                     favorites: item.favorites || false,
//                     children: item.data ? transformDataRecursive(item.data) : []
//                 };
//                 return transformedItem;
//             });
//         };
//
//         return transformDataRecursive(apiData);
//     };
//
//     const handleToggleExpand = useCallback((key) => {
//         setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
//     }, []);
//
//     const sendFavoriteRequest = async (parameter, isAdding) => {
//         const parameterId = parameter.id;
//         const status = isAdding ? '1' : '0';
//         const url = `http://localhost:7001/api/ecl/parameter/favorites/1/${parameterId}/${status}`;
//         try {
//             const response = await fetch(url, { method: 'PUT' });
//             if (!response.ok) {
//                 throw new Error('Ошибка при обновлении избранного');
//             }
//         } catch (error) {
//             console.error('ошибка:', error);
//         }
//     };
//
//     const handleToggleFavorite = useCallback((parameter, context) => {
//         setFavorites((prev) => {
//             const identifier = `${context}-${parameter.param}`;
//             const isFavorite = prev.some(fav => fav === identifier);
//             sendFavoriteRequest(parameter, !isFavorite);
//             if (isFavorite) {
//                 return prev.filter((fav) => fav !== identifier);
//             } else {
//                 return [...prev, identifier];
//             }
//         });
//
//         setData((prevData) => {
//             const updateFavorites = (items) => {
//                 return items.map(item => {
//                     if (item.id === parameter.id) {
//                         return { ...item, favorites: !item.favorites };
//                     }
//                     if (item.children.length > 0) {
//                         return { ...item, children: updateFavorites(item.children) };
//                     }
//                     return item;
//                 });
//             };
//             return updateFavorites(prevData);
//         });
//     }, []);
//
//     const handleOpenModal = useCallback((parameter, parameterValue, parameterType, index, id) => {
//         setCurrentParameter(parameter);
//         setCurrentParameterValue(parameterValue);
//         setCurrentParameterType(parameterType);
//         setCurrentRowIndex(index);
//         setCurrentParameterId(id);
//         setShowModal(true);
//     }, []);
//
//     const handleSaveModal = useCallback(async (newValue) => {
//         const updateItem = (items, idx) => {
//             if (idx.length === 1) {
//                 items[idx[0]].value = newValue;
//             } else {
//                 updateItem(items[idx[0]].children, idx.slice(1));
//             }
//         };
//
//         const newData = [...data];
//         updateItem(newData, currentRowIndex.split('-').map(Number));
//         setData(newData);
//         setShowModal(false);
//
//         const url = `http://localhost:7001/api/ecl/parameter/write/1/${currentParameterId}`;
//         const body = {
//             value: newValue
//         };
//         console.log(`URL: ${url}`)
//         console.log(`body: ${body.value}`)
//
//         try {
//             const response = await fetch(url, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(body)
//             });
//
//             if (!response.ok) {
//                 throw new Error('Ошибка при сохранении параметра');
//             }
//         } catch (error) {
//             console.error('Ошибка:', error);
//         }
//     }, [data, currentRowIndex, currentParameterId]);
//
//
//     const searchInChildren = (item, term) => {
//         const matches = item.param.toLowerCase().includes(term.toLowerCase());
//         if (matches) return true;
//         return item.children && item.children.some(child => searchInChildren(child, term));
//     };
//
//     const filterData = (data, term) => {
//         return data.filter(item => searchInChildren(item, term));
//     };
//
//     const filteredData = filterData(data, searchTerm);
//
//     const renderRow = (item, index, level = 0, context = '') => {
//         const rowIndex = `${index}`;
//         const newContext = `${context}-${item.param}`;
//
//         if (!searchInChildren(item, searchTerm)) {
//             return null;
//         }
//
//         const renderTooltip = (props) => (
//             <Tooltip id="button-tooltip" {...props} >
//                 {item.hint}
//             </Tooltip>
//         );
//
//         return (
//             <React.Fragment key={rowIndex}>
//                 <tr className={`table-row ${showModal && currentRowIndex === rowIndex ? 'table-row-highlight' : ''}`}>
//                     <td
//                         style={{
//                             paddingLeft: `${level * 20}px`,
//                             backgroundColor: '#d0d3d7'
//                         }}
//                     >
//                         <OverlayTrigger
//                             placement="top"
//                             overlay={item.hint && !item.children.length ? renderTooltip : <span></span>}
//                             delay={{ show: 250, hide: 400 }}
//                         >
//                             <div style={{ display: 'flex', alignItems: 'center' }}>
//                                 {!item.children.length && (
//                                     <div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
//                                         <FaStar
//                                             onClick={() => handleToggleFavorite(item, context)}
//                                             style={{ cursor: 'pointer', marginLeft: '15px' }}
//                                             color={favorites.includes(`${context}-${item.param}`) || item.favorites ? 'gold' : 'grey'}
//                                         />
//                                         <input
//                                             type="checkbox"
//                                             style={{ marginLeft: '5px', cursor: 'pointer', zIndex: 1 }}
//                                             checked={checkboxState[rowIndex] || false}
//                                             onChange={() => handleCheckboxChange(rowIndex, item.id)}
//                                             disabled={!checkboxState[rowIndex] && selectedCount >= 10}
//                                         />
//                                     </div>
//                                 )}
//                                 {item.children.length > 0 && (
//                                     <span style={{ marginRight: '8px' }}>
//                                     <FaFolder />
//                                 </span>
//                                 )}
//                                 <span className="single-line">{item.param}</span>
//                                 {item.children.length > 0 && (
//                                     <span onClick={() => handleToggleExpand(rowIndex)} style={{ marginLeft: '8px' }}>
//                                     {expanded[rowIndex] ? <FiChevronUp /> : <FiChevronDown />}
//                                 </span>
//                                 )}
//                             </div>
//                         </OverlayTrigger>
//                     </td>
//                     <td
//                         style={{ backgroundColor: item.editable ? '#e5e6e9' : '#d0d3d7' }}
//                         onClick={() => item.editable && handleOpenModal(item.param, item.value, item.type, rowIndex, item.id)}
//                     >
//                         {item.value}
//                     </td>
//                 </tr>
//                 {item.children.length > 0 && expanded[rowIndex] && item.children.map((child, idx) => renderRow(child, `${rowIndex}-${idx}`, level + 1, newContext))}
//             </React.Fragment>
//         );
//     };
//
//     const renderTableData = () => {
//         let dataToRender = filteredData;
//
//         if (activeTab === 'favorites') {
//             const filterFavorites = (items) => {
//                 return items.reduce((acc, item) => {
//                     if (item.favorites || favorites.includes(`-${item.param}`)) {
//                         acc.push(item);
//                     } else if (item.children.length > 0) {
//                         const filteredChildren = filterFavorites(item.children);
//                         if (filteredChildren.length > 0) {
//                             acc.push({ ...item, children: filteredChildren });
//                         }
//                     }
//                     return acc;
//                 }, []);
//             };
//             dataToRender = filterFavorites(filteredData);
//         } else if (activeTab === 'settings') {
//             const filterSettings = (items) => {
//                 return items.reduce((acc, item) => {
//                     if (item.editable) {
//                         acc.push(item);
//                     } else if (item.children.length > 0) {
//                         const filteredChildren = filterSettings(item.children);
//                         if (filteredChildren.length > 0) {
//                             acc.push({ ...item, children: filteredChildren });
//                         }
//                     }
//                     return acc;
//                 }, []);
//             };
//             dataToRender = filterSettings(filteredData);
//         }
//
//         if (dataToRender.length === 0 && activeTab != 'favorites') {
//             return (
//                 <tr>
//                     <FaSpinner className="spinner" />
//                 </tr>
//             );
//         } else if (dataToRender.length === 0 && activeTab === 'favorites') {
//             return (
//                 <tr>
//                     <td colSpan="2" className="text-center">В избранном ничего нет</td>
//                 </tr>
//             );
//         }
//
//         return dataToRender.map((item, index) => renderRow(item, index));
//     };
//
//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//     };
//
//     const handleGroupParametersChange = () => {
//         setGroupParameters(!groupParameters);
//     };
//
//     const fetchHistoryData = async (selectedIds) => {
//         try {
//             const requestBody = { modbusParameters: selectedIds };
//
//             const response = await fetch('http://localhost:7001/api/ecl/parameter/statistics/1', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(requestBody)
//             });
//
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//
//             const result = await response.json();
//             console.log('Статистика:', result);
//             setHistoryData(result.data);
//         } catch (error) {
//             console.error('Ошибка при отправке запроса статистики:', error);
//         }
//     };
//
//     const sendStatisticsRequest = async (selectedIds) => {
//         await fetchHistoryData(selectedIds);
//     };
//
//     return (
//         <div className="row">
//             <div className="col-md-6.5">
//                 <div className="table-wrapper">
//                     <div className="search-container mb-3">
//                         <FaSearch className="search-icon"/>
//                         <input
//                             type="text"
//                             placeholder="Поиск по параметрам"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="form-control search-input"
//                         />
//                         {searchTerm && (
//                             <button className="clear-search-button" onClick={() => setSearchTerm('')}>
//                                 <FaTimes/>
//                             </button>
//                         )}
//                     </div>
//
//                     <div className="tabs-container mb-3">
//                         <button
//                             className={`tab ${activeTab === 'all' ? 'active' : ''}`}
//                             onClick={() => handleTabChange('all')}
//                         >
//                             Все
//                         </button>
//
//                         <button
//                             className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
//                             onClick={() => handleTabChange('favorites')}
//                             style={{display: '', alignItems: 'center', justifyContent: 'center'}}
//                         >
//                             <FaStar style={{marginRight: '2px'}}/>
//                             Избранное
//                         </button>
//
//                         <button
//                             className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
//                             onClick={() => handleTabChange('settings')}
//                         >
//                             Уставки
//                         </button>
//
//                         <button
//                             className={`tab ${activeTab === 'inputs' ? 'active' : ''}`}
//                             onClick={() => handleTabChange('inputs')}
//                         >
//                             Входы
//                         </button>
//
//                         <button
//                             className={`tab ${activeTab === 'outputs' ? 'active' : ''}`}
//                             onClick={() => handleTabChange('outputs')}
//                         >
//                             Выходы
//                         </button>
//
//                         <button
//                             className={`tab ${activeTab === 'control' ? 'active' : ''}`}
//                             onClick={() => handleTabChange('control')}
//                         >
//                             Настройки
//                         </button>
//
//                         <button
//                             className={`tab ${activeTab === 'accidents' ? 'active' : ''}`}
//                             onClick={() => handleTabChange('accidents')}
//                         >
//                             Аварии
//                         </button>
//
//                         <div className="tabs-container mb-3" style={{marginTop: '7px', marginBottom: '0px'}}>
//                             <button
//                                 className={`tab ${activeTab === 'values' ? 'active' : ''}`}
//                                 onClick={() => handleTabChange('values')}
//                             >
//                                 Текущие значения
//                             </button>
//
//                             <button
//                                 className={`tab ${activeTab === 'input_node' ? 'active' : ''}`}
//                                 onClick={() => handleTabChange('input_node')}
//                             >
//                                 Узел ввода
//                             </button>
//
//                         </div>
//                     </div>
//                     <div className="group-parameters">
//                         <Form.Check
//                             type="switch"
//                             id="group-parameters-switch"
//                             label="Группировать параметры"
//                             checked={groupParameters}
//                             onChange={handleGroupParametersChange}
//                         />
//                     </div>
//                     <div className="ecltable-container">
//                         <div className="params-table-container">
//                             <table className="table table-bordered">
//                                 <thead>
//                                 <tr>
//                                     <th>Параметр</th>
//                                     <th>Значение</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                 {renderTableData()}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                     <div className="selection-info mb-3"
//                          style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
//                         <span>Выбрано: {selectedCount} / 10</span>
//                         <FaTimes
//                             style={{cursor: 'pointer', marginLeft: '5px', color: 'grey'}}
//                             onClick={handleClearSelection}
//                         />
//                         {/*{selectedParameterIds.length >= 1 && (*/}
//                         {/*    <a href="#" style={{textDecoration: 'underline', color: '#114fc5', marginLeft: '232px'}}*/}
//                         {/*       onClick={() => sendStatisticsRequest(selectedParameterIds)}>*/}
//                         {/*        Посмотреть историю*/}
//                         {/*    </a>*/}
//
//                         {/*)}*/}
//                     </div>
//
//                 </div>
//                 {historyData.length >= 1 && (
//                     <div className="col-md-5.5">
//                         <div className="history-table" style={{marginLeft: '545px', marginTop: '-665px'}}>
//                             <HistoryTable data={historyData}/>
//                         </div>
//                     </div>)}
//
//             </div>
//         </div>
//     );
// };
//
// export default EclTable;
