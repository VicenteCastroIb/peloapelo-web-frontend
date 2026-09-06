"use client";

import { Heart, Calendar as CalendarIcon, Mail } from "lucide-react";
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

export default function TherapistPage() {
  return (
    <div className="max-w-2xl">
      <p className="flex items-center gap-2 text-h4-label text-navy/75">
        <Heart size={14} /> Acompañamiento profesional
      </p>
      <h1 className="mt-2 text-h3-lg text-navy">Agenda con tu Terapeuta 🧠</h1>
      <p className="mt-2 text-p-body text-navy/70">
        Sabemos que no todo es digital. Por eso tenemos profesionales de la salud
        mental para apoyarte en todo momento. Agenda una sesión y te acompañamos.
      </p>

      <div className="mt-6 flex items-center gap-4 rounded-card-md bg-white p-5 shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Heart size={20} />
        </span>
        <div>
          <p className="text-h3-sm text-navy">Jessica Lagno</p>
          <p className="text-p-small text-navy/60">Profesional de salud mental · Pelo a Pelo</p>
          <p className="text-p-small text-navy/50">jessica.lagno@peloapelo.cl</p>
        </div>
      </div>

      <div className="mt-6 rounded-card-md bg-white p-6 text-center shadow-sm">
        <p className="text-h3-sm text-navy">Reserva tu hora</p>
        <p className="mx-auto mt-1.5 max-w-[42ch] text-p-small text-navy/60">
          Elige el día y horario que más te acomode, directo en la agenda real de
          Jessica. Vas a recibir la confirmación por correo al instante.
        </p>
        <Button
          variant="gradient"
          href={GOOGLE_CALENDAR_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 w-full"
        >
          Agendar sesión
        </Button>

        <div className="mt-5 border-t border-navy/10 pt-5 text-p-small text-navy/60">
          ¿Prefieres escribir directo?
          <br />
          <a
            href={gmailComposeUrl("jessica.lagno@peloapelo.cl")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 text-a-inline font-semibold text-accent"
          >
            <Mail size={14} /> Escribir directo
          </a>
        </div>
      </div>

      <p className="mt-6 flex items-start gap-2 text-p-caption text-navy/75">
        <CalendarIcon size={16} className="mt-0.5 shrink-0 text-accent" />
        Este servicio es un complemento a tu proceso. Las sesiones son orientativas
        y no reemplazan un tratamiento clínico formal. Si estás en crisis, acude a
        urgencias o llama a una línea de ayuda.
      </p>
    </div>
  );
}
