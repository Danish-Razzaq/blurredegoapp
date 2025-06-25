'use client';
import ContentAnimation from '@/components/layouts/content-animation';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import MainContainer from '@/components/layouts/main-container';
import Overlay from '@/components/layouts/overlay';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import Sidebar from './components/sidebar';
import Portals from '@/components/portals';
import Dashboard from './dashboard/page';
import { isAuthenticated, hasManagementAccess, canAccessRoute } from '@/utils/helperFunctions';
import NotFound from '../not-found';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { apiCaller } from '@/utils/api';
import { setUsers } from '@/store/usersSlice';
import { usePathname } from 'next/navigation';

export default function DefaultLayout({ children }) {
    const pathname = usePathname();
    const dispatch = useDispatch();

    // if ((isAuthenticated() && !hasManagementAccess()) || !canAccessRoute(pathname)) {
    //     return <NotFound />;
    // }
    
    //get user data api call
    const getUsers = async () => {
        // console.log("get users");
        let result = await apiCaller('get', 'users');
        // console.log(result, 'result');
        // setUsers(result);
        if (result.err) console.log('error', result.err);
        else {
            dispatch(setUsers(result));
            // console.log("result data",result.data)
            // console.log("result data from layout",result)
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    if (pathname.match('/apps/invoice/') || pathname.match('apps/event-invoice-preview/')) {
        return (
            <>
                {!children && <Dashboard />}
                {children}
            </>
        );
    }

    return (
        <>
            {/* BEGIN MAIN CONTAINER */}
            <div className="relative">
                <Overlay />
                <ScrollToTop />

                {/* BEGIN APP SETTING LAUNCHER */}

                <MainContainer>
                    {/* BEGIN SIDEBAR */}
                    <Sidebar />
                    {/* END SIDEBAR */}
                    <div className="main-content flex min-h-screen flex-col">
                        {/* BEGIN TOP NAVBAR */}
                        <Header />
                        {/* END TOP NAVBAR */}

                        {/* BEGIN CONTENT AREA */}
                        <ContentAnimation>
                            {!children && <Dashboard />}
                            {children}
                        </ContentAnimation>
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
