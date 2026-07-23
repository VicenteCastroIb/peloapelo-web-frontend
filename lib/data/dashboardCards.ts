import { Camera, BookOpen, Search, Heart, Sparkles, CreditCard, LucideIcon } from "lucide-react";

export interface DashboardCard {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  href: string | null;
}

// Basado en el dashboard real (ver docs/scan-22-07-2026/02-dashboard-interno.md).
// "Programa de 3 Meses" queda decorativa (href: null) porque tampoco navega a
// nada en el sitio real todavia. "Mi Suscripción" SI esta conectada aca -
// mejora sobre el sitio real, que la tiene marcada "Proximamente".
export const dashboardCards: DashboardCard[] = [
  {
    icon: Camera,
    badge: "Disponible",
    title: "Seguimiento de Progreso",
    description: "Fotos, estado de ánimo y reportes para tu médico",
    href: "/progress",
  },
  {
    icon: BookOpen,
    badge: "3 cursos",
    title: "Cursos",
    description: "Ansiedad, cuerpo y crecimiento personal",
    href: "/courses",
  },
  {
    icon: Search,
    badge: "Guía",
    title: "Acceso a Tofacitinib",
    description: "Te acompañamos para que acceder a tu medicamento sea fácil",
    href: "/tofacitinib",
  },
  {
    icon: Heart,
    badge: "Nuevo",
    title: "Agenda con Terapeuta",
    description: "Sesiones con profesionales de salud mental que te acompañan",
    href: "/therapist",
  },
  {
    icon: Sparkles,
    badge: "Premium",
    title: "Programa de 3 Meses",
    description: "Viaje guiado de manejo de ansiedad con coach personal",
    href: null,
  },
  {
    icon: CreditCard,
    badge: "Disponible",
    title: "Mi Suscripción",
    description: "Gestiona tu plan y pagos",
    href: "/subscription",
  },
];
