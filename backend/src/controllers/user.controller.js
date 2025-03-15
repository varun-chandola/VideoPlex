import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/likes.model.js"
import { Subscription } from "../models/subscription.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const registerUser = async (req, res) => {
    try {
        const { username, password, fullName, bio } = req.body;
        if (
            [fullName, password, username].some(x => x?.trim() === "")
        ) {
            return res.status(403).json({
                error: "All fields are necessary"
            })
        }

        const userFound = await User.findOne({ username })

        if (userFound) {
            return res.status(409).json({
                message: "username taken"
            })
        }

        const newUser = await User.create({
            username,
            password,
            fullName,
            bio
        })

        const token = jwt.sign({
            _id: newUser?._id,
            username
        }, process.env.JWT_SECRET, { expiresIn: '1d' })

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'None'
        };

        res.status(201)
            .cookie("token", token, options)
            .json({
                message: "Account Created Successfully",
                token
            })
    } catch (error) {
        res.status(500).json({
            msg: "error occurred",
            err: error.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!(username || password)) {
            return res.status(403).json({
                error: "all fields are required"
            })
        }

        const foundUser = await User.findOne({ username })

        if (!foundUser) return res.status(403).json({
            message: "username unavailable"
        })

        const isPasswordCorrect = await foundUser.isPasswordCorrect(password)
        if (!isPasswordCorrect) return res.status(403).json({
            message: "Incorrect Password"
        })

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax'
        };

        const token = jwt.sign({
            _id: foundUser._id,
            username,
        }, process.env.JWT_SECRET, { expiresIn: "1d" })

        return res
            .status(200)
            .cookie("token", token, options)
            .json({
                message: {
                    data: "Login Successful",
                    token
                }
            })
    } catch (error) {
        return res.status(500).json({
            err: error.message
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax'
        };

        return res
            .clearCookie("token", options)
            .status(200)
            .json({
                msg: "Logout"
            })
    } catch (error) {
        return res.status(500).json({
            err: error.message
        })
    }
}

const updateAccountDetails = async (req, res) => {
    try {
        const updatedDetails = {}
        const { fullName, username, bio } = req.body


        const newAvatarLocalPath = ((req?.files) ? req?.files[0]?.path : null)


        if (newAvatarLocalPath && newAvatarLocalPath != null) {
            const newAvatar = await uploadOnCloudinary(newAvatarLocalPath)
            if (newAvatar?.secure_url) updatedDetails.avatar = newAvatar?.secure_url
        }

        if (fullName != null && fullName != "") updatedDetails.fullName = fullName
        if (username != null && username != "") updatedDetails.username = username
        if (bio != null && bio != "") updatedDetails.bio = bio

        const usernameTaken = await User.findOne({
            username
        })

        if (usernameTaken) return res.status(409).json({
            msg: "username taken"
        })

        await User.findByIdAndUpdate(req?.user?._id, {
            $set: updatedDetails
        }, { new: true })

        return res.status(200).json({
            msg: "User account details updated successfully",
        })
    } catch (error) {
        return res.status(500).json({
            err: error.message
        })
    }
}

const getWatchHistory = async (req, res) => {
    try {
        const userHistory = await User.findById(req.user?._id)
            .select("watchHistory")
            .populate({
                path: "watchHistory",
                select: "_id thumbnail title duration views owner",
                populate: {
                    path: "owner",
                    select: "username avatar"
                }
            });

        res.status(200).json({
            msg: "watch history",
            userHistory
        });
    } catch (error) {
        return res.status(500).json({
            err: error.message
        })
    }
}

const deleteFromHistory = async (req, res) => {
    try {
        const { videoId } = req.params
        await User.findByIdAndUpdate(req.user?._id, {
            $pull: {
                watchHistory: videoId
            }
        })

        return res.status(200).json({
            msg: "Removed"
        })
    } catch (error) {
        return res.status(500).json({
            err: error.message

        })
    }
}

const clearHistory = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req?.user?._id, {
            $set: {
                watchHistory: []
            }
        }, { new: true })
        return res.status(200).json({
            msg: "History Cleared"
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error clearing history",
            err: error.message
        })
    }
}

const getUserInfo = async (req, res) => {
    try {
        const info = await User.findById(req?.user?._id).select('-password -watchHistory')
        return res.status(200).json({
            info
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error fetching user info",
            err: error.message
        })
    }
}

const getChannelInfo = async (req, res) => {
    try {
        const { channelId } = req.params;

        const channelInfo = await User.findById(channelId).select('-password -watchHistory')
        const subscribersCount = await Subscription.countDocuments({
            channel: channelId
        })

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const channelVideos = await Video.find({
            owner: channelId,
            isPublished: true
        }).select('-owner -description -likesCount -commentsCount -tags -category -isPublished -privacy').skip((page - 1) * limit)
            .limit(parseInt(limit))


        const subStatus = await Subscription.findOne({
            subscriber: req?.user?._id,
            channel: channelId
        })

        return res.status(200).json({
            msg: "channel info",
            channelVideos,
            channelInfo,
            subscribersCount,
            subStatus
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error fetching channel info",
            err: error.message
        })
    }
}

const userVideos = async (req, res) => {
    try {
        const yourVideos = await Video.find({
            owner: req?.user?._id,
        }).select('duration views thumbnail title isPublished')

        return res.status(200).json({
            yourVideos
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error fetching your videos",
            err: error.message
        })
    }
}

const getUserLikedVideos = async (req, res) => {
    try {
        const videos = await Like.find({
            likedBy: req.user?._id
        }).select("video").populate({
            path: "video",
            select: "thumbnail title views duration",
            populate: {
                path: "owner",
                select: "username avatar"
            }
        }).sort({
            createdAt: -1
        })

        return res.status(200).json({
            msg: "user's liked videos",
            videos
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error while fetching liked videos",
            err: error
        })
    }
}

const removeFromLikesVideos = async (req, res) => {
    try {
        const { videoId } = req.params
        await Like.findOneAndDelete({
            video: videoId,
            likedBy: req?.user?._id
        })

        await Video.findByIdAndUpdate(videoId, {
            $inc: {
                likesCount: -1
            }
        })

        return res.status(200).json({
            msg: "removed from liked videos"
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error removing from liked videos",
            err: error.message
        })
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    updateAccountDetails,
    getWatchHistory,
    deleteFromHistory,
    clearHistory,
    getUserInfo,
    getChannelInfo,
    userVideos,
    getUserLikedVideos,
    removeFromLikesVideos
}