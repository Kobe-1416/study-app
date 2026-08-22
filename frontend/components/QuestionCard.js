"use client";

import { useCallback, useEffect, useState } from "react";
import AnswerCard from "./AnswerCard";
import { fetchAnswers, postAnswer, toggleAnswerLike } from "../lib/chatApi";
import { useChatEvent, useChatUserId } from "../lib/chatSocket";

export default function QuestionCard({ question }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [answers, setAnswers] = useState(null);
    const [answerText, setAnswerText] = useState("");
    const isLoading = isExpanded && answers === null;
    const myUserId = useChatUserId();

    useEffect(() => {
        if (!isExpanded || answers !== null) return;

        let cancelled = false;

        fetchAnswers(question.id).then((data) => {
            if (!cancelled) setAnswers(data);
        });

        return () => {
            cancelled = true;
        };
    }, [isExpanded, answers, question.id]);

    useChatEvent(
        "answer:created",
        useCallback(
            (answer) => {
                if (answer.question_id !== question.id) return;

                setAnswers((current) => {
                    if (current === null) return current;
                    if (current.some((existing) => existing.id === answer.id)) return current;
                    return [...current, answer];
                });
            },
            [question.id]
        )
    );

    useChatEvent(
        "answer:like-toggled",
        useCallback(
            ({ answerId, userId, liked }) => {
                setAnswers((current) => {
                    if (current === null) return current;
                    return current.map((answer) =>
                        answer.id === answerId
                            ? {
                                  ...answer,
                                  likeCount: answer.likeCount + (liked ? 1 : -1),
                                  likedByMe: userId === myUserId ? liked : answer.likedByMe,
                              }
                            : answer
                    );
                });
            },
            [myUserId]
        )
    );

    const handleAnswerSubmit = async (event) => {
        event.preventDefault();
        if (!answerText.trim()) return;

        await postAnswer(question.id, answerText.trim());
        setAnswerText("");
    };

    const handleToggleLike = async (answerId) => {
        await toggleAnswerLike(answerId);
    };

    return (
        <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
            <button onClick={() => setIsExpanded((current) => !current)} className="w-full text-left">
                <p className="text-xs text-zinc-500">
                    {question.author?.display_name || question.author?.username || "Anonymous"}
                </p>
                <p className="text-base font-medium">{question.question_text}</p>
            </button>

            {isExpanded && (
                <div className="mt-4 flex flex-col gap-3 border-t border-black/5 pt-4 dark:border-white/10">
                    {isLoading && <p className="text-sm text-zinc-500">Loading answers...</p>}

                    {(answers || []).map((answer) => (
                        <AnswerCard key={answer.id} answer={answer} onToggleLike={handleToggleLike} />
                    ))}

                    <form onSubmit={handleAnswerSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={answerText}
                            onChange={(event) => setAnswerText(event.target.value)}
                            placeholder="Write an answer..."
                            className="flex-1 rounded-full border border-black/10 px-4 py-2 text-sm dark:border-white/15 dark:bg-transparent"
                        />
                        <button
                            type="submit"
                            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
                        >
                            Reply
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
