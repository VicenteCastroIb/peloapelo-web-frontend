"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ICON_MAP, ICON_LABEL_ES } from "@/components/articles/blocks/iconMap";
import type { RichParagraph } from "@/lib/types/blogBlocks";
import { extractYouTubeId } from "@/lib/blog/youtube";

// Atomos de formulario reutilizados por BlockDataForm.tsx para editar cada
// tipo de bloque. Todo controlado (value/onChange), sin estado propio, para
// que el padre (BlockCard) sea la unica fuente de verdad del `data` del
// bloque -- mismo patron "controlled form" que CourseForm.tsx.

export const fieldClass =
  "mt-1 w-full rounded-card-md border border-navy/15 bg-cream px-3 py-2 text-p-small text-navy outline-none focus:border-accent";

const removeBtnClass = "shrink-0 text-navy/30 hover:text-coral";
const addBtnClass =
  "flex items-center gap-1 text-p-caption font-semibold text-accent hover:underline";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <label className="block text-p-caption font-semibold text-navy/60">
      {label}
      {textarea ? (
        <textarea
          className={fieldClass}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={fieldClass}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export function IconSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
}) {
  // Nombres en español (ICON_LABEL_ES) solo para mostrar -- el <option
  // value> sigue siendo la clave en inglés que ya usa dataJson/ICON_MAP, ver
  // el comentario en iconMap.ts. Ordenados alfabéticamente por su nombre en
  // español (no por la clave en inglés) para que sean fáciles de encontrar
  // en la lista.
  const names = Object.keys(ICON_MAP).sort((a, b) =>
    (ICON_LABEL_ES[a] ?? a).localeCompare(ICON_LABEL_ES[b] ?? b, "es")
  );
  const SelectedIcon = value ? ICON_MAP[value] : null;

  return (
    <label className="block text-p-caption font-semibold text-navy/60">
      {label}
      <div className="mt-1 flex items-center gap-2">
        {SelectedIcon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-card-md border border-navy/15 bg-cream text-navy/70">
            <SelectedIcon size={16} />
          </span>
        )}
        <select
          className={`${fieldClass} mt-0`}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
        >
          <option value="">Sin ícono</option>
          {names.map((name) => (
            <option key={name} value={name}>
              {ICON_LABEL_ES[name] ?? name}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

export function StringListField({
  label,
  items,
  onChange,
  placeholder,
  addLabel = "Agregar",
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  return (
    <div>
      <p className="text-p-caption font-semibold text-navy/60">{label}</p>
      <div className="mt-1 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <textarea
              className={fieldClass}
              rows={2}
              value={item}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              className={removeBtnClass}
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              aria-label="Eliminar"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className={`mt-2 ${addBtnClass}`} onClick={() => onChange([...items, ""])}>
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  );
}

export function ParagraphsField({
  label,
  paragraphs,
  onChange,
}: {
  label: string;
  paragraphs: RichParagraph[];
  onChange: (paragraphs: RichParagraph[]) => void;
}) {
  return (
    <div>
      <p className="text-p-caption font-semibold text-navy/60">{label}</p>
      <div className="mt-1 space-y-2">
        {paragraphs.map((p, i) => (
          <div key={i} className="flex items-start gap-2 rounded-card-md bg-cream p-2">
            <div className="flex-1 space-y-1">
              <textarea
                className={fieldClass}
                rows={2}
                value={p.text}
                onChange={(e) => {
                  const next = [...paragraphs];
                  next[i] = { ...next[i], text: e.target.value };
                  onChange(next);
                }}
              />
              <select
                className={`${fieldClass} w-40`}
                value={p.tone ?? "primary"}
                onChange={(e) => {
                  const next = [...paragraphs];
                  next[i] = { ...next[i], tone: e.target.value as RichParagraph["tone"] };
                  onChange(next);
                }}
              >
                <option value="primary">Texto principal</option>
                <option value="secondary">Texto secundario (más tenue)</option>
              </select>
            </div>
            <button
              type="button"
              className={removeBtnClass}
              onClick={() => onChange(paragraphs.filter((_, idx) => idx !== i))}
              aria-label="Eliminar"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className={`mt-2 ${addBtnClass}`}
        onClick={() => onChange([...paragraphs, { text: "", tone: "primary" }])}
      >
        <Plus size={13} /> Agregar párrafo
      </button>
    </div>
  );
}

/** Editor generico de lista de pares (usado por mito/realidad, referencias y estadisticas). */
export function PairListField<K1 extends string, K2 extends string>({
  label,
  items,
  onChange,
  key1,
  key2,
  label1,
  label2,
  numeric2,
}: {
  label: string;
  items: Array<Record<K1 | K2, string | number>>;
  onChange: (items: Array<Record<K1 | K2, string | number>>) => void;
  key1: K1;
  key2: K2;
  label1: string;
  label2: string;
  numeric2?: boolean;
}) {
  function emptyItem(): Record<K1 | K2, string | number> {
    return { [key1]: "", [key2]: numeric2 ? 0 : "" } as Record<K1 | K2, string | number>;
  }

  return (
    <div>
      <p className="text-p-caption font-semibold text-navy/60">{label}</p>
      <div className="mt-1 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 rounded-card-md bg-cream p-2">
            <div className="flex-1 space-y-1">
              <textarea
                className={fieldClass}
                rows={2}
                placeholder={label1}
                value={String(item[key1] ?? "")}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], [key1]: e.target.value } as Record<K1 | K2, string | number>;
                  onChange(next);
                }}
              />
              {numeric2 ? (
                <input
                  type="number"
                  className={`${fieldClass} w-24`}
                  placeholder={label2}
                  value={Number(item[key2] ?? 0)}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], [key2]: Number(e.target.value) } as Record<K1 | K2, string | number>;
                    onChange(next);
                  }}
                />
              ) : (
                <textarea
                  className={fieldClass}
                  rows={2}
                  placeholder={label2}
                  value={String(item[key2] ?? "")}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], [key2]: e.target.value } as Record<K1 | K2, string | number>;
                    onChange(next);
                  }}
                />
              )}
            </div>
            <button
              type="button"
              className={removeBtnClass}
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              aria-label="Eliminar"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className={`mt-2 ${addBtnClass}`} onClick={() => onChange([...items, emptyItem()])}>
        <Plus size={13} /> Agregar
      </button>
    </div>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-p-caption font-semibold text-navy/60">
      <input type="checkbox" className="h-4 w-4" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <label className="block text-p-caption font-semibold text-navy/60">
      {label}
      <select className={fieldClass} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-p-caption font-semibold text-navy/60">
      {label}
      <input
        type="number"
        className={fieldClass}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

