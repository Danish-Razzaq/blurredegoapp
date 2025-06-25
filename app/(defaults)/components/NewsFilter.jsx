// NewsFilter component
'use client';
import React, { useState } from 'react';
import { GiSettingsKnobs } from 'react-icons/gi';
const NewsFilter = ({ onFilterChange }) => {
    const [showDropDown, setShowDropDown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');

    const handleFilterChange = (event) => {
        const value = event.target.value;
        console.log('Selected Filter:', value);
        setSelectedFilter(value);
        onFilterChange(value); // Notify parent of the selected filter
        setShowDropDown(false);
    };

    return (
        <div className="cnt-center container flex items-center justify-between">
        <div />
        <h2 className="my-4 text-center">Latest News</h2>
        <div className="relative h-full">
          <div className="red h-full w-8 rotate-90 cursor-pointer rounded">
            <GiSettingsKnobs
              color="white"
              className="h-full w-full p-1"
              onClick={() => setShowDropDown(!showDropDown)}
            />
          </div>
          {showDropDown && (
            <div  className="absolute top-9 left-auto right-0 z-10  w-40 cursor-pointer rounded opacity-100 bg-white shadow-lg">
              <ul className="cursor-pointer">
                <li
                  className={`px-4 py-2 hover:bg-gray-100 ${selectedFilter === 'latest' ? 'bg-gray-200' : ''}`}
                  onClick={() => handleFilterChange({ target: { value: 'latest' } })}
                >
                  Latest
                </li>
                <li
                  className={`px-4 py-2 hover:bg-gray-100 ${selectedFilter === 'thisWeek' ? 'bg-gray-200' : ''}`}
                  onClick={() => handleFilterChange({ target: { value: 'thisWeek' } })}
                >
                  Last Week
                </li>
                <li
                  className={`px-4 py-2 hover:bg-gray-100 ${selectedFilter === 'previousMonth' ? 'bg-gray-200' : ''}`}
                  onClick={() => handleFilterChange({ target: { value: 'previousMonth' } })}
                >
                  Last Month
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      
    );
};

export default NewsFilter;
