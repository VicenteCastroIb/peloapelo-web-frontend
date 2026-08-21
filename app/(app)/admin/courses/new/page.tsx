"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { createCourse, listAdminCourses, type CourseRequest } from "@/lib/api/adminCourses";
import CourseForm from "@/components/admin/CourseForm";
import CourseHeaderPreview from "@/components/admin/CourseHeaderPreview";
import PreviewErrorBoundary from "@/components/admin/PreviewErrorBoundary";

const EMPTY: CourseRequest = {
  slug: "",
  title: "",
  description: "",
  longDescription: "",
  level: "BASICO",
  coverImageUrl: "",
  published: false,
  displayOrder: 0,
};

export default function NewCoursePage() {
  const { token } = useAuth();
  const router = useRouter();
  // Ya no hay input de "orden en el listado" en el formulario (se reordena
  // con flechas desde /admin/courses, ver reorderCourses) -- por eso el
  // curso nuevo necesita un displayOrder por defecto sensato: el largo
  // actual de la lista, para que caiga al final en vez de pisar la
  // posicion 0 de otro curso. Mismo patron que admin/blog/new/page.tsx.
  const [initial, setInitial] = useState<CourseRequest | null>(null);
  const [draftFields, setDraftFields] = useState<CourseRequest>(EMPTY);

  useEffect(() => {
    listAdminCourses(token)
      .then((list) => {
        const withOrder = { ...EMPTY, displayOrder: list.length };
        setInitial(withOrder);
        setDraftFields(withOrder);
      })
      .catch(() => {
        setInitial(EMPTY);
        setDraftFields(EMPTY);
      });
  }, [token]);

  async function handleSubmit(values: CourseRequest) {
    const created = await createCourse(token, values);
    router.push(`/admin/courses/${created.id}`);
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 max-w-2xl">
        <Link href="/admin/courses" className="inline-flex items-center gap-1 text-a-inline font-semibold text-navy/60">
          <ArrowLeft size={14} /> Panel de cursos
        </Link>
        <h1 className="mt-4 text-h3-lg text-navy">Nuevo curso</h1>
        <p className="mt-1 text-p-body text-navy/60">
          Después de crearlo podrás agregar módulos y lecciones.
        </p>

        <div className="mt-6">
          {initial ? (
            <CourseForm initial={initial} submitLabel="Crear curso" onSubmit={handleSubmit} onChange={setDraftFields} />
          ) : (
            <p className="text-p-small text-navy/50">Cargando…</p>
          )}
        </div>
      </div>

      <div className="xl:sticky xl:top-6 xl:self-start">
        <PreviewErrorBoundary>
          <div className="rounded-card-lg border border-navy/10 bg-white shadow-sm">
            <div className="flex items-center gap-2 rounded-t-card-lg border-b border-navy/10 bg-navy/5 px-4 py-2.5 text-p-caption font-semibold text-navy/60">
              <Eye size={14} />
              Vista previa en vivo
            </div>
            <div className="px-6 py-8 sm:px-10">
              <CourseHeaderPreview fields={draftFields} />
            </div>
          </div>
        </PreviewErrorBoundary>
      </div>
    </div>
  );
}
