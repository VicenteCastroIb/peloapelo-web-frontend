import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { consentimientoDoc } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Consentimiento Informado — Fotos de Progreso · Pelo a Pelo",
  description: "Consentimiento informado para el módulo de seguimiento fotográfico de progreso.",
};

export default function ConsentimientoFotosPage() {
  return <LegalDocument doc={consentimientoDoc} />;
}
