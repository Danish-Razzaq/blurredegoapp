'use client';
import Layout from '@/app/(defaults)/components/layout/Layout';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoMdContact } from 'react-icons/io';
import GenericTable from '@/components/GenericTable';
import '@/styles/events.css';

const Attendee = () => {
    const Params = useParams();
    const [attendeeData, setAttendeeData] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleGetAttendee = async () => {
        try {
            const result = await axios.get(`${apiUrl}/event-participants?filters[RegEventName][$eq]=${Params?.slug}&populate=*`);

            const formattedDataRegistration = result?.data?.data
                .filter((item) => item?.attributes?.Registration_Data && !item.attributes?.Registration_Data?.deleted)
                .map((item) => ({
                    regEventName: item.attributes.RegEventName,
                    registerEmail: item.attributes.registerEmail,
                    ...item.attributes.Registration_Data,
                }));
            // Updated logic: If the main registration app is deleted or contains only attendee data,
            // do not display the main application data. Only attendee records will be shown.
            // Adjusted behavior to meet the current requirements.

            const formattedDataAttendees = result?.data?.data.flatMap((item) => {
                const registrationData = item.attributes.Registration_Data || {};
                const attendees = registrationData?.attendees || [];
                return attendees.map((attendee) => ({
                    companyName: registrationData.companyName,
                    city: registrationData.city,
                    country: registrationData.country,
                    companyLogo: registrationData.companyLogo,
                    ...attendee,
                }));
            });

            setAttendeeData([...formattedDataRegistration, ...formattedDataAttendees]);
        } catch (error) {
            console.error('Error fetching attendee data:', error);
        }
    };

    useEffect(() => {
        handleGetAttendee();
    }, []);

    const columns = [
        {
            key: 'id',
            header: 'ID',
            render: (item, index) => index + 1,
        },
        {
            key: 'companyLogo',
            header: 'Company Logo',
            render: (item) => (
                <div className="flex items-center justify-center">
                    {item.companyLogo ? (
                        <img src={`${process.env.NEXT_PUBLIC_IMG_URL}${item.companyLogo}`} alt="avatar" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                        <IoMdContact className="h-9 w-9 text-gray-400" />
                    )}
                </div>
            ),
        },
        {
            key: 'firstName',
            header: 'Attendee Name',
            render: (item) => `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A',
        },
        {
            key: 'companyName',
            header: 'Company',
            render: (item) => item.companyName || 'N/A',
        },
        {
            key: 'city',
            header: 'City',
            render: (item) => item.city || 'N/A',
        },
        {
            key: 'country',
            header: 'Country',
            render: (item) => item.country || 'N/A',
        },
    ];

    return (
        <Layout>
            <title>Attendees List</title>
            <div className="wow animate__animated animate__fadeIn relative overflow-hidden section d-block ">
        <div className="box-map-contact wow animate__animated animate__fadeIn relative  mx-auto w-full ">
          <img className=" h-[300px] w-full sm:h-full" src={'/assets/imgs/page/events/attendee.webp'} alt="Agenda img " />

          <div className="box-red-content min-[1360px]:py-10 max-md:top-5  min-[1440px]:h-[250px]  absolute  top-28 h-fit w-full    max-lg:top-7">
            <h1 className="color-main min-[1370px]:font-extrabold max-md:text-2xl   container font-bold">ATTENDEE LIST
            </h1>
            <h1 className="color-main min-[1370px]:font-extrabold max-md:text-2xl   container font-bold">Welcome to Bangkok, Thailand </h1>

          </div>
        </div>
      </div>
            <div className="container mx-auto px-4 py-8">
                <GenericTable data={attendeeData} columns={columns} />
            </div>
        </Layout>
    );
};

export default Attendee;
