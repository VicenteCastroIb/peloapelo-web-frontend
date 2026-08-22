import { Monitor } from "lucide-react";

/**
 * Aviso para las pantallas de edicion mas densas del panel admin (editor de
 * bloques de curso/blog: paleta + lienzo + inspector, ver BlockList.tsx).
 * Esas pantallas ya se apilan en una sola columna en mobile (no se rompen,
 * no hay scroll horizontal) pero editar ahi -- arrastrar bloques, usar el
 * inspector lateral -- es incomodo en una pantalla chica. En vez de fingir
 * que es una experiencia pensada para el celular, se avisa con calma (mismo
 * tono que TherapistPage/TofacitinibPage) y se deja seguir usandola igual:
 * no bloquea nada, solo pone expectativas correctas. Solo bajo lg -- en
 * tablet/desktop no se muestra.
 */
export default function DesktopOnlyNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-2.5 rounded-card-md bg-accent/5 p-4 text-p-small text-navy/70 lg:hidden">
      <Monitor size={16} className="mt-0.5 shrink-0 text-accent" />
      <p>{children}</p>
    </div>
  );
}
