// backend/middleware/validateProgress.js
function validateProgress(req, res, next) {
  const { section_id } = req.body;

  if (section_id === undefined || section_id === null) {
    return res.status(400).json({ error: "section_id is required" });
  }

  if (typeof section_id !== "number" || section_id < 1 || section_id > 20) {
    return res.status(400).json({ error: "section_id must be a number between 1 and 20" });
  }

  next(); // pass control to the controller
}

module.exports = validateProgress;