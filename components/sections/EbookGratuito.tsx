import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

export default function EbookGratuito() {
  return (
    <section id="ebook" className="px-6 py-16 lg:px-12">
      <FadeInOnScroll className="mx-auto max-w-4xl rounded-card-lg bg-white p-8 sm:p-12">
        <div className="grid gap-8 sm:grid-cols-[200px_1fr] sm:items-center">
          {/* TODO: reemplazar por /assets/ebook-cover-Dc2fGQdw.jpg (docs/scan-22-07-2026) */}
          <div className="aspect-square w-full rounded-card-md bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] p-4 text-center text-white">
            <div className="flex h-full flex-col items-center justify-center">
              <p className="font-semibold">Pelo a Pelo</p>
              <p className="mt-1 text-xs italic">¿Qué dice tu pelo sobre ti?</p>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1 rounded-pill bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              ✨ Ebook gratis
            </span>
            <h2 className="mt-4 text-3xl font-semibold">¿Qué dice tu pelo sobre ti?</h2>
            <p className="mt-3 text-navy/70">
              El nuevo ebook de Jessica Lagno: 10 capítulos para entender la alopecia
              desde el cuerpo, la emoción y la comunidad.
            </p>
            <Button href="/auth" variant="gradient" className="mt-6">
              Descargar gratis →
            </Button>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
