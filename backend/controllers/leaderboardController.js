const {
    getResponsesLeaderboard,
    getLikesLeaderboard,
    getProgressLeaderboard
} = require("../db/leaderboardQueries");

async function getLeaderboard(req, res) {
    try {
        const { type = "responses" } = req.query;

        let leaderboard;

        switch (type) {
            case "responses":
                leaderboard = await getResponsesLeaderboard();
                break;

            case "likes":
                leaderboard = await getLikesLeaderboard();
                break;

            case "progress":
                leaderboard = await getProgressLeaderboard();
                break;

            default:
                return res.status(400).json({
                    error: "Invalid leaderboard type. Use responses, likes, or progress."
                });
        }

        res.status(200).json(leaderboard);

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