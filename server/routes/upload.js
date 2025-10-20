// routes/upload.route.js
import express from "express";
import upload from "../utils/upload.js";
import User from "../models/user.model.js";

const router = express.Router();

// Upload profile image
router.post("/upload/:userId", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { avatar: req.file.path },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ error: "User not found" });

    res.json({ avatar: updatedUser.avatar });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
