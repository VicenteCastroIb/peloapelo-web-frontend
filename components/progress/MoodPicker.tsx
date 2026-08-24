"use client";

import { useState } from "react";

// El eje de color va de coral (dificil) a celeste (bien) pasando por el
// lila de marca -- nunca rojo/verde. El producto no califica el dia de
// nadie como "correcto" o "incorrecto" (ver docs/design del rediseno
// /progress).
export const MOOD_SCALE = [
  { value: 1, label: "Muy difícil", color: "var(--color-coral)" },
  { value: 2, label: "Difícil", color: "color-mix(in oklab, var(--color-coral) 55%, var(--color-gradient-from))" },
  { value: 3, label: "Así así", color: "var(--color-gradient-from)" },
  { value: 4, label: "Bien", color: "color-mix(in oklab, var(--color-gradient-from) 45%, var(--color-gradient-to))" },
  { value: 5, label: "Muy bien", color: "var(--color-gradient-to)" },
] as const;

export type MoodValue = 1 | 2 | 3 | 4 | 5;

interface MoodPickerProps {
  value: MoodValue | null;
  onChange: (value: MoodValue) => void;
  size?: number;
  showLabels?: boolean;
  className?: string;
}

// Escala de animo de 5 puntos: el gesto mas repetido del producto, resuelto
// en un toque, sin confirmar. Sin seleccion los cinco quedan al 45% para
// dejar leer la escala entera antes de elegir.
export default function MoodPicker({
  value,
  onChange,
  size = 44,
  showLabels = true,
  className = "",
}: MoodPickerProps) {
  const [hover, setHover] = useState<MoodValue | null>(null);

  return (
    <div role="radiogroup" aria-label="¿Cómo estás hoy?" className={`flex gap-2.5 ${className}`}>
      {MOOD_SCALE.map((m) => {
        const selected = value === m.value;
        const lit = selected || hover === m.value;
        return (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={m.label}
            onClick={() => onChange(m.value)}
            onMouseEnter={() => setHover(m.value)}
            onMouseLeave={() => setHover(null)}
            className="flex min-h-11 flex-1 flex-col items-center gap-2 rounded-icon border-none bg-transparent px-1 py-2"
          >
            <span
              aria-hidden
              className="rounded-pill transition-[opacity,transform,box-shadow] duration-200 ease-out motion-reduce:transition-none"
              style={{
                height: size,
                width: size,
                background: m.color,
                opacity: value === null ? (lit ? 1 : 0.45) : selected ? 1 : 0.25,
                boxShadow: selected ? `0 0 0 3px var(--color-white), 0 0 0 5px ${m.color}` : "none",
                transform: lit ? "scale(1.06)" : "scale(1)",
              }}
            />
            {showLabels && (
              <span
                className={`text-center text-[11px] leading-[1.3] ${
                  selected ? "font-bold text-navy" : "font-medium text-navy/50"
                }`}
              >
                {m.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
