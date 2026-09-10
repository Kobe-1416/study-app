const express = require("express");
const router = express.Router();
const { markSectionComplete } = require("../controllers/progressController");

router.post("/", markSectionComplete);

module.exports = router;