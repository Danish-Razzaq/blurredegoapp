'use client';

import React, { useEffect, useState } from 'react';
import GenericTable from '@/components/GenericTable';
import { apiCaller } from '@/utils/api';
import { RiDeleteBinLine } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import { FaEdit, FaRegEye } from 'react-icons/fa';
import { handleDownload } from '@/components/DownloadInvoiceButton';
import { getUser } from '@/utils/helperFunctions';
import IconSearch from '@/public/icon/icon-search';
import SearchFields from '@/components/GenericSearchComponent';
import CustomInvoiceModel from '../../components/CustomInvoiceModel';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import {dummyInvoices  } from '@/Data/invoice';
const InvoicesPage = () => {
    const [invoices, setInvoices] = useState(dummyInvoices); // Initialize with dummy data
    // console.log('invoices', invoices);
    const [show, setShow] = useState(false);
    // State variables for search input
    const [searchByName, setSearchByName] = useState('');
    const [searchByCompany, setSearchByCompany] = useState('');
    const [searchByInvoiceId, setSearchByInvoiceId] = useState('');
    const [showCreateNotification, setShowCreateNotification] = useState(false);

    const getInvoices = async () => {
        let result = await apiCaller('get', 'invoices?populate=*');
        if (result.err) console.log('Err getting invoices', result.err);
        else if (result.data) {
            // console.log('getInvoices'); // DEBUG
            // console.log(result); // DEBUG
            setInvoices(result.data);
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

    const columns = [
        { field: 'id', header: 'ID', width: 150, render: (params) => <span>{params?.id}</span>, filterable: true },
        {
            field: 'invoiceUID',
            header: 'Invoice ID',
            width: 200,
            filterable: true,
            render: (params) => <span>{params?.attributes?.invoiceId}</span>,
        },
        {
            field: 'name',
            header: 'Name',
            width: 200,
            filterable: true,
            render: (params) => <span>{params?.attributes?.name}</span>,
        },

        {
            field: 'createdAtInvoice',
            header: 'Date Created',
            width: 200,
            render: (params) => <span>{params?.attributes?.createdAt.split('T')[0]}</span>,
        },

        {
            field: 'companyEmail',
            header: 'Company Name',
            width: 200,
            render: (params) => <span>{params?.attributes?.companyName}</span>,
        },
        //     {
        //       id: "amount",
        //       label: "Amount",
        //       accessor: (row, col) => {
        //         return <span>{attributes?.amount}</span>;
        //       },
        {
            field: 'amount',
            header: 'Amount (USD)',
            width: 200,
            render: (params) => {
                const amount = Number(params?.attributes?.amount) || 0;
                const discount = Number(params?.attributes?.discount) || 0;
                const registrationFees = params?.attributes?.Invoice_data?.isCustomInvoice ? params?.attributes?.Invoice_data?.bankFees : 50;
                const totalAmount = amount + registrationFees - discount; // show the total invoice amount
                return (
                    <span>
                        <p className="inline-block text-[17px] text-green-500">$</p>
                        {totalAmount}
                    </span>
                );
            },
        },
        {
            field: 'view',
            header: 'View',
            width: 200,
            render: (params) => (
                <Link href={`invoice/${params?.id}`} legacyBehavior>
                    <a className=" " target="_blank" rel="noopener noreferrer">
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
                const isDisabled = params?.attributes?.sentToMember || params?.attributes?.received;
                return (
                    <div title={`${isDisabled ? 'Invoice Sent, Not Changeable' : 'Edit'}`}>
                        {isDisabled ? (
                            // Show disabled icon without a link
                            <FaEdit className="ml-2 inline-block h-5 w-5 text-gray-400 cursor-not-allowed" />
                        ) : (
                        // Enable the link when not disabled
                        <Link href={`invoice/edit/${params?.id}`}>
                            <FaEdit className="ml-2 inline-block h-5 w-5 cursor-pointer text-orange-500 hover:text-orange-600" />
                        </Link>
                         )} 
                    </div>
                );
            },
        },
        {
            field: 'sentToMember',
            header: 'Invoice Approve',
            width: 200,
            render: (params) => {
                return (
                    <select
                        name=""
                        id={`sentToMember_${params.id}`}
                        className="selection_box"
                        onChange={(e) => updateSentToMember(params, e.target.value)}
                        disabled={params?.attributes?.sentToMember}
                        title={params?.attributes?.sentToMember ? 'The Invoice is issued and its status can no longer be changed !!' : 'Change the status'}
                    >
                        {SentToMemberOptionLoader(params)}
                    </select>
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
                    <select
                        name=""
                        id=""
                        className="selection_box"
                        onChange={(e) => updateReceive(params, e.target.value)}
                        disabled={params?.attributes?.received}
                        title={params?.attributes?.received ? 'The Invoice is received and its status can no longer be changed !!' : 'Change the status'}
                    >
                        {ReceiveOptionLoader(params)}
                    </select>
                );
            },
        },

        {
            field: 'membershipExpiry',
            header: 'Membership Expiry',
            width: 200,
            render: (params) => {
                if (!params?.attributes?.membershipExpiry) {
                    return <span>N/A</span>;
                }
                // const currentExpiryDate = new Date(params?.attributes?.membershipExpiry);
                // const nextYearExpiryDate = new Date(currentExpiryDate.setFullYear(currentExpiryDate.getFullYear() + 1)).toISOString().split('T')[0]; // Calculate next year expiry
                return <span>{params?.attributes?.membershipExpiry}</span>;
            },
        },

        {
            field: 'action',
            header: 'Action',
            width: 150,
            render: (params) => {
                return (
                    <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => deleteInvoice(params)} title="Delete Invoice">
                            <RiDeleteBinLine className="inline-block h-5 w-5 cursor-pointer text-red-500" />
                        </button>
                    </div>
                );
            },
        },
    ];
    // delete invoice  api call
    const deleteInvoice = async (invoice) => {
        if (window.confirm(`Are you sure you want to delete`)) {
            let result = await apiCaller('put', `invoices/${invoice.id}`, {
                data: { isDeleted: true, mcMailTrigger: false, invoiceMailTrigger: false, pdfEmail: false },
            });
            if (result?.err) console.log('error', result?.err);
            else {
                let newInvoices = invoices?.filter((u) => u?.id !== invoice?.id);
                // showMessage('User deleted successfully');
                setInvoices(newInvoices);
                // SuccessNotification('Invoice deleted successfully');
            }
        }
    };
    // const SuccessNotification = (msg) =>
    //     toast.success(msg, {
    //         position: 'top-right',
    //         autoClose: 5000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: 'light',
    //     });

    const updateReceive = async (invoice, value) => {
        if (window.confirm(`Are you sure you want to mark the invoice as received?`)) {
            // console.log('currentDateTime', currentDateTime);
            const currentDateTime = new Date().toISOString();
            let result = await apiCaller('put', `invoices/${invoice.id}`, {
                data: { received: value === 'yes' ? true : false, mcMailTrigger: true, pdfEmail: false, invoiceMailTrigger: false, Payment_Received_Date: value === 'yes' ? currentDateTime : null },
            });
            if (result?.err) console.log('error', result?.err);
            else {
                let invoiceIndex = invoices.findIndex((u) => u.id === invoice.id);

                if (invoiceIndex !== -1) {
                    let newInvoices = [...invoices];
                    newInvoices[invoiceIndex] = result.data;
                    setInvoices(newInvoices);
                }
            }
        }
    };

    const updateSentToMember = async (invoice, value) => {
        if (window.confirm(`Are you sure you want to approve the invoice?`)) {
            if (value !== 'yes') return;

            document.getElementById(`sentToMember_${invoice.id}`).disabled = true;

            const user = getUser();

            handleDownload(invoice?.id, invoice?.attributes.email, user?.jwt);
        }
    };

    const ReceiveOptionLoader = (invoice) => {
        let selected = { selected: true };
        if (invoice.attributes.received) selected = {};
        return [
            <option value="yes">Yes</option>,
            <option value="no" {...selected}>
                No
            </option>,
        ];
    };

    const SentToMemberOptionLoader = (invoice) => {
        let selected = { selected: true };
        if (invoice.attributes.sentToMember) selected = {};
        return [
            <option value="yes">Yes</option>,
            <option value="no" {...selected}>
                No
            </option>,
        ];
    };

    const searchFields = [
        {
            placeholder: 'Search by Name',
            value: searchByName,
            onChange: (e) => setSearchByName(e.target.value),
            icon: IconSearch,
        },
        {
            placeholder: 'Search by Invoice ID',
            value: searchByInvoiceId,
            onChange: (e) => setSearchByInvoiceId(e.target.value),
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
    const filteredInvoices = invoices?.filter((invoice) => {
        // console.log('invoice', invoice);
        const matchesName = invoice?.attributes?.name?.toLowerCase().includes(searchByName.toLowerCase());
        const matchesInvoiceId = invoice?.attributes?.invoiceId?.toLowerCase().includes(searchByInvoiceId.toLowerCase());
        const matchesCompany = invoice?.attributes?.companyName?.toLowerCase().includes(searchByCompany.toLowerCase());
        return matchesName && matchesCompany && matchesInvoiceId;
    });

    return (
        <div>
            <title>Invoice</title>
            <div
                style={{
                    marginBottom: '15px',
                    marginRight: '50px',
                    // textAlign: "right",
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'flex-end',
                }}
            >
                {/* <button type="button" className="invoice_file_label" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setCreateNewInvoice(true)}>
                    Create
                </button> */}

                {/* <button className="invoice_file_label" onClick={() => {}}>
                    Save
                </button> */}
            </div>
            <div className="flex justify-between gap-2   max-lg:flex-col">
                <h1 className="color-brand-1 text-4xl font-bold">Invoices </h1>
                <SearchFields searchFields={searchFields} />
            </div>

            <div className="mb-2 flex justify-end">
                <button onClick={() => setShow(true)} className="flex  items-center gap-1 rounded-md bg-primary px-4 py-2 font-semibold text-white">
                    <LiaFileInvoiceDollarSolid size={22} /> Create Custom Invoice
                </button>
            </div>
            <div className="mt-4">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <GenericTable columns={columns} data={filteredInvoices.filter?.((row) => row?.attributes?.isDeleted == null || row?.attributes?.isDeleted == false)} />
                </div>
            </div>

            {show && <CustomInvoiceModel onCloseModel={() => setShow(false)} invoices={invoices} setShowCreateNotification={setShowCreateNotification} CUSINVFOR={'INVOICE'} />}
            <ToastContainer />
        </div>
    );
};

export default InvoicesPage;
