"use client";

import { useState } from "react";

export default function Home() {
  const [currentSection, setCurrentSection] = useState(1);
  const [status, setStatus] = useState("");

  const colors = ["lightblue", "lightgreen", "lightcoral", "lightyellow", "plum"];
  

  async function finishSection() {
    const res = await fetch("http://localhost:5000/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section_id: currentSection, user_id: 1 }),
    });

    if (res.ok) {
      setCurrentSection((s) => (s < 20 ? s + 1 : s));
    } else {
      console.error("Failed to save section");
    }
  }

  return (
    <main>
      <h1>Self-Study</h1>

      <div
        className="section-box"
        style={{ backgroundColor: colors[(currentSection - 1) % colors.length] }}
      >
        Section {currentSection}
      </div>

      <button onClick={finishSection}>Finished Section</button>

      {status && <p>{status}</p>}
    </main>
  );
}