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
        <Link href="/dashboard" className="hidden text-sm text-navy/70 hover:text-navy sm:inline">
          Hola, {firstName}
        </Link>
        <Button variant="outline" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>
    );
  }

  return (
    <Button href="/auth" variant="solid">
      Comienza gratis
    </Button>
  );
}
