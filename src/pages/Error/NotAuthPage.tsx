import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Label from "../../components/Text/Label.tsx";
import BlueLink from "../../components/Text/BlueLink.tsx";
import ModalTemplate from "../../components/Modal/ModalTemplate.tsx";

const NotAuth: React.FC = () => {
    const { login, error, status, user, refresh } = useAuth();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [currentPath, setCurrentPath] = useState('/');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const storedUsername = localStorage.getItem('userName') || '';

    useEffect(() => {
        const path = localStorage.getItem('currentPath');
        if (path) {
            setCurrentPath(path);
        }
        toast.warning("Время сессии истекло. Необходимо выполнить вход заново.");
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            refresh();
        }, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user, refresh]);

    useEffect(() => {
        if (user) {
            setShowModal(true);

        }
    }, [user]);

    useEffect(() => {
        if (error) {
            setIsLoggingIn(false);
        }
    }, [error]);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsLoggingIn(false);
        setShowModal(false);
        redirectByRole();
    };

    const handleConfirm = async () => {
        await login(storedUsername, password);
        setShowModal(false);
        redirectToCurrentPath();
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        await login(storedUsername, password);
    };

    const redirectToCurrentPath = () => {
        if (currentPath) {
            navigate(currentPath);
        }
    };

    const redirectByRole = () => {
        if (user.roleId === 1) {
            navigate('/user');

        } else {
            navigate('/building');
        }
    };

    return (
        <div className="w-screen min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-lg shadow-lg w-96"
                autoComplete="off"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Вход в систему SmartHeat</h2>

                <div className="flex justify-center mb-4">
                    <Label text={storedUsername} />
                </div>
                <div className="relative mb-6">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Пароль
                    </label>

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                            autoComplete="new-password"
                            name="notPassword"
                        />
                        {password && (
                            <button
                                type="button"
                                onClick={handleTogglePasswordVisibility}
                                className="absolute inset-y-0 right-3 flex items-center"
                            >
                                {showPassword ? (
                                    <FaRegEye className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                ) : (
                                    <FaRegEyeSlash className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                )}
                            </button>
                        )}
                    </div>
                    {error && (
                        <div className="flex justify-center mt-2">
                            <p className="text-red-500 text-sm">
                                {error}
                            </p>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                >
                    {status === 'loading' || isLoggingIn ? 'Вход...' : 'Вход'}
                </button>
                <div className="flex justify-center mt-2">
                    <BlueLink to="/" text="Использовать другую учётную запись" />
                </div>
            </form>

            {showModal && (
                <ModalTemplate
                    headerTitle="Подтверждение"
                    buttonLabel="Да"
                    onClose={handleCloseModal}
                    onSubmit={handleConfirm}
                    loading={false}
                    cancelButtonLabel="Нет"
                >
                    <p className="text-black">Восстановить работу приложения?</p>
                </ModalTemplate>
            )}
        </div>
    );
};

export default NotAuth;
