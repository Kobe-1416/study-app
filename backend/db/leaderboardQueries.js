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

async function fetchLeaderboard(type) {
    if (type === "points") {
        const { data, error } = await supabase
            .from("leaderboard_students")
            .select("id, username, progress:leaderboard_progress(points)");

        if (error) throw error;

        return data.map((s) => ({
            id: s.id,
            username: s.username,
            score: s.progress?.[0]?.points ?? 0,
        }));
    }

    const { data, error } = await supabase
        .from("leaderboard_students")
        .select("id, username, answers:leaderboard_answers(count)");

    if (error) throw error;

    return data.map((s) => ({
        id: s.id,
        username: s.username,
        score: s.answers?.[0]?.count ?? 0,
    }));
}

async function fetchStudentById(id) {
    const { data, error } = await supabase
        .from("leaderboard_students")
        .select(`
            id,
            username,
            school,
            progress:leaderboard_progress ( points ),
            answers:leaderboard_answers ( count )
        `)
        .eq("id", id)
        .single();

    if (error) throw error;

    return {
        id:        data.id,
        username:  data.username,
        school:    data.school,
        points:    data.progress?.[0]?.points ?? 0,
        responses: data.answers?.[0]?.count ?? 0,
    };
}

module.exports = {
    fetchLeaderboard,
    fetchStudentById,
    getLeaderboardByResponses,
    getLeaderboardByPoints
};