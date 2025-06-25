'use client';
import React, { useEffect, useState } from 'react';
import GenericTable from '@/components/GenericTable';
import { apiCallerWithStatusCode } from '@/utils/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaRegEye } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import { ToastContainer } from 'react-toastify';
import { SuccessNotification, ErrorNotification } from '@/components/Toster/success';
import SearchFields from '@/components/GenericSearchComponent';
import IconSearch from '@/public/icon/icon-search';
import ApprovePopup from '../../../components/ApprovePopup';
import { MdOutlinePendingActions } from 'react-icons/md';
import { FcApproval } from 'react-icons/fc';
import { IoMdContact } from 'react-icons/io';
import { ImBackward } from 'react-icons/im';
import { isMemberManager } from '@/utils/helperFunctions';
const Participants = () => {
    const { slug } = useParams();
    const [data, setData] = useState([]);
    const [openDropdown, setOpenDropdown] = useState({});
    const [searchByEmail, setSearchByEmail] = useState('');
    const [searchByCompany, setSearchByCompany] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);

    const isManager = isMemberManager();

    const handleClickOutside = (event) => {
        const popupElement = document.getElementById('dropdown-body');
        if (popupElement && !popupElement.contains(event.target)) {
            setOpenDropdown(false);
        }
    };

    const handleDelete = async (event) => {
        console.log('event', event);

        const updatedData = {
            Registration_Data: {
                ...event,
                deleted: true,
                rejected_EmailTrigger: true,
            },
        };

        if (window.confirm('Are you sure you want to delete this Participant?')) {
            try {
                const response = await apiCallerWithStatusCode('put', `event-participants/${event.id}`, {
                    data: updatedData,
                });
                // console.log('response after delete the event', response);
                if (response.status === 200) {
                    SuccessNotification('Record deleted successfully');
                    setData(data.filter((item) => item.id !== event.id));
                }
            } catch (error) {
                console.error('Error deleting event:', error);
                ErrorNotification('Error deleting record');
            }
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

    const columns = [
        {
            field: 'id',
            header: 'ID',
            render: (params) => {
                return <span>{params?.id}</span>;
            },
        },
        {
            field: 'formalPhoto',
            header: 'Attendee Avatar',
            render: (params) => {
                return (
                    <div className="flex items-center justify-center" style={{}}>
                        {params.formalPhoto.length > 0 ? (
                            <img src={`${process.env.NEXT_PUBLIC_IMG_URL}${params?.formalPhoto}`} alt="avatar" className="h-9 w-9   rounded-full" />
                        ) : (
                            <IoMdContact size={30} />
                        )}
                    </div>
                );
            },
        },
        // {
        //     field: 'title',
        //     header: 'Title',
        //     render: (params) => {
        //         return <span>{params?.title}</span>;
        //     },
        // },
        {
            field: 'firstName',
            header: 'First Name',
            render: (params) => {
                return (
                    <span>
                        {params?.title} {params?.firstName}
                    </span>
                );
            },
        },
        {
            field: 'lastName',
            header: 'Last Name',
            render: (params) => {
                return <span>{params?.lastName}</span>;
            },
        },
        {
            field: 'registerEmail',
            header: 'Email',
            render: (params) => {
                return <span>{params?.personalEmail}</span>;
            },
        },

        {
            field: 'companyName',
            header: 'Company Name',
            render: (params) => {
                return <span>{params?.companyName}</span>;
            },
        },

        // {
        //     field: 'RegEventName',
        //     header: 'Event',
        //     render: (params) => {
        //         return <span>{params?.RegEventName}</span>;
        //     },
        // },
        {
            key: 'view',
            header: 'View',
            render: (item) => (
                <Link href={`/apps/events/view/${item.id}`}>
                    <FaRegEye className="ml-2 inline-block h-5 w-5 cursor-pointer" color="blue" />
                </Link>
            ),
        },
        {
            key: 'Edit',
            header: 'Edit',
            render: (item) => (
                <Link
                    href={`
                ${isManager ? `/apps/events/edit/${item.id}` : '#'}

                `}
                >
                    <FaEdit
                        className={`ml-2 inline-block h-5 w-5
                    ${isManager ? 'cursor-pointer text-blue-600' : 'cursor-not-allowed text-gray-400'}`}
                        title={`${isManager ? 'Edit Event' : 'You do not have permission to edit events'}`}
                    />
                </Link>
            ),
        },

        {
            key: 'approve',
            header: 'Approve Status',
            render: (item) => (
                // now i want to open a component on click of this button and pass the item to that component
                <div className="relative text-center">
                    <div
                        className={`popup ${isManager ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={() => {
                            if (isManager) {
                                setOpenPopup(true);
                                setSelectedItem(item);
                            }
                        }}
                        title={isManager ? '' : 'You do not have permission to update status'}
                    >
                        {item.approved === 'Yes' ? 'Approved' : 'Pending'}

                        {item.approved === 'Yes' ? <FcApproval className="inline-block h-5 w-5 text-green-400" /> : <MdOutlinePendingActions className="inline-block h-5 w-5 text-blue-400" />}
                    </div>
                </div>
            ),
        },
        ,
        {
            key: 'action',
            header: 'Action',
            render: (item) => (
                <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => 
                      isManager &&  handleDelete(item) }>
                        <RiDeleteBinLine 
                        // title="Delete Record"
                        className={`ml-2 inline-block h-5 w-5
                        ${isManager ? 'cursor-pointer text-red-600' : 'cursor-not-allowed text-gray-400'}`}
                          title={`${isManager ? 'Delete Record' : 'You do not have permission to delete events'}`}
                          />
                    </button>
                </div>
            ),
        },
    ];

    const getParticipants = async () => {
        try {
            const response = await apiCallerWithStatusCode('get', `event-participants?filters[RegEventName][$eq]=${slug}&populate=*`);

            if (response.status === 200) {
                // Map the data to extract attributes
                // console.log('response.data.data', response.data.data);
                const transformedData = response.data.data
                    .map((item) => ({
                        id: item.id,
                        RegEventName: item.attributes.RegEventName,
                        registerEmail: item.attributes.registered_Email,
                        event_taking_id: item.attributes.event_taking_id,
                        ...item.attributes.Registration_Data,
                    }))
                    .filter((item) => !item.deleted);
                // console.log('Transformed data:', transformedData);
                setData(transformedData);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            ErrorNotification('Error fetching records');
        }
    };

    useEffect(() => {
        getParticipants();
    }, [openPopup]);

    const searchFields = [
        {
            placeholder: 'Search Member by Email',
            value: searchByEmail,
            onChange: (e) => setSearchByEmail(e.target.value),
            icon: IconSearch,
        },
        {
            placeholder: 'Search by Company Name',
            value: searchByCompany,
            onChange: (e) => setSearchByCompany(e.target.value),
            icon: IconSearch,
        },
    ];

    const filteredParticipants = data.filter((participant) => {
        const matchesEmail = participant?.personalEmail?.toLowerCase().includes(searchByEmail.toLowerCase());
        const matchesCompany = participant?.companyName?.toLowerCase().includes(searchByCompany.toLowerCase());
        return matchesEmail && matchesCompany;
    });

    return (
        <>
            <Link href={`/apps/events`} className="btn btn-blue mb-10 w-fit gap-2 px-3 py-1">
                <ImBackward className="inline-block h-4 w-4" />
                Back
            </Link>
            <title>Event Participants</title>
            <div className="flex justify-between gap-2   max-lg:flex-col">
                <h1 className="color-brand-1 text-4xl font-bold">Participants </h1>
                <SearchFields searchFields={searchFields} />
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <GenericTable columns={columns} data={filteredParticipants} />
            </div>

            {/* Render the popup if open */}
            {openPopup && selectedItem && (
                <ApprovePopup
                    item={selectedItem}
                    //   onApprove={handleApprovalAction}
                    onCancel={() => setOpenPopup(false)}
                    event_name_reg={slug}
                />
            )}

            <ToastContainer />
        </>
    );
};

export default Participants;
