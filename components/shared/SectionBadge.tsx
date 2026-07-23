export default function SectionBadge({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-navy/50">
      <span className="h-px w-8 bg-navy/20" />
      {label}
    </div>
  );
}
