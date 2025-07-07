'use client';
import { apiCallerWithStatusCode, fetchSponsorshipFields } from '@/utils/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { stepViewFormFields } from '@/utils/eventRegistrationFieldsData';

const RegistrationDataView = () => {
    const { slug } = useParams();
    const [formData, setFormData] = useState({});
    const [attendeeIndex, setAttendeeIndex] = useState(0);
    const [sponsorshipFields, setSponsorshipFields] = useState([]);
    //  address of back screen preview
    // const [moveTOBackScreen, setMoveTOBackScreen] = useState('');

    // console.log('formData', formData);
    // console.log('sponsorshipFields', sponsorshipFields);

    const getSingleRecord = async () => {
        const response = await apiCallerWithStatusCode('get', `event-participants/${slug}`);
        // console.log('response', response);
        // setFormData(response.data.data.attributes);
        // setMoveTOBackScreen(response.data.data.attributes.event_name);
    };
    const getSponsorshipFields = async () => {
        const fields = await fetchSponsorshipFields(formData?.RegEventName);
        setSponsorshipFields(fields);
    };

    useEffect(() => {
        getSponsorshipFields();
        getSingleRecord();
    }, []);
    useEffect(() => {
        getSponsorshipFields();
    }, [formData]);

    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const RenderField = ({ field }) => {
        const value = formData?.Registration_Data?.[field.name];

        switch (field.type) {
            case 'checkbox':
                return (
                    <div className="mb-4 flex items-start">
                        <input type="checkbox" checked={value || false} className="mr-2 mt-1 cursor-not-allowed " />
                        <label className="block text-sm font-medium text-gray-700 ">
                            {field.label.split(/(\(USD[^\)]+\))/).map((part, index) => (part.startsWith('(USD') ? <strong key={index}>{part}</strong> : part))}
                        </label>
                    </div>
                );

            case 'select':
            case 'text':
            case 'email':
            case 'tel':
            case 'url':        
                // if (!value && value !== false) return null;
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{field?.label}</label>
                        <div className="mt-1 h-8 w-full rounded-full border border-gray-300 bg-gray-100 px-3 py-2">{value?.toString()}</div>
                    </div>
                );

            case 'textarea':
                // if (!value && value !== false) return null;
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{field?.label}</label>
                        <textarea className="mt-1 w-full rounded-xl  border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" rows={5}>
                            {value?.toString()}
                        </textarea>
                    </div>
                );
            case 'file':
                if (!value && value !== false) return null;
                // console.log('value of image', value);
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{field?.label}</label>
                        <img
                            src={value?.length > 0 ? `${imgUrl}${value}` : '/assets/images/contactPersonPicture.jpg'}
                            alt="company logo"
                            className="mt-1 h-20 w-20 rounded-lg border border-gray-300 bg-gray-100 p-1"
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    const RenderAdditionalAttendees = ({ section, index }) => {
        const attendees = formData?.Registration_Data?.attendees || [];

        // If no attendees or index is out of bounds, return null
        if (!attendees[index]) return null;

        return (
            <div className="mb-8 overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                <h2 className="mb-6 text-xl font-semibold text-red-600">Additional Attendee {index + 1}</h2>

                {section.fields.map((subsection, subsectionIndex) => (
                    <div key={subsectionIndex} className="mb-6">
                        <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">{subsection.title}</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                            {subsection.fields.map((field) => {
                                const value = attendees[index][field.name];

                                switch (field.type) {
                                    case 'checkbox':
                                        return (
                                            <div key={field.name} className="mb-4 flex items-start">
                                                <input type="checkbox" checked={value || false} className="mr-2 mt-1 cursor-not-allowed" />
                                                <label className="text-sm font-medium text-gray-700">{field.label}</label>
                                            </div>
                                        );

                                    case 'select':
                                    case 'text':
                                    case 'email':
                                        if (!value && value !== false) return null;
                                        return (
                                            <div key={field.name} className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                                <div className="mt-1 w-full rounded-full border border-gray-300 bg-gray-100 px-3 py-2">{value.toString()}</div>
                                            </div>
                                        );

                                    case 'file':
                                        if (!value && value !== false) return null;
                                        return (
                                            <div key={field.name} className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                                <img
                                                    src={value.length > 0 ? `${imgUrl}${value}` : '/assets/images/contactPersonPicture.jpg'}
                                                    alt="company logo"
                                                    className="mt-1 h-20 w-20 rounded-lg border border-gray-300 bg-gray-100 p-1"
                                                />
                                            </div>
                                        );

                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
        <title>Event Registration Details</title>
            <Link href={`/apps/events/${formData?.RegEventName}`} className="btn btn-blue mb-10 w-fit p-1">
                Back
            </Link>
            <div className="container mx-auto max-w-3xl p-3">
                <h1 className="color-brand-1 mb-8 text-center text-3xl font-bold">Event Registration Details</h1>

                {/*  show membership Id if user is member in top  */}

                {formData?.Registration_Data?.memberId && (
                    <div className="overflow-hidden rounded-lg bg-white p-4 shadow-lg lg:p-10">
                        <h2 className="mb-6 text-xl font-semibold">Membership ID</h2>
                        <div className="grid grid-cols-1 gap-4  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Membership ID</label>
                                <div className="mt-1 w-full rounded-full border border-gray-300 bg-gray-100 px-3 py-2">{formData?.Registration_Data?.memberId}</div>
                            </div>
                        </div>
                    </div>
                )}

                {stepViewFormFields.map((step, stepIndex) => (
                    <div key={stepIndex} className="my-4 space-y-6">
                        {step.sections.map((section, sectionIndex) => (
                            <>
                                {section.title === 'Onsite Branding Sponsorship' ? (
                                    <div key={sectionIndex} className="overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                                        <h2 className="mb-6 text-xl font-semibold">{section.title}</h2>
                                        <div className="grid grid-cols-1 gap-4  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                                            {sponsorshipFields?.length > 0 ? (
                                                sponsorshipFields?.map((field, fieldIndex) => <RenderField key={field.name} field={field} />)
                                            ) : (
                                                <p>No Sponsorship Available</p>
                                            )}
                                        </div>
                                    </div>
                                ) : section.title === 'Add Additional Attendees' ? (
                                    <div key={sectionIndex} className="overflow-hidden bg-white ">
                                        {formData?.Registration_Data?.attendees?.map((_, index) => (
                                            <RenderAdditionalAttendees key={index} section={section} index={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <div key={sectionIndex} className="overflow-hidden rounded-lg bg-white p-6 shadow-lg lg:p-10">
                                            <h2 className="mb-6 text-xl font-semibold">{section.title}</h2>
                                            <div className="grid grid-cols-1 gap-4  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                                                {section.fields.map((field) => (
                                                    <RenderField key={field.name} field={field} />
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

export default RegistrationDataView;
