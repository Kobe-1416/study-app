"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function handleSignup(e) {
        e.preventDefault();

        setError("");
        setMessage("");

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                }
            }
        });

        if (error) {
            setError(error.message);
            return;
        }

        setMessage("Signup successful. Check your email to verify your account.");
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#f5f4ef] px-6 font-sans">
            <div className="w-full max-w-[380px] rounded-md border border-[#dcd8ce] bg-white p-10">
                <p className="mb-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#3a5a6b]">
                    Study Account
                </p>

                <h1 className="font-serif text-2xl font-normal text-[#242424]">
                    Create your account
                </h1>

                <div className="my-3.5 h-0.5 w-8 bg-[#3a5a6b]" />

                <p className="mb-7 text-sm leading-relaxed text-[#6b6b6b]">
                    Set up your account to start tracking your study sessions.
                </p>

                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-[#3f3f3f]">
                            Name
                        </span>
                        <input
                            type="text"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="rounded-md border border-[#dcd8ce] bg-[#fafaf7] px-3 py-2.5 text-sm text-[#242424] outline-none transition-colors placeholder:text-[#a3a099] focus:border-[#3a5a6b] focus:bg-white"
                        />
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-[#3f3f3f]">
                            Email
                        </span>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="rounded-md border border-[#dcd8ce] bg-[#fafaf7] px-3 py-2.5 text-sm text-[#242424] outline-none transition-colors placeholder:text-[#a3a099] focus:border-[#3a5a6b] focus:bg-white"
                        />
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-[#3f3f3f]">
                            Password
                        </span>
                        <input
                            type="password"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="rounded-md border border-[#dcd8ce] bg-[#fafaf7] px-3 py-2.5 text-sm text-[#242424] outline-none transition-colors placeholder:text-[#a3a099] focus:border-[#3a5a6b] focus:bg-white"
                        />
                    </label>

                    <button
                        type="submit"
                        className="mt-2 rounded-md border border-[#3a5a6b] bg-[#3a5a6b] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f4858] hover:border-[#2f4858] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3a5a6b] focus-visible:outline-offset-2"
                    >
                        Sign Up
                    </button>
                </form>

                {error && (
                    <p className="mt-5 rounded-md bg-[#fbeceb] px-3 py-2.5 text-sm leading-relaxed text-[#b3261e]">
                        {error}
                    </p>
                )}
                {message && (
                    <p className="mt-5 rounded-md bg-[#edf3ee] px-3 py-2.5 text-sm leading-relaxed text-[#3f6b4e]">
                        {message}
                    </p>
                )}
            </div>
        </main>
    );
}