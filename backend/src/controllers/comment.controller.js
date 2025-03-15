import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js"

const getVideoComments = async (req, res) => {
    try {
        const { videoId } = req.params
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const comments = await Comment.find({
            video: videoId,
            parentComment: null
        }).populate('commentOwner', 'username avatar').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit))

        return res.status(200).json({
            msg: "comments",
            comments
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error fetching Comments",
            err: error.message
        })
    }
}

const getCommentsReplies = async (req, res) => {
    try {
        const { commentId, videoId } = req.params
        const replies = await Comment.find({
            video: videoId,
            parentComment: commentId
        })
            .populate('commentOwner', 'username avatar').sort({ createdAt: -1 })


        return res.status(200).json({
            msg: "replies",
            replies
        })

    } catch (error) {
        return res.status(500).json({
            msg: "error fetching replies",
            err: error.message
        })
    }
}

const addComment = async (req, res) => {
    try {
        const { videoId } = req.params
        const { comment } = req.body

        if (comment == null || comment === "")
            return res.status(401).json({
                msg: "Comment Cannot be empty"
            })

        const newComment = await Comment.create({
            comment,
            commentOwner: req.user?._id,
            video: videoId,
        })

        await Video.findByIdAndUpdate(videoId, {
            $inc: {
                commentsCount: 1
            }
        })

        return res.status(200).json({
            msg: "commented",
            newComment
        })
    } catch (error) {
        return res.status(500).json({
            err: error.message
        })
    }
}

const addReply = async (req, res) => {
    try {
        const { commentId, videoId } = req.params
        const { reply } = req.body

        const replyId = await Comment.create({
            video: videoId,
            commentOwner: req?.user?._id,
            comment: reply,
        })

        await Comment.findByIdAndUpdate(replyId, {
            $set: {
                parentComment: commentId
            }
        })

        return res.status(200).json({
            msg: "replied"
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error Adding a reply",
            err: error.message
        })
    }
}

const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params
        const updatedCommentInfo = {}

        const { updatedComment } = req.body
        if (updatedComment != null || updatedComment != "") updatedCommentInfo.comment = updatedComment

        await Comment.findByIdAndUpdate(commentId, {
            $set: updatedCommentInfo
        }, { new: true })

        return res.status(200).json({
            msg: "comment updated"
        })
    } catch (error) {
        return res.status(200).json({
            msg: "updated",
            err: error.message
        })
    }
}

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params
        const { videoId } = req.params

        await Comment.deleteMany({
            parentComment: commentId,
            commentOwner: req?.user?._id
        })

        await Video.findByIdAndUpdate(videoId, {
            $inc: {
                commentsCount: -1
            }
        })

        await Comment.findByIdAndDelete(commentId)

        return res.status(200).json({
            msg: "comment deleted",
        })
    } catch (error) {
        return res.status(500).json({
            msg: "error deleting comment",
            err: error.message
        })
    }
}

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
    addReply,
    getCommentsReplies
}