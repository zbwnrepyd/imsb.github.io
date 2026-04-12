"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readLatestResult, type LatestResult } from "@/lib/storage";

const resultCodeGlosses: Record<string, string> = {
  CTRL: "Control Goblin",
  "ATM-er": "Reliable Wallet Friend",
  "Dior-s": "Cynical Recliner",
  BOSS: "Steering Wheel Person",
  "THAN-K": "Weaponized Gratitude Unit",
  "OH-NO": "Catastrophe Forecaster",
  GOGO: "Immediate Action Creature",
  SEXY: "Attention Distortion Field",
  "LOVE-R": "Hopeless Romantic Maximalist",
  MUM: "Caretaker Supreme",
  FAKE: "Social Shape-Shifter",
  HHHH: "Wildcard Glitch Type",
  DRUNK: "Hidden Drunk Route",
};

function formatCreatedAt(value: string): string | null {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function LastResultCta() {
  const [latestResult, setLatestResult] = useState<LatestResult | null>(null);

  useEffect(() => {
    setLatestResult(readLatestResult());
  }, []);

  const hasLatestResult = latestResult !== null;
  const formattedDate = latestResult ? formatCreatedAt(latestResult.createdAt) : null;
  const englishLabel = latestResult
    ? resultCodeGlosses[latestResult.payload.finalType.code] ?? "Unknown Gremlin"
    : null;

  return (
    <section className="home-section home-last-result" aria-label="Your saved result or placeholder">
      <p className="home-section-kicker">
        {hasLatestResult ? "Welcome back, typed creature" : "Your result space"}
      </p>
      <div className="home-last-result__body">
        <div>
          <h2>{hasLatestResult ? "View your last IMSB result" : "Come back here after you get your IMSB type"}</h2>
          {hasLatestResult ? (
            <p>
              Your browser still remembers <strong>{latestResult.payload.finalType.code}</strong>, which this
              landing page labels as <strong>{englishLabel}</strong>.
              {formattedDate ? ` Saved on ${formattedDate}.` : ""}
            </p>
          ) : (
            <p>
              This area is for your most recent IMSB outcome. After you get a type, you can return here for a quick
              reminder of what the test decided you are.
            </p>
          )}
        </div>
        <Link className="home-button" href={hasLatestResult ? "/result" : "/quiz"}>
          {hasLatestResult ? "Open result page" : "Start the quiz"}
        </Link>
      </div>
      <p className="home-helper-copy">
        {hasLatestResult
          ? "Your latest IMSB outcome is ready if you want the full result page again."
          : "Finish the quiz once and this section will turn into a shortcut back to your latest result."}
      </p>
    </section>
  );
}
