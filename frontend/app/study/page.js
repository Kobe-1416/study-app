"use client";

import { useState } from "react";
import Link from "next/link";

export default function StudyPage() {
  const [section, setSection] = useState(1);

  const sections = [
    {
      title: "Linear Search",
      notes:
        "Linear search checks each item in a list one at a time until the item being searched for is found.",
    },
    {
      title: "Binary Search",
      notes:
        "Binary search works by repeatedly dividing a sorted list in half to find the item being searched for.",
    },
  ];

  const currentSection = sections[section - 1];

  function finishSection() {
    if (section < sections.length) {
      setSection(section + 1);
    }
  }

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Introduction to Algorithms</h1>

      <p>
        Section {section} of {sections.length}
      </p>

      <h2>{currentSection.title}</h2>

      <p>{currentSection.notes}</p>

      <Link href="/chat">
        <button
          style={{
            padding: "12px 24px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          ❓ Ask a Question
        </button>
      </Link>

      <button
        onClick={finishSection}
        disabled={section === sections.length}
        style={{
          padding: "12px 24px",
          cursor: section === sections.length ? "not-allowed" : "pointer",
        }}
      >
        Finish Section →
      </button>
    </main>
  );
}