import Link from "next/link";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import type { LegalContent, LegalDoc, LegalSegment } from "@/lib/data/legal";

function renderSegments(segments: LegalSegment[]) {
  return segments.map((seg, i) => {
    if (typeof seg === "string") return <span key={i}>{seg}</span>;
    if ("pending" in seg) {
      return (
        <span
          key={i}
          className="mx-1 inline-flex items-center gap-1 rounded-pill bg-coral-soft px-2 py-0.5 text-p-caption font-semibold text-coral"
        >
          <AlertTriangle size={11} /> Pendiente: {seg.pending}
        </span>
      );
    }
    return (
      <Link key={i} href={seg.href} className="font-semibold text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent">
        {seg.link}
      </Link>
    );
  });
}

function renderBlock(block: LegalContent, i: number) {
  if (block.kind === "p") {
    return (
      <p key={i} className="mt-4 text-p-body leading-relaxed text-navy/80">
        {renderSegments(block.segments)}
      </p>
    );
  }
  if (block.kind === "note") {
    return (
      <div key={i} className="mt-4 rounded-card-md border-l-4 border-coral bg-coral-soft px-5 py-4">
        <p className="flex items-start gap-2 text-p-small italic text-navy/80">
          <ShieldAlert size={16} className="mt-0.5 shrink-0 text-coral" />
          <span>{renderSegments(block.segments)}</span>
        </p>
      </div>
    );
  }
  return (
    <ul key={i} className="mt-4 space-y-2.5">
      {block.items.map((item, j) => (
        <li key={j} className="flex gap-3 text-p-body leading-relaxed text-navy/80">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>{renderSegments(item)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <section className="px-6 py-16 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-h4-label text-accent">Fundación Pelo a Pelo · Chile</p>
        <h1 className="mt-2 text-h2-md text-navy">{doc.title}</h1>
        <p className="mt-1 text-p-lead text-navy/60">{doc.subtitle}</p>

        <div className="mt-6 rounded-card-md border border-coral/30 bg-coral-soft px-5 py-4">
          <p className="flex items-start gap-2 text-p-small text-navy/80">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-coral" />
            <span>
              Este documento está en <strong>revisión legal</strong> y aún no es la versión final. Los campos marcados como{" "}
              <strong>Pendiente</strong> se completarán con los datos oficiales de la Fundación antes de la publicación
              definitiva. Si ves algo que corregir, escríbenos.
            </span>
          </p>
        </div>

        <div className="mt-10">
          {doc.sections.map((section) => (
            <div key={section.number} className="mt-10 first:mt-0">
              {section.heading && (
                <h2 className="text-h3-md text-navy">
                  {section.number > 0 && <span className="text-accent">{section.number}. </span>}
                  {section.heading}
                </h2>
              )}
              {section.content.map((block, i) => renderBlock(block, i))}
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-navy/10 pt-6">
          <p className="text-p-caption text-navy/40">
            {doc.footerLabel} · Fundación Pelo a Pelo — borrador para revisión legal, versión del{" "}
            {new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}.
          </p>
        </div>
      </div>
    </section>
  );
}
