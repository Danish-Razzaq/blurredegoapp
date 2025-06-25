'use client';
import { ErrorNotification, SuccessNotification } from '@/components/Toster/success';
import { getUser } from '@/utils/helperFunctions';
import axios from 'axios';
import React, { useState, useEffect, use } from 'react';
import { FaTruck, FaSearch, FaTimes } from 'react-icons/fa';
import { SiPivotaltracker } from 'react-icons/si';
// import { ToastContainer } from 'react-toastify';

const TrackingPopup = ({setTrackingID, isPopupOpen , setIsPopupOpen}) => {

    // console.log('isPopupOpen', isPopupOpen);
   
    const [trackingId, setTrackingId] = useState('');
    const [status, setStatus] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const user = getUser();

    useEffect(() => {
        // const storedTrackingId = localStorage.getItem('trackingId');
        if (!user) {
            setIsPopupOpen(true);
        } 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trackingId = e.target.elements[0].value;
        // console.log('trackingId', trackingId)
        setTrackingID(trackingId);

    };

    const handleClose = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className="relative">
            {!user && (
                <div className="fixed right-1 top-52 cursor-pointer bg-blue-500 p-3  text-white shadow-lg transition hover:bg-blue-600" onClick={() => setIsPopupOpen(true)}>
                    <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', display: 'flex' }}>
                        <SiPivotaltracker className="m-1 " /> Check Status
                    </span>
                </div>
            )}

            {isPopupOpen && !user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative w-[30rem] rounded-lg bg-white p-6 shadow-xl">
                        {/* Close Button */}
                        <button className="absolute right-4 top-4 text-gray-500 hover:text-gray-700" onClick={handleClose}>
                            <FaTimes size={24} />
                        </button>

                        {/* Popup Content */}
                        <h2 className="mb-4 text-center text-2xl font-bold">Track Your Registration Status</h2>
                        <p className="mb-4 text-center text-gray-500">
                            Please enter your tracking ID to check the status of your registration. If you have not yet completed the form, kindly proceed to fill it out. Thank you.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                placeholder="Enter Tracking ID"
                                className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button type="submit" className="flex w-full items-center justify-center rounded bg-blue-500 py-2 text-white hover:bg-blue-600">
                                <SiPivotaltracker className="mr-2" /> Submit Tracking ID
                            </button>
                        </form>
                    </div>
                </div>
            )}



        </div>
    );
};

export default TrackingPopup;
