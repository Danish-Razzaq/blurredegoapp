'use client';
import Link from 'next/link';
import { isAuthenticated, hasManagementAccess } from '@/utils/helperFunctions';
import { usePathname } from 'next/navigation';

export default function Menu() {
    const pathname = usePathname();

    const styles = {
        link: `rounded-full py-2 px-3 text-black-500 hover:text-primary [&.active]:bg-primary/15 [&.active]:text-primary`,
    };
    return (
        <>
            <ul className={`main-menu flex items-center text-nowrap  py-3`}>
                <li>
                    <Link className={`${styles.link} ${pathname === '/' ? 'active' : ''}`} href="/">
                        Home
                    </Link>
                </li>
                <li>
                    <Link className={`${styles.link} ${pathname === '/pages/about' ? 'active' : ''}`} href="/pages/about">
                        About Us
                    </Link>
                </li>
                <li>
                    <Link className={`${styles.link} ${pathname === '/pages/benefits' ? 'active' : ''}`} href="/pages/benefits">
                        Benefits
                    </Link>
                </li>
                <li>
                    <Link className={`${styles.link} ${pathname === '/pages/events' ? 'active' : ''}`} href="/pages/events">
                        Events
                    </Link>
                </li>
                <li>
                    <Link className={`${styles.link} ${pathname === '/pages/blogs' ? 'active' : ''}`} href="/pages/blogs">
                        News
                    </Link>
                </li>
                <li>
                    <Link className={`${styles.link} ${pathname === '/pages/contact' ? 'active' : ''}`} href="/pages/contact">
                        Contact Us
                    </Link>
                </li>
                {/* {isAuthenticated() && ( */}
                    <>
                        <li>
                            <Link className={`${styles.link} ${pathname === '/member' ? 'active' : ''}`} href="/member">
                                Members
                            </Link>
                        </li>
                        {/* {hasManagementAccess() && ( */}
                            <li>
                                <Link className="bg-primary ml-2 rounded-full border-2 border-green-700 p-2  px-3  text-white" href="/pages/dashboard">
                                    Dashboard
                                </Link>
                            </li>
                        {/* )} */}
                    </>
                {/* )} */}
            </ul>
        </>
    );
}
