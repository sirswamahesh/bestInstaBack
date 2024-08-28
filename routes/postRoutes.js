const express = require("express");
const { addNewPost } = require("../controllers/postControllers");
const isAuthenticated = require("../utils/isAuthenticated");
const upload = require("../utils/multer");
const router = express.Router();

router.post("/addpost", isAuthenticated , upload.single("image"), addNewPost);


module.exports = router;
