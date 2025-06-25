'use client';
import React, { useEffect, useState } from 'react';
import BENEFITS from '../../components/BENEFITS/page';
import Process from '../../components/process/page';
import Fees from '../../components/Fees/page';
import Application from '../../components/Application/page';
import Layout from '../../components/layout/Layout';
import { isAuthenticated } from '@/utils/helperFunctions';
import NotFound from '@/app/not-found';
import MemberShipCard from '../../components/MemberShipCard';
import { useSelector } from 'react-redux';
const MemberShip = () => {
    const [activeTab, setActiveTab] = useState('Application');
    const membershipTypeRedux = useSelector((state) => state.membershipType);

    const tabs = ['Application', 'Benefits', 'Process'];

    const tabContent = {
        Application: <Application />,
        Benefits: <BENEFITS />,
        Process: <Process />,
        // Fees: <Fees />,
    };

    useEffect(() => {
        if (membershipTypeRedux.membershipTypeData.length > 0 && activeTab !== 'Application') {
            setActiveTab('Application');
        }
    }, [membershipTypeRedux.membershipTypeData]);

    // {
    //     if (!isAuthenticated()) return <NotFound />;
    // }
    return (
        <>
            <header>
                <title>Become a Member of Blurred Ego | Blurred Ego</title>
                <meta
                    name="description"
                    content="Join Blurred Ego and connect with a worldwide network of independent freight forwarders. Discover the benefits of Blurred Ego membership, from networking opportunities to resources that support growth in the logistics industry. Apply today!"
                />
            </header>
            <Layout>
                <section className="section">
                    {/* About Top Section */}
                    <div className="cnt-center container">
                        <div className="box-pageheader-1 flex flex-col items-center justify-center text-center">
                            <h2 className="mt-15 wow animate__animated animate__fadeIn mb-10 text-white ">Join Blurred Ego - Become a Member Today</h2>
                            <p className="font-md color-white wow animate__animated animate__fadeIn px-1">Unlock Exclusive Benefits and Global Opportunities</p>
                        </div>
                    </div>
                </section>

                <div className="container   mx-auto px-1  sm:px-4">
                    <div className=" mt-24 flex  flex-col flex-wrap justify-center gap-4 text-center">
                        <h3>Blurred Ego Membership</h3>
                        <p className="text-lg text-[#818692]">
                            Welcome to Blurred Ego! We are a global community that connects professionals and businesses in the logistics industry. Blurred Ego helps
                            <br className="d-none d-lg-block" />
                            create new opportunities, build valuable partnerships, and keep you updated with the latest trends and innovations in the field.
                        </p>
                    </div>
                    <div className="mt-12   overflow-x-hidden ">
                        <h4 className="mb-8 text-center text-xl font-bold ">At Blurred Ego, we offer three membership levels to suit your needs:</h4>
                        <MemberShipCard />
                        <p className=" text-center text-lg">
                            Select the membership that suits your needs and get exclusive benefits like industry events, marketing support, payment
                            <br className="d-none d-lg-block" />
                            protection, and a global logistics reach. Join Blurred Ego today and drive your business forward!
                        </p>
                    </div>

                    <div className="mt-25 gap-4  space-y-1 border-b border-gray-300">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`max-md:mt-2 mr-2 uppercase ${
                                    activeTab === tab ? 'red rounded-full border-b-2 text-white hover:bg-red-500 ' : 'rounded-full bg-gray-200  text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                <button className=" btn-lg-d 2 px-4 py-2 font-bold"> {tab}</button>
                            </button>
                        ))}
                    </div>

                    <div className="my-12 ">{tabContent[activeTab]}</div>
                </div>
            </Layout>
        </>
    );
};

export default MemberShip;
