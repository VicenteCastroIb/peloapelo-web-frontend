"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Anillo de progreso SVG que se llena de 0 -> value cuando entra al
 * viewport (mismo patron de IntersectionObserver que AnimatedCounter.tsx,
 * pensado para usarse junto a el: el numero cuenta mientras el anillo se
 * llena, mismo timing). Generico -- no asume color ni tamaño, para poder
 * usarse en cualquier tarjeta de dato con un valor 0-100.
 */
export default function RadialProgress({
  value,
  size = 64,
  strokeWidth = 6,
  durationMs = 1200,
  trackClassName = "stroke-navy/10",
  progressClassName = "stroke-accent",
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  durationMs?: number;
  trackClassName?: string;
  progressClassName?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (visible ? Math.min(value, 100) : 0) / 100);

  return (
    <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className={trackClassName}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: `stroke-dashoffset ${durationMs}ms ease-out` }}
        className={progressClassName}
      />
    </svg>
  );
}
