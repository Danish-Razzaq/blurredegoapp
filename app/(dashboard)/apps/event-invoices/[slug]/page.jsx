'use client';

import React, { useEffect, useState } from 'react';
import GenericTable from '@/components/GenericTable';
import { apiCallerWithStatusCode, fetchSponsorshipFields } from '@/utils/api';
import { RiDeleteBinLine } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import { FaEdit, FaRegEye } from 'react-icons/fa';
import { handleInvoiceDownload } from '@/components/DownloadEventInvoiceButton';
import { getUser } from '@/utils/helperFunctions';
import { useParams } from 'next/navigation';
import { ErrorNotification, SuccessNotification } from '@/components/Toster/success';
import IconSearch from '@/public/icon/icon-search';
import SearchFields from '@/components/GenericSearchComponent';
import { ImBackward } from 'react-icons/im';
import CustomInvoiceModel from '../../../components/CustomInvoiceModel';
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import {isMemberManager} from "@/utils/helperFunctions";
import NotFound from '@/app/not-found';
import {dummyEventInvoices  } from '@/Data/eventinvoice'; // Import dummy data for testing
const InvoicesPage = () => {
    const { slug } = useParams();
    const [invoices, setInvoices] = useState(dummyEventInvoices); // Initialize with dummy data for testing
       const [show, setShow] = useState(false);
    const [searchByCompanyEmail, setSearchByNameCompanyEmail] = useState('');
    const [searchByCompany, setSearchByCompany] = useState('');
    const [searchByInvoiceId, setSearchByInvoiceId] = useState('');
    const [sponsorshipFields, setSponsorshipFields] = useState([]);
    const [eventId, setEventId] = useState(null);
    const [showCreateNotification, setShowCreateNotification] = useState(false);
    // console.log('invoices state data', invoices);


    // for protecting the route of invoice only show to admin
    //  if(!isMemberManager()) {
    //     return <NotFound />;
    // }


 
    const formatDataForInvoice = (data, slug) => {
        return data
            .filter((entry) => entry.attributes?.RegEventName === slug && entry.attributes?.Invoice_data)
            .map((entry) => {
                const { id, attributes } = entry;
                const { Invoice_data, RegEventName, createdAt, Registration_Data, updatedAt } = attributes || {};

                return {
                    id,
                    RegEventName,
                    createdAt,
                    updatedAt,
                    Registration_Data,
                    ...Object.keys(Invoice_data || {}).reduce((acc, key) => {
                        if (key === 'discount' || key === 'invoiceAmount' || key === 'bankFees') {
                            acc[key] = Invoice_data[key] || 0;
                        } else {
                            acc[key] = Invoice_data[key];
                        }
                        return acc;
                    }, {}),
                };
            });
    };

    useEffect(() => {
        const getSponsorshipFields = async () => {
            const fields = await apiCallerWithStatusCode('get', `events?filters[event_name]=${slug}&populate=*`);
            setSponsorshipFields(fields?.data?.data[0]?.attributes);
            setEventId(fields?.data?.data[0]?.id);
        };

        getSponsorshipFields();
    }, []);

    const getInvoices = async () => {
        try {
            const result = await apiCallerWithStatusCode('get', 'event-participants');
            if (result?.data) {
                const formattedData = formatDataForInvoice(result.data.data, slug);

                setInvoices(formattedData);
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    
    useEffect(() => {
        getInvoices();
    }, []);

  
    useEffect(() => {
        if (showCreateNotification) {
            getInvoices();
            setShowCreateNotification(false);
        }
    }, [showCreateNotification]);

    // console.log('invoices', invoices);
    // console.log('showCreateNotification', showCreateNotification);


    const deleteInvoice = async (invoice) => {
        if (!window.confirm('Are you sure you want to delete this Invoice?')) return;

        // Prepare the updated invoice data for deletion
        const updatedData = {
            ...invoice,
            ...(invoice.Registration_Data !== null && {
                Registration_Data: {
                    ...invoice.Registration_Data,
                    approved: 'No',
                    mailTrigger: false,
                },
            }),
            Invoice_data: null, // Remove invoice data
        };

        // Prepare the updated event sponsorship fields
        const sponsorshipFieldsTable = sponsorshipFields?.event_sponsorship_fields?.filter((field) => {
            const invoiceSponsorshipKeys = Object.keys(invoice?.sponsorships || {});
            return invoiceSponsorshipKeys.includes(field?.name);
        });

        const updatedDataOfEvent = {
            ...sponsorshipFields,
            event_banner_image: sponsorshipFields?.event_banner_image?.id,
            event_sponsorship_fields: sponsorshipFields?.event_sponsorship_fields?.map((field) => {
                const isFieldMatched = sponsorshipFieldsTable?.some((matchedField) => matchedField.name === field.name);

                if (isFieldMatched) {
                    const isPaid = field.reservedBy[invoice.companyName]?.paymentStatus === 'paid';
                    const validPaymentStatuses = field?.reservedBy
                        ? Object?.values(field?.reservedBy).filter((entry) => entry.paymentStatus === 'paid' || entry.paymentStatus === 'pending').length
                        : null;
                    //   console.log('validPaymentStatuses', validPaymentStatuses)

                    return {
                        ...field,
                        paidCount: isPaid ? field.paidCount - 1 : field.paidCount, // Decrement paidCount if the company payment status was 'paid'
                        status: validPaymentStatuses === 1 ? 'available' : field.status, // Update status to 'reserved' if the company was paid
                        reservedBy: {
                            ...field.reservedBy,
                            [invoice.companyName]: undefined, // Remove the company data
                        },
                    };
                }

                return field; // Return original field if not matched
            }),
        };

        try {
            // Update the event object if sponsorship fields exist
            if (sponsorshipFieldsTable && sponsorshipFieldsTable.length > 0) {
                const updatedEventResult = await apiCallerWithStatusCode('put', `events/${eventId}`, {
                    data: updatedDataOfEvent,
                });
                if (updatedEventResult?.err) {
                    console.log('Error updating event:', updatedEventResult.err);
                }
            }

            // Update the invoice data
            const response = await apiCallerWithStatusCode('put', `event-participants/${invoice.id}`, {
                data: updatedData,
            });

            if (response.status === 200) {
                SuccessNotification('Invoice deleted successfully');
                setInvoices(invoices.filter((item) => item.id !== invoice.id));
            }
        } catch (error) {
            console.error('Error deleting invoice:', error);
            ErrorNotification('Error deleting Invoice');
        }
    };

    const updateReceive = async (invoice, value) => {
        if (window.confirm(`Are you sure you want to update Invoice Received status?`)) {
            if (value !== 'yes') return;
            // console.log('currentDateTime', currentDateTime);
            const currentDateTime = new Date().toISOString();
            const { Registration_Data, ...restInvoiceData } = invoice; // Exclude Registration_Data

            const updateData = {
                ...restInvoiceData,
                invoice_received: true,
                invoice_Payment_Received_Date: currentDateTime,
                invoice_mcMailTrigger: true,
            };
            const sponsorshipFieldsTable = sponsorshipFields?.event_sponsorship_fields?.filter((field) => {
                const invoiceSponsorshipKeys = Object.keys(invoice?.sponsorships || {});
                return invoiceSponsorshipKeys.includes(field?.name);
            });

            // Update the data with the required changes
            const updatedDataOfEvent = {
                ...sponsorshipFields,
                event_banner_image: sponsorshipFields?.event_banner_image?.id,
                event_sponsorship_fields: sponsorshipFields?.event_sponsorship_fields?.map((field) => {
                    // Check if the field exists in the filtered sponsorshipFieldsTable
                    const isFieldMatched = sponsorshipFieldsTable?.some((matchedField) => matchedField.name === field.name);

                    if (isFieldMatched) {
                        const wasPaid = Object.values(field.reservedBy || {}).filter((company) => company.paymentStatus === 'paid').length;

                        const isNowPaid = field.reservedBy[invoice.companyName]?.paymentStatus === 'pending' ? 1 : 0;

                        return {
                            ...field,
                            status: 'paid', // Update status to 'paid'
                            paidCount: wasPaid + isNowPaid, // Increment paidCount if the item is approved
                            reservedBy: {
                                ...field.reservedBy,
                                ...(field.reservedBy && invoice?.companyName
                                    ? {
                                          [invoice.companyName]: {
                                              ...field.reservedBy[invoice.companyName],
                                              paymentStatus: field.reservedBy[invoice.companyName]?.paymentStatus === 'pending' ? 'paid' : field.reservedBy[invoice.companyName]?.paymentStatus,
                                          },
                                      }
                                    : {}),
                            },
                        };
                    }

                    // Return the original field if it doesn't match
                    return field;
                }),
            };

            if (sponsorshipFieldsTable && sponsorshipFieldsTable.length > 0) {
                try {
                    const updatedEventResult = await apiCallerWithStatusCode('put', `events/${eventId}`, {
                        data: updatedDataOfEvent,
                    });
                    if (updatedEventResult?.err) console.log('Error updating event:', updatedEventResult.err);
                } catch (error) {
                    console.error('Error during API call Event update Invoice Received:', error);
                }
            } else {
                console.log('No sponsorships selected. Skipping API update.');
            }

            const result = await apiCallerWithStatusCode('put', `event-participants/${invoice.id}`, {
                data: {
                    Invoice_data: updateData,
                },
            });

            if (result?.err) console.log('error', result?.err);
            else {
                let fi = invoices?.find((u) => u?.id !== invoice?.id);
                let newInvoices = [...invoices];
                if (fi !== -1) newInvoices[fi] = result.data;
                // console.log('newInvoices', newInvoices);
                setInvoices(newInvoices);
                // Disable the dropdown
                document.getElementById(`sentToReceived_${invoice.id}`).disabled = true;
            }
        }
    };

    const ReceiveOptionLoader = (invoice) => {
        let selected = { selected: true };
        if (invoice?.invoice_received) selected = {};
        return [
            <option value="yes">Yes</option>,
            <option value="no" {...selected}>
                No
            </option>,
        ];
    };
    const SentToMemberOptionLoader = (invoice) => {
        let selected = { selected: true };
        if (invoice?.sentToEventInvoice) selected = {};
        return [
            <option value="yes">Yes</option>,
            <option value="no" {...selected}>
                No
            </option>,
        ];
    };

    const updateSentToMember = async (invoice, value) => {
        // console.log('invoice inside update member', invoice);
        if (window.confirm(`Are you sure you want to update Invoice Approve status?`)) {
            if (value !== 'yes') return;
         
             document.getElementById(`sentToMember_${invoice.id}`).disabled = true;

            const user = getUser();

            handleInvoiceDownload(invoice?.id, invoice?.email, user?.jwt, invoice?.id);
        }
    };

    const searchFields = [
        {
            placeholder: 'Search Member by Email',
            value: searchByCompanyEmail,
            onChange: (e) => setSearchByNameCompanyEmail(e.target.value),
            icon: IconSearch,
        },
        {
            placeholder: 'Search by Company Name',
            value: searchByCompany,
            onChange: (e) => setSearchByCompany(e.target.value),
            icon: IconSearch,
        },
        {
            placeholder: 'Search by Invoice ID',
            value: searchByInvoiceId,
            onChange: (e) => setSearchByInvoiceId(e.target.value),
            icon: IconSearch,
        },
    ];

    const columns = [
        { field: 'invoiceId', header: 'Invoice ID', width: 150, render: (params) => <span>{params?.invoiceId}</span>, filterable: true },
        // {
        //     field: 'RegEventName',
        //     header: 'Event Name',
        //     width: 200,
        //     render: (params) => <span>{params?.RegEventName}</span>,
        // },
        {
            field: 'createdAt',
            header: 'Date Created',
            width: 200,
            render: (params) => <span>{params?.createdAt.split('T')[0]}</span>,
        },
        {
            field: 'name',
            header: 'Name',
            width: 200,
            render: (params) => <span>{params?.name}</span>,
        },
        {
            field: 'email',
            header: 'Email',
            width: 200,
            render: (params) => <span>{params?.email}</span>,
        },
        {
            field: 'companyName',
            header: 'Company Name',
            width: 200,
            render: (params) => <span>{params?.companyName}</span>,
        },
        {
            field: 'invoiceAmount',
            header: 'Amount (USD)',
            width: 200,
            render: (params) => <span>   <p className="inline-block text-[17px] text-green-500">$</p>{params?.invoiceAmount + (params?.bankFees || 0)}</span>,
        },
        {
            field: 'view',
            header: 'View',
            width: 200,
            render: (params) => (
                <Link href={`/components/eventInvoice/preview/${params?.id}`} legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer">
                        <FaRegEye className="ml-2 inline-block h-5 w-5 cursor-pointer" color="blue" />
                    </a>
                </Link>
            ),
        },

        {
            field: 'edit',
            header: 'Edit',
            width: 200,
            render: (params) => {
                const isDisabled = params?.sentToEventInvoice || params?.invoice_received;
                return (
                    <div title={`${isDisabled ? 'Invoice Sent, Not Changeable' : 'Edit'}`}>
                        {isDisabled ? (
                            // Show disabled icon without a link
                            <FaEdit className="ml-2 inline-block h-5 w-5 text-gray-400 cursor-not-allowed" />
                        ) : (
                            // Enable the link when not disabled
                            <Link href={`/apps/event-invoices/edit/${params?.id}`}>
                                <FaEdit className="ml-2 inline-block h-5 w-5 cursor-pointer text-orange-500 hover:text-orange-600" />
                            </Link>
                        )}
                    </div>
                );
            },
        },
        
        {
            field: 'sentToEventInvoice',
            header: 'Invoice Approve',
            width: 200,
            render: (params) => {
                return (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px',
                            alignItems: 'center',
                        }}
                    >
                        <select
                            name=""
                            id={`sentToMember_${params?.id}`}
                            className="selection_box"
                            onChange={(e) => updateSentToMember(params, e.target.value)}
                            disabled={params?.sentToEventInvoice || params?.invoice_received}
                        >
                            {SentToMemberOptionLoader(params)}
                        </select>
                    </div>
                );
            },
        },

        {
            field: 'received',
            header: 'Received',
            width: 200,
            render: (params) => {
                // return <span>{attributes?.received ? "Yes" : "No"}</span>;
                return (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            gap: '20px',
                            alignItems: 'center',
                        }}
                    >
                        <select name="" id={`sentToReceived_${params?.id}`} className="selection_box" onChange={(e) => updateReceive(params, e.target.value)} disabled={params?.invoice_received}>
                            {ReceiveOptionLoader(params)}
                        </select>
                    </div>
                );
            },
        },

        {
            field: 'invoice_Payment_Received_Date',
            header: 'Payment Received Date',
            width: 200,
            render: (params) => {
                const paymentDate = params?.invoice_Payment_Received_Date;
                if (!paymentDate) {
                    return <span>N.A</span>;
                }
                const date = new Date(paymentDate);
                const formattedDate = date.toLocaleDateString();
                return <span>{formattedDate}</span>;
            },
        },

        {
            field: 'action',
            header: 'Action',
            width: 150,
            render: (params) => {
                return (
                    <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => deleteInvoice(params)}>
                            <RiDeleteBinLine className="inline-block h-5 w-5 cursor-pointer text-red-500" />
                        </button>
                    </div>
                );
            },
        },
    ];

    // Filtered users based on search inputs
    const filteredInvoices = invoices?.filter((invoice) => {
        const matchesName = invoice?.email?.toLowerCase().includes(searchByCompanyEmail.toLowerCase());
        const matchesInvoiceId = invoice?.invoiceId?.toLowerCase().includes(searchByInvoiceId.toLowerCase());
        const matchesCompany = invoice?.companyName?.toLowerCase().includes(searchByCompany.toLowerCase());
        return matchesName && matchesCompany && matchesInvoiceId;
    });

    return (
        <div>
            <title>Event Invoices</title>
            <Link href={`/apps/events`} className="btn btn-blue mb-10 w-fit gap-2 px-3 py-1">
                <ImBackward className="inline-block h-4 w-4" />
                Back
            </Link>
            <div className="flex justify-between gap-2   max-lg:flex-col">
                <h1 className="color-brand-1 text-nowrap text-4xl font-bold">Event Invoices </h1>
                <SearchFields searchFields={searchFields} />
            </div>
            <div className="mb-2 flex justify-end">
                <button onClick={() => setShow(true)} className="rounded-md  font-semibold bg-primary px-4 py-2 flex items-center gap-1 text-white">
                  <LiaFileInvoiceDollarSolid size={22}/>  Create Custom Invoice
                </button>
            </div>
            <div className="mt-4">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <GenericTable columns={columns} data={filteredInvoices} />
                </div>
            </div>


            
           {
            show && <CustomInvoiceModel  onCloseModel={()=>setShow(false)} invoices={invoices} eventName={slug} setShowCreateNotification={setShowCreateNotification} CUSINVFOR={'EVENTINVOICE'}  />
           }

            <ToastContainer />
        </div>
    );
};

export default InvoicesPage;
