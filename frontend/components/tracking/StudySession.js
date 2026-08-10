"use client";

import { useEffect, useState } from "react";
import socket from "../../lib/socket";

export default function StudySession() {
    const [users, setUsers] = useState([]);
    const [joined, setJoined] = useState(false);

    const [user, setUser] = useState(null);

    useEffect(() => {
        let storedUser = localStorage.getItem("test-user");

        if (!storedUser) {
            storedUser = JSON.stringify({
                id: crypto.randomUUID(),
                name: `User-${Math.floor(Math.random() * 1000)}`
            });

            localStorage.setItem("test-user", storedUser);
        }

        setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "SESSION_USERS") {
                setUsers(data.users);
            }
        };

        return () => {
            socket.onmessage = null;
        };
    }, []);

    function joinSession() {

        if(!user) {
            console.error("User is not set yet.");
            return;
        }

        if (socket.readyState !== WebSocket.OPEN) {
            console.log("WebSocket is not connected");
            return;
        }

        socket.send(
            JSON.stringify({
                type: "JOIN_SESSION",
                sessionId: "study-room-1",
                user
            })
        );

        setJoined(true);
    }

    function leaveSession() {
        if (socket.readyState !== WebSocket.OPEN) return;

        socket.send(
            JSON.stringify({
                type: "LEAVE_SESSION"
            })
        );

        setUsers([]);
        setJoined(false);
    }

    return (
        <div>
            <h1>Study Session</h1>

            {!joined ? (
                <button onClick={joinSession}>
                    Join Study Session
                </button>
            ) : (
                <button onClick={leaveSession}>
                    Leave Study Session
                </button>
            )}

            <h2>Online Users</h2>

            {users.length === 0 ? (
                <p>No users currently online.</p>
            ) : (
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            🟢 {user.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}