'use client';
import React, { useEffect } from 'react';
import ComponentsDashboardSales from './components-dashboard-sales';
import Image from 'next/image';
import Users from '@/public/assets/images/users.svg';
import Members from '@/public/assets/images/members.svg';
import Invoices from '@/public/assets/images/invoices.svg';
import Applications from '@/public/assets/images/applications.svg';
import { useSelector } from 'react-redux';
import { getApplicationRecord } from '@/utils/helperFunctions';
import { apiCaller } from '@/utils/api';
import { FiSmile } from 'react-icons/fi';
import { MdWavingHand } from "react-icons/md";

import { getUser } from '@/utils/helperFunctions.js';

const StatCard = ({ icon, total, title, items, bgColor }) => (
    <div className={`${bgColor} flex-1 rounded-lg p-5 `}>
        <div className="mb-4 flex items-center">
            <div className={` mr-3`}>
                <span className="text-xl text-white">
                    <Image className="h-fit w-fit" src={icon} alt="icon" width={62} height={62} />
                </span>
            </div>
            <div>
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-sm text-gray-600">{title}</div>
            </div>
        </div>
        {items.map((item, index) => (
            <div key={index} className="mb-2 flex items-center justify-between">
                <span className="mr-1 text-nowrap text-sm font-bold text-gray-600">{item.label}</span>
                <div className={`${item.bg} rounded px-5  py-1 text-sm font-bold ${item.textColor}`}>{item.value}</div>
            </div>
        ))}
    </div>
);

const Overview = () => {
    const usersRecord = useSelector((state) => state?.users?.users) || [];
    const [applicationRecordCount, setApplicationRecordCount] = React.useState([]);
    const [invoiceRecordCount, setInvoiceRecordCount] = React.useState([]);

    const fetchData = async () => {
        const getApplicationData = await getApplicationRecord();
        // console.log('getApplicationData', getApplicationData);
        setApplicationRecordCount(getApplicationData?.data?.filter((app) => app?.attributes?.isDeleted === false || app?.attributes?.isDeleted === null)); // Default to empty array if getApplicationData is undefined
        return getApplicationData;
    };
    const getInvoices = async () => {
        let result = await apiCaller('get', 'invoices?populate=*');
        if (result.err) console.log('Err getting invoices', result.err);
        else if (result.data) {
            // console.log('getInvoices'); // DEBUG
            // console.log(result); // DEBUG
            setInvoiceRecordCount(result?.data?.filter((invoice) => invoice?.attributes?.isDeleted === false));
        }
    };
    // useEffect(() => {
    //     fetchData();
    //     getInvoices();
    // }, []);

    // users count
    const userRecordCount = usersRecord.length > 0 ? usersRecord?.filter((user) => user?.isDeleted === false) || 0 : [];
    const verifiedUser = userRecordCount?.filter((user) => user?.confirmed === true)?.length || 0;
    // application count
    const approveApplicationCount = applicationRecordCount?.filter((app) => app?.attributes?.approved === true)?.length || 0;
    const unApprovedApplicationCount = applicationRecordCount?.filter((app) => app?.attributes?.approved === false)?.length || 0;
    // check membership type
    // const silverMembers = applicationRecordCount?.filter((app) => app?.attributes?.membershipType === 'Silver')?.length || 0;
    const goldMembers = applicationRecordCount?.filter((app) => app?.attributes?.membershipType === 'Gold')?.length || 0;
    const platinumMembers = applicationRecordCount?.filter((app) => app?.attributes?.membershipType === 'Platinum')?.length || 0;
    const foundingMembers = applicationRecordCount?.filter((app) => app?.attributes?.membershipType === 'Founding')?.length || 0;
    // invoices count
    const paidInvoices = invoiceRecordCount?.filter((invoice) => invoice?.attributes?.received === true)?.length || 0;
    const unPaidInvoices = invoiceRecordCount?.filter((invoice) => invoice?.attributes?.received === false)?.length || 0;
    // console.log("applicationsRecord", getApplicationData);

    const data = [
        {
            icon: Users,
            total: `${userRecordCount?.length || 130}`,
            title: 'All Users',
            bgColor: 'bg-[#FFE2E5]',
            items: [
                { label: 'Verified', value: `${verifiedUser}`, bg: 'bg-[#FA5A7D]', textColor: 'text-white' },
                // { label: 'Un-Verified', value: `${unVerifiedUser}`, bg: 'bg-white', textColor: 'text-gray-700' },
            ],
        },
        {
            icon: Applications,
            total: `${applicationRecordCount?.length || 150}`,
            title: 'All Application',
            bgColor: 'bg-[#FFF4DE]',
            items: [
                { label: 'Approved', value: `${approveApplicationCount || 140}`, bg: 'bg-[#FF947A]', textColor: 'text-white' },
                { label: 'Un-Approved', value: `${unApprovedApplicationCount || 10}`, bg: 'bg-white', textColor: 'text-gray-700' },
            ],
        },
        {
            icon: Invoices,
            total: `${invoiceRecordCount.length || 80}`,
            title: 'All Invoices',
            bgColor: 'bg-[#DCFCE7]',
            items: [
                { label: 'Paid', value: `${paidInvoices || 60}`, bg: 'bg-[#46DA5F]', textColor: 'text-white' },
                { label: 'Unpaid', value: `${unPaidInvoices || 10}`, bg: 'bg-white', textColor: 'text-gray-700' },
                { label: 'Total Issued', value: `${invoiceRecordCount?.length || 70}`, bg: 'bg-white', textColor: 'text-gray-700' },
            ],
        },
        {
            icon: Members,
            total: `${applicationRecordCount?.length || 60}`,
            title: 'Active Members',
            bgColor: 'bg-[#F3E8FF]',
            items: [
                // { label: 'Silver', value: `${silverMembers}`, bg: 'bg-[#BF83FF]', textColor: 'text-white' },
                { label: 'Founding', value: `${foundingMembers || 40}`, bg: 'bg-[#BF83FF]', textColor: 'text-white' },
                { label: 'Platinum', value: `${platinumMembers || 14}`, bg: 'bg-white', textColor: 'text-gray-700' },
                { label: 'Gold', value: `${goldMembers || 16}`, bg: 'bg-white', textColor: 'text-gray-700' },
            ],
        },
    ];

    const user = getUser();

    return (
        <>
            <div className="panel mx-auto mt-20 p-6 ">
                <div className="mb-4 flex items-center space-x-4">
                    {/* Animated waving hand */}
                    <div className="animate-bounce text-yellow-500">
                        <MdWavingHand size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-800">
                        Welcome back,
                        <span className="ml-2 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">{user?.name}!</span>
                    </h1>
                </div>
                <p className="pl-12 text-lg text-gray-600 flex align-items-center">We're glad to have you back. Here you can manage your activities, view your stats, and much more.
                <FiSmile className=" inline-block text-yellow-500 animate-spin" size={32} />
                    </p>
            </div>

            <div className="panel mx-auto mt-20 p-6  ">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Overview</h2>
                </div>
                <div className="flex  flex-wrap gap-3">
                    {data.map((card, index) => (
                        <StatCard key={index} {...card} />
                    ))}
                </div>
            </div>
            <div className="mt-16 overflow-x-auto shadow-md">
                <ComponentsDashboardSales />
            </div>
        </>
    );
};

export default Overview;
