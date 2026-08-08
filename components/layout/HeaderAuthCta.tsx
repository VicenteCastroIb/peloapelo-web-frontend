"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";

export default function HeaderAuthCta() {
  const { user, status, logout } = useAuth();

  if (status === "loading") {
    return <div className="h-10 w-32 animate-pulse rounded-pill bg-navy/5" aria-hidden />;
  }

  if (status === "authenticated" && user) {
    const firstName = user.fullName?.split(" ")[0] || user.email;
    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="hidden text-a-nav text-navy/70 hover:text-navy sm:inline">
          Hola, {firstName}
        </Link>
        <Button variant="outline" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>
    );
  }

  // CTA destacado a la derecha del Header (ver tarea de reestructuracion,
  // ago 2026): antes solo "Iniciar sesión". /auth ya maneja login/registro
  // en la misma pantalla (mismo destino que "Haz el quiz gratuito" del
  // Hero), asi que un mismo boton sirve para ambos casos -- se deja un
  // link secundario mas discreto para quien ya tiene cuenta y solo quiere
  // entrar, sin competir visualmente con el CTA principal.
  return (
    <div className="flex items-center gap-4">
      <Link href="/auth" className="hidden text-a-nav text-navy/70 hover:text-navy sm:inline">
        Iniciar sesión
      </Link>
      <Button href="/auth" variant="gradient">
        Haz el Quiz
      </Button>
    </div>
  );
}
