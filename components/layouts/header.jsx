'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleTheme, toggleSidebar, toggleRTL } from '@/store/themeConfigSlice';
import Dropdown from '@/app/(dashboard)/components/Dropdown';
import IconMenu from '@/public/icon/icon-menu';
import IconSearch from '@/public/icon/icon-search';
import IconXCircle from '@/public/icon/icon-x-circle';
import IconSun from '@/public/icon/icon-sun';
import IconMoon from '@/public/icon/icon-moon';
import IconLaptop from '@/public/icon/icon-laptop';
import IconBellBing from '@/public/icon/icon-bell-bing';
import IconUser from '@/public/icon/icon-user';
import IconLogout from '@/public/icon/icon-logout';
import IconMenuDashboard from '@/public/icon/menu/icon-menu-dashboard';
import IconCaretDown from '@/public/icon/icon-caret-down';
import IconMenuForms from '@/public/icon/menu/icon-menu-forms';
import { usePathname, useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import IconCaretsDown from '@/public/icon/icon-carets-down';
import IconMenuMembers from '@/public/icon/menu/icon-menu-members';
import IconMenuInvoice from '@/public/icon/menu/icon-menu-invoice';
import AnimateHeight from 'react-animate-height';
import IconMenuNotes from '@/public/icon/menu/icon-menu-notes';
import IconSettings from '@/public/icon/icon-settings';
import { getUser, removeUser } from '@/utils/helperFunctions';
import { CgProfile } from 'react-icons/cg';
import { FiLogOut } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
const Header = () => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            const all = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }

            let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
            for (let i = 0; i < allLinks.length; i++) {
                const element = allLinks[i];
                element?.classList.remove('active');
            }
            selector?.classList.add('active');

            const ul = selector.closest('ul.sub-menu');
            if (ul) {
                let ele = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [pathname]);

    const isRtl = useSelector((state) => state.themeConfig.rtlClass) === 'rtl';

    const themeConfig = useSelector((state) => state.themeConfig);
    const setLocale = (flag) => {
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
        router.refresh();
    };

    const getRole = (roleObj) => {
        const roleKey = Object.keys(roleObj || {}).find((key) => roleObj[key] === true);
        console.log('roleKey', roleKey);

        switch (roleKey) {
            case 'memberManager':
                return 'Admin';
            case 'hasManagementRole':
                return 'Management';
            default:
                return 'Blurred Ego Member';
        }
    };

    // use user data from redux store
    const user = getUser();
    // console.log("user data from header component", user);

    return (
        <main className={toggleTheme ? 'white' : ''}>
            <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
                <div className="shadow-sm">
                    <div className="relative flex w-full items-center  px-4 py-2.5   dark:bg-black">
                        <div className="horizontal-logo flex items-center justify-between lg:hidden ltr:mr-2 rtl:ml-2">
                            <Link href="/" className="main-logo flex shrink-0 items-center">
                                <img className="inline w-24 ltr:-ml-1 rtl:-mr-1" src="/assets/imgs/template/logo.png" alt="logo" />
                            </Link>

                            <button
                                type="button"
                                className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2  hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden ltr:ml-2 rtl:mr-2"
                                onClick={() => dispatch(toggleSidebar())}
                            >
                                <IconMenu className="h-5 w-5 dark:text-white" />
                            </button>
                        </div>

                        <div className="flex items-center space-x-1.5 dark:text-[#d0d2d6] sm:flex-1 lg:space-x-2 ltr:ml-auto ltr:sm:ml-0 rtl:mr-auto rtl:space-x-reverse sm:rtl:mr-0">
                            <div className="sm:ltr:mr-auto sm:rtl:ml-auto"></div>

                            <div className="dropdown flex shrink-0">
                                <Dropdown
                                    offset={[0, 8]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="relative group block"
                                    button={<FaUserCircle className="h-9 w-9 text-red-500 transition duration-200 group-hover:text-red-600" />}
                                >
                                    <ul className="w-[230px] py-2 font-medium text-dark dark:text-white-dark dark:text-white-light/90">
                                        <li className="border-b border-gray-200 px-2 py-4 dark:border-white-light/10">
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                {/* Optional avatar */}
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-400 dark:bg-white-light/10">
                                                    {(user?.name || 'Jone Shema').charAt(0).toUpperCase()}
                                                </div>

                                                <div className="truncate text-left">
                                                    <h4 className="text-base font-semibold text-dark dark:text-white">{user?.name || 'JOne SHhema'}</h4>
                                                    <button type="button" className="text-sm text-gray-500 transition hover:text-primary dark:text-gray-400 dark:hover:text-white">
                                                        {user?.email || 'jone@gmail.com'}
                                                    </button>
                                                    <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-300">{'Administrator' || getRole(user?.role)}</p>
                                                </div>
                                            </div>
                                        </li>

                                        <li>
                                            <Link href="/" className="mx-2 flex items-center rounded-md px-4 py-3 text-danger transition hover:bg-red-50 dark:hover:bg-red-500/10" onClick={removeUser}>
                                                <FiLogOut className="mr-2 h-5 w-5" />
                                                Sign Out
                                            </Link>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </main>
    );
};

export default Header;
