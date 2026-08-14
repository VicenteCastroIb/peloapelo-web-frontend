/**
 * Normaliza un texto a slug de URL: sin tildes, minúsculas, espacios/símbolos -> guion.
 * Compartido por ArticleForm.tsx y CourseForm.tsx -- ambos formularios ocultan el
 * campo de slug (la dueña de la fundación no tiene por qué pensar en URLs) y lo
 * derivan siempre del título, así que la misma función tiene que vivir en un solo
 * lugar en vez de duplicarse en cada formulario.
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
