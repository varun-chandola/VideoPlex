import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.routes.js"
import videoRoutes from "./routes/video.routes.js"
import likeRoutes from "./routes/like.routes.js"
import subscribeRoutes from "./routes/subscription.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"
import commentRoutes from "./routes/comment.routes.js"
import dotenv from "dotenv"
dotenv.config()
const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


app.use('/api/v1/user', userRoutes)
app.use('/api/v1/video', videoRoutes)
app.use('/api/v1/like', likeRoutes)
app.use('/api/v1/subscriptions', subscribeRoutes)
app.use('/api/v1/playlist', playlistRoutes)
app.use('/api/v1/comment', commentRoutes)
export { app }
