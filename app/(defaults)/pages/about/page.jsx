'use client';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import Image from 'next/image';
import { FaCircleDot } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import useMediaQueries from './useMediaQueries';
import TeamIntroSlider from '../../components/slider/TeamIntroSlider';
export default function About() {
    const careerHighlights = [
        {
            title: 'Education',
            description: 'Master’s degree in marketing.',
        },
        {
            title: 'Career Start',
            style: 'text-nowrap',
            description: 'Began his career in 1994 in the logistics and freight industry.',
        },
        {
            title: 'Prominent Companies',
            style: 'text-nowrap absolute   ',
            description: 'Worked with MSAS (Royal Air Cargo) in Dubai, UAE, and Atlas Logistics in Singapore.',
        },
        {
            title: 'Relocation to Hong Kong',
            style: 'pt-12 absolute max-w-[60%]',
            description: 'Moved to Hong Kong in 2013 and continued his career with China Global Lines Limited.',
        },

        {
            title: 'Conference Participation',
            style: 'pt-[100px] absolute max-w-[780px]',
            description: 'Attended 99 conferences throughout his career in networks such as WCA, MLN, JC-Trans, OLO, Umbrella Network, FiveStar Network, and GKF Network.',
        },
        {
            title: 'Professional Expertise',
            style: 'pt-[170px] absolute max-w-[40%]',
            description: 'Developed extensive skills to provide exceptional service to the logistics community.',
        },
        {
            title: 'Leadership',
            style: 'pt-[240px] absolute max-w-[40%] ',
            description: 'Known for navigating both prosperous and challenging economic landscapes, amassing a wealth of professional and managerial expertise, industry insights, and connections.',
        },
    ];

    const { matches, matches2, matches3 } = useMediaQueries();

    //   console.log('isMediaQuery', isMediaQuery);
    return (
        <>
            <header>
                <title>About | Blurred Ego</title>
                <meta
                    name="description"
                    content="
           Learn about Blurred Ego (BE), a global logistics network dedicated to supporting independent freight forwarders. Discover our mission to foster collaboration, enhance capabilities, and drive growth in the global logistics industry.
"
                />
            </header>

            <Layout>
                <section className="section">
                    {/* About Top Section */}
                    <div className="cnt-center container">
                        <div className="box-pageheader-1 flex flex-col items-center justify-center text-center ">
                            <span className="btn btn-tag wow animate__animated animate__fadeIn  ">Who We Are</span>
                            <h2 className="mt-15 wow animate__animated animate__fadeIn mb-10 text-white ">About Us</h2>
                            <p className="font-md color-white wow animate__animated animate__fadeIn px-1">
                                Connecting freight forwarders worldwide, our platform fosters networking,
                                <br className="d-none d-lg-block" />
                                <span> collaboration, and business opportunities within the logistics industry. </span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Meet the President Section */}
                <section className="section mt-100 position-relative ">
                    <h1 className="color-primary-main wow animate__animated animate__fadeIn mb-[45px] text-center">Meet the President</h1>
                    <div className="cnt-center container">
                        {!matches3 ? (
                            <div className="presidentSection  flex  min-h-full  justify-between text-lg  max-lg:gap-4  ">
                                <div className="w-full break-words text-start xl:w-[50%] ">
                                    <h3 className="color-primary-main color-brand-1 wow  animate__animated animate__fadeIn absolute mb-4">A Visionary Leader in Freight & Logistics Industry</h3>
                                    <div className="font-md color-grey-900 wow animate__animated animate__fadeIn my-16">
                                        <p className={`text-lg  ${!matches2 ? 'absolute mb-20 max-w-[960px]' : ''}`}>
                                            Mr. Sohrab Khan is a highly accomplished professional in the logistics and freight forwarding industry with over 30 years of experience. Here's a summary of
                                            his impressive career:
                                        </p>

                                        <ul className={`mb-6 space-y-3 pl-2 ${matches2 ? 'pt-[17px]' : 'pt-[80px]'} `}>
                                            {careerHighlights.map((highlight, index) => (
                                                <li key={index} className={`${!matches2 ? highlight?.style : ''} flex items-start justify-start gap-2 `}>
                                                    <span className="mt-1">
                                                        <FaCircleDot className="color-brand-1" />
                                                    </span>
                                                    <span className="w-full">
                                                        <span className="mr-1 font-bold"> {highlight.title}: </span>
                                                        {highlight.description}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        {matches ? (
                                            <p className="color-grey-900 wow animate__animated animate__fadeIn text-lg ">
                                                Mr. Khan's rich background positions him as a distinguished leader in networking within the freight forwarding sector. His experience and dedication to
                                                the industry have made him a valuable asset to the logistics community.
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                <div className=" relative flex w-full items-end justify-end p-0">
                                    <div className="flex h-full w-full items-center ">
                                        <Image
                                            className="animate__animated animate__fadeIn h-full w-full object-fill lg:rounded-r-[20px] "
                                            src="/assets/imgs/page/about/shorab.webp"
                                            alt="Mr. Sohrab Khan - President"
                                            width={1600}
                                            height={400}
                                        />
                                    </div>
                                    <div className="quote-center shape-2" />
                                </div>
                            </div>
                        ) : (
                            <img
                                className="animate__animated animate__fadeIn h-full w-full object-fill shadow-none  "
                                src="/assets/imgs/page/about/intro.webp"
                                alt="Mr. Sohrab Khan - President Into"
                            />
                        )}
                        {!matches2 ? (
                            <p className=" presidentText font-md color-grey-900 wow animate__animated animate__fadeIn mb-20 max-w-[65%]    ">
                                Mr. Khan's rich background positions him as a distinguished leader in networking within the freight forwarding sector. His experience and dedication to the industry
                                have made him a valuable asset to the logistics community.
                            </p>
                        ) : null}
                    </div>
                </section>

                {/* Team intro section */}
                <section className="section  mt-14">
                    <div className="cnt-center container overflow-hidden">
                        <h1 className="color-primary-main wow animate__animated animate__fadeIn mb-[40px] text-center">Leadership That Moves the World</h1>
                        <p className="font-md color-grey-900 wow animate__animated animate__fadeIn mx-auto mb-20 max-w-2xl text-center">
                            Discover the team steering our commitment to excellence in logistics and collaboration.
                        </p>
                        <TeamIntroSlider />
                    </div>
                </section>

                {/* Simplifying complex shipping challenges Section */}
                <section className="section mt-100 ">
                    <div className="cnt-center container">
                        <div className="row flex items-center  justify-between  ">
                            <div className="mb-30     lg:w-[45%]">
                                <h2 className="color-primary-main mb-25 wow animate__animated animate__fadeIn">Who We Are</h2>
                                <p className="font-md color-grey-900 wow animate__animated animate__fadeIn mb-20">
                                    Blurred Ego is a network of independent freight forwarders dedicated to excellence in logistics. Our alliance represents a powerful collective logistics expertise,
                                    resources, and innovation. Our members benefit from the strength of a global network while maintaining the agility and personalized service that independent
                                    forwarders are known for.
                                </p>
                            </div>
                            <div className="col-lg-6 position-relative max-lg:mb-36 ">
                                <div className="row align-items-end lg:gap-4">
                                    <div className="col-md-5 col-sm-5 lg:w-[38%] ">
                                        <img className=" wow animate__animated animate__fadeIn mb-20" src="/assets/imgs/page/about/img-about-1-1.webp" alt="Blurred Ego" />
                                        <img className=" wow animate__animated animate__fadeIn" src="/assets/imgs/page/about/img-about-1-2.webp" alt="Blurred Ego" />
                                    </div>
                                    <div className="col-lg-7 col-md-7 col-sm-7">
                                        <img className="wow animate__animated animate__fadeIn h-fit w-fit" src="/assets/imgs/page/about/img-about-1-3.webp" alt="Blurred Ego" />
                                    </div>
                                </div>
                                <div className="quote-center shape-2" />
                            </div>
                        </div>
                    </div>
                </section>
                {/* Globally Connected by Large Network Section */}
                <section className="section  mb-50">
                    <div className="cnt-center container">
                        <div className="row align-items-center item-about-2 order-revers">
                            <div className="col-lg-6 position-relative">
                                <Image className="wow animate__animated animate__fadeIn h-fit w-fit" src="/assets/imgs/page/about/img-about-2-1.webp" alt="Blurred Ego" width={774} height={541} />
                                <div className="quote-center shape-2" />
                            </div>
                            <div className="col-lg-6">
                                <div className="box-info-aabout-2">
                                    <span className="btn btn-tag-red wow animate__animated animate__fadeIn w-fit">Vision</span>
                                    <h2 className="color-primary-main mt-15 mb-25 wow animate__animated animate__fadeIn">Our Vision</h2>
                                    <p className="font-md color-grey-900 wow animate__animated animate__fadeIn mb-20">
                                        To be the leading global network that transforms the logistics industry through innovation, collaboration, and exceptional service, enabling our members to
                                        achieve unparalleled success.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center item-about-2 item-about-2-revert ">
                            <div className="col-lg-6">
                                <div className="box-info-aabout-2">
                                    <span className="btn btn-tag-red wow animate__animated animate__fadeIn w-fit">Mission</span>
                                    <h2 className="color-primary-main mt-15 mb-25 wow animate__animated animate__fadeIn">Our Mission</h2>
                                    <p className="font-md color-grey-900 wow animate__animated animate__fadeIn mb-20">
                                        Our mission at Blurred Ego is to empower independent freight forwarders with global connections, robust financial protection, and growth-enhancing tools. We foster
                                        networking and collaboration, provide comprehensive support, and innovate with advanced logistics solutions and educational initiatives through the Blurred Ego Academy.
                                    </p>
                                    <div className="box-button mt-40 flex">
                                        <Link className="btn btn-brand-2 wow animate__animated animate__fadeIn mr-20" href="/pages/contact">
                                            Contact Us
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 position-relative">
                                <Image className="wow animate__animated animate__fadeIn h-fit w-fit" src="/assets/imgs/page/about/img-about-2-2.webp" alt="Blurred Ego" width={774} height={541} />
                                <div className="quote-center shape-2" />
                            </div>
                        </div>
                        <div className="row align-items-center item-about-2 order-revers">
                            <div className="col-lg-6 position-relative">
                                <Image className="wow animate__animated animate__fadeIn h-fit w-fit" src="/assets/imgs/page/about/img-about-2-3.webp" alt="Blurred Ego" width={774} height={541} />
                                <div className="quote-center shape-2" />
                            </div>
                            <div className="col-lg-6">
                                <div className="box-info-aabout-2">
                                    <span className="btn btn-tag-red wow animate__animated animate__fadeIn w-fit">Why Blurred Ego</span>
                                    <h2 className="color-primary-main mt-15 mb-25 wow animate__animated animate__fadeIn">Why Choose Blurred Ego</h2>
                                    <p className="font-md color-grey-900 wow animate__animated animate__fadeIn mb-20">
                                        Join Blurred Ego to amplify your reach and capabilities through our powerful global network. Benefit from exclusive services designed to support and enhance your
                                        business. Be part of a community that values collaboration, integrity, and mutual success. Leverage the latest tools and technologies to stay ahead in the
                                        logistics industry.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section mt-55 bg-1 position-relative py-20">
                    <div className="cnt-center color-main container space-y-3 text-center">
                        <h3 className="text-white">SHORT OF CUSTOMER?</h3>
                        <h4 className="font-normal text-white">Welcome to Join Blurred Ego Blurred Ego</h4>
                    </div>
                </section>

                {/* Proud to Deliver Excellence Every Time Section */}
                {/* <section className="section mt-55 bg-1 position-relative pt-90 pb-90">
                <div className="container cnt-center">
                    <div className="row">
                        <div className="col-lg-6 color-main">
                            <span className="btn btn-tag wow animate__animated animate__fadeIn w-fit" style={{color:'black', fontWeight:'bold'}}>Get in touch</span>
                            <h3 className=" mt-15 color-main wow animate__animated animate__fadeIn mb-20">
                                Proud to Deliver
                                <br className="d-none d-lg-block" />
                                Excellence Every Time
                            </h3>
                            <p className="font-md  wow animate__animated animate__fadeIn mb-40">
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit laborum — semper quis lectus nulla. Interactively transform magnetic growth
                                strategies whereas prospective "outside the box" thinking.
                            </p>
                            <div className="row">
                                <div className="col-lg-6 mb-30 ">
                                    <h6 className="chart-title color-main font-md-bold  wow animate__animated animate__fadeIn">Boost your sale</h6>
                                    <p className="font-xs  wow animate__animated animate__fadeIn">The latest design trends meet hand-crafted templates.</p>
                                </div>
                                <div className="col-lg-6 mb-30">
                                    <h6 className="feature-title color-main font-md-bold  wow animate__animated animate__fadeIn">Introducing New Features</h6>
                                    <p className="font-xs  wow animate__animated animate__fadeIn">The latest design trends meet hand-crafted templates.</p>
                                </div>
                            </div>
                            <div className="mt-20 flex">
                                <Link className="btn btn-brand-2 wow animate__animated animate__fadeIn mr-20 " style={{backgroundColor:'white', color:'red', fontWeight:'bold'}} href="/pages/contact">
                                    Contact Us
                                </Link>
                                <Link className="btn btn-link-medium text-white wow animate__animated animate__fadeIn" href="#">
                                    Learn More
                                    <svg className="icon-16 ml-5 h-6 w-6  text-white" fill="white" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box-image-touch box-image-info-2-2" />
            </section>
           */}
            </Layout>
        </>
    );
}
