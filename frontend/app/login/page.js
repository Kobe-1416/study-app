"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setError(error.message);
            return;
        }

        router.push("/tracking");
    }

    return (
        <main className="page">
            <div className="card">
                <p className="eyebrow">Study Account</p>
                <h1>Welcome back</h1>
                <div className="rule" />

                <p className="subtitle">
                    Log in to pick up your study sessions where you left off.
                </p>

                <form onSubmit={handleLogin}>
                    <label>
                        <span>Email</span>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        <span>Password</span>
                        <input
                            type="password"
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    <button type="submit">Login</button>
                </form>

                {error && (
                    <p className="status error">
                        {error}
                    </p>
                )}
            </div>

            <style jsx>{`
                .page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f5f4ef;
                    padding: 24px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                        Roboto, Helvetica, Arial, sans-serif;
                }

                .card {
                    width: 100%;
                    max-width: 380px;
                    background: #ffffff;
                    border: 1px solid #dcd8ce;
                    border-radius: 6px;
                    padding: 40px 36px;
                }

                .eyebrow {
                    margin: 0 0 6px 0;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #3a5a6b;
                }

                h1 {
                    margin: 0;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 24px;
                    font-weight: 400;
                    color: #242424;
                }

                .rule {
                    width: 32px;
                    height: 2px;
                    background: #3a5a6b;
                    margin: 14px 0;
                }

                .subtitle {
                    margin: 0 0 28px 0;
                    font-size: 14px;
                    line-height: 1.5;
                    color: #6b6b6b;
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                label {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                label span {
                    font-size: 12px;
                    font-weight: 600;
                    color: #3f3f3f;
                }

                input {
                    font-family: inherit;
                    font-size: 14px;
                    padding: 10px 12px;
                    border: 1px solid #dcd8ce;
                    border-radius: 4px;
                    background: #fafaf7;
                    color: #242424;
                    outline: none;
                }

                input:focus {
                    border-color: #3a5a6b;
                    background: #ffffff;
                }

                button {
                    margin-top: 8px;
                    font-family: inherit;
                    font-size: 14px;
                    font-weight: 600;
                    padding: 11px 16px;
                    border: none;
                    border-radius: 4px;
                    background: #3a5a6b;
                    color: #ffffff;
                    cursor: pointer;
                }

                button:hover {
                    background: #2f4858;
                }

                .status {
                    margin: 20px 0 0 0;
                    font-size: 13px;
                    line-height: 1.5;
                    padding: 10px 12px;
                    border-radius: 4px;
                }

                .status.error {
                    color: #b3261e;
                    background: #fbeceb;
                }
            `}</style>
        </main>
    );
}