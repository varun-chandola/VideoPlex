import React, { useState } from 'react'
import Navbar from './Navbar'
import SideBar from './SideBar'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'


const Profile = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token)

  const [videoFile, setVideoFile] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState("")

  const publishVideo = async (e) => {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('videoFile', videoFile)
    formData.append("thumbnail", thumbnail)

    e.preventDefault()
    try {
      setLoading(true)
      console.log(formData)
      const response = await axios.post(`http://localhost:8000/api/v1/videos/`, formData, {
        withCredentials: true
      })
      if (response.data.msg.includes('published')) {
        setLoading(false)
        toast.success(response.data.msg)
        navigate('/home')
      }
    } catch (error) {
      if ((error.response?.data.error).includes('Unauthorized')) {
        navigate('/login')
        toast.error('Unauthorized')
    }
      setLoading(false)
      toast.error(error.response.data.message)
    }
    finally {
      setLoading(true)
    }
  }

  return (
    <>
      <Navbar />
      <div className='flex h-[100vh]'>
        <SideBar />
        <div className='flex flex-col m-auto'>
          <h1 className='font-bold text-xl text-center mb-3'>Hey ! @{decoded?.username}</h1>
          <form className='rounded-xl p-5 bg-gradient-to-r from-cyan-500 to-blue-500 max-w-[50vw] w-[50vw]' onSubmit={e => publishVideo(e)}>
            <h1 className='text-center font-bold text-xl mb-5 text-black'>Publish A Video</h1>

            <label className='text-black'>Select Thumbnail</label><br />
            <input type="file" required onChange={e => setThumbnail(e.target.files[0])} className="file-input file-input-bordered file-input-md w-full" /><br />

            <label className='text-black'>Select Video File</label><br />
            <input type="file" required onChange={e => setVideoFile(e.target.files[0])} className="file-input file-input-bordered file-input-md w-full" /><br />

            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="input input-bordered w-full mt-3 " required />
            <br />

            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description"
              className="textarea textarea-bordered textarea-md w-full mt-3"></textarea>

            <button className="btn btn-info mt-5 w-full bg-gray-900 text-white hover:bg-gray-800">
              {loading ? <span className="loading loading-spinner loading-md"></span> : `Publish`}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Profile