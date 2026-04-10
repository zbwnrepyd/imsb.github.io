"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readLatestResult, type LatestResult } from "@/lib/storage";

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

  return (
    <section className="home-section home-last-result" aria-label="Your saved result">
      <p className="home-section-kicker">Welcome back, typed creature</p>
      <div className="home-last-result__body">
        <div>
          <h2>View your last IMSB result</h2>
          <p>
            Your browser still remembers <strong>{latestResult.payload.finalType.code}</strong>, also known as{" "}
            <strong>{latestResult.payload.finalType.cn}</strong>.
            {formattedDate ? ` Saved on ${formattedDate}.` : ""}
          </p>
        </div>
        <Link className="home-button" href="/result">
          Open last result
        </Link>
      </div>
    </section>
  );
}
