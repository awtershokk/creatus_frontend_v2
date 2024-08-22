import { useState, useEffect, useRef } from 'react';
import { FaUser, FaCog, FaChevronDown } from 'react-icons/fa';
import { FiLogOut } from "react-icons/fi";

const Header = () => {

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<'user' | 'settings' | ''>('');
    const userRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);
    const userModalRef = useRef<HTMLDivElement>(null);

    const handleUserClick = () => {
        setIsUserModalOpen(!isUserModalOpen);
        setIsUserDropdownOpen(false);
        setIsSettingsDropdownOpen(false);
        setActiveSection('user');
    };

    const handleSettingsClick = () => {
        setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
        setIsUserDropdownOpen(false);
        setIsUserModalOpen(false);
        setActiveSection('settings');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userRef.current &&
                !userRef.current.contains(event.target as Node) &&
                !userModalRef.current?.contains(event.target as Node) &&
                settingsRef.current &&
                !settingsRef.current.contains(event.target as Node)
            ) {
                setIsUserDropdownOpen(false);
                setIsSettingsDropdownOpen(false);
                setIsUserModalOpen(false);
                setActiveSection('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-gray-800 text-white w-full fixed top-0 left-0 z-50">
            <nav className="flex justify-between items-center py-3 px-6">
                <div className="flex items-center">
                    <a href="/" className="text-xl text-white">SmartHeat</a>
                </div>
                <div className="flex items-center">
                    <div
                        ref={settingsRef}
                        className="relative"
                        onClick={handleSettingsClick}
                        onMouseEnter={() => setActiveSection('settings')}
                        onMouseLeave={() => !isSettingsDropdownOpen && setActiveSection('')}
                    >
                        <div className={`flex items-center cursor-pointer p-3 rounded transition-colors duration-300 ${activeSection === 'settings' ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}>
                            <FaCog className="mr-1 text-xl text-white" />
                            <span className={`ml-0.5 transition-transform duration-300 ${isSettingsDropdownOpen ? 'rotate-180' : ''}`}>
                                <FaChevronDown className="text-xs" />
                            </span>
                        </div>
                        {isSettingsDropdownOpen && (
                            <ul
                                className={`absolute right-0 mt-2 w-60 bg-gray-800 text-white shadow-lg z-10 transition-opacity duration-300 transform ${isSettingsDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
                            >
                                <li className="px-6 py-3 hover:bg-gray-700 flex items-center cursor-pointer">
                                    <FaUser className="mr-2 text-lg"/> Режим пользователя
                                </li>
                                <hr className="border-gray-600"/>
                                <li className="px-6 py-3 hover:bg-gray-700 flex items-center cursor-pointer">
                                    <FaCog className="mr-2 text-lg"/> Режим настройки
                                </li>
                            </ul>

                        )}
                    </div>
                    <div
                        ref={userRef}
                        className="relative ml-auto"
                        onClick={handleUserClick}
                        onMouseEnter={() => setActiveSection('user')}
                        onMouseLeave={() => !isUserModalOpen && setActiveSection('')}
                    >
                        <div
                            className={`flex items-center cursor-pointer p-3 rounded transition-colors duration-300 ${activeSection === 'user' ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}>
                            <FaUser className="text-xl text-white" />
                            <span className={`ml-0.5 transition-transform duration-300 ${isUserModalOpen ? 'rotate-180' : ''}`}>
                                <FaChevronDown className="text-xs" />
                            </span>
                        </div>
                        {isUserModalOpen && (
                            <div
                                ref={userModalRef}
                                className="absolute right-0 mt-2 w-64 bg-gray-800 text-white shadow-lg z-10 p-4 rounded transition-opacity duration-300"
                            >
                                <p className="text-lg font-bold">Имя пользователя</p>
                                <p>Логин</p>
                                <p>Роль</p>
                                <hr className="border-gray-600 my-2" />
                                <p className="text-red-600 cursor-pointer flex items-center">
                                    <FiLogOut className="mr-1" /> Выйти
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
