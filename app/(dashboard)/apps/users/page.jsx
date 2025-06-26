'use client';
import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
// import { useSelector, useDispatch } from 'react-redux';
import { setUsers } from '@/store/usersSlice';
import { apiCaller } from '@/utils/api';
import UsersFormPopup from '../../components/usersFormPopUp';
import GenericTable from '@/components/GenericTable';
import { ToastContainer } from 'react-toastify';
import { SuccessNotification } from '@/components/Toster/success';
import countryMapping from '@/components/countryNamesData';
import IconSearch from '@/public/icon/icon-search';
import SearchFields from '@/components/GenericSearchComponent';
import { dummyUsers } from '@/Data/user';
const Users = () => {
    // const usersRecord = useSelector((state) => state?.users?.users) || [];
    // const dispatch = useDispatch();

    // State variables for search input
    const [searchByName, setSearchByName] = useState('');
    const [searchByCompany, setSearchByCompany] = useState('');

    // console.log('usersRecord', usersRecord);

    // local state variables for dropdowns
    const [defaultRole, setDefaultRole] = useState({});
    const [selectedRole, setSelectedRole] = useState({});
    const [selectedComments, setSelectedComments] = useState({});
    const [openDropdown, setOpenDropdown] = useState({});
    const [show, setShow] = useState(false);
    const [showSuccessUserCreated, setShowSuccessUserCreated] = useState(false); // show success message

    // setTimeout to hide success message after 5 seconds of true the showSuccessUserCreated
    useEffect(() => {
        if (showSuccessUserCreated) {
            setTimeout(() => {
                setShowSuccessUserCreated(false);
            }, 5000);
        }
    }, [showSuccessUserCreated]);

    // toggle dropdown function
    const toggleDropdown = (userId, field) => {
        setOpenDropdown((prev) => ({
            ...prev,
            [userId]: prev[userId] === field ? null : field,
        }));
    };
    // select change handler function
    const handleSelectChange = (userId, field, value) => {
        if (field === 'role') {
            setSelectedRole((prev) => ({ ...prev, [userId]: value }));
            setRole(userId, value);
        } else if (field === 'comments') {
            setSelectedComments((prev) => ({ ...prev, [userId]: value }));
        }
        setOpenDropdown((prev) => ({ ...prev, [userId]: null }));
    };

    // update comments handler function
    // const handleKeyPress = async (e, userId) => {
    //     if (e.key === 'Enter') {
    //         const newComment = e.target.value;

    //         try {
    //             let result = await apiCaller('put', `users/${userId}`, {
    //                 comments: newComment,
    //             });

    //             if (result?.err) {
    //                 console.log('error', result?.err);
    //             } else {
    //                 const updatedUsers = usersRecord.map((user) => (user.id === userId ? { ...user, comments: newComment } : user));
    //                 dispatch(setUsers(updatedUsers));

    //                 setOpenDropdown((prev) => ({
    //                     ...prev,
    //                     [userId]: null,
    //                 }));
    //             }
    //         } catch (error) {
    //             console.error('Error updating comments:', error);
    //         }
    //     }
    // };
    // delete user  api call
    const deleteUser = async (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.fullName}`)) {
            let result = await apiCaller('put', `users/${user?.id}`, {
                isDeleted: true,
            });
            if (result?.err) console.log('error', result?.err);
            else {
                // let newUsers = usersRecord?.filter((u) => u?.id !== user?.id);
                // // showMessage('User deleted successfully');
                // dispatch(setUsers(newUsers));
                // SuccessNotification('User deleted successfully');
            }
        }
    };

    // set role
    const setRole = async (userId, role) => {
        const body = {
            memberManager: role === 'Admin',
            // governor: role === 'governor',
            regular: role === 'Member',

            hasManagementRole: role === 'Management',
        };

        // let result = await apiCaller('put', `users/${userId}`, body);
    };

    // set default role
    // useEffect(() => {
    //     if (usersRecord && usersRecord.length > 0) {
    //         const roleMap = {};
    //         usersRecord.forEach((user) => {
    //             if (user.regular) {
    //                 roleMap[user.id] = 'Member';
    //             } else if (user.memberManager) {
    //                 roleMap[user.id] = 'Admin';
    //             } else if (user.hasManagementRole) {
    //                 roleMap[user.id] = 'Management';
    //             }
    //         });
    //         setDefaultRole(roleMap);
    //     }
    // }, [usersRecord]);

    const getCountryName = (code) => {
        return countryMapping[code?.toUpperCase()] || 'Unknown Country'; // Default to 'Unknown Country' if the code is not found
    };

    //  table data and columns
    const columns = [
        { key: 'id', header: 'ID' },
        { key: 'fullName', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'phoneNumber', header: 'Number' },
        { key: 'city', header: 'City' },
        {
            key: 'country',
            header: 'Country',

            render: (item) => {
                return <>{getCountryName(item.country)}</>;
            },
        },
        { key: 'Blurred EgoMemberReferId', header: 'Referred', render: (user) => (user.BlurredEgo?.MemberReferId ? `${user.BlurredEgoMemberReferId}` : 'N/A') },
        {
            key: 'verified',
            header: 'Verified',
            render: (user) => (user.confirmed ? 'Yes' : 'No'),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (user) => (
                <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => deleteUser(user)}>
                        <RiDeleteBinLine className="inline-block h-5 w-5 cursor-pointer text-red-500" />
                    </button>
                </div>
            ),
        },
        {
            key: 'role',
            header: 'Role',
            render: (user) => (
                <div className="relative text-center">
                    <button className="border-none bg-transparent" onClick={() => toggleDropdown(user.id, 'role')}>
                        {selectedRole[user.id] || defaultRole[user.id] || 'Select Role'}
                        <span className="ml-2 text-gray-400">{openDropdown[user.id] === 'role' ? '' : <FaEdit className="inline-block h-5 w-5 cursor-pointer text-blue-400" />}</span>
                    </button>
                    {openDropdown[user.id] === 'role' && (
                        <ul id="dropdown-body" className="absolute top-full z-10 -mt-10 w-full rounded border bg-white">
                            <li onClick={() => handleSelectChange(user.id, 'role', 'Admin')} className="cursor-pointer px-2 py-1 hover:bg-gray-100">
                                Admin
                            </li>
                            <li onClick={() => handleSelectChange(user.id, 'role', 'Management')} className="cursor-pointer px-2 py-1 hover:bg-gray-100">
                                Management
                            </li>
                            <li onClick={() => handleSelectChange(user.id, 'role', 'Member')} className="cursor-pointer px-2 py-1 hover:bg-gray-100">
                                Member
                            </li>
                        </ul>
                    )}
                </div>
            ),
        },

        {
            key: 'comments',
            header: 'Comments',
            render: (user) => (
                <div className="relative  flex text-wrap">
                    {openDropdown[user.id] === 'comments' ? (
                        <input
                            id="dropdown-body"
                            defaultValue={user.comments}
                            // onKeyPress={(e) => handleKeyPress(e, user.id)}
                            className="block w-full rounded border bg-gray-50 px-2 py-1.5 text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-gray-500"
                            autoFocus
                        />
                    ) : (
                        <>
                            {user.comments || <div className="text-nowrap">Add comment</div>}
                            <button className="ml-2" onClick={() => toggleDropdown(user.id, 'comments')}>
                                <FaEdit className="inline-block h-5 w-5 cursor-pointer text-blue-400" />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
        // {
        //     key: 'edit',
        //     header: 'Edit User',
        //     render: (user) => (
        //         <div className="flex items-center justify-center space-x-2">
        //             <Link  href={`/apps/users/edit/${user.id}`} >
        //                 <FaEdit className="inline-block h-5 w-5 cursor-pointer text-blue-400" />
        //             </Link>
        //         </div>
        //     ),
        // }
    ];

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

    // Search fields
    const searchFields = [
        {
            placeholder: 'Search by Name',
            value: searchByName,
            onChange: (e) => setSearchByName(e.target.value),
            icon: IconSearch,
        },
        {
            placeholder: 'Search by Email',
            value: searchByCompany,
            onChange: (e) => setSearchByCompany(e.target.value),
            icon: IconSearch,
        },
    ];
    // Filtered users based on search inputs
    const filteredUsers =
        dummyUsers.length > 0
            ? dummyUsers.filter((user) => {
                  const matchesName = user.fullName?.toLowerCase().includes(searchByName.toLowerCase());
                  const matchesCompany = user.email?.toLowerCase().includes(searchByCompany.toLowerCase());
                  return matchesName && matchesCompany;
              })
            : [];

    return (
        <div>
            <title>Blurred Ego | Users</title>

            <div className="mt-4">
                <SearchFields searchFields={searchFields} />

                <div className="mb-2 flex justify-end">
                    <button onClick={() => setShow(true)} className="rounded-md bg-primary px-4 py-2 text-white ">
                        Add User
                    </button>
                </div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <GenericTable columns={columns} data={filteredUsers} />
                </div>
            </div>
            {/* // UsersFormPopup component */}

            <UsersFormPopup show={show} setShow={setShow} setShowSuccessUserCreated={setShowSuccessUserCreated} />

            {/* <UsersFormPopup  show={show} setShow={setShow} setShowSuccessUserCreated={setShowSuccessUserCreated} /> */}

            {
                // show success message
                showSuccessUserCreated && (
                    <div
                        className="wow animate__animated animate__fadeInDown animate__faster absolute right-0 
                    top-0 mr-4 mt-4 "
                    >
                        <div className="flex items-center rounded-md bg-green-500 p-3 text-white shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-3 h-6 w-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>User created successfully</span>
                        </div>
                    </div>
                )
            }
            <ToastContainer />
        </div>
    );
};

export default Users;
