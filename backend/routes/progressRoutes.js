// backend/routes/progressRoutes.js
const express = require("express");
const router = express.Router();

const {
  markSectionComplete,
  getProgress,
} = require("../controllers/progressController");

const {
  validateProgress,
  validateUserIdQuery,
} = require("../middleware/validateProgress");

router.post("/", validateProgress, markSectionComplete);
router.get("/", validateUserIdQuery, getProgress);

module.exports = router;