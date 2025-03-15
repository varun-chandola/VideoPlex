import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDuration } from '../utils/formatDuration.js'
import { HeartOff, MoreVertical } from "lucide-react"
import toast from "react-hot-toast"
const Likes = () => {
    const [likedVideos, setLikedVideos] = useState([])

    const navigate = useNavigate()
    const getUserLikedVideos = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/you/likedVideos`, {
                withCredentials: true
            })
            setLikedVideos(response.data?.videos)
            console.log(response.data?.videos)
        } catch (error) {
            console.log(error)
        }
    }

    const removeFromLikesVideos = async (videoId) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${videoId}/likedRemove`, {}, { withCredentials: true })
            toast.success(response.data?.msg)
            getUserLikedVideos()
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getUserLikedVideos()
    }, [])

    return (
        <>
            <div className='bg-black min-h-screen p-10'>
                <h1 className='text-center text-xl font-bold mb-5'>Liked Videos</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[66vh] bg-black">
                    {likedVideos?.map((video) => (
                        <div key={video?.video?._id} className="rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200 relative">
                            <div className="relative" onClick={() => navigate(`/watch/${video?.video?._id}`)}>
                                <img
                                    src={video?.video?.thumbnail}
                                    alt={video?.video?.title}
                                    className="w-full h-48 object-cover hover:cursor-pointer"
                                />
                                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                                    {formatDuration(video?.video?.duration)}
                                </div>
                            </div>
                            <div className="p-3 bg-dark-800 flex justify-between items-center">
                                <div className="flex">
                                    <img
                                        src={video?.video?.owner?.avatar}
                                        alt="Channel avatar"
                                        className="w-9 h-9 rounded-full mr-3"
                                    />
                                    <div>
                                        <h3 className="font-medium line-clamp-2">{video?.video?.title}</h3>
                                        <Link to={`/channel/${video?.video?.owner?._id}`} className="text-sm text-dark-300 mt-1 hover:text-white">
                                            {video?.video?.owner?.username}
                                        </Link>
                                    </div>
                                </div>
                                {/* Three Dot Menu */}
                                <div className="relative menu-container">
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromLikesVideos(video?.video?._id);
                                    }} className="p-2 rounded-full">
                                        <HeartOff size={20} strokeWidth={3} className='hover:text-white' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div >
        </>
    );

}

export default Likes