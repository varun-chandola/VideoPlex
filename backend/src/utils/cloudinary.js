import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" })

        fs.unlinkSync(localFilePath)
        const information = {
            public_id: response?.public_id,
            resource_type: response?.resource_type,
            type: response?.type,
            secure_url: response?.secure_url,
            duration: response?.duration
        }
        return information;
    } catch (error) {
        // fs.unlinkSync(localFilePath)
        return error.message
    }
}

const deleteFromCloudinary = async (public_id, resource_type) => {
    try {
        if (!public_id) return null

        await cloudinary.uploader.destroy(public_id, { resource_type, invalidate: true })
    } catch (error) {
        console.log("cloudinary delete error", error.message)
    }
}
export { uploadOnCloudinary, deleteFromCloudinary }