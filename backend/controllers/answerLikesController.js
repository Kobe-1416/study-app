const supabase = require("../db/supabase");
const chatEvents = require("../realtime/chatEvents");

const toggleLike = async (req, res) => {
    const { answerId } = req.params;
    const userId = req.user.id;

    const { data: existing, error: fetchError } = await supabase
        .from("answer_likes")
        .select("id")
        .eq("answer_id", answerId)
        .eq("user_id", userId)
        .maybeSingle();

    if (fetchError) {
        console.error(fetchError);
        return res.status(500).json({ error: fetchError.message });
    }

    if (existing) {
        const { error: deleteError } = await supabase
            .from("answer_likes")
            .delete()
            .eq("id", existing.id);

        if (deleteError) {
            console.error(deleteError);
            return res.status(500).json({ error: deleteError.message });
        }

        chatEvents.emit("answer:like-toggled", { answerId: Number(answerId), userId, liked: false });
        return res.json({ liked: false });
    }

    const { error: insertError } = await supabase
        .from("answer_likes")
        .insert({ answer_id: answerId, user_id: userId });

    if (insertError) {
        console.error(insertError);
        return res.status(500).json({ error: insertError.message });
    }

    chatEvents.emit("answer:like-toggled", { answerId: Number(answerId), userId, liked: true });
    res.json({ liked: true });
};

module.exports = { toggleLike };
