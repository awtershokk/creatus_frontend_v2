import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchForControllerProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchForController: React.FC<SearchForControllerProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="search-container relative w-[600px] flex items-center mt-4 mb-3">
            <FaSearch className="search-icon absolute left-2 text-gray-500" />
            <input
                type="text"
                placeholder="Поиск по параметрам"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input form-control text-black w-full bg-white border border-black rounded py-1 pl-8 pr-8"
            />
            {searchTerm && (
                <button
                    className="clear-search-button absolute right-2 text-gray-400"
                    onClick={() => setSearchTerm('')}
                >
                    <FaTimes />
                </button>
            )}
        </div>
    );
};

export default SearchForController;
