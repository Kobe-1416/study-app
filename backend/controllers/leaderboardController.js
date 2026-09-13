const {
    fetchLeaderboard,
    fetchStudentById,
} = require("../db/leaderboardQueries");

async function getLeaderboard(req, res) {
    const type = req.query.type === "points" ? "points" : "responses";

    try {
        const users = await fetchLeaderboard(type);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load leaderboard" });
    }
}

async function getStudentById(req, res) {
    try {
        const student = await fetchStudentById(req.params.id);
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: "Student not found" });
    }
}

module.exports = {
    getLeaderboard,
    getStudentById,
};