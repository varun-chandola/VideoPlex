import mongoose from "mongoose"
const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        required: true,
        default: 0
    },
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String
    }],
    category: {
        type: String,
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    privacy: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },
}, { timestamps: true }, { strict: false })

// videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);
