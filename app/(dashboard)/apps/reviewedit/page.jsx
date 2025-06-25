'use client';

import React, { useState, useEffect } from 'react';
import { FaRegEye } from 'react-icons/fa';
import { apiCaller } from '@/utils/api';
import GenericTable from '@/components/GenericTable';
import { ToastContainer, toast } from 'react-toastify';
import Modal from '@/components/Modal';
import Link from 'next/link';
import {dummyReviewEdits    } from '@/Data/dummyReviewEdits'; // Import dummy data for testing

const ReviewEdit = () => {
    const [reviewEidts, setReviewEdits] = useState(dummyReviewEdits);
    const [rejectReason, setRejectReason] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModelReviewID, setSelectedModelReviewId] = useState(null);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedModelReviewId(null);
        setRejectReason('');
    };

    const handleConfirm = async () => {
        // Handle confirmation logic here
        const body = {
            data: {
                approvedRE: false,
                rejectionReason: rejectReason,
            },
        };
        let result = await apiCaller('put', `review-edits/${selectedModelReviewID}`, body);
        handleCloseModal();
    };
    const fetchData = async () => {
        let result = await apiCaller('get', 'review-edits?filters[approvedRE]=false');
        if (result) setReviewEdits(result.data);
    };

    // useEffect(() => {
    //     let isMounted = true; // Track if the component is still mounted
    //     if (isMounted) {
    //         fetchData();
    //     }
    //     return () => {
    //         isMounted = false; // Prevent state updates if the component unmounts
    //     };
    // }, []);

    const onReviewActionSelect = async (e, params) => {
        let value = e.target.value;

        if (value === 'Yes') {
            if (window.confirm(`Are you sure you want to Approve changes`)) {
                const body = {
                    data: {
                        approvedRE: true,
                        // rejectionReason: sendReason,
                    },
                };
                let result = await apiCaller('put', `review-edits/${params?.id}`, body);
                console.log("response result review Edit", result)
            }
        } else if (value === 'No') {
            setSelectedModelReviewId(params?.id);
            handleOpenModal();
        }
    };
    const columns = [
        { field: 'id', header: 'ID', width: 150, render: (params) => <span>{params?.id}</span>, filterable: true },
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
        {
            field: 'changes',
            header: 'View Changes',
            width: 200,
            render: (params) => {
                // return <span>{attributes?.received ? "Yes" : "No"}</span>;
                return (
                    <Link href={'/apps/reviewedit/' + params.id} type="button">
                        <FaRegEye className="h-5 w-5" />
                    </Link>
                    // <button className="text-blue-600 hover:underline">
                    //     <FaRegEye className="h-5 w-5" />
                    //     {/* <FaRedClose className="h-5 w-5" /> */}
                    // </button>
                );
            },
        },

        {
            field: 'action',
            header: 'Action',
            width: 150,
            render: (params) => {
                return (
                    <div className="flex items-center justify-center space-x-2">
                        <select className="form-select  rounded-full  border  p-2" onChange={(e) => onReviewActionSelect(e, params)}>
                            <option value="">Choose</option>
                            <option value="Yes">Approve</option>
                            <option value="No">Reject</option>
                        </select>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
        <title>Review Edits</title>
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
            <div className="mt-4">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <GenericTable columns={columns} data={reviewEidts?.filter?.((row) => row?.attributes?.isDeleted == null || row?.attributes?.isDeleted == false)} />
                </div>
            </div>

            {/* Reject Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirm} title="Confirm Action">
                <h4>Reject Reason</h4>
                <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-full rounded border p-2" />
            </Modal>

            <ToastContainer />
        </div>
    );
};
export default ReviewEdit;
