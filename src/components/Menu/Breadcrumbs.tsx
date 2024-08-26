import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from 'react-icons/fa'; // Импортируем все иконки из библиотеки react-icons/fa

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    const createBreadcrumbPath = (pathnames) => {
        const result = [];
        for (let i = 0; i < pathnames.length; i++) {
            const value = pathnames[i];
            if (!isNaN(value) && i > 0) {
                result[result.length - 1] = `${result[result.length - 1]}/${value}`;
            } else {
                result.push(value);
            }
        }
        return result;
    };

    const getBreadcrumbData = (segment) => {
        const data = JSON.parse(localStorage.getItem(segment));
        return {
            label: data?.label || segment,
            icon: data?.icon ? Icons[data.icon] : null, // Получаем иконку по её идентификатору
        };
    };

    const breadcrumbPath = createBreadcrumbPath(pathnames);

    return (
        <div>
            <div className="absolute h-[50px] inset-0 bg-gray-700 -z-10 mt-[68px]"></div>
            <div className="container mx-auto px-4 py-2 mt-[72px]">
                <nav className="text-left text-lg leading-6 whitespace-nowrap">
                    {breadcrumbPath.map((value, index) => {
                        const to = `/${breadcrumbPath.slice(0, index + 1).join('/')}`;
                        const isLast = index === breadcrumbPath.length - 1;
                        const { label, icon: Icon } = getBreadcrumbData(value);
                        return (
                            <React.Fragment key={to}>
                                {index > 0 && (
                                    <span className="text-gray-300 mx-2">/</span>
                                )}
                                {isLast ? (
                                    <span className="text-gray-300 flex items-center inline-flex">
                                        {Icon && <Icon className="mr-2" />}
                                        {label}
                                    </span>
                                ) : (
                                    <Link to={to} className="text-white hover:underline flex items-center inline-flex">
                                        {Icon && <Icon className="mr-2" />}
                                        {label}
                                    </Link>
                                )}
                            </React.Fragment>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default Breadcrumbs;
