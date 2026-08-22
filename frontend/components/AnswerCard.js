export default function AnswerCard({ answer, onToggleLike }) {
    return (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-black/5 p-3 dark:border-white/10">
            <div>
                <p className="text-sm font-medium">
                    {answer.author?.display_name || answer.author?.username || "Anonymous"}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{answer.answer_text}</p>
            </div>
            <button
                onClick={() => onToggleLike(answer.id)}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                    answer.likedByMe
                        ? "border-transparent bg-foreground text-background"
                        : "border-black/10 dark:border-white/15"
                }`}
            >
                ▲ {answer.likeCount}
            </button>
        </div>
    );
}
