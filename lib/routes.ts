/**
 * Ruta de "inmersion" del e-learning (/courses/[slug]/[lessonSlug]): al
 * entrar a leer una leccion, el Header/Footer globales y el DashboardSidebar
 * desaparecen (ver SiteChrome.tsx y app/(app)/layout.tsx) -- el propio
 * LessonImmersiveHeader (ver components/course/) reemplaza esa navegacion
 * con una version compacta, al estilo del reproductor de AWS Skill Builder,
 * dejando todo el alto de la pantalla para el contenido.
 */
export function isImmersiveLessonPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return segments[0] === "courses" && segments.length === 3;
}
