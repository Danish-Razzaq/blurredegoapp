'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import NewsSliderBlog from '../../components/slider/NewsSliderBlog';
import NewsCaracol from '../../components/slider/NewsCaracol';
import NewsFilter from '../../components/NewsFilter';
import { filterNews } from '@/utils/filterNews';
import { dummyNews } from '@/Data/dummyNews'; // Import dummy data for testing
import Head from 'next/head';
export default function Blog() {
    const [currentPage, setCurrentPage] = useState(1);
    const [blogData, setBlogData] = useState([]); // All blogs excluding news
    const [newsData, setNewsData] = useState([]); // All news blogs (unfiltered)
    const [filteredNews, setFilteredNews] = useState([]); // Filtered news blogs
    const [latestNews, setLatestNews] = useState([]); // Latest blogs (today or yesterday)
    const [filterBy, setFilterBy] = useState('all');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const getAllBlogs = async () => {
        const { data } = await axios.get(`${apiUrl}/blogs?populate=*`);
        const sortedBlogs = data.data.sort((a, b) => {
            const BlogDate1 = new Date(a?.attributes?.createdAt);
            const BlogDate2 = new Date(b?.attributes?.createdAt);
            return BlogDate2 - BlogDate1;
        });

        const filteredBlogs = sortedBlogs.filter((blog) => blog?.attributes?.category?.data?.attributes?.title !== 'News');
        const filteredNewsData = sortedBlogs.filter((blog) => blog?.attributes?.category?.data?.attributes?.title === 'News');

        setBlogData(filteredBlogs); // Set non-news blogs
        setNewsData(filteredNewsData); // Set all news blogs

        // Initially filter news by the selected filter (default is "latest")
        const initialFilteredNews = filterNews(filterBy, newsData);
        setFilteredNews(initialFilteredNews);

        // Filter blogs published today or yesterday for the latest news
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const latestBlogs = filteredNewsData.filter((blog) => {
            const blogDate = new Date(blog?.attributes?.createdAt);
            return blogDate.toDateString() === today.toDateString() || blogDate.toDateString() === yesterday.toDateString();
        });

        setLatestNews(latestBlogs); // Set latest blogs
    };

    useEffect(() => {
        getAllBlogs();
    }, []);

    // Apply filter whenever filterBy changes
    useEffect(() => {
        if (newsData.length) {
            const filteredNewsByDate = filterNews(filterBy, newsData); // Filter on the original unfiltered data
            setFilteredNews(filteredNewsByDate); // Update filteredNews
        }
    }, [filterBy, newsData]); // Dependency on both filterBy and original newsData

    const postsPerPage = 12;
    // Calculate pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = blogData?.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = blogData?.length ? Math.ceil(blogData.length / postsPerPage) : 1;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // blog description world limit set function
    const truncateBlogDescription = (info) => {
        return info?.length > 150 ? `${info.substring(0, 150)}...` : info;
    };

    // console.log('blogData', blogData);

    return (
        <>
            <header>
                <title>News & Blogs | Blurred Ego</title>
                <meta
                    name="description"
                    content="Explore the Blurred Ego blog for expert insights, industry news, and tips tailored to independent freight forwarders. Stay informed on logistics trends, best practices, and growth strategies within the global logistics network.
"
                />
            </header>
            <Layout>
                <section className="section position-relative lg:h-[460px]" style={{ backgroundColor: 'rgba(243, 243, 243, 1)' }}>
                    <div className="cnt-center position-relative container">
                        <div className="row h-52 sm:h-[460px]">
                            <div className="col-lg-6 col-md-7 max-md:py-10 flex flex-col justify-center">
                                <h6 className="color-brand-2 mb-15 wow animate__animated animate__fadeIn">Don’t miss the trending</h6>
                                <h2 className="color-primary-main mb-25 wow animate__animated animate__fadeIn">Latest News &amp; Blog</h2>
                                <p className="font-md-color-grey-900 wow animate__animated animate__fadeIn">
                                    Share discoveries on the world of Logistic, find curiosities about cargo services,
                                    <br className="d-none d-lg-block" />
                                    <span> produce insights on how intelligent agents work.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-right-blog" />
                </section>

                {/* News Section */}
                <div className="flex flex-col gap-8 pt-24">
                    <NewsFilter onFilterChange={setFilterBy} />
                    <section className="cnt-center container overflow-hidden">
                        <NewsCaracol LatestNews={latestNews} />
                    </section>
                    <section className={`cnt-center container overflow-hidden ${filteredNews.length > 0 ? 'pt-32' : 'pt-0'}  `}>
                        {/* News Slider */}
                        {filteredNews.length > 0 ? (
                            <NewsSliderBlog NewsBlogData={filteredNews} />
                        ) : (
                            <h1 className="text-center text-lg font-semibold text-gray-600">No news updates available at the moment. Please check back soon for the latest information.</h1>
                        )}
                    </section>
                </div>

                <section className="section mt-70">
                    <h2 className="my-4 text-center">Our Blogs</h2>
                    <div className="cnt-center container">
                        <div className="row flex justify-evenly">
                            {dummyNews?.map((post) => (
                                <div key={post.id} className="wow animate__animated animate__fadeIn mb-2 md:w-[45%] lg:w-[24%]">
                                    <Link href={`/pages/blogs/${post?.attributes?.slug}`} className="card-blog-grid hover-up flex h-full flex-col">
                                        <div className="card-image flex-grow-0">
                                            <img
                                                className="" // Ensures same width and height for all images, object-cover keeps aspect ratio
                                                style={{ height: '240px', width: '100%', objectFit: 'cover' }}
                                                src={`${post?.attributes?.coverImage?.data?.attributes?.url}`}
                                                alt={post?.attributes?.title}
                                            />
                                        </div>
                                        <div className="card-info flex flex-grow flex-col justify-between p-3">
                                            <div>
                                                <h5 className="color-primary-main">{post?.attributes?.title}</h5>

                                                <p className="font-sm color-grey-500 ">{truncateBlogDescription(post?.attributes?.description)}</p>
                                            </div>
                                            <div>
                                                <div className="line-border" />
                                                <div className="d-flex align-items-center justify-content-between mt-5 pt-0">
                                                    <Link className="btn btn-link-brn font-sm" href={`/pages/blogs/${post?.id}`}>
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
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className="wow animate__animated animate__fadeIn mt-40 text-center">
                            <nav className="box-pagination">
                                <ul className="pagination">
                                    <li className="page-item">
                                        <button className="page-link page-prev" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}></button>
                                    </li>
                                    {[...Array(totalPages || 1)]?.map((_, index) => (
                                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button className="page-link rounded p-2 px-3 hover:bg-red-500" onClick={() => paginate(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className="page-item">
                                        <button className="page-link page-next" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}></button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
}
