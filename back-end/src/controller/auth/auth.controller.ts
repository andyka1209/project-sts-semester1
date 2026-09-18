import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../../config/db";
import { usersTable } from "../../config/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_default_ganti_nanti";

class AuthController {
    // ============ REGISTER ============
    register = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Username dan password wajib diisi",
                });
            }

            // Cek username udah ada
            const [existing] = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.username, username))
                .limit(1);

            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: "Username sudah terdaftar",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await db.insert(usersTable).values({
                username,
                password: hashedPassword,
                role: "user",
            });

            return res.status(201).json({
                success: true,
                message: "Register berhasil",
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

    // ============ LOGIN ============
    login = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Username dan password wajib diisi",
                });
            }

            const [user] = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.username, username))
                .limit(1);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Username atau password salah",
                });
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    message: "Username atau password salah",
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                success: true,
                message: "Login berhasil",
                data: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                    },
                },
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

    // ============ SEED ADMIN (BUAT DEV AJA) ============
    seedAdmin = async (req: Request, res: Response) => {
        try {
            const { username, password, secret } = req.body;

            // Proteksi sederhana
            if (secret !== "RAHASIA_ADMIN_123") {
                return res.status(403).json({
                    success: false,
                    message: "Secret tidak valid",
                });
            }

            // Cek apakah admin udah ada
            const [existing] = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.username, username))
                .limit(1);

            if (existing) {
                // Update jadi admin aja
                await db
                    .update(usersTable)
                    .set({ role: "admin" })
                    .where(eq(usersTable.username, username));

                return res.status(200).json({
                    success: true,
                    message: `User '${username}' di-upgrade jadi admin`,
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await db.insert(usersTable).values({
                username,
                password: hashedPassword,
                role: "admin",
            });

            return res.status(201).json({
                success: true,
                message: `Admin '${username}' berhasil dibuat`,
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

export default new AuthController();