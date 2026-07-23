import { Eye, FileText } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-h3-lg text-navy">Progreso</h1>

      <div className="mt-6 rounded-card-lg bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] p-8 text-white">
        <p className="flex items-center gap-2 text-h4-label opacity-80">
          <Eye size={14} /> Tu espejo honesto
        </p>
        <h2 className="mt-3 text-h3-md">
          Ver la realidad a veces incomoda, pero es el primer paso para sanar
        </h2>
        <p className="mt-3 text-p-small text-white/90">
          Muchas veces, por miedo, nos desconectamos de nuestro cuerpo. Dejamos de
          mirarnos, de registrar lo que pasa.
        </p>
        <p className="mt-2 text-p-small text-white/90">
          Este módulo existe para que estés presente en tu sanación. Sube fotos
          periódicamente y la IA te ayudará a identificar cambios.
        </p>
        <div className="mt-5 flex items-center gap-2 rounded-pill bg-white/15 px-4 py-2.5 text-p-small">
          <FileText size={16} />
          Genera reportes con tus fotos y evolución para compartir con tu médico.
        </div>
      </div>
    </div>
  );
}
