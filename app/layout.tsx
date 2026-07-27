import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "./globals.css";

// Reemplaza a Lato (26 jul 2026, a pedido explicito de "fuente mas
// profesional"). Plus Jakarta Sans cubre 300-800 real (no aproximado por el
// navegador) y mantiene la misma sensacion calida/editorial que ya tenia el
// sitio, solo con mas pulido. La cifra 900 de .text-data-* (ver globals.css)
// se bajo a 800 real para que coincida con un peso realmente cargado.
// style incluye "italic": la mitad de los enfasis del sitio son <span
// className="italic"> (palabras destacadas en cada h2, ver componentes de
// seccion) -- sin cargar el archivo italico real, el navegador los
// renderiza con una inclinacion sintetica (oblique) que se ve mas tosca.
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Pelo a Pelo — Apoyo en la pérdida de cabello",
  description:
    "Acompañamiento integral creado por quien ha vivido la alopecia toda su vida. Cuerpo, emoción y hábitos — a tu ritmo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-navy font-sans">
        <AuthProvider>
          <Header />
          <main className="flex-1 pt-[72px]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
