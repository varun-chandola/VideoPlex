import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from "react-hot-toast"

const Settings = () => {
    const [userInfo, setuserInfo] = useState()
    const [username, setUsername] = useState('')
    const [fullName, setFullName] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [bio, setBio] = useState('')
    const [newAvatarPreview, setNewAvatarPreview] = useState(null)
    const [avatarFile, setAvatarFile] = useState(null)

    const [loading, setLoading] = useState(false)

    const getUserInfo = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/userInfo`, { withCredentials: true })
            setuserInfo(response.data?.info)
        } catch (error) {
            console.log(error)
        }
    }

    const updateAccountDetails = async () => {
        try {
            setLoading(true)
            if (avatarFile !== null && avatarFile !== "" && avatarFile instanceof File) {
                const formData = new FormData()
                formData.append('fullName', fullName)
                formData.append('username', username)
                formData.append('bio', bio)
                formData.append('avatar', avatarFile)

                const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/update-account`, formData, { withCredentials: true })

                console.log(response.data)
                toast.success(response.data?.msg)
            } else {
                setLoading(true)
                const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/update-account`, {
                    username,
                    fullName,
                    bio
                }, { withCredentials: true })

                console.log(response.data)
                toast.success(response.data?.msg)
            }
        } catch (error) {
            console.log(error.response?.data)
            toast.error(error.response?.data?.msg)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
            setAvatarFile(file)
            setNewAvatarPreview(URL.createObjectURL(file));
        }
    }

    useEffect(() => {
        getUserInfo()
    }, [])


    return (
        <div className='flex bg-black min-h-screen'>
            <div className="flex justify-center mx-auto">
                <div className='flex mx-5'>
                    <div className='mt-5 '>
                        <h1 className='text-center mb-5'>Update Info</h1>
                        <div className='flex flex-col p-2 w-[35vw]' >
                            <label>username</label>
                            <input
                                className="p-2 border-1 border-white border-b rounded-xl mb-2 mt-2 focus:outline-none"
                                placeholder={userInfo?.username} onChange={e => setUsername(e.target.value)} />

                            <label>Full Name</label>
                            <input
                                className="p-2 border-1 border-white border-b rounded-xl mb-2 mt-2 focus:outline-none"
                                placeholder={userInfo?.fullName} onChange={e => setFullName(e.target.value)} />

                            <label>Bio</label>
                            <textarea
                                className="p-2 border-1 border-white border-b rounded-xl mb-2 mt-2 focus:outline-none"
                                placeholder={userInfo?.bio} onChange={e => setBio(e.target.value)} />

                            <label className='mb-2 mt-2'>Avatar</label>
                            <img className='w-100 rounded-xl' src={userInfo?.avatar} />


                            {newAvatarPreview && (
                                <img src={newAvatarPreview} alt="Preview" className="mt-4  object-cover rounded-xl shadow" />
                            )}

                            <label className='mt-2 mb-2'>Chose New Pic</label>
                            <input type="file" className="file-input file-input-neutral" onChange={e => handleFileChange(e)} />

                            <button type="submit" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl mt-5" onClick={updateAccountDetails}>{loading ?
                                <div className='flex items-center gap-3'>
                                    <h1>updating</h1>
                                    <span className="loading loading-spinner loading-sm"></span>
                                </div>
                                :
                                `Update Info`
                            }</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Settings