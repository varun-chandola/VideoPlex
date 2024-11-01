import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast'
const App = () => {
  // username, password, email, fullName
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [loading, setLoading] = useState(false)


  const navigate = useNavigate()
  const handleRegister = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      formData.append('email', email)
      formData.append('fullName', fullName)
      formData.append('avatar', avatar)
      formData.append('coverImage', coverImage)

      const response = await axios.post(`http://localhost:8000/api/v1/users/register`, formData, { withCredentials: true })
      if (response.data.message == "Account Created Successfully") {
        setLoading(false)
        toast.success(response.data.message)
        localStorage.setItem('token', response.data?.user?.token)
        navigate('/home')
      }
    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data.message)
      console.log(error)
    } finally {
      setLoading(false)
    }

  }
  return (
    <>
      <div className='w-1/2 flex flex-col justify-center m-auto h-screen gap-2'>
        <h1 className='flex items-center justify-center mb-4 font-bold text-2xl'>Register To VideoPlex</h1>
        <form onSubmit={e => handleRegister(e)}>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input type="text" required className="grow" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input type="text" required className="grow" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input type="text" required className="grow" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd" />
            </svg>
            <input type="password" required className="grow" placeholder="**********" value={password} onChange={e => setPassword(e.target.value)} />
          </label>
          <label>
            Avatar
            <input type="file" required className="file-input file-input-bordered w-full" onChange={e => setAvatar(e.target.files[0])} />
          </label>
          <label>
            Cover Image
            <input type="file" className="file-input file-input-bordered w-full" onChange={e => setCoverImage(e.target.files[0])} />
          </label>
          <button className="btn btn-info w-full mt-5">
            {loading ? <span class="loading loading-spinner loading-md"></span> : `Register`}
          </button>
        </form>
        <p className='mt-3'>Already a user ? <Link className='text-blue-400 underline hover:cursor-pointer' to='/login'>Login</Link></p>
      </div>
    </>
  )
}

export default App