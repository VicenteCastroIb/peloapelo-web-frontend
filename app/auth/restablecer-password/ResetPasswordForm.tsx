"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!token) {
      setError("Enlace inválido.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/auth"), 2500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
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

          {done ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CheckCircle2 size={24} />
              </div>
              <h1 className="text-h3-lg text-navy">Contraseña actualizada</h1>
              <p className="mt-2 text-p-small text-navy/60">
                Ya podés iniciar sesión con tu nueva contraseña. Te redirigimos…
              </p>
            </>
          ) : !token ? (
            <>
              <h1 className="text-h3-lg text-navy">Enlace inválido</h1>
              <p className="mt-2 text-p-small text-navy/60">
                Este enlace no es válido o ya fue usado. Solicita uno nuevo para continuar.
              </p>
              <Button href="/auth/olvide-password" variant="gradient" className="mt-6 w-full">
                Solicitar nuevo enlace
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-h3-lg text-navy">Elige tu nueva contraseña</h1>
              <p className="mt-1 text-p-small text-navy/60">Debe tener al menos 6 caracteres.</p>

              <form className="mt-8 space-y-4 text-left" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1.5 block text-p-small font-medium text-navy/70">
                    Nueva contraseña
                  </label>
                  <div className="flex items-center gap-2 rounded-pill border border-navy/10 bg-cream px-4 py-3 focus-within:border-accent">
                    <Lock size={16} className="text-navy/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-p-small outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      className="-mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy/40 hover:bg-navy/5 hover:text-navy/70"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-p-small font-medium text-navy/70">
                    Confirmar contraseña
                  </label>
                  <div className="flex items-center gap-2 rounded-pill border border-navy/10 bg-cream px-4 py-3 focus-within:border-accent">
                    <Lock size={16} className="text-navy/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
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
                  {submitting ? "Guardando…" : "Restablecer contraseña"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
