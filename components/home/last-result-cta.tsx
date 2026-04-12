"use client";

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
        <button className="home-button home-button--disabled" type="button" disabled aria-disabled="true">
          {hasLatestResult ? "Saved result stays on this page" : "Result summary unavailable"}
        </button>
      </div>
      <p className="home-helper-copy">
        {hasLatestResult
          ? "IMSB can remember your latest local result on the current device. This homepage keeps that memory visible in a lightweight way."
          : "It is a simple spot for checking your type again without rereading the whole page."}
      </p>
    </section>
  );
}
