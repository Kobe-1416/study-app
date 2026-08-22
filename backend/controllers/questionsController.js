const supabase = require("../db/supabase");
const chatEvents = require("../realtime/chatEvents");

const attachAuthors = async (rows) => {
    const userIds = [...new Set(rows.map((row) => row.user_id))];

    if (userIds.length === 0) return rows;

    const { data: students } = await supabase
        .from("students")
        .select("id, username, display_name, profile_picture")
        .in("id", userIds);

    const studentsById = new Map((students || []).map((student) => [student.id, student]));

    return rows.map((row) => ({
        ...row,
        author: studentsById.get(row.user_id) || null,
    }));
};

const getAuthor = async (userId) => {
    const { data } = await supabase
        .from("students")
        .select("id, username, display_name, profile_picture")
        .eq("id", userId)
        .maybeSingle();

    return data || null;
};

const getQuestions = async (req, res) => {
    const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

    res.json(await attachAuthors(data));
};

const createQuestion = async (req, res) => {
    const { question_text } = req.body;

    if (!question_text?.trim()) {
        return res.status(400).json({ error: "question_text is required" });
    }

    const { data, error } = await supabase
        .from("questions")
        .insert({ question_text: question_text.trim(), user_id: req.user.id })
        .select()
        .single();

    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

    const question = { ...data, author: await getAuthor(req.user.id) };

    chatEvents.emit("question:created", question);
    res.status(201).json(question);
};

module.exports = {
    getQuestions,
    createQuestion,
};
