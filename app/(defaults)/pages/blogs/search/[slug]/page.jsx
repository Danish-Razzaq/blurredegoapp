'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/app/(defaults)/components/layout/Layout';

const SearchBlogPage = () => {
    const [blogData, setBlogData] = useState();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const { slug } = useParams();
    const decodedSlug = decodeURIComponent(slug);

    const getAllBlogs = async () => {
        const { data } = await axios.get(`${apiUrl}/blogs?populate=*`);
        setBlogData(data.data);
    };

    useEffect(() => {
        getAllBlogs();
    }, []);

    return (
        <Layout>
        <title>Blurred Ego | Blogs</title>
            <div className="mt-70 container mx-auto py-12  px-2">
                <h3 className="mb-3 font-bold text-gray-600 px-2">Blogs</h3>
                <div className="row flex justify-evenly gap-2">
                    {blogData
                        ?.filter((post) => {
                            if (decodedSlug === '') {
                                return post;
                            } else if (post?.attributes?.title?.toLowerCase().includes(decodedSlug?.toLowerCase())) {
                                return post;
                            }
                        })
                        ?.map((post) => (
                            <div key={post.id} className="wow animate__animated animate__fadeIn mb-4  w-full lg:w-[24%] md:w-[45%]">
                                <div className="card-blog-grid hover-up flex h-full flex-col">
                                    <div className="card-image flex-grow-0">
                                        <img style={{ height: '240px', width: '100%', objectFit: 'cover' }} src={`${imgUrl}${post?.attributes?.coverImage?.data?.attributes?.url}`} alt={post.title} />
                                    </div>
                                    <div className="card-info flex flex-grow flex-col justify-between p-3">
                                        <div>
                                            <h5 className="color-primary-main">{post?.attributes?.title}</h5>
                                            <p className="font-sm color-grey-500 ">{post?.attributes?.description?.slice(0, 190)}</p>
                                        </div>
                                        <div>
                                            <div className="line-border" />
                                            <div className="d-flex align-items-center justify-content-between mt-5 pt-0">
                                                <Link className="btn btn-link-brn font-sm" href={`/pages/blogs/${post?.attributes?.slug}`}>
                                                    View Details
                                                    <span>
                                                        <svg className="icon-16 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </Layout>
    );
};

export default SearchBlogPage;
