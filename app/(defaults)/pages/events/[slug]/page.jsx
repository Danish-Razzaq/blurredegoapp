'use client';
import React, { useEffect, useState } from 'react';
import EventRegistrationForm from './eventRegistrationForm';
import Layout from '@/app/(defaults)/components/layout/Layout';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { getUser } from '@/utils/helperFunctions';
import { SuccessNotification, ErrorNotification } from '@/components/Toster/success';
// import { ToastContainer } from 'react-toastify';
import TakingPopup from './TakingPopup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const EventRegistration = () => {
    const { slug } = useParams();
    const [event, setSingleEvent] = useState(null);
    const [eventRegistrationData, setEventRegistrationData] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [trackingId, setTrackingID] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    // const [notification, setNotification] = React.useState(null);
    // console.log('formSubmitted', formSubmitted);
    // console.log('trackingId', trackingId);

    // console.log(`The applicable event fee is: ${eventFee}`);

    useEffect(() => {
        if (formSubmitted) {
            toast.success('Your registration form has been submitted successfully.', {
                autoClose: 5000,
            });

            toast.info(
                <div>
                    <p>
                        <strong>Your Tracking ID:</strong>
                    </p>
                    <p
                        style={{
                            backgroundColor: '#f4f4f4',
                            padding: '10px',
                            borderRadius: '5px',
                            wordBreak: 'break-all',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            navigator.clipboard.writeText(trackingId);
                            toast.success('Tracking ID copied to clipboard!');
                        }}
                    >
                        {trackingId}
                    </p>
                    <small style={{ fontStyle: 'italic', color: '#555' }}>Click the Tracking ID to copy it to your clipboard.</small>
                </div>,
                {
                    autoClose: false,
                    closeOnClick: false,
                }
            );

            setTimeout(() => setFormSubmitted(false), 0);
        }
    }, [formSubmitted, trackingId]);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const event_name_reg = slug;
    const user = getUser();

    //  get tracking id from local storage

    const getEvents = async () => {
        const response = await axios.get(`${apiUrl}/events?filters[event_name][$eq]=${slug}`);
        const event = response?.data?.data[0];
        // console.log('event api response ', event);
        setSingleEvent(event);
    };

    const getEventRegistrationData = async () => {
        try {
            // const trackingId = localStorage.getItem('trackingId');
            const filterParam = user ? `filters[registered_Email][$eq]=${user.email}` : `filters[event_taking_id][$eq]=${trackingId}`;

            const response = await axios.get(`${apiUrl}/event-participants?${filterParam}`);

            if (response.data.data.length === 0 && trackingId) {
                toast.error('Invalid Tracking ID. Please enter a valid Tracking ID.');
                return;
            }

            // console.log('trackingId', trackingId);
            // console.log('event registration data', response);
            // console.log('response', response);
            if (response.status === 200 && response.data.data.length > 0) {
                const eventRegistrationData = response?.data?.data?.[0]?.attributes || [];
                setEventRegistrationData(eventRegistrationData);
                setIsPopupOpen(false);
            }
        } catch (error) {
            console.error('Error fetching or filtering data:', error.response?.data || error.message);
        }

        // console.log('event registration data', response);
    };

    useEffect(() => {
        getEvents();
        getEventRegistrationData();
    }, []);

    // console.log('eventRegistrationData', eventRegistrationData);

    useEffect(() => {
        getEventRegistrationData();
    }, [formSubmitted, trackingId]);

    const renderContent = () => {
        if (eventRegistrationData?.Registration_Data?.deleted) {
            // Case: Registration form deleted
            return (
                <div className="flex flex-col items-center justify-center gap-2 p-5">
                    <h6 className="text-center font-semibold text-gray-600 lg:px-6">
                        Dear Visitor, we regret to inform you that your registration form has been deleted.
                        <br />
                        For further assistance, please contact the event organizer at
                        <Link href="mailto:Info@blurredego.com" className="text-blue">
                            {' '}
                            Info@blurredego.com
                        </Link>{' '}
                        or{' '}
                        <Link href="https://wa.me/85269327488" target="_blank" rel="noopener noreferrer">
                            +852 6932 7488
                        </Link>
                        .
                        <br />
                        We apologize for any inconvenience caused.
                    </h6>
                </div>
            );
        }

        if (!eventRegistrationData || (eventRegistrationData.length === 0 && !eventRegistrationData.Invoice_data)) {
            // Case: Registration form successfully submitted
            return (
                <>
                    <TakingPopup setTrackingID={setTrackingID} isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
                    <EventRegistrationForm event_name_reg={event_name_reg} setFormSubmitted={setFormSubmitted} setTrackingID={setTrackingID} event={event} />
                </>
            );
        }

        if (eventRegistrationData?.Registration_Data?.approved === 'Yes' && !eventRegistrationData?.Invoice_data?.sentToEventInvoice) {
            // Case: Application approved, invoice not generated yet
            return (
                <div className="flex flex-col items-center justify-center gap-2 p-5">
                    <h6 className="text-center font-semibold text-gray-600 lg:px-6">
                        Dear Visitor, Congratulations! Your application has been approved. Our team is currently generating your invoice. Stay tuned with us.
                    </h6>
                </div>
            );
        }

        if (eventRegistrationData?.Invoice_data?.sentToEventInvoice && !eventRegistrationData?.Invoice_data?.invoice_received) {
            console.log('eventRegistrationData?.Invoice_data?.id', eventRegistrationData);
            // Case: Invoice generated, allow preview
            return (
                <div className="flex flex-col items-center justify-center gap-2 p-5">
                    <h6 className="text-center font-semibold text-gray-600 lg:px-6">Dear Visitor, Your invoice is ready. You can preview it by clicking the button below.</h6>
                    <Link href={`/components/eventInvoice/preview/${eventRegistrationData?.Invoice_data?.id || eventRegistrationData?.Registration_Data?.id}`} legacyBehavior>
                        <a className="btn btn-blue btn-lg w-fit px-2" target="_blank" rel="noopener noreferrer">
                            Preview Invoice
                        </a>
                    </Link>
                </div>
            );
        }
        if (eventRegistrationData && eventRegistrationData?.Invoice_data?.invoice_received) {
            return (
                <div className="flex flex-col items-center justify-center gap-2 p-5">
                    <h6 className="text-center font-semibold text-gray-600 lg:px-6">
                        Dear Visitor, Your invoice has been received. Thank you for your payment. We look forward to seeing you at the event.
                    </h6>
                </div>
            );
        }

        // Default case: Show popup and registration form
        return (
            <div className="flex flex-col items-center justify-center gap-2 p-5">
                <h3 className="font-semibold text-gray-600">Thank you for registering!</h3>
                <h5 className="text-center text-gray-600">Your registration has been submitted successfully. You will be notified once your application is approved.</h5>
            </div>
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <>
            <title>Event | Registration</title>
            <Layout>
                <div className=" wow animate__animated animate__fadeIn relative overflow-hidden">
                    <img className="h-full w-full max-lg:h-[400px]" src={'/assets/imgs/page/events/previouseventbg.webp'} alt="previous Event gallery " />

                    <div className=" cnt-center container ">
                        <div className="container absolute inset-0 mx-auto flex h-full w-full items-center  ">
                            <div className="mx-1 h-fit  w-fit  ">
                                <h1 className="wow animate__animated animate__fadeIn text-4xl  font-extrabold  text-white md:text-7xl">Online Registration</h1>
                                <h1 className="wow animate__animated animate__fadeIn  pb-1 text-4xl font-extrabold text-white md:text-7xl">
                                    {`${event?.attributes?.city},${event?.attributes?.country}`}{' '}
                                </h1>
                                <p className="wow animate__animated animate__fadeIn line-clamp-4 max-w-3xl  pb-1 font-normal text-white ">{event?.attributes?.event_description} </p>
                                <div className="flex items-center gap-1 text-white">
                                    <img src="/assets/imgs/page/events/clock.png" alt="clock" className="h-6 w-6" />
                                    {formatDate(event?.attributes?.starting_date)} - {formatDate(event?.attributes?.ending_date)}
                                </div>
                                <div className="max-[370px]:flex-col  flex flex-grow gap-4 pt-2  text-white">
                                    <div className="  flex flex-col  gap-1">
                                        <span className="btn btn-tag wow animate__animated animate__fadeIn w-fit text-nowrap  text-white">Expected Attendance</span>
                                        <p className="max-md:text-3xl text-4xl font-extrabold">{event?.attributes?.expected_attendance}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="btn btn-tag wow animate__animated animate__fadeIn w-fit text-white ">Organizer</span>
                                        <p className="max-md:text-3xl  text-4xl font-extrabold">{event?.attributes?.organizer}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {renderContent()}
                <ToastContainer />
            </Layout>
        </>
    );
};

export default EventRegistration;
