export function createSocket(accessToken) {
    return new WebSocket(
        `ws://localhost:5000?token=${accessToken}`
    );
}