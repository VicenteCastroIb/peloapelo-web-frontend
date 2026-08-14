"use client";

// Desplegable fluido generico -- ver .collapse-panel en globals.css (mismo
// truco de grid-template-rows que ya usaba el acordeon del FAQ, ahora
// reutilizable). Envuelve cualquier bloque que se muestra/oculta segun un
// boolean `open`, en vez de que cada componente lo condicione con
// `{open && (...)}` (que aparece/desaparece de un salto, sin transicion --
// ese era el problema en BlockCard, LessonEditor, los formularios "Agregar
// modulo/leccion/recurso", etc.).
//
// A diferencia de `{open && children}`, esto SIEMPRE monta `children` en el
// DOM (solo lo colapsa visualmente a alto 0) -- por eso no conviene usarlo
// para contenido que dispara un fetch o efecto pesado al montarse. En todos
// los desplegables de este sitio el contenido ya vive controlado por estado
// que existe igual este abierto o cerrado, asi que mantenerlo montado no
// tiene costo real.
export default function Collapse({
  open,
  children,
  className = "",
}: {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`collapse-panel ${className}`} data-open={open}>
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
