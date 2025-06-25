'use client';
import { useState } from 'react';

export default function Accordion() {
    const [isActive, setIsActive] = useState({
        status: false,
        key: 1,
    });

    const handleToggle = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
            });
        } else {
            setIsActive({
                status: true,
                key,
            });
        }
    };
    return (
        <>
            <div className="accordion" id="accordionFAQ">
                <div className="accordion-item wow animate__animated animate__fadeIn">
                    <h5 className="accordion-header" onClick={() => handleToggle(1)}>
                        <button className={isActive.key == 1 ? 'accordion-button text-heading-5 ' : 'accordion-button text-heading-5 collapsed'}>What is the main purpose of your platform?</button>
                    </h5>
                    <div className={isActive.key == 1 ? 'accordion-collapse' : 'accordion-collapse collapse'}>
                        <div className="accordion-body">
                            Our platform is designed to connect freight forwarders from around the globe, facilitating networking, collaboration, and business opportunities within the logistics and
                            freight forwarding industry.
                        </div>
                    </div>
                </div>
                <div className="accordion-item wow animate__animated animate__fadeIn">
                    <h5 className="accordion-header" onClick={() => handleToggle(2)}>
                        <button className={isActive.key == 2 ? 'accordion-button text-heading-5 ' : 'accordion-button text-heading-5 collapsed'}>
                            What benefits do members receive by joining your network?
                        </button>
                    </h5>
                    <div className={isActive.key == 2 ? 'accordion-collapse' : 'accordion-collapse collapse'}>
                        <div className="accordion-body">
                        Members benefit from a global network of freight forwarders, including features like cargo insurance, payment protection, and marketing to over 20,000 industry professionals. These resources are designed to enhance operational efficiency and expand business reach.
                        </div>
                    </div>
                </div>
                <div className="accordion-item wow animate__animated animate__fadeIn">
                    <h5 className="accordion-header" onClick={() => handleToggle(3)}>
                        <button className={isActive.key == 3 ? 'accordion-button text-heading-5 ' : 'accordion-button text-heading-5 collapsed'}>
                            How can I become a member and join your network?
                        </button>
                    </h5>
                    <div className={isActive.key == 3 ? 'accordion-collapse' : 'accordion-collapse collapse'}>
                        <div className="accordion-body">
                        You can join our network by signing up through our website. Once registered, you'll be able to connect with other freight forwarders worldwide and access all our resources and services.
                        </div>
                    </div>
                </div>
                <div className="accordion-item wow animate__animated animate__fadeIn">
                    <h5 className="accordion-header" onClick={() => handleToggle(4)}>
                        <button className={isActive.key == 4 ? 'accordion-button text-heading-5 ' : 'accordion-button text-heading-5 collapsed'}>
                        Does your platform provide payment protection?
                        </button>
                    </h5>
                    <div className={isActive.key == 4 ? 'accordion-collapse' : 'accordion-collapse collapse'}>
                        <div className="accordion-body">
                        Yes, our platform offers a payment protection plan, which can be opted for during the sign-up process. This ensures your transactions are secure, giving peace of mind to all users.

                        </div>
                    </div>
                </div>
                <div className="accordion-item wow animate__animated animate__fadeIn">
                    <h5 className="accordion-header" onClick={() => handleToggle(5)}>
                        <button className={isActive.key == 5 ? 'accordion-button text-heading-5 ' : 'accordion-button text-heading-5 collapsed'}>
                        How many members do you enroll from each country?
                        </button>
                    </h5>
                    <div className={isActive.key == 5 ? 'accordion-collapse' : 'accordion-collapse collapse'}>
                        <div className="accordion-body">
                        Enrollment numbers are limited by country and depend on specific cities within that region. This ensures a balanced distribution of members based on city size and demand.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
