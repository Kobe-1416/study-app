const supabase = require("./supabase");

async function getResponsesLeaderboard() {
    const { data, error } = await supabase
        .from("students")
        .select(`
            id,
            username,
            display_name,
            answers(id)
        `);

    if (error) {
        throw error;
    }

    return data
        .map((user) => ({
            id: user.id,
            username: user.username,
            display_name: user.display_name,
            score: user.answers?.length || 0
        }))
        .sort((a, b) => b.score - a.score);
}


async function getLikesLeaderboard() {
    const { data, error } = await supabase
        .from("students")
        .select(`
            id,
            username,
            display_name,
            answers(
                id,
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
            display_name: user.display_name,
            score: (user.answers || []).reduce(
                (total, answer) =>
                    total + (answer.answer_likes?.length || 0),
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
            score: user.study_progress?.length || 0
        }))
        .sort((a, b) => b.score - a.score);
}


module.exports = {
    getResponsesLeaderboard,
    getLikesLeaderboard,
    getProgressLeaderboard
};