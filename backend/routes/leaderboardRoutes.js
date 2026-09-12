const express = require("express");

const validateLeaderboardType = require("../middleware/validateLeaderboardType");
const {
    getLeaderboard,
    getStudentById,
} = require("../controllers/leaderboardController");

const router = express.Router();

router.get("/", validateLeaderboardType, getLeaderboard);
router.get("/:id", getStudentById);

module.exports = router;