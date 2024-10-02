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
} from 'react-icons/fa';
import { fetchSections } from '../../api/requests/sectionApi.ts';
import { fetchThermalCircuits } from '../../api/requests/thermalCircuitApi.ts';

const LeftMenu: React.FC = () => {
    const [isDevicesOpen, setIsDevicesOpen] = useState(false);
    const [isSectionsOpen, setIsSectionsOpen] = useState(false);
    const [isThermalCircuitsOpen, setIsThermalCircuitsOpen] = useState(false);
    const [sections, setSections] = useState<any[]>([]);
    const [thermalCircuits, setThermalCircuits] = useState<any[]>([]);
    const [menuWidth, setMenuWidth] = useState(240);
    const [pendingOpen, setPendingOpen] = useState<{ type: 'devices' | 'sections' | 'thermalCircuits' | null }>(null);

    const sectionsRef = useRef<HTMLUListElement>(null);
    const thermalCircuitsRef = useRef<HTMLUListElement>(null);
    const devicesRef = useRef<HTMLUListElement>(null);
    const buildingId = 1;

    //const [hasUpdates, setHasUpdates] = useState(false);
    //const [isSwinging, setIsSwinging] = useState(false);

    const animationDelay = 50;

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

    const updateWidth = () => {
        let newWidth = 240; // начальная ширина

        if (isThermalCircuitsOpen && !isDevicesOpen && !isSectionsOpen) {
            // Если открыт только Thermal Circuits
            newWidth = Math.max(calculateWidth(thermalCircuitsRef.current), newWidth);
        } else if (!isThermalCircuitsOpen && isDevicesOpen && !isSectionsOpen) {
            // Если открыт только Devices
            newWidth = Math.max(calculateWidth(devicesRef.current), newWidth);
        } else if (!isThermalCircuitsOpen && !isDevicesOpen && isSectionsOpen) {
            // Если открыт только Sections
            newWidth = Math.max(calculateWidth(sectionsRef.current), newWidth);
        } else if (isThermalCircuitsOpen && isDevicesOpen && !isSectionsOpen) {
            // Если открыты Thermal Circuits и Devices
            newWidth = Math.max(calculateWidth(thermalCircuitsRef.current), calculateWidth(devicesRef.current), newWidth);
        } else if (isThermalCircuitsOpen && !isDevicesOpen && isSectionsOpen) {
            // Если открыты Thermal Circuits и Sections
            newWidth = Math.max(calculateWidth(thermalCircuitsRef.current), calculateWidth(sectionsRef.current), newWidth);
        } else if (!isThermalCircuitsOpen && isDevicesOpen && isSectionsOpen) {
            // Если открыты Devices и Sections
            newWidth = Math.max(calculateWidth(devicesRef.current), calculateWidth(sectionsRef.current), newWidth);
        } else if (isThermalCircuitsOpen && isDevicesOpen && isSectionsOpen) {
            // Если открыты все три
            newWidth = Math.max(
                calculateWidth(thermalCircuitsRef.current),
                calculateWidth(devicesRef.current),
                calculateWidth(sectionsRef.current),
                newWidth
            );
        }
        setMenuWidth(newWidth);
        console.log(menuWidth);
    };

    const calculateWidth = (element: HTMLUListElement | null): number => {
        if (element) {
            const items = Array.from(element.children) as HTMLElement[];
            const paddingLeft = 100;
            const maxWidth = items.reduce((max, item) => {
                const styles = window.getComputedStyle(item);
                const paddingLeftItem = parseFloat(styles.paddingLeft);
                const paddingRightItem = parseFloat(styles.paddingRight);
                const marginLeft = parseFloat(styles.marginLeft);
                const marginRight = parseFloat(styles.marginRight);
                const width = item.scrollWidth + paddingLeftItem + paddingRightItem + marginLeft + marginRight;
                return Math.max(max, width);
            }, 0);

            if((maxWidth + 20)<240){
                return 240
            }

            else {
                return (maxWidth + paddingLeft);
            }
        }
        return 240;
    };


    useEffect(() => {
        if (pendingOpen) {
            setTimeout(() => {
                switch (pendingOpen.type) {
                    case 'devices':
                        setIsDevicesOpen(true);
                        break;
                    case 'sections':
                        setIsSectionsOpen(true);
                        break;
                    case 'thermalCircuits':
                        setIsThermalCircuitsOpen(true);
                        break;
                }
                setPendingOpen(null);
            }, animationDelay);
        }
    }, [pendingOpen]);

    useEffect(() => {
        if (isThermalCircuitsOpen || isDevicesOpen || isSectionsOpen) {
            setTimeout(updateWidth, animationDelay);
        } else {
            updateWidth();

        }
    }, [isThermalCircuitsOpen, isDevicesOpen, isSectionsOpen]);


    const handleToggleDevices = () => {
        if (!isDevicesOpen) {
            setPendingOpen({ type: 'devices' });
            setMenuWidth(Math.max(calculateWidth(devicesRef.current), menuWidth));
        } else {
            setIsDevicesOpen(false);
            updateWidth();
        }
    };

    const handleToggleSections = () => {
        if (!isSectionsOpen) {
            setPendingOpen({ type: 'sections' });
            setMenuWidth(Math.max(calculateWidth(sectionsRef.current), menuWidth));
        } else {
            setIsSectionsOpen(false);
            updateWidth();
        }
    };

    const handleToggleThermalCircuits = () => {
        if (!isThermalCircuitsOpen) {
            setPendingOpen({ type: 'thermalCircuits' });
            setMenuWidth(Math.max(calculateWidth(thermalCircuitsRef.current), menuWidth));
        } else {
            setIsThermalCircuitsOpen(false);
            updateWidth();
        }
    };

    return (
        <div className="bg-gray-800 text-white z-10" style={{ maxWidth: `${menuWidth}px`, transition: 'max-width 0.3s ease' }}>
            <div className="flex flex-col flex-grow p-4 h-full">
                <div className="mb-6">
                    <h1 className="text-xl font-bold whitespace-nowrap">SmartHeat</h1>
                </div>
                <nav className="flex-1 overflow-y-auto overflow-x-hidden mb-6">
                    <ul className="space-y-2">
                        {/* Меню "Версия ПО" */}
                        <li>
                            <Link
                                to=""
                                className="flex items-center p-2 rounded-lg cursor-not-allowed text-gray-500 whitespace-nowrap"
                            >
                                <FaCogs className="mr-2" />
                                Версия ПО
                            </Link>
                            {/*<FaBell*/}
                            {/*    className={`ml-2 text-green-500 ${isSwinging ? 'animate-swingTop' : ''}`}*/}
                            {/*    title="Есть обновления"*/}
                            {/*/>*/}


                        </li>

                        {/* "Секции" */}
                        <li>
                            <button
                                className="flex items-center p-2 rounded-lg hover:bg-gray-700 text-left"
                                onClick={handleToggleSections}
                            >
                                <FaBars className="mr-2" />
                                Секции
                                <FaChevronDown
                                    className={`ml-2 transition-transform duration-300 ${isSectionsOpen ? 'rotate-180' : ''} text-xs`}
                                />
                            </button>
                            <ul
                                ref={sectionsRef}
                                className={`transition-max-height duration-300 ease-in-out overflow-hidden ${isSectionsOpen ? 'max-h-40' : 'max-h-0'}`}
                            >
                                {sections.map((section) => (
                                    <li key={section.id}>
                                        <Link
                                            to={`/building/section/${section.id}`}
                                            className="flex items-center p-2 pl-8 rounded-lg hover:bg-gray-700 whitespace-nowrap"
                                        >
                                            <FaBars className="mr-2" />
                                            {section.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        {/*"Тепловые контуры" */}
                        <li>
                            <button
                                className="flex items-center p-2 rounded-lg hover:bg-gray-700 text-left"
                                onClick={handleToggleThermalCircuits}
                            >
                                <FaThermometerHalf className="mr-2" />
                                Тепловые контуры
                                <FaChevronDown
                                    className={`ml-2 transition-transform duration-300 ${isThermalCircuitsOpen ? 'rotate-180' : ''} text-xs`}
                                />
                            </button>
                            <ul
                                ref={thermalCircuitsRef}
                                className={`transition-max-height duration-300 ease-in-out overflow-hidden ${isThermalCircuitsOpen ? 'max-h-40' : 'max-h-0'}`}
                            >
                                {thermalCircuits.map((circuit) => (
                                    <li key={circuit.id}>
                                        <Link
                                            to={`/building/thermalCircuit/${circuit.id}`}
                                            className="flex items-center p-2 pl-8 rounded-lg hover:bg-gray-700 whitespace-nowrap"
                                        >
                                            <FaThermometerHalf className="mr-2" />
                                            {circuit.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        {/*"Устройства" */}
                        <li>
                            <button
                                className="flex items-center p-2 rounded-lg hover:bg-gray-700 text-left"
                                onClick={handleToggleDevices}
                            >
                                <FaTools className="mr-2" />
                                Устройства
                                <FaChevronDown
                                    className={`ml-2 transition-transform duration-300 ${isDevicesOpen ? 'rotate-180' : ''} text-xs`}
                                />
                            </button>
                            <ul
                                ref={devicesRef}
                                className={`transition-max-height duration-300 ease-in-out overflow-hidden ${isDevicesOpen ? 'max-h-40' : 'max-h-0'}`}
                            >
                                <li>
                                    <Link
                                        to="/building/devices/"
                                        className="flex items-center p-2 pl-8 rounded-lg hover:bg-gray-700 whitespace-nowrap"
                                    >
                                        <FaBug className="mr-2" />
                                        Датчики
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/building/controllers"
                                        className="flex items-center p-2 pl-8 rounded-lg hover:bg-gray-700 whitespace-nowrap"
                                    >
                                        <FaMicrochip className="mr-2" />
                                        Контроллеры
                                    </Link>
                                </li>
                            </ul>
                        </li>

                            <li>
                                <Link to=""
                                      className="flex items-center p-2 rounded-lg cursor-not-allowed text-gray-500 whitespace-nowrap">
                                    <FaExclamationTriangle className="mr-2"/>
                                    Инциденты
                                </Link>
                        </li>

                        <li>
                            <Link
                                to="/building/users"
                                className="flex items-center p-2 rounded-lg hover:bg-gray-700 whitespace-nowrap"
                            >
                                <FaUser className="mr-2" />
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
