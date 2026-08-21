// Esquema de bloques del blog editable (ago 2026). Cada articulo se arma
// como una lista ordenada de bloques heterogeneos (ver backend V16, tabla
// article_blocks: block_type + data_json). Estos tipos son el contrato
// TypeScript de esa forma JSON -- deben coincidir exacto con lo que
// escriba/lea el panel /admin/blog y con lo que sabe interpretar
// ArticleBlocksRenderer.tsx.
//
// El texto libre (paragraphs, reality, subtext, etc.) soporta 2 tokens
// inline que parsea lib/blog/richText.tsx:
//   [[cite:3]]        -> nota al pie [3] enlazada a #ref-3
//   [texto](/ruta)     -> link interno (Next <Link>)
//   [texto](https://…) -> link externo (target=_blank)

export type ParagraphTone = "primary" | "secondary";

export interface RichParagraph {
  text: string;
  /** "primary" (texto principal) por defecto; "secondary" = mas tenue (ej. el "why" bajo el "how" en TOOLS/BODY_HABITS). */
  tone?: ParagraphTone;
}

// Escala tipografica y de color limitada para bloques de texto libre (fase 1
// del editor visual, ago 2026) -- ver lib/blog/textStyleTokens.ts para las
// clases Tailwind que representa cada token. A proposito una lista cerrada
// (no px/color libres): protege la identidad visual de la fundacion.
export type TextSizeToken = "caption" | "small" | "body" | "lead" | "h3" | "h2" | "h1";
/** "cream" (fase 2) es el que se usa para que el texto siga legible sobre un fondo de seccion oscuro (navy/gradient, ver BackgroundToken). */
export type TextColorToken = "navy" | "navy-soft" | "accent" | "coral" | "cream";

// Fondo y alto (padding) de seccion (fase 2, ago 2026) -- ver
// lib/blog/blockStyleTokens.ts para las clases Tailwind de cada token.
// Aplica a CUALQUIER bloque (no solo los de texto), por eso vive en una
// interfaz aparte que todos los *BlockData extienden, en vez de duplicar
// estos 2 campos en cada uno.
export type BackgroundToken = "cream" | "navy" | "accent-soft" | "gradient" | "coral-soft";
export type BlockPaddingToken = "compact" | "normal" | "spacious";

export interface BlockStyle {
  /** undefined/null = sin fondo de seccion (el bloque se ve igual que antes de la fase 2). */
  background?: BackgroundToken | null;
  /** undefined/null = "normal" cuando hay fondo, o sin padding extra cuando no lo hay. */
  padding?: BlockPaddingToken | null;
}

export interface DisclaimerBlockData extends BlockStyle {
  type: "disclaimer";
  text: string;
  /** undefined/null = usa el tamaño/color por defecto de este tipo de bloque (ver DisclaimerBlock.tsx). */
  fontSize?: TextSizeToken | null;
  color?: TextColorToken | null;
}

export interface HeadingBlockData extends BlockStyle {
  type: "heading";
  text: string;
  /** Nombre de icono lucide-react (ver components/articles/blocks/iconMap.ts). Opcional. */
  icon?: string | null;
  fontSize?: TextSizeToken | null;
  color?: TextColorToken | null;
}

export interface RichTextBlockData extends BlockStyle {
  type: "rich_text";
  /** "lead" = intro del articulo (text-p-lead, mas grande); "body" (default) = parrafo normal.
   *  Legacy (pre-fase-1): sigue siendo el fallback cuando `fontSize` no esta definido, para no
   *  romper el aspecto de articulos publicados antes de que existiera `fontSize`. El panel ya no
   *  expone un selector aparte para esto -- lo reemplazo el control de Tipografia del inspector. */
  variant?: "lead" | "body";
  paragraphs: string[];
  fontSize?: TextSizeToken | null;
  color?: TextColorToken | null;
}

