'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { apiCaller, apiCallerImgUpload } from '@/utils/api';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Import styles for the editor

const EditNews = ({ show, setShow, newsData }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [categories, setCategories] = useState([]);
    // const [content, setContent] = useState('');
    const [newsCategoryId, setNewsCategoryId] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [updatedFields, setUpdatedFields] = useState({}); // Track updated fields

    // Fetch categories on mount
    useEffect(() => {
        const getBloBlurredEgotegories = async () => {
            try {
                const { data } = await axios.get(`${apiUrl}/categories`);
                const categoriesData = data.data;
                setCategories(categoriesData);

                const newsCategory = categoriesData.find((category) => category?.attributes?.title === 'News');
                if (newsCategory) {
                    setNewsCategoryId(newsCategory?.id);
                    setValue('category', newsCategory?.id);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        getBloBlurredEgotegories();
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    // Watch title changes to generate slug
    const title = watch('title');
    useEffect(() => {
        if (title) {
            const generatedSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .trim()
                .replace(/\s+/g, '-');
            setValue('slug', generatedSlug);
        }
    }, [title, setValue]);

    // Set initial form values from newsData and watch for changes
    useEffect(() => {
        if (newsData) {
            reset({
                title: newsData.attributes.title,
                description: newsData.attributes.description,
                slug: newsData.attributes.slug,
                content: newsData.attributes.content,
                category: newsData.attributes.category.data?.id,
            });
            // setContent(newsData.attributes.content);
        }
    }, [newsData, reset]);

    // Track changes in form fields to see which ones have been updated
    const handleFieldChange = (fieldName, newValue) => {
        setUpdatedFields((prev) => ({
            ...prev,
            [fieldName]: newValue !== newsData.attributes[fieldName],
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setCoverImageFile(file); // Store the selected file in state
        handleFieldChange('coverImage', file);
    };

    // Upload file to server and get the ID
    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('files', file);

        try {
            const response = await apiCallerImgUpload('post', 'upload', formData);
            return response[0].id; // Assuming the response is an array with file objects
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('File upload failed');
            throw new Error('File upload failed');
        }
    };

    // Form submission
    const onSubmit = async (data) => {
        try {
            const blogData = {
                data: {},
            };

            // Check which fields have changed and only update those
            Object.keys(updatedFields).forEach((field) => {
                if (updatedFields[field]) {
                    blogData.data[field] = data[field] || null;
                }
            });

            if (coverImageFile) {
                const uploadedImageId = await uploadFile(coverImageFile);
                blogData.data.coverImage = uploadedImageId; // Use the uploaded image ID
            }

            if (Object.keys(blogData.data).length === 0) {
                alert('No changes detected.');
                return;
            }

            const responseData = await apiCaller('put', `blogs/${newsData.id}`, blogData);
            console.log('Blog Updated successfully:', responseData.data);
            setShow(false);
            reset();
        } catch (error) {
            console.error('Error updating blog:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <>
            {show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-1/2 bg-white p-4 lg:w-1/3">
                        <div className="mb-3 flex items-center justify-between">
                            <div />
                            <h1 className="text-2xl">Edit News</h1>
                            <button onClick={() => setShow(false)} className="text-2xl">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group mb-4">
                                <label>Title</label>
                                <input type="text" required className="form-control" {...register('title', { required: true })} onChange={(e) => handleFieldChange('title', e.target.value)} />
                                {errors.title && <span className='text-red-500'>This field is required</span>}
                            </div>

                            <input type="hidden" {...register('slug')} />

                            <div className="form-group mb-4">
                                <label>Description</label>
                                <textarea   className="form-control" required {...register('description', { required: true })} onChange={(e) => handleFieldChange('description', e.target.value)}></textarea>
                                {errors.description && <span className='text-red-500'>This field is required</span>}
                            </div>
                            <div className="form-group mb-4">
                                <label>Content</label>
                                <textarea rows={6} className="form-control" {...register('content', { required: true })} onChange={(e) => handleFieldChange('content', e.target.value)}></textarea>
                                {errors.content && <span>This field is required</span>}
                            </div>

                            <div className="form-group mb-4">
                                <label>Cover Image</label>
                                <input  type="file" onChange={handleImageUpload} />
                            </div>

                            <div className="d-flex justify-content-end">
                                <button className="btn btn-outline-blue mr-20 p-3" onClick={() => setShow(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-brand-1-big" type="submit">
                                    Update News
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditNews;
