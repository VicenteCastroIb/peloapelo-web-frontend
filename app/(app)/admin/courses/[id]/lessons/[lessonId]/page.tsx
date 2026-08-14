"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Ruta retirada (ago 2026): editar una leccion ahora se hace en el lugar,
// dentro del acordeon de /admin/courses/[id] (ver ModuleEditor/LessonEditor)
// -- ya no hace falta salir a una pagina aparte. Este archivo se mantiene
// solo como redireccion por si queda algun link o marcador viejo apuntando
// aca.
export default function LegacyLessonPageRedirect() {
  const { id } = useParams<{ id: string; lessonId: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/admin/courses/${id}`);
  }, [id, router]);

  return <p className="text-p-small text-navy/50">Redirigiendo…</p>;
}
