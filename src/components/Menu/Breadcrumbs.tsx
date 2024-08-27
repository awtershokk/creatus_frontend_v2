import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from 'react-icons/fa';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    const createBreadcrumbPath = (pathnames) => {
        return pathnames.filter(value => isNaN(value));
    };

    const getBreadcrumbData = (segment) => {
        const data = JSON.parse(localStorage.getItem(segment));
        return {
            label: data?.label || segment,
            icon: data?.icon ? Icons[data.icon] : null,
        };
    };

    const breadcrumbPath = createBreadcrumbPath(pathnames);

    return (
        <div>
            <div className="absolute h-[50px] inset-0 bg-gray-700 w-screen mt-[68px] -z-20"></div>
            <div className="container mx-auto px-4 py-2.5 mt-[72px]">
                <nav className="text-left text-lg leading-6 whitespace-nowrap -z-10 flex items-center">
                    {breadcrumbPath.map((value, index) => {
                        const to = `/${breadcrumbPath.slice(0, index + 1).join('/')}`;
                        const isLast = index === breadcrumbPath.length - 1;
                        const { label, icon: Icon } = getBreadcrumbData(value);
                        return (
                            <React.Fragment key={to}>
                                {index > 0 && (
                                    <span className="text-gray-300 mx-2 ">/</span>
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
