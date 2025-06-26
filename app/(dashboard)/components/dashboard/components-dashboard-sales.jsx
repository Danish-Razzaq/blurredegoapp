'use client';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { getApplicationRecord } from '@/utils/helperFunctions';
import { apiCaller } from '@/utils/api';

const ComponentsDashboardSales = () => {
    const isDark = useSelector((state) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state) => state.themeConfig.rtlClass) === 'rtl';
    const [usersRecord, setUsersRecord] = useState([]);
    const [applicationData, setApplicationData] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [selectedOption, setSelectedOption] = useState('All Users'); // New state for dropdown selection

    const getAllUsers = async () => {
        const response = await apiCaller('get', 'users');
        if (response?.err) console.log('Err getting users', response?.err);
        else if (response) {
            setUsersRecord(response);
        }

        // console.log('response', response);
    };
    const getApplicationData = async () => {
        const response = await getApplicationRecord();
        if (response?.err) console.log('Err getting applications', response?.err);
        else if (response.data) {
            setApplicationData(response.data);
        }
    };

    const getInvoices = async () => {
        let result = await apiCaller('get', 'invoices?populate=*');
        if (result?.err) console.log('Err getting invoices', result?.err);
        else if (result?.data) {
            // console.log('getInvoices'); // DEBUG
            // console.log('invoice',result); // DEBUG
            setInvoices(result.data);
        }
    };

    // useEffect(() => {
    //     getAllUsers();
    //     getApplicationData();
    //     getInvoices();
    // }, []);

    const [isMounted, setIsMounted] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('Monthly');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value); // Update the selected option
    };

    // Static categories for each period
    const categories = {
        Weekly: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        Monthly: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        Yearly: ['2023', '2024', '2025', '2026'], // Static years, adjust as needed
    };

    // Ensure the length of data matches the length of categories
    const activeUsersData = Array(categories[selectedPeriod].length).fill(0);
    const deletedUsersData = Array(categories[selectedPeriod].length).fill(0);

    const activeApplicationsData = Array(categories[selectedPeriod].length).fill(0);
    const deletedApplicationsData = Array(categories[selectedPeriod].length).fill(0);

    const activeInvoicesData = Array(categories[selectedPeriod].length).fill(0);

    // Assuming you have these functions to get the start and end of the week
    const getStartOfWeek = (date) => {
        const currentDate = new Date(date);
        const day = currentDate.getDay();
        const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(currentDate.setDate(diff));
    };

    const getEndOfWeek = (date) => {
        const startOfWeek = getStartOfWeek(date);
        return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
    };

    const startOfWeek = getStartOfWeek(new Date());
    const endOfWeek = getEndOfWeek(new Date());

    if (selectedOption === 'All Users' && usersRecord.length > 0) {
        usersRecord?.forEach((user) => {
            const createdDate = new Date(user?.createdAt);

            if (selectedPeriod === 'Weekly') {
                if (createdDate >= startOfWeek && createdDate <= endOfWeek) {
                    const day = (createdDate.getDay() + 6) % 7; // Shift Sunday (0) to Monday (0)
                    activeUsersData[day] = (activeUsersData[day] || 0) + (user?.isDeleted ? 0 : 1);
                    deletedUsersData[day] = (deletedUsersData[day] || 0) + (user?.isDeleted ? 1 : 0);
                }
            } else if (selectedPeriod === 'Monthly') {
                const month = createdDate.getMonth();
                activeUsersData[month] = (activeUsersData[month] || 0) + (user?.isDeleted ? 0 : 1);
                deletedUsersData[month] = (deletedUsersData[month] || 0) + (user?.isDeleted ? 1 : 0);
            } else if (selectedPeriod === 'Yearly') {
                const year = createdDate.getFullYear();
                const yearIndex = categories.Yearly.indexOf(String(year));
                if (yearIndex !== -1) {
                    activeUsersData[yearIndex] = (activeUsersData[yearIndex] || 0) + (user?.isDeleted ? 0 : 1);
                    deletedUsersData[yearIndex] = (deletedUsersData[yearIndex] || 0) + (user?.isDeleted ? 1 : 0);
                }
            }
        });
    } else if (selectedOption === 'All Applications' && applicationData.length > 0) {
        applicationData?.forEach((application) => {
            const createdDate = new Date(application?.attributes.createdAt);

            if (selectedPeriod === 'Weekly') {
                if (createdDate >= startOfWeek && createdDate <= endOfWeek) {
                    const day = (createdDate.getDay() + 6) % 7; // Shift day to align with Monday as the start
                    activeApplicationsData[day] = (activeApplicationsData[day] || 0) + 1;
                    deletedApplicationsData[day] = (deletedApplicationsData[day] || 0) + (application?.attributes.isDeleted ? 1 : 0);
                }
            } else if (selectedPeriod === 'Monthly') {
                const month = createdDate.getMonth();
                activeApplicationsData[month] = (activeApplicationsData[month] || 0) + 1;
                deletedApplicationsData[month] = (deletedApplicationsData[month] || 0) + (application?.attributes.isDeleted ? 1 : 0);
            } else if (selectedPeriod === 'Yearly') {
                const year = createdDate.getFullYear();
                const yearIndex = categories.Yearly.indexOf(String(year));
                if (yearIndex !== -1) {
                    activeApplicationsData[yearIndex] = (activeApplicationsData[yearIndex] || 0) + 1;
                    deletedApplicationsData[yearIndex] = (deletedApplicationsData[yearIndex] || 0) + (application?.attributes.isDeleted ? 1 : 0);
                }
            }
        });
    } else if (selectedOption === 'All Invoices' && invoices.length > 0) {
        invoices?.forEach((invoice) => {
            const createdDate = new Date(invoice?.attributes.createdAt);
            // console.log('invoice date', createdDate);
            if (selectedPeriod === 'Weekly') {
                if (createdDate >= startOfWeek && createdDate <= endOfWeek) {
                    const day = (createdDate.getDay() + 6) % 7;
                    activeInvoicesData[day] = (activeInvoicesData[day] || 0) + 1;
                }
            } else if (selectedPeriod === 'Monthly') {
                const month = createdDate.getMonth();
                activeInvoicesData[month] = (activeInvoicesData[month] || 0) + 1;
            } else if (selectedPeriod === 'Yearly') {
                const year = createdDate.getFullYear();
                const yearIndex = categories.Yearly.indexOf(String(year));
                if (yearIndex !== -1) {
                    activeInvoicesData[yearIndex] = (activeInvoicesData[yearIndex] || 0) + 1;
                }
            }
        });
    }

    // Revenue Chart
    const series = (() => {
        if (selectedOption === 'All Users') {
            return [
                { name: 'Active Users', data: activeUsersData },
                { name: 'Deleted Users', data: deletedUsersData },
            ];
        } else if (selectedOption === 'All Applications') {
            return [
                { name: 'Applications', data: activeApplicationsData },
                { name: 'Deleted Applications', data: deletedApplicationsData },
            ];
        } else if (selectedOption === 'All Invoices') {
            return [{ name: 'Invoices', data: activeInvoicesData }];
        }
        return []; // default case, return an empty array if none of the conditions match
    })();
    const revenueChart = {
        series,

        options: {
            chart: { height: 325, type: 'area', zoom: { enabled: false }, toolbar: { show: false } },
            dataLabels: { enabled: false },
            stroke: { show: true, curve: 'smooth', width: 2 },
            colors: isDark ? ['#2196F3', '#E7515A'] : ['#1B55E2', '#E7515A'],
            xaxis: {
                categories: categories[selectedPeriod],
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: { offsetX: isRtl ? 2 : 0, style: { fontSize: '12px' } },
            },
            yaxis: {
                tickAmount: 7,
                labels: { formatter: (value) => `${Math.round(value)}`, offsetX: isRtl ? -30 : -10 },
                opposite: isRtl ? true : false,
            },
            grid: { borderColor: isDark ? '#191E3A' : '#E0E6ED', strokeDashArray: 5 },
            legend: { position: 'top', horizontalAlign: 'right', fontSize: '16px' },
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: isDark ? 0.19 : 0.28, opacityTo: 0.05 } },
        },
    };

    return (
        <div className="pt-5">
            <div className="mb-6 grid gap-6">
                <div className="panel h-full">
                    <div className="mb-5 flex items-center justify-between dark:text-white-light">
                        <select
                            className="form-control w-36 rounded-lg px-4 py-2 text-sm text-white sm:w-52"
                            style={{ backgroundColor: '#de2910' }}
                            value={selectedOption}
                            onChange={handleOptionChange}
                        >
                            <option className="bg-gray-200 text-black">All Users</option>
                            <option className="bg-gray-200 text-black">All Applications</option>
                            <option className="bg-gray-200 text-black">All Invoices</option>
                        </select>

                        <div className="flex space-x-1">
                            <button onClick={() => handlePeriodChange('Weekly')} className={`rounded-lg px-4 py-2 text-sm ${selectedPeriod === 'Weekly' ? 'bg-gray-300' : 'bg-gray-100'}`}>
                                Weekly
                            </button>
                            <button onClick={() => handlePeriodChange('Monthly')} className={`rounded-lg px-4 py-2 text-sm ${selectedPeriod === 'Monthly' ? 'bg-gray-300' : 'bg-gray-100'}`}>
                                Monthly
                            </button>
                            <button onClick={() => handlePeriodChange('Yearly')} className={`rounded-lg px-4 py-2 text-sm ${selectedPeriod === 'Yearly' ? 'bg-gray-300' : 'bg-gray-100'}`}>
                                Yearly
                            </button>
                        </div>
                    </div>
                    <p className="text-lg dark:text-white-light/90">
                        Total {selectedOption}
                        {selectedOption === 'All Users' ? (
                            <span className="ml-2 text-primary">{activeUsersData.reduce((a, b) => a + b, 0) + deletedUsersData.reduce((a, b) => a + b, 0)}</span>
                        ) : selectedOption === 'All Applications' ? (
                            <span className="ml-2 text-primary">{activeApplicationsData.reduce((a, b) => a + b, 0) + deletedApplicationsData.reduce((a, b) => a + b, 0)}</span>
                        ) : selectedOption === 'All Invoices' ? (
                            <span className="ml-2 text-primary">{activeInvoicesData.reduce((a, b) => a + b, 0)}</span>
                        ) : null}
                    </p>

                    <div className="relative">
                        <div className="rounded-lg bg-white dark:bg-black">
                            {isMounted ? (
                                <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={325} width={'100%'} />
                            ) : (
                                <div className="grid min-h-[325px] place-content-center">
                                    <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black"></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentsDashboardSales;
