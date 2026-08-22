"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileText,
  Headphones,
  Link2,
  ListChecks,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  fetchLesson,
  completeLesson,
  uncompleteLesson,
  type LessonDetail,
  type ResourceType,
} from "@/lib/api/courses";
import { useCourseOutline, useLessonPosition, useTotalLessons } from "@/components/course/CourseOutlineContext";
import LessonReadingProgressRing from "@/components/course/LessonReadingProgressRing";
import Skeleton from "@/components/shared/Skeleton";
import ArticleBlocksRenderer from "@/components/articles/ArticleBlocksRenderer";

const RESOURCE_ICON: Record<ResourceType, typeof FileText> = {
  PDF: FileText,
  AUDIO: Headphones,
  LINK: Link2,
};

function toEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com") && parsed.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    return url;
  } catch {
    return url;
  }
}

export default function LessonPage() {
  const params = useParams<{ slug: string; lessonSlug: string }>();
  const { slug, lessonSlug } = params;
  const { token } = useAuth();
  const [lesson, setLesson] = useState<LessonDetail | null | "not-found">(null);
  const [saving, setSaving] = useState(false);

  const position = useLessonPosition(lessonSlug);
  const totalLessons = useTotalLessons();
  const { refresh: refreshOutline } = useCourseOutline();

  // Igual que en /courses y /courses/[slug] (optimizacion de tiempos de
  // carga, ago 2026): no hace falta esperar a useAuth() para pedir la
  // leccion, la personalizacion (completed) viaja via la cookie httpOnly.
  useEffect(() => {
    fetchLesson(slug, lessonSlug, token)
      .then(setLesson)
      .catch(() => setLesson("not-found"));
  }, [slug, lessonSlug, token]);

  async function toggleCompleted() {
    if (!lesson || lesson === "not-found" || saving) return;
    setSaving(true);
    try {
      if (lesson.completed) {
        await uncompleteLesson(token, lesson.id);
      } else {
        await completeLesson(token, lesson.id);
      }
      setLesson({ ...lesson, completed: !lesson.completed });
      // El circulo/porcentaje del sidebar (CourseOutlineSidebar) vive en el
      // curso completo del layout padre, no en el `lesson` local de esta
      // pagina -- sin este refresh quedaba desactualizado hasta cambiar de
      // leccion (ver comentario en CourseOutlineContext.tsx).
      refreshOutline();
    } finally {
      setSaving(false);
    }
  }

  if (lesson === "not-found") {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-h3-sm text-navy">No encontramos esta lección</p>
        <Link href={`/courses/${slug}`} className="mt-3 inline-flex items-center gap-1 text-a-inline font-semibold text-accent">
          <ArrowLeft size={14} /> Volver al curso
        </Link>
      </div>
    );
  }

  return (
    <div id="lesson-content" className="mx-auto max-w-3xl">
      {lesson === null && (
        <div>
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="mt-4 h-8 w-3/4 rounded-md" />
          <Skeleton className="mt-6 aspect-video w-full rounded-card-lg" />
          <div className="mt-8 space-y-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
        </div>
      )}

      {lesson && <LessonReadingProgressRing />}

      {lesson && (
        <>
          {/* Banner de la lección: degradado de marca (ver globals.css),
              breadcrumb "Lección X de Y" y título -- reemplaza la cabecera
              plana que tenía antes, siguiendo la referencia de AWS Skill
              Builder pero con la paleta de Pelo a Pelo. El volver al curso ya
              vive en LessonImmersiveHeader (ver layout.tsx de esta ruta), no
              hace falta repetirlo aquí. */}
          <div className="overflow-hidden rounded-card-lg bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] p-8 text-cream md:p-10">
            <p className="text-p-caption font-semibold uppercase tracking-[0.1em] text-cream/80">
              {lesson.moduleTitle}
              {position && totalLessons > 0 ? ` · Lección ${position.position} de ${totalLessons}` : ""}
            </p>
            <h1 className="mt-2 text-h2-md text-cream md:text-h2-lg">{lesson.title}</h1>
            <div className="mt-4 h-1 w-16 rounded-pill bg-cream/70" />
          </div>

          {lesson.objectives.length > 0 && (
            <div className="mt-6 rounded-card-lg border border-accent/15 bg-accent/5 p-6">
              <p className="flex items-center gap-2 text-h3-sm text-accent">
                <ListChecks size={18} /> En esta lección aprenderás a:
              </p>
              <ul className="mt-3 space-y-2">
                {lesson.objectives.map((objective, i) => (
                  <li key={i} className="flex items-start gap-2 text-p-body text-navy/80">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Video e imagen son opcionales (ago 2026, ver LessonMediaPicker en
              el panel) -- a diferencia de antes, si la leccion no tiene
              ninguno de los dos simplemente no se muestra este bloque, en
              vez de un placeholder "Video proximamente" que sugeria que
              faltaba algo. El video puede ser horizontal (16:9, grabacion
              tradicional) o vertical (9:16, celular/Reels) segun
              lesson.videoOrientation -- el vertical se centra angosto para
              no verse gigante y distorsionado en pantallas anchas. */}
          {lesson.videoUrl ? (
            lesson.videoOrientation === "VERTICAL" ? (
              <div className="mx-auto mt-6 aspect-[9/16] w-full max-w-xs overflow-hidden rounded-card-lg bg-navy/5">
                <iframe
                  src={toEmbedUrl(lesson.videoUrl)}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="mt-6 aspect-video overflow-hidden rounded-card-lg bg-navy/5">
                <iframe
                  src={toEmbedUrl(lesson.videoUrl)}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )
          ) : (
            lesson.imageUrl && (
              <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-card-lg bg-navy/5">
                <Image src={lesson.imageUrl} alt="" fill unoptimized sizes="700px" className="object-cover" />
              </div>
            )
          )}

          {/* Bloques (fase 4 del editor visual, ago 2026) tienen prioridad sobre
              `body` -- lecciones editadas antes de esta fase no tienen bloques
              propios, asi que siguen mostrando el texto plano de siempre como
              fallback (decision confirmada: sin migracion automatica de
              contenido ya publicado). */}
          {lesson.blocks.length > 0 ? (
            <div className="mt-6">
              <ArticleBlocksRenderer blocks={lesson.blocks} />
            </div>
          ) : lesson.body ? (
            <div className="mt-6 space-y-4 text-p-body text-navy/80">
              {lesson.body.split(/\n{2,}/).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-p-small text-navy/50">Contenido de esta lección próximamente.</p>
          )}

          {lesson.resources.length > 0 && (
            <div className="mt-8">
              <p className="text-h4-label text-navy/75">Recursos</p>
              <div className="mt-3 space-y-2">
                {lesson.resources.map((resource) => {
                  const Icon = RESOURCE_ICON[resource.resourceType];
                  return (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-card-md bg-white px-4 py-3 text-p-small text-navy shadow-sm hover:shadow-md"
                    >
                      <Icon size={16} className="text-accent" />
                      {resource.label}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={toggleCompleted}
            disabled={saving}
            className={`mt-8 flex items-center gap-2 rounded-pill px-5 py-3 text-a-inline font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 ${
              lesson.completed ? "bg-accent/10 text-accent" : "bg-navy text-cream"
            }`}
          >
            {lesson.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            {lesson.completed ? "Lección completada" : "Marcar como completada"}
          </button>

          <div className="mt-10 flex items-center justify-between border-t border-navy/10 pt-6">
            {lesson.previousLessonSlug ? (
              <Link
                href={`/courses/${slug}/${lesson.previousLessonSlug}`}
                className="flex items-center gap-1 text-a-inline font-semibold text-navy/70"
              >
                <ArrowLeft size={14} /> Anterior
              </Link>
            ) : (
              <span />
            )}
            {lesson.nextLessonSlug ? (
              <Link
                href={`/courses/${slug}/${lesson.nextLessonSlug}`}
                className="flex items-center gap-1 text-a-inline font-semibold text-accent"
              >
                Siguiente <ArrowRight size={14} />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </>
      )}
    </div>
  );
}
