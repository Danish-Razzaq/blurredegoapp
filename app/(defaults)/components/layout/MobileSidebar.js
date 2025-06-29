'use client';
import { hasManagementAccess, isAuthenticated, removeUser } from '@/utils/helperFunctions';
import Link from 'next/link';
import { useState } from 'react';
import { SlLogout } from 'react-icons/sl';

export default function Sidebar({ openClass, handleMobileMenuClose }) {
    const [isActive, setIsActive] = useState({
        status: false,
        key: '',
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

    const handleLogoutAndCloseMenu = () => {
        removeUser(); // Call the second function
        handleMobileMenuClose(); // Call the first function
    };

    return (
        <>
            <div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar ${openClass}`}>
                <div className="mobile-header-wrapper-inner">
                    <div className="mobile-header-content-area">
                        <div className="mobile-logo ">
                            <Link className="btn btn-brand-1 hover-up w-40" href="/register" onClick={handleMobileMenuClose}>
                                <svg fill="none" stroke="currentColor" strokeWidth="1.5" width={20} height={20} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                                    ></path>
                                </svg>
                                Join Us
                            </Link>
                        </div>
                        <div className="burger-icon burger-close " onClick={handleMobileMenuClose}>
                            <span className="burger-icon-top" />
                            <span className="burger-icon-mid" />
                            <span className="burger-icon-bottom" />
                        </div>
                        <div className="perfect-scroll">
                            <div className="mobile-menu-wrap mobile-header-border">
                                <nav className="mt-15">
                                    <ul className="mobile-menu font-heading w-full space-y-2 text-center">
                                        <li className={isActive.key == 1 ? 'has-children active' : 'has-children'} onClick={() => handleToggle(1)}>
                                            <Link className="active" href="/">
                                                Home
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/about">About</Link>
                                        </li>
                                        <li className={isActive.key == 2 ? 'has-children active' : 'has-children'} onClick={() => handleToggle(2)}>
                                            <Link href="/pages/benefits">Benefits</Link>
                                        </li>
                                        <li className={isActive.key == 3 ? 'has-children active' : 'has-children'} onClick={() => handleToggle(3)}>
                                            <Link href="/pages/events">Events</Link>
                                        </li>
                                        <li className={isActive.key == 4 ? 'has-children active' : 'has-children'} onClick={() => handleToggle(4)}>
                                            <Link href="/pages/blogs">News</Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/contact">Contact</Link>
                                        </li>
                                    </ul>
                                    {isAuthenticated() && (
                                        <>
                                            <li className="SideBarMember mb-2">
                                                <Link href="/member" className="text-white">
                                                    Members
                                                </Link>
                                            </li>
                                            {hasManagementAccess() && (
                                                <li className="SideBarMember mb-2">
                                                    <Link href="/pages/dashboard" className="text-white">
                                                        Dashboard
                                                    </Link>
                                                </li>
                                            )}
                                        </>
                                    )}
                                    {isAuthenticated() && (
                                        <div className="SideBarMember">
                                            <Link className="text-white" href="/" onClick={handleLogoutAndCloseMenu}>
                                                <SlLogout className="mr-2 inline-block" />
                                                Logout
                                            </Link>
                                        </div>
                                    )}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
