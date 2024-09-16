import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaTools, FaChevronDown, FaBug, FaCogs, FaExclamationTriangle, FaMicrochip, FaBars, FaThermometerHalf } from 'react-icons/fa';
import { fetchSections } from '../../api/sectionApi.ts';
import { fetchThermalCircuits } from '../../api/thermalCircuitApi.ts';

const LeftMenu: React.FC = () => {
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [isDevicesOpen, setIsDevicesOpen] = useState(false);
    const [isSectionsOpen, setIsSectionsOpen] = useState(false);
    const [isThermalCircuitsOpen, setIsThermalCircuitsOpen] = useState(false);
    const [sections, setSections] = useState<any[]>([]);
    const [thermalCircuits, setThermalCircuits] = useState<any[]>([]);
    const buildingId = 1;

    useEffect(() => {
        const loadSections = async () => {
            try {
                const data = await fetchSections(buildingId);
                setSections(data);
            } catch (error) {
                console.error('Ошибка при загрузке секций:', error);
            }
        };

        const loadThermalCircuits = async () => {
            try {
                const data = await fetchThermalCircuits(buildingId);
                setThermalCircuits(data);
            } catch (error) {
                console.error('Ошибка при загрузке тепловых контуров:', error);
            }
        };

        loadSections();
        loadThermalCircuits();
    }, [buildingId]);

    const toggleDevices = () => {
        setIsDevicesOpen(!isDevicesOpen);
        setIsMenuExpanded(!isDevicesOpen || isSectionsOpen || isThermalCircuitsOpen);
    };

    const toggleSections = () => {
        setIsSectionsOpen(!isSectionsOpen);
        setIsMenuExpanded(!isSectionsOpen || isDevicesOpen || isThermalCircuitsOpen);
    };

    const toggleThermalCircuits = () => {
        setIsThermalCircuitsOpen(!isThermalCircuitsOpen);
        setIsMenuExpanded(!isThermalCircuitsOpen || isDevicesOpen || isSectionsOpen);
    };

    return (
        <div className={`flex flex-nowrap h-full transition-width duration-300 ${isMenuExpanded ? 'w-[310px]' : 'w-[240px]'} bg-gray-800 text-white z-10`}>
            <div className="flex flex-col flex-grow p-4">
                <div className="mb-6">
                    <h1 className="text-xl font-bold whitespace-nowrap">SmartHeat</h1>
                </div>
                <nav className="flex-1 overflow-y-auto">
                    <ul className="space-y-2">
                        <li>
                            <Link to="/building/updates"
                                  className={`flex items-center ${isSectionsOpen || isThermalCircuitsOpen || isDevicesOpen ? 'w-[280px]' : 'w-[210px]'} p-2 rounded-lg hover:bg-gray-700 whitespace-nowrap transition-width duration-300 overflow-hidden text-ellipsis`}>
                                <FaCogs className="mr-2"/>
                                Версия ПО
                            </Link>
                        </li>
                        <li>
                            <button
                                className={`flex items-center ${isSectionsOpen || isThermalCircuitsOpen || isDevicesOpen ? 'w-[280px]' : 'w-[210px]'} p-2 rounded-lg hover:bg-gray-700 text-left transition-width duration-300 overflow-hidden text-ellipsis`}
                                onClick={toggleSections}
                            >
                                <FaBars className="mr-2"/>
                                Секции
                                <FaChevronDown
                                    className={`ml-2 transition-transform duration-300 ${isSectionsOpen ? 'rotate-180' : ''} text-xs`}/>
                            </button>
                            <ul className={`transition-max-height duration-300 ease-in-out ${isSectionsOpen ? 'max-h-[200px]' : 'max-h-0'} overflow-hidden flex flex-col`}>
                                {sections.map((section) => (
                                    <li key={section.id}>
                                        <Link to={`/building/section/${section.id}`}
                                              className="flex items-center p-2 pl-8 rounded-lg hover:bg-gray-700 whitespace-normal overflow-hidden text-ellipsis">
                                            <FaBars className="mr-2"/>
                                            {section.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        <li>
                            <button
                                className={`flex items-center ${isSectionsOpen || isThermalCircuitsOpen || isDevicesOpen ? 'w-[280px]' : 'w-[210px]'} p-2 rounded-lg hover:bg-gray-700 text-left transition-width duration-300 overflow-hidden text-ellipsis`}
                                onClick={toggleThermalCircuits}
                            >
                                <FaThermometerHalf className="mr-2"/>
                                Тепловые контуры
                                <FaChevronDown
                                    className={`ml-2 transition-transform duration-300 ${isThermalCircuitsOpen ? 'rotate-180' : ''} text-xs`}/>
                            </button>
                            <ul className={`transition-max-height duration-300 ease-in-out ${isThermalCircuitsOpen ? 'max-h-[200px]' : 'max-h-0'} overflow-hidden flex flex-col`}>
                                {thermalCircuits.map((circuit) => (
                                    <li key={circuit.id}>
                                        <Link to={`/building/thermalCircuit/${circuit.id}`}
                                              className="flex items-center p-2 pl-8 rounded-lg hover:bg-gray-700 whitespace-normal overflow-hidden text-ellipsis">
                                            <FaThermometerHalf className="mr-2"/>
                                            {circuit.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        <li>
                            <button
                                className={`flex items-center ${isSectionsOpen || isThermalCircuitsOpen || isDevicesOpen ? 'w-[280px]' : 'w-[210px]'} p-2 rounded-lg hover:bg-gray-700 text-left transition-width duration-300 overflow-hidden text-ellipsis`}
                                onClick={toggleDevices}
                            >
                                <FaTools className="mr-2"/>
                                Устройства
                                <FaChevronDown
                                    className={`ml-2 transition-transform duration-300 ${isDevicesOpen ? 'rotate-180' : ''} text-xs`}/>
                            </button>
                            <ul className={`transition-max-height duration-300 ease-in-out ${isDevicesOpen ? 'max-h-[200px]' : 'max-h-0'} overflow-hidden flex flex-col`}>
                                <li>
                                    <Link to="/building/devices/"
                                          className="flex items-center p-2 pl-8 rounded-lg hover:bg-gray-700 whitespace-normal overflow-hidden text-ellipsis">
                                        <FaBug className="mr-2"/>
                                        Датчики
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/building/controllers"
                                          className="flex items-center p-2 pl-8 rounded-lg hover:bg-gray-700 whitespace-normal overflow-hidden text-ellipsis">
                                        <FaMicrochip className="mr-2"/>
                                        Контроллеры
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <Link to="/building/incidents"
                                  className={`flex items-center ${isSectionsOpen || isThermalCircuitsOpen || isDevicesOpen ? 'w-[280px]' : 'w-[210px]'} p-2 rounded-lg hover:bg-gray-700 whitespace-nowrap transition-width duration-300 overflow-hidden text-ellipsis`}>
                                <FaExclamationTriangle className="mr-2"/>
                                Инциденты
                            </Link>
                        </li>

                        <li>
                            <Link to="/building/users"
                                  className={`flex items-center ${isSectionsOpen || isThermalCircuitsOpen || isDevicesOpen ? 'w-[280px]' : 'w-[210px]'} p-2 rounded-lg hover:bg-gray-700 whitespace-nowrap transition-width duration-300 overflow-hidden text-ellipsis`}>
                                <FaUser className="mr-2"/>
                                Пользователи
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default LeftMenu;
