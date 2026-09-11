const express = require("express");

const validateLeaderboardType = require("../middleware/validateLeaderboardType");
const { getLeaderboard } = require("../controllers/leaderboardController");

const router = express.Router();

router.get("/", validateLeaderboardType, getLeaderboard);

module.exports = router;