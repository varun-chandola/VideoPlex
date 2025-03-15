import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import toast from "react-hot-toast"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`, {
        username,
        password,
      }, { withCredentials: true })

      console.log(response.data)
      if (response.data.message?.data == "Login Successful") {
        setLoading(false)
        toast.success(`${response.data.message?.data}`)
        localStorage.setItem('token', response.data.message?.token)
        navigate('/home')
      }

    } catch (error) {
      setLoading(false)
      toast.error(error.response.data.message)
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='font-bold text-xl mb-2'>Login</h1>
        <form className='w-[50vw]' onSubmit={e => handleLogin(e)}>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input type="text" className="grow" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
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
            <input type="password" className="grow" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>
          <button className={`btn btn-info w-full mt-5 ${loading ? `bg-blue-300` : ``}`}>
            {loading ?
              <div className='flex justify-center items-center gap-2'>
                <span className="">Logging In</span>
                <span className="loading loading-spinner loading-sm"></span>
              </div> : `Login`}
          </button>
        </form>
        <h1 className='flex w-1/2 mt-5'>New User ? <span className='ml-2 text-blue-400 underline hover:cursor-pointer' onClick={() => navigate('/')}>Create Account</span></h1>
      </div>
    </>
  )
}

export default Login