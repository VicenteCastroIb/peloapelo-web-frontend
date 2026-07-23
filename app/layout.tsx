import type { Metadata } from "next";
import { Lato } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
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
