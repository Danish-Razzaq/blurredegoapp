'use client';
import Link from 'next/link';
import { useState } from 'react';
import ModalVideo from 'react-modal-video';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';


export default function Hero1Slider() {
    const [isOpen, setOpen] = useState(false);
    return (
        <>
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                slidesPerView={1}
                spaceBetween={0}
                // loop={true}
                // autoplay={{
                //     delay: 2500,
                //     disableOnInteraction: false,
                // }}
                pagination={{
                    clickable: true,
                    el: '.swiper-pagination-banner',
                }}
                className="swiper-wrapper"
            >
                <SwiperSlide>
                  
                </SwiperSlide>
                {/* <SwiperSlide>
                    <div className="banner-1" style={{ backgroundImage: 'url(assets/imgs/page/homepage1/banner-2.png)' }}>
                        <div className="cnt-center container">
                            <div className="row align-items-center">
                                <div className="col-lg-12">
                                    <p className="font-md color-white mb-15 wow animate__animated animate__fadeInUp" data-wow-delay=".0s">
                                        Logistics &amp; Transportation
                                    </p>
                                    <h1 className="color-white mb-25 wow animate__animated animate__fadeInUp" data-wow-delay=".0s">
                                        Digital &amp; Trusted Transport
                                        <br className="d-none d-lg-block" />
                                        Logistic Company
                                    </h1>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <p className="font-md color-white wow animate__animated animate__fadeInUp mb-20" data-wow-delay=".0s">
                                                Our experienced team of problem solvers and a commitment to always align with our client’s business goals and objectives is what drives mutual success.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="box-button mt-30 flex h-14">
                                        <Link className="btn btn-brand-1-big hover-up wow animate__animated animate__fadeInUp mr-40" href="#">
                                            Calculate Package
                                        </Link>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide> */}
            </Swiper>
            <div className="swiper-pagination swiper-pagination-banner" />
        </>
    );
}
