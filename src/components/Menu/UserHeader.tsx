import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaCog, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiLogOut } from "react-icons/fi";
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getRole } from "../../utils/getRole";
import {Link} from "react-router-dom";

interface UserHeaderProps {
    officeName: string;
    currentCircuitLabel: string;
    onPrevClick: () => void;
    onNextClick: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ officeName, currentCircuitLabel, onPrevClick, onNextClick }) => {
    const { logout } = useAuth();
    const user = useSelector((state: RootState) => state.auth.user);

    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<'user' | 'settings' | ''>('');
    const userRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);
    const userModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userRef.current &&
                !userRef.current.contains(event.target as Node) &&
                !userModalRef.current?.contains(event.target as Node) &&
                settingsRef.current &&
                !settingsRef.current.contains(event.target as Node)
            ) {
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
        setIsSettingsDropdownOpen(false);
        setActiveSection('user');
    };

    const handleSettingsClick = () => {
        setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
        setIsUserModalOpen(false);
        setActiveSection('settings');
    };

    const handleLogout = async () => {
        await logout();
    };

    const isAdmin = user.roleId === 2 || user.roleId === 3;

    return (
        <header className="bg-gray-800 text-white w-full fixed top-0 left-0 z-50">
            <nav className="flex justify-between items-center py-3 px-6 ">
                <div className="flex items-center space-x-4">
                    <Link className="text-xl text-white" to='/user'>SmartHeat </Link>
                </div>

                <div className="flex items-center ">
                    {isAdmin && (
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
                                <li className="px-6 py-3 hover:bg-gray-700 flex items-center cursor-pointer whitespace-nowrap">
                                    <Link className="flex items-center" to='/building'>
                                        <FaUser className="mr-2 text-lg"/> Режим администратора
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                        )}

                    <div
                        ref={userRef}
                        className="relative"
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
            <div
                className="bg-gray-900 text-white py-2 px-6 border-b border-gray-700 flex items-center justify-between">
                <button className="p-2" onClick={onPrevClick}>
                    <FaChevronLeft className="text-xl"/>
                </button>
                <p className="text-lg mr-5">{officeName}</p>
                <p className="text-lg">{currentCircuitLabel}</p>
                <button className="p-2" onClick={onNextClick}>
                    <FaChevronRight className="text-xl"/>
                </button>
            </div>
        </header>
    );
};

export default UserHeader;
