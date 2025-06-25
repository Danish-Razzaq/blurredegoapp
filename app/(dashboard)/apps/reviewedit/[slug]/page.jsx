'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiCaller } from '@/utils/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ContactPersonSection from '@/components/contactPerson';
import { IoDocumentText } from 'react-icons/io5';
import DownloadButton from '@/components/DownloadButton';

const ReviewEditView = () => {
    const [reviewEdit, setReviewEdit] = useState(null);
    const [application, setApplication] = useState(null);
    const [changes, setChanges] = useState({});
    const params = useParams(); // Get params from the URL
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            let review = await apiCaller('get', `review-edits?filters[id][$eq]=${params?.slug}&populate=*`);
            if (review) {
                setReviewEdit(review?.data[0].attributes);
                let newApplication = review?.data[0];
                let application = await apiCaller('get', `applications?filters[email][$eq]=${review?.data[0]?.attributes?.email}&populate=*`);
                if (application) {
                    setApplication(application?.data[0].attributes);
                    let appChanges = {};
                    let oldApplication = application?.data[0];
                    for (const field in oldApplication?.attributes) {
                        if (oldApplication?.attributes[field] !== newApplication?.attributes[field]) {
                            appChanges[field] = {
                                old: oldApplication?.attributes[field],
                                new: newApplication?.attributes[field],
                            };
                        }
                    }
                    setChanges(appChanges);
                }
            }
        } catch (err) {}
    };

    return (
        <div>
            {' '}
            <Link className="btn btn-blue mb-1 w-fit p-1" href={'/apps/reviewedit'}>
                Back
            </Link>
            <div className="flex justify-center gap-4   max-lg:flex-wrap ">
                {/* {application && ( */}
                    <div>
                        <h5>Old Application</h5>
                        <CompareForm applicationPerson={application} />
                    </div>
                {/* )} */}
                {/* {reviewEdit && ( */}
                    <div>
                        <h5>New Application</h5>
                        <CompareForm applicationPerson={reviewEdit} changes={changes} />
                    </div>
                {/* )} */}
            </div>
        </div>
    );
};
export default ReviewEditView;

