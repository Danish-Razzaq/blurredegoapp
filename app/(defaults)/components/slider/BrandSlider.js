'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BrandSlider() {
    // const [brandImages, setBrandImages] = useState([
    //     { attributes: { MemberLogo: { data: { attributes: { url: "" } } } }, alt: '' }, // Placeholder for static logo to move the slider
    // ]);
    // console.log('BrandSlider component rendered', brandImages);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const imgUrl = 'https://dashboard.Blurred Egohkg.com';

    // const getBrandImages = async () => {
    //     try {
    //        const response = await axios.get(`${'https://dashboard.Blurred Egohkg.com/api'}/member-logos?populate=*`);
    //         setBrandImages(response?.data?.data);
    //         // console.log('response brand ', response?.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // useEffect(() => {
    //     getBrandImages();
    // }, []);

    const brandImagesLogos = [
        {
            url: 'assets/imgs/slider/slider/logoimg (1).png',
            alt: 'Brand Logo 12121', 
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (2).png',
            alt: 'Brand Logo 2',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (3).png',
            alt: 'Brand Logo 3',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (4).png',
            alt: 'Brand Logo 4',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (5).png',
            alt: 'Brand Logo 5',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (6).png',
            alt: 'Brand Logo 6',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (7).png',
            alt: 'Brand Logo 7',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (8).png',
            alt: 'Brand Logo 8',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (9).png',
            alt: 'Brand Logo 9',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (10).png',
            alt: 'Brand Logo 10',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (11).png',
            alt: 'Brand Logo 11',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (12).png',
            alt: 'Brand Logo 12',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (13).png',
            alt: 'Brand Logo 12',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (14).png',
            alt: 'Brand Logo 12',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (15).png',
            alt: 'Brand Logo 12',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (16).png',
            alt: 'Brand Logo 12',
        },
        {
            url: 'assets/imgs/slider/slider/logoimg (17).png',
            alt: 'Brand Logo 13',
        },
    ];

    return (
        <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={8}
            spaceBetween={30}
            loop={true}
            speed={800} // Increased speed for smoother transitions
            autoplay={{
                delay: 800, // Adjusted delay for a better visual experience
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            pagination={{
                clickable: true,
                el: '.swiper-pagination-banner',
            }}
            breakpoints={{
                320: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                575: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                },
                767: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                },
                991: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                },
                1199: {
                    slidesPerView: 6,
                    spaceBetween: 30,
                },
                1350: {
                    slidesPerView: 8,
                    spaceBetween: 30,
                },
            }}
            className="swiper-wrapper wow animate__animated animate__fadeIn"
        >
            {brandImagesLogos?.map((brand, index) => (
                <SwiperSlide key={index}>
                    <img src={`${brand?.url}`} alt={brand.alt} className="h-auto w-full" />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
