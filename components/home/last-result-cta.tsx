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

  if (!latestResult) {
    return null;
  }

  const formattedDate = formatCreatedAt(latestResult.createdAt);
  const englishLabel = resultCodeGlosses[latestResult.payload.finalType.code] ?? "Unknown Gremlin";

  return (
    <section className="home-section home-last-result" aria-label="Your saved result">
      <p className="home-section-kicker">Welcome back, typed creature</p>
      <div className="home-last-result__body">
        <div>
          <h2>View your last IMSB result</h2>
          <p>
            Your browser still remembers <strong>{latestResult.payload.finalType.code}</strong>, which this landing
            page labels as <strong>{englishLabel}</strong>.
            {formattedDate ? ` Saved on ${formattedDate}.` : ""}
          </p>
        </div>
        <button className="home-button home-button--disabled" type="button" disabled aria-disabled="true">
          Result page coming next
        </button>
      </div>
      <p className="home-helper-copy">
        Local result memory is already in place. The dedicated `/result` route is intentionally held for the next
        task, so this page stays non-broken in the meantime.
      </p>
    </section>
  );
}
