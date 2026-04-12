"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readLatestResult, type LatestResult } from "@/lib/storage";
import { dimensionMeta, type DimensionKey } from "@/lib/quiz-data";
import { NoResult } from "@/components/result/no-result";

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

export function ResultShell() {
  const [latestResult, setLatestResult] = useState<LatestResult | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setLatestResult(readLatestResult());
    setIsReady(true);
  }, []);

  const topMatches = useMemo(
    () => latestResult?.payload.ranked.slice(0, 3) ?? [],
    [latestResult],
  );

  if (!isReady) {
    return (
      <div className="result-page">
        <section className="result-card result-card--empty">
          <p className="result-kicker">Loading</p>
          <h1>Pulling your latest personality chaos back into view.</h1>
        </section>
      </div>
    );
  }

  if (!latestResult) {
    return (
      <div className="result-page">
        <div className="result-shell">
          <NoResult />
        </div>
      </div>
    );
  }

  const { payload } = latestResult;
  const createdAt = formatCreatedAt(latestResult.createdAt);

  return (
    <div className="result-page">
      <div className="result-shell">
        <section className="result-card result-card--hero">
          <p className="result-kicker">{payload.modeKicker}</p>
          <div className="result-hero">
            <div className="result-main">
              <h1>
                {payload.finalType.code}
                <span>{payload.finalType.cn}</span>
              </h1>
              <p className="result-badge">{payload.badge}</p>
              <p className="result-copy">{payload.sub}</p>
              {createdAt ? (
                <p className="result-meta">Last updated: {createdAt}</p>
              ) : null}
            </div>
            <div className="result-summary-card">
              <p className="result-summary-card__title">Original intro</p>
              <p>{payload.finalType.intro}</p>
            </div>
          </div>
        </section>

        <section className="result-grid">
          <article className="result-card">
            <p className="result-kicker">Type reading</p>
            <h2>What the test thinks of you</h2>
            <p className="result-copy result-copy--dense">{payload.finalType.desc}</p>
          </article>

          <article className="result-card">
            <p className="result-kicker">Top matches</p>
            <h2>Closest personality outcomes</h2>
            <div className="result-top-list">
              {topMatches.map((type) => (
                <div className="result-top-item" key={type.code}>
                  <div>
                    <strong>{type.code}</strong>
                    <span>{type.cn}</span>
                  </div>
                  <p>{type.similarity}%</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="result-card">
          <p className="result-kicker">Fifteen dimensions</p>
          <h2>Dimension snapshot</h2>
          <div className="result-dimensions">
            {(Object.entries(payload.rawScores) as [DimensionKey, number][]).map(([dimension, score]) => (
              <div className="result-dimension" key={dimension}>
                <strong>{dimensionMeta[dimension].name}</strong>
                <span>
                  {payload.levels[dimension]} / {score} pts
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="result-card">
          <p className="result-kicker">Disclaimer</p>
          <h2>Entertainment only</h2>
          <p className="result-copy">
            IMSB is a parody personality test. Keep the result card, send it to your friends, and
            absolutely do not treat it like medical advice, a hiring framework, or cosmic truth.
          </p>
          <div className="result-actions">
            <Link className="result-button" href="/quiz">
              Retake the quiz
            </Link>
            <Link className="result-button result-button--ghost" href="/">
              Back to homepage
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