export interface IconCardItem {
  image?: string | null;
  /** Nombre de icono lucide-react, fallback cuando no hay imagen (ver iconMap.ts). */
  icon?: string | null;
  /** Zoom de la imagen dentro del circulo (1 = sin zoom). Algunas acuarelas se generaron con mucho margen blanco y necesitan zoom para que el sujeto se vea grande (ver GuiaAutocuidado.tsx original, scale-[1.45]). */
  imageScale?: number;
  tint: string;
  title: string;
  tag?: string | null;
  evidenceLabel?: string | null;
  confidence?: 1 | 2 | 3 | null;
  paragraphs: RichParagraph[];
}

export interface IconCardGridBlockData extends BlockStyle {
  type: "icon_card_grid";
  /** "horizontal-row" = icono izquierda/texto derecha, 1 columna (TOOLS). "vertical-card" = franja de color + circulo superpuesto arriba, texto abajo (HAIR_TYPES/TREATMENTS/BODY_HABITS/MIND_HABITS). */
  layout: "horizontal-row" | "vertical-card";
  columns: 1 | 2;
  circleSize: number;
  /** "half" = franja de color detras del circulo (color-mix 16%); "none" = fondo gris plano (bg-navy/5), sin franja. */
  bannerStyle: "half" | "none";
  /** Alto de la franja en px (solo con bannerStyle "half"). Si se omite, se calcula como circleSize*0.6. */
  bannerHeight?: number;
  centerText: boolean;
  /** "none" = sin numero; "badge" = circulo numerado superpuesto siempre visible; "mobile-index" = numero de texto, solo visible en mobile. */
  numberStyle: "none" | "badge" | "mobile-index";
  showConfidenceDots: boolean;
  showTag: boolean;
  /** Si el ultimo item queda solo en su fila (grid de 2 columnas con cantidad impar), centrarlo en vez de dejarlo pegado a la izquierda. */
  centerLastOdd: boolean;
  items: IconCardItem[];
}

export interface MythRealityGridBlockData extends BlockStyle {
  type: "myth_reality_grid";
  items: Array<{ myth: string; reality: string }>;
}

export interface ChecklistBlockData extends BlockStyle {
  type: "checklist";
  /** "list" = check + texto en columna unica (SIGNALS). "chips" = tarjetas de color rotando paleta, 2 columnas, texto centrado (HAIR_CARE_TIPS). */
  style: "list" | "chips";
  sourceNote?: string | null;
  items: string[];
}

export interface StatRingRowBlockData extends BlockStyle {
  type: "stat_ring_row";
  items: Array<{ value: number; label: string }>;
}

export interface LoopDiagramBlockData extends BlockStyle {
  type: "loop_diagram";
  steps: Array<{ image: string; label: string }>;
  loopLabel: string;
  closingText: string;
}

export interface CtaCardBlockData extends BlockStyle {
  type: "cta_card";
  question: string;
  subtext: string;
}

export interface ReferencesBlockData extends BlockStyle {
  type: "references";
  items: Array<{ text: string; url: string }>;
}

export type BlockData =
  | DisclaimerBlockData
  | HeadingBlockData
  | RichTextBlockData
  | IconCardGridBlockData
  | MythRealityGridBlockData
  | ChecklistBlockData
  | StatRingRowBlockData
  | LoopDiagramBlockData
  | CtaCardBlockData
  | ReferencesBlockData;

export type BlockType = BlockData["type"];

/** Forma cruda tal como llega del backend (BlogController/AdminBlogController) -- dataJson es texto JSON opaco, ver nota en Article.java. */
export interface RawArticleBlock {
  id?: string;
  articleId?: string;
  blockType: string;
  position: number;
  dataJson: string;
}

export interface ArticleSummary {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  coverImageUrl: string | null;
  readTime: string | null;
}

export interface ArticleDetail extends ArticleSummary {
  blocks: RawArticleBlock[];
}
