export default function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-pill bg-navy/10"
    >
      <div
        className="h-full rounded-pill bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
