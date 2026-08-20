const { createRemoteJWKSet, jwtVerify } = require("jose");

const JWKS = createRemoteJWKSet(
    new URL(process.env.SUPABASE_JWKS_URL)
);

async function verifyWebSocketToken(token) {
    try {
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: `${process.env.SUPABASE_URL}/auth/v1`,
            audience: "authenticated"
        });

        return payload;
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return null;
    }
}

module.exports = verifyWebSocketToken;