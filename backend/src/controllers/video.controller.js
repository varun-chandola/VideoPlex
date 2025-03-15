import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { Like } from "../models/likes.model.js"
import { Comment } from "../models/comment.model.js"

const getAllVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const allVideos = await Video.find({
            isPublished: true
        }).populate('owner', 'avatar username').select('-video_public_id -video_resource_type -thumbnail_public_id -thumbnail_resource_type -category -commentsCount -description -likesCount -privacy -tags -videoFile').sort({
            createdAt: -1
        }).skip((page - 1) * limit)
            .limit(parseInt(limit))

        const totalVideosCount = await Video.countDocuments({ isPublished: true })

        res.status(200).json({
            msg: "all the videos",
            allVideos,
            totalVideosCount
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error fetching all videos",
            err: error.message
        })
    }
}

const publishAVideo = async (req, res) => {
    try {
        const { title, description, tags, category } = req.body
        const videoFilePath = req.files?.videoFile[0]?.path
        const thumbnailFilePath = req.files?.thumbnail[0]?.path

        if (!videoFilePath) return res.status(401).json({
            msg: "video required",
        })

        if (!thumbnailFilePath) return res.status(401).json({
            msg: "thumbnail required"
        })

        let newTags = tags?.split(',')
        newTags = newTags?.map(each => each?.trim())

        const videoURL = await uploadOnCloudinary(videoFilePath)
        const thumbnailURL = await uploadOnCloudinary(thumbnailFilePath)

        const video = await Video.create({
            videoFile: videoURL?.secure_url,
            thumbnail: thumbnailURL?.secure_url,
            owner: req.user?._id,
            title,
            description,
            duration: (videoURL?.duration),
            views: 0,
            likesCount: 0,
            commentsCount: 0,
            tags: newTags,
            isPublished: true,
            category,
            video_public_id: videoURL.public_id,
            video_resource_type: videoURL.resource_type,
            thumbnail_public_id: thumbnailURL.public_id,
            thumbnail_resource_type: thumbnailURL.resource_type
        })


        const videoInfo = await Video.findById(video?._id).populate('owner', 'avatar username').select('-video_public_id -video_resource_type -thumbnail_public_id -thumbnail_resource_type')

        return res.status(200).json({
            msg: "video published",
            videoInfo
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error publishing video",
            err: error.message
        })
    }
}

const getVideoById = async (req, res) => {
    try {
        const { videoId } = req.params

        await Video.findByIdAndUpdate(videoId, {
            $inc: {
                views: 1
            }
        })

        await User.findByIdAndUpdate(req.user?._id, {
            $pull: { watchHistory: videoId }
        });


        const video = await Video.findById(videoId)
            .populate('owner', 'username avatar')
            .select('-video_public_id -video_resource_type -video_resource_type -thumbnail_resource_type -thumbnail_public_id')


        const subStatus = await Subscription.find({
            subscriber: req?.user?._id,
            channel: video?.owner?._id
        })

        await User.findByIdAndUpdate(req.user?._id, {
            $push: { watchHistory: { $each: [videoId], $position: 0 } }
        });

        const likeStatus = await Like.find({
            video: videoId,
            likedBy: req?.user?._id
        })

        res.status(200).json({
            msg: "fetched video successfully",
            video,
            likeStatus,
            subStatus
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error fetching this video",
            err: error.message
        })
    }
}

