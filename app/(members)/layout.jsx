'use client';
import ContentAnimation from '@/components/layouts/content-animation';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import MainContainer from '@/components/layouts/main-container';
import Overlay from '@/components/layouts/overlay';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import Sidebar from './sidebar';
import Portals from '@/components/portals';
import MemberProfile from './profile/page';
import ProviderComponent from '@/components/layouts/provider-component';
import { getUser, isAuthenticated } from '@/utils/helperFunctions';
import NotFound from '../not-found';
import { useEffect, useState } from 'react';
export default function DefaultLayout({ children }) {
    const [invoiceStatus, setInvoiceStatus] = useState(null); // Start with null to indicate loading state

    // console.log('invoiceStatus', invoiceStatus);

    // if (isAuthenticated() && invoiceStatus) {
    //     return <NotFound />;
    // }
    const user = getUser();

    const getInvoiceRecord = async () => {
        try {
            const invoice = await apiCaller('get', `invoices?filters[email][$eq]=${user?.email}&populate=*`);
            return invoice;
        } catch (error) {
            console.error('Error fetching invoice:', error);
            return null;
        }
    };

    const fetchData = async () => {
        const data = await getInvoiceRecord();
        if (data?.data?.[0]?.attributes?.received) {
            setInvoiceStatus(true);
        } else {
            setInvoiceStatus(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <title>Blurred Ego | Member</title>
            {/* BEGIN MAIN CONTAINER */}
            <div className="relative">
                <Overlay />
                <ScrollToTop />

                <MainContainer>
                    {/* BEGIN SIDEBAR */}
                    <Sidebar />
                    {/* END SIDEBAR */}
                    <div className="main-content flex min-h-screen flex-col">
                        {/* BEGIN TOP NAVBAR */}
                        <Header />
                        {/* END TOP NAVBAR */}

                        {/* BEGIN CONTENT AREA */}
                        <ProviderComponent>
                            <ContentAnimation>
                                {!children && <MemberProfile />}
                                {children}
                            </ContentAnimation>
                        </ProviderComponent>
                        {/* END CONTENT AREA */}

                        {/* BEGIN FOOTER */}
                        <Footer />
                        {/* END FOOTER */}
                        <Portals />
                    </div>
                </MainContainer>
            </div>
        </>
    );
}
