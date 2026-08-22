"use client";

import { useState } from "react";

export default function AskQuestionForm({ onSubmit }) {
    const [questionText, setQuestionText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!questionText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit(questionText.trim());
            setQuestionText("");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={questionText}
                onChange={(event) => setQuestionText(event.target.value)}
                placeholder="Ask a question..."
                className="flex-1 rounded-full border border-black/10 px-4 py-2 text-sm dark:border-white/15 dark:bg-transparent"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background disabled:opacity-50"
            >
                Ask
            </button>
        </form>
    );
}
