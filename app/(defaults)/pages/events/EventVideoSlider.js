'use client';
import React, { useState } from 'react';
import EventSliderVideo from '../../components/slider/EventSliderVideo';

const ConferenceMoments = () => {
    const [currentMoment, setCurrentMoment] = useState(1);
    const totalMoments = 5;

    const nextMoment = () => {
        setCurrentMoment((prev) => {
            const newMoment = prev < totalMoments ? prev + 1 : prev;
            return newMoment;
        });
    };

    const prevMoment = () => {
        setCurrentMoment((prev) => {
            const newMoment = prev > 1 ? prev - 1 : prev;
            return newMoment;
        });
    };

    return (
        <div className="flex max-lg:flex-col lg:h-[741px]">
            {/* Left section */}
            <div className="event-slider-left flex flex-col justify-between p-8 pl-32 max-lg:items-start max-lg:p-4 max-lg:pl-3 lg:w-[738px]">
                <div className="mx-auto justify-between gap-3 p-[38px] max-lg:flex max-lg:p-3">
                    <h2 className="mb-8 text-nowrap text-3xl font-extrabold text-white max-lg:text-wrap md:text-5xl lg:text-3xl">Moments of Conference</h2>
                    <div className="flex-row-reverse items-start max-lg:mt-5 justify-start text-2xl text-white max-lg:flex">
                        <div className="box-pagination-customers lg:pb-16 max-lg:relative max-lg:-ml-[200px] lg:space-y-6 gap-8 max-sm:gap-2 justify-center max-lg:flex flex-row-reverse">
                            <div
                                className="swiper-button-next-customers swiper-button-next-style-1 wow animate__animated animate__fadeIn"
                                onClick={nextMoment}
                                style={{ backgroundColor: 'transparent' }}
                            >
                                <svg fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                            <div
                                className="swiper-button-prev-customers lg:top-8 swiper-button-prev-style-1 wow animate__animated animate__fadeIn"
                                onClick={prevMoment}
                                style={{ backgroundColor: 'transparent' }}
                            >
                                <svg fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-6xl font-light text-white max-lg:hidden">
                    {currentMoment.toString().padStart(2, '0')}
                    <span className="ml-2 text-2xl opacity-50">/ {totalMoments.toString().padStart(2, '0')}</span>
                    <div className="progress-container mt-2 h-2 w-40 rounded-md bg-gray-300">
                        <div className="progress-bar h-full bg-gray-700" style={{ width: `${(currentMoment / totalMoments) * 100}%` }}></div>
                    </div>
                </div>
            </div>
            {/* Right section */}
            <div className="event-slider-right w-[1920px] p-4 max-md:pl-10 lg:p-8">
                <div className="lg:-ml-52 lg:pt-[180px]">
                    <EventSliderVideo />
                </div>
            </div>
        </div>
    );
};

export default ConferenceMoments;
