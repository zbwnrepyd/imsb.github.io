import type { VisibleQuizQuestion } from "@/lib/quiz-engine";

type QuestionCardProps = {
  question: VisibleQuizQuestion;
  index: number;
  selectedValue?: number;
  disabled?: boolean;
  onAnswer: (questionId: string, value: number) => void;
};

const optionCodes = ["A", "B", "C", "D"];

export function QuestionCard({
  question,
  index,
  selectedValue,
  disabled = false,
  onAnswer,
}: QuestionCardProps) {
  const isSpecialQuestion = "special" in question && question.special;

  return (
    <article className="quiz-card">
      <div className="quiz-card__meta">
        <span className="quiz-card__badge">第 {index + 1} 题</span>
        <span>{isSpecialQuestion ? "补充题" : "维度已隐藏"}</span>
      </div>
      <h2 className="quiz-card__title">{question.text}</h2>
      <div className="quiz-options" role="radiogroup" aria-label={`Question ${index + 1}`}>
        {question.options.map((option, optionIndex) => {
          const checked = selectedValue === option.value;

          return (
            <label
              key={`${question.id}-${option.value}`}
              className={`quiz-option${checked ? " quiz-option--selected" : ""}`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={checked}
                disabled={disabled}
                onChange={() => onAnswer(question.id, option.value)}
              />
              <span className="quiz-option__code">{optionCodes[optionIndex] ?? optionIndex + 1}</span>
              <span className="quiz-option__label">{option.label}</span>
            </label>
          );
        })}
      </div>
    </article>
  );
}
