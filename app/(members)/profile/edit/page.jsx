'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiCaller, apiCallerImgUpload } from '@/utils/api';
import { ErrorNotification } from '@/components/Toster/success';
import { getSingleApplicationRecord, getUser } from '@/utils/helperFunctions';
import { SuccessNotification } from '@/components/Toster/success';
import { ToastContainer } from 'react-toastify';
import Link from 'next/link';
import ContactPersonSection from '@/components/contactPerson';
import { IoDocumentText } from 'react-icons/io5';

const EditMemebrApplication = () => {
    const [applicationPerson, setApplicationPerson] = useState(null);
    const [listOfCountries, setListOfCountries] = useState([]);
    const user = getUser();
    const urlImageDownload = process.env.NEXT_PUBLIC_BACKEND_URL;
    const fileInputRefs = {
        businessCertificate: useRef(null),
        ownerId: useRef(null),
        companyLogo: useRef(null),
    };
    const [selectedFiles, setSelectedFiles] = useState({});
    const [isFormChanged, setIsFormChanged] = useState(false); // Track if form values have changed
    const [initialValues, setInitialValues] = useState({}); // Store initial form values



    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();

    const fetchData = async () => {
        try {
            let result = await getSingleApplicationRecord();
            // console.log('result', result);

            if (result?.data[0]?.attributes) {
                const attributes = result.data[0].attributes;
                setApplicationPerson(attributes);

                // Dynamically set form values
                const defaultValues = Object.keys(attributes).reduce((acc, key) => {
                    acc[key] = attributes[key] || '';
                    return acc;
                }, {});

                reset(defaultValues); // Set the form values dynamically
                setInitialValues(defaultValues); // Store initial form values
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Watch all form fields for changes
    const watchedValues = watch();

    // Compare watched values with initial values
    // Track if form fields or file uploads have changed
    useEffect(() => {
        const hasFormChanged = Object.keys(initialValues).some((key) => initialValues[key] !== watchedValues[key]);
        // console.log('hasFormChanged', hasFormChanged);

        // Check if any file has been selected/changed
        const hasFileChanged = Object.keys(selectedFiles).some((key) => selectedFiles[key] !== null);
        // console.log('hasFileChanged', hasFileChanged);

        // Set form change state if any form field or file has changed
        setIsFormChanged(hasFormChanged || hasFileChanged);
    }, [watchedValues, selectedFiles, initialValues]);



    const handleClick = (fieldName) => {
        fileInputRefs[fieldName].current.click();
    };

    const uploadFile = async (file, fieldName) => {
        const formData = new FormData();
        formData.append('files', file);

        try {
            const response = await apiCallerImgUpload('post', 'upload', formData);
            // console.log(`File uploaded successfully for ${fieldName}:`, response);

            // Extract file information
            const fileInfo = response[0]; // Assuming the response is an array with file objects
            return fileInfo; // Return file info (e.g., URL or ID)
        } catch (error) {
            console.error(`Error uploading file for ${fieldName}:`, error);
            ErrorNotification('File upload failed');
            throw new Error('File upload failed');
        }
    };

    const handleFileChange = (event, fieldName) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFiles((prevFiles) => ({
                ...prevFiles,
                [fieldName]: file,
            }));
        }
    };

    const truncateFileName = (name) => {
        return name.length > 6 ? `${name.substring(0, 6)}..` : name;
    };

    //  upload document function
    //for files upload validation
    const [errorsFiles, setErrors] = useState({
        // businessCertificate: null,
        // ownerId: null,
        companyLogo: null,
    });
    const onSubmit = async (data) => {
        // Define allowed image types
        const allowedImageTypes = ['image/jpeg', 'image/png'];

        try {
            // Check for errors with selected files, specifically checking ratio only for companyLogo
            const hasError = await Promise.all(
                Object.entries(selectedFiles).map(async ([key, file]) => {
                    if (key === 'companyLogo') {
                        if (!allowedImageTypes.includes(file.type)) {
                            return { [key]: 'Only JPEG and PNG image files are allowed.' };
                        }
                    }
                    return null; // No additional checks needed for other files
                })
            ).then((errors) => errors.filter((e) => e !== null));

            // If there are errors, set them and prevent submission
            if (hasError.length > 0) {
                const errorMessages = hasError.reduce((acc, error) => ({ ...acc, ...error }), {});
                setErrors(errorMessages);
                return; // Stop execution if there are validation errors
            }

            // Upload files
            const fileUploadPromises = Object.keys(selectedFiles).map(async (fieldName) => {
                if (selectedFiles[fieldName]) {
                    try {
                        return await uploadFile(selectedFiles[fieldName], fieldName);
                    } catch (error) {
                        console.error(`File upload failed for ${fieldName}:`, error);
                        ErrorNotification('File upload failed');
                        throw new Error(`File upload failed for ${fieldName}`);
                    }
                }
                return null;
            });

            // Wait for all file uploads to complete
            const fileUploadResults = await Promise.all(fileUploadPromises);

            // Map file results to form data
            let formData = { ...data, username: user?.name, email: user?.email };

            // Attach file upload results to formData
            fileUploadResults.forEach((fileInfo, index) => {
                if (fileInfo) {
                    const fieldName = Object.keys(selectedFiles)[index];
                    formData[fieldName] = fileInfo.url || fileInfo.id;
                }
            });

            // Filter out optional fields (email3, email4, email5, etc.) if they are empty or null
            const optionalFields = ['email3', 'email4', 'email5'];
            formData = Object.keys(formData).reduce((acc, key) => {
                if (!optionalFields.includes(key) || formData[key]) {
                    acc[key] = formData[key]; // Only include non-empty optional fields
                }
                return acc;
            }, {});

            // Submit form data to the API
            const response = await apiCaller('post', `review-edits`, {
                data: formData,
            });

            // console.log('Form submission response:', response);

            // Show success notification and update the state
            SuccessNotification('Review Submission successful');
            fetchData();
        } catch (error) {
            console.error('Form submission error:', error);
            ErrorNotification('Review submission failed');
        }
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
            <title> Application Edit</title>
            <Link className="btn btn-primary mb-1 w-fit p-1" href={'/profile'}>
                Back
            </Link>
            <div className=" container    rounded ">
                <form onSubmit={handleSubmit(onSubmit)} className="mt-[30px] space-y-6 p-5 shadow-lg  lg:p-20">
                    {/*  Company details input felids */}
                    <h3 className="mb-6 text-2xl font-bold">Details of Applicant Company</h3>
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                        {/* <div className="relative h-11 w-full min-w-[200px]"></div> */}
                        <div>
                            <label htmlFor="underline_select" className="sr-only">
                                Underline select
                            </label>
                            <select
                                {...register('industryClassification', { required: 'Industry Classification is required' })}
                                id="underline_select"
                                className="peer block w-full appearance-none border-b-2 border-gray-600 bg-transparent px-1 py-2.5 pl-2 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0"
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
                            <label htmlFor="underline_select_2" className="sr-only">
                                Underline select
                            </label>
                            <select
                                {...register('companyType', { required: 'Company Type is required' })}
                                id="underline_select_2"
                                className="peer block w-full appearance-none border-b-2 border-gray-600 bg-transparent px-1 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0"
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
                            <input
                                type="number"
                                {...register('staffStrength', { required: 'Staff Strength is required' })}
                                className="input-Style peer w-full"
                                placeholder="Staff Strength of Company"
                            />
                            <label className="input-style-label">
                                Staff Strength of Company <span className="text-red-500"> *</span>
                            </label>
                            {errors.staffStrength && <p className="text-red-500">{errors.staffStrength.message}</p>}
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <input type="date" {...register('companyEstablish', { required: 'Company Establish is required' })} className="input-Style peer w-full" placeholder="Company Establish" />
                            <label className="input-style-label">
                                Company Establish <span className="text-red-500"> *</span>
                            </label>
                            {errors.companyEstablish && <p className="text-red-500">{errors.companyEstablish.message}</p>}
                        </div>
                    </div>

                    {/*  contact person 1 details */}
                    <h3 className=" text-2xl font-bold">Contact Person 1</h3>
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                        <div className="relative h-11 w-full min-w-[200px]">
                            <input
                                type="text"
                                {...register(
                                    'contactPerson1',
                                    { required: 'Contact Person  is required' },
                                    {
                                        pattern: {
                                            value: /^[0-9]{11}$/i,
                                            message: 'Invalid phone number',
                                        },
                                    }
                                )}
                                className="input-Style peer w-full"
                                placeholder="Contact Person Name"
                            />
                            <label className="input-style-label">
                                Name <span className="text-red-500"> *</span>
                            </label>
                            {errors.contactPerson1 && <p className="text-red-500">{errors.contactPerson1.message}</p>}
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <input type="text" {...register('designation1', { required: 'Designation is required' })} className="input-Style peer w-full" placeholder="Designation*" />
                            <label className="input-style-label">
                                Designation<span className="text-red-500"> *</span>
                            </label>
                            {errors.designation1 && <p className="text-red-500">{errors.designation1.message}</p>}
                        </div>

                        <div className="relative h-11 w-full min-w-[200px]">
                            <input type="text" {...register('companyName', { required: 'Company Name is required' })} className="input-Style peer w-full" placeholder="Name of Applicant Company" />
                            <label className="input-style-label">
                                Name of Applicant Company <span className="text-red-500"> *</span>
                            </label>
                            {errors.companyName && <p className="text-red-500">{errors.companyName.message}</p>}
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <input
                                type="email"
                                {...register('email1', {
                                    required: 'Email Address is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                                className="input-Style peer w-full"
                                placeholder="abc@gmail.com"
                            />
                            <label className="input-style-label">
                                Email Address<span className="text-red-500"> *</span>
                            </label>
                            {errors.email1 && <p className="text-red-500">{errors.email1.message}</p>}
                        </div>

                        <div className="relative h-11 w-full min-w-[200px]">
                            <input
                                type="text"
                                {...register('mainOfficeAddress', { required: 'Address of Main Office is required' })}
                                className="input-Style peer w-full"
                                placeholder="Address of Main Office"
                            />
                            <label className="input-style-label">
                                Address of Main Office<span className="text-red-500"> *</span>
                            </label>
                            {errors.mainOfficeAddress && <p className="text-red-500">{errors.mainOfficeAddress.message}</p>}
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <input
                                type="text"
                                {...register('office1', {
                                    required: 'Office is required',
                                })}
                                className="input-Style peer w-full"
                                placeholder="Office"
                            />
                            <label className="input-style-label">
                                Office <span className="text-red-500"> *</span>
                            </label>
                            {errors.office1 && <p className="text-red-500">{errors.office1.message}</p>}
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <input type="text" {...register('buildingAddress', { required: 'Building Address is required' })} className="input-Style peer w-full" placeholder="Building Address" />

                            <label className="input-style-label">
                                Building Address <span className="text-red-500"> *</span>
                            </label>
                            {errors.buildingAddress && <p className="text-red-500">{errors.buildingAddress.message}</p>}
                        </div>
                        <div  className='flex gap-2'>
                                <div className="relative h-11  w-fit">
                                                    <input
                                                        type="text"
                                                        className="input-Style peer w-full"
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
                                                    <label  className="input-style-label">Country code <span className="text-red-500"> *</span></label>

                                                    {/* Datalist for country codes */}
                                                    <datalist id="countryCodes">
                                                        {listOfCountries.map((country) => (
                                                                <option key={country.code} value={country.code}>
                                                                    {country.value} (+{country.code})
                                                                </option>
                                                            ))}
                                                    </datalist>
                                                    {errors.countryCodeContactPerson1 && <p className="text-red-500">Country code is required</p>}
                                                </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <input type="tel" {...register('mobile1', { required: 'Mobile is required' })} className="input-Style peer w-full" placeholder="+234 000 000 0000" />
                            <label className="input-style-label">
                                Mobile<span className="text-red-500"> *</span>
                            </label>
                            {errors.mobile1 && <p className="text-red-500">{errors.mobile1.message}</p>}
                        </div>
                        </div>

                        <div className="flex w-full flex-col items-start justify-start gap-1">
                            <span className="relative h-11 w-full min-w-[200px]">
                                <input
                                    type="text"
                                    {...register('correspondenceAddress', {
                                        required: 'Correspondence Address is required',
                                    })}
                                    className="input-Style peer w-full"
                                    placeholder="Correspondence Address (if differs from above)"
                                />
                                <label className="input-style-label">
                                    Correspondence Address (if differs from above) <span className="text-red-500"> *</span>
                                </label>
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
                            onFileChange={handleFileChange}
                            selectedFiles={selectedFiles}
                            setSelectedFiles={setSelectedFiles}
                            handleFileChange={handleFileChange}
                            applicationPerson={applicationPerson}
                        />
                    ))}
                    {sections.length < 4 && ( // Allow up to 5 sections total (3, 4, 5)
                        <button type="button" onClick={addSection} className="mt-4 rounded bg-blue-500 p-2 text-white">
                            Add More Contact Person
                        </button>
                    )}

                    <h3 className=" text-2xl font-bold">Company Contact Details</h3>
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    {/* <div className="flex gap-2">
                                    <div className="relative h-11  w-fit">
                                        <input
                                            type="text"
                                            className="input-Style peer w-full"
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
                                        <label className="input-style-label">
                                            Country code <span className="text-red-500"> *</span>
                                        </label>

                                       
                                        <datalist id="countryCodes">
                                            {listOfCountries.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.value} (+{country.code})
                                                </option>
                                            ))}
                                        </datalist>
                                        {errors.countryCodeCompanyNumber && <p className="text-red-500">Country code is required</p>}
                                    </div> */}
                        <div className="relative h-11 w-full min-w-[200px]">
                            <input
                                type="tel"
                                {...register('telephoneNumber', {
                                    required: 'Telephone Number is required',
                                })}
                                className="input-Style peer w-full"
                                placeholder="+234 000 000 0000"
                            />
                            <label className="input-style-label">
                                Telephone Number <span className="text-red-500"> *</span>
                            </label>
                            {errors.telephoneNumber && <p className="text-red-500">{errors.telephoneNumber.message}</p>}
                        </div>
                        {/* </div> */}

                        <div className="relative h-11 w-full min-w-[200px]">
                            <input type="email" {...register('companyEmail', { required: 'Company Email is required' })} className=" input-Style peer w-full" placeholder="info@company.com" />
                            <label className="input-style-label">
                                Email Address of Company<span className="text-red-500"> * </span>
                            </label>
                            {errors.companyEmail && <p className="text-red-500">{errors.companyEmail.message}</p>}
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <input
                                type="text"
                                {...register('faxNumber', {
                                    required: 'Fax Number is required',
                                })}
                                className="input-Style peer w-full"
                                placeholder="(123) 456-7890" // Example format
                            />

                            <label className="input-style-label">
                                Fax <span className="text-red-500"> *</span>
                            </label>
                            {errors.faxNumber && <p className="text-red-500">{errors.faxNumber.message}</p>}
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]">
                            <input
                                type="text"
                                {...register('containerTrading', {
                                    required: 'Association/logistics network is required',
                                })}
                                className=" input-Style peer w-full"
                                placeholder="Are you a member of local association / logistics network ?"
                            />
                            <label className="input-style-label">
                                Are you a member of local association / logistics network ? <span className="text-red-500"> *</span>
                            </label>
                            {errors.containerTrading && <p className="text-red-500">{errors.containerTrading.message}</p>}
                        </div>

                        <div className="max-sm:mt-1 relative h-11 w-full min-w-[200px]">
                            <input
                                required
                                type="text"
                                {...register('companyWebsite', { required: 'company website is required' })}
                                className=" input-Style peer w-full"
                                placeholder="Website Address of Company*"
                            />
                            <label className="input-style-label">
                                Website Address of Company <span className="text-red-500"> *</span>
                            </label>
                            {errors.companyWebsite && <p className="text-red-500">{errors.companyWebsite.message}</p>}
                        </div>
                        <div className="relative h-11 w-full min-w-[200px]"></div>

                        <div className=" w-full  min-w-[200px] ">
                            <label className="font-normal text-gray-500">
                                Company Profile <span className="text-red-500"> *</span>
                            </label>
                            <div className=" overflow-y-hidden">
                                <textarea
                                    {...register('companyInfo', {
                                        required: 'Company Profile is required',
                                    })}
                                    className=" w-full border p-2" // Customize height and padding
                                    placeholder="Enter a brief summary of your company, including services, history, and mission."
                                    rows={6} // Adjust the rows as needed to control the initial size
                                />
                            </div>
                            {errors.companyInfo && <p className="text-red-500">{errors.companyInfo.message}</p>}
                        </div>

                        {/* // uploaded files  */}
                        <div className="max-sm:flex-wrap flex  justify-center gap-4 space-x-4">
                            {/* Business Certificate */}
                            <div className="flex flex-col items-center">
                                <input
                                    type="file"
                                    {...register('businessCertificate')}
                                    ref={fileInputRefs.businessCertificate}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileChange(e, 'businessCertificate')}
                                />
                                <div
                                    className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${selectedFiles.businessCertificate ? 'bg-red-500' : 'bg-gray-300'}`}
                                    onClick={() => handleClick('businessCertificate')}
                                >
                                    {selectedFiles.businessCertificate ? (
                                        <span className={`text-xs ${selectedFiles.businessCertificate ? 'text-black' : 'text-red-500'}`}>
                                            {truncateFileName(selectedFiles.businessCertificate.name)}
                                        </span>
                                    ) : applicationPerson?.businessCertificate ? (
                                        <IoDocumentText className="h-7 w-7 text-red-600" /> /*   <img  className="h-fit w-fit rounded-lg"  src={`${urlImageDownload}${applicationPerson?.businessCertificate}`}  alt="business certificate"  width={50} height={50}
                                        /> */
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
                                <div className="btn btn-blue btn-lg-d mt-2" onClick={() => handleClick('businessCertificate')}>
                                    {applicationPerson?.businessCertificate ? 'Replace File' : 'Upload '}
                                </div>
                            </div>

                            {/* Owner ID */}
                            <div className="flex flex-col items-center">
                                <input type="file" {...register('ownerId')} ref={fileInputRefs.ownerId} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'ownerId')} />
                                <div
                                    className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${selectedFiles.ownerId ? 'bg-red-500' : 'bg-gray-300'}`}
                                    onClick={() => handleClick('ownerId')}
                                >
                                    {selectedFiles.ownerId ? (
                                        <span className={`text-xs ${selectedFiles.ownerId ? 'text-black' : 'text-red-500'}`}>{truncateFileName(selectedFiles.ownerId.name)}</span>
                                    ) : applicationPerson?.ownerId ? (
                                        <IoDocumentText className="h-7 w-7 text-red-600" /> //   <img className="h-fit w-fit rounded-lg" src={`${urlImageDownload}${applicationPerson?.ownerId}`} alt="owner id" width={50} height={50} />
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
                                <div className="btn btn-blue btn-lg-d mt-2" onClick={() => handleClick('ownerId')}>
                                    {applicationPerson?.ownerId ? 'Replace File' : 'Upload '}
                                </div>
                            </div>

                            {/* Company Logo */}
                            <div className="flex flex-col items-center">
                                <input type="file" {...register('companyLogo')} ref={fileInputRefs.companyLogo} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'companyLogo')} />
                                <div
                                    className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${selectedFiles.companyLogo ? 'bg-red-500' : 'bg-gray-300'}`}
                                    onClick={() => handleClick('companyLogo')}
                                >
                                    {selectedFiles.companyLogo ? (
                                        <span className={`text-xs ${selectedFiles.companyLogo ? 'text-black' : 'text-red-500'}`}>{truncateFileName(selectedFiles.companyLogo.name)}</span>
                                    ) : applicationPerson?.companyLogo ? (
                                        <img className="h-fit w-fit rounded-lg" src={`${urlImageDownload}${applicationPerson?.companyLogo}`} alt="company logo" width={50} height={50} />
                                    ) : (
                                        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
                                        </svg>
                                    )}
                                </div>
                                <span className="px-3 text-center text-sm text-gray-600">
                                    Company Logo<span className="text-red-500"> * </span> <br />
                                    <span className="text-xm text-gray-500">Please upload this logo in 1:1 ratio</span>
                                </span>
                                <span className="text-center">{errorsFiles.companyLogo && <p className="text-red-500">{errorsFiles.companyLogo}</p>}</span>
                                <div className="btn btn-blue btn-lg-d mt-2" onClick={() => handleClick('companyLogo')}>
                                    {applicationPerson?.companyLogo ? 'Replace Logo' : 'Upload '}
                                </div>
                            </div>
                        </div>
                    </div>
                    <h5 className="text-center font-semibold text-gray-700">Please ensure that each Reference is from a different overseas country.</h5>
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                        <span className="space-y-6">
                            {' '}
                            <h2 className="mb-6 text-2xl font-bold">Reference 1</h2>{' '}
                            <div className="relative h-11 w-full min-w-[200px]">
                                <input type="text" {...register('companyNameRef1')} className=" input-Style peer w-full" placeholder="company Name" />
                                <label className="input-style-label">Company Name</label>
                            </div>{' '}
                            <div className="relative h-11 w-full min-w-[200px]">
                                <input type="email" {...register('emailRef1')} className=" input-Style peer w-full" placeholder="Email" />
                                <label className="input-style-label">Email</label>
                            </div>{' '}
                            <div  className='flex gap-2'>
                                <div className="relative h-11  w-fit">
                                                    <input
                                                        type="text"
                                                        className="input-Style peer w-full"
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
                                                    <label  className="input-style-label">Country code <span className="text-red-500"> *</span></label>

                                                    {/* Datalist for country codes */}
                                                    <datalist id="countryCodes">
                                                        {listOfCountries.map((country) => (
                                                                <option key={country.code} value={country.code}>
                                                                    {country.value} (+{country.code})
                                                                </option>
                                                            ))}
                                                    </datalist>
                                                    {errors.countryCodeRef1 && <p className="text-red-500">Country code is required</p>}
                                                </div>
                            <div className="relative h-11 w-full min-w-[200px]">
                                <input type="tel" {...register('numberRef1')} className=" input-Style peer w-full" placeholder="Number" />
                                <label className="input-style-label">Number</label>
                            </div>
                            </div>{' '}
                            <div className="relative h-11 w-full min-w-[200px]">
                                <input type="text" {...register('contactPersonRef1')} className=" input-Style peer w-full" placeholder="Contact Person" />
                                <label className="input-style-label">Contact Person</label>
                            </div>{' '}
                            <div className="relative h-11 w-full min-w-[200px]">
                                <input type="text" {...register('designationRef1')} className=" input-Style peer w-full" placeholder="Designation" />
                                <label className="input-style-label">Designation</label>
                            </div>
                        </span>
                        <span className="space-y-6">
                            <h2 className="mb-6 text-2xl font-bold">Reference 2</h2>

                            <div className="relative h-11 w-full min-w-[200px]">
                                <input type="text" {...register('companyNameRef2')} className=" input-Style peer w-full" placeholder="company Name" />
                                <label className="input-style-label">Company Name</label>
                            </div>

                            <div className="relative h-11 w-full min-w-[200px]">
                                <input type="email" {...register('emailRef2')} className=" input-Style peer w-full" placeholder="Email" />
                                <label className="input-style-label">Email</label>
                            </div>
                            <div  className='flex gap-2'>
                                <div className="relative h-11  w-fit">
                                                    <input
                                                        type="text"
                                                        className="input-Style peer w-full"
                                                        id="floatingInput"
                                                        placeholder="Country Code"
                                                        maxLength={4}
                                                        name="countryCode"
                                                        {...register('countryCodeRef2', {
                                                            required: true,
                                                            maxLength: 4,
                                                        })}
                                                        list="countryCodes" // Connect to the datalist
                                                    />
                                                    <label  className="input-style-label">Country code <span className="text-red-500"> *</span></label>

                                                    {/* Datalist for country codes */}
                                                    <datalist id="countryCodes">
                                                        {listOfCountries.map((country) => (
                                                                <option key={country.code} value={country.code}>
                                                                    {country.value} (+{country.code})
                                                                </option>
                                                            ))}
                                                    </datalist>
                                                    {errors.countryCodeRef2 && <p className="text-red-500">Country code is required</p>}
                                                </div>
                            <div className="relative h-11 w-full min-w-[200px]">
                                <input type="tel" {...register('numberRef2')} className=" input-Style peer w-full" placeholder="Number" />
                                <label className="input-style-label">Number</label>
                            </div>
                            </div>

                            <div className="relative h-11 w-full min-w-[200px]">
                                <input type="text" {...register('contactPersonRef2')} className=" input-Style peer w-full" placeholder="Contact Person" />
                                <label className="input-style-label">Contact Person</label>
                            </div>

                            <div className="relative h-11 w-full min-w-[200px]">
                                <input type="text" {...register('designationRef2')} className=" input-Style peer w-full" placeholder="Designation" />
                                <label className="input-style-label">Designation</label>
                            </div>
                        </span>
                    </div>

                    <div className="mt-28 flex justify-end">
                        {/* Disable the button if no changes were made */}
                        <button
                            type="submit"
                            className={`red max-md:py-2 w-1/2 rounded-md px-4 py-3 text-white hover:bg-red-700 ${!isFormChanged ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={!isFormChanged} // Disable the button if no changes were detected
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </>
    );
};

export default EditMemebrApplication;
