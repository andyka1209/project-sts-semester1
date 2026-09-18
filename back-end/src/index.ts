import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoryRoutes from "./routes/category/category.routes";
import postRoutes from "./routes/post/post.routes";
import commentRoutes from "./routes/comment/comment.routes";
import authRoutes from "./routes/auth/auth.routes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
    res.json({ message: "API is running" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});