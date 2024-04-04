import  express  from "express";
import { createPost,getPost,deletePost,likeUnlikePost,replyToPost,getfeedPost,getUserPost } from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/feed",protectRoute,getfeedPost)
router.get("/:id",getPost)
router.get("/user/:username",getUserPost)
router.post("/create",protectRoute, createPost)
router.delete("/:id",protectRoute,deletePost)
router.put("/like/:id",protectRoute,likeUnlikePost)
router.put("/reply/:id",protectRoute,replyToPost)

export default router;