import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { formatDuration } from '../utils/formatDuration.js'
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([])
    const navigate = useNavigate()

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/watchHistory`, { withCredentials: true })
            console.log(response.data)
            setHistory(response.data?.userHistory?.watchHistory)
        } catch (error) {
            if ((error.response?.data.error).includes('Unauthorized')) {
                navigate('/login')
                toast.error('Unauthorized')
            }
            console.log(error)
        }

    }

    const clearWatchHistory = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/clearHistory`, {}, { withCredentials: true })
            console.log(response.data?.msg)
            toast.success(response.data?.msg)
            setHistory([])
        } catch (error) {
            console.log(error)
        }
    }

    const removeFromHistory = async (videoId) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/deleteFromHistory/${videoId}`, {}, { withCredentials: true })

            console.log(response.data)
            toast.success(response.data?.msg)
            setHistory(prev => prev.filter(each => each._id != videoId))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchHistory()
    }, [history?.length])

    return (
        <div className='bg-black min-h-screen p-10'>
            <h1 className='text-center text-xl font-bold mb-5'>History</h1>
            <div className='flex justify-center mb-5'>
                <button className='flex text-xl gap-2 btn bg-red-600 hover:bg-red-800 rounded-xl text-black' onClick={clearWatchHistory}>
                    Clear History
                    <Trash2 size={20} strokeWidth={3} />
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[66vh] bg-black">
                {history?.map((video) => (
                    <div key={video?._id} className="rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200 relative">
                        <div className="relative" onClick={() => navigate(`/watch/${video?._id}`)}>
                            <img
                                src={video?.thumbnail}
                                alt={video?.title}
                                className="w-full h-48 object-cover hover:cursor-pointer"
                            />
                            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                                {formatDuration(video?.duration)}
                            </div>
                        </div>
                        <div className="p-3 bg-dark-800 flex justify-between items-center">
                            <div className="flex">
                                <img
                                    src={video?.owner?.avatar}
                                    alt="Channel avatar"
                                    className="w-9 h-9 rounded-full mr-3"
                                />
                                <div>
                                    <h3 className="font-medium line-clamp-2">{video?.title}</h3>
                                    <Link to={`/channel/${video?.owner?._id}`} className="text-sm text-dark-300 mt-1 hover:text-white">
                                        {video?.owner?.username}
                                    </Link>
                                </div>
                            </div>
                            {/* Three Dot Menu */}
                            <div className="relative menu-container">
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromHistory(video?._id);
                                }} className="p-2 rounded-full">
                                    <Trash2 size={20} strokeWidth={3} className='hover:text-white' />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default History