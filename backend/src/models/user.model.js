import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/da2fioulc/image/upload/v1738252225/pjbrwhinxhd6w9kx0wga.jpg'
    },
    bio: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    watchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }]

}, { timestamps: true }, { strict: false })


userSchema.pre("save", async function (next) {
    if (!(this.isModified("password"))) return next()

    this.password = await bcrypt.hash(this.password, 8)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema);