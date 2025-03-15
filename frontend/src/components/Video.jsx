import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"
import axios from 'axios'
import { BiLike } from "react-icons/bi";
import { AiFillLike } from "react-icons/ai";
import VideoPlayer from './VideoPlayer'
import { context } from './Context'
import toast from 'react-hot-toast';
import { Reply, Trash2, ArrowDown } from 'lucide-react';
import { getRelativeTime } from '../utils/getRelativeTime';
import VideoPlayerLoader from './VideoPlayerLoader'


const Video = () => {
    const { videoId } = useParams()
    const token = localStorage.getItem('token')
    const decoded = jwtDecode(token)

    const { setSubscriptions } = useContext(context)
    const [video, setVideo] = useState()
    const [loading, setLoading] = useState(false)
    const [subLoading, setSubLoading] = useState(false)
    const [commentLoading, setCommentLoading] = useState(false)
    const [replyLoading, setReplyLoading] = useState(false)
    const [loadingCommentId, setLoadingCommentId] = useState()

    const [replyBox, setReplyBox] = useState(false)
    const [replyBoxIndex, setReplyBoxIndex] = useState()


    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(4)
    const [repliesLimit, setRepliesLimit] = useState(2)
    const { isSidebarOpen } = useContext(context)

    const [commentContent, setCommentContent] = useState('')
    const [comments, setComments] = useState([])
    const [commentsCount, setCommentsCount] = useState()
    const [reply, setReply] = useState()
    const [videoLikes, setVideoLikes] = useState()
    const [likeStatus, setLikeStatus] = useState([])
    const [subStatus, setSubStatus] = useState()
    const [replies, setReplies] = useState([])
    const [fetchingRepliesForId, setFetchingRepliesForId] = useState()

    const fetchVideo = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/video/${videoId}`, { withCredentials: true })
            console.log(response.data)
            setVideo(response.data?.video)
            setCommentsCount(response.data?.video?.commentsCount)
            setVideoLikes(response.data?.video?.likesCount)
            setLikeStatus(response.data?.likeStatus)
            setSubStatus(response.data?.subStatus)
        } catch (error) {
            console.log(error)
            if ((error?.response?.data?.error)?.includes("unauthorized")) {
                toast.error(error?.response?.data?.error)
                navigate('/')
            }
        }
    }

    const like = async () => {
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/like/toggle/v/${videoId}`, {}, { withCredentials: true })
            console.log(response.data?.msg)
            toast.success(response.data?.msg)
            setVideoLikes(response.data?.likesCount?.likesCount)
            setLikeStatus(response.data?.likeStatus)
        } catch (error) {
            console.log(error)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/${videoId}/comments?page=${page}&limit=${limit}`, { withCredentials: true })
            console.log(response.data)
            setComments(response.data?.comments)
        } catch (error) {
            console.log(error)
        }
    }

    const addComment = async () => {
        setCommentLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/${videoId}/comment`, {
                comment: commentContent
            }, { withCredentials: true })

            toast.success(response.data?.msg)
            setCommentContent('')
            fetchComments()
            setCommentsCount(prev => prev + 1)
            setCommentLoading(false)
        } catch (error) {
            setCommentLoading(false)
            console.log(error)
            toast.error(error?.response?.data?.msg)
        } finally {
            setCommentLoading(false)
        }
    }

    const toggleSubscription = async (channelId) => {
        setSubLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/c/${channelId}`, {}, {
                withCredentials: true
            })
            setSubLoading(false)
            setSubStatus(response.data?.subStatus)
            toast.success(response.data?.msg)
        } catch (error) {
            setSubLoading(false)
            console.log(error?.response?.data?.msg)
            toast.error(error?.response?.data?.msg)
        } finally {
            setSubLoading(false)
        }
    }

    const showMore = () => {
        setLimit(prev => prev + 10)
    }

    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/c`, { withCredentials: true })
            console.log(response.data)
            setSubscriptions(response.data?.userSubscribedToChannels)
        } catch (error) {
            console.log(error)
            if ((error?.response?.data?.error).includes("unauthorized")) {
                toast.error(error?.response?.data?.error)
                navigate('/')
            }
        }
    }

    const deleteComment = async (commentId) => {
        setLoadingCommentId(commentId)
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/${videoId}/${commentId}/delete`, { withCredentials: true })
            toast.success(response.data?.msg)
            setCommentsCount(prev => prev - 1)
            fetchComments()
        } catch (error) {
            setLoadingCommentId('')
            console.log(error)
        } finally {
            setLoadingCommentId('')
        }
    }

    const addReply = async (commentId) => {
        setReplyLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/${videoId}/${commentId}/reply`, {
                reply
            }, { withCredentials: true })
            setReplyBoxIndex("")
            toast.success(response.data?.msg)
            setReply('')
            fetchComments()
        } catch (error) {
            setReplyBox(false)
            console.log(error)
        } finally {
            setReplyLoading(false)
        }
    }

    const fetchReplies = async (commentId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/${videoId}/${commentId}/replies`, {
                withCredentials: true
            })

            console.log(response.data?.replies)
            setReplies(response.data?.replies)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchVideo()
    }, [videoId])

    useEffect(() => {
        fetchComments()
    }, [limit])

    useEffect(() => {
        fetchReplies()
    }, [repliesLimit])

    useEffect(() => {
        fetchSubscriptions()
    }, [subStatus])

    return (
        <>
            <div className='flex bg-black'>
                <div className={`flex flex-col mt-4 transition-all duration-500 ease-in-out ${isSidebarOpen ? "ml-44" : "justify-center mx-auto"}`}>
                    <div className={``}>
                        <>
                            {video && video?.videoFile ?
                                <VideoPlayer videoURL={video?.videoFile} />
                                :
                                <VideoPlayerLoader />
                            }
                        </>
                        <div className=''>
                            <h1 className='font-bold text-xl mt-5'>{video?.title}</h1>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <div className="flex items-center gap-2 mt-5">
                                    <div className="avatar">
                                        <div className="w-12 rounded-full">
                                            {video?.owner?.avatar ?
                                                <img src={`${video?.owner?.avatar}`} />
                                                : <img src="https://res.cloudinary.com/da2fioulc/image/upload/v1738252225/pjbrwhinxhd6w9kx0wga.jpg" />
                                            }
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-semibold">{video?.owner?.username}</h2>
                                </div>
                                <div className="flex items-center gap-5 mx-7 mt-5 text-center">
                                    <button onClick={() => toggleSubscription(video?.owner?._id)} className="btn p-2 rounded-xl bg-white text-black hover:bg-gray-800 hover:text-white">
                                        {
                                            subLoading ?
                                                <div className='flex items-center'>
                                                    <span className="loading loading-spinner loading-sm"></span>
                                                </div>
                                                : (subStatus && subStatus?.length > 0 ? "Unsubscribe" : "Subscribe")
                                        }
                                    </button>
                                    <div className='flex justify-center items-center gap-2'>
                                        {
                                            likeStatus.length !== 0 ? <AiFillLike onClick={like} className='text-3xl hover:cursor-pointer hover:text-white' /> : <BiLike onClick={like} className='text-3xl hover:cursor-pointer hover:text-white' />
                                        }
                                        <p className='text-xl flex items-center'>
                                            {loading ?
                                                <span className="loading loading-spinner loading-sm"></span>
                                                : videoLikes}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='rounded-xl text-white p-2 mt-5 max-w-[750px] bg-[#272727]'>
                            <div className='flex gap-5'>
                                <h1 className='text-l mb-5'>{video?.views} views</h1>
                                {(video && video?.createdAt) ?
                                    <p >{getRelativeTime(video?.createdAt)}</p> : <></>}
                            </div>
                            <div className=''>
                                <p>{video?.description}</p>
                                {video?.tags?.map((each, index) => <p key={index} className='mt-2'>#{each}</p>)}
                            </div>
                        </div>
                    </div>
                    <form className='mt-5 max-w-[750px]' onSubmit={(e) => {
                        e.preventDefault()
                        addComment()
                    }}>
                        <h1 className='mb-5 font-bold'>Comments ({commentsCount})</h1>
                        <input required type="text" value={commentContent} onChange={e => setCommentContent(e.target.value)} placeholder="Add a Comment" className="input w-full mb-2" />
                        <button type="submit" className='btn bg-white text-black hover:bg-white'>{commentLoading ?
                            <div className='flex items-center gap-4'>
                                <p className='text-l'>Adding Comment </p>
                                <span className="loading loading-spinner loading-sm"></span>
                            </div>
                            : `Comment`}</button>
                    </form>

                    <div className='mt-5 min-h-[30vh]'>
                        {comments?.map((each, index) => (
                            <div key={each?._id} className='flex gap-5 mt-5'>
                                <div className="avatar">
                                    <div className="w-10 h-10 rounded-full">
                                        <img src={`${each?.commentOwner?.avatar}`} className="object-cover w-full h-full" />
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='flex gap-5'>
                                        <p>@{each?.commentOwner?.username}</p>
                                        <p>{getRelativeTime(each?.createdAt)}</p>
                                        {decoded && decoded?.username === each?.commentOwner?.username ? (
                                            loadingCommentId === each?._id ? (
                                                <div className="flex items-center">
                                                    <span className="loading loading-spinner loading-sm"></span>
                                                </div>
                                            ) : (
                                                <Trash2 onClick={() => deleteComment(each?._id)} className="hover:text-white hover:cursor-pointer" />
                                            )
                                        ) : null}

                                    </div>
                                    <p className='font-bold'>{each?.comment}</p>
                                    <div className='flex items-center gap-2'>
                                        <AiFillLike className='text-xl' />
                                        <p>{each?.likes}</p>
                                        <button className='mx-2 hover:text-white' onClick={() => {
                                            setReplyBoxIndex(index)
                                            setReplyBox(prev => !prev)
                                        }}>reply</button>
                                        {
                                            (index === replyBoxIndex) ?
                                                <form className='flex text-center items-center gap-4' onSubmit={e => {
                                                    e.preventDefault()
                                                    addReply(each?._id)
                                                }}>
                                                    <textarea value={reply} onChange={e => setReply(e.target.value)} className="textarea max-h-10" placeholder="reply" required></textarea>
                                                    {replyLoading ?
                                                        <div className='flex items-center gap-4'>
                                                            <span className="loading loading-spinner loading-sm"></span>
                                                        </div> : <button type="submit"><Reply className='hover:text-white hover:cursor-pointer' /></button>}
                                                </form>
                                                : <></>
                                        }
                                    </div>
                                    <div>
                                        <button className='btn mt-3 mx-5' onClick={() => {
                                            setFetchingRepliesForId(each?._id)
                                            fetchReplies(each?._id)
                                        }}><ArrowDown /> Replies</button>
                                    </div>
                                    <div>
                                        {each?._id === fetchingRepliesForId && replies?.map((each, index) => (
                                            <div key={each?._id} className="flex gap-5 mt-5">
                                                <div className="avatar">
                                                    <div className="w-10 h-10 rounded-full">
                                                        <img src={`${each?.commentOwner?.avatar}`} className="object-cover w-full h-full" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex gap-5">
                                                        <p className="font-semibold">@{each?.commentOwner?.username}</p>
                                                        <p className="text-sm text-gray-400">{getRelativeTime(each?.createdAt)}</p>
                                                    </div>
                                                    <p className="mt-1">{each?.comment}</p>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={showMore} className='mt-5 mb-5 hover:text-white hover:bg-[#212121] mx-auto p-2 rounded-sm'>show more</button>
                </div >
            </div >
        </>
    )
}

export default Video