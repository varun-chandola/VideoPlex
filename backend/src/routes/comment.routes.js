import express from "express"
const router = express.Router()
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { addComment, addReply, deleteComment, getCommentsReplies, getVideoComments, updateComment } from "../controllers/comment.controller.js"

router.use(authMiddleware)

router.post('/:videoId/comment', addComment)
router.get('/:videoId/comments', getVideoComments)
router.get('/:videoId/:commentId/replies', getCommentsReplies)
router.post('/:videoId/:commentId/reply', addReply)
router.patch('/:commentId/edit', updateComment)
router.delete('/:videoId/:commentId/delete', deleteComment)

export default router