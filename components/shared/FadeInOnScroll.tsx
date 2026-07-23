"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

/**
 * Envuelve contenido y lo anima con fade-in-blur cuando entra al viewport.
 * Replica la animación de scroll-reveal observada en peloapelo.cl.
 */
export default function FadeInOnScroll({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delayMs}ms` }}
      className={`${visible ? "animate-fade-in-blur" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
