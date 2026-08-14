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

/**
 * Cualquier ruta autenticada bajo app/(app) -- dashboard, cursos (listado y
 * detalle, no la inmersion de leccion, esa ya se filtra aparte con
 * isImmersiveLessonPath), perfil, progreso, suscripcion, agendar sesion y
 * TODO /admin (panel de administracion, mismo grupo de rutas). Next.js no
 * incluye el nombre del route group "(app)" en el pathname real, asi que la
 * unica forma de reconocerlas desde afuera (ver SiteChrome.tsx) es listando
 * a mano los mismos segmentos de primer nivel que existen como carpetas
 * bajo app/(app)/. Se usa para mostrar el CompactFooter (ver
 * components/layout/CompactFooter.tsx) en vez del Footer publico completo
 * -- "el panel interno, como usuario y admin".
 */
const APP_PANEL_SEGMENTS = [
  "admin",
  "courses",
  "dashboard",
  "profile",
  "progress",
  "subscription",
  "therapist",
  "tofacitinib",
];

export function isAppPanelPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return APP_PANEL_SEGMENTS.includes(segments[0]);
}
