"use client";

import { useEffect, useState } from "react";

/**
 * true cuando el usuario hizo scroll mas alla de `threshold` px.
 * Listener pasivo (no bloquea el hilo de scroll) y se limpia al desmontar.
 * Reemplaza la mutacion directa de `header.style.*` del mockup de
 * referencia: el componente solo lee este booleano y decide sus propias
 * clases de Tailwind, sin tocar el DOM a mano.
 */
export function useScrolled(threshold = 40): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
