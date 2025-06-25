'use client';
import React from 'react';
import Hero from '../../components/home/Hero';
import Brands from '../../components/home/Brands';
import Services from '../../components/home/Services';
import Info1 from '../../components/home/globalLogistes';
import Faqs1 from '../../components/home/Faqs';
import Cta1 from '../../components/home/Cta';
import WorldMap from '../../components/home/WorldMap';
const Home = () => {
    return (
        <>
            <header>
                <title>Blurred Ego</title>
                <meta
                    name="description"
                    content="Join Blurred Ego (BE) to connect with a global logistics network that empowers independent freight forwarders. Together, we create new opportunities for growth and collaboration in the competitive logistics industry."
                />
            </header>
            <section className="overflow-x-hidden">
                <Brands />
                <Hero />
                <Services />
                <Info1 />
                <Cta1 />
                <Faqs1 />
                <WorldMap />
            </section>
        </>
    );
};

export default Home;
