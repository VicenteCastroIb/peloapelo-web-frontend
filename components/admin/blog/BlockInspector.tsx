"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Save, Trash2 } from "lucide-react";
import type { OwnedBlock } from "./BlockList";
import type {
  BackgroundToken,
  BlockData,
  BlockPaddingToken,
  BlockType,
  DisclaimerBlockData,
  HeadingBlockData,
  RichTextBlockData,
  TextColorToken,
  TextSizeToken,
} from "@/lib/types/blogBlocks";
import { BLOCK_TYPE_LABEL } from "@/lib/admin/blogBlockDefaults";
import { TEXT_COLOR_LABEL, TEXT_COLOR_OPTIONS, TEXT_SIZE_LABEL, TEXT_SIZE_OPTIONS } from "@/lib/blog/textStyleTokens";
import {
  BACKGROUND_LABEL,
  BACKGROUND_OPTIONS,
  DARK_BACKGROUND_TOKENS,
  PADDING_LABEL,
  PADDING_OPTIONS,
} from "@/lib/blog/blockStyleTokens";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { SelectField } from "./blockFieldEditors";
import BlockDataForm from "./BlockDataForm";

// Bloques "de texto libre" (fase 1, ago 2026): los unicos que exponen el
// control de Tipografia de abajo. El resto (icon_card_grid, checklist,
// etc.) son bloques compuestos con varios textos internos de distinto rol
// (titulo de tarjeta, parrafo, etiqueta...) -- un tamaño/color unico a nivel
// de bloque no encaja ahi, asi que quedan fuera por ahora.
type TextBlockData = DisclaimerBlockData | HeadingBlockData | RichTextBlockData;

function isTextBlock(data: BlockData): data is TextBlockData {
  return data.type === "disclaimer" || data.type === "heading" || data.type === "rich_text";
}

// Bloques compuestos que envuelven su propio texto en una tarjeta clara
// interna (bg-white, bg-navy/5, un degradado suave propio, etc.) -- su
// contraste no depende de que fondo tenga la seccion que los rodea, asi que
// quedan seguros con fondo oscuro (navy/gradient) sin tocarles el codigo:
// ver IconCardGridBlock (cards bg-white), MythRealityGridBlock (zonas
// bg-coral-soft/bg-accent-5), StatRingRowBlock (cards bg-navy/5),
// LoopDiagramBlock (degradado propio muy claro) y CtaCardBlock (card
// bg-white con borde). "checklist" cuenta SOLO en su variante "chips" --
// cada item ya es su propia tarjeta de color; en "list" el texto va pelado,
// sin tarjeta. "references" siempre va pelado (lista de texto con un borde
// arriba, sin tarjeta), asi que queda afuera en cualquier variante.
const SELF_CONTAINED_DARK_SAFE_TYPES = new Set<BlockType>([
  "icon_card_grid",
  "myth_reality_grid",
  "stat_ring_row",
  "loop_diagram",
  "cta_card",
]);

function supportsDarkBackground(data: BlockData): boolean {
  if (isTextBlock(data)) return true;
  if (data.type === "checklist") return data.style === "chips";
  return SELF_CONTAINED_DARK_SAFE_TYPES.has(data.type);
}

function TypographyFields({
  data,
  onChange,
}: {
  data: TextBlockData;
  onChange: (data: BlockData) => void;
}) {
  return (
    <div className="mb-4 space-y-3 rounded-card-md border border-navy/10 bg-cream p-3">
      <p className="text-p-caption font-semibold text-navy/60">Tipografía</p>
      <SelectField<TextSizeToken | "">
        label="Tamaño"
        value={data.fontSize ?? ""}
        onChange={(v) => onChange({ ...data, fontSize: v === "" ? null : v })}
        options={[
          { value: "", label: "Por defecto" },
          ...TEXT_SIZE_OPTIONS.map((token) => ({ value: token, label: TEXT_SIZE_LABEL[token] })),
        ]}
      />
      <SelectField<TextColorToken | "">
        label="Color"
        value={data.color ?? ""}
        onChange={(v) => onChange({ ...data, color: v === "" ? null : v })}
        options={[
          { value: "", label: "Por defecto" },
          ...TEXT_COLOR_OPTIONS.map((token) => ({ value: token, label: TEXT_COLOR_LABEL[token] })),
        ]}
      />
    </div>
  );
}

