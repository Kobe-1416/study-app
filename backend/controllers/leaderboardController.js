const {
    getLeaderboardByResponses,
    getLeaderboardByPoints
} = require("../db/leaderboardQueries");

async function getLeaderboard(req, res) {
    const { type } = req.query;

    try {
        let users;

        if (type === "responses") {
            users = await getLeaderboardByResponses();
        } else {
            users = await getLeaderboardByPoints();
        }

        res.json(users);
    } catch (error) {
        console.error("Leaderboard error:", error);
        res.status(500).json({
            error: "Failed to load leaderboard"
        });
    }
}

module.exports = {
    getLeaderboard
};