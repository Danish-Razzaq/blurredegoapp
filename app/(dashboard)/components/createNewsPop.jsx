'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiCaller, apiCallerImgUpload } from '@/utils/api';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Import styles for the editor

const CreateNewsPopUp = ({ show, setShow }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [categories, setCategories] = useState([]);
    const [content, setContent] = useState('');
    const [newsCategoryId, setNewsCategoryId] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);

    // api calling for  fetching from category  specially news and find the news values and set this into hook form category when
    // component is mounting on first time

    const getBloBlurred Egotegories = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/categories`);
            const categoriesData = data.data;
            setCategories(categoriesData);

            // Find the "News" category
            const newsCategory = categoriesData.find((category) => category?.attributes?.title === 'News');
            if (newsCategory) {
                setNewsCategoryId(newsCategory?.id);
                setValue('category', newsCategory?.id);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    useEffect(() => {
        getBloBlurredEgotegories();
    }, []);

    // console.log('categories', categories);

    // take methods form react hook form and set Initial values
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            slug: '',
            content: '',
            category: '',
            coverImage: '',
        },
    });

    // set title into slug when the  value of title will be changing
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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setCoverImageFile(file); // Store the selected file in state
    };

    // Function to upload a file
    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('files', file);

        try {
            const response = await apiCallerImgUpload('post', 'upload', formData);
            // Extract file information
            const fileInfo = response[0]; // Assuming the response is an array with file objects
            return fileInfo.id; // Return the uploaded image ID
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('File upload failed');
            throw new Error('File upload failed');
        }
    };

    // handle the form submission of blog and take news category to resolve the the useEFFECT ISSUE ON FIRST MOUNTING
    const onSubmit = async (data) => {
        try {
            const newsCategory = categories.find((category) => category?.attributes?.title === 'News');
            if (newsCategory) {
                data.category = newsCategory?.id;
            } else {
                throw new Error('News category not found');
            }

            // Upload the image and get the ID
            if (coverImageFile) {
                const uploadedImageId = await uploadFile(coverImageFile);
                data.coverImage = uploadedImageId; // Use the uploaded image ID
            }

            const blogData = {
                data: {
                    title: data.title,
                    description: data.description,
                    slug: data.slug,
                    content: data.content,
                    category: data.category,
                    coverImage: data.coverImage || null,
                },
            };
            const responseData = await apiCaller('post', 'blogs', blogData);
            console.log('Blog created successfully:', responseData.data);
            setShow(false);
            reset();
        } catch (error) {
            console.log(error);
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
                            <h1 className="text-2xl">Create News</h1>
                            <button onClick={() => setShow(false)} className="text-2xl">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Blog Title */}
                            <div className="form-group mb-4">
                                <label>Title</label>
                                <input type="text" className="form-control" {...register('title', { required: true })} />
                                {errors.title && <span className='text-red-500'>This field is required</span>}
                            </div>

                            <div className="form-group mb-4">
                                <input type="hidden" {...register('slug')} />
                            </div>

                            <div className="form-group mb-4">
                                <label>Description</label>
                                <textarea  className="form-control" {...register('description', { required: true })}></textarea>
                                {errors.description && <span className='text-red-500'>This field is required</span>}
                            </div>

                            <div className="form-group mb-4">
                                <label>Content</label>
                                <textarea rows={6} className="form-control" {...register('content', { required: true })}></textarea>
                                {errors.content && <span className='text-red-500'>This field is required</span>}
                            </div>

                            <div className="form-group mb-4">
                                <label>Cover Image</label>
                                <input required type="file" onChange={handleImageUpload} />
                            </div>

                            <div className="d-flex justify-content-end">
                                <button className="btn btn-outline-blue btn-lg-d mr-20 p-3 px-6" onClick={() => setShow(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-brand-1-big mr-20" type="submit">
                                Create News
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateNewsPopUp;
