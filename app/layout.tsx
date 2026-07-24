import type { Metadata } from "next";
import { Lato } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  // 300/900 se suman a 400/700: la escala tipografica (globals.css) usa
  // pesos intermedios (600, 800) que Lato no tiene como fuente propia, asi
  // que el navegador igual aproxima al mas cercano cargado — con 300 y 900
  // disponibles esa aproximacion es mas fiel (antes solo tenia 400/700 y
  // todo lo "liviano" o "extra bold" se veia forzado). El 900 tambien
  // habilita el peso real para las cifras de datos (ver .text-data-*).
  weight: ["300", "400", "700", "900"],
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
          <Header />
          <main className="flex-1 pt-[104px]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
