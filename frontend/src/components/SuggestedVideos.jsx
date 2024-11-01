import React, { useContext, useEffect } from "react"
import Videos from "./Videos"
import { Link, useNavigate } from "react-router-dom"
import { context } from "./Context"
import VideoLoader from "./VideoLoader"
import axios from "axios"
const SuggestedVideos = ({ currentVideo }) => {
    const { videos, setVideos } = useContext(context)
    const navigate = useNavigate()
    const fetchAllVideos = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/videos/`, { withCredentials: true })
            setVideos(response.data?.allVideos)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllVideos()
    }, [])
    return (
        <>
            {videos.length > 0 ?
                <div className='flex gap-2 flex-col'>
                    {videos.filter(x => x._id !== currentVideo).map(each => (
                        <div className="card bg-black p-3 w-96 shadow-xl hover:cursor-pointer h-auto mx-2" key={each._id} onClick={() => navigate(`/video/${each._id}`)}>
                            <div className="">
                                <figure className="h-40">
                                    <img
                                        src={each.thumbnail}
                                        className='rounded-xl'
                                        alt="Thumbnail" />
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
                            </div>
                        </div>
                    ))}
                </div> :
                <VideoLoader />
            }
        </>
    )
}
export default SuggestedVideos