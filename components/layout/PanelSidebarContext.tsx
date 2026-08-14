"use client";

// Contexto chico para el toggle del sidebar movil del panel interno (ago
// 2026, a pedido -- "adaptar para telefonos"). Header.tsx (el boton
// hamburguesa) y DashboardSidebar.tsx (el drawer que se abre/cierra) NO son
// padre/hijo -- ambos son hijos de SiteChrome.tsx, uno dentro de <Header/> y
// el otro varios niveles mas abajo dentro de <main/> (ver
// app/(app)/layout.tsx). Sin un estado compartido, el boton del Header no
// tendria como avisarle al sidebar que se abra. Mismo patron que
// CourseOutlineSidebar (fixed + translate-x en mobile, columna fija en
// lg+), pero ese caso si tenia al padre en comun a un nivel (el layout de
// la leccion) y podia pasar open/onClose como props directas.
import { createContext, useContext, useState, ReactNode } from "react";

interface PanelSidebarContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const PanelSidebarContext = createContext<PanelSidebarContextValue | undefined>(undefined);

export function PanelSidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value: PanelSidebarContextValue = {
    open,
    toggle: () => setOpen((v) => !v),
    close: () => setOpen(false),
  };
  return <PanelSidebarContext.Provider value={value}>{children}</PanelSidebarContext.Provider>;
}

export function usePanelSidebar() {
  const ctx = useContext(PanelSidebarContext);
  if (!ctx) {
    throw new Error("usePanelSidebar debe usarse dentro de <PanelSidebarProvider>");
  }
  return ctx;
}
