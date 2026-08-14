"use client";

// Anillo de progreso de lectura (ago 2026, mismo espiritu que
// ReadingProgressBar.tsx del blog, pero circular y arriba a la derecha de
// la leccion en vez de una tira arriba de toda la pantalla -- a pedido
// especifico para el contenido de curso). Mide el scroll dentro del
// contenedor de la leccion (id="lesson-content", ver
// app/(app)/courses/[slug]/[lessonSlug]/page.tsx) y llena el anillo segun
// cuanto se avanzo, no segun toda la pagina. `fixed` en vez de vivir dentro
// del flujo normal: tiene que quedar a la vista aunque se scrollee, como un
// indicador flotante, similar al circulo "X% completo" de un reproductor de
// video.
import { useEffect, useState } from "react";

const SIZE = 48;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function LessonReadingProgressRing() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const content = document.getElementById("lesson-content");
    if (!content) return;

    function handleScroll() {
      const rect = content!.getBoundingClientRect();
      const contentTop = rect.top + window.scrollY;
      const contentHeight = rect.height;
      const viewportHeight = window.innerHeight;

      const scrollable = contentHeight - viewportHeight;
      if (scrollable <= 0) {
        setPercent(window.scrollY > contentTop ? 100 : 0);
        return;
      }

      const scrolled = window.scrollY - contentTop;
      setPercent(Math.min(100, Math.max(0, (scrolled / scrollable) * 100)));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <div
      className="fixed right-4 top-20 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md md:right-8"
      role="progressbar"
      aria-label="Progreso de lectura de la lección"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute -rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-navy/10" />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ stroke: "var(--color-accent)", transition: "stroke-dashoffset 150ms ease-out" }}
        />
      </svg>
      <span className="text-p-caption font-semibold text-navy">{Math.round(percent)}%</span>
    </div>
  );
}
