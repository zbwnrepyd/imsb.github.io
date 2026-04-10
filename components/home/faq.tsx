export const faqItems = [
  {
    question: "Is IMSB a real psychological assessment?",
    answer:
      "No. IMSB is an entertainment-first personality test and a parody personality test. It is designed for fun, self-mockery, and oddly accurate group chats, not diagnosis.",
  },
  {
    question: "Why does this page mention MBTI so much?",
    answer:
      "Because people already understand the basic idea of being sorted into a type. IMSB uses that familiarity to explain itself, but it does not present itself as official MBTI or clinical personality science.",
  },
  {
    question: "What makes IMSB different from a normal personality test?",
    answer:
      "The writing is weirder, the premise is more playful, and the result types lean into parody. IMSB keeps enough structure to feel like a real test while staying very clear that the product is comedy.",
  },
  {
    question: "Can I see my last result later?",
    answer:
      "Yes, if your browser storage is available. IMSB can remember the latest local result on the same device so you can jump back in without retaking the full quiz.",
  },
  {
    question: "Should I take my result seriously?",
    answer:
      "Take it seriously in the same way you would take a meme that accidentally understood you: enough to laugh, enough to share, and not enough to replace actual mental health advice.",
  },
] as const;

export function Faq() {
  return (
    <section className="home-section" id="faq">
      <p className="home-section-kicker">FAQ</p>
      <div className="home-section-heading">
        <h2>Questions people ask before trusting a suspiciously funny personality test</h2>
        <p>
          Fair questions. IMSB looks like a personality test because that format is useful. It also looks like a
          joke because that is the point.
        </p>
      </div>
      <div className="home-faq-list">
        {faqItems.map((item) => (
          <article className="home-faq-item" key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
