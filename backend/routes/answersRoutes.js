const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { toggleLike } = require("../controllers/answerLikesController");

const router = express.Router();

router.post("/:answerId/like", requireAuth, toggleLike);

module.exports = router;
