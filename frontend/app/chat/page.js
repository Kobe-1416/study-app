"use client";

import { useCallback, useEffect, useState } from "react";
import QuestionCard from "../../components/QuestionCard";
import AskQuestionForm from "../../components/AskQuestionForm";
import { fetchQuestions, postQuestion } from "../../lib/chatApi";
import { ChatSocketProvider, useChatEvent } from "../../lib/chatSocket";

function ChatPageContent() {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuestions()
            .then(setQuestions)
            .catch((err) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    useChatEvent(
        "question:created",
        useCallback((question) => {
            setQuestions((current) =>
                current.some((existing) => existing.id === question.id)
                    ? current
                    : [question, ...current]
            );
        }, [])
    );

    const handleAskQuestion = async (questionText) => {
        await postQuestion(questionText);
    };

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
            <h1 className="text-2xl font-semibold">Study Chat</h1>

            <AskQuestionForm onSubmit={handleAskQuestion} />

            {error && <p className="text-sm text-red-500">{error}</p>}
            {isLoading && <p className="text-sm text-zinc-500">Loading questions...</p>}

            <div className="flex flex-col gap-4">
                {questions.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                ))}
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <ChatSocketProvider>
            <ChatPageContent />
        </ChatSocketProvider>
    );
}
