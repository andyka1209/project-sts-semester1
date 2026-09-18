import { Request, Response } from "express";
import { db } from "../../config/db";
import { postsTable, categoriesTable, commentsTable } from "../../config/schema";
import { eq, and, sql } from "drizzle-orm";
import { uploadToCloudinary } from "../../services/cloudinary.service";

class PostController {

    createPost = async (req: Request, res: Response) => {
        try {
            const { categoryId, title, content } = req.body;

            if (!categoryId || !title || !content) {
                return res.status(400).json({
                    success: false,
                    message: "Category, title, dan content wajib diisi",
                });
            }

            let imageUrl: string | null = null;
            let imagePublicId: string | null = null;

            if (req.file) {
                const result = await uploadToCloudinary(req.file.buffer);
                imageUrl = result.secure_url;
                imagePublicId = result.public_id;
            }

            await db.insert(postsTable).values({
                categoryId,
                title,
                content,
                imageUrl,
                imagePublicId,
            });

            return res.status(201).json({
                success: true,
                message: "Post created successfully",
            });

        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    };

    // ================= INI YANG DIUBAH =================
    getAllPosts = async (req: Request, res: Response) => {
        try {
            const posts = await db
                .select({
                    id: postsTable.id,
                    categoryId: postsTable.categoryId,
                    title: postsTable.title,
                    content: postsTable.content,
                    imageUrl: postsTable.imageUrl,
                    imagePublicId: postsTable.imagePublicId,
                    status: postsTable.status,
                    createdAt: postsTable.createdAt,
                    updatedAt: postsTable.updatedAt,
                    categoryName: categoriesTable.name,
                    commentCount: sql<number>`(
                        SELECT COUNT(*)::int FROM ${commentsTable}
                        WHERE ${commentsTable.postId} = ${postsTable.id}
                    )`.as("comment_count"),
                })
                .from(postsTable)
                .leftJoin(
                    categoriesTable,
                    eq(postsTable.categoryId, categoriesTable.id)
                )
                .where(eq(postsTable.status, "published"));

            return res.status(200).json({
                success: true,
                message: "Posts retrieved successfully",
                data: posts,
            });

        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    };
    // ====================================================

    getPostById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const post = await db
                .select({
                    id: postsTable.id,
                    categoryId: postsTable.categoryId,
                    title: postsTable.title,
                    content: postsTable.content,
                    imageUrl: postsTable.imageUrl,
                    imagePublicId: postsTable.imagePublicId,
                    status: postsTable.status,
                    createdAt: postsTable.createdAt,
                    updatedAt: postsTable.updatedAt,
                    categoryName: categoriesTable.name,
                    commentCount: sql<number>`(
                        SELECT COUNT(*)::int FROM ${commentsTable}
                        WHERE ${commentsTable.postId} = ${postsTable.id}
                    )`.as("comment_count"),
                })
                .from(postsTable)
                .leftJoin(
                    categoriesTable,
                    eq(postsTable.categoryId, categoriesTable.id)
                )
                .where(and(
                    eq(postsTable.id, id),
                    eq(postsTable.status, "published")
                ));

            if (post.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Post retrieved successfully",
                data: post[0],
            });

        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    };

    updatePost = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const { categoryId, title, content } = req.body;

            if (!categoryId || !title || !content) {
                return res.status(400).json({
                    success: false,
                    message: "Category, title, dan content wajib diisi",
                });
            }

            await db
                .update(postsTable)
                .set({
                    categoryId,
                    title,
                    content,
                    updatedAt: new Date(),
                })
                .where(eq(postsTable.id, id));

            return res.status(200).json({
                success: true,
                message: "Post updated successfully",
            });

        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    };

    deletePost = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            await db
                .update(postsTable)
                .set({
                    status: "deleted",
                    updatedAt: new Date(),
                })
                .where(eq(postsTable.id, id));

            return res.status(200).json({
                success: true,
                message: "Post deleted successfully",
            });

        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    };
}

export default new PostController();