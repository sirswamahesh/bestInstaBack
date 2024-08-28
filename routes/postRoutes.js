const express = require("express");
const {
  addNewPost,
  getAllPost,
  getUserPost,
  likePost,
  dislikePost,
  addComment,
  getCommentsOfPost,
  deletePost,
  bookmarkPost,
} = require("../controllers/postControllers");
const isAuthenticated = require("../utils/isAuthenticated");
const upload = require("../utils/multer");
const router = express.Router();

router.post("/addpost", isAuthenticated, upload.single("image"), addNewPost);
router.get("/all", isAuthenticated, getAllPost);
router.get("/userpost/all", isAuthenticated, getUserPost);

router.get("/:id/like", isAuthenticated, likePost);
router.get("/:id/dislike", isAuthenticated, dislikePost);
router.post("/:id/comment", isAuthenticated, addComment);
router.get("/:id/comment/all", isAuthenticated, getCommentsOfPost);
router.delete("/delete/:id", isAuthenticated, deletePost);
router.get("/:id/bookmark", isAuthenticated, bookmarkPost);
module.exports = router;
