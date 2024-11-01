import React, { useEffect, useRef } from 'react'

const VideoPlayer = ({ videoURL }) => {
    const cloudinaryRef = useRef()
    const videoRef = useRef()

    useEffect(() => {
        if (cloudinaryRef.current) return
        cloudinaryRef.current = window.cloudinary
        cloudinaryRef.current.videoPlayer(videoRef.current, {
            cloud_name: `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`
        })
    }, [])

    return (
        <video
            ref={videoRef}
            src={`${videoURL}`}
            controls
            height={600}
            width={`1100px`}
            className='rounded-xl'
        />
    )
}

export default VideoPlayer