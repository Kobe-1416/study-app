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

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api", testRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/answers", answersRoutes);

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws/chat" });
const chatSockets = new Set();

wss.on("connection", async (ws, req) => {
    const { searchParams } = new URL(req.url, "http://localhost");
    const token = searchParams.get("token");
    const user = token ? await verifyToken(token) : null;

    if (!user) {
        ws.close(4401, "Unauthorized");
        return;
    }

    chatSockets.add(ws);
    ws.on("close", () => chatSockets.delete(ws));
});

const broadcastChatEvent = (type, payload) => {
    const message = JSON.stringify({ type, payload });

    chatSockets.forEach((socket) => {
        if (socket.readyState === socket.OPEN) socket.send(message);
    });
};

chatEvents.on("question:created", (question) => broadcastChatEvent("question:created", question));
chatEvents.on("answer:created", (answer) => broadcastChatEvent("answer:created", answer));
chatEvents.on("answer:like-toggled", (data) => broadcastChatEvent("answer:like-toggled", data));

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});