export default function SectionBadge({ label }: { label: string }) {
  return (
    // navy/75 en vez de /50 (auditoria de contraste, ago 2026): a 11-12px,
    // navy/50 sobre cream mide ~2.7:1 -- lejos del 4.5:1 que exige WCAG AA
    // para texto normal (medido, no asumido -- ver contrast.js del audit).
    // navy/75 da ~5:1, pasa con margen y sigue leyendose "atenuado" frente
    // al navy solido del resto del texto.
    <div className="mb-6 flex items-center gap-3 text-h4-label text-navy/75">
      <span className="h-px w-8 bg-navy/20" />
      {label}
    </div>
  );
}
