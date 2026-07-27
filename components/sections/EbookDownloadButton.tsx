"use client";

import { useState } from "react";
import { Mail, User, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { captureLead } from "@/lib/api/leads";
import { ApiError } from "@/lib/api/client";

const EBOOK_HREF = "/downloads/pelo-a-pelo-ebook.pdf";
const EBOOK_FILENAME = "Pelo-a-Pelo-Que-dice-tu-pelo-sobre-ti.pdf";

/**
 * Antes este boton descargaba el PDF directo. Ahora primero pide nombre +
 * correo (formulario corto, sin cuenta) para que la fundacion pueda hacer
 * seguimiento de quien se descarga el ebook -- ver LeadController en el
 * backend. Solo tras un submit exitoso se dispara la descarga real.
 */
export default function EbookDownloadButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function triggerDownload() {
    const link = document.createElement("a");
    link.href = EBOOK_HREF;
    link.download = EBOOK_FILENAME;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await captureLead(name.trim(), email.trim(), "ebook");
      triggerDownload();
      setOpen(false);
      setName("");
      setEmail("");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No pudimos conectar con el servidor. Intenta de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="gradient"
        className={className}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        Descargar gratis →
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ebook-lead-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-card-lg bg-white p-8 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute right-5 top-5 text-navy/40 hover:text-navy/70"
            >
              <X size={18} />
            </button>

            <span className="inline-flex items-center gap-1 rounded-pill bg-accent/10 px-3 py-1 text-h4-label text-accent">
              ✨ Ebook gratis
            </span>
            <h3 id="ebook-lead-title" className="mt-4 text-h3-lg text-navy">
              Descarga tu ebook
            </h3>
            <p className="mt-1 text-p-small text-navy/60">
              Déjanos tu nombre y correo y te lo enviamos al toque, sin costo.
            </p>

            <form className="mt-6 space-y-4 text-left" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-p-small font-medium text-navy/70">
                  Nombre
                </label>
                <div className="flex items-center gap-2 rounded-pill border border-navy/10 bg-cream px-4 py-3">
                  <User size={16} className="text-navy/40" />
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full bg-transparent text-p-small outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-p-small font-medium text-navy/70">
                  Correo electrónico
                </label>
                <div className="flex items-center gap-2 rounded-pill border border-navy/10 bg-cream px-4 py-3">
                  <Mail size={16} className="text-navy/40" />
                  <input
                    type="email"
                    required
                    maxLength={320}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full bg-transparent text-p-small outline-none"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-pill bg-coral-soft px-4 py-2 text-p-small text-coral" role="alert">
                  {error}
                </p>
              )}

              <Button type="submit" variant="gradient" className="w-full" disabled={submitting}>
                {submitting ? "Un momento…" : "Descargar →"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
