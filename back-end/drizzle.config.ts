import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

console.log("DEBUG:", {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
});

export default defineConfig({
    schema: "./src/config/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME!,
        ssl: false,
    },
});