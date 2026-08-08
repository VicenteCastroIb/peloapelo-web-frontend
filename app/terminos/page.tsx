import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { terminosDoc } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Términos y Condiciones · Pelo a Pelo",
  description: "Términos y condiciones de uso de la plataforma de Fundación Pelo a Pelo.",
};

export default function TerminosPage() {
  return <LegalDocument doc={terminosDoc} />;
}
