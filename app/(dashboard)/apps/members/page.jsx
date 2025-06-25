'use client';
import Image from 'next/image';
import { BsFillBuildingsFill } from 'react-icons/bs';
import GenericTable from '@/components/GenericTable';
import Link from 'next/link';
import FilterComponentDropdown from '@/components/GenericFilterDropdown';
import useFilter from '@/hooks/useFilter';
import countryMapping from '@/components/countryNamesData';
import { useEffect, useState } from 'react';
import { apiCaller } from '@/utils/api';
import { sortMembers } from '@/utils/filterNews';
import {dummyMembers} from '@/Data/memberCard'; // Import dummy data for testing

const ComponentsAppsMembers = () => {
    const [invoices, setInvoices] = useState([]);
    const [usersCityState, setUsersCity] = useState([]);
    // Fetch invoices data && users data
    const urlImageDomain = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchInvoices = async () => {
        const usersResult = await apiCaller('get', 'users');
        if (usersResult.err) {
            console.error('Error fetching users:', usersResult.err);
        } else {
            setUsersCity(usersResult);
        }

        const result = await apiCaller('get', 'invoices');
        if (result.err) {
            console.error('Error fetching invoices:', result.err);
        } else {
            setInvoices(result.data);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const {
        filteredItems,
        uniqueCountries,
        uniqueCities,
        countrySearch,
        companySearch,
        selectedCountry,
        selectedCity,
        handleCountryChange,
        handleCityChange,
        setCountrySearch,
        setCompanySearch,
        value,
        setValue,
        searchMemberById,
        setSearchMemberById,
    } = useFilter(invoices, usersCityState);

    // console.log('filteredItems', filteredItems);

    const sortedItemsResponse = sortMembers(filteredItems);

    // Log the sorted items
    // console.log('sortedItems', sortedItemsResponse);

    const getCountryName = (code) => {
        return countryMapping[code?.toUpperCase()] || 'Unknown Country'; // Default to 'Unknown Country' if the code is not found
    };

    const truncateWord = (info) => {
        return info.length > 50 ? `${info.substring(0, 50)}...` : info;
    };


    const columns = [
        {
            key: 'id',
            header: 'ID',
        },
        {
            key: 'username',
            header: 'User Name',
        },
        {
            key: 'companyName',
            header: 'Company Name',
        },
        {
            key: 'email',
            header: 'Email',
        },
        {
            key: 'mobile1',
            header: 'Mobile ',
        },
        {
            key: 'mainOfficeAddress',
            header: 'Address',
            render: (item) => {
                return <div title={item?.mainOfficeAddress} className='cursor-pointer'>{ truncateWord(item?.mainOfficeAddress)}</div>;
            }
        },
        {
            key: 'country',
            header: 'Country',
            render: (item) => {
                return <>{item.country}</>;
            },
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (item) => {
                return (
                    <div className="w-full">
                        <Link href={`/apps/members/${item.id}`} className="btn btn-outline-blue w-full">
                            {' '}
                            View
                        </Link>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <title>GCA | Members</title>
            <FilterComponentDropdown
                uniqueCountries={uniqueCountries}
                selectedCountry={selectedCountry}
                selectedCity={selectedCity}
                uniqueCities={uniqueCities}
                countrySearch={countrySearch}
                companySearch={companySearch}
                handleCountryChange={handleCountryChange}
                handleCityChange={handleCityChange}
                setCountrySearch={setCountrySearch}
                setCompanySearch={setCompanySearch}
                value={value}
                setValue={setValue}
                searchMemberById={searchMemberById}
                setSearchMemberById={setSearchMemberById}
            />
            {value === 'grid' &&
                (dummyMembers.length === 0 ? (
                    <div className="flex h-[40vh] w-full items-center justify-center p-20 text-center text-2xl font-extrabold text-red-600 sm:text-5xl">Oops No Member Exists </div>
                ) : (
                    <div className="mt-[82px] grid w-full grid-cols-1 gap-y-12 gap-x-4 sm:grid-cols-2 max-1564:grid-cols-3 2xl:grid-cols-4">
                    {dummyMembers
                            // .filter((invoiceStatus) => invoiceStatus.receivedInvoice)
                            .map((contact) => (
                                <div className="relative h-full min-w-[312px]   rounded-md bg-white text-center shadow dark:bg-[#1c232f]" key={contact.id}>
                                    <div className="relative h-full rounded-md bg-white pb-16 text-center shadow dark:bg-[#1c232f]">
                                        <div className="relative h-[135px] rounded-t-md bg-white/40 bg-[url('/assets/images/notification-bg.webp')] bg-cover bg-center p-6 pb-0"></div>
                                        <div className="relative">
                                            <div className="flex justify-center">
                                                <div
                                                    className="absolute bottom-20 z-10 flex h-[87px] w-[87px] items-center justify-center rounded-full border-b-2 border-red-600 bg-white"
                                                    style={{ border: '3px solid #de2810' }}
                                                >
                                                    {contact?.companyLogo ? (
                                                        <img className="h-full w-full rounded-full" src={`${urlImageDomain}${contact?.companyLogo}`} alt="company logo" width={60} height={60} />
                                                    ) : (
                                                        <BsFillBuildingsFill color="black" className="h-14 w-14" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative -mt-28 px-6">
                                            <div className="rounded-md border-2 bg-white px-2 pb-6 pt-1 shadow-md dark:bg-gray-900">
                                                <div className="mb-4 flex justify-between">
                                                    <div className="flex">
                                                        <Image
                                                            title={`${contact.membershipType} Membership`}
                                                            src={`/assets/imgs/page/members/${contact?.membershipType}Flag.svg`}
                                                            alt="flag"
                                                            width={20}
                                                            height={20}
                                                            className="h-12 w-12 cursor-pointer rounded-lg"
                                                        />
                                                        {contact?.membershipType !== 'Silver' ? (
                                                            <Image
                                                                title={`Payment Protected`}
                                                                src={`/assets/imgs/page/members/paymentProtect.svg`}
                                                                alt="flag"
                                                                width={20}
                                                                height={20}
                                                                className="h-9 w-10 cursor-pointer rounded-lg"
                                                            />
                                                        ) : null}
                                                    </div>
                                                    <Image
                                                        title={getCountryName(contact.countryForFlag)}
                                                        src={`/assets/images/flags/${contact.countryForFlag}.svg`}
                                                        alt="flag"
                                                        width={20}
                                                        height={20}
                                                        className="h-12 w-12 cursor-pointer rounded-lg"
                                                    />
                                                </div>

                                                <div className="font-semibold ">
                                                    Member ID: <span className="text-gray-500">{contact?.applicationMemberId}</span>
                                                </div>
                                                <div className="text-xl font-bold">{contact.companyName}</div>
                                                <div className="font-normal text-gray-500">{contact.companyType}</div>
                                            </div>
                                            <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                                                <div className="flex items-start">
                                                    <div className="flex-none ltr:mr-2 rtl:ml-2">Email :</div>
                                                    <div className="truncate text-white-dark">{contact.email}</div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="flex-none ltr:mr-2 rtl:ml-2">Phone :</div>
                                                    <div className="text-white-dark">
                                                        {contact?.countryCodeContactPerson1} {contact.mobile1}
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="flex-none ltr:mr-2 rtl:ml-2">Address :</div>
                                                    <div className="text-white-dark">{contact.mainOfficeAddress}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-3 flex w-full gap-4 p-6 ltr:left-0 rtl:right-0">
                                        <Link href={`members/${contact.id}`} className="btn btn-outline-blue w-full">
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}
            {value === 'list' && (
                <div className="mt-5">
                    <GenericTable columns={columns} data={dummyMembers} />
                </div>
            )}
        </div>
    );
};

export default ComponentsAppsMembers;
