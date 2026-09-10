const supabase = require("../lib/supabase"); // adjust path if yours is in /db

async function markSectionComplete(req, res) {
  const { section_id } = req.body;
  const userId = req.userId; // see Bite 3
  
  

  const { data, error } = await supabase
    .from("study_progress")
    .insert({
      user_id: userId,
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