"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const ChatSocketContext = createContext(null);

const toWebSocketUrl = (token) => {
    const httpBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
    const wsBase = httpBase.replace(/^http/, "ws");

    return `${wsBase}/ws/chat?token=${encodeURIComponent(token)}`;
};

export function ChatSocketProvider({ children }) {
    const [bus] = useState(() => new EventTarget());
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        let socket;
        let isCancelled = false;

        const connect = async () => {
            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;

            if (!token || isCancelled) return;

            setUserId(data.session.user.id);

            socket = new WebSocket(toWebSocketUrl(token));

            socket.onmessage = (event) => {
                const { type, payload } = JSON.parse(event.data);
                bus.dispatchEvent(new CustomEvent(type, { detail: payload }));
            };
        };

        connect();

        return () => {
            isCancelled = true;
            socket?.close();
        };
    }, [bus]);

    return (
        <ChatSocketContext.Provider value={{ bus, userId }}>
            {children}
        </ChatSocketContext.Provider>
    );
}

export function useChatEvent(type, handler) {
    const context = useContext(ChatSocketContext);

    useEffect(() => {
        if (!context?.bus) return;

        const listener = (event) => handler(event.detail);
        context.bus.addEventListener(type, listener);

        return () => context.bus.removeEventListener(type, listener);
    }, [context?.bus, type, handler]);
}

export function useChatUserId() {
    const context = useContext(ChatSocketContext);
    return context?.userId ?? null;
}
