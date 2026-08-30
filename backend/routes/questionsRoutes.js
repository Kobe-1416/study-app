const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { getQuestions, createQuestion } = require("../controllers/questionsController");
const { getAnswersForQuestion, createAnswer } = require("../controllers/answersController");

const router = express.Router();

router.get("/", requireAuth, getQuestions);
router.post("/", requireAuth, createQuestion);
router.get("/:questionId/answers", requireAuth, getAnswersForQuestion);
router.post("/:questionId/answers", requireAuth, createAnswer);

module.exports = router;
