"use client";

import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

// Grilla de fotos de seguimiento -- difuminadas hasta que se pinchan.
// Extraida de app/(app)/progress/page.tsx (LineaDeTiempo) para reusarse en el
// panel de Jessica (/admin/usuarias/[id]) sin duplicar el markup del tile.
// `trailing` es el slot para la celda de "sumar foto" en el autoservicio; en
// modo solo-lectura (admin) no se pasa.

interface PhotoLike {
  id: string;
  date: string; // ISO yyyy-MM-dd
}

function shortDateLabel(iso: string): string {
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "short" }).format(
    new Date(iso + "T00:00:00"),
  );
}

export default function ProgressPhotoGrid<T extends PhotoLike>({
  photos,
  srcFor,
  trailing,
}: {
  photos: T[];
  srcFor: (photo: T) => string;
  trailing?: ReactNode;
}) {
  const [revealed, setRevealed] = useState<string | null>(null);

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))" }}
    >
      {photos.map((photo) => {
        const open = revealed === photo.id;
        const fecha = shortDateLabel(photo.date);
        return (
          <div
            key={photo.id}
            className="relative aspect-[3/4] overflow-hidden rounded-card-md border border-navy/10 bg-navy/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- imagen privada servida via cookie, no puede pasar por el optimizador de Next */}
            <img src={srcFor(photo)} alt="" className="h-full w-full object-cover" />
            <div
              className="absolute inset-0 transition-[background-color] duration-200 motion-reduce:transition-none"
              style={{
                backdropFilter: open ? "none" : "blur(10px)",
                background: open ? "transparent" : "rgba(248,246,242,0.25)",
              }}
            />
            <button
              type="button"
              onClick={() => setRevealed(open ? null : photo.id)}
              aria-label={`${open ? "Ocultar" : "Ver"} foto del ${fecha}`}
              className="group absolute inset-0 flex items-center justify-center border-none bg-transparent text-navy/70"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-pill bg-white/90 shadow-sm transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
                {open ? <EyeOff size={17} /> : <Eye size={17} />}
              </span>
            </button>
            <span className="absolute bottom-2.5 left-2.5 rounded-pill bg-white/92 px-2.5 py-[3px] text-p-caption font-semibold text-navy">
              {fecha}
            </span>
          </div>
        );
      })}
      {trailing}
    </div>
  );
}
