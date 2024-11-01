import { Router } from "express";
import { changeCurrentPassword, deleteFromHistory, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()


router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ])
    , registerUser)

router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT, logoutUser)

router.route('/change-password').post(verifyJWT, changeCurrentPassword)
router.route('/update-account').patch(verifyJWT, updateAccountDetails)
router.route('/update-avatar').patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route('/update-cover-Image').patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route('/channel/:username').get(verifyJWT, getUserChannelProfile)
router.route('/watchHistory').get(verifyJWT, getWatchHistory)
router.route('/deleteFromHistory/:videoId').patch(verifyJWT, deleteFromHistory)

export default router