'use client';
import React, { useEffect, useState } from 'react';
import EventForm from './CustomEventFormModel';
import { SuccessNotification, ErrorNotification } from '@/components/Toster/success';
import { ToastContainer } from 'react-toastify';
import { apiCallerWithStatusCode } from '@/utils/api';
import EventsGridCart from './EventsGridCart';
import EventSponsorModel from './EventSponsorModel';
import { isMemberManager } from '@/utils/helperFunctions';
import { eventsdummy } from '@/Data/events'; // Import dummy data for testing
const Events = () => {
    const [show, setShow] = useState(false);
    const [notification, setNotification] = useState(null);
    const [events, setEvents] = useState(eventsdummy);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [sponsorshipFields, setSponsorshipFields] = useState(null);
    const [showSponsor, setShowSponsor] = useState(false);

    useEffect(() => {
        if (notification) {
            if (notification.type === 'success') {
                SuccessNotification(notification.message);
            } else if (notification.type === 'error') {
                ErrorNotification(notification.message);
            }
            setNotification(null);
        }
    }, [notification]);

    const getEvents = async () => {
        try {
            const response = await apiCallerWithStatusCode('get', 'events?populate=*');

            // console.log('response', response);

            if (response.status === 200) {
                // filter items with event_deleted = false
                const filteredEvents = response?.data?.data?.filter((event) => !event.attributes.event_deleted);
                setEvents(filteredEvents);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        getEvents();
    }, []);

    const handleEventCreated = () => {
        getEvents();
    };

    const handleFormOpen = (event) => {
        setSelectedEvent(event);
        setShow(true);
    };

    const handleDelete = async (event) => {
        console.log('event', event);
        const body = {
            data: {
                ...event,
                event_deleted: true,
            },
        };

        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const response = await apiCallerWithStatusCode('put', `events/${event.id}`, body);
                console.log('response after delete the event', response);
                if (response.status === 200) {
                    setNotification({ type: 'success', message: 'Event deleted successfully' });
                    getEvents();
                }
            } catch (error) {
                console.error('Error deleting event:', error);
                setNotification({ type: 'error', message: 'Error deleting event' });
            }
        }
    };

    // View Sponsor handler
    const handleViewSponsor = (eventSponsor) => {
        // console.log('event', event);
        setSponsorshipFields(eventSponsor);
        setShowSponsor(true);
    };

    return (
        <>
            <title>Event Dashboard</title>

            <div className="mb-2 flex justify-end">
                <button
                    className={`hover:bg-[rgb(62,143,143)] rounded bg-[#7e211f] px-4
                    py-2 mb-2 text-white `}
                    onClick={() => setShow(true)}
                    // disabled={!isMemberManager()}
                    title={!isMemberManager() ? 'You do not have permission to create events' : 'Create Event'}
                >
                    Create Event
                </button>
            </div>

            <EventForm
                show={show}
                mode={selectedEvent ? 'update' : 'create'}
                eventData={selectedEvent}
                setNotification={setNotification}
                onClose={() => {
                    setShow(false);
                    setSelectedEvent(null);
                }}
                handleEventCreated={handleEventCreated}
            />

            <EventSponsorModel
                show={showSponsor}
                sponsorshipFields={sponsorshipFields}
                onClose={() => {
                    setShowSponsor(false);
                }}
            />

            {/* Events Grid */}
            <EventsGridCart events={events} handleFormOpen={handleFormOpen} handleDelete={handleDelete} handleViewSponsor={handleViewSponsor} />

            <ToastContainer />
        </>
    );
};

export default Events;
