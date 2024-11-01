import React, { useContext, useState } from 'react'
import { context } from './Context'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
const Navbar = () => {
    const { toggle, setToggle } = useContext(context)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleLogout = () => {
        try {
            setLoading(true)
            if (localStorage.getItem('token')) {
                const response = axios.post(`http://localhost:8000/api/v1/users/logout`, {}, { withCredentials: true })
                localStorage.removeItem('token')
                setLoading(false)
                toast.success('Logout')
                navigate('/login')
            }
        } catch (error) {
            console.log('FE logout error', error)
        }
    }
    return (
        <>
            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    <div className="dropdown" onClick={() => setToggle(prev => !prev)}>
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="navbar-center">
                    <a className="btn btn-ghost text-xl" href='/home'>VideoPlex</a>
                </div>
                <div className="navbar-end">
                    <button className="btn btn-ghost btn-circle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <button className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="badge badge-xs badge-primary indicator-item"></span>
                        </div>
                    </button>
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn m-1">
                        <div className="w-10 hover:cursor-pointer rounded-full">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><a onClick={handleLogout}>{loading ? <span className="loading loading-spinner loading-md"></span> : `Logout`}</a></li>
                        <li><Link to='/profile'>Publish Video</Link></li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Navbar