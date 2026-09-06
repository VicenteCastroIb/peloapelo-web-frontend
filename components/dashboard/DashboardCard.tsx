"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, type LucideIcon } from "lucide-react";
import ProgressBar from "@/components/shared/ProgressBar";

type BadgeTone = "accent" | "neutral" | "gradient";

const BADGE_TONES: Record<BadgeTone, string> = {
  accent: "bg-accent/10 text-accent",
  neutral: "bg-navy/5 text-navy/60",
  gradient: "text-white bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]",
};

interface DashboardCardProps {
  icon?: LucideIcon;
  /** Ícono propio (ilustración generada) para reemplazar el ícono de Lucide
   * dentro del mismo círculo -- usar cuando la librería de íconos no
   * alcanza a comunicar el tono emocional de la tarjeta (ver
   * docs/assets/generated/agenda-terapeuta-icono.jpg, tarjeta "Agenda con
   * Terapeuta"). Si se pasa junto con `icon`, esta prop gana; una de las
   * dos es requerida salvo que `locked` sea true (usa el candado).
   */
  iconImage?: string;
  badge: string;
  badgeTone?: BadgeTone;
  title: string;
  description: string;
  href: string;
  progress?: number;
  progressLabel?: string;
  /** Tarjeta "Acceso a Tofacitinib" del rediseno /dashboard: sin link, sin
   * hover, candado en vez del icono real -- avisa el siguiente paso
   * ("Te avisamos por correo...") en vez de solo "Proximamente" (ver
   * docs/design del rediseno /dashboard). */
  locked?: boolean;
  /** Protagonista de la grilla "Explora" (ago 2026, a pedido: "la card de
   * agendamiento debe ser la mas grande y central") -- fondo degradado de
   * marca en vez de blanco, tipografia mas grande, pensada para ocupar 2
   * filas en el grid bento de dashboard/page.tsx (ver ".pap-explora-hero"
   * en globals.css). Solo cambia estilo/escala, no comportamiento. */
  featured?: boolean;
  /** Acento decorativo en la esquina inferior derecha (acuarela con
   * transparencia, mismo tratamiento que adorno-rama.png en el banner
   * "Mensaje del dia" -- ver Hero del handoff). Opcional: si el archivo
   * todavia no existe (se genera con IA aparte, ver prompts entregados),
   * onError lo oculta en vez de dejar el icono roto del navegador. */
  image?: string;
  /** Grid-area / span para el bento de "Explora" (ver ".pap-explora-*" en
   * globals.css) -- se agrega tal cual al className, esta tarjeta no sabe
   * nada de layout. */
  className?: string;
}

// Acceso rapido como tarjeta del sistema -- compartida entre /dashboard
// ("Explora") y /profile ("Accesos rapidos"), ver docs/design de ambos
// rediseños: mismo componente, mismo nombre, en los dos handoffs.
export default function DashboardCard({
  icon: Icon,
  iconImage,
  badge,
  badgeTone = "neutral",
  title,
  description,
  href,
  progress,
  progressLabel,
  locked = false,
  featured = false,
  image,
  className = "",
}: DashboardCardProps) {
  const [imageError, setImageError] = useState(false);
  const [iconImageError, setIconImageError] = useState(false);

  const accent = image && !imageError && (
    // eslint-disable-next-line @next/next/no-img-element -- acento decorativo con onError; no necesita el pipeline de optimizacion de next/image
    <img
      src={image}
      alt=""
      aria-hidden
      onError={() => setImageError(true)}
      className={`pointer-events-none absolute -bottom-3 -right-3 w-44 select-none ${
        featured ? "opacity-90 mix-blend-soft-light" : "opacity-[0.35] mix-blend-multiply"
      }`}
    />
  );

  const content = (
    <>
      {accent}
      <div className="relative flex items-start justify-between gap-3">
        <span
          className={`flex shrink-0 items-center justify-center rounded-icon transition-colors duration-300 ease-out motion-reduce:transition-none ${
            featured
              ? "h-14 w-14 bg-white/15 text-white"
              : locked
                ? "h-11 w-11 bg-navy/5 text-navy/35"
                : "h-11 w-11 bg-accent/10 text-accent group-hover:bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] group-hover:text-white"
          }`}
        >
          {locked ? (
            <Lock size={20} strokeWidth={1.9} />
          ) : iconImage && !iconImageError ? (
            // eslint-disable-next-line @next/next/no-img-element -- ilustracion propia (fondo transparente), no un icono de la libreria
            <img
              src={iconImage}
              alt=""
              aria-hidden
              onError={() => setIconImageError(true)}
              className={featured ? "h-8 w-8 object-contain" : "h-6 w-6 object-contain"}
            />
          ) : Icon ? (
            <Icon size={featured ? 24 : 20} strokeWidth={1.9} />
          ) : null}
        </span>
        <span
          className={`rounded-pill px-2.5 py-1 text-p-caption font-semibold ${
            featured ? "bg-white/15 text-white" : BADGE_TONES[badgeTone]
          }`}
        >
          {badge}
        </span>
      </div>
      <div className={`relative ${featured ? "mt-6" : "mt-4"}`}>
        <p
          className={
            featured
              ? "text-h3-md text-white"
              : `text-lg font-bold ${locked ? "text-navy/60" : "text-navy"}`
          }
        >
          {title}
        </p>
        <p className={`mt-1 ${featured ? "max-w-[30ch] text-p-body text-white/85" : `text-p-body font-medium ${locked ? "text-navy/50" : "text-navy/70"}`}`}>
          {description}
        </p>
      </div>
      {progress !== undefined && (
        <div className="relative mt-auto pt-4">
          <ProgressBar percent={progress} />
          {progressLabel && (
            <p className={`mt-1.5 text-p-caption ${featured ? "text-white/75" : "text-navy/50"}`}>{progressLabel}</p>
          )}
        </div>
      )}
      {!locked && (
        <ArrowRight
          size={16}
          aria-hidden
          className={`absolute bottom-5 right-5 -translate-x-1.5 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none ${
            featured ? "text-white" : "text-accent"
          }`}
        />
      )}
    </>
  );

  const sizing = featured ? "min-h-[300px] p-7 lg:h-full" : "min-h-[208px] p-5";
  const surface = featured
    ? "bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] shadow-[0_20px_45px_-12px_rgba(96,73,141,0.35)]"
    : "border border-navy/10 bg-white shadow-sm";

  if (locked) {
    return (
      <div
        aria-disabled="true"
        className={`group relative flex cursor-default flex-col overflow-hidden rounded-card-md border border-navy/10 bg-white p-5 opacity-[0.72] shadow-sm ${className}`}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-card-md transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${sizing} ${surface} ${
        featured ? "hover:shadow-[0_28px_60px_-14px_rgba(96,73,141,0.45)]" : "hover:border-accent/25 hover:shadow-lg"
      } ${className}`}
    >
      {content}
    </Link>
  );
}
