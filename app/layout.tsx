import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthContext";
import SiteChrome from "@/components/layout/SiteChrome";
import "./globals.css";

// Vuelve a Lato (27 jul 2026, a peticion explicita de la duenia de la
// fundacion). Se cargan todos los pesos reales que ofrece Lato en Google
// Fonts (100/300/400/700/900, normal e italica) -- el maximo posible, para
// que se vea lo mas profesional posible y el navegador tenga que aproximar
// lo menos posible cualquier peso intermedio (500/600/800) que use algun
// componente. style incluye "italic": la mitad de los enfasis del sitio son
// <span className="italic"> (palabras destacadas en cada h2, ver
// componentes de seccion) -- sin cargar el archivo italico real, el
// navegador los renderiza con una inclinacion sintetica (oblique) que se ve
// mas tosca.
const lato = Lato({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
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
    <html lang="es" className={`${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-navy font-sans">
        <AuthProvider>
          <SiteChrome>{children}</SiteChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
