'use client';
import React, { use, useEffect, useState } from 'react';
import { FaEdit, FaRegEye } from 'react-icons/fa';
import GenericTable from '@/components/GenericTable';
import { apiCaller } from '@/utils/api';
import { useSelector, useDispatch } from 'react-redux';
import { setApplicationData } from '@/store/applicationSlice';
import Link from 'next/link';
import { MdDelete } from 'react-icons/md';
import { SuccessNotification } from '@/components/Toster/success';
import { ToastContainer } from 'react-toastify';
import IconSearch from '@/public/icon/icon-search';
import SearchFields from '@/components/GenericSearchComponent';
import {dummyApplications} from '@/Data/application'

const Users = () => {
    const dispatch = useDispatch();
    const applicationRecord = useSelector((state) => state.application.applicationData);
    const [applicationData, setApplicationDataFormat] = useState([]);
    const [openDropdown, setOpenDropdown] = useState({});
    const [selectedApprove, setSelectedApprove] = useState({});
    const [defaultStatus, setDefaultStatus] = useState({});
    const [selectedMembership, setSelectedMembership] = useState({}); // For tracking membership type
    // State variables for search input
    const [searchByMemberId, setSearchByMemberId] = useState('');
    const [searchByCompany, setSearchByCompany] = useState('');
    
    // Fetch data from the backend
    const getApplicationData = apiCaller('get', 'applications');
    // fetch application data from the backend
    useEffect(() => {
        getApplicationData.then((res) => {
            const formattedData = res?.data?.map((item) => ({
                id: item.id,
                ...item.attributes,
            }));

            // Filter out the deleted applications before setting state
            const nonDeletedApplications = formattedData?.filter((item) => !item.isDeleted);

            setApplicationDataFormat(nonDeletedApplications);
            dispatch(setApplicationData(nonDeletedApplications)); // Update Redux state with filtered data
        });
    }, [dispatch]);

    useEffect(() => {}, [applicationData]);

    // Update the approve status
    const setApprove = async (userId, status) => {
        const body = {
            data: {
                approved: status === 'Yes' ? true : false,
                mailTrigger: true,
            },
        };
        try {
            await apiCaller('put', `applications/${userId}`, body);
            setApplicationData((prevData) => prevData.map((item) => (item.id === userId ? { ...item, approved: status === 'Yes' } : item)));
            dispatch(setApplicationData(applicationData.map((item) => (item.id === userId ? { ...item, approved: status === 'Yes' } : item))));
        } catch (error) {
            console.error('Error updating approval status:', error);
        }
    };

    // Update the membership type
    const setMembershipType = async (userId, membershipType) => {
        const body = {
            data: {
                membershipType,
                mailTrigger: false,
            },
        };
        try {
            await apiCaller('put', `applications/${userId}`, body);
            setApplicationData((prevData) => prevData.map((item) => (item.id === userId ? { ...item, membershipType } : item)));
            dispatch(setApplicationData(applicationData.map((item) => (item.id === userId ? { ...item, membershipType } : item))));
        } catch (error) {
            console.error('Error updating membership type:', error);
        }
    };

    // Set default approve status
    useEffect(() => {
        if (applicationRecord && applicationRecord.length > 0) {
            const roleMap = {};
            applicationRecord.forEach((user) => {
                roleMap[user.id] = user.approved ? 'Yes' : 'No';
            });
            setDefaultStatus(roleMap);
        }
    }, [applicationRecord]);

    // Toggle dropdown function
    const toggleDropdown = (itemId, field) => {
        setOpenDropdown((prev) => ({
            ...prev,
            [itemId]: prev[itemId] === field ? null : field,
        }));
    };

    // Handle select change function
    const handleSelectChange = (itemId, field, value) => {
        if (field === 'approve') {
            setSelectedApprove((prev) => ({ ...prev, [itemId]: value }));
            setApprove(itemId, value);
        } else if (field === 'membershipType') {
            setSelectedMembership((prev) => ({ ...prev, [itemId]: value }));
            setMembershipType(itemId, value);
        }
        setOpenDropdown((prev) => ({ ...prev, [itemId]: null }));
    };

    // for close the dropdown on outside click
    // Function to handle clicks outside the dropdown popup
    const handleClickOutside = (event) => {
        const popupElement = document.getElementById('dropdown-body');
        if (popupElement && !popupElement.contains(event.target)) {
            setOpenDropdown(false);
        }
    };

    useEffect(() => {
        if (openDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

    // delete application function api

    // delete user  api call
    const deleteApplication = async (user) => {
        // console.log('user which you click to delete', user);
        if (window.confirm(`Are you sure you want to delete Application of  ${user.companyName}`)) {
            let result = await apiCaller('put', `applications/${user.id}`, {
                data: {
                    isDeleted: true,
                    approved: false,
                    mailTrigger: false,
                },
            });
            // console.log('result', result);
            if (result?.error) {
                console.log('error', result?.error);
            } else {
                let newApplicationsRecord = applicationData?.filter((u) => u?.id !== user?.id);
                setApplicationDataFormat(newApplicationsRecord);
                dispatch(setApplicationData(newApplicationsRecord));
                SuccessNotification('Application deleted successfully');
            }
        }
    };

    const columns = [
        { key: 'applicationMemberId', header: 'Member ID', render: (item) => (item?.applicationMemberId ? item?.applicationMemberId : 'Not Assigned yet') },
        { key: 'email', header: 'Email' },
        { key: 'companyName', header: 'Company Name' },
        { key: 'companyType', header: 'Company Type' },
        { key: 'companyEmail', header: 'Company Email' },
        { key: 'telephoneNumber', header: 'Number' },
        {
            key: 'view',
            header: 'View',
            render: (item) => (
                <Link href={`/apps/application/${item.id}`}>
                    <FaRegEye className="ml-2 inline-block h-5 w-5 cursor-pointer" color="blue" />
                </Link>
            ),
        },
        {
            key: 'approve',
            header: 'Approve',
            render: (item) => (
                <div className="relative text-center">
                    <button
                        className="border-none bg-transparent"
                        onClick={() => toggleDropdown(item.id, 'approve')}
                        disabled={item.approved}
                        title={item?.approved ? 'The application is approved and its status can no longer be changed.' : 'Change application status'}
                    >
                        {selectedApprove[item.id] || defaultStatus[item.id] || 'Select Approve'}
                        <span className="ml-2 text-gray-400">
                            {openDropdown[item.id] === 'approve' ? (
                                ''
                            ) : (
                                <FaEdit className={`inline-block h-5 w-5 cursor-pointer  ${item.approved ? 'text-color-gray cursor-not-allowed ' : 'text-blue-400'} `} />
                            )}
                        </span>
                    </button>
                    {openDropdown[item.id] === 'approve' && (
                        <ul id="dropdown-body" className="absolute top-full z-10 -mt-10 w-full rounded border bg-white">
                            <li onClick={() => handleSelectChange(item.id, 'approve', 'Yes')} className="cursor-pointer px-2 py-1 hover:bg-gray-100">
                                Yes
                            </li>
                            <li onClick={() => handleSelectChange(item.id, 'approve', 'No')} className="cursor-pointer px-2 py-1 hover:bg-gray-100">
                                No
                            </li>
                        </ul>
                    )}
                </div>
            ),
        },
        {
            key: 'membershipType',
            header: 'Membership Type',
            render: (item) => (
                <div className="relative text-center">
                    <button
                        className="border-none bg-transparent"
                        onClick={() => toggleDropdown(item.id, 'membershipType')}
                        disabled={item.approved}
                        title={item?.approved ? 'The application is approved and its status can no longer be changed.' : 'Change Membership'}
                    >
                        {selectedMembership[item.id] || item.membershipType || 'Select Membership Type'}
                        <span className="ml-2 text-gray-400">
                            {openDropdown[item.id] === 'membershipType' ? (
                                ''
                            ) : (
                                <FaEdit className={`inline-block h-5 w-5 cursor-pointer  ${item.approved ? 'text-color-gray cursor-not-allowed ' : 'text-blue-400'} `} />
                            )}
                        </span>
                    </button>
                    {openDropdown[item.id] === 'membershipType' && (
                        <ul id="dropdown-body" className="absolute top-full z-10 -mt-6 w-full rounded border bg-white">
                            {/* <li onClick={() => handleSelectChange(item.id, 'membershipType', 'Silver')} className="cursor-pointer px-2 py-1 hover:bg-gray-100">
                                Silver
                            </li> */}
                            <li onClick={() => handleSelectChange(item.id, 'membershipType', 'Founding')} className="cursor-pointer px-2 py-1 hover:bg-gray-100">
                                Founding
                            </li>
                            <li onClick={() => handleSelectChange(item.id, 'membershipType', 'Platinum')} className="cursor-pointer px-2 py-1 hover:bg-gray-100">
                                Platinum
                            </li>
                            <li onClick={() => handleSelectChange(item.id, 'membershipType', 'Gold')} className="cursor-pointer px-2 py-1 hover:bg-gray-100">
                                Gold
                            </li>
                        </ul>
                    )}
                </div>
            ),
        },
        {
            key: 'editApp',
            header: 'Edit App',
            render: (item) => (
                <div>
                    <Link href={`/apps/application/edit/${item.id}`}>
                        <FaEdit className="ml-2 inline-block h-5 w-5 cursor-pointer" color="blue" />
                    </Link>
                </div>
            ),
        },
        {
            key: 'deleteApp',
            header: 'Delete App',
            render: (item) => (
                <div>
                    <button onClick={() => deleteApplication(item)}>
                        <MdDelete className="ml-2 inline-block h-5 w-5 cursor-pointer" color="red" />
                    </button>
                </div>
            ),
        },
    ];

    // Search fields
    const searchFields = [
        {
            placeholder: 'Search by Member ID',
            value: searchByMemberId,
            onChange: (e) => setSearchByMemberId(e.target.value),
            icon: IconSearch,
        },
        {
            placeholder: 'Search by Company',
            value: searchByCompany,
            onChange: (e) => setSearchByCompany(e.target.value),
            icon: IconSearch,
        },
    ];

    // Filtered users based on search inputs
    const filteredUsers = dummyApplications?.filter((user) => {
        const matchesName = !searchByMemberId || (user.applicationMemberId && user.applicationMemberId.toLowerCase().includes(searchByMemberId.toLowerCase()));
        const matchesCompany = !searchByCompany || (user.companyName && user.companyName.toLowerCase().includes(searchByCompany.toLowerCase()));

        return matchesName && matchesCompany;
    });

    return (
        <div className="mx-auto p-4">
            <title>Blurred Ego | Applications</title>

            <SearchFields searchFields={searchFields} />

            <GenericTable columns={columns} data={filteredUsers} />
            <ToastContainer />
        </div>
    );
};

export default Users;
