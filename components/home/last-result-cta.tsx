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
              First-time visitors will see an empty-state version of this section. Once the interactive quiz and
              result routes land in the next tasks, this card will surface your latest local IMSB type on the same
              device.
            </p>
          )}
        </div>
        <button className="home-button home-button--disabled" type="button" disabled aria-disabled="true">
          {hasLatestResult ? "Result page coming next" : "Save a result in the next task"}
        </button>
      </div>
      <p className="home-helper-copy">
        {hasLatestResult
          ? "Local result memory is already in place. The dedicated `/result` route is intentionally held for the next task, so this page stays non-broken in the meantime."
          : "This section is intentionally present on the homepage for everyone. It stays informative now, then becomes result-aware once the interactive pages are added."}
      </p>
    </section>
  );
}
