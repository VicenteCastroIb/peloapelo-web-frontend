"use client";

import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { dashboardCards } from "@/lib/data/dashboardCards";

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(" ")[0] || user?.email;

  return (
    <div className="max-w-4xl">
      <h1 className="text-h3-lg text-navy">Hola, {firstName}.</h1>
      <p className="mt-1 text-p-body text-navy/60">Tu espacio seguro para crecer. Cada paso cuenta.</p>

      <div className="mt-8 rounded-card-lg bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] p-8 text-white">
        <p className="flex items-center gap-2 text-h4-label opacity-80">
          <Sparkles size={14} /> Para ti hoy
        </p>
        <h2 className="mt-3 text-h3-md">No estás solo/a en esto 💜</h2>
        <p className="mt-2 max-w-2xl text-p-small text-white/90">
          Esta plataforma integra mente, cuerpo y emoción para acompañarte en tu
          proceso. No reemplaza a tus doctores — es un complemento que te ayuda a
          entender lo que sientes, registrar tu progreso y tomar decisiones
          informadas junto a tu equipo médico.
        </p>
        <p className="mt-4 flex items-center gap-2 text-p-caption opacity-80">
          <Heart size={14} /> Mirada integrativa: mente · cuerpo · emoción
        </p>
      </div>

      <h3 className="mt-10 text-h3-sm text-navy">Explora</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          const content = (
            <>
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-icon bg-accent/10 text-accent">
                  <Icon size={18} />
                </span>
                <span className="rounded-pill bg-navy/5 px-2.5 py-1 text-p-caption font-semibold text-navy/60">
                  {card.badge}
                </span>
              </div>
              <p className="mt-4 text-h3-sm text-navy">{card.title}</p>
              <p className="mt-1 text-p-small text-navy/60">{card.description}</p>
            </>
          );

          if (!card.href) {
            return (
              <div key={card.title} className="rounded-card-md bg-white p-5 shadow-sm">
                {content}
              </div>
            );
          }

          return (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-card-md bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
