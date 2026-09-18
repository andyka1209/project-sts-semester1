import { Request, Response } from "express";
import { db } from "../../config/db";
import { categoriesTable } from "../../config/schema";
import { eq } from "drizzle-orm";

export class CategoryController {

    createCategory = async (req: Request, res: Response) => {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Nama kategori wajib diisi",
                });
            }

            await db.insert(categoriesTable).values({ name });

            return res.status(201).json({
                success: true,
                message: "Category created successfully",
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

    getAllCategories = async (req: Request, res: Response) => {
        try {
            const categories = await db.select().from(categoriesTable);

            return res.status(200).json({
                success: true,
                message: "Categories retrieved successfully",
                data: categories,
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

    getCategoryById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const category = await db
                .select()
                .from(categoriesTable)
                .where(eq(categoriesTable.id, id));

            if (category.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Category retrieved successfully",
                data: category[0],
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

    updateCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Nama kategori wajib diisi",
                });
            }

            await db
                .update(categoriesTable)
                .set({ name, updatedAt: new Date() })
                .where(eq(categoriesTable.id, id));

            return res.status(200).json({
                success: true,
                message: "Category updated successfully",
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

    deleteCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            await db
                .delete(categoriesTable)
                .where(eq(categoriesTable.id, id));

            return res.status(200).json({
                success: true,
                message: "Category deleted successfully",
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

export default new CategoryController();