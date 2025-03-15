import React, { createContext, useEffect, useState } from 'react'
export const context = createContext()


const Context = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true)
    const [subscriptions, setSubscriptions] = useState([[{
        _id: 1,
        channel: {
            avatar: "https://res.cloudinary.com/da2fioulc/image/upload/v1738252225/pjbrwhinxhd6w9kx0wga.jpg",
            fullName: <span className="loading loading-spinner loading-sm"></span>
        }
    }, {
        _id: 2,
        channel: {
            avatar: "https://res.cloudinary.com/da2fioulc/image/upload/v1738252225/pjbrwhinxhd6w9kx0wga.jpg",
            fullName: <span className="loading loading-spinner loading-sm"></span>
        }
    }]])

    return (
        <context.Provider value={{ isSidebarOpen, subscriptions, setSubscriptions, setSidebarOpen }}>
            {children}
        </context.Provider>
    )
}

export default Context