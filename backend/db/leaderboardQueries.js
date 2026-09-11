const supabase = require("../lib/supabase");

// Returns [{ id, username, score }] sorted by number of answers, descending.
async function getLeaderboardByResponses() {
    const { data, error } = await supabase
        .from("leaderboard_students")
        .select(`
            id,
            username,
            leaderboard_answers ( id )
        `);

    if (error) {
        throw error;
    }

    return data
        .map((student) => ({
            id: student.id,
            username: student.username,
            score: student.leaderboard_answers.length
        }))
        .sort((a, b) => b.score - a.score);
}

// Returns [{ id, username, score }] sorted by total points, descending.
async function getLeaderboardByPoints() {
    const { data, error } = await supabase
        .from("leaderboard_students")
        .select(`
            id,
            username,
            leaderboard_progress ( points )
        `);

    if (error) {
        throw error;
    }

    return data
        .map((student) => ({
            id: student.id,
            username: student.username,
            score: student.leaderboard_progress.reduce(
                (total, row) => total + row.points,
                0
            )
        }))
        .sort((a, b) => b.score - a.score);
}

module.exports = {
    getLeaderboardByResponses,
    getLeaderboardByPoints
};