import type { TextColorToken, TextSizeToken } from "@/lib/types/blogBlocks";

// Metadata de la escala tipografica/de color de los bloques de texto libre
// (disclaimer/heading/rich_text) -- fase 1 del editor visual, ago 2026. Vive
// en lib/blog/ (no lib/admin/) porque lo consumen tanto los componentes de
// render PUBLICOS (HeadingBlock/RichTextBlock/DisclaimerBlock, para aplicar
// la clase elegida) como el panel /admin/blog (BlockInspector, para listar
// las opciones) -- mismo criterio que ya separa BlockDataList del resto de
// componentes admin-only.
//
// Escala cerrada a proposito (sin input de px/color libre): protege la
// identidad visual de la fundacion. "h1" acá NO es la clase .text-h1 global
// (112px, reservada al hero de pagina) sino el tope razonable para un bloque
// DENTRO del cuerpo de un articulo -- se eligio text-h2-lg (60px) para que
// nunca empate ni supere al titulo real del articulo (text-h2-xl, 72px, ver
// ArticleHeaderPreview.tsx).
export const TEXT_SIZE_LABEL: Record<TextSizeToken, string> = {
  caption: "Caption (11px)",
  small: "Chico (13px)",
  body: "Normal (16px)",
  lead: "Introducción (20px)",
  h3: "Subtítulo chico (22px)",
  h2: "Subtítulo (36px)",
  h1: "Subtítulo grande (60px)",
};

export const TEXT_SIZE_CLASS: Record<TextSizeToken, string> = {
  caption: "text-p-caption",
  small: "text-p-small",
  body: "text-p-body",
  lead: "text-p-lead",
  h3: "text-h3-md",
  h2: "text-h2-md",
  h1: "text-h2-lg",
};

export const TEXT_SIZE_OPTIONS = Object.keys(TEXT_SIZE_LABEL) as TextSizeToken[];

export const TEXT_COLOR_LABEL: Record<TextColorToken, string> = {
  navy: "Navy (texto principal)",
  "navy-soft": "Navy suave",
  accent: "Violeta de marca",
  coral: "Coral (alerta)",
  cream: "Cream (para fondos oscuros)",
};

export const TEXT_COLOR_CLASS: Record<TextColorToken, string> = {
  navy: "text-navy",
  "navy-soft": "text-navy/60",
  accent: "text-accent",
  coral: "text-coral",
  cream: "text-cream",
};

export const TEXT_COLOR_OPTIONS = Object.keys(TEXT_COLOR_LABEL) as TextColorToken[];
