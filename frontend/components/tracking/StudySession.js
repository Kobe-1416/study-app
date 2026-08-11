
"use client";

import { useEffect, useState } from "react";
import { createSocket } from "../../lib/socket";
import { supabase } from "../../lib/supabase";

export default function StudySession() {
    const [users, setUsers] = useState([]);
    const [joined, setJoined] = useState(false);
    const [user, setUser] = useState(null);
    const [socket, setSocket] = useState(null);

    // Get authenticated user and create WebSocket connection
    useEffect(() => {
        async function setupConnection() {
            // Get authenticated user
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser();

            if (userError || !user) {
                console.error("No authenticated user:", userError);
                return;
            }

            // Get current Supabase session
            const {
                data: { session },
                error: sessionError
            } = await supabase.auth.getSession();

            if (sessionError || !session) {
                console.error("No active session:", sessionError);
                return;
            }

            // Save authenticated user
            setUser(user);

            // Create authenticated WebSocket connection
            const accessToken = session.access_token;
            const newSocket = createSocket(accessToken);

            setSocket(newSocket);
        }

        setupConnection();
    }, []);

    // Listen for WebSocket updates
    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "SESSION_USERS") {
                setUsers(data.users);
            }
        };

        return () => {
            socket.onmessage = null;
        };
    }, [socket]);

    function joinSession() {
        if (!user) {
            console.error("User is not ready yet.");
            return;
        }

        if (!socket) {
            console.error("WebSocket is not ready yet.");
            return;
        }

        if (socket.readyState !== WebSocket.OPEN) {
            console.log("WebSocket is not connected");
            return;
        }

        socket.send(
            JSON.stringify({
                type: "JOIN_SESSION",
                sessionId: "study-room-1"
            })
        );

        setJoined(true);
    }

    function leaveSession() {
        if (!socket) return;

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
        <main className="min-h-screen bg-[#f5f4ef] px-6 py-16 font-sans">
            <div className="mx-auto w-full max-w-[460px]">
                <p className="mb-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#3a5a6b]">
                    Study Room
                </p>

                <h1 className="font-serif text-[28px] font-normal leading-tight text-[#242424]">
                    Study Session
                </h1>

                <div className="my-[18px] h-0.5 w-8 bg-[#3a5a6b]" />

                <div className="mb-10">
                    {!joined ? (
                        <button
                            onClick={joinSession}
                            className="rounded-md border border-[#3a5a6b] bg-[#3a5a6b] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f4858] hover:border-[#2f4858] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3a5a6b] focus-visible:outline-offset-2"
                        >
                            Join Study Session
                        </button>
                    ) : (
                        <button
                            onClick={leaveSession}
                            className="rounded-md border border-[#dcd8ce] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#3a5a6b] transition-colors hover:border-[#3a5a6b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3a5a6b] focus-visible:outline-offset-2"
                        >
                            Leave Study Session
                        </button>
                    )}
                </div>

                <div className="rounded-md border border-[#dcd8ce] bg-white p-6">
                    <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#3f3f3f]">
                        Online Users
                    </h2>

                    {users.length === 0 ? (
                        <p className="text-sm text-[#6b6b6b]">
                            No users currently online.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {users.map((user) => (
                                <li
                                    key={user.id}
                                    className="flex items-center gap-2.5 text-sm text-[#242424]"
                                >
                                    <span className="h-2 w-2 rounded-full bg-[#3f6b4e]" />
                                    {user.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
}

