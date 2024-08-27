const express = require("express");
const { register,login,logout, getProfile,editProfile,getSuggestedUsers } = require("../controllers/userControllers");
const isAuthenticated = require("../utils/isAuthenticated");
const upload = require("../utils/multer");
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/:id/profile", isAuthenticated, getProfile);
router.post(
    "/profile/edit",
    isAuthenticated,
    upload.single("profilePicture"),
    editProfile
  );
  
router.get("/suggested", isAuthenticated, getSuggestedUsers);

module.exports = router;