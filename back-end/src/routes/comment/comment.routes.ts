import { Router } from "express";
import commentController from "../../controller/comment/comment.controller";

const router = Router();

router.get("/:postId", commentController.getCommentsByPost);
router.post("/:postId", commentController.createComment);

export default router;