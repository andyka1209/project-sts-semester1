import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

export const uploadSingleImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg",
        ];

        const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
        const extension = path.extname(file.originalname).toLowerCase();

        if (
            allowedMimeTypes.includes(file.mimetype) ||
            allowedExtensions.includes(extension)
        ) {
            cb(null, true);
        } else {
            cb(new Error("Hanya file gambar yang diperbolehkan!"));
        }
    },
}).single("image");