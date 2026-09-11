const ALLOWED_TYPES = ["responses", "points"];

function validateLeaderboardType(req, res, next) {
    const { type } = req.query;

    if (!type) {
        return res.status(400).json({
            error: "Missing required query param: type"
        });
    }

    if (!ALLOWED_TYPES.includes(type)) {
        return res.status(400).json({
            error: `Invalid type. Allowed values: ${ALLOWED_TYPES.join(", ")}`
        });
    }

    next();
}

module.exports = validateLeaderboardType;