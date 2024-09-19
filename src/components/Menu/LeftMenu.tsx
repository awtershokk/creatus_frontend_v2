import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    FaUser,
    FaTools,
    FaChevronDown,
    FaBug,
    FaCogs,
    FaExclamationTriangle,
    FaMicrochip,
    FaBars,
    FaThermometerHalf,
    FaBell
} from 'react-icons/fa';
import { fetchSections } from '../../api/sectionApi.ts';
import { fetchThermalCircuits } from '../../api/thermalCircuitApi.ts';

const LeftMenu: React.FC = () => {
    const [isDevicesOpen, setIsDevicesOpen] = useState(false);
    const [isSectionsOpen, setIsSectionsOpen] = useState(false);
    const [isThermalCircuitsOpen, setIsThermalCircuitsOpen] = useState(false);
    const [sections, setSections] = useState<any[]>([]);
    const [thermalCircuits, setThermalCircuits] = useState<any[]>([]);
    const [menuWidth, setMenuWidth] = useState(240);

    const sectionsRef = useRef<HTMLUListElement>(null);
    const thermalCircuitsRef = useRef<HTMLUListElement>(null);
    const devicesRef = useRef<HTMLUListElement>(null);
    const buildingId = 1;

    const [hasUpdates, setHasUpdates] = useState(false);
    const [isSwinging, setIsSwinging] = useState(false);


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

        const checkForUpdates = () => {
            setHasUpdates(true);
        };


        loadSections();
        loadThermalCircuits();
        checkForUpdates();
    }, [buildingId]);

    const calculateWidth = (element: HTMLUListElement | null): number => {
        if (element) {
            const items = Array.from(element.children) as HTMLElement[];
            const paddingLeft = 50;
            const maxWidth = items.reduce((max, item) => {
                const styles = window.getComputedStyle(item);
                const paddingLeftItem = parseFloat(styles.paddingLeft);
                const paddingRightItem = parseFloat(styles.paddingRight);
                const marginLeft = parseFloat(styles.marginLeft);
                const marginRight = parseFloat(styles.marginRight);
                const width = item.scrollWidth + paddingLeftItem + paddingRightItem + marginLeft + marginRight;
                return Math.max(max, width);
            }, 0);
            return Math.max(maxWidth  + paddingLeft, 240);
        }
        return 240;
    };

    const updateWidth = () => {
        let newWidth = 240;
        if (isThermalCircuitsOpen) {
            newWidth = Math.max(calculateWidth(thermalCircuitsRef.current), newWidth);
        }
        if (isDevicesOpen) {
            newWidth = Math.max(calculateWidth(devicesRef.current), newWidth);
        }
        if (isSectionsOpen) {
            newWidth = Math.max(calculateWidth(sectionsRef.current), newWidth);
        }
        setMenuWidth(newWidth);
    };

    useEffect(() => {
        updateWidth();
    }, [isThermalCircuitsOpen, isDevicesOpen, isSectionsOpen]);

    const handleToggleDevices = () => {
        setIsDevicesOpen(!isDevicesOpen);
    };

    const handleToggleSections = () => {
        setIsSectionsOpen(!isSectionsOpen);
    };

    const handleToggleThermalCircuits = () => {
        setIsThermalCircuitsOpen(!isThermalCircuitsOpen);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsSwinging(true);

            setTimeout(() => setIsSwinging(false), 1000);
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="bg-gray-800 text-white z-10 " style={{ maxWidth: `${menuWidth}px`, transition: 'max-width 0.3s ease' }}>
            <div className="flex flex-col flex-grow p-4 h-full">
                <div className="mb-6">
                    <h1 className="text-xl font-bold whitespace-nowrap">SmartHeat</h1>
                </div>
                <nav className="flex-1 overflow-y-auto overflow-x-hidden">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/building/updates"
                                className="flex items-center p-2 rounded-lg hover:bg-gray-700 whitespace-nowrap"
                            >
                                <FaCogs className="mr-2"/>
                                Версия ПО
                                {/*<FaBell*/}
                                {/*    className={`ml-2 text-green-500 ${isSwinging ? 'animate-swingTop' : ''}`}*/}
                                {/*    title="Есть обновления"*/}
                                {/*/>*/}
                            </Link>
                        </li>

                        <li>
                            <button
                                className="flex items-center p-2 rounded-lg hover:bg-gray-700 text-left"
                                onClick={handleToggleSections}
                            >
                                <FaBars className="mr-2"/>
                                Секции
                                <FaChevronDown
                                    className={`ml-2 transition-transform duration-300 ${isSectionsOpen ? 'rotate-180' : ''} text-xs`}/>
                            </button>
                            <ul ref={sectionsRef}
                                className={`transition-max-height duration-300 ease-in-out overflow-hidden ${isSectionsOpen ? 'max-h-40' : 'max-h-0'} w-fit`}>
                                {sections.map((section) => (
                                    <li key={section.id}>
                                        <Link to={`/building/section/${section.id}`}
                                              className="flex items-center p-2 pl-8 rounded-lg hover:bg-gray-700 whitespace-nowrap">
                                            <FaBars className="mr-2"/>
                                            {section.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        <li>
                            <button
                                className="flex items-center p-2 rounded-lg hover:bg-gray-700 text-left"
                                onClick={handleToggleThermalCircuits}
                            >
                                <FaThermometerHalf className="mr-2"/>
                                Тепловые контуры
                                <FaChevronDown
                                    className={`ml-2 transition-transform duration-300 ${isThermalCircuitsOpen ? 'rotate-180' : ''} text-xs`}/>
                            </button>
                            <ul ref={thermalCircuitsRef} className={`transition-max-height duration-300 ease-in-out overflow-hidden ${isThermalCircuitsOpen ? 'max-h-40' : 'max-h-0'} w-fit`}>
                                {thermalCircuits.map((circuit) => (
                                    <li key={circuit.id}>
                                        <Link to={`/building/thermalCircuit/${circuit.id}`}
                                              className="flex items-center p-2 pl-8 rounded-lg hover:bg-gray-700 whitespace-nowrap">
                                            <FaThermometerHalf className="mr-2"/>
                                            {circuit.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        <li>
                            <button
                                className="flex items-center p-2 rounded-lg hover:bg-gray-700 text-left"
                                onClick={handleToggleDevices}
                            >
                                <FaTools className="mr-2"/>
                                Устройства
                                <FaChevronDown
                                    className={`ml-2 transition-transform duration-300 ${isDevicesOpen ? 'rotate-180' : ''} text-xs`}/>
                            </button>
                            <ul ref={devicesRef} className={`transition-max-height duration-300 ease-in-out overflow-hidden ${isDevicesOpen ? 'max-h-40' : 'max-h-0'} w-fit`}>
                                <li>
                                    <Link to="/building/devices/"
                                          className="flex items-center p-2 pl-8 rounded-lg hover:bg-gray-700 whitespace-nowrap">
                                        <FaBug className="mr-2"/>
                                        Датчики
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/building/controllers"
                                          className="flex items-center p-2 pl-8 rounded-lg hover:bg-gray-700 whitespace-nowrap">
                                        <FaMicrochip className="mr-2"/>
                                        Контроллеры
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <Link to="/building/incidents"
                                  className="flex items-center p-2 rounded-lg hover:bg-gray-700 whitespace-nowrap">
                                <FaExclamationTriangle className="mr-2"/>
                                Инциденты
                            </Link>
                        </li>

                        <li>
                            <Link to="/building/users"
                                  className="flex items-center p-2 rounded-lg hover:bg-gray-700 whitespace-nowrap">
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
