export default function QuoteDestacada() {
  return (
    <section className="border-t border-navy/10 px-6 py-10 lg:px-12">
      <div className="mx-auto flex max-w-4xl items-center gap-6">
        <span
          aria-hidden
          className="h-9 w-9 shrink-0 rounded-full bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]"
        />
        <p className="text-lg text-navy/80">
          <span className="italic text-accent">&quot;El cambio más profundo</span>{" "}
          empieza cuando dejas de buscar afuera lo que solo puedes sanar{" "}
          <span className="italic text-accent">por dentro.&quot;</span>
        </p>
      </div>
    </section>
  );
}
