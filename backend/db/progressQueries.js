// backend/db/progressQueries.js
const pool = require("./supabase");

async function saveCompletedSection(userId, sectionId) {
  const result = await pool.query(
    `INSERT INTO study_progress (user_id, section_id, completed_at)
     VALUES ($1, $2, NOW())
     RETURNING *`,
    [userId, sectionId]
  );
  return result.rows[0];
}

module.exports = { saveCompletedSection };