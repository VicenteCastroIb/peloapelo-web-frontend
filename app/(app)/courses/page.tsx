import { Play, Clock3, BookOpen } from "lucide-react";
import { courses } from "@/lib/data/courses";

export default function CoursesPage() {
  return (
    <div className="max-w-5xl">
      <h1 className="text-h3-lg text-navy">Tu camino de bienestar 🌱</h1>
      <p className="mt-1 text-p-body text-navy/60">
        Cursos diseñados por profesionales para acompañarte en cada etapa.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="overflow-hidden rounded-card-lg bg-white shadow-sm">
            <div className="relative flex h-36 items-center justify-center bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]">
              <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-p-caption font-semibold text-navy">
                {course.level}
              </span>
              {/* Boton decorativo: en el sitio real tampoco abre una leccion */}
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-accent">
                <Play size={16} />
              </span>
            </div>
            <div className="p-5">
              <p className="text-h3-sm text-navy">{course.title}</p>
              <p className="mt-1 text-p-small text-navy/60">{course.description}</p>
              <div className="mt-4 flex items-center gap-4 text-p-caption text-navy/50">
                <span className="flex items-center gap-1">
                  <Clock3 size={14} /> {course.durationMinutes} min
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={14} /> {course.lessons} lecciones
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