const updateVideo = async (req, res) => {
    try {
        const { videoId } = req?.params
        const updatedDetails = {}

        const { title, description, category, isPublished } = req.body
        if (title != null || title != '') updatedDetails.title = title
        if (description != null || description != '') updatedDetails.description = description
        if (category != null || category != '') updatedDetails.category = category
        if (isPublished !== "") updatedDetails.isPublished = isPublished

        console.log(isPublished)
        console.log('updated details\n', updatedDetails)
        const updatedThumbnailLocalPath = ((req?.files) ? req?.files[0]?.path : null)
        if (updatedThumbnailLocalPath && updatedThumbnailLocalPath !== null) {
            const currentThumbnail = await Video.findById(videoId)
                .select("thumbnail_public_id thumbnail_resource_type")

            await deleteFromCloudinary(currentThumbnail?.thumbnail_public_id, currentThumbnail?.thumbnail_resource_type)

            const updatedThumbnail = await uploadOnCloudinary(updatedThumbnailLocalPath)
            updatedDetails.thumbnail = updatedThumbnail?.secure_url
        }

        await Video.findOneAndUpdate({
            _id: videoId,
            owner: req?.user?._id
        }, {
            $set: updatedDetails
        }, { new: true }).select("-video_public_id -video_resource_type -thumbnail_public_id -thumbnail_resource_type")

        return res.status(200).json({
            msg: "video details updated successfull",
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error updating video details",
            err: error.message
        })
    }
}

const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params
        if (!videoId) return res.status(409).json({
            msg: "Video Unavailable"
        })

        const { owner } = await Video.findById(videoId).select('owner')

        if (owner === req?.user?._id) {
            await User.updateMany({
                watchHistory: videoId
            }, {
                $pull: {
                    watchHistory: videoId
                }
            })

            await Like.updateMany({
                video: videoId,
            }, {
                $set: {
                    likedBy: null
                }
            })


            await Comment.findOneAndDelete({
                video: videoId
            })


            const videoDetails = await Video.findById(videoId)
                .select("video_public_id video_resource_type thumbnail_public_id thumbnail_resource_type")

            if (!videoDetails) return res.status(409).json({
                msg: "Video Unavailable"
            })

            await deleteFromCloudinary(videoDetails.video_public_id, videoDetails.video_resource_type)

            await deleteFromCloudinary(videoDetails.thumbnail_public_id, videoDetails.thumbnail_resource_type)
        }

        await Video.findByIdAndDelete(videoId)

        res.status(200).json({
            msg: "Video and thumbnail Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error deleting this video",
            err: error.message
        })
    }
}

const getAllCategories = async (req, res) => {
    try {
        const categories = await Video.find({
            isPublished: true
        }).select('category')

        return res.status(200).json({
            msg: "All Categories",
            categories
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error fetching categories",
            err: error.message
        })
    }
}

const getVideosFromACategory = async (req, res) => {
    try {
        const { categoryName } = req.params
        const allVideosInThisCategory = await Video.find({
            category: categoryName
        }).populate('owner', 'avatar username').select('-video_public_id -video_resource_type -thumbnail_public_id -thumbnail_resource_type -category -commentsCount -description -likesCount -privacy -tags -videoFile').sort({
            createdAt: -1
        })
        return res.status(200).json({
            msg: "videos in this category",
            allVideosInThisCategory
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error in fetchin videos in this category",
            err: error.message
        })
    }
}

const suggestedVideos = async (req, res) => {
    try {
        const { videoId } = req.params
        const currentVideo = await Video.findById(videoId).select('tags')
        const videos = await Video.find({
            isPublished: true,
            $or: tags.map(tag => ({ tags: { $regex: currentVideo?.tags, $options: "i" } }))
            // _id: { $ne: videoId }
        }).select('thumbnail title duration views').populate('owner', 'username avatar');

        res.json({
            suggestedVideos: videos
            // suggestedVideos
        });


    } catch (error) {
        res.status(500).json({ msg: "Error fetching suggestions", err: error.message });
    }
};

const getVideoDetails = async (req, res) => {
    try {
        const { videoId } = req.params
        const videoDetails = await Video.findById(videoId).select("title thumbnail isPublished description category")

        return res.status(200).json({
            videoDetails
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error fetching video details",
            err: error.message
        })
    }
}
export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    getAllCategories,
    getVideosFromACategory,
    suggestedVideos,
    getVideoDetails
}