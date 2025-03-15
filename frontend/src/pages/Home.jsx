import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getRelativeTime } from '../utils/getRelativeTime.js';
import { formatDuration } from "../utils/formatDuration.js"

export default function HomePage() {
    const [videos, setVideos] = useState([])
    const [categories, setCategories] = useState()
    const [selectedCategory, setSelectedCategory] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(3)
    const [totalPages, setTotalPages] = useState();

    const pages = Math.ceil(totalPages / limit)
    const navigate = useNavigate()


    const uniqueCategories = [...new Set(categories?.flatMap(each => each?.category?.split(",").map(cat => cat.trim())))];

    const fetchAllVideos = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/video?page=${page}&limit=${limit}`, {
                withCredentials: true
            });
            console.log('all videos')
            console.log(response.data)
            setVideos(response.data?.allVideos);
            setTotalPages(response.data?.totalVideosCount)
        } catch (error) {
            console.log(error);
        }
    };


    const fetchAllCategories = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/video/categories`, {
                withCredentials: true
            })
            console.log(response?.data)
            setCategories(response.data?.categories)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchVideosFromCategory = async (categoryName) => {
        try {
            if (categoryName != "" || categoryName != null || categoryName !== undefined) {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/video/${categoryName}/videos`, {
                    withCredentials: true
                })
                console.log(response)
                setVideos(response?.data?.allVideosInThisCategory)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllVideos()
    }, [page])

    useEffect(() => {
        fetchAllCategories()
    }, [])
    console.log('category name : ', selectedCategory)

    useEffect(() => {
        fetchVideosFromCategory(selectedCategory)
    }, [selectedCategory])


    return (
        <>
            <div className="bg-black text-dark-100 flex flex-col">
                <div className='flex'>
                    <div className="flex flex-1">
                        {/* Main Content */}
                        <main className="flex-1 p-4">
                            {/* Categories */}
                            <div className="mb-6 w-[70vw] overflow-x-auto pb-2 sticky top-14 bg-black z-10 pt-2">
                                <div className="flex space-x-2 items-center">
                                    <button className="px-3 py-1.5 whitespace-nowrap bg-gray-700 text-gray-100 hover:bg-white hover:text-black" onClick={() => {
                                        setSelectedCategory('')
                                        fetchAllVideos()
                                    }}>All</button>
                                    {uniqueCategories.map((cat, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                fetchVideosFromCategory(cat);
                                            }}
                                            className={`px-3 py-1.5 whitespace-nowrap bg-gray-700 text-gray-100 hover:bg-white hover:text-black ${selectedCategory === cat ? 'bg-white text-gray-900 font-medium' : ''
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}

                                </div>
                            </div>

                            {/* Video Grid */}
                            <h2 className="text-xl font-bold mb-4">Recommended videos</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[66vh]">
                                {videos.map((video) => (
                                    <div key={video?._id} className="rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200" >
                                        <div className="relative" onClick={() => navigate(`/watch/${video?._id}`)}>
                                            <img
                                                loading="lazy"
                                                src={`${video?.thumbnail}?f_auto&q_auto`}
                                                alt={video?.title}
                                                className="w-full h-48 object-cover hover:cursor-pointer"
                                            />
                                            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                                                {formatDuration(video?.duration)}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-dark-800">
                                            <div className="flex">
                                                <img
                                                    src={video?.owner?.avatar}
                                                    alt="Channel avatar"
                                                    className="w-9 h-9 rounded-full mr-3"
                                                />
                                                <div>
                                                    <h3 className="font-medium line-clamp-2">{video?.title}</h3>
                                                    <Link to={`/channel/${video?.owner?._id}`} className="text-sm text-dark-300 mt-1 hover:text-white">{video?.owner?.username}</Link>
                                                    <p className="text-xs text-dark-300">{video.views} views • {getRelativeTime(video?.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* pages buttons */}
                            <div className="flex justify-center gap-2 mt-4">
                                {pages && [...Array(pages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setPage(index + 1)}
                                        className={`px-4 py-2 ${page === index + 1 ? "bg-[#212121] text-white" : ""}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    )
}