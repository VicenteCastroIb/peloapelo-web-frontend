import Image from "next/image";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

export default function EbookGratuito() {
  return (
    <section id="ebook" className="px-6 py-16 lg:px-12">
      <FadeInOnScroll className="mx-auto max-w-4xl rounded-card-lg bg-white p-8 sm:p-12">
        <div className="grid gap-8 sm:grid-cols-[200px_1fr] sm:items-center">
          <div className="relative aspect-[700/906] w-full overflow-hidden rounded-card-md shadow-sm">
            <Image
              src="/images/ebook-cover.jpg"
              alt="Portada del ebook Pelo a Pelo: ¿Qué dice tu pelo sobre ti?"
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>

          <div>
            <span className="inline-flex items-center gap-1 rounded-pill bg-accent/10 px-3 py-1 text-h4-label text-accent">
              ✨ Ebook gratis
            </span>
            <h2 className="mt-4 text-h2-md text-navy">¿Qué dice tu pelo sobre ti?</h2>
            <p className="mt-3 text-p-body text-navy/70">
              El nuevo ebook de Jessica Lagno: 10 capítulos para entender la alopecia
              desde el cuerpo, la emoción y la comunidad.
            </p>
            <Button
              href="/downloads/pelo-a-pelo-ebook.pdf"
              download="Pelo-a-Pelo-Que-dice-tu-pelo-sobre-ti.pdf"
              variant="gradient"
              className="mt-6"
            >
              Descargar gratis →
            </Button>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
