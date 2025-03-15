import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { formatDuration } from '../utils/formatDuration'

export default function Channel() {
    const [yourVideos, setYourVideos] = useState([])
    const fetchUserVideos = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/you/channel`, { withCredentials: true })
            setYourVideos(response.data?.yourVideos)
            console.log(response.data?.yourVideos)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUserVideos()
    }, [])

    const navigate = useNavigate()
    return (
        <div className="bg-black min-h-screen pt-10">
            <div className="mx-10">
                <h1 className="text-xl font-bold flex justify-center mb-6">
                    Your Videos
                </h1>

                <div className="flex flex-wrap gap-6">
                    {yourVideos?.map(video => (
                        <div
                            key={video?._id}
                            className="rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 w-1/4 cursor-pointer"
                        >
                            <div className="relative" onClick={() => navigate(`/watch/${video?._id}`)}>
                                <img
                                    src={video?.thumbnail}
                                    alt={video?.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                                    {formatDuration(video?.duration)}
                                </div>
                            </div>
                            <div className='flex mt-5 gap-4 flex-col'>
                                <div className='flex items-center mt-2 flex-col'>
                                    <p className="text-white h-16">{video?.title}</p>
                                    <p>{(video && video?.isPublished) ? `Published` : `Unpublished`}</p>
                                </div>
                                <button className='btn bg-gray-800' onClick={() => navigate(`/${video?._id}/update`)}>update video details</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}