"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Deshabilita ambos botones mientras la accion esta en vuelo (ver guardias anti-doble-click en ArticleForm/BlockCard). */
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Reemplazo con diseño propio del confirm() nativo del navegador para
// acciones destructivas del panel admin (ago 2026, a pedido: "una advertencia
// linda" al borrar un blog). El confirm() del sistema operativo no se puede
// estilizar, se ve distinto en cada navegador y no encaja con el resto del
// panel -- este dialogo usa la misma paleta/tipografia que todo /admin.
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Esc para cancelar -- comportamiento esperado de cualquier dialogo modal.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-card-lg bg-white p-6 shadow-2xl"
        // Frena la propagacion del click: sin esto, clickear DENTRO de la
        // tarjeta (ej. el boton Cancelar) tambien dispara el onClick del
        // overlay de atras y cierra el dialogo dos veces.
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-coral-soft text-coral">
          <TriangleAlert size={22} />
        </div>

        <h2 id="confirm-dialog-title" className="mt-4 text-h3-sm text-navy">
          {title}
        </h2>
        <p className="mt-2 text-p-small leading-relaxed text-navy/60">{description}</p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-pill px-4 py-2.5 text-a-inline font-semibold text-navy/60 hover:bg-navy/5 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-pill bg-coral px-5 py-2.5 text-a-inline font-semibold text-white hover:bg-coral/90 disabled:opacity-50"
          >
            {loading ? "Eliminando…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
