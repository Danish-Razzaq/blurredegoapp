'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/app/(defaults)/components/layout/Layout';
import ServicesSliderCard from '../../../components/slider/ServicesSliderCard';
import Image from 'next/image';
import { ServicesDetailsData } from '@/utils/ServicesDetailsPageData';
import NotFound from '@/app/not-found';
import Link from 'next/link';

const ServicesDetails = () => {
    const { slug } = useParams();
    // console.log(slug);
    // console.log(ServicesDetailsData);
    const data = ServicesDetailsData.find((data) => data.slugValue === slug);

    if (!data) {
        return (
            <Layout>
                <NotFound />
            </Layout>
        );
    }
    //   console.log(data);
    return (
        <>
            <title>{data?.title}</title>

            <Layout>
                <div className=" cnt-center container space-y-8">
                    <>
                        {/* Services Details Top Section */}
                        <section className="section">
                            <div
                                className=" flex flex-col items-center justify-center text-center"
                                style={{
                                    background: `rgba(31, 20, 15, 1) url(${data.topBackgroundImg}) no-repeat top center`,
                                    backgroundSize: 'cover',
                                    padding: '150px 0px',
                                }}
                            >
                                <h3 className=" wow animate__animated animate__fadeIn text-white  ">{data.title}</h3>
                                <p className="font-md color-white wow animate__animated animate__fadeIn px-1">{data.TopHeading}</p>
                            </div>
                        </section>
                        {/* Services Details Bottom Description Section */}
                        <div className="flex flex-col items-center text-center ">
                            <h3 className="wow  animate__animated animate__fadeIn mb-4 text-4xl ">{data.title}</h3>
                            <p className="font-md  wow animate__animated animate__fadeIn max-w-[800px] px-1">{data.description}</p>
                        </div>
                        {/*  Images of Details page */}
                        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-5 ">
                            <div className="col-xl-6 col-lg-6 mb-30 ">
                                <div className="box-images-pround">
                                    <div className=" wow animate__animated animate__fadeIn">
                                        <img className="img-main" src={data.leftImg} alt="Blurred Ego" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 mb-30">
                                <div className="box-images-pround relative ">
                                    <div className=" wow animate__animated animate__fadeIn ">
                                        <img className="img-main" src={data.RightImg} alt="Blurred Ego" />
                                    </div>
                                    <div className="quote-center shape-2" style={{ left: '70%' }} />
                                </div>
                            </div>
                        </div>
                        {/*  why choice our brand section */}
                        <div className="row mt-50 justify-between ">
                            <div className="col-xl-7 col-lg-7  mb-30">
                                <h3 className="pb-2"> {data.BrandTitle}</h3>

                                {data.BrandSection.map((brand) => (
                                    <ul className="brandSection mt-6 flex  items-start   " key={brand.id}>
                                        <div className="brandIcon">
                                            <img src={brand.image} alt="img" />
                                        </div>
                                        <li className="wow animate__animated animate__fadeIn ">
                                            <div className="info-how flex flex-col gap-2 ">
                                                <h5>{brand.title}</h5>
                                                <p className=" color-grey-700 col-xl-10 col-lg-10" style={{ fontSize: '16px' }}>
                                                    {brand.description}
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                ))}
                            </div>
                            <div className="col-xl-4 col-lg-4 mb-30">
                                <div className="box-images-pround">
                                    <div className=" wow animate__animated animate__fadeIn">
                                        <img className="img-main" src={data.BrandImg} alt="Blurred Ego" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  goal of services section */}
                        <div className=" flex items-center justify-center">
                            <p className="font-md  wow animate__animated animate__fadeIn max-w-[800px] px-1 text-center">{data.goalServiceHeading}</p>
                        </div>
                    </>

                    {/*  our services slider */}
                    <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-5 ">
                        <Link href={'/pages/benefits'} className="btn btn-tag-red wow animate__animated animate__fadeIn p-3">
                            Our Services
                        </Link>
                    </div>
                    <section className="section mt-50 ">
                        <div className="cnt-center container">
                            <div className="swiper-container swiper-group-3-customers pb-50">
                                <ServicesSliderCard />
                            </div>
                        </div>
                    </section>
                </div>
            </Layout>
        </>
    );
};

export default ServicesDetails;
