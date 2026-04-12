import { dimensionOrder, questions } from "@/lib/quiz-data";

export function Hero() {
  return (
    <section className="home-hero home-section">
      <div className="home-hero__copy">
        <p className="home-eyebrow">IMSB is not your therapist.</p>
        <h1>IMSB is a funny personality test for people who want MBTI energy without clinical dignity.</h1>
        <p className="home-lead">
          The IMSB personality test is an entertainment-first MBTI parody test. It borrows the structure,
          curiosity, and type-collecting chaos of a classic personality test, then adds meme logic, strange
          questions, and results that feel a little too specific for comfort.
        </p>
        <div className="home-cta-row">
          <button className="home-button home-button--disabled" type="button" disabled aria-disabled="true">
            Interactive quiz unavailable here
          </button>
          <a className="home-button home-button--ghost" href="#result-previews">
            Preview the types
          </a>
        </div>
        <p className="home-helper-copy">
          This page is the readable guide to IMSB. The disabled button keeps the landing page informative without
          sending visitors into a dead end.
        </p>
        <ul className="home-tag-list" aria-label="Landing page highlights">
          <li>{questions.length} core questions</li>
          <li>{dimensionOrder.length} dimensions of nonsense</li>
          <li>MBTI parody test</li>
          <li>Entertainment only</li>
        </ul>
      </div>
      <aside className="home-hero__aside" aria-label="Why this page exists">
        <div className="home-note home-note--tilted">
          <p className="home-note__title">Why people land here</p>
          <p>
            Usually because they searched for an MBTI personality test, a funny personality test, or something
            suspiciously close to "what is IMSB and why is everyone posting weird result cards?"
          </p>
        </div>
        <div className="home-stat-card">
          <p className="home-stat-card__label">Best use case</p>
          <p className="home-stat-card__value">
            A parody personality test for curious, online, mildly unwell friends.
          </p>
        </div>
      </aside>
    </section>
  );
}
