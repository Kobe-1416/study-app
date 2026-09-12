const supabase = require("../lib/supabase");

async function saveCompletedSection(userId, sectionId) {
  const { data, error } = await supabase
    .from("study_progress")
    .upsert(
      { user_id: userId, section_id: sectionId },
      { onConflict: "user_id,section_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function countCompletedSections(userId) {
  const { count, error } = await supabase
    .from("study_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw error;
  return count ?? 0;
}

module.exports = { saveCompletedSection, countCompletedSections };