import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface RenderDataForControllerProps {
    activeTab: string;
    filteredData: any[];
    favorites: string[];
    renderRow: (item: any, index: number) => JSX.Element;
}

const RenderDataForController: React.FC<RenderDataForControllerProps> = ({ activeTab, filteredData, favorites, renderRow }) => {
    const filterFavorites = (items: any[]) => {
        return items.reduce((acc, item) => {
            if (item.favorites || favorites.includes(`-${item.param}`)) {
                acc.push(item);
            } else if (item.children.length > 0) {
                const filteredChildren = filterFavorites(item.children);
                if (filteredChildren.length > 0) {
                    acc.push({ ...item, children: filteredChildren });
                }
            }
            return acc;
        }, []);
    };

    const filterSettings = (items: any[]) => {
        return items.reduce((acc, item) => {
            if (item.editable) {
                acc.push(item);
            } else if (item.children.length > 0) {
                const filteredChildren = filterSettings(item.children);
                if (filteredChildren.length > 0) {
                    acc.push({ ...item, children: filteredChildren });
                }
            }
            return acc;
        }, []);
    };

    const renderTableData = () => {
        let dataToRender = filteredData;

        if (activeTab === 'favorites') {
            dataToRender = filterFavorites(filteredData);
        } else if (activeTab === 'settings') {
            dataToRender = filterSettings(filteredData);
        }

        if (dataToRender.length === 0 && activeTab !== 'favorites') {
            return (
                <tr>
                    <td colSpan={2} className="text-center">
                        <FaSpinner className="spinner" />
                    </td>
                </tr>
            );
        } else if (dataToRender.length === 0 && activeTab === 'favorites') {
            return (
                <tr>
                    <td colSpan={2} className="text-center">В избранном ничего нет</td>
                </tr>
            );
        }

        return dataToRender.map((item, index) => renderRow(item, index));
    };

    return <>{renderTableData()}</>;
};

export default RenderDataForController;
