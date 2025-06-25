'use client';

import { useEffect, useState } from 'react';
import BackToTop from '../elements/BackToTop';
import WhatsappButton from '../elements/WhatsappButton';
import Footer from './Footer';
import Header from './Header';

import Sidebar from './MobileSidebar';
import MapSection from '../../components/MapSection';
import ProviderComponent from '@/components/layouts/provider-component';

export const metadata = {
    title: 'Blurred Ego',
    description: 'Blurred Ego',
};

export default function Layout({ headerStyle, headTitle, children, topBarStyle }) {
    const [scroll, setScroll] = useState(0);

    const [openClass, setOpenClass] = useState('');

    const handleMobileMenuOpen = () => {
        document.body.classList.add('mobile-menu-active');
        setOpenClass('sidebar-visible');
    };

    const handleMobileMenuClose = () => {
        if (openClass === 'sidebar-visible') {
            setOpenClass('');
            document.body.classList.remove('mobile-menu-active');
        }
    };

    useEffect(() => {
        document.addEventListener('scroll', () => {
            const scrollCheck = window.scrollY > 100;
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck);
            }
        });

        const WOW = require('wowjs');
        window.wow = new WOW.WOW({
            live: false,
        });
        window.wow.init();
    }, []);

    return (
        <ProviderComponent>

        <main className="main-layout">
      
            <div className="body-overlay-1" onClick={handleMobileMenuClose} />
            {!headerStyle && <Header topBarStyle={topBarStyle} scroll={scroll} handleMobileMenuOpen={handleMobileMenuOpen} />}
            {headerStyle == 1 && <Header topBarStyle={topBarStyle} scroll={scroll} handleMobileMenuOpen={handleMobileMenuOpen} />}
            <Sidebar openClass={openClass} handleMobileMenuClose={handleMobileMenuClose} />
            <main className="main-ui">{children}</main>
            
            <MapSection />
            <Footer />
               <WhatsappButton />
            <BackToTop />
        </main>
        </ProviderComponent>
    );
}
