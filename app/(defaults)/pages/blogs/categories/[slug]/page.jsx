'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@/app/(defaults)/components/layout/Layout';
import Link from 'next/link';
import { useParams } from 'next/navigation';
const Categories = () => {
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


      // blog description world limit set function
      const truncateBlogDescription = (info) => {
        return info?.length > 150 ? `${info.substring(0, 150)}...` : info;
    };
    return (
        <Layout>
            <>
            <title>Blurred Ego | Blogs</title>
                <section className="section mt-70">
                    <div className="cnt-center container">
                        <div className="row flex justify-evenly gap-2">
                            {blogData
                                ?.filter((post) => {
                                    if (decodedSlug === '') {
                                        return post;
                                    } else if (post?.attributes?.category?.data?.attributes?.title?.toLowerCase().includes(decodedSlug?.toLowerCase())) {
                                        return post;
                                    }
                                })
                                ?.map((post) => (
                                    <div key={post.id} className="wow animate__animated animate__fadeIn mb-4 lg:w-[24%] md:w-[45%] ">
                                        <div className="card-blog-grid hover-up flex h-full flex-col">
                                            <div className="card-image flex-grow-0">
                                                <img
                                                style={{height: "240px", width: "100%", objectFit: "cover"}}
                                                 src={`${imgUrl}${post?.attributes?.coverImage?.data?.attributes?.url}`} alt={post.title} />
                                            </div>
                                            <div className="card-info p-3 flex flex-grow flex-col justify-between">
                                                <div>
                                                    <h5 className="color-primary-main">{post?.attributes?.title}</h5>
                                                    <p className="font-sm color-grey-500">{truncateBlogDescription(post?.attributes?.description)}</p>
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
                </section>
            </>
        </Layout>
    );
};

export default Categories;
