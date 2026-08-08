import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { privacidadDoc } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Política de Privacidad · Pelo a Pelo",
  description: "Cómo Fundación Pelo a Pelo recopila, usa y protege los datos personales de sus usuarias.",
};

export default function PrivacidadPage() {
  return <LegalDocument doc={privacidadDoc} />;
}
