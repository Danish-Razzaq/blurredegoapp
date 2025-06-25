import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '@/styles/events.css';
import { FiClock } from 'react-icons/fi';

const PreviousEvents = () => {
    return (
        <>
            <h3 className="color-brand-1 cnt-center mt-110  container    " style={{ fontWeight: '900' }}>
            Previous Conferences
            </h3>

            <section className="section  mt-110 max-md:mt-32">
                <div className="cnt-center position-relative container  max-lg:flex max-lg:flex-col-reverse  ">
                    <div className="event-info-box event-slider-left p-30  top-10  lg:absolute lg:h-[488px] lg:w-[552px] max-lg:mx-1  max-lg:-mt-10  ">
                        <h2 className="wow animate__animated animate__fadeIn mb-20 text-white">Guangzhou, China</h2>
                        <p className="font-sm color-gray-700 wow animate__animated animate__fadeIn">Lorem Ipsum is simply dummyLorem Ipsum </p>
                        <div className="flex items-center gap-1">
                            <FiClock color="white" size={20} />
                            25th-27th September 2024
                        </div>
                        <div className="mt-30 max-md:gap-2 max-[370px]:flex-col flex flex-grow gap-10">
                            <div className="  flex flex-col  gap-1">
                                <span className="btn btn-tag wow animate__animated animate__fadeIn w-fit text-nowrap  text-white">Expected Attendance</span>
                                <p className="max-md:text-3xl text-4xl font-extrabold">2,000+</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="btn btn-tag wow animate__animated animate__fadeIn w-fit text-white ">Organizer</span>
                                <p className="max-md:text-3xl  text-4xl font-extrabold">Blurred Ego</p>
                            </div>
                        </div>
                        <p className="mt-40">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                            printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
                        </p>

                        <Link className="btn btn-link-medium wow animate__animated animate__fadeIn mt-5 h-8 w-fit text-nowrap border bg-white px-2 " href="/pages/events/previous-event/Guangzhou">
                            View Gallery
                            <svg className="icon-16 ml-5 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>

                    <div className="event-Image-box  flex w-full justify-end">
                        <Image src="/assets/imgs/page/events/event2.webp" alt="event" width={1008} height={552} />
                    </div>
                </div>
            </section>
            <section className="section  mt-110 max-md:mt-32">
                <div className="cnt-center position-relative container  max-lg:flex max-lg:flex-col  ">
                    <div className="event-Image-box   ">
                        <Image src="/assets/imgs/page/events/event2.webp" alt="event" width={1008} height={552} />
                    </div>
                    <div className="event-info-box event-slider-left p-30 right-0  top-10  lg:absolute lg:h-[488px] lg:w-[552px] max-lg:mx-1  max-lg:-mt-10  ">
                        <h2 className="wow animate__animated animate__fadeIn mb-20 text-white">Guangzhou, China</h2>
                        <p className="font-sm color-gray-700 wow animate__animated animate__fadeIn">Lorem Ipsum is simply dummyLorem Ipsum </p>
                        <div className="flex items-center gap-1">
                            <FiClock color="white" size={20} />
                            25th-27th September 2024
                        </div>
                        <div className="mt-30 max-md:gap-2 max-[370px]:flex-col flex flex-grow gap-10">
                            <div className="  flex flex-col  gap-1">
                                <span className="btn btn-tag wow animate__animated animate__fadeIn w-fit text-nowrap  text-white">Expected Attendance</span>
                                <p className="max-md:text-3xl text-4xl font-extrabold">2,000+</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="btn btn-tag wow animate__animated animate__fadeIn w-fit text-white ">Organizer</span>
                                <p className="max-md:text-3xl  text-4xl font-extrabold">Blurred Ego</p>
                            </div>
                        </div>
                        <p className="mt-40">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                            printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
                        </p>

                        <Link className="btn btn-link-medium wow animate__animated animate__fadeIn mt-5 h-8 w-fit text-nowrap border bg-white px-2 " href="/register">
                            View Gallery
                            <svg className="icon-16 ml-5 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

          
        </>
    );
};

export default PreviousEvents;
