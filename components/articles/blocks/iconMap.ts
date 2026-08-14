import {
  Activity,
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Dna,
  Feather,
  HeartHandshake,
  LifeBuoy,
  Moon,
  PenLine,
  RotateCcw,
  Sun,
  Timer,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";

// Mapa de nombres de icono (string, tal como los guarda un bloque
// icon_card_grid/heading en su data_json) a su componente lucide-react real.
// Lista curada (no todo lucide-react) a proposito: el panel /admin/blog va a
// ofrecer un <select> con estas opciones, no un input de texto libre -- asi
// no se puede guardar un nombre que no exista y rompa el render. Agregar un
// icono nuevo = agregarlo aca + a la lista del selector del admin.
export const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Dna,
  Feather,
  HeartHandshake,
  LifeBuoy,
  Moon,
  PenLine,
  RotateCcw,
  Sun,
  Timer,
  Users,
  XCircle,
};

export function resolveIcon(name?: string | null): LucideIcon | null {
  if (!name) return null;
  return ICON_MAP[name] ?? null;
}

// Nombre en español para cada ícono, solo para mostrar en el <select> del
// panel /admin/blog (ago 2026, a pedido: "cada icono debe estar en
// español") -- el VALOR guardado en dataJson sigue siendo la clave en
// inglés de ICON_MAP de arriba (ej. "BadgeCheck"), sin tocar, porque es lo
// que ya usan los articulos existentes para resolver el componente lucide.
// Cambiar solo la clave hubiera roto esos articulos sin una migracion.
export const ICON_LABEL_ES: Record<string, string> = {
  Activity: "Actividad",
  ArrowDown: "Flecha abajo",
  ArrowRight: "Flecha derecha",
  BadgeCheck: "Insignia verificada",
  CheckCircle2: "Marca de verificación",
  Dna: "ADN",
  Feather: "Pluma",
  HeartHandshake: "Apoyo / cuidado",
  LifeBuoy: "Salvavidas",
  Moon: "Luna",
  PenLine: "Lápiz",
  RotateCcw: "Ciclo / reiniciar",
  Sun: "Sol",
  Timer: "Cronómetro",
  Users: "Personas",
  XCircle: "Equis / cancelar",
};
