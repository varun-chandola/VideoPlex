import { Router } from 'express';
import {
    toggleVideoLike,
} from "../controllers/like.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(authMiddleware);

router.post("/toggle/v/:videoId", toggleVideoLike)
// router.post("/toggle/c/:commentId", toggleCommentLike)
export default router