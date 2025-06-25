'use client';
import { apiCallerWithStatusCode, fetchSponsorshipFields } from '@/utils/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { stepViewFormFields } from '@/utils/eventRegistrationFieldsData';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { ErrorNotification, SuccessNotification } from '@/components/Toster/success';
import { ToastContainer } from 'react-toastify';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const RegistrationDataEdit = () => {
    const { slug } = useParams();
    const [sponsorshipFields, setSponsorshipFields] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [companyLogo, setCompanyLogo] = useState(null);
    const [formalPhoto, setFormalPhoto] = useState(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            Registration_Data: {
                attendees: [],
            },
        },
    });

    const {
        fields: attendeeFields,
        remove,
        append,
    } = useFieldArray({
        control,
        name: 'Registration_Data.attendees',
    });

    const titleOptions = [
        { value: 'Mr.', label: 'Mr.' },
        { value: 'Mrs.', label: 'Mrs.' },
        { value: 'Ms.', label: 'Ms.' },
        { value: 'Dr.', label: 'Dr.' },
    ];

    const shirtSizeOptions = [
        { value: 'XS', label: 'Extra Small' },
        { value: 'S', label: 'Small' },
        { value: 'M', label: 'Medium' },
        { value: 'L', label: 'Large' },
        { value: 'XL', label: 'Extra Large' },
        { value: 'xXL', label: '2X Large' },
    ];

    const getSingleRecord = async () => {
        const response = await apiCallerWithStatusCode('get', `event-participants/${slug}`);
        // Set form values from API response
        const formData = response.data.data.attributes;
        setCompanyLogo(formData.Registration_Data.companyLogo);
        setFormalPhoto(formData.Registration_Data.formalPhoto);

        Object.keys(formData.Registration_Data).forEach((key) => {
            setValue(`Registration_Data.${key}`, formData.Registration_Data[key]);
        });
        // get event name
        setValue('Registration_Data.RegEventName', formData.RegEventName);

        // Set attendees if they exist
        if (formData.Registration_Data.attendees) {
            setValue('Registration_Data.attendees', formData.Registration_Data.attendees);
        }
    };

    const getSponsorshipFields = async (eventName) => {
        if (eventName) {
            const fields = await fetchSponsorshipFields(eventName);
            setSponsorshipFields(fields);
        }
    };

    useEffect(() => {
        // Fetch the single record on initial render and also after form submission
        getSingleRecord();
    }, [isSubmitting]);

    useEffect(() => {
        // Fetch sponsorship fields dynamically based on event name or after form submission
        const eventName = watch('Registration_Data.RegEventName');
        if (eventName) {
            getSponsorshipFields(eventName);
        }
    }, [watch('Registration_Data.RegEventName'), isSubmitting]);

    const uploadFile = async (file, fieldName) => {
        const formData = new FormData();
        formData.append('files', file);

        try {
            const response = await axios.post(`${apiUrl}/upload`, formData);
            const fileInfo = response?.data?.[0];
            return fileInfo;
        } catch (error) {
            console.error(`Error uploading file for ${fieldName}:`, error);
            throw new Error('File upload failed');
        }
    };

    const handleFileChange = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!validImageTypes.includes(file.type)) {
            ErrorNotification('Only image files are allowed');
            return;
        }

        const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
        if (file.size > MAX_FILE_SIZE) {
            ErrorNotification('File size must be less than 2MB');
            return;
        }

        try {
            const fileInfo = await uploadFile(file, fieldName);

            // Check if this is an attendee photo
            const match = fieldName.match(/attendees\.(\d+)\.formalPhoto/);
            if (match) {
                const attendeeIndex = parseInt(match[1], 10);
                setValue(`Registration_Data.attendees.${attendeeIndex}.formalPhoto`, fileInfo.url);
            } else {
                setValue(`Registration_Data.${fieldName}`, fileInfo.url);
            }

            // SuccessNotification('File uploaded successfully');
        } catch (error) {
            ErrorNotification('File upload failed');
        }
    };

    const onSubmit = async (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const result = await apiCallerWithStatusCode('put', `event-participants/${slug}`, {
                data: {
                    Registration_Data: {
                        ...data.Registration_Data,
                    },
                    ...data,
                },
            });

            if (result.status === 200) {
                SuccessNotification('Registration updated successfully');
            }
        } catch (error) {
            console.error('Error updating registration:', error);
            ErrorNotification('Failed to update registration');
        } finally {
            setIsSubmitting(false);
        }
    };

    const RenderField = ({ field, name }) => {
        const fieldName = `Registration_Data.${name}`;
        // const currentValue = watch(fieldName);
        switch (field.type) {
            case 'checkbox':
                return (
                    <div className="mb-4 flex items-start">
                        <input type="checkbox" {...register(fieldName)} className="mr-2 mt-1" />
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                    </div>
                );

            case 'select':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        <select
                            {...register(fieldName)}
                            className="form-select mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Select {field.label}</option>
                            {(field.name.toLowerCase().includes('title') ? titleOptions : field.name.toLowerCase().includes('shirt') ? shirtSizeOptions : field.options || []).map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            case 'textarea':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        <textarea
                            {...register(fieldName)}
                            rows={4}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                );

            case 'file':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(e, name)}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                        />

                        {companyLogo && name === 'companyLogo' && (
                            <div className="mt-2">
                                <img src={imgUrl + companyLogo} alt="Preview" className="h-32 w-32 object-cover" />
                                <p className="mt-2 text-start text-sm">Company Logo</p>
                            </div>
                        )}
                        {formalPhoto && name === 'formalPhoto' && (
                            <div className="mt-2">
                                <img src={imgUrl + formalPhoto} alt="Preview" className="h-32 w-32 object-cover" />
                                <p className="mt-2 text-start text-sm">Formal Photo</p>
                            </div>
                        )}

                        {/* {currentValue && ( // Check for valid image extensions
                            <div className="mt-2">
                                <img
                                    src={imgUrl + currentValue}
                                    alt="Preview"
                                    className="h-32 w-32 object-cover"
                                />
                                <p className="mt-2 text-start text-sm">
                                    {name === 'companyLogo' ? 'Company Logo' : 'Photo'}
                                </p>
                            </div>
                        )} */}
                    </div>
                );

            default:
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        <input
                            type={field.type}
                            {...register(fieldName)}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                );
        }
    };

    const RenderAttendeeFields = ({ attendeeIndex, fields }) => {
        return fields.map((field, fieldIndex) => {
            if (field.type === 'file') {
                const fieldName = `attendees.${attendeeIndex}.${field.name}`;
                const currentValue = watch(`Registration_Data.attendees.${attendeeIndex}.${field.name}`);

                return (
                    <div key={fieldIndex} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(e, fieldName)}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {currentValue && (
                            <div className="mt-2 ">
                                <img src={imgUrl + currentValue} alt="Preview" className="h-32 w-32 object-cover" />
                                <p className="mt-2 text-start text-sm">{field.name === 'formalPhoto' ? 'Formal Photo' : 'Photo'}</p>
                            </div>
                        )}
                    </div>
                );
            } else if (field.type === 'select') {
                const fieldName = `Registration_Data.attendees.${attendeeIndex}.${field.name}`;

                return (
                    <div key={fieldIndex} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        <select
                            {...register(fieldName)}
                            className="form-select mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Select {field.label}</option>
                            {(field.name.toLowerCase().includes('title') ? titleOptions : field.name.toLowerCase().includes('shirt') ? shirtSizeOptions : field.options || []).map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            } else if (field.type === 'checkbox') {
                return (
                    <div key={fieldIndex} className="mb-4 flex items-start">
                        <input type="checkbox" {...register(`Registration_Data.attendees.${attendeeIndex}.${field.name}`)} className="mr-2 mt-1" />
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                    </div>
                );
            }
            return (
                <div key={fieldIndex} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                    <input
                        type={field.type}
                        {...register(`Registration_Data.attendees.${attendeeIndex}.${field.name}`)}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            );
        });
    };

    return (
        <>
            <title>Edit Event Registration</title>
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto px-4">
                <div className="container mx-auto max-w-3xl p-3">
                    <div className="mb-10 flex justify-between">
                        <Link href={`/apps/events/${watch('Registration_Data.RegEventName')}`} className="btn btn-blue p-1 px-2">
                            Back
                        </Link>
                        <h1 className="color-brand-1 text-center text-3xl font-bold">Edit Event Registration</h1>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400">
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            append({});
                            // setShowAdditionalAttendees(true);
                        }}
                        className="btn btn-outline-primary btn-lg-d my-8 flex justify-self-end"
                    >
                        <FiPlus className="mr-2" /> Add Additional Attendee
                    </button>

                    {stepViewFormFields.map((step, stepIndex) => (
                        <div key={stepIndex} className="mb-4 space-y-6">
                            {step.sections.map((section, sectionIndex) => (
                                <div key={sectionIndex}>
                                    {section.title === 'Onsite Branding Sponsorship' ? (
                                        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                                            <h2 className="mb-6 text-xl font-semibold">{section.title}</h2>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                                                {sponsorshipFields?.length > 0 ? (
                                                    sponsorshipFields?.map((field) => <RenderField key={field.name} field={field} name={field.name} value={field.value} />)
                                                ) : (
                                                    <p>No Sponsorship Available</p>
                                                )}
                                            </div>
                                        </div>
                                    ) : section.title === 'Add Additional Attendees' ? (
                                        <div className="overflow-hidden bg-white">
                                            {attendeeFields.map((attendee, index) => (
                                                <div key={attendee.id} className="mb-8 overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                                                    <div className="mb-6 flex items-center justify-between">
                                                        <h2 className="mb-6 text-xl font-semibold text-red-600">Additional Attendee {index + 1}</h2>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this attendee?')) {
                                                                    remove(index);
                                                                }
                                                            }}
                                                            className={`text-red-500 hover:text-red-700`}
                                                        >
                                                            <FiTrash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                    {section.fields.map((subsection) => (
                                                        <div key={subsection.title} className="mb-6">
                                                            <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">{subsection.title}</h3>

                                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                                                                <RenderAttendeeFields attendeeIndex={index} fields={subsection.fields} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                                                <h2 className="mb-6 text-xl font-semibold">{section.title}</h2>
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                                                    {section.fields.map((field) => (
                                                        <RenderField key={field.name} field={field} name={field.name} />
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <ToastContainer />
            </form>
        </>
    );
};

export default RegistrationDataEdit;
