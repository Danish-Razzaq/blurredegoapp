import React from 'react';
import Link from 'next/link';
import '@/styles/events.css';
import { FiClock } from 'react-icons/fi';
import DownloadButtonForm from '@/components/DownloadButtonForms';
const Card = ({ event, index }) => {
    const  attributes  = event;

    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;
    const getCoverImageUrl = (event) => {
        if (!event.attributes?.event_banner_image?.data?.attributes?.url) return null;
        return imgUrl + event.attributes.event_banner_image?.data?.attributes?.url;
    };

    // console.log('event', attributes);

    // const coverImageUrl = getCoverImageUrl(event);

    // console.log('coverImageUrl', coverImageUrl);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    const formatDate2 = (dateString) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        const day = date.getDate();

        const daySuffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';

        const options = { month: 'short', year: 'numeric' };
        const monthYear = new Intl.DateTimeFormat('en-US', options).format(date);

        return `${day}${daySuffix} ${monthYear}`;
    };

    return (
        <>
            <section className="section  mt-110 max-md:mt-32">
                <div className="cnt-center position-relative container  max-lg:flex max-lg:flex-col-reverse  ">
                    <div className={`event-info-box event-slider-left p-30    h-full lg:absolute lg:w-[552px] max-lg:mx-1 max-lg:-mt-10 ${index % 2 === 1 ? 'right-0' : ''}`}>
                        <h2 className="wow animate__animated animate__fadeIn my-1 text-white">
                            {attributes?.city},{attributes?.country}
                        </h2>
                        <div className="flex items-center gap-1">
                            <FiClock color="white" size={20} />
                            <span className="wow animate__animated animate__fadeIn text-white">
                                <span>{formatDate(attributes?.starting_date)}</span>
                                <span className="mx-2">-</span>
                                <span>{formatDate(attributes?.ending_date)}</span>
                            </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-4">
                            <div className="  flex flex-col  gap-1">
                                <span className="btn btn-tag wow animate__animated animate__fadeIn w-fit text-nowrap  text-white">Expected Attendance</span>
                                <p className="max-md:text-3xl text-4xl font-extrabold">{attributes?.expected_attendance}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="btn btn-tag wow animate__animated animate__fadeIn w-fit text-white ">Organizer</span>
                                <p className="max-md:text-3xl  text-4xl font-extrabold">{attributes?.organizer}</p>
                            </div>
                        </div>

                        <p className="my-3 line-clamp-6" title={attributes?.event_description}>
                            {attributes?.event_description}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-4">
                            <div className="flex flex-wrap gap-4 ">
                                <Link
                                    href={`/pages/conference?event=${attributes?.event_name}`}
                                    className="btn btn-link-medium wow animate__animated animate__fadeIn h-12 w-full text-nowrap border bg-white px-2 text-lg sm:w-fit"
                                >
                                    Registration Details
                                    <svg className="icon-16 ml-5 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>{' '}
                                <Link href={`/pages/events/agenda`} className="btn btn-link-medium wow animate__animated animate__fadeIn h-12 w-full text-nowrap border bg-white px-2 text-lg sm:w-fit">
                                    View Conference Agenda
                                    <svg className="icon-16 ml-5 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                            <DownloadButtonForm fileUrl={'https://dashboard.BlurredEgohkg.com/uploads/Blurred Ego_1st_annual_conference_2025_fced25a3ed.pdf'} fileName="Conference Brochure" />
                        </div>
                    </div>
                    <div className={`event-Image-box flex w-full ${index % 2 === 1 ? '' : 'justify-end'}`} style={{ alignItems: 'center' }}>
                            <img className="object-cover lg:h-[600px]" src={attributes?.bannerImg} alt="event" width={1008} height={652} />
                       
                    </div>
                </div>
            </section>
        </>
    );
};

const UpcomingEvents = ({ events }) => {
    console.log('event inside', events);
    return (
        <div>
            <h3 className="color-brand-1 cnt-center  container" style={{ fontWeight: '900', marginTop: '50px' }}>
                Upcoming Conferences 2025
            </h3>
           {Object?.values(events).map((event, index) => (
                <Card event={event} index={index} />
            ))}
        </div>
    );
};

export default UpcomingEvents;
