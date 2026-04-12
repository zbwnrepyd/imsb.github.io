"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ProgressBar } from "@/components/quiz/progress-bar";
import { QuestionCard } from "@/components/quiz/question-card";
import {
  applyAnswer,
  computeResult,
  createQuestionOrder,
  getQuizProgress,
  getVisibleQuestions,
  isQuestionOrderValid,
  normalizeQuizAnswers,
  type QuizQuestionOrder,
} from "@/lib/quiz-engine";
import {
  STORAGE_VERSION,
  clearQuizProgress,
  readQuizProgress,
  saveLatestResult,
  saveQuizProgress,
} from "@/lib/storage";

type QuizSession = {
  questionOrder: QuizQuestionOrder;
  answers: Record<string, number>;
};

export function QuizShell() {
  const router = useRouter();
  const [isRouting, startTransition] = useTransition();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [restoreState, setRestoreState] = useState<"fresh" | "restored">("fresh");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const cachedProgress = readQuizProgress();

    if (cachedProgress && isQuestionOrderValid(cachedProgress.questionOrder)) {
      const answers = normalizeQuizAnswers(cachedProgress.answers);

      setSession({
        questionOrder: cachedProgress.questionOrder,
        answers,
      });
      setRestoreState("restored");
      return;
    }

    if (cachedProgress) {
      clearQuizProgress();
    }

    setSession({
      questionOrder: createQuestionOrder(),
      answers: {},
    });
    setRestoreState("fresh");
  }, []);

  if (!session) {
    return (
      <div className="quiz-shell">
        <section className="quiz-shell__hero quiz-shell__hero--loading">
          <p className="quiz-shell__eyebrow">quiz booting</p>
          <h1>正在恢复你的答题现场。</h1>
          <p>浏览器里的本地进度会在这里接回；如果没有缓存，就从一套新的题序开始。</p>
        </section>
      </div>
    );
  }

  const activeSession = session;
  const visibleQuestions = getVisibleQuestions(activeSession.questionOrder, activeSession.answers);
  const progress = getQuizProgress(activeSession.questionOrder, activeSession.answers);

  function persistProgress(nextSession: QuizSession) {
    saveQuizProgress({
      version: STORAGE_VERSION,
      questionOrder: nextSession.questionOrder,
      answers: nextSession.answers,
      updatedAt: new Date().toISOString(),
    });
  }

  function handleAnswer(questionId: string, value: number) {
    const nextAnswers = applyAnswer(activeSession.answers, questionId, value);
    const nextSession = {
      questionOrder: activeSession.questionOrder,
      answers: nextAnswers,
    };

    setSession(nextSession);
    setErrorMessage(null);
    persistProgress(nextSession);
  }

  function handleComplete() {
    if (!progress.complete || isRouting) {
      return;
    }

    try {
      const result = computeResult(activeSession.answers);

      saveLatestResult({
        version: STORAGE_VERSION,
        typeCode: result.finalType.code,
        payload: result,
        createdAt: new Date().toISOString(),
      });
      clearQuizProgress();

      startTransition(() => {
        router.push("/result");
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "问卷还没准备好提交，请再检查一次答题状态。",
      );
    }
  }

  return (
    <div className="quiz-shell">
      <section className="quiz-shell__hero">
        <p className="quiz-shell__eyebrow">imsb quiz</p>
        <h1>把题做完，系统才会给你发电子人格。</h1>
        <p className="quiz-shell__lead">
          进度会自动保存在当前浏览器。隐藏饮酒分支和原始插题逻辑都会继续生效。
        </p>
        <div className="quiz-shell__status-row">
          <span className="quiz-shell__status">
            {restoreState === "restored" ? "已恢复上次答题进度" : "已为你生成新的答题顺序"}
          </span>
          <Link className="quiz-shell__back" href="/">
            返回首页
          </Link>
        </div>
        <ProgressBar answered={progress.answered} total={progress.total} />
      </section>

      <section className="quiz-shell__questions" aria-label="Quiz questions">
        {visibleQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            selectedValue={activeSession.answers[question.id]}
            disabled={isRouting}
            onAnswer={handleAnswer}
          />
        ))}
      </section>

      <section className="quiz-shell__footer">
        <p className="quiz-shell__hint">
          {progress.complete
            ? "都答完了。现在可以把你的电子魂魄交给结果页审判。"
            : "全选完才会放行。世界已经够乱了，起码把题做完整。"}
        </p>
        {errorMessage ? <p className="quiz-shell__error">{errorMessage}</p> : null}
        <button
          type="button"
          className="quiz-shell__submit"
          disabled={!progress.complete || isRouting}
          onClick={handleComplete}
        >
          {isRouting ? "跳转中..." : "查看结果"}
        </button>
      </section>
    </div>
  );
}
