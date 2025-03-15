import { Like } from "../models/likes.model.js"
import { Video } from "../models/video.model.js"

const toggleVideoLike = async (req, res) => {
    try {
        const { videoId } = req.params
        const likedByUser = await Like.findOne({
            video: videoId,
            likedBy: req?.user?._id
        })

        if (likedByUser === null || !likedByUser) {
            await Like.create({
                video: videoId,
                likedBy: req?.user?._id
            }, { new: true })

            await Video.findOneAndUpdate({
                _id: videoId
            }, {
                $inc: {
                    likesCount: 1
                }
            }, { new: true })

            const likesCount = await Video.findById(videoId).select('likesCount')

            const likeStatus = await Like.find({
                video: videoId,
                likedBy: req?.user?._id
            })

            return res.status(200).json({
                msg: "liked",
                likesCount,
                likeStatus
            })
        } else {
            const liked = await Like.findOne({
                video: videoId,
                likedBy: req?.user?._id
            })

            if (liked) {
                await Like.findOneAndUpdate({
                    video: videoId,
                    likedBy: req?.user?._id
                }, {
                    $set: {
                        likedBy: null
                    }
                })

                await Video.findOneAndUpdate({
                    _id: videoId,
                }, {
                    $inc: {
                        likesCount: -1
                    }
                }, { new: true })
            }

            const likesCount = await Video.findById(videoId).select('likesCount')

            const likeStatus = await Like.find({
                video: videoId,
                likedBy: req?.user?._id
            })

            return res.status(200).json({
                msg: "Removed Like",
                likesCount,
                likeStatus
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: "error adding / removing like in the video",
            err: error.message
        })
    }
}

export {
    // toggleCommentLike,
    toggleVideoLike,
}