import type { ReactNode } from "react";

// Label + control generico para formularios del panel (ver docs/design del
// rediseno /progress). Separa el label del componente de input real
// (TextInput.tsx u otro) para poder reusar el mismo par label/hint con
// cualquier control.
export default function Field({
  label,
  hint,
  htmlFor,
  children,
  className = "",
}: {
  label?: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-p-small font-medium text-navy/70">
          {label}
        </label>
      )}
      {children}
      {hint && <p className="mt-1.5 text-p-caption text-navy/50">{hint}</p>}
    </div>
  );
}
