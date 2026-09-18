import { Router } from "express";
import postController from "../../controller/post/post.controller";
import { uploadSingleImage } from "../../middleware/upload.middleware";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware";

const router = Router();

// GET — publik (semua bisa lihat)
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);

// POST — butuh login (siapa aja yang login bisa bikin)
router.post("/", verifyToken, uploadSingleImage, postController.createPost);

// PUT & DELETE — cuma admin
router.put("/:id", verifyToken, requireAdmin, postController.updatePost);
router.delete("/:id", verifyToken, requireAdmin, postController.deletePost);

export default router;