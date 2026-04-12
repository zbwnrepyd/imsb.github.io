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
        {hasLatestResult ? "Welcome back, typed creature" : "No local result yet"}
      </p>
      <div className="home-last-result__body">
        <div>
          <h2>{hasLatestResult ? "View your last IMSB result" : "Your latest result will show up here later"}</h2>
          {hasLatestResult ? (
            <p>
              Your browser still remembers <strong>{latestResult.payload.finalType.code}</strong>, which this
              landing page labels as <strong>{englishLabel}</strong>.
              {formattedDate ? ` Saved on ${formattedDate}.` : ""}
            </p>
          ) : (
            <p>
              This is the empty-state version of the saved-result card. If IMSB ever stores a local result on this
              device, this section can surface the latest type without disrupting the article-style homepage.
            </p>
          )}
        </div>
        <button className="home-button home-button--disabled" type="button" disabled aria-disabled="true">
          {hasLatestResult ? "Saved result stays on this page" : "No saved result on this device"}
        </button>
      </div>
      <p className="home-helper-copy">
        {hasLatestResult
          ? "IMSB can remember your latest local result on the current device. This homepage keeps that memory visible in a lightweight way."
          : "This section stays visible for every visitor so the homepage keeps a stable structure whether or not any local IMSB result exists yet."}
      </p>
    </section>
  );
}
