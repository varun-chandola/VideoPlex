import React, { useContext } from 'react'
import { Search, Menu, Bell, User, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { context } from './Context';

const Navbar = () => {
    const { isSidebarOpen, setSidebarOpen } = useContext(context)
    return (
        <>
            <div className='flex flex-row sticky top-0 z-10'>
                <header className="py-2 px-4 w-full sticky top-0 z-50 bg-black flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-full hover:bg-dark-700 mr-4"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center">
                            <Film className="text-brand-red" size={28} />
                            <Link to='/home' className="ml-1 font-bold text-xl">ViewTube</Link>
                        </div>
                    </div>

                    <div className="flex-1 max-w-2xl mx-4 flex items-center">
                        <div className="relative flex-1 flex">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-dark-800 border border-dark-600 rounded-l-full py-2 px-4 focus:outline-none focus:border-dark-400"
                            />
                            <button className="bg-dark-700 px-5 rounded-r-full border border-dark-600 border-l-0 hover:bg-dark-600">
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="dropdown dropdown-hover mx-14">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center ml-2 hover:cursor-pointer">
                            <User size={20} />
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box p-2 shadow-sm z-10">
                            <li><Link to='/publish'>Publish</Link></li>
                        </ul>
                    </div>
                </header>
            </div>
        </>
    )
}

export default Navbar