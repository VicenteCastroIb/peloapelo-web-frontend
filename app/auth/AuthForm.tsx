"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, ClipboardCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth, ApiError } from "@/lib/auth/AuthContext";
import { readPendingQuiz, clearPendingQuiz } from "@/lib/quiz/storage";
import { submitQuizResult } from "@/lib/api/quiz";

export default function AuthForm() {
  const router = useRouter();
  const { login, register } = useAuth();

  // ?fromQuiz=1 -- viene de la pantalla de resultado del quiz (/quiz) de
  // alguien sin sesion. Se arranca en modo "registro" y, tras crear la
  // cuenta (o iniciar sesion), se sube el resultado guardado en
  // sessionStorage antes de entrar al panel.
  const fromQuiz = useSearchParams().get("fromQuiz") === "1";

  const [mode, setMode] = useState<"login" | "register">(fromQuiz ? "register" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === "login";

  async function flushPendingQuiz() {
    const pending = readPendingQuiz();
    if (!pending) return;
    try {
      // Sin token explicito a proposito: login/register ya dejaron la cookie
      // httpOnly de sesion, y apiFetch la manda con credentials: "include".
      await submitQuizResult(undefined, {
        primaryType: pending.primaryType,
        scores: pending.scores,
        answers: pending.answers,
      });
    } catch {
      // Best-effort: si falla el guardado no bloqueamos la entrada. La
      // persona puede rehacer el quiz desde su perfil.
    } finally {
      clearPendingQuiz();
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, fullName);
      }
      if (fromQuiz) {
        await flushPendingQuiz();
      }
      router.push("/dashboard");
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
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-a-inline text-navy/60 hover:text-navy"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>

        <div className="rounded-card-lg bg-white p-8 text-center shadow-sm sm:p-10">
          <Image
            src="/images/brand/logo.png"
            alt="Pelo a Pelo"
            width={72}
            height={72}
            className="mx-auto mb-4 h-[72px] w-[72px]"
          />

          <h1 className="text-h3-lg text-navy">
            {isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}
          </h1>
          <p className="mt-1 text-p-small text-navy/60">
            {isLogin
              ? "Inicia sesión para continuar tu proceso"
              : "Comienza tu camino con nosotros"}
          </p>

          {fromQuiz && (
            <div className="mt-5 flex items-start gap-2.5 rounded-card-md bg-accent/5 p-3.5 text-left text-p-small text-navy/75">
              <ClipboardCheck size={17} className="mt-0.5 shrink-0 text-accent" />
              <span>
                {isLogin
                  ? "Inicia sesión y guardamos el resultado de tu quiz en tu perfil."
                  : "Al crear tu cuenta guardamos el resultado de tu quiz en tu perfil."}
              </span>
            </div>
          )}

          <form className="mt-8 space-y-4 text-left" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-p-small font-medium text-navy/70">
                  Nombre completo
                </label>
                <div className="flex items-center gap-2 rounded-pill border border-navy/10 bg-cream px-4 py-3 focus-within:border-accent">
                  <User size={16} className="text-navy/40" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full bg-transparent text-p-small outline-none"
                  />
                </div>
              </div>
            )}

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

            <div>
              <label className="mb-1.5 block text-p-small font-medium text-navy/70">
                Contraseña
              </label>
              <div className="flex items-center gap-2 rounded-pill border border-navy/10 bg-cream px-4 py-3 focus-within:border-accent">
                <Lock size={16} className="text-navy/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete={isLogin ? "current-password" : "new-password"}
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

            {isLogin && (
              <Link href="/auth/olvide-password" className="inline-block text-a-inline text-accent">
                ¿Olvidaste tu contraseña?
              </Link>
            )}

            {!isLogin && (
              <label className="flex items-start gap-2.5 text-p-small text-navy/70">
                <input
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
                />
                <span>
                  Acepto los{" "}
                  <Link href="/terminos" target="_blank" className="font-semibold text-accent underline">
                    Términos y Condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="/privacidad" target="_blank" className="font-semibold text-accent underline">
                    Política de Privacidad
                  </Link>
                  .
                </span>
              </label>
            )}

            {error && (
              <p className="rounded-pill bg-coral-soft px-4 py-2 text-p-small text-coral" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              disabled={submitting || (!isLogin && !acceptedTerms)}
            >
              {submitting ? "Un momento…" : isLogin ? "Iniciar sesión" : "Crear cuenta"}
            </Button>
          </form>

          <p className="mt-6 text-p-small text-navy/60">
            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <button
              type="button"
              onClick={() => {
                setMode(isLogin ? "register" : "login");
                setError(null);
              }}
              className="font-semibold text-accent"
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
