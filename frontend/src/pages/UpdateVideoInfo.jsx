import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom'

const UpdateVideoInfo = () => {
    const { videoId } = useParams()
    const [showcaseThumbnail, setShowcaseThumbnail] = useState(null)
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [originalThumbnail, setOriginalThumbnail] = useState(null)
    const [publishStatus, setPublishStatus] = useState(true)
    const [thumbnail, setThumbnail] = useState(null)

    const [titlePlaceholder, setTitlePlaceholder] = useState('')
    const [categoryPlaceholder, setCategoryPlaceholder] = useState('')
    const [descriptionPlaceholder, setDescriptionPlaceholder] = useState('')

    const navigate = useNavigate()
    const getVideoDetails = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/video/${videoId}/details`, { withCredentials: true })
            console.log(response.data?.videoDetails)
            setPublishStatus(response.data?.videoDetails?.isPublished)
            setTitlePlaceholder(response.data?.videoDetails?.title)
            setOriginalThumbnail(response.data?.videoDetails?.thumbnail)
            setCategoryPlaceholder(response.data?.videoDetails?.category)
            setDescriptionPlaceholder(response.data?.videoDetails?.description)
        } catch (error) {
            console.log(error)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
            setThumbnail(file)
            setShowcaseThumbnail(URL.createObjectURL(file));
        }
    }

    const handleVideoUpdates = async () => {
        try {
            setLoading(true)
            if (thumbnail != "" && thumbnail != null && thumbnail instanceof File) {
                const formData = new FormData()
                formData.append('title', title)
                formData.append('description', description)
                formData.append('category', category)
                formData.append('thumbnail', thumbnail)
                formData.append('isPublished', publishStatus)

                const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/video/${videoId}`, formData, {
                    withCredentials: true
                })
                console.log(response.data?.msg)
                toast.success(response.data?.msg)
                setShowcaseThumbnail(null)
                setLoading(false)
                getVideoDetails()
            } else {
                const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/video/${videoId}`, {
                    title,
                    description,
                    category,
                    isPublished: publishStatus,
                }, { withCredentials: true })
                console.log(response.data?.msg)
                toast.success(response.data?.msg)
                setLoading(false)
                getVideoDetails()
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const deleteVideo = async () => {
        try {
            setDeleteLoading(true)
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/video/${videoId}`, { withCredentials: true })
            toast.success(response.data?.msg)
            navigate('/home')
        } catch (error) {
            console.log(error)
            setDeleteLoading(false)
        } finally {
            setDeleteLoading(false)
        }
    }

    useEffect(() => {
        getVideoDetails()
    }, [])

    return (
        <div className='bg-black min-h-screen'>
            <div className='flex justify-center flex-col mx-auto w-1/2'>
                <label className='mt-4'>Title</label>
                <input
                    className='p-2 rounded-xl mt-2 text-xl font-bold'
                    placeholder={titlePlaceholder}
                    onChange={e => setTitle(e.target.value)}
                /><br />

                <label className='mt-2 mb-2'>Thumbnail</label>
                <img src={originalThumbnail} className='h-70 rounded-xl' />

                <label className='mt-4'>Category</label>
                <input className='p-2 rounded-xl mt-2 text-xl font-bold' onChange={e => setCategory(e.target.value)} placeholder={categoryPlaceholder} /><br />

                <label>Description</label>
                <textarea className='p-2 rounded-xl mt-2 text-xl min-h-36' onChange={e => setDescription(e.target.value)} placeholder={descriptionPlaceholder} /><br />

                <label>Video Status</label>
                <select className='p-2 mt-2 mb-2 rounded-xl' onChange={e => setPublishStatus(e.target.value === "true" ? true : false)}>
                    <option value="#">Select</option>
                    <option value={"true"}>Published</option>
                    <option value={"false"} >Unpublish</option>
                </select>

                {showcaseThumbnail && (
                    <img src={showcaseThumbnail} alt="Preview" className="mt-4 h-70 object-cover rounded-xl shadow" />
                )}

                <label className='mb-2'>Select New Thumbnail</label>
                <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered file-input-md w-full"
                    onChange={handleFileChange}
                />

                <button onClick={handleVideoUpdates} className='mt-5 mb-5 btn text-xl p-2 bg-[#212121]'>{loading ?
                    <div className='flex items-center mx-auto justify-center'>
                        <p className='text-l'>Updating...</p>
                        <span className="loading loading-spinner loading-sm"></span>
                    </div>
                    : "Update Video Details"}
                </button>

                <button onClick={deleteVideo} className='text-white btn bg-red-700 hover:bg-red-900 text-xl'>
                    {deleteLoading ?
                        <div className='flex items-center mx-auto justify-center'>
                            <p className='text-l'>Deleting...</p>
                            <span className="loading loading-spinner loading-sm"></span>
                        </div>
                        :
                        <Trash2 />
                    }
                </button>
                <p className='p-2 mb-4'>*instead of deleting the video , make the video status as <span className='text-white font-bold'>unpublish</span></p>
            </div>
        </div >
    );

}
export default UpdateVideoInfo