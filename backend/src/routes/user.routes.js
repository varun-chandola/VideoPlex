import { Router } from "express";
import { clearHistory, deleteFromHistory, getWatchHistory, loginUser, logoutUser, registerUser, updateAccountDetails, getUserInfo, getChannelInfo, userVideos, getUserLikedVideos, removeFromLikesVideos } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router()


router.post('/register', registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(authMiddleware, logoutUser)
router.route('/update-account').patch(authMiddleware, upload.any('avatar'), updateAccountDetails)
router.route('/watchHistory').get(authMiddleware, getWatchHistory)
router.route('/deleteFromHistory/:videoId').patch(authMiddleware, deleteFromHistory)
router.post('/clearHistory', authMiddleware, clearHistory)
router.get('/userInfo', authMiddleware, getUserInfo)
router.get('/:channelId', getChannelInfo)
router.get('/you/channel', authMiddleware, userVideos)
router.get('/you/likedVideos', authMiddleware, getUserLikedVideos)
router.patch('/:videoId/likedRemove', authMiddleware, removeFromLikesVideos)
export default router