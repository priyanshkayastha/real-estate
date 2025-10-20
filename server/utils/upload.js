// utils/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mern-profile-images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// Set file size limit here
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});
export default upload;
