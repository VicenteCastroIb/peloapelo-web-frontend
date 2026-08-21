import type { BackgroundToken, BlockPaddingToken, BlockStyle } from "@/lib/types/blogBlocks";

// Fondo y alto (padding) de seccion por bloque -- fase 2 del editor visual,
// ago 2026. Aplica a CUALQUIER tipo de bloque (ver BlockStyle en
// lib/types/blogBlocks.ts), no solo a los de texto. Escala cerrada a
// proposito (sin color picker ni px libres): protege la identidad visual de
// la fundacion.
export const BACKGROUND_LABEL: Record<BackgroundToken, string> = {
  cream: "Cream (tarjeta clara)",
  navy: "Navy (fondo oscuro)",
  "accent-soft": "Violeta suave",
  gradient: "Degradado de marca",
  "coral-soft": "Coral suave",
};

export const BACKGROUND_CLASS: Record<BackgroundToken, string> = {
  cream: "bg-cream border border-navy/10",
  navy: "bg-navy",
  "accent-soft": "bg-accent/10",
  gradient: "bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]",
  "coral-soft": "bg-coral-soft",
};

export const BACKGROUND_OPTIONS = Object.keys(BACKGROUND_LABEL) as BackgroundToken[];

// "navy" y "gradient" son fondos oscuros/medios -- el texto navy que traen
// hardcodeado por defecto la mayoria de los bloques queda ilegible encima.
// Los 3 bloques de texto libre (disclaimer/heading/rich_text) pueden pedir
// color de texto "cream" para acompañarlos (ver textStyleTokens.ts); el
// resto de los bloques compuestos todavia no tiene control de color de
// texto propio, asi que el inspector no les ofrece estos 2 tokens (ver
// BlockInspector.tsx) para no dejar un bloque ilegible por accidente.
export const DARK_BACKGROUND_TOKENS: BackgroundToken[] = ["navy", "gradient"];

export const PADDING_LABEL: Record<BlockPaddingToken, string> = {
  compact: "Compacto",
  normal: "Normal",
  spacious: "Espacioso",
};

export const PADDING_CLASS: Record<BlockPaddingToken, string> = {
  compact: "p-3 sm:p-4",
  normal: "p-5 sm:p-6",
  spacious: "p-8 sm:p-10",
};

export const PADDING_OPTIONS = Object.keys(PADDING_LABEL) as BlockPaddingToken[];

// Clase del contenedor de seccion de un bloque, o "" si no tiene fondo ni
// padding elegidos (en cuyo caso el bloque se ve exactamente igual que
// antes de la fase 2 -- ver BlockDataList.tsx, que solo monta el div
// envoltorio cuando esto devuelve algo). Con fondo pero sin padding
// explicito, cae a "normal": un fondo pegado directo al texto sin aire se
// ve como un bug, no como una eleccion de diseño.
export function blockSectionClassName(data: BlockStyle): string {
  const parts: string[] = [];
  if (data.background) {
    parts.push(BACKGROUND_CLASS[data.background], "rounded-card-lg");
  }
  const padding = data.padding ?? (data.background ? "normal" : null);
  if (padding) parts.push(PADDING_CLASS[padding]);
  return parts.join(" ");
}
