"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Guard adicional para el panel de administracion: AppLayout (padre) ya
 * garantiza que hay sesion activa, aca se suma el chequeo de rol. El
 * backend es la fuente real de verdad (ver SecurityConfig:
 * /api/admin/** exige ROLE_ADMIN) -- esto solo evita que una persona sin
 * ese rol vea la UI del panel, no reemplaza esa proteccion.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && user?.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [status, user, router]);

  if (status !== "authenticated" || user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
