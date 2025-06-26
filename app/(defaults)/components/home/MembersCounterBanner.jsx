'use client';
import { FaLocationDot } from 'react-icons/fa6';
import React, { useState, useEffect, useRef } from 'react';
import CountrySearchIcon from '@/public/icon/countrySearchIcon';
import { GrUserExpert } from 'react-icons/gr';
import membersIcon from '@/public/assets/images/members.png';
import countryIcon from '@/public/assets/images/country.png';
import cityIcon from '@/public/assets/images/city.png';

const StatItem = ({ icon, label, value, isVisible }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isVisible) {
            let startValue = 0;
            const endValue = value;
            const duration = 1000; // Duration of the animation in milliseconds
            const incrementTime = 5; // Speed of increment in milliseconds
            const step = (endValue - startValue) / (duration / incrementTime);

            const counter = setInterval(() => {
                startValue += step;
                if (startValue >= endValue) {
                    setCount(endValue);
                    clearInterval(counter);
                } else {
                    setCount(Math.ceil(startValue));
                }
            }, incrementTime);
        }
    }, [isVisible, value]);

    return (
        <div className="flex items-center pr-7">
            <div className="w-10">
                <img src={icon.src} alt="icon" className='w-full h-full'/>
            </div>
            <Separator />
            <div className="flex flex-col">
                <span className="text-4xl font-extrabold">{count}</span>
                <span className="text-4xl">{label}</span>
            </div>
        </div>
    );
};

const Separator = () => <div className="mx-4 h-20 w-px bg-red-400" />;

const StatsBanner = ({ country, city, BlurredEgo,Members }) => {
    const [isVisible, setIsVisible] = useState(false);
    const bannerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.5 }
        );

        if (bannerRef.current) {
            observer.observe(bannerRef.current);
        }

        return () => {
            if (bannerRef.current) {
                observer.unobserve(bannerRef.current);
            }
        };
    }, []);

    return (
        <div ref={bannerRef} className="memberBanner red h-full w-full   gap-5 p-4  px-5  text-white sm:justify-center">
            <StatItem icon={membersIcon} label="Members" value={BlurredEgo || 120} isVisible={isVisible} />
            <StatItem icon={countryIcon} label="Countries" value={country || 50} isVisible={isVisible} />
            <StatItem icon={cityIcon} label="Cities" value={city || 30} isVisible={isVisible} />
        </div>
    );
};

export default StatsBanner;
