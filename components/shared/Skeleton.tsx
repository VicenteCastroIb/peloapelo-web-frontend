// Bloque base para pantallas de espera tipo "esqueleto" (ago 2026, a pedido
// -- "no debe dar sensacion que se demora"). Antes casi todo el sitio
// mostraba un simple "Cargando…" en texto plano mientras esperaba al
// backend: funcionalmente correcto, pero se siente lento porque la pantalla
// queda practicamente vacia y el layout final "salta" de golpe cuando llega
// la data. Un esqueleto que ya ocupa el mismo espacio/forma que el
// contenido real (mismo grid, mismo alto de card, misma cantidad de lineas)
// hace que la espera se perciba mucho mas corta y evita ese salto de layout,
// aunque el tiempo real de red sea el mismo.
//
// animate-pulse es una utilidad nativa de Tailwind (sin config extra) --
// mismo patron ya usado en HeaderAuthCta.tsx para su estado "loading".
//
// Sin border-radius por defecto a proposito: cada uso pasa su propio
// rounded-* (rounded-md para barras de texto, rounded-pill para chips,
// rounded-card-lg para bloques grandes, o ninguno para las imagenes de
// portada que ya quedan recortadas por el overflow-hidden del contenedor
// padre) -- combinar dos clases rounded-* distintas en el mismo elemento es
// ambiguo en Tailwind (el orden de la cascada no sigue el orden en que se
// escriben las clases en el JSX), asi que es mas seguro que cada consumidor
// declare exactamente una.
export default function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-navy/10 ${className}`} />;
}
