import React, { useContext, useEffect } from 'react'
import SideBar from './SideBar'
import VideoLoader from './VideoLoader'
import axios from 'axios'
import { context } from './Context'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Videos = () => {
    const { videos, setVideos } = useContext(context)
    const navigate = useNavigate()
    const fetchAllVideos = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/videos/`, { withCredentials: true })
            setVideos(response.data?.allVideos)
        } catch (error) {
            if ((error.response?.data.error).includes('Unauthorized')) {
                navigate('/login')
                toast.error('Unauthorized')
            }
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllVideos()
    }, [])
    return (
        <>
            <div className='flex'>
                <SideBar />
                {console.log(videos)}
                {videos.length > 0 ?
                    <div className='flex gap-2 flex-wrap'>
                        {videos.map(each => (
                            <div className="card bg-black p-3 w-96 shadow-xl hover:cursor-pointer h-80 mx-5 mb-3" key={each._id} onClick={() => navigate(`/video/${each._id}`)}>
                                <figure className="h-52 relative">
                                    <img
                                        src={each.thumbnail}
                                        className="rounded-xl"
                                        alt="Thumbnail"
                                    />
                                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                                        {each.duration}
                                    </span>
                                </figure>

                                <div className="gap-5 p-4 flex">
                                    <div className="avatar">
                                        <div className="w-12 rounded-full">
                                            <img src={each.owner?.avatar} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3>{each.title}</h3>
                                    </div>
                                </div>
                                <div className='flex mx-12'>
                                    <div className='flex gap-4 justify-between'>
                                        <Link className='hover:text-white hover:underline'>👤{each.owner.username}</Link>
                                        <p>{each.views} Views</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    :
                    <VideoLoader />
                }
            </div >
        </>
    )
}

export default Videos