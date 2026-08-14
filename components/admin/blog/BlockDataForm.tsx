"use client";

import { Plus, Trash2 } from "lucide-react";
import type {
  BlockData,
  IconCardItem,
  IconCardGridBlockData,
} from "@/lib/types/blogBlocks";
import {
  TextField,
  IconSelect,
  StringListField,
  ParagraphsField,
  PairListField,
  CheckboxField,
  SelectField,
  NumberField,
} from "./blockFieldEditors";

// Formulario estructurado por tipo de bloque: recibe el `data` tipado de
// BlockData (ver lib/types/blogBlocks.ts) y lo edita in-place via onChange.
// Un switch exhaustivo sobre `data.type` -- si se agrega un tipo de bloque
// nuevo al esquema, TypeScript marca error aca hasta agregar su caso (ver el
// `default` con chequeo de nunca-deberia-pasar al final).

function IconCardItemsEditor({
  items,
  onChange,
}: {
  items: IconCardItem[];
  onChange: (items: IconCardItem[]) => void;
}) {
  function update(i: number, patch: Partial<IconCardItem>) {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  return (
    <div>
      <p className="text-p-caption font-semibold text-navy/60">Tarjetas</p>
      <div className="mt-2 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-card-md border border-navy/10 bg-cream p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-p-caption font-bold text-navy/70">Tarjeta {i + 1}</p>
              <button
                type="button"
                className="shrink-0 text-navy/30 hover:text-coral"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                aria-label="Eliminar tarjeta"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <TextField label="Título" value={item.title} onChange={(v) => update(i, { title: v })} />
              <TextField
                label="Color de acento (hex o var css)"
                value={item.tint}
                placeholder="#8F7CB6"
                onChange={(v) => update(i, { tint: v })}
              />
              <TextField
                label="URL de imagen (opcional)"
                value={item.image ?? ""}
                placeholder="https://…"
                onChange={(v) => update(i, { image: v || null })}
              />
              <IconSelect
                label="Ícono de respaldo (si no hay imagen)"
                value={item.icon}
                onChange={(v) => update(i, { icon: v })}
              />
              <NumberField
                label="Zoom de la imagen (1 = normal)"
                value={item.imageScale ?? 1}
                onChange={(v) => update(i, { imageScale: v })}
              />
              <TextField
                label="Etiqueta (tag, opcional)"
                value={item.tag ?? ""}
                onChange={(v) => update(i, { tag: v || null })}
              />
              <TextField
                label="Nivel de evidencia (opcional)"
                value={item.evidenceLabel ?? ""}
                onChange={(v) => update(i, { evidenceLabel: v || null })}
              />
              <SelectField
                label="Confianza (puntos, opcional)"
                value={String(item.confidence ?? 0)}
                onChange={(v) => update(i, { confidence: v === "0" ? null : (Number(v) as 1 | 2 | 3) })}
                options={[
                  { value: "0", label: "Sin indicador" },
                  { value: "1", label: "1 punto" },
                  { value: "2", label: "2 puntos" },
                  { value: "3", label: "3 puntos" },
                ]}
              />
            </div>

            <div className="mt-2">
              <ParagraphsField
                label="Texto"
                paragraphs={item.paragraphs}
                onChange={(paragraphs) => update(i, { paragraphs })}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-3 flex items-center gap-1 text-p-caption font-semibold text-accent hover:underline"
        onClick={() =>
          onChange([
            ...items,
            { image: null, icon: null, imageScale: 1, tint: "#8F7CB6", title: "", tag: null, evidenceLabel: null, confidence: null, paragraphs: [] },
          ])
        }
      >
        <Plus size={13} /> Agregar tarjeta
      </button>
    </div>
  );
}

function IconCardGridForm({
  data,
  onChange,
}: {
  data: IconCardGridBlockData;
  onChange: (data: IconCardGridBlockData) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        <SelectField
          label="Diseño"
          value={data.layout}
          onChange={(v) => onChange({ ...data, layout: v })}
          options={[
            { value: "horizontal-row", label: "Fila horizontal (ícono izq. + texto)" },
            { value: "vertical-card", label: "Tarjeta vertical (franja + círculo)" },
          ]}
        />
        <SelectField
          label="Columnas"
          value={String(data.columns) as "1" | "2"}
          onChange={(v) => onChange({ ...data, columns: Number(v) as 1 | 2 })}
          options={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
          ]}
        />
        <NumberField label="Tamaño del círculo (px)" value={data.circleSize} onChange={(v) => onChange({ ...data, circleSize: v })} />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <SelectField
          label="Franja de color"
          value={data.bannerStyle}
          onChange={(v) => onChange({ ...data, bannerStyle: v })}
          options={[
            { value: "half", label: "Franja tintada detrás del círculo" },
            { value: "none", label: "Sin franja (fondo gris)" },
          ]}
        />
        <NumberField
          label="Alto de la franja (px, opcional)"
          value={data.bannerHeight ?? 0}
          onChange={(v) => onChange({ ...data, bannerHeight: v || undefined })}
        />
        <SelectField
          label="Numeración"
          value={data.numberStyle}
          onChange={(v) => onChange({ ...data, numberStyle: v })}
          options={[
            { value: "none", label: "Sin número" },
            { value: "badge", label: "Círculo numerado" },
            { value: "mobile-index", label: "Número (solo mobile)" },
          ]}
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <CheckboxField label="Centrar texto" checked={data.centerText} onChange={(v) => onChange({ ...data, centerText: v })} />
        <CheckboxField
          label="Mostrar puntos de confianza"
          checked={data.showConfidenceDots}
          onChange={(v) => onChange({ ...data, showConfidenceDots: v })}
        />
        <CheckboxField label="Mostrar etiqueta (tag)" checked={data.showTag} onChange={(v) => onChange({ ...data, showTag: v })} />
        <CheckboxField
          label="Centrar la última si queda sola"
          checked={data.centerLastOdd}
          onChange={(v) => onChange({ ...data, centerLastOdd: v })}
        />
      </div>
      <IconCardItemsEditor items={data.items} onChange={(items) => onChange({ ...data, items })} />
    </div>
  );
}

