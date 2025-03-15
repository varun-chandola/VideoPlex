import mongoose from "mongoose"
const commentSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    commentOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);