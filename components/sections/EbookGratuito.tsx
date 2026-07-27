import Image from "next/image";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import EbookDownloadButton from "@/components/sections/EbookDownloadButton";

export default function EbookGratuito() {
  return (
    <section id="ebook" className="px-6 py-16 lg:px-12">
      <FadeInOnScroll className="mx-auto max-w-5xl">
        {/* Borde degrade con los 3 colores de marca (violeta -> acento ->
            celeste): un div exterior con el degrade como fondo + padding de
            3px hace de "borde", y el contenido real vive en el div blanco
            interior con un radio levemente menor. */}
        <div className="rounded-card-lg bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-accent),var(--color-gradient-to))] p-[3px] shadow-md">
          <div className="rounded-[21px] bg-white p-8 sm:p-12">
            <div className="grid gap-8 sm:grid-cols-[200px_1fr] sm:items-center">
              <div className="relative aspect-[700/906] w-full overflow-hidden rounded-card-md shadow-sm">
                <Image
                  src="/images/ebook/ebook-cover.jpg"
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
                  El nuevo ebook de Jessica Lagno: 10 capítulos para entender la
                  alopecia desde el cuerpo, la emoción y la comunidad.
                </p>
                <EbookDownloadButton className="mt-6" />
              </div>
            </div>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
