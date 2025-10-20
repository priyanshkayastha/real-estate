// routes/upload.route.js
import express from "express";
import upload from "../utils/upload.js";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/upload/:userId", upload.single("image"), async (req, res) => {
  try {
    // console.log("REQ FILE:", req.file);
    // console.log("REQ PARAMS:", req.params);

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const avatarUrl = req.file.path; // Cloudinary URL
    // console.log("Cloudinary URL:", avatarUrl);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // console.log("User avatar updated:", updatedUser.avatar);

    res.status(200).json({ success: true, avatar: updatedUser.avatar });
  } catch (err) {
    // console.error("UPLOAD ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
