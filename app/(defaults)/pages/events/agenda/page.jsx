import Layout from '@/app/(defaults)/components/layout/Layout';
import React from 'react';
import '@/styles/events.css';

const AgendaTable = () => {
    const agendaData = [
        { day: 'Conference Day 01 - Friday, 27 June 2025' },
        { time: '02:00 PM - 06:00 PM', function: 'Registration' },
        { time: '07:00 PM - 10:00 PM', function: 'Cocktail Party' },

        { day: 'Conference Day 02 - Saturday, 28 June 2025' },
        { time: '09:00 AM - 10:00 AM', function: 'Opening Ceremony' },
        { time: '10:15 AM - 10:30 AM', function: 'Coffee  Break' },
        { time: '10:30 AM - 12:30 PM', function: '1 To 1 Meeting' },
        { time: '12:30 PM - 01:00 PM', function: 'Group Photo Session' },
        { time: '01:00 PM - 02:00 PM', function: 'Lunch' },
        { time: '02:00 PM - 03:30 PM', function: '1 To 1 Meeting' },
        { time: '03:30 PM - 03:45 PM', function: 'Coffee  Break' },
        { time: '03:45 PM - 05:00 PM', function: '1 To 1 Meeting' },
        { time: '07:00 PM - 10:00 PM', function: 'Cruise Dinner Party' },

        { day: 'Conference Day 03 - Sunday, 29 June 2025' },
        { time: '09:30 AM - 10:15 PM', function: '1 To 1 Meeting' },
        { time: '10:15 AM - 10:30 AM', function: 'Coffee  Break' },
        { time: '10:30 AM - 01:00 PM', function: '1 To 1 Meeting' },
        { time: '01:00 PM - 02:00 PM', function: 'Lunch' },
        { time: '02:00 PM - 03:30 PM', function: '1 To 1 Meeting' },
        { time: '03:30 PM - 03:45 PM', function: 'Coffee  Break' },
        { time: '03:45 PM - 05:00 PM', function: '1 To 1 Meeting' },
        { time: '07:00 PM - 10:00 PM', function: 'Gala & Award Dinner' },

        { day: 'Conference Day 04 - Monday, 30 June 2025' },
        { time: 'Check-Out & Departure' },
    ];
    return (
        <Layout>
            <title>Blurred Ego 1st Conference Agenda</title>
            <div className="wow animate__animated animate__fadeIn section d-block relative overflow-hidden ">
                <div className="box-map-contact wow animate__animated animate__fadeIn relative  mx-auto w-full ">
                    <img className=" h-[300px] w-full sm:h-full" src={'/assets/imgs/page/conference/agenda.webp'} alt="Agenda img " />

                    <div className="box-red-content min-[1360px]:py-10 max-md:top-5  min-[1440px]:h-[250px]  absolute  top-28 h-fit w-full    max-lg:top-7">
                        <h1 className="color-main min-[1370px]:font-extrabold max-md:text-2xl   container font-bold">AGENDA</h1>
                        <h1 className="color-main min-[1370px]:font-extrabold max-md:text-2xl   container font-bold">Welcome to Bangkok, Thailand </h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto my-16 flex flex-col items-center px-4 text-center">
                <h1 className="my-8 text-4xl font-extrabold text-red-600">Blurred Ego 1st Annual Conference 2025 Agenda is Sponsored By Biladu S.A </h1>

                <img
                    className="mb-6 h-40 w-40 rounded-full shadow-2xl  transition-transform duration-300 hover:scale-105"
                    src="/assets/imgs/page/conference/Biladu_Logo_ebe60b2b1d.png"
                    alt="Biladu Logo"
                />
            </div>

            <div className="agenda-table container mx-auto mb-12 mt-12 px-4">
                {/* <h2 className="my-4 text-center text-3xl font-bold text-red-600">Conference Agenda</h2> */}
                <table className="w-full border-collapse border border-blue-500">
                    <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="p-3 text-left">Time</th>
                            <th className="p-3 text-left">Function</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agendaData.map((item, index) =>
                            item.day ? (
                                // Section Header Row for Day
                                <tr key={index} className="bg-blue-100">
                                    <td colSpan="2" className="border border-red-500 p-3 text-left font-semibold text-red-700">
                                        {item.day}
                                    </td>
                                </tr>
                            ) : (
                                // Regular Agenda Rows
                                <tr key={index} className="hover:bg-blue-50">
                                    <td className="border border-blue-500 p-3">{item.time}</td>
                                    <td className="border border-blue-500 p-3">{item.function}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                    {/* // add Notices: The Agenda may have some adjustment in table footer section */}
                </table>
                <span className="pt-3 text-lg font-bold text-red-600">The Agenda may have some adjustment.</span>
            </div>
        </Layout>
    );
};

export default AgendaTable;
