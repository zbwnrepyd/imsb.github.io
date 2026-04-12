import { ChineseNotes } from "@/components/home/chinese-notes";
import { Faq, faqItems } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { LastResultCta } from "@/components/home/last-result-cta";
import { ResultPreviews } from "@/components/home/result-previews";

const siteUrl = "https://imsbtest.com";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      name: "SBTI",
      url: siteUrl,
      description:
        "SBTI is a funny MBTI parody personality test with weird results, meme energy, and entertainment-first personality typing.",
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}#webpage`,
      name: "SBTI Personality Test | Funny MBTI Parody Test",
      url: siteUrl,
      description:
        "Take the SBTI personality test, an entertainment-first MBTI parody test for people who want a funny personality test instead of a clinical report.",
      isPartOf: {
        "@id": `${siteUrl}#website`,
      },
      about: ["SBTI", "MBTI parody test", "funny personality test", "personality test"],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <main className="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="home-shell">
        <Hero />
        <LastResultCta />
        <Intro />
        <ResultPreviews />
        <ChineseNotes />
        <Faq />
      </div>
    </main>
  );
}
