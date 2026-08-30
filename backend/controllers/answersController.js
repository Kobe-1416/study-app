const supabase = require("../db/supabase");
const chatEvents = require("../realtime/chatEvents");

const getAuthor = async (userId) => {
    const { data } = await supabase
        .from("students")
        .select("id, username, display_name, profile_picture")
        .eq("id", userId)
        .maybeSingle();

    return data || null;
};

const attachAuthorsAndLikes = async (rows, currentUserId) => {
    if (rows.length === 0) return rows;

    const userIds = [...new Set(rows.map((row) => row.user_id))];
    const answerIds = rows.map((row) => row.id);

    const [{ data: students }, { data: likes }] = await Promise.all([
        supabase.from("students").select("id, username, display_name, profile_picture").in("id", userIds),
        supabase.from("answer_likes").select("answer_id, user_id").in("answer_id", answerIds),
    ]);

    const studentsById = new Map((students || []).map((student) => [student.id, student]));
    const likesByAnswer = new Map();

    (likes || []).forEach(({ answer_id, user_id }) => {
        const entry = likesByAnswer.get(answer_id) || { count: 0, likedByMe: false };
        entry.count += 1;
        if (user_id === currentUserId) entry.likedByMe = true;
        likesByAnswer.set(answer_id, entry);
    });

    return rows.map((row) => ({
        ...row,
        author: studentsById.get(row.user_id) || null,
        likeCount: likesByAnswer.get(row.id)?.count || 0,
        likedByMe: likesByAnswer.get(row.id)?.likedByMe || false,
    }));
};

const getAnswersForQuestion = async (req, res) => {
    const { questionId } = req.params;

    const { data, error } = await supabase
        .from("answers")
        .select("*")
        .eq("question_id", questionId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

    res.json(await attachAuthorsAndLikes(data, req.user.id));
};

const createAnswer = async (req, res) => {
    const { questionId } = req.params;
    const { answer_text } = req.body;

    if (!answer_text?.trim()) {
        return res.status(400).json({ error: "answer_text is required" });
    }

    const { data, error } = await supabase
        .from("answers")
        .insert({
            question_id: questionId,
            answer_text: answer_text.trim(),
            user_id: req.user.id,
        })
        .select()
        .single();

    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

    const answer = { ...data, author: await getAuthor(req.user.id), likeCount: 0, likedByMe: false };

    chatEvents.emit("answer:created", answer);
    res.status(201).json(answer);
};

module.exports = {
    getAnswersForQuestion,
    createAnswer,
};
