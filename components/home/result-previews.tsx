import { TYPE_LIBRARY } from "@/lib/quiz-data";

const previewTypes = [
  {
    code: "CTRL",
    title: "Control Goblin",
    subtitle: "A planner with final-boss calendar energy.",
    blurb:
      "The hyper-competent control freak archetype. Great at order, dangerous for anyone hoping to stay gloriously unplanned.",
  },
  {
    code: "Dior-s",
    title: "Cynical Recliner",
    subtitle: "Spiritually horizontal, intellectually alert.",
    blurb:
      "A patron saint of ironic resignation. Less \"loser\" than philosopher of opting out, preferably while horizontal.",
  },
  {
    code: "BOSS",
    title: "Steering Wheel Person",
    subtitle: "Sees confusion and immediately reaches for command.",
    blurb:
      "The steering-wheel personality. If a room feels inefficient, this type will assume command before anyone finishes complaining.",
  },
  {
    code: "FAKE",
    title: "Social Shape-Shifter",
    subtitle: "Too adaptable to ever be off-duty.",
    blurb:
      "A social shape-shifter with polished masks for every situation. Charming, adaptable, and maybe a little terrifying.",
  },
] as const;

export function ResultPreviews() {
  return (
    <section className="home-section" id="result-previews">
      <p className="home-section-kicker">Preview the result vibe</p>
      <div className="home-section-heading">
        <h2>Some SBTI types look like MBTI cousins. Then they get weird.</h2>
        <p>
          The point of these previews is not clinical accuracy. It is tone-setting. SBTI results are dramatic,
          playful, and intentionally over-written in the best possible way.
        </p>
      </div>
      <div className="home-preview-grid">
        {previewTypes.map(({ code, title, subtitle, blurb }) => {
          const type = TYPE_LIBRARY[code];

          return (
            <article className="home-preview-card" key={code}>
              <p className="home-preview-card__code">{type.code}</p>
              <h3>
                {title} <span>{subtitle}</span>
              </h3>
              <p>
                <strong>{code}</strong> is the SBTI result code. {blurb}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
