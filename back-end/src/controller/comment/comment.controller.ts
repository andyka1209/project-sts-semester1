import { Request, Response } from "express";
import { db } from "../../config/db";
import { commentsTable } from "../../config/schema";
import { eq, desc } from "drizzle-orm";

class CommentController {
  // GET komentar berdasarkan postId
  getCommentsByPost = async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.postId);
      const comments = await db
        .select()
        .from(commentsTable)
        .where(eq(commentsTable.postId, postId))
        .orderBy(desc(commentsTable.createdAt));

      return res.status(200).json({
        success: true,
        message: "Comments retrieved",
        data: comments,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // POST komentar baru
  createComment = async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.postId);
      const { authorName, content } = req.body;

      if (!content) {
        return res.status(400).json({
          success: false,
          message: "Content wajib diisi",
        });
      }

      await db.insert(commentsTable).values({
        postId,
        authorName: authorName || "Anonim",
        content,
      });

      return res.status(201).json({
        success: true,
        message: "Comment created",
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new CommentController();