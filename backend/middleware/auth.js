const supabase = require("../db/supabase");

const verifyToken = async (token) => {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) return null;

    return data.user;
};

const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: "Missing access token" });
    }

    const user = await verifyToken(token);

    if (!user) {
        return res.status(401).json({ error: "Invalid or expired session" });
    }

    req.user = user;
    next();
};

module.exports = { requireAuth, verifyToken };
