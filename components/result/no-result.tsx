import Link from "next/link";

export function NoResult() {
  return (
    <section className="result-card result-card--empty">
      <p className="result-kicker">No result yet</p>
      <h1>Your IMSB result will show up here after you finish the quiz.</h1>
      <p className="result-copy">
        The result page is ready, but there is no completed personality test in this browser yet.
      </p>
      <div className="result-actions">
        <Link className="result-button" href="/quiz">
          Start the quiz
        </Link>
        <Link className="result-button result-button--ghost" href="/">
          Back to homepage
        </Link>
      </div>
    </section>
  );
}
