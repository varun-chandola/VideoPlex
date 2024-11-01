import React, { useEffect, useState } from 'react'
import SideBar from './SideBar'
import Navbar from './Navbar'
import VideoLoader from './VideoLoader'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import VideoPlayer from './VideoPlayer'
import SuggestedVideos from "./SuggestedVideos"

const Video = () => {
    const { videoId } = useParams()
    const [videoDetails, setVideoDetails] = useState('')
    const fetchVideo = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/videos/${videoId}`, { withCredentials: true })
            console.log(response.data?.video)
            setVideoDetails(response.data?.video)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchVideo()
    }, [videoId])

    return (
        <>
            <Navbar />
            <div className='flex'>
                <SideBar />
                {videoDetails ?
                    <div className='flex'>
                        <div className='w-[1100px] max-w-[1100px] mx-3'>
                            <VideoPlayer videoURL={videoDetails?.videoFile} />
                            <div className=''>
                                <h1 className='font-bold text-xl mx-7 mt-5'>{videoDetails?.title}</h1>
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <div className="flex items-center gap-2 mx-7 mt-5">
                                        <div className="avatar">
                                            <div className="w-12 rounded-full">
                                                <img src={`${videoDetails?.owner.avatar}`} />
                                            </div>
                                        </div>
                                        <h2 className="text-xl font-bold">{videoDetails?.owner.username}</h2>
                                    </div>
                                    <div className="flex items-center gap-5 mx-7 mt-5">
                                        <button className="p-2 rounded-xl bg-white text-black">Subscribe</button>
                                        <button className="btn btn-active">Like</button>
                                        <p>0 Likes</p>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-gray-400 rounded-xl text-black p-2 m-7'>
                                <h1 className='font-bold text-xl'>{videoDetails?.views} views</h1>
                                <div>
                                    <p>{videoDetails?.description}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <SuggestedVideos currentVideo={videoId} />
                        </div>
                    </div>
                    : <VideoLoader />
                }
                <div></div>
            </div >
        </>
    )
}

export default Video