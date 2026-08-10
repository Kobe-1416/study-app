require("dotenv").config();

const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const testRoutes = require("./routes/testRoutes");

const PORT = 5000;

app.use(express.json());

app.use("/api", testRoutes);

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


wss.on("connection", (ws) => {

    console.log("WebSocket client connected");


    ws.on("message", (message) => {

        const data = JSON.parse(message);


        if (data.type === "JOIN_SESSION") {

            const { sessionId, user } = data;

            if (!sessions.has(sessionId)) {
                sessions.set(sessionId, new Map());
            }

            const session = sessions.get(sessionId);

            session.set(user.id, {
                ...user,
                ws
            });

            ws.sessionId = sessionId;
            ws.userId = user.id;

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