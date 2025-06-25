'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/app/(defaults)/components/layout/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { BsSearch } from 'react-icons/bs';
import Link from 'next/link';

import RichTextRenderer from '@/components/RichTextRenderer';
import NotFound from '@/app/not-found';

const BlogsDetailsPage = () => {
    const router = useRouter();
    const { slug } = useParams();
    const [singlePost, setSinglePost] = useState();
    const [recentPost, setRecentPost] = useState();
    const [categories, setCategories] = useState();

    const [search, setSearch] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const getBlogData = async () => {
        const { data } = await axios.get(`${apiUrl}/blogs?filters[slug][$eq]=${slug}&populate=*`);
        // console.log('data', data);
        setSinglePost(data.data[0]);
    };
    const getRecentBlogPosts = async () => {
        const { data } = await axios.get(`${apiUrl}/blogs?pagination[limit]=2&_start=0&sort=createdAt:DESC&populate=*`);
        setRecentPost(data.data);
    };

    const getBloBlurred Egotegories = async () => {
        const { data } = await axios.get(`${apiUrl}/categories`);
        setCategories(data.data);
    };
    useEffect(() => {
        getBlogData();
        getRecentBlogPosts();
        getBloBlurredEgotegories();
    }, []);

    // console.log('singlePost', singlePost);

    const publishedAt = new Date(singlePost?.attributes?.publishedAt);
    const publishedDate = publishedAt.toLocaleString('en-US', {
        timeZone: 'Asia/Karachi',
        dateStyle: 'full',
        // timeStyle: "medium",
    });

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };
    const handleKeyUp = (e) => {
        e.preventDefault();
        if (search === '') {
            return;
        }
        router.push(`/pages/blogs/search/${search}`);
    };

    if (!singlePost) {
        return  <Layout><NotFound /></Layout>;
    }

    return (
        <Layout>
            <title>{singlePost?.attributes?.title}</title>
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Main Content */}
                    <div className="lg:w-3/4 ">
                        {/* Main Image */}
                        <div
                            className="flex  flex-col rounded-lg bg-white  p-3  sm:shadow-sm" >
                            <img
                                src={`${imgUrl}${singlePost?.attributes?.coverImage?.data?.attributes?.url}`}
                                // alt={blog?.title}
                                style={{ height: 'auto', width: '100%', objectFit: 'cover', aspectRatio: '16/9' }}
                                className="img-fluid w-full cursor-pointer  transition-all duration-300 ease-out hover:opacity-80 "
                                //   onClick={() => setIsZoomed(!isZoomed)}
                            />
                            {/* Title & Date */}
                            <h1 className="color-brand-1 mt-2 text-3xl font-bold">{singlePost?.attributes?.title}</h1>

                            <p className="text-sm text-gray-500">{publishedDate}</p>

                            <hr className="my-4 bg-gray-500" />
                            {/* Blog Content */}
                            <div className="blogContent  text-lg leading-relaxed text-gray-700 ">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {singlePost?.attributes?.content}
                                </ReactMarkdown>
                                {/* Add more content sections as needed */}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        {/* Search Bar */}
                        <div className="mb-8 flex gap-2  ">
                            <div className="flex items-center justify-center rounded bg-gray-400 p-2">
                                <BsSearch className="h-5 w-5 text-white" />
                            </div>
                            <form onSubmit={handleKeyUp} className='w-full'>
                                <input type="text" placeholder="Search blogs....." className="w-full rounded border p-2 " onChange={handleSearch} />
                            </form>
                        </div>

                        {/* Categories */}
                        <div className="mb-8">
                            <h3 className=" mb-4 font-semibold text-gray-500">Categories Clouds</h3>
                            <div className="flex flex-wrap gap-2">
                                {categories?.map((category) => (
                                    <Link
                                        title={category?.attributes?.title}
                                        href={`/pages/blogs/categories/${category?.attributes?.title}`}
                                        key={category?.id}
                                        className="rounded  bg-blue-100 px-3 py-2 text-blue-800"
                                        style={{ border: '1px solid #b52d1a' }}
                                    >
                                        {category?.attributes?.title}
                                    </Link>
                                ))}

                                {/* <span className="rounded bg-blue-100 px-2 py-1 text-blue-800">Blurred Ego</span> */}
                            </div>
                        </div>

                        {/* Recent Posts */}
                        <div className="partial-border  rounded-md  bg-gray-100 px-2 py-4 shadow-sm">
                            <h3 className="mb-6 border-b-2 border-gray-200 text-2xl  font-bold text-gray-700 ">Recent Posts</h3>
                            <div className="space-y-6">
                                {recentPost?.map((post) => (
                                    <div className="mb-4 flex transform flex-col justify-center rounded-lg bg-white p-3 shadow-md transition-all hover:scale-105 hover:shadow-xl" key={post?.id}>
                                        <Link href={`/pages/blogs/${post?.attributes?.slug}`}>
                                            <h4 className="text-xl font-semibold color-brand-1 transition-all hover:text-indigo-600">{post?.attributes?.title}</h4>
                                            <hr className="red my-2" />
                                            <div className="mt-3">
                                                <img
                                                    src={`${imgUrl}${post?.attributes?.coverImage?.data?.attributes?.url}`}
                                                    style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                                                    alt="Thumbnail"
                                                    className="cursor-pointer rounded-md transition-opacity hover:opacity-90"
                                                />
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default BlogsDetailsPage;
