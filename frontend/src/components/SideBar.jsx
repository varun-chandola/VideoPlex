import React, { useContext, useState } from 'react'
import Navbar from './Navbar'
import { context } from './Context'
import { useLocation, useNavigate } from 'react-router-dom'

const SideBar = () => {
  const { toggle } = useContext(context)
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState('home')
  const location = useLocation()
  return (
    <>
      <div className="flex flex-col bg-gray-800 sticky">
        <div className={`flex mt-3 mb-3 mx-2  p-3 gap-5 items-center hover:bg-gray-700 rounded-xl cursor-pointer active:bg-gray-900 ${location.pathname.includes('home') ? `bg-gray-900` : ``}`} onClick={() => navigate('/home')}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='bg-white rounded-xl p-1'>
            <path d="M3 10L12 3L21 10V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V10Z" stroke="black" strokeWidth="2" />
            <path d="M9 21V12H15V21" stroke="black" strokeWidth="2" />
          </svg>
          {toggle ? <p className='font-bold'>Home</p> : <></>}
        </div>


        <div className={`flex mt-3 mb-3 mx-2  p-3 gap-5 items-center hover:bg-gray-700 rounded-xl cursor-pointer active:bg-gray-900 ${location.pathname.includes('subscriptions') ? `bg-gray-900` : ``}`} onClick={() => navigate('/subscriptions')}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='bg-white rounded-xl p-1'>
            <path d="M20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8Z" stroke="black" strokeWidth="2" />
            <path d="M9.5 16L15.5 13L9.5 10V16Z" fill="black" />
            <path d="M16 6L18 4M8 6L6 4" stroke="black" strokeWidth="2" />
          </svg>
          {toggle ? <p className='font-bold'>Subscriptions</p> : <></>}
        </div>


        <div className={`flex mt-3 mb-3 mx-2  p-3 gap-5 items-center hover:bg-gray-700 rounded-xl cursor-pointer active:bg-gray-900 ${location.pathname.includes('profile') ? `bg-gray-900` : ``}`} onClick={() => navigate("/profile")}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='bg-white rounded-xl p-1'>
            <circle cx="12" cy="8" r="4" stroke="black" strokeWidth="2" />
            <path d="M4 20C4 16.69 7.69 14 12 14C16.31 14 20 16.69 20 20" stroke="black" strokeWidth="2" />
          </svg>
          {toggle ? <p className='font-bold'>You</p> : <></>}
        </div>


        <div className={`flex mt-3 mb-3 mx-2  p-3 gap-5 items-center hover:bg-gray-700 rounded-xl cursor-pointer active:bg-gray-900 ${location.pathname.includes('history') ? `bg-gray-900` : ``} `} onClick={() => navigate('/history')}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='bg-white rounded-xl p-1'>
            <path d="M12 7V12L15 15" stroke="black" strokeWidth="2" />
            <path d="M3 12C3 7.58 7.03 4 12 4C16.97 4 21 7.58 21 12C21 16.42 16.97 20 12 20C7.03 20 3 16.42 3 12Z" stroke="black" strokeWidth="2" />
            <path d="M1 1L5 5" stroke="black" strokeWidth="2" />
          </svg>
          {toggle ? <p className='font-bold'>History</p> : <></>}
        </div>


        <div className={`flex mt-3 mb-3 mx-2  p-3 gap-5 items-center hover:bg-gray-700 rounded-xl cursor-pointer active:bg-gray-900 ${location.pathname.includes('likes') ? `bg-gray-900` : ``}`} onClick={() => navigate("/likes")}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='bg-white rounded-xl p-1'>
            <path d="M7 22H4C3.45 22 3 21.55 3 21V11C3 10.45 3.45 10 4 10H7" fill="black" />
            <path d="M21.65 11.1C21.35 10.44 20.7 10 20 10H14.34L15.2 5.76C15.32 5.23 15.1 4.68 14.67 4.39L14 4L8.67 10.26C8.24 10.68 8 11.32 8 12V19C8 19.55 8.45 20 9 20H17.53C18.06 20 18.5 19.62 18.65 19.11L21.47 12.3C21.7 11.68 21.6 11.06 21.65 11.1Z" fill="black" />
          </svg>
          {toggle ? <p className='font-bold'>Likes</p> : <></>}
        </div>
      </div >
    </>
  )
}

export default SideBar