// Fondo y alto de seccion (fase 2, ago 2026): a diferencia de Tipografia,
// aplica a CUALQUIER tipo de bloque (ver BlockStyle en lib/types/blogBlocks).
// "navy"/"gradient" (fondos oscuros) quedan afuera de las opciones cuando el
// bloque no tiene forma de mantener su texto legible encima -- ver
// supportsDarkBackground() arriba para el criterio exacto por tipo.
function SectionStyleFields({ data, onChange }: { data: BlockData; onChange: (data: BlockData) => void }) {
  const allowDarkBackground = supportsDarkBackground(data);
  const backgroundOptions = BACKGROUND_OPTIONS.filter(
    (token) => allowDarkBackground || !DARK_BACKGROUND_TOKENS.includes(token)
  );

  return (
    <div className="mb-4 space-y-3 rounded-card-md border border-navy/10 bg-cream p-3">
      <p className="text-p-caption font-semibold text-navy/60">Fondo y tamaño de la sección</p>
      <SelectField<BackgroundToken | "">
        label="Fondo"
        value={data.background ?? ""}
        onChange={(v) => onChange({ ...data, background: v === "" ? null : v })}
        options={[
          { value: "", label: "Ninguno" },
          ...backgroundOptions.map((token) => ({ value: token, label: BACKGROUND_LABEL[token] })),
        ]}
      />
      <SelectField<BlockPaddingToken | "">
        label="Alto (padding)"
        value={data.padding ?? ""}
        onChange={(v) => onChange({ ...data, padding: v === "" ? null : v })}
        options={[
          { value: "", label: "Normal (por defecto)" },
          ...PADDING_OPTIONS.map((token) => ({ value: token, label: PADDING_LABEL[token] })),
        ]}
      />
      {!allowDarkBackground && (
        <p className="text-p-caption text-navy/75">
          Navy y degradado no están disponibles acá: el texto de este bloque no tiene su propia
          tarjeta clara y quedaría poco legible sobre un fondo oscuro.
          {data.type === "checklist" && " Cambiá el estilo a \"Tarjetas de color\" para poder usarlos."}
        </p>
      )}
    </div>
  );
}

// Panel derecho del editor visual (fase 0): inspector contextual del bloque
// seleccionado en el lienzo (ver BlockDataList editable + BlockList). Vacio
// cuando no hay seleccion. Reemplaza la tarjeta colapsable BlockCard.tsx --
// la edicion sigue siendo por campos (BlockDataForm), no contenteditable en
// el lienzo, para no disparar un esfuerzo mucho mayor en esta fase.
export default function BlockInspector({
  block,
  data,
  index,
  total,
  saving,
  removing,
  moveDisabled,
  token,
  onDataChange,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  block: OwnedBlock | null;
  data: BlockData | null;
  index: number;
  total: number;
  saving: boolean;
  removing: boolean;
  moveDisabled?: boolean;
  /** Solo lo necesita el bloque "image" para subir el archivo (ver BlockDataForm -> ImageUploadField). */
  token: string | null | undefined;
  onDataChange: (data: BlockData) => void;
  onSave: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!block || !data) {
    return (
      <div className="rounded-card-md border border-dashed border-navy/15 bg-white p-6 text-center @5xl:sticky @5xl:top-6 @5xl:self-start">
        <p className="text-p-small text-navy/50">Seleccioná un bloque en el lienzo para editarlo acá.</p>
      </div>
    );
  }

  const label = BLOCK_TYPE_LABEL[block.blockType as BlockType] ?? block.blockType;

  return (
    <div className="rounded-card-md border border-navy/10 bg-white shadow-sm @5xl:sticky @5xl:top-6 @5xl:max-h-[calc(100vh-3rem)] @5xl:self-start @5xl:overflow-y-auto">
      <div className="flex items-center gap-1 border-b border-navy/10 px-4 py-3">
        <span className="mr-auto rounded-pill bg-navy/5 px-2.5 py-0.5 text-p-caption font-semibold text-navy/70">
          {label}
        </span>
        <button
          type="button"
          disabled={index <= 0 || moveDisabled}
          onClick={onMoveUp}
          className="rounded-pill p-1.5 text-navy/40 hover:bg-navy/5 disabled:opacity-20"
          aria-label="Subir"
        >
          <ChevronUp size={15} />
        </button>
        <button
          type="button"
          disabled={index < 0 || index === total - 1 || moveDisabled}
          onClick={onMoveDown}
          className="rounded-pill p-1.5 text-navy/40 hover:bg-navy/5 disabled:opacity-20"
          aria-label="Bajar"
        >
          <ChevronDown size={15} />
        </button>
        <button
          type="button"
          disabled={removing}
          onClick={() => setConfirmOpen(true)}
          className="rounded-pill p-1.5 text-navy/40 hover:bg-coral-soft hover:text-coral disabled:opacity-40"
          aria-label="Eliminar bloque"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="p-4">
        {isTextBlock(data) && <TypographyFields data={data} onChange={onDataChange} />}
        <SectionStyleFields data={data} onChange={onDataChange} />
        <BlockDataForm data={data} token={token} onChange={onDataChange} />
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="mt-4 flex items-center gap-1.5 rounded-pill bg-navy px-4 py-2 text-p-caption font-semibold text-cream disabled:opacity-50"
        >
          <Save size={13} /> {saving ? "Guardando…" : "Guardar bloque"}
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={`¿Eliminar este bloque de "${label}"?`}
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar bloque"
        loading={removing}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