// Bloque "video_embed" (fase 3, ago 2026): a diferencia de los demas campos
// de este archivo, el `value` que se guarda (youtubeId, 11 caracteres) NO es
// lo mismo que lo que la persona pega en el input (cualquier link de
// YouTube) -- por eso, a diferencia del resto de estos campos "tontos", este
// necesita su propio estado local para el texto crudo del input mientras
// deriva el id ya limpio hacia `onChange`.
export function YouTubeUrlField({
  value,
  onChange,
}: {
  /** El youtubeId ya guardado (o "" si el bloque es nuevo). */
  value: string;
  onChange: (youtubeId: string) => void;
}) {
  const [raw, setRaw] = useState(value);

  // Si el bloque seleccionado cambia (otro bloque, u otro articulo), el
  // input debe reflejar el nuevo valor guardado, no arrastrar el texto
  // crudo del bloque anterior.
  useEffect(() => {
    setRaw(value);
  }, [value]);

  const parsed = extractYouTubeId(raw);
  const invalid = raw.trim() !== "" && !parsed;

  return (
    <label className="block text-p-caption font-semibold text-navy/60">
      Link o ID de YouTube
      <input
        className={fieldClass}
        value={raw}
        placeholder="https://www.youtube.com/watch?v=…"
        onChange={(e) => {
          const next = e.target.value;
          setRaw(next);
          const id = extractYouTubeId(next);
          if (id) onChange(id);
        }}
      />
      {invalid && (
        <span className="mt-1 block text-p-caption font-normal text-coral">
          No reconocí un video de YouTube ahí -- pegá el link completo.
        </span>
      )}
      {parsed && (
        <span className="mt-1 block text-p-caption font-normal text-accent">Video reconocido ✓</span>
      )}
    </label>
  );
}
