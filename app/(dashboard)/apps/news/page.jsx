'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GenericTable from '@/components/GenericTable';
import CreateNewsPop from '../../components/createNewsPop';
import EditNews from '../../components/NewsEdit';
import { FaEdit } from 'react-icons/fa';
import { isMemberManager } from '@/utils/helperFunctions';
import { FaRegNewspaper } from 'react-icons/fa';
import { dummyNews } from '@/Data/dummyNews'; // Import dummy data for testing
const NewsPage = () => {
    const [show, setShow] = useState(false);
    const [news, setNews] = useState(dummyNews);
    const [showNews, setShowNews] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const imgUrl = process.env.NEXT_PUBLIC_IMG_URL;

    const isManager = isMemberManager();

    const getAllBlogs = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/blogs?populate=*`);
            // sorting to show new blogs first
            const sortedBlogs = data.data.sort((a, b) => {
                const BlogDate1 = new Date(a?.attributes?.createdAt);
                const BlogDate2 = new Date(b?.attributes?.createdAt);
                return BlogDate2 - BlogDate1;
            });
            setNews(sortedBlogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    // useEffect(() => {
    //     getAllBlogs();
    // }, []);

    // console.log('news', news);
    const columns = [
        {
            field: 'coverImage',
            header: 'Cover Image',
            // width: 100,
            render: (params) => {
                console.log(params);
                return (
                    <div className="flex items-end justify-center">
                        {' '}
                        <img className="h-12  w-12 rounded-full" src={`${params?.attributes?.coverImage?.data?.attributes?.url}`} alt="cover" />
                    </div>
                );
            },
        },
        {
            field: 'newsUID',
            header: 'News ID',

            filterable: true,
            render: (params) => {
                // console.log(params);
                return <span>{params?.id}</span>;
            },
        },

        {
            field: 'categoryAtNews',
            header: 'Category',

            render: (params) => <span>{params?.attributes?.category?.data?.attributes?.title}</span>,
        },

        {
            field: 'newsTitle',
            header: 'News Title',

            render: (params) => <span>{params?.attributes?.title}</span>,
        },
        {
            field: 'edit',
            header: 'Edit News',
            render: (params) => {
                return (
                    <div className="flex items-end justify-center">
                        <FaEdit
                            onClick={() => {
                                setSelectedNews(params); // Pass the selected item data to the form
                                setShowNews(true);
                            }}
                            size={22}
                            color="blue"
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <title>News</title>
            <div
                style={{
                    marginBottom: '15px',
                    marginRight: '50px',
                    // textAlign: "right",
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'flex-end',
                }}
            >
                <button
                    type="button"
                    className={`flex items-center justify-center rounded 
                        bg-red-500 px-4 py-2
                     text-white hover:bg-red-400`}
                    onClick={() => setShow(true)}
                    // disabled={!isManager}
                    title={!isManager ? 'You do not have permission to create news' : 'Create News'}
                >
                    <FaRegNewspaper className="mr-2" color="white" size={20} /> Create News
                </button>
            </div>
            <div className="mt-4">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
                    <GenericTable columns={columns} data={news} />
                </div>
            </div>
            <CreateNewsPop show={show} setShow={setShow} />
            <EditNews show={showNews} setShow={setShowNews} newsData={selectedNews} />
        </div>
    );
};

export default NewsPage;
