// backend/middleware/validateProgress.js

function validateProgress(req, res, next) {
  const { section_id, user_id } = req.body;

  if (section_id === undefined || section_id === null) {
    return res.status(400).json({ error: "section_id is required" });
  }

  if (typeof section_id !== "number" || section_id < 1 || section_id > 20) {
    return res.status(400).json({ error: "section_id must be a number between 1 and 20" });
  }

  if (user_id === undefined || user_id === null) {
    return res.status(400).json({ error: "user_id is required" });
  }

  next();
}

function validateUserIdQuery(req, res, next) {
  const userId = Number(req.query.user_id);

  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ error: "user_id query param is required" });
  }

  next();
}

module.exports = { validateProgress, validateUserIdQuery };