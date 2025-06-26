'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiChevronRight, FiChevronLeft, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { getUser } from '@/utils/helperFunctions';
import { ErrorNotification } from '@/components/Toster/success';
import { stepsCreateFormFields, createAttendeeFormSections } from '@/utils/eventRegistrationFieldsData';
import countryMapping from '@/components/countryNamesData';
import { BsArrowBarDown, BsSearch } from 'react-icons/bs';
import PaymentDisplay from '../../../components/PaymentDisplay';
import { fetchSponsorshipFields } from '@/utils/api';
import { BsInfoCircle } from 'react-icons/bs';
import { BiSolidDownArrow } from 'react-icons/bi';
const EventRegistrationForm = ({ event_name_reg, setFormSubmitted, setTrackingID, event }) => {
    // console.log('event in registration form', event);
    const user = getUser();

    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImages, setSelectedImages] = useState({});
    const [isGcaMember, setIsGcaMember] = useState(null);
    const [totalPayment, setTotalPayment] = useState(0); // Default registration fee for the main attendee
    const [previewCompanyLogo, setPreviewCompanyLogo] = useState(null);
    const [previewFormalPhoto, setPreviewFormalPhoto] = useState(null);
    const [previewFormalPhoto2, setPreviewFormalPhoto2] = useState(null);
    const [itsMemberOfGCA, setItsMemberOfGCA] = useState(false);
    const [eventRegistrationFee, setEventRegistrationFee] = useState(0);
    const [sponsorshipFields, setSponsorshipFields] = useState([]);
    const [previousDiscount, setPreviousDiscount] = React.useState(0);
    const [showMemberIdPopUp, setShowMemberIdPopUp] = useState(false);

    //  console.log('sponsorshipFields', sponsorshipFields);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm({
        defaultValues: {
            attendees: [],
            companyName: '',
            position: '',
            companyEmail: '',
            telephone: '',
            mobile: '',
            website: '',
            iataNumber: '',
            city: '',
            country: '',
            address: '',
            companyLogo: '',
            firstName: '',
            lastName: '',
            formalPhoto: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'attendees',
    });
    const memberId = watch('memberId');

    // console.log('itsMemberOfGCA', itsMemberOfGCA);

    const calculateRegistrationFee = () => {
        const memberId = watch('memberId');
        const earlyBirdFeeDate = new Date(event?.attributes?.early_bird_fee_end_date);
        const earlyBirdFeeOfMember = event?.attributes?.member_early_bird_fee;
        const earlyBirdNormalFee = event?.attributes?.early_bird_normal_fee;
        const memberNormalFee = event?.attributes?.member_fee;
        const nonMemberNormalFee = event?.attributes?.non_member_fee;
        const currentDate = new Date();

        let registrationFee;

        if (currentDate <= earlyBirdFeeDate) {
            if (memberId && itsMemberOfGCA && isGcaMember) {
                // Member
                registrationFee = earlyBirdFeeOfMember;
            } else {
                registrationFee = earlyBirdNormalFee;
            }
        } else {
            if (memberId && itsMemberOfGCA) {
                registrationFee = memberNormalFee;
            } else {
                registrationFee = nonMemberNormalFee;
            }
        }
        // console.log('Updated registration fee:', registrationFee);

        setEventRegistrationFee(registrationFee);
    };

    useEffect(() => {
        const getSponsorshipFields = async () => {
            const fields = await fetchSponsorshipFields(event_name_reg);
            setSponsorshipFields(fields);
        };

        getSponsorshipFields();
    }, []);

    useEffect(() => {
        calculateRegistrationFee();
    }, [itsMemberOfGCA]);

    const totalPaymentInUSD = totalPayment + Number(eventRegistrationFee) + (fields.length > 0 ? fields.length * Number(eventRegistrationFee) : 0) || 0; // Calculate total payment in USD

    // console.log('memberId', memberId);
    const getCountryName = (code) => {
        return countryMapping[code?.toUpperCase()] || '';
    };

    const handleCheckboxChange = (value) => {
        setIsGcaMember(value === 'yes');
    };

    const handleSearch = async () => {
        // if (event.key === 'Enter') {
        //     event.preventDefault(); // Prevent default form submission or behavior

        if (memberId) {
            try {
                const response = await axios.get(`${apiUrl}/custom-application-data?populate*=true`);

                // Filter the data by applicationMemberId
                const filteredData = response.data.data.filter((item) => item.applicationMemberId === memberId);

                // console.log('Filtered Data:', filteredData);

                if (response.status === 200 && filteredData?.length > 0) {
                    const matchedMember = filteredData?.[0];

                    // console.log('Matched Member:', matchedMember);
                    setItsMemberOfGCA(true);
                    setShowMemberIdPopUp(false);
                    handleCheckboxChange('yes');

                    const contactPerson1 = matchedMember.contactPerson1 || '';
                    const [firstName1, ...lastNameParts1] = contactPerson1.split(' ');
                    const lastName1 = lastNameParts1.join(' ');

                    const contactPerson2 = matchedMember.contactPerson2 || '';
                    const [firstName2, ...lastNameParts2] = contactPerson2.split(' ');
                    const lastName2 = lastNameParts2.join(' ');

                    setPreviewCompanyLogo(matchedMember.companyLogo);
                    setPreviewFormalPhoto(matchedMember?.contactPerson1Picture);
                    setPreviewFormalPhoto2(matchedMember.contactPerson2Picture);
                    setValue('companyName', matchedMember.companyName);
                    setValue('website', matchedMember.companyWebsite);
                    setValue('companyLogo', matchedMember.companyLogo);
                    setValue('mobile', matchedMember.mobile1);
                    setValue('address', matchedMember.mainOfficeAddress);
                    setValue('country', getCountryName(matchedMember.country));
                    setValue('city', matchedMember.city);
                    setValue('companyEmail', matchedMember.companyEmail);
                    setValue('position', matchedMember.designation1);
                    setValue('telephone', matchedMember.mobile1);
                    setValue('firstName', firstName1);
                    setValue('lastName', lastName1 || '');
                    setValue('formalPhoto', matchedMember.contactPerson1Picture ? matchedMember.contactPerson1Picture : '');
                    setValue('personalEmail', matchedMember.email1);

                    if (fields.length === 0 && firstName2) {
                        append({});
                    }

                    setValue('attendees.0.attendees.0.firstName', firstName2);
                    setValue('attendees.0.attendees.0.lastName', lastName2 || '');
                    setValue('attendees.0.attendees.0.formalPhoto', matchedMember.contactPerson2Picture ? matchedMember.contactPerson2Picture : '');
                    setValue('attendees.0.attendees.0.personalEmail', matchedMember.email2);
                } else {
                    ErrorNotification('Invalid Member ID. Please try again with a valid Member ID.');
                }
            } catch (error) {
                console.error('Error fetching member data:', error);
            }
        }
        //     }
    };

    const handleCheckboxNotMember = (value) => {
        if (value === 'no') {
            setIsGcaMember(false);
            setItsMemberOfGCA(false);
            calculateRegistrationFee();
        }
    };

    // Handle file input change
    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];

        if (!file) return;

        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!validImageTypes.includes(file.type)) {
            ErrorNotification('Only image files are allowed');
            // not set the file if it's not an image
            return setSelectedImages((prev) => ({ ...prev, [fieldName]: null }));
        }

        const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
        if (file.size > MAX_FILE_SIZE) {
            alert('File size must be less than 2MB.');
            return;
        }

        setSelectedImages((prev) => ({ ...prev, [fieldName]: file }));
        setValue(fieldName, file, { shouldValidate: true });
    };

    const handleCheckboxChangePrice = (e, price) => {
        if (e.target.checked) {
            setTotalPayment((prev) => prev + price); // Add price if checked
        } else {
            setTotalPayment((prev) => prev - price); // Subtract price if unchecked
        }
    };

    useEffect(() => {
        // console.log('I'm running');
        setPreviousDiscount(0);
        setTotalPayment(0);
    }, [fields]);

    // Handle price changes (subtraction or addition)
    const handleDiscountChange = (e, price) => {
        if (e.target.checked) {
            setTotalPayment((prev) => prev - price);
            setPreviousDiscount(price);
        } else {
            setTotalPayment((prev) => prev + previousDiscount);
            setPreviousDiscount((prev) => prev + previousDiscount);
        }
    };

    // Function to upload a file
    const uploadFile = async (file, fieldName) => {
        const formData = new FormData();
        formData.append('files', file);

        try {
            const response = await axios.post(`${apiUrl}/upload`, formData);
            // console.log(`File uploaded successfully for ${fieldName}:`, response);
            // console.log('File uploaded successfully:', response);

            // Extract file information
            const fileInfo = response?.data?.[0]; // Assuming the response is an array with file objects
            return fileInfo; // Return file info (e.g., URL or ID)
        } catch (error) {
            console.error(`Error uploading file for ${fieldName}:`, error);
            ErrorNotification('File upload failed');
            throw new Error('File upload failed');
        }
    };

    // onSubmit function to handle form submission and file uploads
    const onSubmit = async (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // Flatten attendees and prepare for file uploads
            const formattedAttendees = data?.attendees?.flatMap((attendeeGroup, groupIndex) => {
                return attendeeGroup?.attendees?.map((attendee, attendeeIndex) => {
                    const { firstName, lastName, formalPhoto, glutenFree, halal, kosher, lactoseIntolerant, vegan, vegetarian, shirtSize, title, registerSpouse, shareRoom, personalEmail } = attendee;
                    const uploadedFile = selectedImages[`attendees.${groupIndex}.${attendeeIndex}.formalPhoto`];
                    return {
                        title,
                        firstName,
                        lastName,
                        personalEmail,
                        formalPhoto: uploadedFile ? uploadedFile.name : typeof formalPhoto === 'string' ? formalPhoto : formalPhoto.name,
                        glutenFree,
                        halal,
                        kosher,
                        lactoseIntolerant,
                        vegan,
                        vegetarian,
                        shirtSize,
                        registerSpouse,
                        shareRoom,
                    };
                });
            });

            const generateEventTrackingId = () => {
                const timestamp = Date.now();
                const randomPart = Math.floor(1000 + Math.random() * 9000);
                const eventId = `GCA-EVT-${timestamp}-${randomPart}`;
                return eventId;
            };

            const registrationData = {
                Registration_Data: {
                    ...data,
                    attendees: formattedAttendees,
                    eventRegistrationFee: Number(eventRegistrationFee) || 0, // test one time before deploy
                    invoiceAmount: Number(totalPaymentInUSD),
                },
                event_taking_id: generateEventTrackingId(),
                RegEventName: event_name_reg,
                registered_Email: user?.email && user.email !== "sohrab.khan@cglhkg.com" ? user.email : data?.personalEmail  // test one time before deploy

            };

            // console.log('registrationData', registrationData);

            // Handle file uploads
            const fileUploadPromises = Object.keys(selectedImages).map(async (fieldName) => {
                if (selectedImages[fieldName]) {
                    try {
                        const fileInfo = await uploadFile(selectedImages[fieldName], fieldName);

                        const match = fieldName.match(/attendees\.(\d+)\.formalPhoto/);
                        if (match) {
                            const attendeeIndex = parseInt(match[1], 10);
                            registrationData.Registration_Data.attendees[attendeeIndex].formalPhoto = fileInfo.url || fileInfo.id;
                        } else {
                            registrationData.Registration_Data[fieldName] = fileInfo.url || fileInfo.id;
                        }
                    } catch (error) {
                        console.error(`File upload failed for ${fieldName}:`, error);
                        ErrorNotification('File upload failed');
                        throw new Error(`File upload failed for ${fieldName}`);
                    }
                }
            });

            // Wait for all file uploads to finish
            await Promise.all(fileUploadPromises);

            // Submit the form data
            // console.log('Submitting Registration Data:', registrationData);

            // Uncomment and adjust API call as needed
            const response = await axios.post(`${apiUrl}/event-participants`, { data: registrationData });

            if (response.status === 200) {
                // console.log('Form submitted successfully:', response);
                setFormSubmitted(true);
                // localStorage.setItem('trackingId', registrationData.event_taking_id);
                setTrackingID(registrationData?.event_taking_id);
                reset();
                setCurrentStep(0);
            } else {
                console.log('Error submitting the form:', response);
                ErrorNotification('Error submitting the form');
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const InputField = ({ field }) => {
        switch (field.type) {
            case 'select':
                return (
                    <div className="mb-4">
                        <label className="block  text-sm font-medium text-gray-700">
                            {field.label}
                            {field?.validation?.required ? <div className="inline-block text-red-600">*</div> : ''}
                        </label>
                        <select
                            {...register(field.name, field.validation)}
                            className="form-select mt-1 w-full rounded-full  border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Select {field.label}</option>
                            {field.options.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors[field.name] && <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>}
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="mb-4">
                        {/* <label className="block text-sm font-medium text-gray-700">{field.label}</label> */}
                        <div className="mt-2 flex w-full flex-wrap">
                            <input type="checkbox" {...register(field.name, field.validation)} className="mr-2 mt-1" />

                            {/* To bold only the part of the text that starts with (USD in your checkbox data, */}
                            <label className="block text-sm font-medium text-gray-700">
                                {field.label.split(/(\(USD[^\)]+\))/).map((part, index) => (part.startsWith('(USD') ? <strong key={index}>{part}</strong> : part))}
                                {field?.validation?.required ? <div className="inline-block text-red-600">*</div> : ''}
                            </label>
                        </div>
                    </div>
                );

            case 'textarea':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        <textarea
                            {...register(field.name, field.validation)}
                            className="mt-1 w-full rounded-xl  border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            rows={5}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                        {errors[field.name] && <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>}
                    </div>
                );

            case 'file':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field?.validation?.required && <div className="inline-block text-red-600">*</div>}
                        </label>
                        <input
                            type="file"
                            // {...register(field.name, field.validation)}
                            {...register(field.name)}
                            className="styleEventFields"
                            onChange={(e) => handleFileChange(e, field.name)}
                            accept="image/*"
                        />

                        <span className="flex gap-1">
                            {previewCompanyLogo && field?.name === 'companyLogo' && (
                                <div className="mt-2">
                                    <img src={imgUrl + previewCompanyLogo} alt="Selected" className="h-32 w-32 object-cover" />
                                    <p className="mt-2 text-center text-sm">Company Logo</p>
                                </div>
                            )}
                            {previewFormalPhoto && field?.name === 'formalPhoto' && (
                                <div className="mt-2">
                                    <img src={imgUrl + previewFormalPhoto} alt="Selected" className="h-32 w-32 object-cover" />
                                    <p className="mt-2 text-center text-sm">Formal Photo</p>
                                </div>
                            )}

                            {selectedImages[field.name] && (
                                <div className="mt-2">
                                    <img src={URL.createObjectURL(selectedImages[field.name])} alt="Selected" className="h-32 w-32 object-cover" />
                                    <p className="mt-2 text-center text-sm">{selectedImages[field.name].name}</p>
                                </div>
                            )}

                            {errors[field.name] && <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>}
                        </span>
                    </div>
                );

            default:
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field?.validation?.required ? <div className="inline-block text-red-600">*</div> : ''}{' '}
                        </label>
                        <input type={field.type} {...register(field.name, field.validation)} className="styleEventFields" placeholder={`Enter ${field.label.toLowerCase()}`} />
                        {errors[field.name] && <p className="mt-1 text-sm text-red-600">{errors[field.name].message || 'This field is required'}</p>}
                    </div>
                );
        }
    };

    const InputFieldPrice = ({ field, handleChange }) => {
        const validPaymentStatuses = field?.reservedBy ? Object?.values(field?.reservedBy).filter((entry) => entry.paymentStatus === 'paid' || entry.paymentStatus === 'pending').length : null;

        switch (field.type) {
            case 'checkbox':
                return (
                    <div className="mb-4">
                        <div className="mt-2 flex w-full flex-wrap">
                            <input
                                type="checkbox"
                                {...register(field.name, field.validation)}
                                className="mr-2 mt-1"
                                disabled={
                                    (field.status === 'paid' && field.paidCount >= field.maxLimit) ||
                                    (field.maxLimit === 1 && (field.status === 'paid' || field.status === 'reserved')) ||
                                    validPaymentStatuses >= field.maxLimit
                                }
                                onChange={(e) => {
                                    handleChange(e, field.price); // Handle the price change
                                    setValue(field.name, e.target.checked, field.price); // Update the react-hook-form state
                                }}
                            />
                            <label className={`block text-sm font-medium text-gray-700 ${field.status === 'paid' && field.paidCount >= field.maxLimit ? 'cursor-not-allowed line-through' : ''}`}>
                                {field.label.split(/(\(USD[^\)]+\))/).map((part, index) => (part.startsWith('(USD') ? <strong key={index}>{part}</strong> : part))}
                            </label>
                            {/* {console.log('reservedBy', field?.reservedBy)} */}

                            {/* {console.log("Count of valid payment statuses (paid/pending):", validPaymentStatuses)} */}

                            {(field.status === 'reserved' || (field.status === 'paid' && field.paidCount < field.maxLimit)) && (
                                <span className="ml-2 inline-flex cursor-pointer items-center font-bold text-red-600">
                                    <span>(Multiple Companies Interested)</span>
                                    <div className="group relative">
                                        <BsInfoCircle className="ml-1 h-4 w-4 text-blue-600" />
                                        {/* Custom styled tooltip */}
                                        <div className="absolute bottom-full left-1/2 z-50 mb-2 hidden w-64 -translate-x-1/2 group-hover:block">
                                            <div className="rounded-md bg-gray-800 p-2 text-sm text-white shadow-lg">
                                                <p>
                                                    Multiple companies are competing for this sponsorship opportunity. So we not sure about the availability of this sponsorship for you at the moment.
                                                </p>
                                                {/* Arrow */}
                                                <div className="absolute left-1/2 top-full -mt-2 -translate-x-1/2 border-4 border-transparent border-t-gray-800">
                                                    <BiSolidDownArrow className="text-gray-800" size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            )}

                            {field.status === 'paid' && field.paidCount >= field.maxLimit && (
                                <span className="ml-2 inline-flex cursor-pointer font-bold text-red-600">
                                    <span>(Reserved)</span>
                                    <div className="group relative">
                                        <BsInfoCircle className="ml-1 h-4 w-4 text-blue-600" />
                                        <div className="absolute bottom-full left-1/2 z-50 mb-2 hidden w-64 -translate-x-1/2 group-hover:block">
                                            <div className="rounded-md bg-gray-800 p-2 text-sm text-white shadow-lg">
                                                <p>This sponsorship is reserved by another company. Please select another sponsorship opportunity.</p>
                                                <div className="absolute left-1/2 top-full -mt-2 -translate-x-1/2 border-4 border-transparent border-t-gray-800">
                                                    <BiSolidDownArrow className="text-gray-800" size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const InputFieldAttendee = ({ field, attendeeIndex, register, errors }) => {
        const fieldName = `attendees.${attendeeIndex}.${field.name}`;
        // console.log('fieldName', fieldName);

        const regex = /attendees\.(\d+)\.(\w+)/;
        const matches = field.name.match(regex);

        const index = matches?.[1];
        const fieldNamePart = matches?.[2];

        if (index && fieldNamePart) {
            const fieldError = errors?.attendees?.[index]?.attendees?.[index]?.[fieldNamePart];

            return (
                <div className="mb-4">
                    {field.type === 'file' && (
                        <>
                            <label className="block text-sm font-medium text-gray-700">
                                {field.label}
                                {field?.validation?.required && <span className="text-red-600"> *</span>}
                            </label>
                            <input
                                type="file"
                                {...register(fieldName)}
                                // {...register(fieldName, field.validation)}
                                onChange={(e) => handleFileChange(e, fieldName)}
                                className="styleEventFields"
                                accept="image/*"
                            />

                            <span className="flex gap-1">
                                {previewFormalPhoto2 && field?.name === 'attendees.0.formalPhoto' && (
                                    <div className="mt-2">
                                        <img src={imgUrl + previewFormalPhoto2} alt="Selected" className="h-32 w-32 object-cover" />
                                        <p className="mt-2 text-center text-sm">Formal Photo</p>
                                    </div>
                                )}

                                {selectedImages[fieldName] && (
                                    <div className="mt-2">
                                        <img src={URL.createObjectURL(selectedImages[fieldName])} alt="Selected" className="h-32 w-32 object-cover" />
                                        <p className="mt-2 text-sm">{selectedImages[fieldName].name}</p>
                                    </div>
                                )}
                            </span>
                        </>
                    )}

                    {field.type === 'select' && (
                        <>
                            <label className="block text-sm font-medium text-gray-700">
                                {field.label}
                                {field?.validation?.required && <span className="text-red-600"> *</span>}
                            </label>
                            <select
                                {...register(fieldName, field.validation)}
                                className="form-select mt-1 w-full rounded-full border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select {field.label}</option>
                                {field.options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    {field.type === 'checkbox' && (
                        <div className={`mt-2 flex w-full flex-wrap ${field.label.includes('(USD') || field.label.includes('25% off') ? 'items-start pt-3 text-lg lg:w-[320px]' : 'text-sm'}`}>
                            {/* {console.log('fieldName', fieldName)} */}
                            <input
                                type="checkbox"
                                {...register(fieldName, field.validation)}
                                className="mr-2 mt-1"
                                onChange={(e) => {
                                    // Handle for 'registerSpouse'
                                    if (fieldName.includes('registerSpouse')) {
                                        handleCheckboxChangePrice(e, 600);
                                        setValue(fieldName, e.target.checked);
                                    }

                                    // Handle for 'shareRoom'
                                    else if (fieldName.includes('shareRoom')) {
                                        const discountAmount = eventRegistrationFee * 0.25;
                                        if (e.target.checked) {
                                            handleDiscountChange(e, discountAmount);
                                        } else {
                                            handleDiscountChange(e, -discountAmount);
                                        }
                                        setValue(fieldName, e.target.checked);
                                    }
                                }}
                            />

                            <label className="block font-medium text-gray-700">
                                {field.label
                                    .split(/(\(USD[^\)]+\)|\d+% off)/g) // Split on (USD...) and 25% off patterns
                                    .map((part, index) => {
                                        // Check if the part contains '(USD' or '25%' pattern and wrap them in <strong>
                                        if (part.includes('(USD') || part.includes('% off')) {
                                            return <strong key={index}>{part}</strong>;
                                        }
                                        return part; // Return the part as is if it's neither
                                    })}
                            </label>
                        </div>
                    )}

                    {field.type === 'text' && (
                        <>
                            <label className="block text-sm font-medium text-gray-700">
                                {field.label}
                                {field?.validation?.required && <span className="text-red-600"> *</span>}
                            </label>
                            <input type={field.type} {...register(fieldName, field.validation)} className="styleEventFields" placeholder={`Enter ${field.label}`} />
                        </>
                    )}
                    {field.type === 'email' && (
                        <>
                            <label className="block text-sm font-medium text-gray-700">
                                {field.label}
                                {field?.validation?.required && <span className="text-red-600"> *</span>}
                            </label>
                            <input type={field.type} {...register(fieldName, field.validation)} className="styleEventFields" placeholder={`Enter ${field.label}`} />
                        </>
                    )}

                    {/* Error Message */}
                    {fieldError && fieldError.message && <p className="mt-1 text-sm text-red-600">{fieldError.message || 'This field is required'}</p>}
                </div>
            );
        }
        return null;
    };

    const removeFirstPersonalInfo = () => {
        // Get all attendee information including the image
        const attendance1FirstName = watch('attendees.0.attendees.0.firstName');
        const attendance1LastName = watch('attendees.0.attendees.0.lastName');
        const attendance1FormalPhoto = watch('attendees.0.attendees.0.formalPhoto');
        const attendance1Title = watch('attendees.0.attendees.0.title');
        const attendance1ShirtSize = watch('attendees.0.attendees.0.shirtSize');
        const attendance1PersonalEmail = watch('attendees.0.attendees.0.personalEmail');

        // Transfer the information to the main form
        setValue('firstName', attendance1FirstName);
        setValue('lastName', attendance1LastName);
        setValue('formalPhoto', attendance1FormalPhoto);
        setValue('title', attendance1Title);
        setValue('shirtSize', attendance1ShirtSize);
        setValue('personalEmail', attendance1PersonalEmail);

        if (attendance1FormalPhoto) {
            setPreviewFormalPhoto(attendance1FormalPhoto);
        }

        previewFormalPhoto2 && setPreviewFormalPhoto2(null);

        // setValue('attendees.0.attendees.0.firstName', watch('attendees.0.attendees.1.firstName'));
        // setValue('attendees.0.attendees.0.lastName', watch('attendees.0.attendees.1.lastName'));
        // setValue('attendees.0.attendees.0.formalPhoto', watch('attendees.0.attendees.1.formalPhoto'));
        setValue('attendees.0.attendees.0.firstName', '');
        setValue('attendees.0.attendees.0.lastName', '');
        setValue('attendees.0.attendees.0.formalPhoto', '');
        setValue('attendees.0.attendees.0.title', '');
        setValue('attendees.0.attendees.0.shirtSize', '');
        setValue('attendees.0.attendees.0.personalEmail', '');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-center text-2xl font-bold">Online Registration</h1>

            {/*  show just in  */}
            <PaymentDisplay totalPaymentInUSD={totalPaymentInUSD} />

            {showMemberIdPopUp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="w-full max-w-xl rounded-lg bg-white p-4 shadow-lg">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Member ID</h2>
                            <button onClick={() => setShowMemberIdPopUp(false)} className="text-red-500 hover:text-red-700">
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="col-span-1 mt-4">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        id="memberId"
                                        type="text"
                                        {...register('memberId', { required: 'Member ID is required' })}
                                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Enter Member ID (e.g., GCA-2025-0001)"
                                    />
                                </div>

                                <button
                                    onClick={handleSearch}
                                    className="text-bold flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700"
                                    type="button"
                                >
                                    <BsSearch className="h-4 w-4" />
                                    <span>Submit</span>
                                </button>
                            </div>

                            {errors.memberId && <p className="mt-1 text-sm text-red-600">{errors.memberId.message}</p>}
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Main content sections */}
                <>
                    {stepsCreateFormFields[currentStep].sections.map((section, sectionIndex) => {
                        // just to pixel perfect the design i use this condition otherwise you can remove this condition and simple show all the fields

                        if (section.title === 'Company  Information') {
                            return (
                                <>
                                    <div key={sectionIndex} className="overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                                        <h2 className="mb-6 text-xl font-semibold">{section.title}</h2>

                                        <div className="flex w-full items-center justify-center gap-2">
                                            <label className="block text-nowrap text-lg font-medium text-gray-700">
                                                GCA Member? <div className="inline-block text-red-600">*</div>
                                            </label>
                                            <div className="mt-2 flex w-full flex-wrap">
                                                <label className="mr-2 block text-sm font-medium text-gray-700">
                                                    <input
                                                        type="checkbox"
                                                        value="yes"
                                                        checked={isGcaMember === true}
                                                        {...register('isGcaMember')}
                                                        onChange={() => {
                                                            // handleCheckboxChange('yes');
                                                            setShowMemberIdPopUp(true);
                                                        }}
                                                        className="mr-1 mt-1"
                                                    />
                                                    Yes
                                                </label>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    <input
                                                        type="checkbox"
                                                        value="no"
                                                        checked={isGcaMember === false}
                                                        {...register('noGcaMember')}
                                                        onChange={() => {
                                                            handleCheckboxNotMember('no'); // Handle checkbox state change
                                                        }}
                                                        className="mr-1 mt-1"
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                        {isGcaMember === null && <p className="mt-1 text-sm text-red-600">Please select if you are a GCA member or not</p>}

                                        {/* Conditional Input Field for Member ID */}
                                        {isGcaMember && (
                                            <>
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                                    <div className="col-span-1">
                                                        <label htmlFor="memberId" className="mb-1 block text-sm font-medium text-gray-700">
                                                            Member ID <span className="text-red-600">*</span>
                                                        </label>

                                                        <div className="flex gap-2">
                                                            <div className="relative flex-1">
                                                                <input
                                                                    // id="memberId"
                                                                    type="text"
                                                                    // {...register('memberId', { required: 'Member ID is required' })}
                                                                    disabled
                                                                    value={memberId}
                                                                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                    placeholder="Enter Member ID (e.g., GCA-2025-0001)"
                                                                />
                                                            </div>

                                                            {/* <button
                                                                onClick={handleSearch}
                                                                className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700"
                                                                type="button"
                                                            >
                                                                <BsSearch className="h-4 w-4" />
                                                                <span>Search</span>
                                                            </button> */}
                                                        </div>

                                                        {/* {errors.memberId && <p className="mt-1 text-sm text-red-600">{errors.memberId.message}</p>} */}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {/* Dynamic Fields Section */}
                                        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                            {section.fields.map((field, fieldIndex) => (
                                                <InputField key={field.name} field={field} />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            );
                        } else if (section.title === 'Personal Details') {
                            return (
                                <div key={sectionIndex} className="overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h2 className="text-xl font-semibold">{section.title}</h2>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                removeFirstPersonalInfo();
                                                remove(0);
                                            }}
                                            className={`text-red-500 hover:text-red-700
                                                     ${fields.length >= 1 ? 'block' : 'hidden'}`}
                                        >
                                            <FiTrash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                                        {section.fields.map((field, fieldIndex) => (
                                            <InputField key={field.name} field={field} />
                                        ))}
                                    </div>
                                    <label className="mr-2 block text-lg font-medium text-gray-700">
                                        <input
                                            type="checkbox"
                                            {...register('registerSpouse')}
                                            onChange={(e) => {
                                                handleCheckboxChangePrice(e, 600); // Handle the price change
                                                setValue('registerSpouse', e.target.checked); // Update the react-hook-form state
                                            }}
                                            className="mr-1 mt-1"
                                        />
                                        Register Spouse (USD 600.00)
                                    </label>
                                </div>
                            );
                        } else if (section.title === 'Add Additional Attendees') {
                            return fields.map((field, attendeeIndex) => {
                                const attendeeSections = createAttendeeFormSections(attendeeIndex);

                                return (
                                    <div key={field.id} className="mb-8">
                                        <h1 className="mb-6 text-start text-3xl font-semibold text-gray-800">
                                            <span className="text-red-600">Attendee</span> {attendeeIndex + 2}
                                        </h1>

                                        {attendeeSections[0].sections.map((section, sectionIndex) => (
                                            <>
                                                <div key={sectionIndex} className="mb-4 overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                                                    <div className="mb-6 flex items-center justify-between">
                                                        <h2 className="text-xl font-semibold">{section.title}</h2>
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(attendeeIndex)}
                                                            className={`text-red-500 hover:text-red-700
                                                     ${section.title === 'Personal Details' ? 'block' : 'hidden'}`}
                                                        >
                                                            <FiTrash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                    <>
                                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                                                            <>
                                                                {section.fields.map((field) => (
                                                                    <InputFieldAttendee key={field.name} field={field} attendeeIndex={attendeeIndex} register={register} errors={errors} />
                                                                ))}
                                                            </>
                                                        </div>
                                                    </>
                                                </div>
                                            </>
                                        ))}
                                    </div>
                                );
                            });
                        } else if (section.title === 'Specialization') {
                            return (
                                <div key={sectionIndex} className="overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                                    <h2 className="mb-6 text-xl font-semibold">{section.title}</h2>

                                    <div className="grid grid-cols-1  md:grid-cols-2">
                                        {section.fields.map((field, fieldIndex) => (
                                            <InputField key={field.name} field={field} />
                                        ))}
                                    </div>
                                </div>
                            );
                        } else if (section.title === 'Vendor only section') {
                            return (
                                <div key={sectionIndex} className="overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                                    <h2 className="color-brand-1 mb-6 max-w-[970px] text-xl font-semibold">{section.note}</h2>
                                    <h3 className="mb-3  text-lg">
                                        What services do you offer? <span className="font-thin"> (Please choose one)</span>
                                    </h3>

                                    <div className="grid max-w-[500px] grid-cols-1 ">
                                        {section.fields.map((field, fieldIndex) => (
                                            <InputField key={field.name} field={field} />
                                        ))}
                                    </div>
                                </div>
                            );
                        } else if (section.title === 'Onsite Branding Sponsorship') {
                            return (
                                <div key={sectionIndex} className="overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                                    <h2 className="mb-6 text-xl font-semibold">{section.title}</h2>
                                    <p className="font-lg  mb-3 max-w-[1070px]">{section.note}</p>

                                    <div className="grid grid-cols-1 ">
                                        {sponsorshipFields?.length > 0 ? (
                                            sponsorshipFields?.map((field, fieldIndex) => <InputFieldPrice key={field.name} field={field} handleChange={handleCheckboxChangePrice} />)
                                        ) : (
                                            <p>No Sponsorship Available</p>
                                        )}
                                    </div>
                                </div>
                            );
                        } else if (section.title === 'How did you learn about us?') {
                            return (
                                <div key={sectionIndex} className="overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                                    <h2 className="mb-6 text-xl font-semibold">{section.title}</h2>

                                    <div className="grid grid-cols-1">
                                        {section.fields.map((field, fieldIndex) => (
                                            <InputField key={field.name} field={field} />
                                        ))}
                                    </div>

                                    <hr className="my-6 border-gray-300" />

                                    <h2 className="mb-6 text-center font-semibold">Total: USD {totalPaymentInUSD.toFixed(2)}</h2>

                                    <div className="mb-4 grid grid-cols-1">
                                        <h3 className="text-lg ">Liability Waiver</h3>
                                        <div className="my-2  flex items-start">
                                            <input type="checkbox" {...register('liabilityWaiver', { required: 'Please agree to the liability waiver' })} className="mr-2" />
                                            <label className="block text-sm font-medium text-gray-700">
                                                I hereby agree that upon registering to the first Geo Cargo Alliance (GCA) Conference 2025, I am taking full responsibility of my actions and I fully
                                                understand that the organizer, The entire Geo Cargo Alliance team will not be held responsible in any event of injury, accident, personal loss and/or
                                                illness during the event.
                                            </label>
                                        </div>
                                        {errors.liabilityWaiver && <p className=" text-sm text-red-600">{errors.liabilityWaiver.message}</p>}

                                        <div>
                                            <h3 className="my-2 text-lg">Terms and Condition</h3>
                                            <span className=" flex items-start">
                                                <input type="checkbox" {...register('termsAndConditionBox1', { required: 'Please agree to the terms and conditions' })} className="mr-2 " />
                                                <label className=" text-sm font-medium text-gray-700">
                                                    This is to confirm that I am not an owner/administrator/board member or adviser to other freight forwarding networks/alliances, profit or non-profit
                                                    oriented. I agree that if any form of link is established that my membership can be cancelled without refund and agree that GCA may terminate my
                                                    attendance/members and inform all members/attendees of my termination including other network owners, associations and alliances.
                                                </label>
                                            </span>
                                            {errors.termsAndConditionBox1 && <p className=" text-sm text-red-600">{errors.termsAndConditionBox1.message}</p>}
                                            <span className="flex items-start ">
                                                <input type="checkbox" {...register('termsAndConditionBox2', { required: 'Please agree to the terms and conditions' })} className="mr-2" />

                                                <label className=" text-sm font-medium text-gray-700">
                                                    This is to confirm that we do not have any outstanding payables or disputes with any of our forwarding partners beyond 60 days. This is to confirm
                                                    that we are not listed on any blacklisting in either FDRS or our local association, as any findings can be published.
                                                </label>
                                            </span>
                                            {errors.termsAndConditionBox2 && <p className=" text-sm text-red-600">{errors.termsAndConditionBox2.message}</p>}
                                            <strong className="flex py-2 text-lg ">
                                                <span className="color-brand-1 flex items-start pr-1 font-bold">Note: </span>
                                                The conference fee is non-refundable, but we warmly welcome a replacement participant.
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div key={sectionIndex} className="overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                                    <h2 className="mb-6 text-xl font-semibold">{section.title}</h2>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                                        {section.fields.map((field, fieldIndex) => (
                                            <InputField key={field.name} field={field} />
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                    })}

                    {currentStep === 0 && (
                        <div className="mt-4 flex justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    append({});
                                    // setShowAdditionalAttendees(true);
                                }}
                                className="btn btn-outline-primary btn-lg-d flex items-center"
                            >
                                <FiPlus className="mr-2" /> Add Attendee
                            </button>
                        </div>
                    )}
                </>
            </div>

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
                <button
                    onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors
            ${currentStep === 0 ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-[#BFBFBF] text-gray-700 hover:bg-gray-50'}`}
                >
                    <FiChevronLeft className="h-4 w-4" />
                    Previous
                </button>

                {currentStep === stepsCreateFormFields.length - 1 ? (
                    // Submit Button (last step)
                    <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="btn btn-brand-1  flex items-center gap-2  ">
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                ) : (
                    // Next Button (all other steps)
                    <button
                        onClick={() =>
                            isGcaMember !== null
                                ? handleSubmit(() => setCurrentStep((prev) => Math.min(stepsCreateFormFields.length - 1, prev + 1)))()
                                : alert('Please select if you are a GCA member or not')
                        }
                        disabled={isGcaMember === null} // Disable the button if no checkbox is checked
                        className="btn btn-brand-1 flex items-center gap-2"
                    >
                        Next
                        <FiChevronRight className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Progress indicator */}
            <div className="mt-4 flex justify-center gap-1">
                {stepsCreateFormFields.map((_, index) => (
                    <div key={index} className={`h-2 w-2 rounded-full ${index === currentStep ? 'bg-[#30CFCE]' : 'bg-gray-300'}`} />
                ))}
            </div>
        </div>
    );
};

export default EventRegistrationForm;
