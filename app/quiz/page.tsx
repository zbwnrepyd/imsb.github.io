import type { Metadata } from "next";
import { QuizShell } from "@/components/quiz/quiz-shell";

export const metadata: Metadata = {
  title: "Quiz",
  description: "Take the SBTI quiz and keep your progress in the current browser.",
};

export default function QuizPage() {
  return (
    <main className="quiz-page">
      <QuizShell />
    </main>
  );
}