const CompareForm = ({ applicationPerson, changes }) => {
    // console.log('changes',changes )
    // console.log('applicationPerson', applicationPerson);

    const selectedFiles = {};
    const urlImageDownload = process.env.NEXT_PUBLIC_BACKEND_URL;
    const {
        register,
        formState: { errors },
    } = useForm({
        defaultValues: applicationPerson || {},
    });

    const truncateFileName = (name) => {
        return name.length > 6 ? `${name.substring(0, 6)}..` : name;
    };

    const [sections, setSections] = useState([2]); // Default to 3 sections

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
        if (sections.length < 5) {
            // Allow up to 5 sections
            setSections([...sections, sections[sections.length - 1] + 1]);
        }
    };

    // Function to remove a section
    const removeSection = (sectionNumber) => {
        setSections(sections.filter((number) => number !== sectionNumber));
    };

    return (
        <>
            <title>ReviewEdits Changes</title>
            <div className=" container  mt-5   rounded ">
                <form className="mt-[30px] space-y-6 p-5 shadow-lg  lg:p-20">
                    {/*Details of Applicant Company  */}
                    <h3 className="mb-6 text-2xl font-bold">Details of Applicant Company</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="underline_select">Industry Classification</label>
                            <select
                                style={loadStyleOnChanges(changes, 'industryClassification')}
                                disabled
                                {...register('industryClassification', { required: 'Industry Classification is required' })}
                                id="underline_select"
                                className="peer block w-full appearance-none border-b-2 border-gray-600  px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0"
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
                            {errors.industryClassification && <p className="text-red-500">{errors.industryClassification.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="underline_select_2">Company Type</label>
                            <select
                                style={loadStyleOnChanges(changes, 'companyType')}
                                disabled
                                {...register('companyType', { required: 'Company Type is required' })}
                                id="underline_select_2"
                                className="peer block w-full appearance-none border-b-2 border-gray-600  px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0"
                            >
                                <option value="">Company Type</option>
                                <option value="Limited Liability Company">Limited Liability Company</option>
                                <option value="Public Limited Company">Public Limited Company</option>
                                <option value="Partnership">Partnership</option>
                                <option value="Sole Proprietorship">Sole Proprietorship</option>
                            </select>
                            {errors.companyType && <p className="text-red-500">{errors.companyType.message}</p>}
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <label className="font-normal">Staff Strength of Company</label>
                            <input
                                style={loadStyleOnChanges(changes, 'staffStrength')}
                                disabled
                                type="text"
                                {...register('staffStrength')}
                                className="w-full border px-1"
                                placeholder="Staff Strength of Company"
                            />
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <label className="font-normal">Company Establish</label>
                            <input
                                type="date"
                                style={loadStyleOnChanges(changes, 'companyEstablish')}
                                {...register('companyEstablish')}
                                className="w-full border px-1"
                                placeholder="Company Establish"
                            />

                            {errors.companyEstablish && <p className="text-red-500">{errors.companyEstablish.message}</p>}
                        </div>
                    </div>

                    {/*Contact Person 1  */}
                    <h3 className="mb-6 text-2xl font-bold">Contact Person 1 </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="relative h-11 w-full min-w-[200px]">
                            <label className="font-normal">
                                Name<span className="text-red-500"> *</span>
                            </label>
                            <input
                                style={loadStyleOnChanges(changes, 'contactPerson1')}
                                disabled
                                type="text"
                                {...register('contactPerson1', { required: 'Contact Person 1 is required' })}
                                className="w-full border px-1"
                                placeholder="Contact Person Name*"
                            />

                            {errors.contactPerson1 && <p className="text-red-500">{errors.contactPerson1.message}</p>}
                        </div>

                        <div className="relative h-11 w-full min-w-[200px]">
                            <label className="font-normal">
                                Designation<span className="text-red-500"> *</span>
                            </label>
                            <input
                                style={loadStyleOnChanges(changes, 'designation1')}
                                disabled
                                type="text"
                                {...register('designation1', { required: 'Designation is required' })}
                                className="w-full border px-1"
                                placeholder="Designation*"
                            />

                            {errors.designation1 && <p className="text-red-500">{errors.designation1.message}</p>}
                        </div>

                        <div className="relative h-11 w-full min-w-[200px]">
                            <label className="font-normal">Name of Applicant Company</label>
                            <input
                                style={loadStyleOnChanges(changes, 'companyName')}
                                disabled
                                type="text"
                                {...register('companyName', { required: 'Name of Applicant Company is required' })}
                                className="w-full border px-1"
                                placeholder="Name of Applicant Company"
                            />
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <label className="font-normal">
                                Email Address<span className="text-red-500"> *</span>
                            </label>
                            <input
                                style={loadStyleOnChanges(changes, 'email1')}
                                disabled
                                type="email"
                                {...register('email1', {
                                    required: 'Email Address is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                                className="w-full border px-1"
                                placeholder="Email Address*"
                            />

                            {errors.email1 && <p className="text-red-500">{errors.email1.message}</p>}
                        </div>

                        <div className="relative h-11 w-full min-w-[200px]">
                            <label className="font-normal">Address of Main Office</label>
                            <input
                                style={loadStyleOnChanges(changes, 'mainOfficeAddress')}
                                disabled
                                type="text"
                                {...register('mainOfficeAddress')}
                                className="w-full border px-1"
                                placeholder="Address of Main Office"
                            />
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <label className="font-normal">Office</label>
                            <input style={loadStyleOnChanges(changes, 'office1')} disabled type="text" {...register('office1')} className="w-full border px-1" placeholder="Office" />
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <label className="font-normal">Building Address</label>
                            <input
                                style={loadStyleOnChanges(changes, 'buildingAddress')}
                                disabled
                                type="text"
                                {...register('buildingAddress')}
                                className="w-full border px-1"
                                placeholder="Building Address"
                            />
                        </div>
                        <div className="flex gap-2 ">
                            <div className="relative h-11  w-fit">
                                <label className="font-normal text-nowrap">
                                    Country code <span className="text-red-500"> *</span>
                                </label>
                                <input
                                    style={loadStyleOnChanges(changes, 'countryCodeContactPerson1')}
                                    disabled
                                    type="text"
                                    className="w-full border p-1 max-w-[140px]"
                                    id="floatingInput"
                                    placeholder="Country Code"
                                    maxLength={4}
                                    name="countryCode"
                                    {...register('countryCodeContactPerson1', {
                                        required: true,
                                        maxLength: 4,
                                    })}
                                    list="countryCodes" // Connect to the datalist
                                />
                            </div>
                            <div className="relative h-11 w-full ">
                                <label className="font-normal">
                                    Mobile<span className="text-red-500"> *</span>
                                </label>
                                <input
                                    style={loadStyleOnChanges(changes, 'mobile1')}
                                    disabled
                                    type="tel"
                                    {...register('mobile1', { required: 'Mobile is required' })}
                                    className="w-full border px-1"
                                    placeholder="Mobile*"
                                />
                                {errors.mobile1 && <p className="text-red-500">{errors.mobile1.message}</p>}
                            </div>
                        </div>

                        <div className="flex w-full flex-col items-start justify-start gap-4">
                            <span className="relative h-11 w-full min-w-[200px]">
                                <label className="font-normal">Correspondence Address</label>
                                <input
                                    style={loadStyleOnChanges(changes, 'correspondenceAddress')}
                                    disabled
                                    type="text"
                                    {...register('correspondenceAddress')}
                                    className="w-full border px-1"
                                    placeholder="Correspondence Address (if differs from above)"
                                />
                                {errors.correspondenceAddress && <p className="text-red-500">{'Correspondence Address required'}</p>}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600">Upload the photograph for Contact Person 1</span>
                            <img
                                className="h-24 w-24 rounded-lg"
                                src={applicationPerson?.contactPerson1Picture ? ` ${urlImageDownload}${applicationPerson?.contactPerson1Picture}` : '/assets/images/contactPersonPicture.jpg'}
                                alt="company logo"
                                width={96}
                                height={96}
                            />
                            <input type="file" {...register('contactPerson1Picture')} onChange={(e) => handleFileChange(e, 'contactPerson1Picture')} className="mt-2" accept="image/png, image/jpeg" />
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
                            selectedFiles={selectedFiles}
                            applicationPerson={applicationPerson}
                            changes={changes}
                            loadStyleOnChanges={loadStyleOnChanges} // Make sure this is passed here
                        />
                    ))}
                    {/* {sections.length < 4 && ( // Allow up to 5 sections total (3, 4, 5)
                        <button type="button" onClick={addSection} className="mt-4 rounded bg-blue-500 p-2 text-white">
                            View More Contact Person
                        </button>
                    )} */}

                    <h3 className="mb-6 text-2xl font-bold"> Company Contact Details</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* <div className="flex gap-2">
                                    <div className="relative h-11  w-fit">
                                        <label className="font-normal">
                                            Country code <span className="text-red-500"> *</span>
                                        </label>
                                        <input
                                            type="text"
                                            style={loadStyleOnChanges(changes, 'countryCodeCompanyNumber')}
                                            disabled
                                            className="border p-1 w-full"
                                            id="floatingInput"
                                            placeholder="Country Code"
                                            maxLength={4}
                                            name="countryCode"
                                            {...register('countryCodeCompanyNumber', {
                                                required: true,
                                                maxLength: 4,
                                            })}
                                            list="countryCodes" // Connect to the datalist
                                        />
                                    </div> */}
                        <div className="relative h-11 w-full min-w-[200px]">
                            <label className="font-normal">Telephone Number</label>
                            <input
                                style={loadStyleOnChanges(changes, 'telephoneNumber')}
                                disabled
                                type="tel"
                                {...register('telephoneNumber')}
                                className="w-full border px-1"
                                placeholder="Telephone Number"
                            />
                        </div>
                        {/* </div> */}
                        <div className="relative h-11 w-full min-w-[200px]">
                            <label className="font-normal">
                                Email Address of Company <span className="text-red-500"> *</span>
                            </label>
                            <input
                                style={loadStyleOnChanges(changes, 'companyEmail')}
                                disabled
                                type="email"
                                {...register('companyEmail', { required: 'Company Email is required' })}
                                className=" w-full border px-1"
                                placeholder="Email Address of Company*"
                            />
                            {errors.companyEmail && <p className="text-red-500">{errors.companyEmail.message}</p>}
                        </div>

                        <div className="relative h-11 w-full min-w-[200px]">
                            <label className="font-normal">Fax </label>
                            <input style={loadStyleOnChanges(changes, 'faxNumber')} disabled type="tel" {...register('faxNumber')} className="w-full border px-1" placeholder="Fax " />
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <label className="text-nowrap font-normal">Are you a member of association network ?</label>

                            <input
                                style={loadStyleOnChanges(changes, 'containerTrading')}
                                disabled
                                type="text"
                                {...register('containerTrading')}
                                className=" w-full border px-1"
                                placeholder="Are you a member of local association / logistics network ?"
                            />
                        </div>

                        <div className="  w-full min-w-[200px]">
                            <label className="font-normal">
                                Company Profile <span className="text-red-500"> *</span>
                            </label>
                            <div className=" overflow-y-hidden">
                                <textarea
                                    style={loadStyleOnChanges(changes, 'companyInfo')}
                                    disabled
                                    {...register('companyInfo', {
                                        required: 'Company Profile is required',
                                    })}
                                    className=" w-full border p-2" // Customize height and padding
                                    placeholder="Enter a brief summary of your company, including services, history, and mission."
                                    rows={6} // Adjust the rows as needed to control the initial size
                                />
                            </div>
                        </div>

                        <div className="  max-sm:mt-1 h-11 w-full min-w-[200px]">
                            <label className="font-normal">
                                Website Address of Company <span className="text-red-500"> *</span>
                            </label>
                            <input
                                style={loadStyleOnChanges(changes, 'companyWebsite')}
                                disabled
                                type="url"
                                {...register('companyWebsite', { required: 'company website is required' })}
                                className=" w-full border px-1"
                                placeholder="Website Address of Company*"
                            />
                            {errors.companyWebsite && <p className="text-red-500">{errors.companyWebsite.message}</p>}
                        </div>
                    </div>
                    <div className="flex w-full justify-center  space-x-4">
                        <div className="flex flex-col items-center">
                            <input style={{ display: 'none' }} disabled type="file" {...register('businessCertificate')} onChange={(e) => handleFileChange(e, 'businessCertificate')} />
                            <div
                                className={`mb-2 flex h-14 w-14 items-center justify-center rounded-full ${
                                    changes?.businessCertificate?.new !== changes?.businessCertificate?.old ? 'bg-[#adff2f]' : 'bg-gray-300'
                                }`}
                            >
                                {selectedFiles.businessCertificate ? (
                                    <span className={`text-xs  ${selectedFiles.businessCertificate ? 'text-black' : 'text-red-500'}`}>{truncateFileName(selectedFiles.businessCertificate.name)}</span>
                                ) : applicationPerson?.businessCertificate ? (
                                    <IoDocumentText className="h-7 w-7 text-red-600" />
                                ) : (
                                    <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V4a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                    </svg>
                                )}
                            </div>
                            <span className="px-3 text-center text-sm text-gray-600">Company's Business Registration Certificate</span>
                            <DownloadButton fileUrl={`${urlImageDownload}${applicationPerson?.businessCertificate}`} fileName={applicationPerson?.businessCertificate || 'businessCertificate'} />
                        </div>

                        <div className="flex flex-col items-center">
                            <input style={{ display: 'none' }} disabled type="file" {...register('ownerId')} onChange={(e) => handleFileChange(e, 'ownerId')} />
                            <div
                                className={`mb-2 flex h-14 w-14 items-center justify-center rounded-full
                              ${changes?.ownerId?.new !== changes?.ownerId?.old ? 'bg-[#adff2f]' : 'bg-gray-300'} `}
                            >
                                {selectedFiles.ownerId ? (
                                    <span className={`text-xs  ${selectedFiles.ownerId ? 'text-black' : 'text-red-500'}`}>{truncateFileName(selectedFiles.ownerId.name)}</span>
                                ) : applicationPerson?.ownerId ? (
                                    <IoDocumentText className="h-7 w-7 text-red-600" />
                                ) : (
                                    <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V4a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                    </svg>
                                )}
                            </div>
                            <span className="px-3 text-center text-sm text-gray-600">Owner’s Identification Document</span>
                            <DownloadButton fileUrl={`${urlImageDownload}${applicationPerson?.ownerId}`} fileName={applicationPerson?.ownerId || 'ownerId'} />
                        </div>

                        <div className="flex flex-col items-center">
                            <input style={{ display: 'none' }} disabled type="file" {...register('companyLogo')} onChange={(e) => handleFileChange(e, 'companyLogo')} />
                            <div
                                className={`mb-2 flex h-14 w-14 items-center justify-center rounded-full 
                            ${changes?.companyLogo?.new !== changes?.companyLogo?.old ? 'bg-[#adff2f]' : 'bg-gray-300'} `}
                            >
                                {selectedFiles.companyLogo ? (
                                    <span className={`text-xs  ${selectedFiles.companyLogo ? 'text-black' : 'text-red-500'}`}>{truncateFileName(selectedFiles.companyLogo.name)}</span>
                                ) : applicationPerson?.companyLogo ? (
                                    <img className="h-10 w-10 rounded-lg " src={`${urlImageDownload}${applicationPerson?.companyLogo}`} alt="company logo" />
                                ) : (
                                    <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
                                    </svg>
                                )}
                            </div>
                            <span className="px-3 text-center text-sm text-gray-600">
                                Company Logo<span className="text-red-500">*</span>
                            </span>
                            <DownloadButton fileUrl={`${urlImageDownload}${applicationPerson?.companyLogo}`} fileName={applicationPerson?.companyLogo || 'companyLogo'} />
                        </div>
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <span className="space-y-6">
                            {' '}
                            <h2 className=" text-2xl font-bold">Reference 1</h2>
                            <div className="relative h-11 w-full min-w-[200px]">
                                <label className="font-normal">company Name</label>
                                <input
                                    style={loadStyleOnChanges(changes, 'companyNameRef1')}
                                    disabled
                                    type="text"
                                    {...register('companyNameRef1')}
                                    className=" w-full border px-1"
                                    placeholder="company Name"
                                />
                            </div>
                            <div className="relative h-11 w-full min-w-[200px]">
                                <label className="font-normal">Email</label>
                                <input style={loadStyleOnChanges(changes, 'emailRef1')} disabled type="email" {...register('emailRef1')} className=" w-full border px-1" placeholder="Email" />
                            </div>
                            <div className="flex gap-2">
                                <div className="relative h-11  max-w-[140px] text-nowrap">
                                    <label className="font-normal">
                                        Country code <span className="text-red-500"> *</span>
                                    </label>
                                    <input
                                        style={loadStyleOnChanges(changes, 'countryCodeRef1')}
                                        disabled
                                        type="text"
                                        className=" w-full border px-1"
                                        id="floatingInput"
                                        placeholder="Country Code"
                                        maxLength={4}
                                        name="countryCode"
                                        {...register('countryCodeRef1', {
                                            required: true,
                                            maxLength: 4,
                                        })}
                                        list="countryCodes" // Connect to the datalist
                                    />
                                </div>
                                <div className="relative h-11 w-full">
                                    <label className="font-normal">Number</label>
                                    <input style={loadStyleOnChanges(changes, 'numberRef1')} disabled type="tel" {...register('numberRef1')} className=" w-full border px-1" placeholder="Number" />
                                </div>
                            </div>
                            <div className="relative h-11 w-full min-w-[200px]">
                                <label className="font-normal">Contact Person</label>
                                <input
                                    style={loadStyleOnChanges(changes, 'contactPersonRef1')}
                                    disabled
                                    type="text"
                                    {...register('contactPersonRef1')}
                                    className=" w-full border px-1"
                                    placeholder="Contact Person"
                                />
                            </div>
                            <div className="relative h-11 w-full min-w-[200px]">
                                <label className="font-normal">Designation</label>
                                <input
                                    style={loadStyleOnChanges(changes, 'designationRef1')}
                                    disabled
                                    type="text"
                                    {...register('designationRef1')}
                                    className=" w-full border px-1"
                                    placeholder="Designation"
                                />
                            </div>
                        </span>
                        <span className="space-y-6">
                            <h2 className=" text-2xl font-bold">Reference 2</h2>

                            <div className="relative h-11 w-full min-w-[200px]">
                                <label className="font-normal">company Name</label>
                                <input
                                    style={loadStyleOnChanges(changes, 'companyNameRef2')}
                                    disabled
                                    type="text"
                                    {...register('companyNameRef2')}
                                    className=" w-full border px-1"
                                    placeholder="company Name"
                                />
                            </div>

                            <div className="relative h-11 w-full min-w-[200px]">
                                <label className="font-normal">Email</label>
                                <input style={loadStyleOnChanges(changes, 'emailRef2')} disabled type="email" {...register('emailRef2')} className=" w-full border px-1" placeholder="Email" />
                            </div>

                            <div className="flex gap-2">
                                <div className="relative h-11 max-w-[140px] ">
                                    <label className="font-normal text-nowrap">
                                        Country code <span className="text-red-500"> *</span>
                                    </label>
                                    <input
                                        style={loadStyleOnChanges(changes, 'countryCodeRef2')}
                                        disabled
                                        type="text"
                                        className=" w-full border px-1"
                                        placeholder="Country Code"
                                        maxLength={4}
                                        name="countryCode"
                                        {...register('countryCodeRef2', {
                                            required: true,
                                            maxLength: 4,
                                        })}
                                        list="countryCodes" // Connect to the datalist
                                    />
                                </div>
                                <div className="relative h-11 w-full">
                                    <label className="font-normal">Number</label>
                                    <input style={loadStyleOnChanges(changes, 'numberRef2')} disabled type="tel" {...register('numberRef2')} className=" w-full border px-1" placeholder="Number" />
                                </div>
                            </div>

                            <div className="relative h-11 w-full min-w-[200px]">
                                <label className="font-normal">Contact Person</label>
                                <input
                                    style={loadStyleOnChanges(changes, 'contactPersonRef2')}
                                    disabled
                                    type="text"
                                    {...register('contactPersonRef2')}
                                    className=" w-full border px-1"
                                    placeholder="Contact Person"
                                />
                            </div>

                            <div className=" h-11 w-full min-w-[200px]">
                                <label className="">Designation</label>
                                <input
                                    style={loadStyleOnChanges(changes, 'designationRef2')}
                                    disabled
                                    type="text"
                                    {...register('designationRef2')}
                                    className="  w-full border px-1"
                                    placeholder="Designation"
                                />
                            </div>
                        </span>
                    </div>
                </form>
            </div>
        </>
    );
};

function loadStyleOnChanges(changes, field) {
    let style = { height: '2.5rem' };
    if (changes && changes[field]?.new !== changes[field]?.old) {
        style.background = 'greenyellow';
    }
    return style;
}
