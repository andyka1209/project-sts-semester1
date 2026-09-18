import cloudinary from "../config/cloudinary";
import { Readable } from "stream";

export const uploadToCloudinary = (fileBuffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "posts" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        Readable.from(fileBuffer).pipe(uploadStream);
    });
};