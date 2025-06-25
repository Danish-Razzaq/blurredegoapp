'use client';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { BsCalendar } from 'react-icons/bs';
import { ImCross } from 'react-icons/im';
import { apiCallerWithStatusCode } from '@/utils/api';
import axios from 'axios';
import SponsorshipManagement from './SponsorshipManagement';

const CustomEventForm = ({ show, mode, eventData, onClose, setNotification, handleEventCreated }) => {
    // console.log("eventData", eventData);
    // console.log("mode", mode);

    const modalRef = useRef(null);
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [selectedImagePreview, setSelectedImagePreview] = React.useState(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // console.log('sponsorships', sponsorships);

    // console.log('selectedImagePreview', selectedImagePreview);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    const apiUrl = process.env.NEXT_PUBLIC_IMG_URL;
    // console.log("apiUrl", apiUrl);

    useEffect(() => {
        if (mode === 'update' && eventData) {
            const { attributes } = eventData;
            Object.keys(attributes).forEach((key) => {
                setValue(key, attributes[key]);
            });

            // Set sponsorships if they exist
            if (attributes.event_sponsorship_fields) {
                setValue('event_sponsorship_fields', attributes.event_sponsorship_fields);
            }

            // Set image
            if (attributes.event_banner_image) {
                setSelectedImagePreview(`${apiUrl}${attributes.event_banner_image?.data?.attributes?.url}`);
            }
        } else {
            reset();
            setSelectedImage(null);
            setSelectedImagePreview(null);
            // Initialize empty sponsorships for create mode
            setValue('event_sponsorship_fields', []);
        }
    }, [mode, eventData, setValue]);
    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, onClose]);

    // Prevent scroll when modal is open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        setSelectedImage(file);
        setSelectedImagePreview(url);
    };

    const apiUrlImg = process.env.NEXT_PUBLIC_API_URL;
    // Function to upload a file
    const uploadFile = async (file) => {
        if (file instanceof Blob) {
            const formData = new FormData();
            formData.append('files', file);
            if (file.size > 3048576) {
                setNotification({ type: 'error', message: 'File size must be less than 3MB' });
                throw new Error('File size must be less than 1MB');
            }
            try {
                const response = await axios.post(`${apiUrlImg}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('response after uploading file', response);
                return response.data[0].id;
            } catch (error) {
                console.error('Error uploading file:', error);
                setNotification({ type: 'error', message: 'File upload failed' });
                throw new Error('File upload failed');
            }
        }
    };

    const onSubmit = async (data) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            if (selectedImage) {
                const imageId = await uploadFile(selectedImage);
                data.event_banner_image = imageId;
            } else {
                data.event_banner_image = eventData.attributes.event_banner_image?.id;
            }

            // Add sponsorship fields to the data
            data.event_sponsorship_fields = watch('event_sponsorship_fields') || [];

            if (mode === 'create') {
                const response = await apiCallerWithStatusCode('post', 'events', {
                    data: { ...data },
                });

                if (response.status === 200) {
                    handleEventCreated();
                    setNotification({ type: 'success', message: 'Event created successfully' });
                    onClose();
                    reset();
                }
            } else if (mode === 'update') {
                const response = await apiCallerWithStatusCode('put', `events/${eventData.id}?populate=*`, {
                    data: { ...data },
                });

                if (response.status === 200) {
                    handleEventCreated();
                    setNotification({ type: 'success', message: 'Event updated successfully' });
                    onClose();
                    reset();
                }
            }
        } catch (error) {
            console.error('Error submitting event:', error.response || error);
            setNotification({ type: 'error', message: 'An error occurred. Please try again later' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div ref={modalRef} className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
                    <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                        <h2 className="text-2xl font-bold text-gray-800">{mode === 'create' ? 'Create New Event' : 'Update Event'}</h2>
                        <button onClick={onClose} className="rounded-full p-1 transition-colors hover:bg-gray-100">
                            <ImCross className="h-6 w-6" color="red" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium  text-gray-700">Event Banner Image</label>
                            <div
                                className={`rounded-lg border-2 border-dashed p-6 text-center 
                                ${selectedImage ? 'border-blue-500' : 'border-gray-300'}`}
                            >
                                {selectedImage || selectedImagePreview ? (
                                    <div className="relative ">
                                        <img src={selectedImagePreview ? selectedImagePreview : selectedImage} alt="Preview" className="mx-auto max-h-40 " accept="png, jpg, jpeg" />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setSelectedImagePreview(null);
                                            }}
                                            className="absolute right-0 top-0  -mr-2 -mt-2 rounded-full bg-red-500 p-1 text-white"
                                        >
                                            <ImCross className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="cursor-pointer" onClick={() => document.getElementById('image-upload').click()}>
                                        <BsCalendar className="mx-auto h-12 w-12 text-gray-400" />
                                        <span className="mt-2 block text-sm text-gray-500">Click to upload or drag and drop</span>
                                        <span className="block text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</span>
                                    </div>
                                )}
                                <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </div>
                        </div>
                        {/* Location Fields */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
                                <input
                                    type="text"
                                    {...register('city', { required: 'City is required' })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter city"
                                />
                                {errors.city && <span className="text-sm text-red-500">{errors.city.message}</span>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
                                <input
                                    type="text"
                                    {...register('country', { required: 'Country is required' })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter country"
                                />
                                {errors.country && <span className="text-sm text-red-500">{errors.country.message}</span>}
                            </div>
                        </div>

                        {/* Date Fields */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    {...register('starting_date', { required: 'Start date is required' })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.starting_date && <span className="text-sm text-red-500">{errors.starting_date.message}</span>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">End Date</label>
                                <input
                                    type="date"
                                    {...register('ending_date', { required: 'End date is required' })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.ending_date && <span className="text-sm text-red-500">{errors.ending_date.message}</span>}
                            </div>
                        </div>

                        {/* Registration Fee Fields */}

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Member Early Bird Fee</label>
                                <input
                                    type="number"
                                    {...register('member_early_bird_fee', { required: 'Fee is required', min: 1 })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter early bird fee"
                                />
                                {errors.member_early_bird_fee && <span className="text-sm text-red-500">{errors.member_early_bird_fee.message}</span>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700"> Non Member Early Bird Fee</label>
                                <input
                                    type="number"
                                    {...register('early_bird_normal_fee', { required: 'Fee is required', min: 1 })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter normal fee"
                                />
                                {errors.early_bird_normal_fee && <span className="text-sm text-red-500">{errors.early_bird_normal_fee.message}</span>}
                            </div>

                            {/* // take date from the user that is the last date of early bird fee and then compare it with the current date and if the current date is less than the last date of early bird fee then the early bird fee will be shown otherwise the normal fee will be shown */}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Early Bird Fee End Date</label>
                            <input
                                type="date"
                                {...register('early_bird_fee_end_date', { required: 'End date is required' })}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.early_bird_fee_end_date && <span className="text-sm text-red-500">{errors.early_bird_fee_end_date.message}</span>}
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Normal Member Fee</label>
                                <input
                                    type="number"
                                    {...register('member_fee', { required: 'Fee is required', min: 1 })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter normal fee"
                                />
                                {errors.member_fee && <span className="text-sm text-red-500">{errors.member_fee.message}</span>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Non Member Normal Fee</label>
                                <input
                                    type="number"
                                    {...register('non_member_fee', { required: 'Fee is required', min: 1 })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter normal fee"
                                />
                                {errors.non_member_fee && <span className="text-sm text-red-500">{errors.non_member_fee.message}</span>}
                            </div>
                        </div>

                        {/* Attendance & Organizer */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Expected Attendance</label>
                                <input
                                    type="number"
                                    {...register('expected_attendance', { required: 'Attendance is required', min: 1 })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter expected attendees"
                                />
                                {errors.expected_attendance && <span className="text-sm text-red-500">{errors.expected_attendance.message}</span>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Organizer</label>
                                <input
                                    type="text"
                                    {...register('organizer', { required: 'Organizer is required' })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter organizer name"
                                />
                                {errors.organizer && <span className="text-sm text-red-500">{errors.organizer.message}</span>}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Event Description</label>
                            <textarea
                                {...register('event_description', { required: 'Description is required' })}
                                className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter event description"
                            />
                            {errors.event_description && <span className="text-sm text-red-500">{errors.event_description.message}</span>}
                        </div>
                        {/*  SponsorShip Fields component */}
                        <SponsorshipManagement setValue={setValue} updateSponsorshipList={mode === 'update' ? eventData?.attributes?.event_sponsorship_fields : ''} />

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={onClose} className="rounded-md border border-gray-700 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-100">
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className={`w-24 rounded-md ${isSubmitting ? 'cursor-not-allowed bg-gray-400' : 'bg-red-600 hover:bg-red-700'} px-4 py-2 text-white focus:outline-none`}
                                disabled={isSubmitting}
                            >
                                {mode === 'create' ? (isSubmitting ? 'Submitting...' : 'Submit') : isSubmitting ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CustomEventForm;
