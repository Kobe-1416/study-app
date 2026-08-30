require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");

const { verifyToken } = require("./middleware/auth");
const chatEvents = require("./realtime/chatEvents");
const testRoutes = require("./routes/testRoutes");
const questionsRoutes = require("./routes/questionsRoutes");
const answersRoutes = require("./routes/answersRoutes");
// TODO: point this at wherever your supabase client actually lives
const supabase = require("./lib/supabase");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws/chat" });

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api", testRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/answers", answersRoutes);

// All authenticated sockets — used to broadcast chat/question/answer events
const chatSockets = new Set();

// sessionId -> Map(userId -> { id, name, ws }) — used for session presence
const sessions = new Map();

function broadcastUsers(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) return;

    const users = Array.from(session.values()).map((user) => ({
        id: user.id,
        name: user.name
    }));

    const message = JSON.stringify({ type: "SESSION_USERS", users });

    session.forEach((user) => {
        if (user.ws.readyState === user.ws.OPEN) {
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

    if (session.size === 0) {
        sessions.delete(sessionId);
    } else {
        broadcastUsers(sessionId);
    }
}

const broadcastChatEvent = (type, payload) => {
    const message = JSON.stringify({ type, payload });

    chatSockets.forEach((socket) => {
        if (socket.readyState === socket.OPEN) socket.send(message);
    });
};

wss.on("connection", async (ws, req) => {
    const { searchParams } = new URL(req.url, "http://localhost");
    const token = searchParams.get("token");
    const user = token ? await verifyToken(token) : null;

    if (!user) {
        ws.close(4401, "Unauthorized");
        return;
    }

    // NOTE: adjust this to whatever field verifyToken actually returns
    // (e.g. user.id if it's a normal user record, user.sub if it's a raw JWT payload)
    ws.userId = user.id || user.sub;

    chatSockets.add(ws);

    ws.on("message", async (raw) => {
        let data;
        try {
            data = JSON.parse(raw);
        } catch (err) {
            console.error("Invalid WS message:", raw);
            return;
        }

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

            sessions.get(sessionId).set(ws.userId, {
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
        chatSockets.delete(ws);
        removeUserFromSession(ws);
    });
});

chatEvents.on("question:created", (question) => broadcastChatEvent("question:created", question));
chatEvents.on("answer:created", (answer) => broadcastChatEvent("answer:created", answer));
chatEvents.on("answer:like-toggled", (data) => broadcastChatEvent("answer:like-toggled", data));

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});