import express from "express";

import { connectDB } from "./database/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import postRoutes  from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { Chat } from "./models/chatModel.js";
import { isAuth } from "./middleware/isAuth.js";
import { app, server } from "./socket/socket.js";

// Register AI routes
import aiRoutes from "./routes/aiRoutes.js";

// Get the directory of the current file (backend/)

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Required for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from backend folder
dotenv.config({ path: path.join(__dirname, ".env") });

// ✅ Debug log
// console.log("Gemini API Key:", process.env.GEMINI_API_KEY);

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 7000;


// To get All chats of a user
app.get("/api/chats", isAuth, async (req, res) => {
  try {
    const chats = await Chat.find({
      users: req.user._id,
    }).populate({
      path: "users",
      select: "name profilePic",
    });

    // Remove current user from each chat's users array
    const filteredChats = chats.map((chat) => {
      const otherUsers = chat.users.filter(
        (user) => user._id.toString() !== req.user._id.toString()
      );
      return {
        ...chat.toObject(),
        users: otherUsers,
      };
    });

    res.status(200).json(filteredChats);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages", messageRoutes);

// Register AI routes
app.use("/api/ai", aiRoutes);

// Static frontend
app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDB()
});