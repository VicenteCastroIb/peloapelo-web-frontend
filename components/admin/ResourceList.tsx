"use client";

import { useState } from "react";
import { Plus, Trash2, FileText, Headphones, Link2 } from "lucide-react";
import {
  createResource,
  deleteResource,
  type AdminLessonResource,
  type LessonResourceRequest,
} from "@/lib/api/adminCourses";
import type { ResourceType } from "@/lib/api/courses";

const RESOURCE_ICON: Record<ResourceType, typeof FileText> = {
  PDF: FileText,
  AUDIO: Headphones,
  LINK: Link2,
};

const inputClass =
  "mt-1 w-full rounded-card-md border border-navy/15 bg-cream px-3 py-2 text-p-small text-navy outline-none focus:border-accent";

const EMPTY: LessonResourceRequest = { label: "", url: "", resourceType: "LINK", displayOrder: 0 };

export default function ResourceList({
  lessonId,
  resources,
  token,
  onChange,
}: {
  lessonId: string;
  resources: AdminLessonResource[];
  token: string | null | undefined;
  onChange: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<LessonResourceRequest>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createResource(token, lessonId, form);
      setForm(EMPTY);
      setAdding(false);
      onChange();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, label: string) {
    if (!confirm(`¿Eliminar el recurso "${label}"?`)) return;
    await deleteResource(token, id);
    onChange();
  }

  return (
    <div className="mt-8 rounded-card-md bg-white p-6 shadow-sm">
      <p className="text-h3-sm text-navy">Recursos descargables</p>
      <p className="mt-1 text-p-small text-navy/60">PDFs, audios o links adicionales para esta lección.</p>

      <div className="mt-4 divide-y divide-navy/10">
        {resources.length === 0 && <p className="py-3 text-p-caption text-navy/50">Sin recursos todavía.</p>}
        {resources.map((resource) => {
          const Icon = RESOURCE_ICON[resource.resourceType];
          return (
            <div key={resource.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <Icon size={15} className="shrink-0 text-accent" />
                <div className="min-w-0">
                  <p className="truncate text-p-small font-semibold text-navy">{resource.label}</p>
                  <p className="truncate text-p-caption text-navy/50">{resource.url}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(resource.id, resource.label)}
                className="shrink-0 text-navy/40 hover:text-coral"
                aria-label={`Eliminar ${resource.label}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="mt-4 space-y-3 rounded-card-md bg-cream p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-p-caption font-semibold text-navy/60">
              Etiqueta
              <input
                required
                className={inputClass}
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
            </label>
            <label className="text-p-caption font-semibold text-navy/60">
              Tipo
              <select
                className={inputClass}
                value={form.resourceType}
                onChange={(e) => setForm({ ...form, resourceType: e.target.value as ResourceType })}
              >
                <option value="LINK">Link</option>
                <option value="PDF">PDF</option>
                <option value="AUDIO">Audio</option>
              </select>
            </label>
            <label className="text-p-caption font-semibold text-navy/60 sm:col-span-2">
              URL
              <input
                required
                className={inputClass}
                placeholder="https://…"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-pill bg-navy px-4 py-2 text-p-caption font-semibold text-cream disabled:opacity-50"
            >
              {saving ? "Agregando…" : "Agregar recurso"}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="text-p-caption font-semibold text-navy/50">
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-4 flex items-center gap-1 text-p-caption font-semibold text-accent"
        >
          <Plus size={14} /> Agregar recurso
        </button>
      )}
    </div>
  );
}
