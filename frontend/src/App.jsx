import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import toast from 'react-hot-toast'
const App = () => {
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const handleRegister = async (e) => {
    try {
      setLoading(true)
      e.preventDefault()
      const response = await axios.post(`${BACKEND_URL}/users/register`, {
        username,
        password,
        fullName
      }, { withCredentials: true })
      if (response.status(201)) {
        setLoading(false)
        toast.success(response.data?.message)
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
      <div className='w-1/3 flex flex-col justify-center m-auto h-screen gap-2'>
        <h1 className='flex items-center justify-center mb-4 font-bold text-2xl'>Register To StockPlex</h1>
        <form onSubmit={e => handleRegister(e)}>
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
            <input type="password" required className="grow" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </label>
          <button className={`btn ${loading ? `bg-blue-800 hover:bg-blue-700` : `btn-info`} w-full mt-5`}>
            {loading ?
              <div className='flex items-center'>
                <p className='text-l'>Registering...</p>
                <span className="loading loading-spinner loading-sm"></span>
              </div>
              : `Register`}
          </button>
        </form>
        <p className='mt-3'>Already a user ? <Link className='text-blue-400 underline hover:cursor-pointer' to='/login'>Login</Link></p>
      </div>
    </>
  )
}

export default App
