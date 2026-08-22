"use client";

import { useState } from "react";
import { Image as ImageIcon, MonitorPlay, Smartphone, Video, X } from "lucide-react";
import type { VideoOrientation } from "@/lib/api/courses";
import Collapse from "@/components/shared/Collapse";

type MediaType = "none" | "video" | "image";

const inputClass =
  "mt-1 w-full rounded-card-md border border-navy/15 bg-cream px-3 py-2 text-p-small text-navy outline-none focus:border-accent";

function pillClass(active: boolean) {
  return `flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-p-caption font-semibold transition-colors ${
    active ? "bg-navy text-cream" : "bg-navy/5 text-navy/60 hover:bg-navy/10"
  }`;
}

// Selector "Sin media / Video / Imagen" para una leccion (ago 2026, a
// pedido: agregar video o imagen a una leccion tiene que sentirse opcional,
// no como un campo mas que hay que llenar). Video e imagen son mutuamente
// excluyentes en la UI -- cambiar de tipo limpia el otro campo, asi el
// backend nunca recibe los dos cargados a la vez de forma ambigua (aunque
// tecnicamente lo permitiria, ver Lesson.java). La orientacion horizontal/
// vertical solo aparece cuando el tipo elegido es "video", porque solo ahi
// tiene efecto (determina el aspect-ratio del reproductor, ver la pagina
// publica de la leccion).
export default function LessonMediaPicker({
  videoUrl,
  videoOrientation,
  imageUrl,
  onChange,
}: {
  videoUrl: string;
  videoOrientation: VideoOrientation;
  imageUrl: string;
  onChange: (patch: { videoUrl?: string; videoOrientation?: VideoOrientation; imageUrl?: string }) => void;
}) {
  const [mediaType, setMediaType] = useState<MediaType>(() => {
    if (videoUrl) return "video";
    if (imageUrl) return "image";
    return "none";
  });

  function selectType(next: MediaType) {
    setMediaType(next);
    if (next === "none") {
      onChange({ videoUrl: "", imageUrl: "" });
    } else if (next === "video") {
      onChange({ imageUrl: "" });
    } else {
      onChange({ videoUrl: "" });
    }
  }

  return (
    <div className="rounded-card-md border border-navy/10 bg-cream/60 p-4">
      <p className="text-p-small font-semibold text-navy/70">Video o imagen (opcional)</p>
      <p className="mt-0.5 text-p-caption text-navy/75">
        Una lección puede no tener nada, un video o una imagen. Nunca son obligatorios.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={pillClass(mediaType === "none")} onClick={() => selectType("none")}>
          <X size={13} /> Sin video ni imagen
        </button>
        <button type="button" className={pillClass(mediaType === "video")} onClick={() => selectType("video")}>
          <Video size={13} /> Video
        </button>
        <button type="button" className={pillClass(mediaType === "image")} onClick={() => selectType("image")}>
          <ImageIcon size={13} /> Imagen
        </button>
      </div>

      <Collapse open={mediaType === "video"}>
        <div className="mt-3 space-y-3">
          <label className="block text-p-caption font-semibold text-navy/60">
            URL del video (Youtube/Vimeo)
            <input
              className={inputClass}
              placeholder="https://www.youtube.com/watch?v=…"
              value={videoUrl}
              onChange={(e) => onChange({ videoUrl: e.target.value })}
            />
          </label>
          <div>
            <p className="text-p-caption font-semibold text-navy/60">Orientación</p>
            <div className="mt-1.5 flex gap-2">
              <button
                type="button"
                className={pillClass(videoOrientation === "HORIZONTAL")}
                onClick={() => onChange({ videoOrientation: "HORIZONTAL" })}
              >
                <MonitorPlay size={13} /> Horizontal
              </button>
              <button
                type="button"
                className={pillClass(videoOrientation === "VERTICAL")}
                onClick={() => onChange({ videoOrientation: "VERTICAL" })}
              >
                <Smartphone size={13} /> Vertical
              </button>
            </div>
          </div>
        </div>
      </Collapse>

      <Collapse open={mediaType === "image"}>
        <label className="mt-3 block text-p-caption font-semibold text-navy/60">
          URL de la imagen
          <input
            className={inputClass}
            placeholder="https://…"
            value={imageUrl}
            onChange={(e) => onChange({ imageUrl: e.target.value })}
          />
        </label>
      </Collapse>
    </div>
  );
}
