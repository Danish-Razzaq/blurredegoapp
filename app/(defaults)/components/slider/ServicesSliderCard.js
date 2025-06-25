'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import {ServicesSlideData} from '@/utils/ServicesDetailsPageData';

export default function TestimonialSlider() {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const handleSlideChange = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    return (
        <div className="flex flex-col items-end justify-end gap-2">
            {/* Navigation buttons */}
            <div className="box-pagination-customers max-sm:hidden flex w-36 gap-3">
                <div className="swiper-button-prev-customers swiper-button-prev-style-1 wow animate__animated animate__fadeIn">
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                        />
                    </svg>
                </div>
                <div className="swiper-button-next-customers swiper-button-next-style-1 wow animate__animated animate__fadeIn">
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                    </svg>
                </div>
            </div>

            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                slidesPerView={3}
                spaceBetween={30}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    el: '.swiper-pagination-banner',
                }}
                navigation={{
                    prevEl: '.swiper-button-prev-customers',
                    nextEl: '.swiper-button-next-customers',
                }}
                onSlideChange={handleSlideChange}
                onSwiper={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 30,
                    },
                    575: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    767: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    991: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    1199: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    1350: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                }}
                className="swiper-wrapper"
            >
                {ServicesSlideData.map((slide) => (
                    <SwiperSlide key={slide.id} className="wow animate__animated animate__fadeIn">
                        <div className="mb-50 wow animate__animated animate__fadeIn">
                            <div className="cardService">
                                <div className="cardImage">
                                    <Image className="h-fit w-fit" src={slide.imageSrc} alt={slide.altText} width={446} height={459} />
                                </div>
                                <Link href={slide.link} className="cardInfo cursor-pointer">
                                    <Image className="h-fit w-fit" src={slide.cardImage} alt={slide.altText} width={100} height={100} />
                                    <h6 className="color-brand-2">{slide.title}</h6>
                                    <p className="font-xs color-grey-900">{slide.description}</p>
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
