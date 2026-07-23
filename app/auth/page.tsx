"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth, ApiError } from "@/lib/auth/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === "login";

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
            src="/images/logo.png"
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

          <form className="mt-8 space-y-4 text-left" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-p-small font-medium text-navy/70">
                  Nombre completo
                </label>
                <div className="flex items-center gap-2 rounded-pill border border-navy/10 bg-cream px-4 py-3">
                  <User size={16} className="text-navy/40" />
                  <input
                    type="text"
                    required
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
              <div className="flex items-center gap-2 rounded-pill border border-navy/10 bg-cream px-4 py-3">
                <Mail size={16} className="text-navy/40" />
                <input
                  type="email"
                  required
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
              <div className="flex items-center gap-2 rounded-pill border border-navy/10 bg-cream px-4 py-3">
                <Lock size={16} className="text-navy/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-p-small outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="text-navy/40 hover:text-navy/70"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <Link href="/auth/forgot" className="inline-block text-a-inline text-accent">
                ¿Olvidaste tu contraseña?
              </Link>
            )}

            {error && (
              <p className="rounded-pill bg-coral-soft px-4 py-2 text-p-small text-coral" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" variant="gradient" className="w-full" disabled={submitting}>
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
