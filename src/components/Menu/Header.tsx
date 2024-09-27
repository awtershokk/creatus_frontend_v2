import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaCog, FaChevronDown, FaRegWindowClose } from 'react-icons/fa';
import { FiLogOut } from "react-icons/fi";
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getRole } from "../../utils/getRole";
import SettingsModeTable from "../Tables/SettingsModeTable";
import {Link} from "react-router-dom";

const Header = () => {
    const { logout } = useAuth();
    const user = useSelector((state: RootState) => state.auth.user);

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [settingsMode, setSettingsMode] = useState(false);
    const [sections, setSections] = useState([]);
    const [thermals, setThermals] = useState([]);
    const [activeSection, setActiveSection] = useState<'user' | 'settings' | ''>('');
    const userRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);
    const userModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sectionsResponse = await fetch('http://localhost:5001/api/section/1');
                const sectionsData = await sectionsResponse.json();
                setSections(sectionsData.data);

                const thermalsResponse = await fetch('http://localhost:5001/api/thermalCircuit/1');
                const thermalsData = await thermalsResponse.json();
                setThermals(thermalsData.data);
            } catch (error) {
                console.error('Ошибка при получении данных', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const sendSettingsModeRequest = async () => {
            const apiUrl = settingsMode
                ? 'http://localhost:5001/api/device/permitJoin/true'
                : 'http://localhost:5001/api/device/permitJoin/false';

            try {
                const response = await fetch(apiUrl, { method: 'POST' });

                if (response.ok) {

                } else {
                    console.error(`Ошибка при отправке запроса к ${apiUrl}: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.error('Ошибка при отправке запроса:', error);
            }
        };

        if (settingsMode) {
            sendSettingsModeRequest();
        }
    }, [settingsMode]);

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

    const handleLogout = async () => {
        await logout();
    };

    const handleSettingsModeToggle = () => {
        setSettingsMode(!settingsMode);
    };

    return (
        <header className="bg-gray-800 text-white w-full fixed top-0 left-0 z-50">
            <nav className="flex justify-between items-center py-3 px-6">
                <div className="flex items-center">
                    {/*<a href="/building" className="text-xl text-white">SmartHeat</a>*/}
                    <Link className="text-xl text-white" to='/building'>SmartHeat </Link>
                </div>
                <div className="flex items-center">
                    <div
                        ref={settingsRef}
                        className="relative"
                        onClick={handleSettingsClick}
                        onMouseEnter={() => setActiveSection('settings')}
                        onMouseLeave={() => !isSettingsDropdownOpen && setActiveSection('')}
                    >
                        <div
                            className={`flex items-center cursor-pointer p-3 rounded transition-colors duration-300 ${activeSection === 'settings' ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}>
                            <FaCog className="mr-1 text-xl text-white"/>
                            <span
                                className={`ml-0.5 transition-transform duration-300 ${isSettingsDropdownOpen ? 'rotate-180' : ''}`}>
                                <FaChevronDown className="text-xs"/>
                            </span>
                        </div>
                        {isSettingsDropdownOpen && (
                            <ul
                                className={`absolute right-0 mt-2 w-60 bg-gray-800 text-white shadow-lg z-10 transition-opacity duration-300 transform ${isSettingsDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
                            >
                                <li className="px-6 py-3 hover:bg-gray-700 flex items-center cursor-pointer"
                                    onClick={handleSettingsModeToggle}>
                                    <FaCog className="mr-2 text-lg"/> Режим настройки
                                </li>
                                <li className="px-6 py-3 hover:bg-gray-700 flex items-center cursor-pointer">
                                    <Link className="flex items-center" to='/user'>
                                        <FaUser className="mr-2 text-lg"/> Режим пользователя
                                    </Link>

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
                            <FaUser className="text-xl text-white"/>
                            <span
                                className={`ml-0.5 transition-transform duration-300 ${isUserModalOpen ? 'rotate-180' : ''}`}>
                                <FaChevronDown className="text-xs"/>
                            </span>
                        </div>
                        {isUserModalOpen && (
                            <div
                                ref={userModalRef}
                                className="absolute right-0 mt-2 w-64 bg-gray-800 text-white shadow-lg z-10 p-4 rounded"
                            >
                                <p className="text-lg font-bold">{user.fullName}</p>
                                <p>{user.username}</p>
                                <p>{getRole(user.roleId)}</p>
                                <hr className="border-gray-600 my-2"/>
                                <p className="text-red-600 cursor-pointer flex items-center" onClick={handleLogout}>
                                    <FiLogOut className="mr-1"/> Выйти
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {settingsMode && (
                <div className="overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="relative p-6  rounded">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white animate-blink">Поиск устройств...</h4>
                            <button
                                className="flex items-center text-white rounded px-3 py-3 hover:bg-gray-500"
                                onClick={handleSettingsModeToggle}
                            >
                                <FaRegWindowClose className="w-5 h-5"/>
                            </button>
                        </div>
                        <SettingsModeTable />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
