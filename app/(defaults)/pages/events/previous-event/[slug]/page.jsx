import Layout from '@/app/(defaults)/components/layout/Layout';
import Image from 'next/image';
import React from 'react';
// import '../[slug]/events.css'
import '@/styles/events.css';
const PreviousEvent = ({ slug }) => {
    // console.log(slug);
    return (
        <Layout>
            <div className="section d-block">
                <div className="box-map-contact wow animate__animated animate__fadeIn relative ">
                    <img className=" h-[300px] w-full sm:h-full" src={'/assets/imgs/page/events/previouseventbg.webp'} alt="previous Event gallery " />

                    <div className="hero-previous-events  min-[1360px]:py-10 max-md:top-8   absolute  top-36 h-fit w-full    max-lg:top-7">
                        <div className="   container  top-10 lg:absolute  max-lg:mx-1  ">
                            <h1 className="wow animate__animated animate__fadeIn  pb-1 pt-8 font-extrabold text-white">Guangzhou, China</h1>
                            <p className="font-sm wow animate__animated animate__fadeIn text-white">Lorem Ipsum is simply dummyLorem Ipsum </p>
                            <div className="flex items-center gap-1 text-white">
                                <img src="/assets/imgs/page/events/clock.png" alt="clock" className="h-6 w-6" />
                                25th-27th September 2024
                            </div>
                            <div className="max-[370px]:flex-col  flex flex-grow gap-4 pt-2  text-white">
                                <div className="  flex flex-col  gap-1">
                                    <span className="btn btn-tag wow animate__animated animate__fadeIn w-fit text-nowrap  text-white">Expected Attendance</span>
                                    <p className="max-md:text-3xl text-4xl font-extrabold">2,000+</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="btn btn-tag wow animate__animated animate__fadeIn w-fit text-white ">Organizer</span>
                                    <p className="max-md:text-3xl  text-4xl font-extrabold">Blurred Ego</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="max-md:mt-32 cnt-center container pt-10">
                <h2 className="font-extrabold uppercase">Day 1</h2>
            </section>
        </Layout>
    );
};

export default PreviousEvent;
