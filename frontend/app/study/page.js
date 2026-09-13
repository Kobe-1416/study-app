"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Home() {
  const [currentSection, setCurrentSection] = useState(1);
  const [status, setStatus] = useState(null); // { type: "success" | "error", message: string }
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(null); // { completed, total, percent }
  const [loadingProgress, setLoadingProgress] = useState(true);

  const colors = ["lightblue", "lightgreen", "lightcoral", "lightyellow", "plum"];

  const sectionColor = colors[(currentSection - 1) % colors.length];

  // TODO (4c): replace these with values derived from `progress`
  const TOTAL_SECTIONS = 20;
  const progressPercent = Math.round((currentSection / TOTAL_SECTIONS) * 100);
  const isComplete = currentSection >= TOTAL_SECTIONS;

  async function fetchProgress() {
    try {
      setLoadingProgress(true);
      const res = await fetch(`${API_URL}/progress?user_id=4`);
      if (!res.ok) throw new Error("Failed to fetch progress");
      const data = await res.json();
      setProgress(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProgress(false);
    }
  }

  async function finishSection() {
    try {
      setSaving(true);
      setStatus(null);

      const res = await fetch(`${API_URL}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section_id: currentSection, user_id: 1 }),
      });

      if (!res.ok) {
        console.log(res);
        throw new Error("Failed to save section");
      }

      setCurrentSection((s) => (s < TOTAL_SECTIONS ? s + 1 : s));
      setStatus({ type: "success", message: "Section saved. Keep going!" });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Unable to save your progress. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f4ef] px-6 py-12 font-sans">
      <div className="mx-auto w-full max-w-[720px]">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#3a5a6b]">
            Study Progress
          </p>

          <h1 className="font-serif text-3xl font-normal text-[#242424]">
            Self-Study
          </h1>

          <div className="my-3.5 h-0.5 w-8 bg-[#3a5a6b]" />

          <p className="text-sm leading-relaxed text-[#6b6b6b]">
            Work through each section at your own pace. Your progress is saved as
            you go.
          </p>
        </div>

        {/* Study card */}
        <div className="rounded-md border border-[#dcd8ce] bg-white">

          {/* Card header: section + progress */}
          <div className="flex items-center justify-between gap-4 border-b border-[#dcd8ce] px-6 py-5">
            <div className="flex items-center gap-4">

              <div
                className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold text-[#242424]"
                style={{ backgroundColor: sectionColor }}
              >
                {currentSection}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#242424]">
                  Section {currentSection}
                </p>

                <p className="mt-0.5 text-xs text-[#8a8780]">
                  of {TOTAL_SECTIONS} sections
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-serif text-xl text-[#242424]">
                {progressPercent}%
              </p>

              <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#8a8780]">
                complete
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">

            {/* Progress bar */}
            <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#f5f4ef]">
              <div
                className="h-full rounded-full bg-[#3a5a6b] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Current section */}
            <div
              className="mb-6 rounded-md border border-[#ebe8e1] px-6 py-10 text-center"
              style={{ backgroundColor: sectionColor }}
            >
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#3f3f3f]">
                Now studying
              </p>

              <p className="mt-1.5 font-serif text-3xl font-normal text-[#242424]">
                Section {currentSection}
              </p>
            </div>

            {/* Action */}
            <button
              onClick={finishSection}
              disabled={saving || isComplete}
              className="w-full rounded-md bg-[#3a5a6b] px-5 py-3 text-xs font-semibold tracking-[0.08em] uppercase text-white transition-colors hover:bg-[#2f4a58] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving
                ? "Saving..."
                : isComplete
                ? "All Sections Complete"
                : "Finished Section"}
            </button>

            {/* Status message */}
            {status && (
              <p
                className={`mt-4 rounded-md px-3 py-2.5 text-sm leading-relaxed ${
                  status.type === "error"
                    ? "bg-[#fbeceb] text-[#b3261e]"
                    : "bg-[#eef3ee] text-[#2f6b3f]"
                }`}
              >
                {status.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}