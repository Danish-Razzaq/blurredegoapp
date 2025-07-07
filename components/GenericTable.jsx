'use client';
import { usePathname } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import { FaSortNumericUp , FaSortNumericDownAlt} from 'react-icons/fa';
const GenericTable = ({ columns, data, renderRowActions, itemsPerPageOptions = [10, 15, 20] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
    const [sortConfig, setSortConfig] = useState({
        key: 'id',
        direction: 'asc',
    });

    // Sort the data based on ID
    const handleSort = () => {
        setSortConfig((prevConfig) => ({
            key: 'id',
            direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }));
    };
    
    const handleSortByDate = () => {
        setSortConfig((prevConfig) => ({
            key: 'invoice_Payment_Received_Date',
            direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }));
    };
    
    const sortedData = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];
    
        return [...data].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];
    
            if (sortConfig.key === 'id') {
                return sortConfig.direction === 'asc'
                    ? parseInt(aValue) - parseInt(bValue)
                    : parseInt(bValue) - parseInt(aValue);
            }
    
            if (sortConfig.key === 'invoice_Payment_Received_Date') {
                const dateA = aValue ? new Date(aValue) : null;
                const dateB = bValue ? new Date(bValue) : null;
    
                if (!dateA && !dateB) return 0;
                if (!dateA) return 1;
                if (!dateB) return -1;
    
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }
    
            return 0; // Default case (prevents errors)
        });
    }, [data, sortConfig]);
    

    // Calculate total pages
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    // Get current page data
    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage]);

  
    
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const  pathname = usePathname();


    return (
        <>
            <div className="w-full overflow-x-auto text-nowrap shadow-md sm:rounded-lg">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="red text-xs uppercase text-white">
                        <tr className="red bg-red-700">
                            {columns?.map((col, index) => (
                                <th key={col.key} scope="col" className="px-6 py-3 text-center">
                                    {index === 0 ? (
                                        <button onClick={pathname.match('/pages/events/attendees') ? undefined : () => handleSort()} className="flex items-center justify-center gap-2 space-x-1">
                                            <span>{col.header}</span>
                                            {pathname.match('/pages/events/attendees') ? '' : sortConfig.direction === 'asc' ? <FaSortNumericUp className="h-6 w-6 text-yellow-300" /> : <FaSortNumericDownAlt className="h-6 w-6 text-yellow-300" />}
                                        </button>
                                    ) : (
                                        col.header ===  'Payment Received Date' ? (
                                            <button onClick={pathname.match('/pages/events/attendees') ? undefined : () => handleSortByDate()} className="flex items-center justify-center gap-2 space-x-1">
                                                <span>{col.header}</span>
                                                {pathname.match('/pages/events/attendees') ? '' : sortConfig.direction === 'asc' ? <FaSortNumericUp className="h-6 w-6 text-yellow-300" /> : <FaSortNumericDownAlt className="h-6 w-6 text-yellow-300" />}
                                            </button>
                                        ) : col.header
                                    )}
                                </th>
                            ))}
                            {renderRowActions && <th className="px-6 py-3 text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData?.length > 0 ? (
                            currentData.map((item, index) => (
                                <tr key={item.id || index} className="border-b bg-white hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 text-center">
                                            {col.render ? col.render(item, index) : item[col.key]}
                                        </td>
                                    ))}
                                    {renderRowActions && <td className="px-6 py-4 text-center">{renderRowActions(item)}</td>}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (renderRowActions ? 1 : 0)} className="px-6 py-4 text-center">
                                   No data available. Please check back later.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            <div className="flex w-full items-center justify-between p-4  max-lg:hidden ">
                <div>
                    <button className="bg-gray-200 px-3 py-1 text-sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <button className="red ml-2 px-3 py-1 text-sm text-white" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>

                <div>
                    <span className="font-bold text-red-600">Items per page:</span>
                    <select
                        style={{ height: '23px' }}
                        className="ml-2 inline-block w-28 bg-gray-200 p-0 text-sm"
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        {itemsPerPageOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <span className="text-sm text-red-700">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
            </div>
      
        </>
    );
};

export default GenericTable;



/*
// this component is a generic table that can be used to display any data in a table format but this time in don't use this because it has no Sorting and Filtering functionality. I will use the GenericTableWithSortingAndFiltering component instead. 

'use client';
import React, { useState } from 'react';

const GenericTable = ({ columns, data, renderRowActions, itemsPerPageOptions = [10, 15, 20] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

    // Calculate the total number of pages
    const totalPages = Math.ceil(data?.length / itemsPerPage);

    // Calculate the data to display on the current page
    const currentData = data?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <>
            <div className="w-full overflow-x-auto text-nowrap shadow-md sm:rounded-lg">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="red text-xs uppercase text-white">
                        <tr className="red bg-red-700">
                            {columns?.map((col) => (
                                <th key={col.key} scope="col" className="px-6 py-3 text-center">
                                    {col.header}
                                </th>
                            ))}
                            {renderRowActions && <th className="px-6 py-3 text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData?.length > 0 ? (
                            currentData.map((item) => (
                                <tr key={item.id} className="border-b bg-white hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 text-center">
                                            {col.render ? col.render(item) : item[col.key]}
                                        </td>
                                    ))}
                                    {renderRowActions && <td className="px-6 py-4 text-center">{renderRowActions(item)}</td>}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (renderRowActions ? 1 : 0)} className="px-6 py-4 text-center">
                                    The table is empty
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>

            </div>
            <div className="flex w-full items-center justify-between p-4">
                <div>
                    <button className="bg-gray-200 px-3 py-1 text-sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <button className="red ml-2 px-3 py-1 text-sm text-white" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>

                <div className="">
                    <span className="font-bold text-red-600 ">Items per page:</span>
                    <select
                        style={{ height: '23px' }}
                        className=" ml-2  inline-block w-28  bg-gray-200  p-0 text-sm"
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1); // Reset to the first page
                        }}
                    >
                        {itemsPerPageOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <span className="text-sm text-red-700">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
            </div>
        </>
    );
};

export default GenericTable;

*/
