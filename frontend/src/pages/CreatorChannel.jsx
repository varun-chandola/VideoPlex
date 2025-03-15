import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getRelativeTime } from "../utils/getRelativeTime.js"
import { useNavigate, useParams } from 'react-router-dom'
import { formatDuration } from '../utils/formatDuration.js'

const CreatorChannel = () => {
    const { channelId } = useParams()
    const [channelVideos, setChannelVideos] = useState([])
    const [channelInfo, setChannelInfo] = useState({
        avatar: "https://res.cloudinary.com/da2fioulc/image/upload/v1738252225/pjbrwhinxhd6w9kx0wga.jpg",
        bio: "bio",
        fullName: "name",
        username: "username"
    })
    const [section, setSection] = useState('videos')
    const [subCount, setSubCount] = useState('')
    const navigate = useNavigate()

    async function fetchCreatorInfo() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${channelId}`, {
                withCredentials: true
            })
            console.log(response.data)
            setChannelVideos(response.data?.channelVideos)
            setChannelInfo(response.data?.channelInfo)
            setSubCount(response.data?.subscribersCount)
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchCreatorInfo()
    }, [channelId])


    return (
        <div className='bg-black'>
            <div className='mx-10'>
                {/* banner */}
                <div className="w-full h-32 md:h-52 lg:h-60 xl:h-72 relative overflow-hidden">
                    <img
                        src="https://wallpapers.com/images/hd/banner-background-cud8ijirb5ni3b5w.jpg"
                        alt="Banner"
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
                {/* avatar and details */}
                <div className='flex items-center gap-4'>
                    <div className="w-36 h-36 rounded-full overflow-hidden mt-5">
                        <img
                            className="w-full h-full object-cover"
                            src={`${channelInfo?.avatar}`}
                            alt="Channel Avatar"
                        />
                    </div>
                    <div className=''>
                        <h1 className='font-bold text-3xl'>{channelInfo?.fullName}</h1>
                        <div className='flex gap-2'>
                            <p className='text-white'>@{channelInfo?.username} • </p>
                            <p>{subCount} subscribers •</p>
                            <p>{channelVideos?.length} videos</p>
                        </div>
                        <p>{channelInfo?.bio}</p>
                    </div>
                </div>
            </div>

            <div className='flex mx-10 gap-7 mt-10 mb-5'>
                <button value={'videos'} onClick={(e) => setSection(e.target.value)} className={`${section === "videos" ? "bg-[#212121] text-white p-2 rounded-xl" : ""}`}>Videos</button>

                <button value={'playlist'} onClick={(e) => setSection(e.target.value)} className={`${section === "playlist" ? "bg-[#212121] text-white p-2 rounded-xl" : ""}`}>Playlist</button>
            </div>
            <div className='mx-10'>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[66vh]">
                    {channelVideos?.map((video) => (
                        <div key={video?._id} className="rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200" onClick={() => navigate(`/watch/${video?._id}`)}>
                            <div className="relative">
                                <img
                                    src={video?.thumbnail}
                                    alt={video?.title}
                                    className="w-full h-48 object-cover hover:cursor-pointer"
                                />
                                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                                    {formatDuration(video?.duration)}
                                </div>
                            </div>
                            <div className="p-3 bg-dark-800">
                                <div className="flex">
                                    <div>
                                        <h3 className="font-medium line-clamp-2">{video?.title}</h3>
                                        <p className="text-xs text-dark-300">{video.views} views • {getRelativeTime(video?.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CreatorChannel