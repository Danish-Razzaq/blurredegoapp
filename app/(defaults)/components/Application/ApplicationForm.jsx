'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiCaller, apiCallerImgUpload } from '@/utils/api';
import { ErrorNotification } from '@/components/Toster/success';
import { useDispatch } from 'react-redux';
import { setApplicationData } from '@/store/applicationSlice';
import { getUser, fileToBase64, base64ToFile } from '@/utils/helperFunctions';
import TermsAndPoliciesPopup from '@/components/PolicyPopup';
import AgreementPopUp from '@/components/AgreementPopUp';
import { BsBuildings } from 'react-icons/bs';
import ContactPersonSection from '@/components/contactPerson';
import { usePathname } from 'next/navigation';
import { IoDocumentText } from 'react-icons/io5';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { setMembershipTypeData } from '@/store/membershipTypeSlice';

const ApplicationForm = ({ setApplicationSubmitted, setShowSuccessNotification }) => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const shouldShowImageOnApp = pathname.match('/member');
    const [page, setPage] = useState(1);
    const [isChecked, setIsChecked] = useState(false);
    const [isPolicyOpen, setIsPolicyOpen] = useState(false);
    const [agreement, setAgreement] = useState(false);
    const [sections, setSections] = useState([2]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [listOfCountries, setListOfCountries] = useState([]);
    const membershipTypeRedux = useSelector((state) => state.membershipType);


    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fileInputRefs = {
        businessCertificate: useRef(null),
        ownerId: useRef(null),
        companyLogo: useRef(null),
    };
    const [selectedFiles, setSelectedFiles] = useState({
        companyLogo: null,
    });

    // console.log('selectedFiles', selectedFiles);
    // get login user data
    const user = getUser();

    const handlePolicyClick = () => {
        setIsPolicyOpen(true);
    };
    const handleAgreementClick = () => {
        setAgreement(true);
    };

    // Function to handle clicks outside the popup
    const handleClickOutside = (event) => {
        const popupElement = document.getElementById('popup-body');
        if (popupElement && !popupElement.contains(event.target)) {
            setIsPolicyOpen(false);
            setAgreement(false);
        }
    };

    useEffect(() => {
        if (isPolicyOpen || agreement) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPolicyOpen || agreement]);

    const handleCheckboxChangePolices = (e) => {
        setIsChecked(e.target.checked);
    };

    // Form  felids
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        trigger,
        watch,
        setValue,
        getValues,
    } = useForm({
        defaultValues: {
            // membershipType: '', 
            companyLogo: '',
            businessCertificate: '',
            ownerId: '',
            contactPerson1Picture: '',
            contactPerson2Picture: '',
            contactPerson3Picture: '',
            contactPerson4Picture: '',
            contactPerson5Picture: '',
        },
    });

    const formData = watch();

    const fileFields = ['companyLogo', 'businessCertificate', 'ownerId', 'contactPerson1Picture', 'contactPerson2Picture', 'contactPerson3Picture', 'contactPerson4Picture', 'contactPerson5Picture'];
    // Save form data and files to localStorage
    const handleSaveDraft = async () => {
        const formDataWithFiles = { ...formData };

        // Convert files to base64 if they exist
        for (const key in selectedFiles) {
            const file = selectedFiles[key];
            if (file instanceof File) {
                formDataWithFiles[key] = await fileToBase64(file);
            } else {
                formDataWithFiles[key] = file;
            }
        }

        // Save to localStorage
        try {
            localStorage.setItem('applicationDraft', JSON.stringify(formDataWithFiles));
            // SuccessNotification("Draft saved successfully!");
        } catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                ErrorNotification('File size is too large. Please upload smaller files.');
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    };

    useEffect(() => {
        if (membershipTypeRedux.membershipTypeData.length > 0) {
            setValue('membershipType', membershipTypeRedux.membershipTypeData[0]);
        }
    }, [membershipTypeRedux.membershipTypeData]);

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('applicationDraft'));
        // console.log('savedData', savedData); // Debugging
        if (savedData) {
            // Set form fields
            Object.keys(savedData).forEach((key) => {
                setValue(key, savedData[key]);
            });

            const loadedFiles = {};

            fileFields.forEach((field) => {
                if (savedData[field]) {
                    loadedFiles[field] = savedData[field];
                }
            });

            // console.log('loadedFiles after setting', loadedFiles);
            setSelectedFiles((prevFiles) => ({ ...prevFiles, ...loadedFiles }));
        }
    }, [setValue]);

    useEffect(() => {
        handleSaveDraft();
    }, [selectedFiles, formData]);

    // Function to handle file changes
    const handleFileChange = async (event, fieldName) => {
        const file = event.target.files[0];
        if (file) {
            const base64File = await fileToBase64(file);
            setSelectedFiles((prevFiles) => ({
                ...prevFiles,
                [fieldName]: base64File,
            }));
        }
    };

    const sameAsMainAddress = watch('sameAsMainAddress');

    const handleCheckboxChange = () => {
        if (sameAsMainAddress) {
            const mainOfficeAddress = getValues('mainOfficeAddress');
            setValue('correspondenceAddress', mainOfficeAddress);
        } else {
            setValue('correspondenceAddress', '');
        }
    };

    useEffect(() => {
        handleCheckboxChange();
    }, [sameAsMainAddress]);

    const handleClick = (fieldName) => {
        fileInputRefs[fieldName].current.click();
    };

    // Function to upload a file
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

    //for files upload validation
    const [errorsFiles, setErrors] = useState({});

    const nextPage = async () => {
        // Define allowed image types
        const allowedImageTypes = ['image/jpeg', 'image/png'];
        const getBase64FileType = (base64String) => {
            // Extract the MIME type from the base64 string
            const match = base64String?.match(/^data:(image\/[a-zA-Z]+);base64,/);
            return match ? match[1] : null;
        };

        // Example usage

        // Check if there are any errors with the companyLogo file only
        let hasError = [];
        const companyLogoFile = selectedFiles.companyLogo;
        const RawFileType = getBase64FileType(companyLogoFile);
        if (!companyLogoFile) {
            hasError.push({ companyLogo: 'Image is required.' });
        } else if (!allowedImageTypes.includes(companyLogoFile.type || RawFileType)) {
            hasError.push({ companyLogo: 'Only JPEG and PNG image files are allowed.' });
        }

        // Proceed to the next page if there are no errors
        const resultNext = await trigger();
        if (resultNext) {
            if (hasError.length > 0) {
                // Merge all errors into a single object
                const errorMessages = hasError.reduce((acc, error) => ({ ...acc, ...error }), {});
                setErrors(errorMessages);
                return;
            }

            setPage(page + 1);
        }
    };

    const prevPage = () => {
        setPage(page - 1);
    };

    // add more contact person

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

    const onSubmit = async (data) => {
        setIsSubmitted(true);
        try {
            // Filter out optional fields if they are empty or null
            const optionalFields = ['email3', 'email4', 'email5'];
            const filteredFormData = Object.keys(data).reduce((acc, key) => {
                if (!optionalFields.includes(key) || data[key]) {
                    acc[key] = data[key]; // Only include non-empty optional fields
                }
                return acc;
            }, {});

            // Upload files
            const fileUploadPromises = Object.keys(selectedFiles).map(async (fieldName) => {
                if (selectedFiles[fieldName]) {
                    try {
                        // Convert Base64 string to File object before uploading
                        const fileObject = base64ToFile(selectedFiles[fieldName], `${fieldName}`);
                        return await uploadFile(fileObject, fieldName);
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

            // Map file results to filtered form data
            fileUploadResults.forEach((fileInfo, index) => {
                if (fileInfo) {
                    const fieldName = Object.keys(selectedFiles)[index];
                    filteredFormData[fieldName] = fileInfo.url || fileInfo.id;
                }
            });

            ['contactPerson1Picture', 'contactPerson2Picture', 'contactPerson3Picture', 'contactPerson4Picture'].forEach((field) => {
                if (filteredFormData[field] instanceof FileList && filteredFormData[field].length === 0) {
                    filteredFormData[field] = ''; // Set to empty string if the FileList is empty
                }
            });

            // Add additional fields to the form data
            const formData = {
                ...filteredFormData,
                username: user?.name,
                email: user?.email,
                country: user?.country,
            };

            // Submit form data
            // const response = await apiCaller('post', 'applications', {
            //     data: formData,
            // });

            try {
                const response = await axios.post(
                    `${apiUrl}/applications`,
                    { data: formData },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${user?.jwt}`, // JWT as Bearer token
                        },
                    }
                );

                if (response.status === 200) {
                    // Success: show notification, update state, and clear form data from localStorage
                    setShowSuccessNotification(true);
                    setApplicationSubmitted(true);
                    dispatch(setApplicationData(response.data));
                    setSelectedFiles({}); // Clear selected files bcz localStorage remove func is not working for this files
                    reset();
                    localStorage.removeItem('applicationDraft');
                    console.log('Application submitted successfully:', response.data);
                } else {
                    // Unexpected status code: log response for debugging
                    console.warn('Unexpected response status:', response);
                    ErrorNotification('Unexpected response from the server');
                }
            } catch (error) {
                //  error handling
                if (error.response) {
                    console.error('Server error:', error.response.data);
                    if (error.response.status === 400) {
                        ErrorNotification('Application submission failed: validation error');
                    } else if (error.response.status === 413) {
                        ErrorNotification('File size too large for upload');
                    } else {
                        ErrorNotification('Application submission failed: server error');
                    }
                } else if (error.request) {
                    console.error('No response received:', error.request);
                    ErrorNotification('No response from server. Please try again later.');
                } else {
                    console.error('Error setting up request:', error.message);
                    ErrorNotification('Failed to submit application. Please try again.');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            ErrorNotification('Application submission failed');
        }
    };

    return (
        <>
            <div id="startFormFillingId" className=" container  mt-5   rounded ">
                <div className="flex flex-col justify-center gap-4 text-center">
                    <h3>Types of Membership</h3>
                    <span className="flex items-center justify-center gap-2 ">
                        <p className="text-nowrap font-bold">Membership to Enroll</p>
                        <select className="red form-select w-[205px] border p-2 text-white" {...register('membershipType', { required: 'Membership Type is required' })}
                         onChange={(e) => dispatch(setMembershipTypeData(e.target.value))} >
                        
                        
                            <option value="">Select Membership Type</option>
                            <option value="Founding">Founding</option>
                            {/* <option value="Silver">Silver</option> */}
                            <option value="Platinum">Platinum</option>
                            <option value="Gold">Gold</option>
                        </select>

                        {/* Show error message */}
                    </span>
                    {errors.membershipType && <p className="text-sm text-red-500">{errors.membershipType.message}</p>}
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-[60px] space-y-6  sm:p-20   sm:shadow-lg  max-lg:p-5 ">
                    {page === 1 && (
                        <>
                            {/*  Company details input fields */}
                            <h3 className="mb-6 text-2xl font-bold">Details of Applicant Company</h3>
                            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
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
                                    <input
                                        type="date"
                                        {...register('companyEstablish', { required: 'Company Establish is required' })}
                                        className="input-Style peer w-full"
                                        placeholder="Company Establish"
                                    />
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
                                    <input
                                        type="text"
                                        {...register('companyName', { required: 'Company Name is required' })}
                                        className="input-Style peer w-full"
                                        placeholder="Name of Applicant Company"
                                    />
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
                                    <input
                                        type="text"
                                        {...register('buildingAddress', { required: 'Building Address is required' })}
                                        className="input-Style peer w-full"
                                        placeholder="Building Address"
                                    />

                                    <label className="input-style-label">
                                        Building Address <span className="text-red-500"> *</span>
                                    </label>
                                    {errors.buildingAddress && <p className="text-red-500">{errors.buildingAddress.message}</p>}
                                </div>

                                <div className="flex gap-2">
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
                                        <label className="input-style-label">
                                            Country code <span className="text-red-500"> *</span>
                                        </label>

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
                                    <span className="flex w-full">
                                        <input type="checkbox" {...register('sameAsMainAddress')} className="mr-2" />
                                        <label className="text-sm text-gray-700">Same as Main Address</label>
                                    </span>

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
                                <div className="flex flex-col ">
                                    {shouldShowImageOnApp && (
                                        <img
                                            className="h-24 w-24 rounded-lg object-cover"
                                            src={selectedFiles.contactPerson1Picture ? selectedFiles.contactPerson1Picture : '/assets/images/contactPersonPicture.jpg'}
                                            alt={`Contact Person 1 Picture`}
                                            width={96}
                                            height={96}
                                        />
                                    )}
                                    <span className=" text-sm text-gray-600"> Upload the photograph for Contact Person 1</span>
                                    <input
                                        type="file"
                                        {...register('contactPerson1Picture')}
                                        onChange={(e) => handleFileChange(e, 'contactPerson1Picture')} // Correctly pass fieldName
                                        className="mt-2"
                                        accept="image/png, image/jpeg"
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
                                    onFileChange={handleFileChange}
                                    selectedFiles={selectedFiles}
                                    setSelectedFiles={setSelectedFiles}
                                    handleFileChange={handleFileChange}
                                />
                            ))}
                            {sections.length < 4 && ( // Allow up to 5 sections total (3, 4, 5)
                                <button type="button" onClick={addSection} className="btn btn-blue mt-4 p-2 text-white">
                                    Add More Contact Person
                                </button>
                            )}

                            {/* company Details */}
                            <h3 className=" text-2xl font-bold">Company Contact Details</h3>
                            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
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
                                    <input
                                        type="email"
                                        {...register('companyEmail', {
                                            required: 'Company Email is required',
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                        className=" input-Style peer w-full"
                                        placeholder="info@company.com"
                                    />
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
                                        placeholder="Are you a member of local association/logistics network ?"
                                    />
                                    <label className="input-style-label text-wrap">
                                        Are you a member of local association/logistics network ? <span className="text-red-500"> *</span>
                                    </label>
                                    {errors.containerTrading && <p className="text-red-500">{errors.containerTrading.message}</p>}
                                </div>

                                <div className="max-sm:mt-1 relative h-11 w-full min-w-[200px]">
                                    <input
                                        required
                                        type="url"
                                        {...register('companyWebsite', { required: 'company website is required' })}
                                        className=" input-Style peer w-full"
                                        placeholder="Website Address of Company*"
                                    />
                                    <label className="input-style-label">
                                        Website Address of Company <span className="text-red-500"> *</span>
                                    </label>
                                    {errors.companyWebsite && <p className="text-red-500">{errors.companyWebsite.message}</p>}
                                </div>
                                <div className=" w-full  min-w-[200px] "></div>

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

                                {/* file upload */}

                                <div className="max-sm:flex-wrap flex justify-center space-x-4 sm:gap-4">
                                    <div className="flex flex-col items-center">
                                        <input
                                            type="file"
                                            {...register('businessCertificate')}
                                            ref={fileInputRefs.businessCertificate}
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileChange(e, 'businessCertificate')}
                                        />
                                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-300" onClick={() => handleClick('businessCertificate')}>
                                            {selectedFiles.businessCertificate ? (
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
                                        {/* {errorsFiles.businessCertificate && <p className="text-red-500">{errorsFiles.businessCertificate}</p>} */}
                                        <div className="btn btn-blue btn-lg-d mt-2" onClick={() => handleClick('businessCertificate')}>
                                            Upload
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <input required type="file" {...register('ownerId')} ref={fileInputRefs.ownerId} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'ownerId')} />
                                        <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 `} onClick={() => handleClick('ownerId')}>
                                            {selectedFiles.ownerId ? (
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
                                        {/* {errorsFiles.ownerId && <p className="text-red-500">{errorsFiles.ownerId}</p>} */}
                                        <div className="btn btn-blue btn-lg-d mt-2" onClick={() => handleClick('ownerId')}>
                                            Upload
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <input
                                            type="file"
                                            {...register('companyLogo')}
                                            ref={fileInputRefs.companyLogo}
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileChange(e, 'companyLogo')}
                                            accept="image/png, image/jpeg"
                                        />

                                        <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-center`} onClick={() => handleClick('companyLogo')}>
                                            {selectedFiles.companyLogo ? (
                                                <img src={selectedFiles.companyLogo} alt="Company Logo Preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '100%' }} />
                                            ) : (
                                                <BsBuildings className="h-7 w-7" />
                                            )}
                                        </div>
                                        <span className="px-3 text-center text-sm text-gray-600">
                                            Company Logo<span className="text-red-500"> * </span> <br />
                                            <span className="text-xs text-gray-500">Please upload this logo in 1:1 ratio</span>
                                        </span>
                                        <span className="text-center">{errorsFiles.companyLogo && <p className="text-red-500">{errorsFiles.companyLogo}</p>}</span>
                                        <div className="btn btn-blue btn-lg-d mt-2" onClick={() => handleClick('companyLogo')}>
                                            Upload
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {page === 2 && (
                        <>
                            <h5 className="text-center font-semibold text-gray-700">Please ensure that each Reference is from a different overseas country.</h5>

                            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                                <span className="space-y-6">
                                    <h2 className="mb-6 text-2xl font-bold">Reference 1</h2>
                                    <div className="relative h-11 w-full min-w-[200px]">
                                        <input type="text" {...register('companyNameRef1', { required: 'Company Name is required' })} className=" input-Style peer w-full" placeholder="company Name" />
                                        <label className="input-style-label">
                                            company Name<span className="text-red-500"> *</span>{' '}
                                        </label>
                                        {errors.companyNameRef1 && <p className="text-red-500">{errors.companyNameRef1.message}</p>}
                                    </div>
                                    <div className="relative h-11 w-full min-w-[200px]">
                                        <input type="email" {...register('emailRef1', { required: 'Email is required' })} className=" input-Style peer w-full" placeholder="Email" />
                                        <label className="input-style-label">
                                            Email <span className="text-red-500"> *</span>{' '}
                                        </label>
                                        {errors.emailRef1 && <p className="text-red-500">{errors.emailRef1.message}</p>}
                                    </div>
                                    <div className="flex gap-2">
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
                                            <label className="input-style-label">
                                                Country code <span className="text-red-500"> *</span>
                                            </label>

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
                                            <input type="tel" {...register('numberRef1', { required: 'Number is required' })} className=" input-Style peer w-full" placeholder="Number" />
                                            <label className="input-style-label">
                                                Number <span className="text-red-500"> *</span>{' '}
                                            </label>
                                            {errors.numberRef1 && <p className="text-red-500">{errors.numberRef1.message}</p>}
                                        </div>
                                    </div>
                                    <div className="relative h-11 w-full min-w-[200px]">
                                        <input
                                            type="text"
                                            {...register('contactPersonRef1', { required: 'Person Name is required' })}
                                            className=" input-Style peer w-full"
                                            placeholder="Contact Person"
                                        />
                                        <label className="input-style-label">
                                            Contact Person Name <span className="text-red-500"> *</span>{' '}
                                        </label>
                                        {errors.contactPersonRef1 && <p className="text-red-500">{errors.contactPersonRef1.message}</p>}
                                    </div>
                                    <div className="relative h-11 w-full min-w-[200px]">
                                        <input type="text" {...register('designationRef1', { required: 'Designation is required' })} className=" input-Style peer w-full" placeholder="Designation" />
                                        <label className="input-style-label">
                                            Designation <span className="text-red-500"> *</span>{' '}
                                        </label>
                                        {errors.designationRef1 && <p className="text-red-500">{errors.designationRef1.message}</p>}
                                    </div>
                                </span>
                                <span className="space-y-6">
                                    <h2 className="mb-6 text-2xl font-bold">Reference 2</h2>

                                    <div className="relative h-11 w-full min-w-[200px]">
                                        <input type="text" {...register('companyNameRef2', { required: 'Company Name is required' })} className=" input-Style peer w-full" placeholder="company Name" />
                                        <label className="input-style-label">
                                            company Name<span className="text-red-500"> *</span>{' '}
                                        </label>
                                        {errors.companyNameRef2 && <p className="text-red-500">{errors.companyNameRef2.message}</p>}
                                    </div>
                                    <div className="relative h-11 w-full min-w-[200px]">
                                        <input type="email" {...register('emailRef2', { required: 'Email is required' })} className=" input-Style peer w-full" placeholder="Email" />
                                        <label className="input-style-label">
                                            Email <span className="text-red-500"> *</span>{' '}
                                        </label>
                                        {errors.emailRef2 && <p className="text-red-500">{errors.emailRef2.message}</p>}
                                    </div>
                                    <div className="flex gap-2">
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
                                            <label className="input-style-label">
                                                Country code <span className="text-red-500"> *</span>
                                            </label>

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
                                            <input type="tel" {...register('numberRef2', { required: 'Number is required' })} className=" input-Style peer w-full" placeholder="Number" />
                                            <label className="input-style-label">
                                                Number <span className="text-red-500"> *</span>{' '}
                                            </label>
                                            {errors.numberRef2 && <p className="text-red-500">{errors.numberRef2.message}</p>}
                                        </div>
                                    </div>
                                    <div className="relative h-11 w-full min-w-[200px]">
                                        <input
                                            type="text"
                                            {...register('contactPersonRef2', { required: 'Person Name is required' })}
                                            className=" input-Style peer w-full"
                                            placeholder="Contact Person"
                                        />
                                        <label className="input-style-label">
                                            Contact Person Name <span className="text-red-500"> *</span>{' '}
                                        </label>
                                        {errors.contactPersonRef2 && <p className="text-red-500">{errors.contactPersonRef2.message}</p>}
                                    </div>
                                    <div className="relative h-11 w-full min-w-[200px]">
                                        <input type="text" {...register('designationRef2', { required: 'Designation is required' })} className=" input-Style peer w-full" placeholder="Designation" />
                                        <label className="input-style-label">
                                            Designation <span className="text-red-500"> *</span>{' '}
                                        </label>
                                        {errors.designationRef2 && <p className="text-red-500">{errors.designationRef2.message}</p>}
                                    </div>
                                </span>
                                <div className="flex h-11 w-full flex-col gap-2 sm:flex-row ">
                                    <span>
                                        <input type="checkbox" id="agreeTerms" className="mr-2" checked={isChecked} onChange={handleCheckboxChangePolices} />
                                        <span htmlFor="agreeTerms" onClick={handlePolicyClick} className="mr-2 cursor-pointer text-blue-500 underline">
                                            Agree to Financial Protection Policy
                                        </span>
                                        &
                                    </span>

                                    <span>
                                        <span htmlFor="agreeTerms" onClick={handleAgreementClick} className="cursor-pointer text-blue-500 underline">
                                            Agree to Blurred Ego Membership Agreement
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    <div className=" flex justify-between">
                        {page > 1 && (
                            <button type="button" onClick={prevPage} className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400">
                                Previous
                            </button>
                        )}
                        <div className={`flex w-full  ${page < 2 ? 'justify-end ' : 'max-md:justify-end justify-center'} `}>
                            {page === 1 ? (
                                <button type="button" onClick={nextPage} className="red max-md:py-2 w-1/2 rounded-md px-4 py-3 font-bold text-white hover:bg-red-700">
                                    Next
                                </button>
                            ) : (
                                ''
                            )}
                            {page === 2 ? (
                                <button
                                    type="submit"
                                    className={`max-md:py-2 w-1/2 rounded-md px-4 py-3 text-white ${isChecked ? 'bg-[#30CFCE] hover:bg-red-700' : 'cursor-not-allowed bg-gray-400'}`}
                                    disabled={!isChecked}
                                >
                                    {isSubmitted ? 'Application Submitting...' : 'Submit'}
                                </button>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </form>
                <div className="mt-16 flex  justify-center gap-2">
                    <div className={`h-4 w-4 ${page < 2 ? 'red' : 'bg-gray-400'}  rounded-full`}></div>
                    <div className={`h-4 w-4 ${page > 1 ? 'red' : 'bg-gray-400'} rounded-full`}></div>
                </div>
            </div>

            {/* pop-up of terms and policies */}
            {isPolicyOpen && <TermsAndPoliciesPopup onClose={() => setIsPolicyOpen(false)} />}
            {agreement && <AgreementPopUp onClose={() => setAgreement(false)} />}
        </>
    );
};

export default ApplicationForm;
