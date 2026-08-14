import Link from "next/link";
import type { ReactNode } from "react";

// Parser de texto enriquecido para el blog editable (ago 2026). El panel
// /admin/blog guarda texto plano (no HTML/Markdown completo, para que la
// duenia de la fundacion pueda escribir en un textarea simple), con 2 tokens
// inline reconocidos:
//   [[cite:3]]         -> nota al pie [3], link a #ref-3 (ver Cite() abajo)
//   [texto](/ruta)      -> link interno (Next <Link>)
//   [texto](https://…) -> link externo (target=_blank, rel=noopener)
// Cualquier otro texto se deja tal cual. Deliberadamente NO se soporta
// markdown completo (negritas, listas, etc.) -- si en el futuro hace falta
// mas formato, conviene resolverlo agregando un nuevo tipo de bloque, no
// expandiendo este mini-lenguaje.

const TOKEN_RE = /\[\[cite:(\d+)\]\]|\[([^\]]+)\]\(([^)]+)\)/g;

export function Cite({ n }: { n: number }) {
  return (
    <sup>
      <a href={`#ref-${n}`} className="text-accent hover:underline">
        [{n}]
      </a>
    </sup>
  );
}

/** Convierte un string con tokens [[cite:N]] / [label](url) en nodos React. */
export function renderRichText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const [, citeN, linkLabel, linkUrl] = match;
    if (citeN !== undefined) {
      nodes.push(<Cite key={`cite-${key++}`} n={Number(citeN)} />);
    } else if (linkUrl.startsWith("/")) {
      nodes.push(
        <Link key={`link-${key++}`} href={linkUrl} className="font-bold text-accent hover:underline">
          {linkLabel}
        </Link>
      );
    } else {
      nodes.push(
        <a
          key={`link-${key++}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-accent hover:underline"
        >
          {linkLabel}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

/** Atajo para envolver el resultado de renderRichText en un <>...</> cuando se necesita un solo ReactNode. */
export function RichText({ text }: { text: string }) {
  return <>{renderRichText(text)}</>;
}
