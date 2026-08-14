// Indicador de confianza de 3 niveles (ver TREATMENTS en
// MitosComunesAlopecia.tsx, disenio original ago 2026). 3 puntos llenos =
// evidencia solida/aprobada, 2 = moderada, 1 = prometedora/aun sin
// estandarizar.
export default function ConfidenceDots({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-1 align-middle" aria-hidden>
      {[1, 2, 3].map((dot) => (
        <span
          key={dot}
          className={`h-1.5 w-1.5 rounded-full ${dot <= level ? "bg-accent" : "bg-navy/15"}`}
        />
      ))}
    </span>
  );
}
