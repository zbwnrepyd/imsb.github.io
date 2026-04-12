type ProgressBarProps = {
  answered: number;
  total: number;
};

export function ProgressBar({ answered, total }: ProgressBarProps) {
  const percent = total > 0 ? (answered / total) * 100 : 0;

  return (
    <section className="quiz-progress" aria-label="Quiz progress">
      <div className="quiz-progress__header">
        <p>当前进度</p>
        <strong>
          {answered} / {total}
        </strong>
      </div>
      <div className="quiz-progress__track" aria-hidden="true">
        <div className="quiz-progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </section>
  );
}
