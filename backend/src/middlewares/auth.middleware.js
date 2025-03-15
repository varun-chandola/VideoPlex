import jwt from "jsonwebtoken"
export const authMiddleware = async (req, res, next) => {
    try {
        const token = req?.cookies?.token
        
        if (!token) {
            return res.status(401).json({
                error: "unauthorized"
            })
        }

        const decodedInfo = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedInfo
        // console.log(req.user)
        next()
    }
    catch (error) {
        return res.status(500).json({
            authError: error.message
        })
    }
}