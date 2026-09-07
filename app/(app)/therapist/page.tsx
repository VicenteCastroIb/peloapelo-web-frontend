"use client";

import Image from "next/image";
import { Heart, CalendarCheck2, CalendarClock, Mail, ShieldCheck, Clock3, Video } from "lucide-react";
import Button from "@/components/ui/Button";
import { gmailComposeUrl } from "@/lib/gmail";

// Agenda REAL de Jessica (Google Calendar Appointment Schedules) -- link
// entregado directo por la fundacion. Reemplaza el formulario propio que
// esta pantalla tenia antes (fecha + horario + nota): ese formulario nunca
// tuvo un endpoint de agendamiento detras (ver historial de este archivo y
// backend/README.md "Pendiente") y al enviarlo solo mostraba un mensaje de
// exito falso, sin agendar nada de verdad. Google Calendar ya resuelve
// disponibilidad real, confirmacion y recordatorios -- no tiene sentido
// reconstruir eso a mano para el lanzamiento en Hostinger.
const GOOGLE_CALENDAR_BOOKING_URL =
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3MqsICDUyHMi1xJXo7E-SO5_gopdasFBA-XH0iFggXENno_nTl7MvQtOIo-4eK9xXXR3bU7aTM";

const BENEFICIOS = [
  { icon: Clock3, text: "Sesiones de 45 minutos, en el horario que más te acomode" },
  { icon: Video, text: "100% online, desde donde estés" },
  { icon: ShieldCheck, text: "Confidencial: nadie más que tú y Jessica saben de qué hablan" },
];

export default function TherapistPage() {
  return (
    <div className="mx-auto grid max-w-3xl gap-8">
      <header className="text-center">
        <p className="flex items-center justify-center gap-2 text-h4-label text-navy/75">
          <Heart size={14} /> Acompañamiento profesional
        </p>
        <h1 className="mt-2 text-h3-lg text-navy">Agenda con tu terapeuta 🧠</h1>
        <p className="mx-auto mt-2 max-w-[46ch] text-p-body text-navy/70 text-pretty">
          Sabemos que no todo es digital. Por eso tenemos profesionales de la salud mental para
          apoyarte en todo momento. Agenda una sesión y te acompañamos.
        </p>
      </header>

      <section className="overflow-hidden rounded-card-lg border border-navy/10 bg-white shadow-[0_20px_45px_-18px_rgba(43,61,79,0.22)]">
        {/* Cabecera con el degradado de marca (mismo tratamiento que "Mensaje
            del dia" en /dashboard). Si generas un fondo propio para esta
            tarjeta (ver el prompt de imagen sugerido en el chat), agrega
            backgroundImage: "url(/images/backgrounds/fondo-terapeuta.jpg)"
            aca y deja este mismo degradado ENCIMA con opacidad ~0.85 para
            que el texto blanco siga siendo legible. */}
        <div className="relative flex flex-wrap items-center gap-5 bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] px-8 py-7">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "radial-gradient(120% 140% at 100% 0%, rgba(255,255,255,.3), transparent 60%)" }}
          />
          <Image
            aria-hidden
            src="/images/adornos/adorno-rama.png"
            alt=""
            width={220}
            height={220}
            className="pointer-events-none absolute -bottom-12 -right-6 w-[220px] opacity-25 mix-blend-soft-light"
          />
          <div className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-pill border-[3px] border-white/70 shadow-lg">
            <Image
              src="/images/founder/jessica-lagno.png"
              alt="Jessica Lagno"
              width={84}
              height={84}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative min-w-[200px]">
            <p className="text-h3-md text-white drop-shadow-sm">Jessica Lagno</p>
            <p className="text-p-small text-white/90">Profesional de salud mental · Fundación Pelo a Pelo</p>
            <p className="mt-1 flex items-center gap-1.5 text-p-small text-white/80">
              <Mail size={13} /> jessica.lagno@peloapelo.cl
            </p>
          </div>
        </div>

        <div className="grid gap-7 p-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <h2 className="text-h3-sm text-navy">Reserva tu hora</h2>
            <p className="mt-1.5 max-w-[42ch] text-p-small leading-relaxed text-navy/60">
              Elige el día y horario que más te acomode, directo en la agenda real de Jessica. Vas
              a recibir la confirmación por correo al instante.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              {BENEFICIOS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5 text-p-small text-navy/70">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-accent/10 text-accent">
                    <Icon size={13} />
                  </span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:w-[230px]">
            <Button
              variant="gradient"
              size="lg"
              href={GOOGLE_CALENDAR_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full shadow-[0_14px_30px_-10px_rgba(96,73,141,0.55)]"
            >
              <CalendarCheck2 size={16} /> Agendar sesión
            </Button>
            <a
              href={gmailComposeUrl("jessica.lagno@peloapelo.cl")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-pill border-2 border-navy/15 px-4 text-a-inline font-semibold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent active:translate-y-0"
            >
              <Mail size={14} /> Escribir directo
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-[58ch] items-start gap-2.5 rounded-card-md bg-navy/5 px-5 py-4 text-left">
        <CalendarClock size={16} className="mt-0.5 shrink-0 text-accent" />
        <p className="text-p-caption leading-relaxed text-navy/70">
          Este servicio es un complemento a tu proceso. Las sesiones son orientativas y no
          reemplazan un tratamiento clínico formal. Si estás en crisis, acude a urgencias o llama a
          una línea de ayuda.
        </p>
      </div>
    </div>
  );
}
