interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = total === 0 ? 0 : (current / total) * 100;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 w-full h-[3px] bg-line z-50"
    >
      <div
        className="h-full bg-accent transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