export default function BlockDataForm({
  data,
  onChange,
}: {
  data: BlockData;
  onChange: (data: BlockData) => void;
}) {
  switch (data.type) {
    case "disclaimer":
      return <TextField label="Texto del aviso" value={data.text} textarea rows={3} onChange={(v) => onChange({ ...data, text: v })} />;

    case "heading":
      // md (no sm): a 640-700px la columna fija de 200px quedaba apretada
      // contra el campo de texto (ago 2026, auditoria responsive) -- md da
      // mas aire antes de partir en dos columnas.
      return (
        <div className="grid gap-2 md:grid-cols-[1fr_200px]">
          <TextField label="Texto del subtítulo" value={data.text} onChange={(v) => onChange({ ...data, text: v })} />
          <IconSelect label="Ícono (opcional)" value={data.icon} onChange={(v) => onChange({ ...data, icon: v })} />
        </div>
      );

    case "rich_text":
      return (
        <div className="space-y-3">
          <SelectField
            label="Estilo"
            value={data.variant ?? "body"}
            onChange={(v) => onChange({ ...data, variant: v })}
            options={[
              { value: "body", label: "Párrafo normal" },
              { value: "lead", label: "Párrafo de introducción (más grande)" },
            ]}
          />
          <StringListField
            label="Párrafos (uno por caja de texto; admite [[cite:N]] y [texto](url))"
            items={data.paragraphs}
            onChange={(paragraphs) => onChange({ ...data, paragraphs })}
            addLabel="Agregar párrafo"
          />
        </div>
      );

    case "icon_card_grid":
      return <IconCardGridForm data={data} onChange={onChange} />;

    case "myth_reality_grid":
      return (
        <PairListField
          label="Mitos y realidades"
          items={data.items}
          onChange={(items) => onChange({ ...data, items: items as Array<{ myth: string; reality: string }> })}
          key1="myth"
          key2="reality"
          label1="Mito"
          label2="Realidad"
        />
      );

    case "checklist":
      return (
        <div className="space-y-3">
          <SelectField
            label="Estilo"
            value={data.style}
            onChange={(v) => onChange({ ...data, style: v })}
            options={[
              { value: "list", label: "Lista con check" },
              { value: "chips", label: "Tarjetas de color" },
            ]}
          />
          <TextField
            label="Nota de fuente (opcional, aparece debajo de la lista)"
            value={data.sourceNote ?? ""}
            onChange={(v) => onChange({ ...data, sourceNote: v || null })}
          />
          <StringListField label="Ítems" items={data.items} onChange={(items) => onChange({ ...data, items })} addLabel="Agregar ítem" />
        </div>
      );

    case "stat_ring_row":
      return (
        <PairListField
          label="Estadísticas"
          items={data.items}
          onChange={(items) => onChange({ ...data, items: items as Array<{ value: number; label: string }> })}
          key1="label"
          key2="value"
          label1="Texto (ej: de pacientes reportó...)"
          label2="Valor (%)"
          numeric2
        />
      );

    case "loop_diagram":
      return (
        <div className="space-y-3">
          <PairListField
            label="Pasos del ciclo (en orden)"
            items={data.steps}
            onChange={(steps) => onChange({ ...data, steps: steps as Array<{ image: string; label: string }> })}
            key1="image"
            key2="label"
            label1="URL de imagen"
            label2="Texto del paso"
          />
          <TextField label="Texto bajo el diagrama (ej: 'el ciclo se repite...')" value={data.loopLabel} onChange={(v) => onChange({ ...data, loopLabel: v })} />
          <TextField label="Texto de cierre" value={data.closingText} textarea rows={2} onChange={(v) => onChange({ ...data, closingText: v })} />
        </div>
      );

    case "cta_card":
      return (
        <div className="space-y-3">
          <TextField label="Pregunta (título)" value={data.question} onChange={(v) => onChange({ ...data, question: v })} />
          <TextField label="Texto secundario" value={data.subtext} textarea rows={2} onChange={(v) => onChange({ ...data, subtext: v })} />
        </div>
      );

    case "references":
      return (
        <PairListField
          label="Referencias"
          items={data.items}
          onChange={(items) => onChange({ ...data, items: items as Array<{ text: string; url: string }> })}
          key1="text"
          key2="url"
          label1="Texto de la cita"
          label2="URL"
        />
      );

    default: {
      const _exhaustive: never = data;
      void _exhaustive;
      return <p className="text-p-caption text-coral">Tipo de bloque desconocido.</p>;
    }
  }
}
