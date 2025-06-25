'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import IconMenuLocation from '@/public/icon/menu/icon-menu-widgets';
import IconsIndustry from '@/public/icon/menu/iconsIndustory';
import IconsCompany from '@/public/icon/menu/IconsCompany';
import IconsAddress from '@/public/icon/menu/icon-address-profile';
import { getUser, isMemberManager , formatUrl} from '@/utils/helperFunctions';
import { apiCaller } from '@/utils/api';
import Loading from '@/components/layouts/loading';
import { BsFillBuildingsFill } from 'react-icons/bs';
import DownloadButton from '@/components/DownloadButton';
import countryMapping from '@/components/countryNamesData';

const Profile = () => {
    const [result, setResult] = useState([]);
    const [usersRecord, setUsersRecord] = useState([]);

    // console.log('result ', result)

    const urlImageDownload = process.env.NEXT_PUBLIC_BACKEND_URL;

    const user = getUser();

    // application data api function
    const getSingleApplicationRecord = async () => {
        try {
            const application = await apiCaller('get', `applications?filters[email][$eq]=${user?.email}&populate=*`);
            // console.log("application data",application)
            return application;
        } catch (error) {
            console.error('Error fetching Application:', error);
            return null;
        }
    };

    const getAllUsers = async () => {
        try {
            const users = await apiCaller('get', 'users?populate=*');
            setUsersRecord(users);
        } catch (error) {
            console.error('Error fetching Users:', error);
        }
    };

    const UserCity = usersRecord.filter((user) => user?.email === result?.email)[0]?.city;
    const fetchData = async () => {
        const data = await getSingleApplicationRecord();
        // console.log('data,', data?.data?.[0])
        setResult(data?.data?.[0]?.attributes || {}); // Set result or empty object if data is null
    };

    useEffect(() => {
        fetchData();
        getAllUsers();
    }, []);

    // Display loading or error message if data is not yet available
    if (!result) {
        return <Loading />;
    }

    const truncateCompanyInfo = (info) => {
        return info.length > 370 ? `${info.substring(0, 370)}...` : info;
    };

    const getCountryName = (code) => {
        return countryMapping[code?.toUpperCase()] || 'Unknown Country'; // Default to 'Unknown Country' if the code is not found
    };

    return (
        <>
            <div className="mb-2 flex justify-between space-x-5">
                <h2 className="mb-1 text-xl">Profile</h2>
                <Link className="btn btn-blue px-4 font-bold" href={'profile/edit'}>
                    Edit
                </Link>
            </div>
            <div className="flex flex-col rounded shadow-lg shadow-black md:flex-row">
                <div className="red h-auto w-full space-y-3 p-7 text-white md:h-screen md:max-w-[437px]">
                    <div className="mb-4 flex flex-col items-center">
                        <div className="  flex h-[96px] w-[96px] items-center justify-center rounded-full  bg-white">
                            {result?.companyLogo ? (
                                <img className="h-full w-full rounded-full" src={result?.companyLogo ? `${urlImageDownload}${result?.companyLogo}` : ''} alt="company logo" width={60} height={60} />
                            ) : (
                                <BsFillBuildingsFill color="black" className="h-14 w-14" />
                            )}
                        </div>
                        <h6 className=" pt-3 text-center text-gray-300  md:text-left">Member ID: {result?.applicationMemberId ? result?.applicationMemberId : 'Not Assigned yet'}</h6>
                        <h5 className="color-main  text-center md:text-left">{result?.companyName ? result?.companyName : 'N/A'}</h5>
                        <div className=" flex items-start  text-center md:text-left">
                            <IconMenuLocation className="mr-2" />
                            <h5 className="color-main" style={{ wordBreak: 'break-word' }}>
                                {UserCity ? `${UserCity}, ` : ''}
                                {result?.country ? `${getCountryName(result?.country)}` : ', N/A'}
                            </h5>
                        </div>
                    </div>

                    <h6 className="text-white">About Company</h6>
                    <p className="" style={{ wordBreak: 'break-all' }} title={result?.companyInfo ? result?.companyInfo : 'N/A'}>
                        {result?.companyInfo ? truncateCompanyInfo(result?.companyInfo) : 'N/A'}
                    </p>
                    <div className="flex gap-2 pt-2">
                        <IconsIndustry className="pr-2" />
                        <span>
                            <h6 className="flex text-white">
                                <span>Industry Classification</span>
                            </h6>
                            <p className=" text-gray-300">{result?.industryClassification ? result?.industryClassification : 'N/A'}</p>
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <IconsCompany className="pr-2" />
                        <span>
                            <h6 className="flex text-white">
                                <span>Company Type</span>
                            </h6>
                            <p className=" text-gray-300">{result?.companyType ? result?.companyType : 'N/A'}</p>
                        </span>
                    </div>
                    <div className="flex justify-start gap-2 pt-2">
                        <div>
                            <IconsAddress className="h-full w-full pr-2" />
                        </div>
                        <span>
                            <h6 className="flex text-white">
                                <span>Company Address</span>
                            </h6>
                            <p className="text-gray-300">{result?.mainOfficeAddress ? result?.mainOfficeAddress : 'N/A'}</p>
                        </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Image className="h-fit w-fit" src="/assets/images/icon-global.png" alt="Blurred Ego" width={18} height={18} />
                        <span>
                            <h6 className="flex text-white">
                                <span>Website</span>
                            </h6>
                            {result?.companyWebsite ? (
                                <Link href={formatUrl(result?.companyWebsite)} className=" text-gray-300" target='_blank'>
                                    {result?.companyWebsite}
                                </Link>
                            ) : (
                                'N/A'
                            )}
                        </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Image className="h-fit w-fit" src="/assets/images/icon-email.png" alt="Blurred Ego" width={18} height={18} />
                        <span>
                            <h6 className="flex text-white">
                                <span>Email</span>
                            </h6>
                            {result?.email ? (
                                <Link href={`mailto:${result?.email}`} className=" text-gray-300">
                                    {result?.email}
                                </Link>
                            ) : (
                                'N/A'
                            )}
                        </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Image className="h-fit w-fit" src="/assets/images/icon-phone.png" alt="Blurred Ego" width={18} height={18} />
                        <span>
                            <h6 className="flex text-white">
                                <span>Telephone Number</span>
                            </h6>
                            {result?.telephoneNumber ? (
                                <Link href={`tel:${result?.telephoneNumber}`} className=" text-gray-300 " target="_blank" rel="noopener noreferrer">
                                    {result?.countryCodeCompanyNumber} {result?.telephoneNumber}
                                </Link>
                            ) : (
                                'N/A'
                            )}
                        </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Image className="h-fit w-fit" src="/assets/images/icon-staf.png" alt="Blurred Ego" width={18} height={18} />
                        <span>
                            <h6 className="flex text-white">
                                <span>Staff Strength</span>
                            </h6>
                            <span>{result?.staffStrength ? result?.staffStrength : 'N/A'}</span>
                        </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Image className="h-fit w-fit" src="/assets/images/icon-flex.png" alt="Blurred Ego" width={18} height={18} />
                        <span>
                            <h6 className=" flex text-white">
                                <span>Fax</span>
                            </h6>
                            <p className=" text-gray-300">{result?.faxNumber ? result.faxNumber : 'N/A'}</p>
                        </span>
                    </div>
                </div>
                <div className="w-full overflow-x-auto text-nowrap   p-6 lg:p-20">
                    <div className="red text-center">
                        <h3 className="color-main py-2 ">Primary Contact</h3>
                    </div>

                    <div className="mt-4 flex flex-col items-center space-x-5 sm:flex-row sm:items-start">
                        <div>
                            <div className="  flex h-[100px] w-[100px] items-center justify-center rounded-full  bg-[#DEDCDF]">
                                <img
                                    className="h-full w-full rounded-full"
                                    src={result?.contactPerson1Picture ? `${urlImageDownload}${result?.contactPerson1Picture}` : '/assets/images/contactPersonPicture.jpg'}
                                    alt="company logo"
                                    width={100}
                                    height={100}
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="mt-4 flex  justify-between space-x-5">
                                <h5 className=" dark:text-white">{result?.contactPerson1 ? result.contactPerson1 : 'N/A'}</h5>
                            </div>
                            <div className=" flex justify-between space-x-5">
                                <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                    {result?.email1 ? result.email1 : 'N/A'}
                                </h5>
                            </div>
                            <div className="mt-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Office</h5>
                                <h5
                                    className="overflow-hidden font-normal text-gray-600  dark:text-white"
                                    style={{ fontSize: '18.72px', wordBreak: 'break-all', maxWidth: '500px', whiteSpace: 'normal' }}
                                >
                                    {result?.office1 ? result.office1 : 'N/A'}
                                </h5>
                            </div>
                            <div className="mt-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Designation</h5>
                                <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                    {result?.designation1 ? result.designation1 : 'N/A'}
                                </h5>
                            </div>
                            <div className="my-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Mobile </h5>
                                <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                    {result?.countryCodeContactPerson1 ? result.countryCodeContactPerson1 : ''} {result?.mobile1 ? result.mobile1 : 'N/A'}
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div className="red text-center">
                        <h3 className="color-main py-2 ">Secondary Contact</h3>
                    </div>

                    <div className="mt-4 flex flex-col items-center space-x-5 sm:flex-row sm:items-start">
                        <div>
                            <div className="  flex h-[100px] w-[100px] items-center justify-center rounded-full  bg-[#DEDCDF]">
                                <img
                                    className="h-full w-full rounded-full"
                                    src={result?.contactPerson2Picture ? `${urlImageDownload}${result?.contactPerson2Picture}` : '/assets/images/contactPersonPicture.jpg'}
                                    alt="company logo"
                                    width={100}
                                    height={100}
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="mt-4 flex  justify-between space-x-5">
                                <h5 className=" dark:text-white">{result?.contactPerson2 ? result.contactPerson2 : 'N/A'}</h5>
                            </div>
                            <div className=" flex justify-between space-x-5">
                                <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                    {result?.email2 ? result.email2 : 'N/A'}
                                </h5>
                            </div>
                            <div className="mt-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Office</h5>
                                <h5
                                    className="overflow-hidden font-normal text-gray-600  dark:text-white"
                                    style={{ fontSize: '18.72px', wordBreak: 'break-all', maxWidth: '500px', whiteSpace: 'normal' }}
                                >
                                    {result?.office2 ? result.office2 : 'N/A'}
                                </h5>
                            </div>
                            <div className="mt-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Designation</h5>
                                <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                    {result?.designation2 ? result.designation2 : 'N/A'}
                                </h5>
                            </div>
                            <div className="my-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Mobile </h5>
                                <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                    {result?.countryCodeContactPerson2 ? result.countryCodeContactPerson2 : ''} {result?.mobile2 ? result.mobile2 : 'N/A'}
                                </h5>
                            </div>
                        </div>
                    </div>
                    <hr className="red my-3 h-2 w-full" />

                    {result?.contactPerson3 ? (
                        <>
                            <div className="mt-4 flex flex-col items-center space-x-5 sm:flex-row sm:items-start">
                                <div>
                                    <div className="  flex h-[100px] w-[100px] items-center justify-center rounded-full  bg-[#DEDCDF]">
                                        <img
                                            className="h-full w-full rounded-full"
                                            src={result?.contactPerson3Picture ? `${urlImageDownload}${result?.contactPerson3Picture}` : '/assets/images/contactPersonPicture.jpg'}
                                            alt="company logo"
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="mt-4 flex  justify-between space-x-5">
                                        <h5 className=" dark:text-white">{result?.contactPerson3 ? result.contactPerson3 : 'N/A'}</h5>
                                    </div>
                                    <div className=" flex justify-between space-x-5">
                                        <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                            {result?.email3 ? result.email3 : 'N/A'}
                                        </h5>
                                    </div>
                                    <div className="mt-4 flex justify-between space-x-5">
                                        <h5 className="text-normal dark:text-white">Office</h5>
                                        <h5
                                            className="overflow-hidden font-normal text-gray-600  dark:text-white"
                                            style={{ fontSize: '18.72px', wordBreak: 'break-all', maxWidth: '500px', whiteSpace: 'normal' }}
                                        >
                                            {result?.office3 ? result.office3 : 'N/A'}
                                        </h5>
                                    </div>
                                    <div className="mt-4 flex justify-between space-x-5">
                                        <h5 className="text-normal dark:text-white">Designation</h5>
                                        <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                            {result?.designation3 ? result.designation3 : 'N/A'}
                                        </h5>
                                    </div>
                                    <div className="my-4 flex justify-between space-x-5">
                                        <h5 className="text-normal dark:text-white">Mobile </h5>
                                        <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                            {result?.countryCodeContactPerson3 ? result.countryCodeContactPerson3 : ''} {result?.mobile3 ? result.mobile3 : 'N/A'}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <hr className="red my-3 h-2 w-full" />
                        </>
                    ) : null}

                    {result?.contactPerson4 ? (
                        <>
                            <div className="mt-4 flex flex-col items-center space-x-5 sm:flex-row sm:items-start">
                                <div>
                                    <div className="  flex h-[100px] w-[100px] items-center justify-center rounded-full  bg-[#DEDCDF]">
                                        <img
                                            className="h-full w-full rounded-full"
                                            src={result?.contactPerson4Picture ? `${urlImageDownload}${result?.contactPerson4Picture}` : '/assets/images/contactPersonPicture.jpg'}
                                            alt="company logo"
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="mt-4 flex  justify-between space-x-5">
                                        <h5 className=" dark:text-white">{result?.contactPerson4 ? result.contactPerson4 : 'N/A'}</h5>
                                    </div>
                                    <div className=" flex justify-between space-x-5">
                                        <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                            {result?.email4 ? result.email4 : 'N/A'}
                                        </h5>
                                    </div>
                                    <div className="mt-4 flex justify-between space-x-5">
                                        <h5 className="text-normal dark:text-white">Office</h5>
                                        <h5
                                            className="overflow-hidden font-normal text-gray-600  dark:text-white"
                                            style={{ fontSize: '18.72px', wordBreak: 'break-all', maxWidth: '500px', whiteSpace: 'normal' }}
                                        >
                                            {result?.office4 ? result.office4 : 'N/A'}
                                        </h5>
                                    </div>
                                    <div className="mt-4 flex justify-between space-x-5">
                                        <h5 className="text-normal dark:text-white">Designation</h5>
                                        <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                            {result?.designation4 ? result.designation4 : 'N/A'}
                                        </h5>
                                    </div>
                                    <div className="my-4 flex justify-between space-x-5">
                                        <h5 className="text-normal dark:text-white">Mobile </h5>
                                        <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                            {result?.countryCodeContactPerson4 ? result.countryCodeContactPerson4 : ''} {result?.mobile4 ? result.mobile4 : 'N/A'}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <hr className="red my-3 h-2 w-full" />
                        </>
                    ) : null}

                    {result?.contactPerson5 ? (
                        <>
                            <div className="mt-4 flex flex-col items-center space-x-5 sm:flex-row sm:items-start">
                                <div>
                                    <div className="  flex h-[100px] w-[100px] items-center justify-center rounded-full  bg-[#DEDCDF]">
                                        <img
                                            className="h-full w-full rounded-full"
                                            src={result?.contactPerson5Picture ? `${urlImageDownload}${result?.contactPerson5Picture}` : '/assets/images/contactPersonPicture.jpg'}
                                            alt="company logo"
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="mt-4 flex  justify-between space-x-5">
                                        <h5 className=" dark:text-white">{result?.contactPerson5 ? result.contactPerson5 : 'N/A'}</h5>
                                    </div>
                                    <div className=" flex justify-between space-x-5">
                                        <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                            {result?.email5 ? result.email5 : 'N/A'}
                                        </h5>
                                    </div>
                                    <div className="mt-4 flex justify-between space-x-5">
                                        <h5 className="text-normal dark:text-white">Office</h5>
                                        <h5
                                            className="overflow-hidden font-normal text-gray-600  dark:text-white"
                                            style={{ fontSize: '18.72px', wordBreak: 'break-all', maxWidth: '500px', whiteSpace: 'normal' }}
                                        >
                                            {result?.office5 ? result.office5 : 'N/A'}
                                        </h5>
                                    </div>
                                    <div className="mt-4 flex justify-between space-x-5">
                                        <h5 className="text-normal dark:text-white">Designation</h5>
                                        <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                            {result?.designation5 ? result.designation5 : 'N/A'}
                                        </h5>
                                    </div>
                                    <div className="my-4 flex justify-between space-x-5">
                                        <h5 className="text-normal dark:text-white">Mobile </h5>
                                        <h5 className="font-normal text-gray-600  dark:text-white" style={{ fontSize: '18.72px' }}>
                                            {result?.countryCodeContactPerson4 ? result.countryCodeContactPerson4 : ''} {result?.mobile5 ? result.mobile5 : 'N/A'}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}

                    {/*  show Reference 1 */}
                    {(isMemberManager() || getUser()?.email === result?.email) && (
                        <>
                            <h3 className="color-brand-1 ">Reference 1</h3>
                            <hr className="red my-3 h-2 w-full" />

                            <div className="mt-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Company Name</h5>
                                <h5 className="font-normal dark:text-white">{result?.companyNameRef1 ? result.companyNameRef1 : 'N/A'}</h5>
                            </div>

                            <div className="mt-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Contact Person</h5>
                                <h5 className="font-normal dark:text-white">{result?.contactPersonRef1 ? result.contactPersonRef1 : 'N/A'}</h5>
                            </div>

                            <div className="mt-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Email Address</h5>
                                <h5 className="font-normal dark:text-white">{result?.emailRef1 ? result.emailRef1 : 'N/A'}</h5>
                            </div>

                            <div className="mt-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Number</h5>
                                <h5 className="font-normal dark:text-white">
                                    {' '}
                                    {result?.countryCodeRef1 ? result.countryCodeRef1 : ''} {result?.numberRef1 ? result.numberRef1 : 'N/A'}
                                </h5>
                            </div>

                            <div className="my-4  flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Designation</h5>
                                <h5 className="font-normal dark:text-white">{result?.designationRef1 ? result.designationRef1 : 'N/A'}</h5>
                            </div>

                            <h3 className="color-brand-1">Reference 2</h3>
                            <hr className="red my-3 h-2 w-full" />

                            <div className="mt-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Company Name</h5>
                                <h5 className="font-normal dark:text-white">{result?.companyNameRef2 ? result.companyNameRef2 : 'N/A'}</h5>
                            </div>

                            <div className="mt-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Contact Person</h5>
                                <h5 className="font-normal dark:text-white">{result?.contactPersonRef2 ? result.contactPersonRef2 : 'N/A'}</h5>
                            </div>

                            <div className="mt-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Email Address</h5>
                                <h5 className="font-normal dark:text-white">{result?.emailRef2 ? result.emailRef2 : 'N/A'}</h5>
                            </div>

                            <div className="mt-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Number</h5>
                                <h5 className="font-normal dark:text-white">
                                    {result?.countryCodeRef1 ? result.countryCodeRef1 : ''} {result?.numberRef2 ? result.numberRef2 : 'N/A'}
                                </h5>
                            </div>

                            <div className="my-4 flex justify-between space-x-5">
                                <h5 className="text-normal dark:text-white">Designation</h5>
                                <h5 className="font-normal dark:text-white">{result?.designationRef2 ? result.designationRef2 : 'N/A'}</h5>
                            </div>
                        </>
                    )}

                    {/*  files upload download */}
                    <h3 className="color-brand-1">Download Files</h3>
                    <hr className="red my-3 h-2 w-full" />
                    {result?.companyLogo && (
                        <div className="mt-4 flex justify-between space-x-5">
                            <h5 className="text-normal dark:text-white">Company Logo</h5>
                            <DownloadButton fileUrl={`${urlImageDownload}${result?.companyLogo}`} fileName={result?.companyLogo || 'companyLogo'} />
                        </div>
                    )}
                    {(isMemberManager() || getUser()?.email === result?.email) && (
                        <>
                            {result?.businessCertificate && (
                                <div className="mt-4 flex justify-between space-x-5">
                                    <h5 className="text-normal dark:text-white">Company Registration Business Certificate</h5>

                                    <DownloadButton fileUrl={`${urlImageDownload}${result?.businessCertificate}`} fileName={result?.businessCertificate || 'businessCertificate'} />
                                </div>
                            )}
                            {result?.ownerId && (
                                <div className="mt-4 flex justify-between space-x-5">
                                    <h5 className="text-normal dark:text-white">Owner’s Identification Document</h5>
                                    <DownloadButton fileUrl={`${urlImageDownload}${result?.ownerId}`} fileName={result?.ownerId || 'ownerId'} />
                                </div>
                            )}
                            {result?.BlurredEgoMemberCertificate && (
                                <div className="mt-4 flex justify-between space-x-5">
                                    <h5 className="text-normal dark:text-white">Blurred Ego Membership Certificate</h5>

                                    <DownloadButton fileUrl={`${urlImageDownload}${result?.BlurredEgoMemberCertificate}`} fileName={result?.BlurredEgoMemberCertificate || 'Blurred EgoMemberCertificate'} />
                                </div>
                            )}
                            {result?.BlurredEgoMemberLogo && (
                                <div className="mt-4 flex justify-between space-x-5">
                                    <h5 className="text-normal dark:text-white">Blurred Ego Logo</h5>
                                    <DownloadButton fileUrl={`${urlImageDownload}${result?.BlurredEgoMemberLogo}`} fileName={result?.BlurredEgoMemberLogo || 'Blurred EgoMemberLogo'} />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;
