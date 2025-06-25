'use client';
import React, { useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Image from 'next/image';
import '@/styles/events.css';
import Link from 'next/link';
import DownloadButtonForm from '@/components/DownloadButtonForms';

const Conference = () => {
    const [selectedEvent, setSelectedEvent] = React.useState(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const eventParam = urlParams.get('event');

        if (eventParam) {
            const getEvent = async () => {
                try {
                    const response = await fetch(`${apiUrl}/events?filters[event_deleted][$eq]=false&filters[event_name][$eq]=${eventParam}&populate=*`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data?.data?.length > 0) {
                            setSelectedEvent(data?.data[0]?.attributes);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching event:', error);
                }
            };

            getEvent();
        }
    }, []);

    return (
        <Layout>
            <title>Conference Details</title>
            <div className="section d-block">
                <div className="box-map-contact wow animate__animated animate__fadeIn relative  mx-auto w-full ">
                    <Image className=" h-fit w-full" src={'/assets/imgs/page/conference/banner.webp'} alt="Hero Image " width={4096} height={1492} />

                    <div className="box-red-content min-[1360px]:py-10 max-md:top-5  min-[1440px]:h-[250px]  absolute  top-28 h-fit w-full    max-lg:top-7">
                        <h1 className="color-main min-[1370px]:font-extrabold max-md:text-2xl   container font-bold">Conference Details</h1>
                    </div>
                </div>
            </div>
            <section className="section cnt-center mt-110 ">
                <div className="cnt-center  container ">
                    <h2 className="text-center  text-2xl sm:text-5xl">Blurred Ego IS EXCITED TO ANNOUNCE THE 1st ANNUAL CONFERENCE 2025 IN BANGKOK, THAILAND!</h2>

                    <div className="mt-12 flex justify-center">
                        <div className="flex max-w-6xl flex-col gap-8 lg:flex-row">
                            {/* Text Content */}
                            <div className="p-6 lg:w-1/2">
                                <div className="pt-3">
                                    <p className="animate-fade-in text-2xl font-bold">
                                        We are happy to invite you to the Blurred Ego 1st Annual Conference 2025, happening in the cultural city of Bangkok, Thailand. This event is a great opportunity to
                                        connect with industry leaders, professionals, and partners from around the world to share ideas, and build meaningful connections. With an expected turnout of
                                        200+ participants, this conference promises to be an unforgettable highlight of the year!
                                    </p>
                                </div>
                            </div>

                            {/* Image Content */}
                            <div className="lg:w-1/2">
                                <div className="relative">
                                    <div className="box-images wow animate__animated animate__fadeIn">
                                        <img className="w-full" src="/assets/imgs/page/conference/place1.webp" alt="Blurred Ego" />
                                        <div className="image-2 shape-3">
                                            <Image className="wow animate__animated animate__fadeIn h-fit w-[80%]" src="/assets/imgs/page/homepage1/vector.png" alt="Blurred Ego" width={758} height={619} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <div className="flex max-w-6xl flex-col-reverse gap-8 lg:flex-row">
                            {/* Image Content */}
                            <div className="lg:w-1/2">
                                <div className="relative">
                                    <div className="box-images wow animate__animated animate__fadeIn">
                                        <img className="w-full" src="/assets/imgs/page/conference/place2.webp" alt="Blurred Ego" />
                                        <div className="image-2 shape-3">
                                            <Image className="wow animate__animated animate__fadeIn h-fit w-[80%]" src="/assets/imgs/page/homepage1/vector.png" alt="Blurred Ego" width={758} height={619} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="p-6 lg:w-1/2">
                                <div className="pt-3">
                                    <p className="animate-fade-in pl-3 text-2xl font-bold">
                                        As we welcome committed members to this growing community, you'll have plenty of time to interact, share thoughts, and explore new opportunities together. Our
                                        goal is to make this conference valuable for everyone by providing a supportive environment where connections can grow into long-lasting partnerships.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="my-6 text-center text-2xl sm:text-5xl"> Why Attend Blurred Ego’s 1st Annual Conference 2025? </h2>
                    <div className="row mx-auto  flex max-w-[1093px] flex-col justify-center gap-4 text-center">
                        <p className=" wow animate__animated animate__fadeIn  text-xl font-semibold">
                            Attending this conference is a smart investment for your business. It’s an efficient way to connect with multiple industry contacts at once, saving both time and costs. As
                            your business grows, your membership with Blurred Ego becomes an even more valuable asset.
                        </p>
                        <p className=" wow animate__animated animate__fadeIn  text-xl font-semibold">
                            We’ve designed the conference to offer something for everyone, with a focus on providing a neutral and effective networking platform for all. Our goal is to make sure the
                            event is productive and successful, helping you form lasting relationships that are built on trust and confidence.
                        </p>
                        <p className=" wow animate__animated animate__fadeIn  text-xl font-semibold">
                            We’re excited to welcome you to Bangkok, Thailand! Don’t miss out, register today and join us for a truly enriching experience!
                        </p>
                    </div>
                </div>
            </section>
            <section className="section mt-50 bg-customers-say">
                <div className="cnt-center container px-4 pb-20 sm:px-16 ">
                    <div className="flex  items-center justify-between gap-8 ">
                        <div className="w-full md:w-[50%]">
                            <h2 className="title-favicon color-white title-padding-left wow animate__animated animate__fadeIn mb-20 ">Registration Fee</h2>

                            <p className=" color-white wow animate__animated animate__fadeIn text-xl" style={{}}>
                                The registration fee includes a comprehensive package with a three-night hotel stay. For more details, please refer to the conference brochure.
                            </p>
                            <div className="conference-fee-details ">
                                <table className="my-2 w-full table-auto border-collapse border border-white font-bold text-white">
                                    <thead>
                                        <tr className="border-b border-white">
                                            <th className="text-left">Category</th>
                                            <th className="border-collapse border text-left">Member Fee</th>
                                            <th className="text-left">Non Member Fee</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white">
                                        <tr className="border-collapse border border-white bg-transparent text-white">
                                            <td>Early Birds</td>
                                            <td className=" border-collapse border">${Number(selectedEvent?.member_early_bird_fee || 0).toFixed(2)}</td>
                                            <td>${Number(selectedEvent?.early_bird_normal_fee || 0).toFixed(2)}</td>
                                        </tr>
                                        <tr className="bg-transparent">
                                            <td>Normal</td>
                                            <td className=" border-collapse border">${Number(selectedEvent?.member_fee || 0).toFixed(2)}</td>
                                            <td>${Number(selectedEvent?.non_member_fee || 0).toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* <div className="flex w-full items-center lg:justify-center lg:w-[30%] md:justify-end" style={{ zIndex: 2 }}>
                            <div className="conference-fee-container mt-1">
                                <h3 className="conference-fee-title  text-2xl font-bold text-white">Registration Fee</h3>
                                <p className="text-white ">The registration fee includes a comprehensive package with a three-night hotel stay. For more details, please refer to the conference brochure.</p>
                               
                            </div>
                        </div>{' '} */}
                    </div>
                </div>
            </section>{' '}
            <section className="cnt-center mt-50 container">
                <h2 className="text-center text-2xl sm:px-12 sm:text-5xl">Save the Date for Blurred Ego’s 1st Annual Conference 2025! June 27th – 30th, 2025 | Friday to Monday</h2>

                <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {/* <Link
                        //   href={`/pages/events/attendees/${selectedEvent?.event_name}`} 
                        className="btn btn-brand-1-big wow animate__animated animate__fadeIn  h-14 text-nowrap  rounded px-2 font-bold "
                        style={{fontSize: '1.5rem'}}
                    >
                        See Who’s Attending
                    </Link> */}
                    <Link
                        href={`/pages/events/attendees/${selectedEvent?.event_name}`}
                        className="btn btn-brand-1-big wow animate__animated animate__fadeIn  h-14 text-nowrap  rounded px-2 font-bold "
                        style={{
                            fontSize: '1.5rem',
                        }}
                    >
                        See Who’s Attending
                    </Link>
                    <Link
                        href={`/pages/events/${selectedEvent?.event_name}`}
                        className="btn btn-brand-1-big wow animate__animated animate__fadeIn  h-14 text-nowrap  rounded px-2 font-bold "
                        style={{
                            fontSize: '1.5rem',
                        }}
                    >
                        Online Registration
                    </Link>

                    <DownloadButtonForm fileUrl={'https://dashboard.Blurred Egohkg.com/uploads/Blurred Ego_Conference_2025_Registration_Form_6f895352ee.pdf'} fileName={'Download Manual Registration Form'} />
                </div>

                <p className=" wow animate__animated animate__fadeIn  mx-auto mt-3 max-w-[1093px] text-center text-xl">
                    Click to view the <strong>list of attendees</strong> and secure your spot today by completing the <strong> Online Registration </strong> or download the{' '}
                    <strong> Registration Form </strong> then simply fill out the PDF and email it to{' '}
                    <Link href="mailto:Info@blurredego.com" className="text-blue-700">
                        {' '}
                        Info@blurredego.com
                    </Link>{' '}
                    .
                </p>
            </section>
        </Layout>
    );
};

export default Conference;
