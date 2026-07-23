"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cuenta animada de 0 -> valor real cuando la tarjeta entra al viewport.
 * `value` es el número puro (ej. 40, 147); `suffix` agrega %, M+, etc.
 */
export default function AnimatedCounter({
  value,
  suffix = "",
  durationMs = 1200,
}: {
  value: number;
  suffix?: string;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1);
          setDisplay(Math.round(progress * value));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return (
    <span ref={ref} className="italic text-accent">
      {display}
      {suffix}
    </span>
  );
}
