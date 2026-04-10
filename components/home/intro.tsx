import { dimensionOrder, questions } from "@/lib/quiz-data";

const dimensionCount = dimensionOrder.length;
const questionCount = questions.length;

export function Intro() {
  return (
    <section className="home-section home-prose" id="what-is-imsb">
      <p className="home-section-kicker">What this personality test is actually doing</p>
      <h2>What is the IMSB personality test?</h2>
      <p>
        IMSB is a personality test in the same cultural neighborhood as MBTI, but it is deliberately not a
        professional psychological assessment. Think of it as an MBTI parody test that understands why people
        love personality language, then pushes that language into comedy, internet melodrama, and a little
        affectionate nonsense.
      </p>
      <p>
        That matters for SEO and for actual humans: if you searched for "personality test", "funny personality
        test", "parody personality test", or "mbti parody test", you are in the right place. The page exists to
        explain the joke clearly. IMSB uses a structured quiz format because that structure is fun, familiar, and
        strangely compelling, not because it wants to diagnose your soul.
      </p>
      <div className="home-columns">
        <article className="home-card">
          <h3>Why IMSB exists</h3>
          <p>
            Serious personality frameworks tend to attract serious interpretation. IMSB goes the other way. It
            treats the personality test format like a stage prop: useful for drama, useful for identity play,
            useful for sending friends a result and saying "this is painfully you."
          </p>
        </article>
        <article className="home-card">
          <h3>How the test works</h3>
          <p>
            The current version uses {questionCount} core questions across {dimensionCount} dimensions, with a
            hidden detour for people who answer in a very specific, very suspicious way. That combination keeps
            the quiz short enough to finish and weird enough to remember.
          </p>
        </article>
      </div>
      <article className="home-card home-card--wide">
        <h3>So is IMSB basically MBTI?</h3>
        <p>
          Not really. IMSB is closer to a parody personality test inspired by the habits around MBTI than to MBTI
          itself. It borrows the pleasure of being "typed", but the voice, outcome logic, and tone are
          entertainment-first. The goal is not scientific certainty. The goal is a funny result that still feels
          like it observed something embarrassingly real.
        </p>
      </article>
    </section>
  );
}
