// backend/controllers/progressController.js
const {
  saveCompletedSection,
  countCompletedSections,
} = require("../db/progressQueries");
const { TOTAL_SECTIONS } = require("../lib/constants");

async function markSectionComplete(req, res) {
  const { section_id, user_id } = req.body;

  try {
    const saved = await saveCompletedSection(user_id, section_id);
    res.status(201).json({ message: "Saved", progress: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save progress" });
  }
}

async function getProgress(req, res) {
  const userId = Number(req.query.user_id);

  try {
    const completed = await countCompletedSections(userId);
    const percent = Math.round((completed / TOTAL_SECTIONS) * 100);

    res.json({ completed, total: TOTAL_SECTIONS, percent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
}

module.exports = { markSectionComplete, getProgress };