"use client";

import { useState } from "react";

export default function Home() {
  const [currentSection, setCurrentSection] = useState(1);

  const colors = ["lightblue", "lightgreen", "lightcoral", "lightyellow", "plum",];

  function finishSection() {
    if (currentSection < 20) {
      setCurrentSection(currentSection + 1);
    }
  }

  return (
    <main>
      <h1>Self-Study</h1>

      <div className="section-box" style={{ backgroundColor: colors[(currentSection - 1) % colors.length] }}>
        Section {currentSection}
      </div>

      <button onClick={finishSection}>
        Finished Section
      </button>
    </main>
  );
}