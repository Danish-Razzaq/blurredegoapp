'use client';

import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import Link from 'next/link';

export default function NewsSliderBlog({ NewsBlogData }) {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;
    const handleSlideChange = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };
    // blog description world limit set function
    const truncateBlogDescription = (info) => {
        return info?.length > 300 ? `${info.substring(0, 300)}...` : info;
    };
    return (
        <div className="flex flex-col items-end justify-end ">
            <Swiper
                modules={[Pagination, Navigation]}
                pagination={{
                    clickable: true,
                    el: '.swiper-pagination-banner',
                }}
                navigation={{
                    prevEl: '.swiper-button-prev-customers1',
                    nextEl: '.swiper-button-next-customers1',
                }}
                onSlideChange={handleSlideChange} // Add event listener for slide change
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
                        slidesPerView: 1,
                        spaceBetween: 30,
                    },
                    767: {
                        slidesPerView: 1,
                        spaceBetween: 30,
                    },
                    991: {
                        slidesPerView: 1,
                        spaceBetween: 30,
                    },
                    1199: {
                        slidesPerView: 1,
                        spaceBetween: 30,
                    },
                    1350: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                }}
                className="swiper-wrapper"
            >
                {NewsBlogData?.map((post, index) => (
                    <SwiperSlide key={index} className="wow animate__animated animate__fadeIn ">
                        <Link  href={`/pages/blogs/${post?.attributes?.slug}`}>
                            <div className="card-blog-grid card-blog-grid-2 hover-up">
                                <div className="card-image ">
                                    <img
                                        style={{ height: '300px', width: '100%', objectFit: 'fit' }}
                                        src={`${imgUrl}${post?.attributes?.coverImage?.data?.attributes?.url}`}
                                        alt={post?.attributes?.title}
                                    />
                                </div>
                                <div className="card-info">
                                    <h5 className="color-primary-main">{post?.attributes?.title}</h5>

                                    <p className="font-sm color-grey-500 ">{truncateBlogDescription(post?.attributes?.description)}</p>
                                    <div className="line-border" />
                                    <div>
                                        <div className="d-flex align-items-center justify-content-between mt-5 pt-0">
                                            <Link className="btn btn-link-brn font-sm" href={`/pages/blogs/${post?.attributes?.slug}`}>
                                                View Details
                                                <span>
                                                    <svg className="icon-16 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* Navigation buttons */}
            <div className="box-pagination-customers max-sm:hidden flex w-36 gap-3 " style={{ marginTop: '4px' }}>
                <div className={`swiper-button-prev-customers1 swiper-button-prev-style-1   wow animate__animated animate__fadeIn `}>
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </div>
                <div className={`swiper-button-next-customers1 swiper-button-next-style-1 wow animate__animated animate__fadeIn `}>
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
