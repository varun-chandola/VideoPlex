import React, { useContext, useEffect, useRef } from 'react'
import { AdvancedVideo } from "@cloudinary/react"
import { Cloudinary } from "@cloudinary/url-gen"
import { context } from "./Context"

const cld = new Cloudinary({
    cloud: {
        cloudName: `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`
    }
});
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
            width={750}
            className={`rounded-xl`}
        />
    )
}

export default VideoPlayer