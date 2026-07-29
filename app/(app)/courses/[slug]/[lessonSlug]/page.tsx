"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, FileText, Headphones, Link2, PlayCircle } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  fetchLesson,
  completeLesson,
  uncompleteLesson,
  type LessonDetail,
  type ResourceType,
} from "@/lib/api/courses";

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
  const { token, status } = useAuth();
  const [lesson, setLesson] = useState<LessonDetail | null | "not-found">(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    fetchLesson(slug, lessonSlug, token)
      .then(setLesson)
      .catch(() => setLesson("not-found"));
  }, [slug, lessonSlug, status, token]);

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
    } finally {
      setSaving(false);
    }
  }

  if (lesson === "not-found") {
    return (
      <div className="max-w-3xl">
        <p className="text-h3-sm text-navy">No encontramos esta lección</p>
        <Link href={`/courses/${slug}`} className="mt-3 inline-flex items-center gap-1 text-a-inline font-semibold text-accent">
          <ArrowLeft size={14} /> Volver al curso
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link
        href={`/courses/${slug}`}
        className="inline-flex items-center gap-1 text-a-inline font-semibold text-navy/60"
      >
        <ArrowLeft size={14} /> {lesson ? lesson.courseTitle : "Curso"}
      </Link>

      {lesson === null && <p className="mt-6 text-p-small text-navy/50">Cargando…</p>}

      {lesson && (
        <>
          <p className="mt-4 text-h4-label text-navy/50">{lesson.moduleTitle}</p>
          <h1 className="mt-1 text-h3-lg text-navy">{lesson.title}</h1>

          {/* Video: si no hay URL cargada todavia, se deja el espacio listo
              (misma logica que las tarjetas del listado real). */}
          {lesson.videoUrl ? (
            <div className="mt-5 aspect-video overflow-hidden rounded-card-lg bg-navy/5">
              <iframe
                src={toEmbedUrl(lesson.videoUrl)}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="mt-5 flex aspect-video flex-col items-center justify-center gap-2 rounded-card-lg bg-navy/5 text-navy/40">
              <PlayCircle size={32} />
              <p className="text-p-small">Video próximamente</p>
            </div>
          )}

          {lesson.body ? (
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
              <p className="text-h4-label text-navy/50">Recursos</p>
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
