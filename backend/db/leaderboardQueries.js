const supabase = require("./supabase");

async function getResponsesLeaderboard() {
    const { data, error } = await supabase
        .from("profiles")
        .select(`
            id,
            username,
            answers(id)
        `);

    if (error) {
        throw error;
    }

    return data
        .map((user) => ({
            id: user.id,
            username: user.username,
            score: user.answers.length
        }))
        .sort((a, b) => b.score - a.score);
}

async function getLikesLeaderboard() {
    const { data, error } = await supabase
        .from("profiles")
        .select(`
            id,
            username,
            answers(
                answer_likes(id)
            )
        `);

    if (error) {
        throw error;
    }

    return data
        .map((user) => ({
            id: user.id,
            username: user.username,
            score: user.answers.reduce(
                (total, answer) => total + answer.answer_likes.length,
                0
            )
        }))
        .sort((a, b) => b.score - a.score);
}

async function getProgressLeaderboard() {
    const { data, error } = await supabase
        .from("profiles")
        .select(`
            id,
            username,
            study_progress(id)
        `);

    if (error) {
        throw error;
    }

    return data
        .map((user) => ({
            id: user.id,
            username: user.username,
            score: user.study_progress.length
        }))
        .sort((a, b) => b.score - a.score);
}

module.exports = {
    getResponsesLeaderboard,
    getLikesLeaderboard,
    getProgressLeaderboard
};