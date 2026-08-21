
require("dotenv").config();

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const verifyWebSocketToken = require("./middleware/verifyWebSocketToken");
const supabase = require("./lib/supabase");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const testRoutes = require("./routes/testRoutes");

const leaderboardRoutes = require("./routes/leaderboardRoutes");

app.use(express.json());

app.use("/api", testRoutes);

app.use("/api/leaderboard", leaderboardRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const sessions = new Map();

function broadcastUsers(sessionId) {
    const session = sessions.get(sessionId);

    if (!session) return;

    const users = Array.from(session.values()).map((user) => ({
        id: user.id,
        name: user.name
    }));

    const message = JSON.stringify({
        type: "SESSION_USERS",
        users
    });

    session.forEach((user) => {
        if (user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(message);
        }
    });
}

function removeUserFromSession(ws) {
    const sessionId = ws.sessionId;
    const userId = ws.userId;

    if (!sessionId || !userId) return;

    const session = sessions.get(sessionId);

    if (!session) return;

    session.delete(userId);

    ws.sessionId = null;
    ws.userId = null;

    if (session.size === 0) {
        sessions.delete(sessionId);
    } else {
        broadcastUsers(sessionId);
    }
}

wss.on("connection", async (ws, req) => {
    const url = new URL(req.url, "http://localhost:5000");
    const token = url.searchParams.get("token");

    if (!token) {
        console.log("WebSocket rejected: no token");
        ws.close();
        return;
    }

    const payload = await verifyWebSocketToken(token);

    if (!payload) {
        console.log("WebSocket rejected: invalid token");
        ws.close();
        return;
    }

    // This is the ID verified from the Supabase JWT.
    ws.userId = payload.sub;

    console.log("WebSocket authenticated:", ws.userId);

    ws.on("message", async (message) => {
        const data = JSON.parse(message);

        console.log("Received:", data);

    if (data.type === "JOIN_SESSION") {
        const { sessionId } = data;

        const { data: student, error } = await supabase
            .from("students")
            .select("display_name")
            .eq("id", ws.userId)
            .single();

        if (error || !student) {
            console.error("Could not find student:", error);
            return;
        }

        if (!sessions.has(sessionId)) {
            sessions.set(sessionId, new Map());
        }

        const session = sessions.get(sessionId);

        session.set(ws.userId, {
            id: ws.userId,
            name: student.display_name,
            ws
        });

        ws.sessionId = sessionId;

        broadcastUsers(sessionId);
    }

        if (data.type === "LEAVE_SESSION") {
            removeUserFromSession(ws);
        }
    });

    ws.on("close", () => {
        removeUserFromSession(ws);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

