"use client";

// Barra de progreso de lectura (ago 2026, mismo espiritu que el % de avance
// de un curso: "que se vaya mostrando un progreso a medida que avanzas",
// aplicado a un articulo de una sola pagina en vez de una serie de
// lecciones). Una tira fija arriba del todo del viewport que se va llenando
// segun cuanto del <article> ya se scrolleo, no segun toda la pagina --
// asi el 100% coincide con terminar el contenido real, sin contar el
// bloque de "Sigue leyendo" del final. Es un client component chico que
// ArticlePage (server component) renderiza como hijo; no necesita ningun
// dato del servidor, mide el DOM directamente en el browser.
import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    function handleScroll() {
      const rect = article!.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const viewportHeight = window.innerHeight;

      const scrollable = articleHeight - viewportHeight;
      if (scrollable <= 0) {
        setPercent(window.scrollY > articleTop ? 100 : 0);
        return;
      }

      const scrolled = window.scrollY - articleTop;
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

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-navy/10" aria-hidden>
      <div
        className="h-full bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] transition-[width] duration-150 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
