import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://imsbtest.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SBTI Personality Test | Funny MBTI Parody Test",
    template: "%s | SBTI",
  },
  description:
    "Take the SBTI personality test, a funny MBTI parody personality test with meme energy, weirdly specific types, and entertainment-first results.",
  applicationName: "SBTI",
  keywords: [
    "sbti",
    "mbti",
    "personality",
    "test",
    "personality test",
    "funny personality test",
    "parody personality test",
    "mbti parody test",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SBTI Personality Test | Funny MBTI Parody Test",
    description:
      "SBTI is a funny personality test and MBTI parody test with chaotic prompts, odd results, and zero clinical ambition.",
    url: siteUrl,
    siteName: "SBTI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SBTI Personality Test | Funny MBTI Parody Test",
    description:
      "Take a funny personality test with meme energy, parody logic, and weirdly memorable SBTI result types.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "entertainment",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
