import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { commentOnPost, deleteComment, deletePost, editCaption, getAllPosts, getPost, likeUnlikePost, newPost } from "../controllers/postController.js";
import uploadFile from "../middleware/multer.js";

const router = express.Router();



router.post("/new", isAuth, uploadFile, newPost); 
router.get("/all", isAuth, getAllPosts); 

router.get("/:id", isAuth, getPost); 
router.put("/:id", isAuth, editCaption);
router.delete("/:id", isAuth, deletePost);

router.post("/like/:id", isAuth, likeUnlikePost);
router.post("/comment/:id", isAuth, commentOnPost);
router.delete("/comment/:id", isAuth, deleteComment);


export default router;
