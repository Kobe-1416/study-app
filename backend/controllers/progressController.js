const supabase = require("../lib/supabase");

async function markSectionComplete(req, res) {
  const { section_id, user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  const { data, error } = await supabase
    .from("study_progress")
    .insert({
      user_id,
      section_id,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to save progress" });
  }

  res.status(201).json({ message: "Saved", progress: data });
}

module.exports = { markSectionComplete };