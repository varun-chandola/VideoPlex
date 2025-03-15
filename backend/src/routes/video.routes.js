import { Router } from 'express';
import {
    deleteVideo,
    getAllCategories,
    getAllVideos,
    getVideoById,
    getVideoDetails,
    getVideosFromACategory,
    publishAVideo,
    suggestedVideos,
    updateVideo,
} from "../controllers/video.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();
router.use(authMiddleware);

router
    .route("/")
    .get(getAllVideos)
    .post(upload.fields([{ name: "videoFile", maxCount: 1, }, { name: "thumbnail", maxCount: 1, },]), publishAVideo);

router.get('/categories', getAllCategories)
router.get('/:categoryName/videos', getVideosFromACategory)
router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.any("thumbnail"), updateVideo);

router.get('/:videoId/suggest', suggestedVideos)
router.get('/:videoId/details', getVideoDetails)
export default router