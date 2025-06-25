'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Link from 'next/link';
import DownloadButton from '@/components/DownloadButton';
import ContactPersonSection from '@/components/contactPerson';
import { useParams } from 'next/navigation';
import { apiCaller } from '@/utils/api';
import { IoDocumentText } from 'react-icons/io5';
import { dummyApplications } from '@/Data/application';

const EditApplication = ({ params }) => {
    const [applicationPerson, setApplicationPerson] = useState([]);
    const [listOfCountries, setListOfCountries] = useState([]);
    console.log('applicationPerson', applicationPerson);
    const { slug } = useParams();

    useEffect(() => {
    dummyApplications.forEach((application) => {
        if (application.id === slug) {
            setApplicationPerson(application);
        }
    });
    }, [slug]);



    const {
        register,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let result = await apiCaller('get', `applications?filters[id][$eq]=${slug}&populate=*`);
                if (result?.data[0]?.attributes) {
                    const attributes = result.data[0].attributes;
                    setApplicationPerson(attributes);

                    // Dynamically set form values
                    const defaultValues = Object.keys(attributes).reduce((acc, key) => {
                        acc[key] = attributes[key] || '';
                        return acc;
                    }, {});

                    reset(defaultValues); // Set the form values dynamically
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [slug, reset]);

    const fileInputRefs = {
        businessCertificate: useRef(null),
        ownerId: useRef(null),
        companyLogo: useRef(null),
    };

    const urlImageDownload = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [sections, setSections] = useState([2]);

    useEffect(() => {
        let defaultSections = [2]; // Default two sections
        if (applicationPerson?.contactPerson3) {
            defaultSections.push(3);
        }
        if (applicationPerson?.contactPerson4) {
            defaultSections.push(4);
        }
        if (applicationPerson?.contactPerson5) {
            defaultSections.push(5);
        }

        setSections(defaultSections);
    }, [applicationPerson]); // Run when `applicationPerson` changes

    const addSection = () => {
        if (sections.length < 4) {
            // Allow up to 3 sections
            setSections([...sections, sections[sections.length - 1] + 1]);
        }
    };

    // Function to remove a section
    const removeSection = (sectionNumber) => {
        setSections(sections.filter((number) => number !== sectionNumber));
    };


    //  fetch country code
 useEffect(() => {
    fetch('https://api.countrystatecity.in/v1/countries', {
        method: 'GET',
        headers: {
            'X-CSCAPI-KEY': 'aTRzTW5VekFyaUs0em5pd0FPRlNnYm5wY3lHcnNpU3l1RnFBdVhwUg==',
        },
    })
        .then((response) => response.json())
        .then((data) =>
            setListOfCountries(
                data.map((item) => ({
                    value: item.name,
                    code: item.phonecode, // This gives us the country code
                    iso: item.iso2,
                }))
            )
        )
        .catch((error) => console.error('Error fetching countries:', error));
}, []);


    return (
        <>
            <title>Application</title>
            <Link className="btn btn-blue mb-1 w-fit p-1" href={'/apps/application'}>
                Back
            </Link>

            <div className=" container  rounded ">
                <form className="mt-[20px] space-y-6 shadow-lg lg:p-20  max-lg:p-4">
                    {/*  Company details  */}
                    <h3 className="text-2xl font-bold">Details of Applicant Company</h3>
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                        <div>
                            <label htmlFor="underline_select" className="">
                                Membership Type
                            </label>
                            <select
                                disabled
                                {...register('membershipType', { required: 'Membership Type is required' })}
                                id="underline_select"
                                className=" block w-full appearance-none border border-gray-600  bg-transparent px-2  py-2.5 text-sm text-gray-500 focus:border-gray-200 "
                            >
                                <option value="">Membership Type</option>
                                <option value={'Silver'}>Silver </option>
                                <option value={'Gold'}>Gold</option>
                                <option value={'Platinum'}>Platinum</option>
                                <option value={'Founding'}>Founding</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="underline_select">Industry Classification</label>
                            <select
                                disabled
                                {...register('industryClassification', { required: 'Industry Classification is required' })}
                                id="underline_select"
                                className="peer block w-full appearance-none border border-gray-600 bg-transparent px-2 py-2.5 text-sm text-gray-500 focus:border-gray-200 "
                            >
                                <option value="">Industry Classification</option>
                                <option value="Container Traders">Container Traders</option>
                                <option value="Container Manufactures">Container Manufactures</option>
                                <option value="NVOCC">NVOCC</option>
                                <option value="NVOECs">NVOECs</option>
                                <option value="Shipping Related companies including Depot operators">Shipping Related companies including Depot operators</option>
                                <option value="Transport Operators">Transport Operators</option>
                                <option value="IT Industry">IT Industry</option>
                                <option value="Trade Associations">Trade Associations</option>
                                <option value="Direct Shippers">Direct Shippers</option>
                                <option value="Shipping Agencies">Shipping Agencies</option>
                                <option value="Government Agencies">Government Agencies</option>
                                <option value="Freight Forwarders">Freight Forwarders</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="underline_select_2">Company Type</label>
                            <select
                                disabled
                                {...register('companyType', { required: 'Company Type is required' })}
                                id="underline_select_2"
                                className="peer block w-full appearance-none border border-gray-600 bg-transparent px-2 py-2.5 text-sm text-gray-500 "
                            >
                                <option value="">Company Type</option>
                                <option value="Limited Liability Company">Limited Liability Company</option>
                                <option value="Public Limited Company">Public Limited Company</option>
                                <option value="Partnership">Partnership</option>
                                <option value="Sole Proprietorship">Sole Proprietorship</option>
                            </select>
                        </div>
                        <div className=" h-11 w-full min-w-[200px]">
                            <label className="">Staff Strength of Company</label>
                            <input disabled type="text" {...register('staffStrength')} className=" w-full border p-2" placeholder="Staff Strength of Company" />
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <label>Company Establish</label>
                            <input disabled type="date" {...register('companyEstablish')} className=" w-full border p-2" placeholder="Company Establish" />
                        </div>
                    </div>

                    {/*  contact person 1 */}
                    <h3 className="my-6 text-2xl font-bold">Contact Person 1</h3>
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                        <div className=" h-11 w-full min-w-[200px]">
                            <label>
                                Name<span className="text-red-500"> *</span>
                            </label>
                            <input disabled type="text" {...register('contactPerson1', { required: 'Contact Person 1 is required' })} className="w-full border p-2" placeholder="Contact Person 1*" />
                        </div>

                        <div className=" h-11 w-full min-w-[200px]">
                            <label>
                                Designation<span className="text-red-500"> *</span>
                            </label>
                            <input disabled type="text" {...register('designation1', { required: 'Designation is required' })} className="w-full border p-2" placeholder="Designation*" />
                        </div>

                        <div className=" h-11 w-full min-w-[200px]">
                            <label>Name of Applicant Company</label>
                            <input
                                disabled
                                type="text"
                                {...register('companyName', { required: 'Name of Applicant Company is required' })}
                                className="w-full border p-2"
                                placeholder="Name of Applicant Company"
                            />
                        </div>
                        <div className=" h-11 w-full min-w-[200px]">
                            <label>
                                Email Address<span className="text-red-500"> *</span>
                            </label>
                            <input
                                disabled
                                type="email"
                                {...register('email1', {
                                    required: 'Email Address is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                                className="w-full border p-2"
                                placeholder="Email Address*"
                            />
                        </div>

                        <div className=" h-11 w-full min-w-[200px]">
                            <label>Address of Main Office</label>
                            <input disabled type="text" {...register('mainOfficeAddress')} className="w-full border p-2" placeholder="Address of Main Office" />
                        </div>
                        <div className=" h-11 w-full min-w-[200px]">
                            <label>Office</label>
                            <input disabled type="text" {...register('office1')} className="w-full border p-2" placeholder="Office" />
                        </div>
                        <div className=" h-11 w-full min-w-[200px]">
                            <label>Billing Address</label>
                            <input disabled type="text" {...register('buildingAddress')} className="w-full border p-2" placeholder="Building Address" />
                        </div>

                        <div className=" flex gap-2">
                            <div className=" h-11 w-fit">
                                <label>
                                    Country Code<span className="text-red-500"> *</span>
                                </label>
                                <input disabled  {...register('countryCodeContactPerson1')} className="w-full border p-2" placeholder="Country Code*" />
                            </div>

                            <div className=" h-11 w-full min-w-[200px]">
                                <label>
                                    Mobile<span className="text-red-500"> *</span>
                                </label>
                                <input disabled type="tel" {...register('mobile1')} className="w-full border p-2" placeholder="Mobile*" />
                            </div>
                        </div>
                        <div className="flex w-full flex-col items-start justify-start gap-4">
                            <span className=" h-11 w-full min-w-[200px]">
                                <label>Correspondence Address (if differs from above)</label>
                                <input disabled type="text" {...register('correspondenceAddress')} className="w-full border p-2" placeholder="Correspondence Address (if differs from above)" />
                            </span>
                        </div>
                        <div className="flex flex-col ">
                            <span className=" text-sm text-gray-600">Upload the photograph for Contact Person 1</span>
                            <img
                                className="h-24 w-24 rounded-lg"
                                src={applicationPerson?.contactPerson1Picture ? ` ${urlImageDownload}${applicationPerson?.contactPerson1Picture}` : '/assets/images/contactPersonPicture.jpg'}
                                alt="company logo"
                                width={96}
                                height={96}
                            />
                            <input
                                type="file"
                                {...register('contactPerson1Picture')}
                                onChange={(e) => handleFileChange(e, 'contactPerson1Picture')} // Correctly pass fieldName
                                className="mt-2"
                                accept="image/png, image/jpeg"
                                disabled
                            />
                            {errors.contactPerson1Picture && <p className="text-red-500">{errors.contactPerson1Picture.message}</p>}
                        </div>
                    </div>

                    {/*Add contact person*/}
                    {sections.map((sectionNumber) => (
                        <ContactPersonSection
                            key={sectionNumber}
                            sectionNumber={sectionNumber}
                            register={register}
                            errors={errors}
                            onRemove={() => removeSection(sectionNumber)} // Pass the remove function
                            applicationPerson={applicationPerson}
                        />
                    ))}
                    {/* {sections.length < 4 && ( // Allow up to 5 sections total (3, 4, 5)
                        <button type="button" onClick={addSection} className="mt-4 rounded bg-blue-500 p-2 text-white">
                            View More Contact Person
                        </button>
                    )} */}

                    {/* company contact details */}
                    <h3 className=" mt-6 text-2xl font-bold ">Company Contact Details</h3>
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    {/* <div className=" flex gap-2">
                            <div className=" h-11 w-fit">
                                <label>
                                    Country Code<span className="text-red-500"> *</span>
                                </label>
                                <input disabled  {...register('countryCodeCompanyNumber')} className="w-full border p-2" placeholder="Country Code*" />
                            </div> */}
                        <div className=" h-11 w-full min-w-[200px]">
                            <label>Telephone Number</label>
                            <input disabled type="tel" {...register('telephoneNumber')} className="w-full border p-2" placeholder="Telephone Number" />
                        </div>
                        {/* </div> */}
                        <div className=" h-11 w-full min-w-[200px]">
                            <label>
                                Email Address of Company <span className="text-red-500"> *</span>
                            </label>
                            <input
                                disabled
                                type="email"
                                {...register('companyEmail', { required: 'Company Email is required' })}
                                className=" w-full border p-2"
                                placeholder="Email Address of Company*"
                            />
                        </div>

                        <div className=" h-11 w-full min-w-[200px]">
                            <label>Fax </label>
                            <input disabled type="tel" {...register('faxNumber')} className="w-full border p-2" placeholder="Fax " />
                        </div>
                        <div className=" h-11 w-full min-w-[200px]">
                            <label>Are you a member of local association / logistics network ?</label>
                            <input disabled type="text" {...register('containerTrading')} className=" w-full border p-2" placeholder="Are you a member of local association / logistics network ?" />
                        </div>

                        <div className=" max-sm:mt-1 h-11 w-full min-w-[200px]">
                            <label>
                                Website Address of Company <span className="text-red-500"> *</span>
                            </label>
                            <input
                                disabled
                                type="url"
                                {...register('companyWebsite', { required: 'company website is required' })}
                                className=" w-full border p-2"
                                placeholder="Website Address of Company*"
                            />
                        </div>
                        <div className=" h-11 w-full min-w-[200px]"></div>
                        <div className=" w-full  min-w-[200px] ">
                            <label>
                                Company Profile <span className="text-red-500"> *</span>
                            </label>
                            <div className=" overflow-y-hidden">
                                <textarea disabled type="text" {...register('companyInfo')} className=" w-full border p-2" placeholder="Company Profile*" rows={6} />
                            </div>
                        </div>

                        {/* member uploaded files */}
                        <div className="flex justify-center space-x-4">
                            <div className="flex flex-col items-center">
                                <input disabled type="file" {...register('businessCertificate')} ref={fileInputRefs.businessCertificate} style={{ display: 'none' }} />
                                <div className={`mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gray-300  `}>
                                    {applicationPerson?.businessCertificate ? (
                                        <IoDocumentText className="h-7 w-7 text-red-600" />
                                    ) : (
                                        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span className="px-3 text-center text-sm text-gray-600">Company's Business Registration Certificate</span>
                                {applicationPerson?.businessCertificate && (
                                    <div className="mt-2">
                                        <DownloadButton
                                            fileUrl={`${urlImageDownload}${applicationPerson?.businessCertificate}`}
                                            fileName={applicationPerson?.businessCertificate || 'businessCertificate'}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center">
                                <input disabled type="file" {...register('ownerId')} ref={fileInputRefs.ownerId} style={{ display: 'none' }} />
                                <div className={`mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gray-300 `}>
                                    {applicationPerson?.ownerId ? (
                                        <IoDocumentText className="h-7 w-7 text-red-600" />
                                    ) : (
                                        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span className="px-3 text-center text-sm text-gray-600">Owner’s Identification Document</span>
                                {applicationPerson?.ownerId && (
                                    <div className="mt-2">
                                        <DownloadButton fileUrl={`${urlImageDownload}${applicationPerson?.ownerId}`} fileName={applicationPerson?.ownerId || 'ownerId'} />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center">
                                <input disabled type="file" {...register('companyLogo')} ref={fileInputRefs.companyLogo} style={{ display: 'none' }} />
                                <div className={`mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gray-300  `}>
                                    {applicationPerson?.companyLogo ? (
                                        <img className="h-fit w-fit rounded-lg " src={`${urlImageDownload}${applicationPerson?.companyLogo}`} alt="company logo" width={50} height={50} />
                                    ) : (
                                        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
                                        </svg>
                                    )}
                                </div>
                                <span className="px-3 text-center text-sm text-gray-600">
                                    Company Logo <span className="text-red-500"> *</span>
                                </span>
                                {applicationPerson?.companyLogo && (
                                    <div className="mt-2">
                                        <DownloadButton fileUrl={`${urlImageDownload}${applicationPerson?.companyLogo}`} fileName={applicationPerson?.companyLogo || 'companyLogo'} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-2 grid grid-cols-1 gap-10 md:grid-cols-2">
                        <span className="space-y-6">
                            {' '}
                            <h2 className="my-2 text-2xl font-bold">Reference 1</h2>{' '}
                            <div className=" h-11 w-full min-w-[200px]">
                                <label>company Name</label>
                                <input disabled type="text" {...register('companyNameRef1')} className=" w-full border p-2" placeholder="company Name" />
                            </div>{' '}
                            <div className=" h-11 w-full min-w-[200px]">
                                <label>Email</label>
                                <input disabled type="email" {...register('emailRef1')} className=" w-full border p-2" placeholder="Email" />
                            </div>
                            <div className=" flex gap-2">
                            <div className=" h-11 w-fit">
                                <label>
                                    Country Code<span className="text-red-500"> *</span>
                                </label>
                                <input disabled  {...register('countryCodeRef1')} className="w-full border p-2" placeholder="Country Code*" />
                            </div>
                            <div className=" h-11 w-full min-w-[200px]">
                                <label>Number</label>
                                <input disabled type="tel" {...register('numberRef1')} className=" w-full border p-2" placeholder="Number" />
                            </div>
                            </div>
                            <div className=" h-11 w-full min-w-[200px]">
                                <label>Contact Person</label>
                                <input disabled type="text" {...register('contactPersonRef1')} className=" w-full border p-2" placeholder="Contact Person" />
                            </div>{' '}
                            <div className=" h-11 w-full min-w-[200px]">
                                <label>Designation</label>
                                <input disabled type="text" {...register('designationRef1')} className=" w-full border p-2" placeholder="Designation" />
                            </div>
                        </span>
                        <span className="space-y-6">
                            <h2 className="my-2 text-2xl font-bold">Reference 2</h2>

                            <div className=" h-11 w-full min-w-[200px]">
                                <label>company Name</label>
                                <input disabled type="text" {...register('companyNameRef2')} className=" w-full border p-2" placeholder="company Name" />
                            </div>

                            <div className=" h-11 w-full min-w-[200px]">
                                <label>Email</label>
                                <input disabled type="email" {...register('emailRef2')} className=" w-full border p-2" placeholder="Email" />
                            </div>
                            <div className=" flex gap-2">
                            <div className=" h-11 w-fit">
                                <label>
                                    Country Code<span className="text-red-500"> *</span>
                                </label>
                                <input disabled  {...register('countryCodeRef2')} className="w-full border p-2" placeholder="Country Code*" />
                            </div>
                            <div className=" h-11 w-full min-w-[200px]">
                                <label>Number</label>
                                <input disabled type="tel" {...register('numberRef2')} className=" w-full border p-2" placeholder="Number" />
                            </div>
                            </div>

                            <div className=" h-11 w-full min-w-[200px]">
                                <label>Contact Person</label>
                                <input disabled type="text" {...register('contactPersonRef2')} className=" w-full border p-2" placeholder="Contact Person" />
                            </div>

                            <div className=" h-11 w-full min-w-[200px]">
                                <label>Designation</label>
                                <input disabled type="text" {...register('designationRef2')} className=" w-full border p-2" placeholder="Designation" />
                            </div>
                        </span>
                    </div>
                </form>
            </div>

            <ToastContainer />
        </>
    );
};

export default EditApplication;
