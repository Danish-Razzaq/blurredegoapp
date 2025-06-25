'use client';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import Link from 'next/link';

export default function NewsCaracol({ LatestNews }) {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const handleSlideChange = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };
    // blog description world limit set function
    const truncateBlogDescription = (info) => {
        return info?.length > 310 ? `${info.substring(0, 310)}...` : info;
    };
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            {/* Custom Pagination styles */}
            <style jsx>{`
                .swiper-pagination-bullet {
                    background-color: black;
                    width: 12px;
                    height: 12px;
                }
                .swiper-pagination-bullet-active {
                    background-color: red;
                }
            `}</style>
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                slidesPerView={1}
                spaceBetween={60}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}

                navigation={{
                    prevEl: '.swiper-button-prev-customers',
                    nextEl: '.swiper-button-next-customers',
                }}
                pagination={{
                    clickable: true, // Enables pagination buttons
                }}
                onSlideChange={handleSlideChange}
                onSwiper={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    575: { slidesPerView: 1 },
                    767: { slidesPerView: 1 },
                    991: { slidesPerView: 1 },
                    1199: { slidesPerView: 1 },
                    1350: { slidesPerView: 1 },
                }}
                className="swiper-wrapper"
            >
                {LatestNews?.map((post, index) => (
                    <SwiperSlide key={index} className="wow animate__animated animate__fadeIn">
                    <Link href={`/pages/blogs/${post?.attributes?.slug}`}
                            className="flex flex-col justify-center gap-3  px-5  h-[359px]"
                            style={{
                                background: `url('/assets/imgs/page/services/news1BG.png') no-repeat`,
                                backgroundSize: 'cover',
                                borderRadius: '10px',
                            }}
                        >
                            <h3 className="max-w-[630px] text-white">{post?.attributes?.title}</h3>
                            <p className="max-w-[630px] text-white">{truncateBlogDescription(post?.attributes?.description)}</p>
                            <Link href={`/pages/blogs/${post?.attributes?.slug}`} className="btn btn-white w-fit px-2">
                                Read More
                            </Link>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
