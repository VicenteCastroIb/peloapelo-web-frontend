"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles, Heart } from "lucide-react";
import { fetchTodayMessage, type DailyMessage } from "@/lib/api/dailyMessages";
import Skeleton from "@/components/shared/Skeleton";

const FALLBACK: DailyMessage = {
  id: null,
  phrase: "No estás sola en esto.",
  body: "Mente, cuerpo y emoción, en un mismo lugar. No reemplaza a tus doctores: te ayuda a llegar a esa consulta con todo más claro.",
};

/**
 * "Mensaje del dia" -- extraido de /dashboard (ago 2026, a pedido: "el
 * mensaje del dia debe poder verse tambien en una seccion de /progress")
 * para poder mostrarlo en mas de una pantalla del panel sin duplicar el
 * fetch + markup a mano. Se busca su propio dato (misma llamada publica que
 * usaba /dashboard) en vez de recibirlo por props, para poder soltarlo en
 * cualquier pagina sin acoplarla al estado de esa otra pantalla.
 */
export default function DailyMessageCard({ className = "" }: { className?: string }) {
  const [dailyMessage, setDailyMessage] = useState<DailyMessage | null>(null);

  useEffect(() => {
    fetchTodayMessage()
      .then(setDailyMessage)
      .catch(() => setDailyMessage(FALLBACK));
  }, []);

  if (dailyMessage === null) {
    return <Skeleton className={`h-[290px] w-full rounded-card-lg ${className}`} />;
  }

  return (
    <section
      className={`relative flex min-h-[290px] flex-col justify-center overflow-hidden rounded-card-lg bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] px-10 py-9 text-white shadow-[0_28px_60px_-14px_rgba(96,73,141,0.4),0_8px_20px_-6px_rgba(43,61,79,0.22)] ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 6% 0%, rgba(255,255,255,.32), transparent 58%)" }}
      />
      <Image
        aria-hidden
        src="/images/adornos/adorno-rama.png"
        alt=""
        width={290}
        height={290}
        className="pointer-events-none absolute -bottom-11 -right-[34px] w-[290px] opacity-30 mix-blend-soft-light"
      />
      <div className="relative">
        <p className="flex items-center gap-2 text-h4-label text-cream/80">
          <Sparkles size={14} /> Mensaje del día
        </p>
        <h2 className="mt-4 max-w-[560px] text-[36px] font-black italic leading-[1.08] tracking-tight text-pretty drop-shadow-sm">
          {dailyMessage.phrase}
        </h2>
        <p className="mt-3.5 max-w-[470px] text-p-body leading-relaxed text-white/92 text-pretty">
          {dailyMessage.body}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-pill border border-cream/40 px-3.5 py-2.5 text-p-caption text-cream/80">
            <Heart size={13} /> Fundación Pelo a Pelo
          </span>
        </div>
      </div>
    </section>
  );
}
