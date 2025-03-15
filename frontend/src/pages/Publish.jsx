import axios from 'axios';
import React, { useState } from 'react'
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const Publish = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState("")
    const [category, setCategory] = useState('')

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file)); // Create preview URL
        }
    };


    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file)); // Create preview URL
        }
    };

    const publish = async () => {
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('videoFile', videoFile)
            formData.append("thumbnail", thumbnailFile)
            formData.append("title", title)
            formData.append("description", description)
            formData.append("tags", tags)
            formData.append("category", category)

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/video`, formData, { withCredentials: true })
            console.log(response.data?.msg)
            if (response.data?.msg) {
                toast.success(response.data?.msg)
                navigate('/home')
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }finally{
            setLoading(false)
        }
    }

    return <div className='flex bg-black min-h-screen'>
        <div className='p-10 mx-auto flex justify-center flex-col'>
            <h1 className='text-center mb-5'>Publish A Video</h1>
            <div className='flex flex-col p-2 w-[35vw]'>
                <label>Video File</label>
                <input required type="file" accept="video/*" className="file-input file-input-neutral mb-5" onChange={handleVideoChange} />
                {videoPreview && (
                    <video className="w-full h-full object-cover rounded-lg" controls>
                        <source src={videoPreview} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}

                <label>Thumbnail File</label>
                <input required type="file" accept="image/*" className="file-input file-input-neutral" onChange={handleThumbnailChange} />
                {thumbnailPreview && (
                    <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-10 w-full object-cover rounded-lg" />
                )}

                <label>Title</label>
                <input className="p-4 border-1 border-white border-b rounded-xl mb-2 mt-2 focus:outline-none" onChange={e => setTitle(e.target.value)} required />

                <label>Description</label>
                <textarea className="p-3 border-1 border-white border-b rounded-xl mb-2 mt-2 focus:outline-none min-h-40" required onChange={e => setDescription(e.target.value)} />

                <label>Tags</label>
                <input className="p-2 border-1 border-white border-b rounded-xl mb-2 mt-2 focus:outline-none" placeholder='Tech , Funny' required onChange={e => setTags(e.target.value)} />

                <label>Category</label>
                <input className="p-2 border-1 border-white border-b rounded-xl mb-2 mt-2 focus:outline-none" required placeholder="Tech , Funny , Sketch" onChange={e => setCategory(e.target.value)} />

                <button type="submit" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl mt-5" onClick={publish}>{loading ?
                    <div className='flex items-center gap-3'>
                        <h1>Publishing</h1>
                        <span className="loading loading-spinner loading-sm"></span>
                    </div>
                    :
                    `Publish`
                }</button>
            </div>
        </div>
    </div>
}

export default Publish