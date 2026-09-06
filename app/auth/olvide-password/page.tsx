"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { forgotPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await forgotPassword(email);
      // Se muestra el mismo mensaje exista o no la cuenta -- el backend ya
      // responde igual en ambos casos, para no revelar que correos tienen
      // cuenta (ver PasswordResetService).
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 429 ? "Demasiados intentos. Espera un momento y vuelve a intentar." : err.message);
      } else {
        setError("No pudimos conectar con el servidor. Intenta de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] opacity-10 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <Link
          href="/auth"
          className="mb-8 inline-flex items-center gap-2 text-a-inline text-navy/60 hover:text-navy"
        >
          <ArrowLeft size={16} />
          Volver a iniciar sesión
        </Link>

        <div className="rounded-card-lg bg-white p-8 text-center shadow-sm sm:p-10">
          <Image
            src="/images/brand/logo.png"
            alt="Pelo a Pelo"
            width={72}
            height={72}
            className="mx-auto mb-4 h-[72px] w-[72px]"
          />

          {sent ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CheckCircle2 size={24} />
              </div>
              <h1 className="text-h3-lg text-navy">Revisa tu correo</h1>
              <p className="mt-2 text-p-small text-navy/60">
                Si existe una cuenta con <span className="font-medium text-navy">{email}</span>, te
                enviamos un enlace para restablecer tu contraseña. Puede tardar unos minutos y llegar a
                spam.
              </p>
              <Button href="/auth" variant="outline" className="mt-6 w-full">
                Volver a iniciar sesión
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-h3-lg text-navy">¿Olvidaste tu contraseña?</h1>
              <p className="mt-1 text-p-small text-navy/60">
                Ingresa tu correo y te enviamos un enlace para restablecerla.
              </p>

              <form className="mt-8 space-y-4 text-left" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1.5 block text-p-small font-medium text-navy/70">
                    Correo electrónico
                  </label>
                  <div className="flex items-center gap-2 rounded-pill border border-navy/10 bg-cream px-4 py-3 focus-within:border-accent">
                    <Mail size={16} className="text-navy/40" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
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
                  {submitting ? "Enviando…" : "Enviar enlace"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
