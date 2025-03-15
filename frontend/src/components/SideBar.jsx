import React, { useContext, useEffect, useState } from 'react';
import { Search, Menu, Bell, User, Home, Compass, Clock, ThumbsUp, Film, Bookmark, Settings, HelpCircle, LogOut, Play, Sidebar } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { context } from './Context';
import { MdPlaylistAdd } from 'react-icons/md';
export default function SidebarPanel() {
  const { isSidebarOpen, setSidebarOpen, setSubscriptions, subscriptions } = useContext(context)

  const navigate = useNavigate()

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

  const logout = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`, {}, { withCredentials: true })

      if (response.data?.msg) {
        toast.success(response.data?.msg)
        localStorage.removeItem('token')
        navigate('/')
      }

    } catch (error) {
      console.log(error)
      if ((error?.response?.data?.error).includes("unauthorized")) {
        toast.error(error?.response?.data?.error)
        navigate('/')
      }
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  return (
    <>
      <div className={`bg-black h-auto text-dark-100 flex max-w-[20vw] transition-all duration-500 ease-in-out overflow-hidden ${isSidebarOpen ? "w-[240px]" : "w-[0px]"}`}>
        <div className="flex flex-1">
          {(
            <aside className="w-60 bg-dark-900 h-[calc(100vh-56px)] overflow-y-auto sticky">
              <div className="py-3 px-3">
                <div className="mb-4">
                  <Link className="flex items-center px-3 py-2 rounded-lg hover:bg-dark-700 text-dark-100 font-medium hover:bg-[#272727]" to='/home'>
                    <Home size={20} className="mr-4" />
                    <span>Home</span>
                  </Link>
                  <Link className="flex items-center px-3 py-2 rounded-lg text-dark-100 font-medium hover:bg-[#272727]" to='#'>
                    <Compass size={20} className="mr-4" />
                    <span>Explore</span>
                  </Link>
                </div>

                <div className="border-t border-dark-600 pt-3 mb-4">
                  <h3 className="px-3 mb-1 font-medium">You</h3>
                  <Link className="flex items-center px-3 py-2 rounded-lg hover:bg-[#272727] text-dark-100 font-medium" to='/you/channel'>
                    <User size={20} className="mr-4" />
                    <span>Your channel</span>
                  </Link>
                  <Link className="flex items-center px-3 py-2 rounded-lg hover:bg-[#272727] text-dark-100 font-medium" to='/history'>
                    <Clock size={20} className="mr-4" />
                    <span>History</span>
                  </Link>
                  <Link className="flex items-center px-3 py-2 rounded-lg hover:bg-[#272727] text-dark-100 font-medium" to='/likes'>
                    <ThumbsUp size={20} className="mr-4" />
                    <span>Liked videos</span>
                  </Link>
                  <Link className="flex items-center px-3 py-2 rounded-lg hover:bg-[#272727] text-dark-100 font-medium" to='#'>
                    <Bookmark size={20} className="mr-4" />
                    <span>Watch later</span>
                  </Link>
                  <Link className="flex items-center px-3 py-2 rounded-lg hover:bg-[#272727] text-dark-100 font-medium" to='/playlist'>
                    <MdPlaylistAdd size={20} className="mr-4" />
                    <span>Playlist</span>
                  </Link>
                </div>

                <div className="border-t border-dark-600 pt-3 mb-4">
                  <h3 className="px-3 mb-1 font-medium">Subscriptions</h3>
                  {subscriptions?.map((each, index) =>
                    <Link key={index} to={`/channel/${each?.channel?._id}`} className="flex items-center px-3 py-2 rounded-lg hover:bg-[#272727] text-dark-100 font-medium">
                      <img src={`${each?.channel?.avatar}`} className="w-6 h-6 rounded-full mr-4" />
                      <span>{each?.channel?.fullName}</span>
                    </Link>
                  )}
                </div>

                <div className="border-t border-dark-600 pt-3">
                  <h3 className="px-3 mb-1 font-medium">Settings</h3>
                  <Link to='/settings' className="flex items-center px-3 py-2 rounded-lg hover:bg-[#272727] text-dark-100 font-medium">
                    <Settings size={20} className="mr-4" />
                    <span>Settings</span>
                  </Link>
                  <Link to="#" className="flex items-center px-3 py-2 rounded-lg hover:bg-[#272727] text-dark-100 font-medium">
                    <HelpCircle size={20} className="mr-4" />
                    <span>Help</span>
                  </Link>
                  <a onClick={logout} className="flex items-center px-3 py-2 rounded-lg hover:bg-[#272727] text-dark-100 font-medium hover:cursor-pointer">
                    <LogOut size={20} className="mr-4" />
                    <span>Sign out</span>
                  </a>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div >
    </>
  )
}