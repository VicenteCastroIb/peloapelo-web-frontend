// Movido a components/admin/PreviewErrorBoundary.tsx (ago 2026): dejo de ser
// exclusivo del blog porque LiveCoursePreview (cursos) tambien lo necesita.
// Este archivo se mantiene como re-export por si queda alguna referencia
// vieja -- no se puede borrar el archivo fisicamente en este entorno, asi
// que en vez de duplicar la logica del boundary, reexporta la version
// compartida.
export { default } from "@/components/admin/PreviewErrorBoundary";
