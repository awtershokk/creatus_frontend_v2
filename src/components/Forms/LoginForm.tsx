import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface LoginFormProps {
    redirectPath?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ redirectPath }) => {
    const { login, error, status, user, refresh } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(username, password);
    };

    useEffect(() => {
        if (user) {
            if (redirectPath) {
                navigate(redirectPath);
            } else {
                if (user.roleId === 1) {
                    navigate('/user');
                } else {
                    navigate('/building');
                }
            }
        }
    }, [user, navigate, redirectPath]);

    // Обновляем токен через каждые 5 минут
    useEffect(() => {
        const interval = setInterval(() => {
            refresh();
        }, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user, refresh]);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-screen min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-96"
                autoComplete="off"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Вход в систему SmartHeat</h2>

                <input type="text" name="hiddenUsername" className="hidden" autoComplete="username"/>
                <input type="password" name="hiddenPassword" className="hidden" autoComplete="new-password"/>

                <div className="mb-4">
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Логин
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        autoComplete="off"
                        name="notUsername"
                    />
                </div>
                <div className="relative mb-6">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Пароль
                    </label>

                    <input type="password" name="hidden" className="hidden" autoComplete="off"/>
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
                                    <FaRegEye className="h-5 w-5 text-gray-500" aria-hidden="true"/>
                                ) : (
                                    <FaRegEyeSlash className="h-5 w-5 text-gray-500" aria-hidden="true"/>
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
                    {status === 'loading' ? 'Вход...' : 'Вход'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
