import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IMSB Personality Test",
  description: "A funny MBTI parody personality test with weird results and meme energy."
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
