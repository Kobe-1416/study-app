import { supabase } from "./supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const authorizedFetch = async (path, options = {}) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${response.status}`);
    }

    return response.json();
};

export const fetchQuestions = () => authorizedFetch("/questions");

export const postQuestion = (questionText) =>
    authorizedFetch("/questions", {
        method: "POST",
        body: JSON.stringify({ question_text: questionText }),
    });

export const fetchAnswers = (questionId) => authorizedFetch(`/questions/${questionId}/answers`);

export const postAnswer = (questionId, answerText) =>
    authorizedFetch(`/questions/${questionId}/answers`, {
        method: "POST",
        body: JSON.stringify({ answer_text: answerText }),
    });

export const toggleAnswerLike = (answerId) =>
    authorizedFetch(`/answers/${answerId}/like`, { method: "POST" });
