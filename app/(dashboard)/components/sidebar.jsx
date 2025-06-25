'use client';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar, toggleTheme } from '@/store/themeConfigSlice';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import IconCaretsDown from '@/public/icon/icon-carets-down';
import { canAccessRoute } from '@/utils/helperFunctions';
import { MenuItemsList } from './MenuItemsList';

const Sidebar = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const themeConfig = useSelector((state) => state.themeConfig);
    const semidark = useSelector((state) => state.themeConfig.semidark);

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul = selector.closest('ul.sub-menu');
            if (ul) {
                let ele = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    return (
        <main className={toggleTheme ? 'white' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white  dark:bg-black">
                    <div className="flex items-center justify-between px-3 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <img className="ml-[5px] w-24 flex-none" src="/assets/imgs/template/logo.png" alt="logo" />
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 dark:text-white-light dark:hover:bg-dark-light/10 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul>
                            {MenuItemsList.map(
                                (route) =>
                                    // canAccessRoute(route.path) && (
                                        <li key={route.path} className="nav-item mx-2">
                                            <Link href={route.path} className="group">
                                                <div className="flex items-center">
                                                    {route.icon}
                                                    <span className="font-normal text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{route.label}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    // )
                            )}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </main>
    );
};

export default Sidebar;
