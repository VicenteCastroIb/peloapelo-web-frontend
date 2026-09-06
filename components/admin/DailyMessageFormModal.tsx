"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import Field from "@/components/ui/Field";
import TextInput from "@/components/ui/TextInput";
import Switch from "@/components/ui/Switch";
import type { AdminDailyMessage, DailyMessageRequest } from "@/lib/api/adminDailyMessages";

interface DailyMessageFormModalProps {
  open: boolean;
  /** null = crear uno nuevo; con valor = editar ese mensaje. */
  editing: AdminDailyMessage | null;
  saving: boolean;
  error: string | null;
  onSave: (request: DailyMessageRequest) => void;
  onCancel: () => void;
}

const PHRASE_MAX = 240;
const BODY_MAX = 600;

// Mismo patron visual que ConfirmDialog.tsx (overlay + tarjeta centrada +
// Esc para cancelar) pero con un formulario en vez de un mensaje de
// confirmacion -- un solo componente sirve para crear y editar (ver
// AdminMensajesPage): "editing" trae los valores iniciales o null.
export default function DailyMessageFormModal({
  open,
  editing,
  saving,
  error,
  onSave,
  onCancel,
}: DailyMessageFormModalProps) {
  const [phrase, setPhrase] = useState("");
  const [body, setBody] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!open) return;
    setPhrase(editing?.phrase ?? "");
    setBody(editing?.body ?? "");
    setActive(editing?.active ?? true);
  }, [open, editing]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const trimmedPhrase = phrase.trim();
  const trimmedBody = body.trim();
  const isValid = trimmedPhrase.length > 0 && trimmedBody.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || saving) return;
    onSave({
      phrase: trimmedPhrase,
      body: trimmedBody,
      active,
      displayOrder: editing?.displayOrder ?? 0,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-message-modal-title"
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-card-lg bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Sparkles size={20} />
        </div>

        <h2 id="daily-message-modal-title" className="mt-4 text-h3-sm text-navy">
          {editing ? "Editar mensaje del día" : "Nuevo mensaje del día"}
        </h2>
        <p className="mt-1 text-p-small text-navy/60">
          Se muestra en la card destacada de /dashboard. Los mensajes activos rotan uno por día.
        </p>

        <div className="mt-5 space-y-4">
          <Field label="Frase destacada" htmlFor="phrase" hint={`${trimmedPhrase.length}/${PHRASE_MAX}`}>
            <TextInput
              id="phrase"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value.slice(0, PHRASE_MAX))}
              placeholder="Ej: No estás sola en esto."
              required
              autoFocus
            />
          </Field>

          <Field label="Texto de apoyo" htmlFor="body" hint={`${trimmedBody.length}/${BODY_MAX}`}>
            <TextInput
              as="textarea"
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, BODY_MAX))}
              placeholder="El párrafo que acompaña a la frase…"
              className="min-h-[96px]"
              required
            />
          </Field>

          <div className="flex items-center justify-between rounded-icon border border-navy/10 bg-cream px-4 py-3">
            <div>
              <p className="text-p-small font-medium text-navy">Activo</p>
              <p className="text-p-caption text-navy/50">Entra en la rotación diaria del dashboard.</p>
            </div>
            <Switch checked={active} onChange={() => setActive((v) => !v)} label="Activo" />
          </div>
        </div>

        {error && <p className="mt-4 text-p-small text-coral">{error}</p>}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-pill px-4 py-2.5 text-a-inline font-semibold text-navy/60 hover:bg-navy/5 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isValid || saving}
            className="rounded-pill bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] px-5 py-2.5 text-a-inline font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear mensaje"}
          </button>
        </div>
      </form>
    </div>
  );
}
