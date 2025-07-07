import Link from 'next/link';
import React from 'react';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiHome } from 'react-icons/fi';
import { FaRegEdit } from 'react-icons/fa';
import { IoTrashSharp } from 'react-icons/io5';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { TbDevicesSearch } from 'react-icons/tb';
import { IoMdContacts } from 'react-icons/io';
import { PiInvoiceFill } from 'react-icons/pi';
import { isMemberManager } from '@/utils/helperFunctions';
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;
const getCoverImageUrl = (event) => {
    if (!event?.attributes?.event_banner_image?.data?.attributes?.url) return null;
    return imgUrl + event?.attributes?.event_banner_image?.data?.attributes?.url;
};

const isManager = isMemberManager();

const EventCard = ({ event, handleFormOpen, handleDelete, handleViewSponsor }) => {
    const  attributes  = event;
    console.log('event', event);
    console.log('attributes', attributes);
    const coverImageUrl = getCoverImageUrl(event);
    // console.log('coverImageUrl', coverImageUrl);

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
            {/* Card Image */}
            <div className="relative h-48">
                <img src={attributes?.bannerImg} alt={`${attributes.city} event`} className="absolute inset-0 h-full w-full object-cover" />
                {/* {coverImageUrl ? (
                    <>
                    </>
                ) : ( */}
                    <>
                        {/* // Fallback gradient background if no image */}
                        {/* <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-600" /> */}
                    </>
                {/* )} */}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Location badge */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="mb-2 flex items-center gap-2">
                        <FiMapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">
                            {attributes?.city}, {attributes.country}
                        </span>
                    </div>
                </div>

                {/*  edit icon set */}
                <div
                    // onClick={() => isMemberManager() && handleFormOpen(event)}
                    className={`absolute right-4 top-4 z-10 ${isMemberManager() ? '' : 'cursor-not-allowed'}`}
                    disabled={!isMemberManager()}
                    title={!isMemberManager() ? 'You do not have permission to edit events' : 'Edit Event'}
                >
                    <FaRegEdit
                        className={`h-5 w-5 
                    ${isMemberManager() ? 'cursor-pointer text-blue-600' : 'cursor-not-allowed text-gray-400'}`}
                    />
                </div>

                {/* Delete icon set */}
                <div
                    onClick={() => isMemberManager() && handleDelete(event)}
                    className={`absolute bottom-4 right-4 z-10 ${isMemberManager() ? '' : 'cursor-not-allowed'}`}
                    disabled={!isMemberManager()}
                    title={!isMemberManager() ? 'You do not have permission to Delete events' : 'Delete Event'}
                >
                    <IoTrashSharp
                        className={` h-5 w-5 
                    ${isMemberManager() ? 'cursor-pointer text-red-600' : 'cursor-not-allowed text-gray-400'}`}
                    />
                </div>
            </div>
            {/* Card Content */}
            <div className="space-y-4 p-4">
                {/* Date Range */}
                <div className="flex items-center gap-3 text-gray-600">
                    <FiCalendar className="h-5 w-5 text-blue-500" />
                    <div className="text-sm">
                        <span>{formatDate(attributes.starting_date)}</span>
                        <span className="mx-2">-</span>
                        <span>{formatDate(attributes.ending_date)}</span>
                    </div>
                </div>
                {/* Attendance & Organizer */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <FiUsers className="h-5 w-5 text-green-500" />
                        <span className="text-sm">{attributes.expected_attendance} Attendees</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <FiHome className="h-5 w-5 text-purple-500" />
                        <span className="text-sm">{attributes.organizer}</span>
                    </div>
                </div>
                {/* Description */}
                {attributes.event_description && <p className="line-clamp-2 text-sm text-gray-600">{attributes.event_description}</p>}
                {/* Created Time */}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <FiClock className="h-4 w-4" />
                    <span>Created {formatDate(attributes.createdAt)}</span>
                </div>
                {/* Sponsorship Action Buttons */}
                {/* View Sponsorship Dashboard Button */}
                <div className="flex gap-2 max-lg:flex-col ">
                    {/* View Invoices Link */}
                    <Link
                        href={ `/apps/event-invoices/${attributes?.event_name}`}
                        // onClick={(e) => {
                        //     if (!isManager) e.preventDefault();
                        // }}
                        // title={'You do not have permission to see this'}
                        className={`w-full flex-1 items-center justify-center text-nowrap rounded-md px-1 py-3 text-center text-sm font-medium text-white transition-colors lg:flex-1
                        cursor-pointer bg-[#7e211f] hover:bg-[hsl(1,39%,46%)]]`}
                    >
                        <PiInvoiceFill className="mr-2 inline-block h-5 w-5" />
                        View Invoices
                    </Link>

                    {/* Sponsorship Button */}
                    <button
                        onClick={() => {
                            handleViewSponsor(attributes?.event_sponsorship_fields);
                        }}
                        className="w-full flex-1 cursor-pointer items-center justify-center text-nowrap rounded-md bg-[#7e211f] px-1 py-3 text-sm font-medium text-white
                                      transition-colors hover:bg-[hsl(1,39%,46%)]] lg:flex-1"
                    >
                        <TbDevicesSearch className="mr-2 inline-block h-5 w-5" />
                        Sponsorship Dashboard
                    </button>
                </div>
                {/* View Participants Button */}
                <Link
                    href={`/apps/events/${attributes?.event_name}`}
                    className="flex w-full items-center justify-center text-nowrap rounded-md bg-[#7e211f] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[hsl(1,39%,46%)]] lg:flex-1"
                >
                    <IoMdContacts className="mr-1 inline-block h-5 w-5" />
                    View Participants
                </Link>
            </div>
        </div>
    );
};

const EventsGrid = ({ events, handleFormOpen, handleDelete, handleViewSponsor }) => {
    // its for ui design to show no events created yet
    // if (events.length === 0) {
    //     return (
    //         <div className="flex h-[70vh] flex-col items-center justify-center ">
    //             <div className="text-center">
    //                 <IoAlertCircleOutline className="mb-4 justify-self-center  text-gray-400" size={60} />

    //                 <h1 className="mb-2 text-3xl font-semibold text-gray-700">No Events Yet</h1>
    //                 <p className="text-lg text-gray-500">It looks like there are no events available right now.</p>
    //                 <button
    //                     onClick={() => handleFormOpen()}
    //                     className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    //                 >
    //                     Create New Event
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <>
            <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 ">
                {Object?.values(events).map((event) => (
                    <EventCard key={event.id} event={event} handleFormOpen={handleFormOpen} handleDelete={handleDelete} handleViewSponsor={handleViewSponsor} />
                ))}
            </div>
        </>
    );
};

export default EventsGrid;
