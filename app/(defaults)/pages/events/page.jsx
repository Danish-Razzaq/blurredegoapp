'use client';
import React, { useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import '@/styles/events.css';
import { ImCalendar } from 'react-icons/im';
import UpcomingEventsPage from '../../components/upcomingEvents';
import axios from 'axios';
// import PreviousEvents from './PreviousEvents';

const Events = () => {
    const [Event, setEvent] = React.useState('upcomingEvent');
    const [events, setEvents] = React.useState([]);

    // console.log('events', events);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const getEvents = async () => {
        try {
            const response = await axios.get(`${apiUrl}/events?filters[event_deleted][$eq]=false&populate=*`);
            // console.log('event', response);
            if (response.status === 200) {
                setEvents(response?.data?.data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        getEvents();
    }, []);

    return (
        <>
            <header>
                <title>Event | Blurred Ego</title>
                <meta
                    name="description"
                    content="Stay updated with Blurred Ego events designed for independent freight forwarders. Join us for networking opportunities, industry insights, and collaborative growth within the global logistics network. Discover upcoming events to expand your professional reach!"
                />
            </header>

            <Layout>
                <div className="section d-block">
                    <div className="box-map-contact wow animate__animated animate__fadeIn relative  mx-auto w-full ">
                    <img className="h-full w-full max-lg:h-[400px]" src={'/assets/imgs/page/events/heroBgImg.webp'} alt="Hero Image "  />

                        <div className="box-red-content  max-lg:top-14  absolute  top-28 h-fit w-full md:py-5 max-lg:p-1">
                            <h2 className="color-main min-[1370px]:font-extrabold max-md:text-2xl   container font-bold">
                                Global Freight Forwarders<br className="d-none d-lg-block" /> Conference
                            </h2>
                        </div>

                    </div>
                </div>
              
                {/* events tabs */}
                <section className="section cnt-center mt-4 ">
                    <div className="cnt-center  container ">
                        <div className="flex flex-wrap justify-center gap-8 text-nowrap text-center">
                            <button
                                className={`w-[381px] rounded-md px-6 py-3  text-lg font-bold uppercase transition duration-300 ${
                                    Event === 'upcomingEvent' ? 'red text-white hover:bg-red-600' : 'bg-gray-400 text-gray-800 hover:bg-gray-500'
                                }`}
                                onClick={() => setEvent('upcomingEvent')}
                            >
                                <ImCalendar className="mr-2 inline-block" /> Upcoming Conferences
                            </button>
                            <button
                                className={`w-[381px] rounded-md px-6 py-3 text-lg font-bold uppercase transition duration-300 ${
                                    Event === 'previousEvents' ? 'red text-white hover:bg-red-600' : 'bg-gray-400 text-gray-800 hover:bg-gray-500'
                                }`}
                                onClick={() => setEvent('previousEvents')}
                            >
                                <ImCalendar className="mr-2 inline-block" /> previous Conferences
                            </button>
                        </div>
                    </div>
                </section>

                {Event === 'upcomingEvent' ? (
                    events.length > 0 ? (
                        <UpcomingEventsPage events={events} />
                    ) : (
                        <div className="section cnt-center mt-110 text-center">
                            <h2 className="color-brand-1">
                                Currently, there are no upcoming events scheduled.
                                <br />
                                Please check back later for updates.
                            </h2>
                        </div>
                    )
                ) : (
                    /* events.length > 0 ? (
        <PreviousEvents events={events} />
    ) : ( */
                    <div className="section cnt-center mt-110 text-center">
                        <h2 className="color-brand-1">No previous conferences are available at this time.</h2>
                    </div>
                    /* ) */
                )}

         
            </Layout>
        </>
    );
};

export default Events;
