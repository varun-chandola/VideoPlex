import { Router } from 'express';
import {
    getSubscribedChannels,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(authMiddleware);

router.post("/c/:channelId", toggleSubscription)
router.get('/c', getSubscribedChannels)

export default router