const express = require("express");
const { getMessage, sendMessage } = require("../controllers/messageController");
const isAuthenticated = require("../utils/isAuthenticated");

const router = express.Router();

router.post("/send/:id", isAuthenticated, sendMessage);
router.get("/all/:id", isAuthenticated, getMessage);
module.exports = router;
