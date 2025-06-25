'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';

export default function TestimonialAboutSlider() {
    return (
        <>
            <Swiper
                modules={[Pagination, Navigation]}
                slidesPerView={2}
                spaceBetween={30}
                pagination={{
                    clickable: true,
                    el: '.swiper-pagination-banner',
                }}
                navigation={{
                    prevEl: '.swiper-button-prev-customers',
                    nextEl: '.swiper-button-next-customers',
                }}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        // spaceBetween: 30,
                    },
                    575: {
                        slidesPerView: 1,
                        // spaceBetween: 30,
                    },
                    767: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    991: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    1199: {
                        slidesPerView: 2,
                        spaceBetween: 70,
                    },
                    1350: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                }}
                className="swiper-wrapper"
            >
                <SwiperSlide className="wow animate__animated animate__fadeIn">
                    <div className="video-slider aspect-video w-full  overflow-hidden bg-white shadow-lg   max-md:max-w-xl max-[570px]:w-[450px] lg:h-[402px] lg:w-[960px]">
                        {/* Placeholder for Whisper video player */}
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-400">
                                <span className="text-4xl text-white">▶</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide className="wow animate__animated animate__fadeIn">
                    <div className="video-slider  min-md:max-w-xl   aspect-video overflow-hidden bg-white shadow-lg max-[570px]:w-[450px] lg:h-[402px] lg:w-[960px]">
                        {/* Placeholder for Whisper video player */}
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-400">
                                <span className="text-4xl text-white">▶</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide className="wow animate__animated animate__fadeIn">
                    <div className="video-slider  aspect-video w-full overflow-hidden bg-white shadow-lg  max-md:max-w-xl max-[570px]:w-[450px] lg:h-[402px] lg:w-[960px]">
                        {/* Placeholder for Whisper video player */}
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-400">
                                <span className="text-4xl text-white">▶</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide className="wow animate__animated animate__fadeIn">
                    <div className="video-slider  aspect-video w-full overflow-hidden bg-white shadow-lg  max-md:max-w-xl max-[570px]:w-[450px] lg:h-[402px] lg:w-[960px]">
                        {/* Placeholder for Whisper video player */}
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-400">
                                <span className="text-4xl text-white">▶</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide className="wow animate__animated animate__fadeIn">
                    <div className="video-slider  aspect-video w-full overflow-hidden  bg-white shadow-lg max-md:max-w-xl max-[570px]:w-[450px] lg:h-[402px] lg:w-[960px]">
                        {/* Placeholder for Whisper video player */}
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-400">
                                <span className="text-4xl text-white">▶</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide className="wow animate__animated animate__fadeIn">
                    <div className="video-slider  aspect-video w-full overflow-hidden  bg-white shadow-lg max-md:max-w-xl max-[570px]:w-[450px] lg:h-[402px] lg:w-[960px]">
                        {/* Placeholder for Whisper video player */}
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-400">
                                <span className="text-4xl text-white">▶</span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </>
    );
}
