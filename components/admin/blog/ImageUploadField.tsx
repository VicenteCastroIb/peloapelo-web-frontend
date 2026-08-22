"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import { uploadMedia } from "@/lib/api/adminMedia";
import { ApiError } from "@/lib/api/client";
import type { ImageBlockData } from "@/lib/types/blogBlocks";
import { TextField } from "./blockFieldEditors";

// Debe coincidir con los limites del backend (ver
// backend/src/main/resources/application.yml multipart.max-file-size y
// AdminMediaController.ALLOWED_IMAGE_TYPES) -- se repite aca solo para dar
// feedback instantaneo antes de gastar una subida entera, el backend sigue
// siendo quien realmente lo hace cumplir.
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Unico campo de este archivo con efecto secundario real (sube un archivo)
// -- por eso vive aparte de blockFieldEditors.tsx, que son todos campos
// controlados "tontos" sin llamadas a la API.
export default function ImageUploadField({
  data,
  token,
  onChange,
}: {
  data: ImageBlockData;
  token: string | null | undefined;
  onChange: (data: ImageBlockData) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Formato no permitido -- usa JPEG, PNG, WEBP o GIF.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("El archivo pesa más de 10MB.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadMedia(token, file);
      onChange({ ...data, url });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-p-caption font-semibold text-navy/60">Imagen</p>
        {data.url ? (
          <div className="relative mt-1 aspect-[16/9] w-full overflow-hidden rounded-card-md border border-navy/10 bg-navy/5">
            <Image src={data.url} alt={data.alt} fill unoptimized sizes="400px" className="object-cover" />
          </div>
        ) : (
          <div className="mt-1 flex aspect-[16/9] w-full items-center justify-center rounded-card-md border border-dashed border-navy/20 bg-cream text-p-caption text-navy/75">
            Sin imagen todavía
          </div>
        )}

        <label className="mt-2 flex cursor-pointer items-center justify-center gap-1.5 rounded-card-md border border-navy/15 bg-cream px-3 py-2 text-p-caption font-semibold text-navy/70 hover:border-accent hover:text-accent">
          <UploadCloud size={14} />
          {uploading ? "Subiendo…" : data.url ? "Reemplazar imagen" : "Subir imagen"}
          <input
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              // Reset del input para poder re-elegir el mismo archivo (ej.
              // reintentar despues de un error) -- sin esto, el navegador no
              // dispara onChange una segunda vez con el mismo File.
              e.target.value = "";
              handleFile(file);
            }}
          />
        </label>
        {error && <p className="mt-1 text-p-caption text-coral">{error}</p>}
      </div>

      <TextField label="Texto alternativo (accesibilidad/SEO)" value={data.alt} onChange={(alt) => onChange({ ...data, alt })} />
      <TextField
        label="Leyenda (opcional, aparece debajo de la imagen)"
        value={data.caption ?? ""}
        onChange={(v) => onChange({ ...data, caption: v || null })}
      />
    </div>
  );
}
