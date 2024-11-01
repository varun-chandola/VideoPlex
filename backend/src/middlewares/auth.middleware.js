import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req?.cookies?.token
        console.log("token\n", token)
        if (!token) {
            return res.status(401).json({
                error: "Unauthorized Request . Login first"
            })
        }

        const decodedInfo = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decodedInfo?._id).select("-password")

        if (!user) res.status(403).json({ error: "Invalid Access Token" })
        req.user = user
        next()
    }
    catch (error) {
        return res.status(500).json({
            authError: error.message
        })
    }
}