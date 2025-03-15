import React, { useContext, useEffect } from "react"
import Videos from "./Videos"
import { Link, useNavigate } from "react-router-dom"
import { context } from "./Context"
import VideoLoader from "./VideoLoader"
import axios from "axios"
const SuggestedVideos = ({ tags, currentVideoId }) => {
    const navigate = useNavigate()
    const fetchSuggestedVideos = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/video/suggest/suggested/videos`,
                { _id: currentVideoId, tags },
                { withCredentials: true }
            );
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchSuggestedVideos()
    }, [])


    return (
        // <>
        //     {videos.length > 0 ?
        //         <div className='flex gap-2 flex-col'>
        //             {videos.filter(x => x._id !== currentVideo).map(each => (
        //                 <div
        //                     className="w-64 rounded-lg shadow-lg bg-white overflow-hidden hover:cursor-pointer mb-5 mx-5"
        //                     key={each._id}
        //                     onClick={() => navigate(`/video/${each._id}`)}
        //                 >
        //                     <div className="relative h-36 w-full">
        //                         <img
        //                             src={each.thumbnail}
        //                             className="w-full h-full object-cover"
        //                             alt="Thumbnail"
        //                         />
        //                         <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-1 rounded">
        //                             {each.duration}
        //                         </span>
        //                     </div>

        //                     <div className="flex p-4">
        //                         <div className="rounded-full h-10 w-10 overflow-hidden mr-4">
        //                             <img src={each.owner?.avatar} alt="Avatar" className="object-cover w-full h-full" />
        //                         </div>
        //                         <div>
        //                             <h3 className="text-gray-900 truncate w-44">{each.title}</h3>
        //                             <div className="flex items-center text-gray-600 text-sm mt-1">
        //                                 <Link to="#" className="truncate">{each.owner.username}</Link>
        //                             </div>
        //                             <p className="text-gray-500 text-xs">{each.views} Views</p>
        //                         </div>
        //                     </div>
        //                 </div>
        //             ))}
        //         </div> :
        //         <VideoLoader />
        //     }
        // </>
        <h1>hello</h1>
    )
}
export default SuggestedVideos