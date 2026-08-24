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
  icon: LucideIcon;
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
}

// Acceso rapido como tarjeta del sistema -- compartida entre /dashboard
// ("Explora") y /profile ("Accesos rapidos"), ver docs/design de ambos
// rediseños: mismo componente, mismo nombre, en los dos handoffs.
export default function DashboardCard({
  icon: Icon,
  badge,
  badgeTone = "neutral",
  title,
  description,
  href,
  progress,
  progressLabel,
  locked = false,
}: DashboardCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-icon transition-colors duration-300 ease-out motion-reduce:transition-none ${
            locked
              ? "bg-navy/5 text-navy/35"
              : "bg-accent/10 text-accent group-hover:bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] group-hover:text-white"
          }`}
        >
          {locked ? <Lock size={20} strokeWidth={1.9} /> : <Icon size={20} strokeWidth={1.9} />}
        </span>
        <span className={`rounded-pill px-2.5 py-1 text-p-caption font-semibold ${BADGE_TONES[badgeTone]}`}>
          {badge}
        </span>
      </div>
      <div className="mt-4">
        <p className={`text-base font-semibold ${locked ? "text-navy/60" : "text-navy"}`}>{title}</p>
        <p className={`mt-1 text-p-small ${locked ? "text-navy/45" : "text-navy/60"}`}>{description}</p>
      </div>
      {progress !== undefined && (
        <div className="mt-auto pt-4">
          <ProgressBar percent={progress} />
          {progressLabel && <p className="mt-1.5 text-p-caption text-navy/50">{progressLabel}</p>}
        </div>
      )}
      {!locked && (
        <ArrowRight
          size={16}
          aria-hidden
          className="absolute bottom-5 right-5 -translate-x-1.5 text-accent opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
        />
      )}
    </>
  );

  if (locked) {
    return (
      <div
        aria-disabled="true"
        className="group relative flex min-h-[208px] cursor-default flex-col rounded-card-md border border-navy/10 bg-white p-5 opacity-[0.72] shadow-sm"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group relative flex min-h-[208px] flex-col rounded-card-md border border-navy/10 bg-white p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-accent/25 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {content}
    </Link>
  );
}
