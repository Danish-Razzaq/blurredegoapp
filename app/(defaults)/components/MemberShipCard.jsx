import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setMembershipTypeData } from '@/store/membershipTypeSlice';
import { useSelector } from 'react-redux';
import { apiCallerWithStatusCode } from '@/utils/api';

const pricingData = [
    {
        title: 'Founding',
        yearlyPrice: 1949,
        features: [
            { text: 'Reserve Seat for Next 3 Conferences', available: true },
            { text: 'Monthly Email Marketing for 1 Year', available: true },
            { text: 'Payment Protection', available: true },
            { text: 'Blurred Ego Insurance', available: true },
            { text: 'Networking Events', available: true },
            { text: 'Global Reach', available: true },
            { text: 'Industry Update', available: true },
        ],
    },
    {
        title: 'Platinum',
        monthlyPrice: 89,
        yearlyPrice: 1549,
        features: [
            // { text: 'Reserve Seat for Next 3 Conferences', available: false },
            { text: 'Monthly Email Marketing for 1 Year', available: true },
            { text: 'Payment Protection', available: true },
            { text: 'Blurred Ego Insurance', available: true },
            { text: 'Networking Events', available: true },
            { text: 'Global Reach', available: true },
            { text: 'Industry Update', available: true },
        ],
    },
    {
        title: 'Gold',
        yearlyPrice: 1349,
        features: [
            // { text: 'Reserve Seat for Next 3 Conferences', available: false },
            // { text: 'Monthly Email Marketing for 1 Year', available: false },
            { text: 'Payment Protection', available: true },
            { text: 'Blurred Ego Insurance', available: true },
            { text: 'Networking Events', available: true },
            { text: 'Global Reach', available: true },
            { text: 'Industry Update', available: true },
        ],
    },
    // {
    //     title: 'Silver',
    //     yearlyPrice: 999,
    //     features: [
    //         // { text: 'Reserve Seat for Next 3 Conferences', available: false },
    //         // { text: 'Monthly Email Marketing for 1 Year', available: false },
    //         // { text: 'Payment Protection', available: false },
    //         { text: 'Blurred Ego Insurance', available: true },
    //         { text: 'Networking Events', available: true },
    //         { text: 'Global Reach', available: true },
    //         { text: 'Industry Update', available: true },
    //     ],
    // },
];

const CheckIcon = () => (
    <svg className="icon-16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        ></path>
    </svg>
);

const ArrowIcon = () => (
    <svg className="icon-16 ml-10 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

const Cards = ({ plan, isPopular, onHover, onLeave, prices }) => {
    const dispatch = useDispatch();

    const savedTypeLocalStorage = (title) => {
        dispatch(setMembershipTypeData(title));
    };

    return (
        <div className=" wow animate__animated animate__fadeIn animate__delay-100 group">
            <div
                className={`card-plan hover-up relative flex flex-col justify-between overflow-hidden  
          ${isPopular ? 'popular from-primary-100/80 to-primary-400/80 scale-105 bg-gradient-to-br shadow-xl' : 'scale-100  '}
          transform transition-all duration-1000 ease-out
          hover:-translate-y-6 hover:scale-105 hover:shadow-2xl`}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                style={{
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                }}
            >
                <div className="DetailsSection">
                    <h3 className={`${isPopular ? 'color-brand-2' : 'color-primary-main'} title-plan text-center`}>{plan.title}</h3>

                    <hr className={`h-2 transition-all duration-300 ease-in-out ${!isPopular ? 'bg-black' : 'bg-white'}`} />

                    <div className="item-price-plan pt-4">
                        <div className="for-month display-month">
                            <h3 className={`${isPopular ? 'color-brand-2' : 'color-primary-main'} d-inline-block`}>
                                $<span>{prices?.filter((item) => item?.name.toLowerCase() === plan?.title.toLowerCase()).map((item) => item?.amount) || plan.yearlyPrice}</span>
                            </h3>
                            <span className={`${isPopular ? 'color-brand-2' : 'color: rgb(7, 5, 3);'} font-sm`}>/year</span>
                        </div>
                    </div>
                    <div className="mb-3 mt-4">
                        <ul className="list-ticks list-ticks-2">
                            {plan.features.map((feature, index) => (
                                <li key={index}>
                                    <CheckIcon /> {feature.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="buttonSection">
                    <Link
                        className="btn btn-brand-2-full hover-up transition-all duration-300 ease-in-out"
                        href="#startFormFillingId"
                        style={{ backgroundColor: isPopular ? 'transparent' : '' }}
                        onClick={() => savedTypeLocalStorage(plan.title)}
                    >
                        Get Started
                        <ArrowIcon />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function MemberShipCard() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const membershipTypeRedux = useSelector((state) => state.membershipType);
    const [settings, setSettings] = useState(null);

    const getSettings = async () => {
        const response = await apiCallerWithStatusCode('get', 'settings');
        setSettings(response?.data?.data[0]?.attributes?.membershipType);
    };

    useEffect(() => {
        getSettings();
    }, []);

    useEffect(() => {
        const applicationData = window.localStorage.getItem('applicationDraft');
        if (applicationData) {
            const applicationDataParsed = JSON.parse(applicationData);

            if (applicationDataParsed.membershipType) {
                switch (applicationDataParsed.membershipType) {
                    case 'Founding':
                        setHoveredIndex(0);
                        break;
                    case 'Platinum':
                        setHoveredIndex(1);
                        break;
                    case 'Gold':
                        setHoveredIndex(2);
                        break;
                    case 'Silver':
                        setHoveredIndex(3);
                        break;
                    default:
                        setHoveredIndex(1);
                }
            }
        }
    }, [window.localStorage.getItem('applicationDraft') || membershipTypeRedux]);

    return (
        <section className="section pb-10 pt-2">
            <div className="container mx-auto">
                <div className="mt-50 flex items-center justify-center">
                    {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4  "> */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ">
                        {pricingData.map((plan, index) => (
                            <Cards key={index} plan={plan} isPopular={hoveredIndex === index} onHover={() => setHoveredIndex(index)} onLeave={() => setHoveredIndex(null)} prices={settings} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
