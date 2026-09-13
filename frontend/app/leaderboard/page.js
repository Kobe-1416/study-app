"use client";

import { useEffect, useState } from "react";

export default function Leaderboard() {
    const [currentLeaderboard, setCurrentLeaderboard] = useState("responses");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentLoading, setStudentLoading] = useState(false);

    async function getLeaderboard(type) {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/leaderboard?type=${type}`
            );

            if (!response.ok) {
                throw new Error("Failed to load leaderboard");
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError("Unable to load leaderboard.");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }

    async function getStudent(id) {
        try {
            setStudentLoading(true);
            setSelectedStudent(null);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/leaderboard/${id}`
            );
            if (!res.ok) throw new Error("Failed to load student");
            setSelectedStudent(await res.json());
        } catch (err) {
            console.error(err);
            setSelectedStudent(null);
        } finally {
            setStudentLoading(false);
        }
    }

    useEffect(() => {
        getLeaderboard(currentLeaderboard);
    }, [currentLeaderboard]);

    useEffect(() => {
        if (selectedId) getStudent(selectedId);
    }, [selectedId]);

    return (
        <main className="min-h-screen bg-[#f5f4ef] px-6 py-12 font-sans">
            <div className="mx-auto w-full max-w-[720px]">

                {/* Header */}
                <div className="mb-8">
                    <p className="mb-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#3a5a6b]">
                        Study Progress
                    </p>

                    <h1 className="font-serif text-3xl font-normal text-[#242424]">
                        Leaderboard
                    </h1>

                    <div className="my-3.5 h-0.5 w-8 bg-[#3a5a6b]" />

                    <p className="text-sm leading-relaxed text-[#6b6b6b]">
                        See how your study progress compares with other students.
                    </p>
                </div>

                {/* Leaderboard card */}
                <div className="rounded-md border border-[#dcd8ce] bg-white">

                    {/* Tabs */}
                    <div className="flex border-b border-[#dcd8ce] px-6 pt-5">
                        <button
                            onClick={() => setCurrentLeaderboard("responses")}
                            className={`mr-6 pb-3 text-xs font-semibold transition-colors ${
                                currentLeaderboard === "responses"
                                    ? "border-b-2 border-[#3a5a6b] text-[#3a5a6b]"
                                    : "text-[#8a8780] hover:text-[#3f3f3f]"
                            }`}
                        >
                            Responses
                        </button>

                        <button
                            onClick={() => setCurrentLeaderboard("points")}
                            className={`pb-3 text-xs font-semibold transition-colors ${
                                currentLeaderboard === "points"
                                    ? "border-b-2 border-[#3a5a6b] text-[#3a5a6b]"
                                    : "text-[#8a8780] hover:text-[#3f3f3f]"
                            }`}
                        >
                            Points
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">

                        {loading && (
                            <div className="py-10 text-center">
                                <p className="text-sm text-[#6b6b6b]">
                                    Loading leaderboard...
                                </p>
                            </div>
                        )}

                        {error && (
                            <p className="rounded-md bg-[#fbeceb] px-3 py-2.5 text-sm leading-relaxed text-[#b3261e]">
                                {error}
                            </p>
                        )}

                        {!loading && !error && users.length === 0 && (
                            <div className="py-10 text-center">
                                <p className="text-sm text-[#6b6b6b]">
                                    No leaderboard data available.
                                </p>
                            </div>
                        )}

                        {!loading && !error && users.length > 0 && (
                            <div className="flex flex-col">
                                {users.map((user, index) => (
                                    <div
                                        key={user.id}
                                        onClick={() => setSelectedId(user.id)}
                                        className={`flex cursor-pointer items-center justify-between py-4 transition-colors hover:bg-[#faf9f5] ${
                                            index !== users.length - 1
                                                ? "border-b border-[#ebe8e1]"
                                                : ""
                                        }`}
                                    >
                                        {/* Rank + user */}
                                        <div className="flex items-center gap-4">

                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold ${
                                                    index === 0
                                                        ? "bg-[#3a5a6b] text-white"
                                                        : "bg-[#f5f4ef] text-[#6b6b6b]"
                                                }`}
                                            >
                                                {index + 1}
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-[#242424]">
                                                    {user.username ?? "Unknown student"}
                                                </p>

                                                <p className="mt-0.5 text-xs text-[#8a8780]">
                                                    Student
                                                </p>
                                            </div>
                                        </div>

                                        {/* Score */}
                                        <div className="text-right">
                                            <p className="font-serif text-xl text-[#242424]">
                                                {user.score ?? 0}
                                            </p>

                                            <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#8a8780]">
                                                {currentLeaderboard === "responses"
                                                    ? "responses"
                                                    : "points"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 👇 MODAL — sibling of the card, inside the max-w wrapper */}
                {selectedId && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
                        onClick={() => { setSelectedId(null); setSelectedStudent(null); }}
                    >
                        <div
                            className="w-full max-w-[400px] rounded-md border border-[#dcd8ce] bg-white p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {studentLoading && (
                                <p className="text-sm text-[#6b6b6b]">Loading…</p>
                            )}

                            {!studentLoading && selectedStudent && (
                                <>
                                    <p className="mb-1 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#3a5a6b]">
                                        Student
                                    </p>

                                    <h2 className="font-serif text-2xl font-normal text-[#242424]">
                                        {selectedStudent.username}
                                    </h2>

                                    <div className="my-3 h-0.5 w-8 bg-[#3a5a6b]" />

                                    <div className="mt-4 space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-[11px] uppercase tracking-[0.08em] text-[#8a8780]">
                                                School
                                            </span>
                                            <span className="text-sm font-semibold text-[#242424]">
                                                {selectedStudent.school}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[11px] uppercase tracking-[0.08em] text-[#8a8780]">
                                                Points
                                            </span>
                                            <span className="text-sm font-semibold text-[#242424]">
                                                {selectedStudent.points}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[11px] uppercase tracking-[0.08em] text-[#8a8780]">
                                                Responses
                                            </span>
                                            <span className="text-sm font-semibold text-[#242424]">
                                                {selectedStudent.responses}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => { setSelectedId(null); setSelectedStudent(null); }}
                                        className="mt-6 w-full rounded-md bg-[#3a5a6b] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#2d4552]"
                                    >
                                        Close
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}