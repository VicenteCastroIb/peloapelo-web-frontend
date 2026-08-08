"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { createCourse, type CourseRequest } from "@/lib/api/adminCourses";
import CourseForm from "@/components/admin/CourseForm";

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

  async function handleSubmit(values: CourseRequest) {
    const created = await createCourse(token, values);
    router.push(`/admin/courses/${created.id}`);
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/courses" className="inline-flex items-center gap-1 text-a-inline font-semibold text-navy/60">
        <ArrowLeft size={14} /> Panel de cursos
      </Link>
      <h1 className="mt-4 text-h3-lg text-navy">Nuevo curso</h1>
      <p className="mt-1 text-p-body text-navy/60">
        Después de crearlo podrás agregar módulos y lecciones.
      </p>

      <div className="mt-6">
        <CourseForm initial={EMPTY} submitLabel="Crear curso" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
