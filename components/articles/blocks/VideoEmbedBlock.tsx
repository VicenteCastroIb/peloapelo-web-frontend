import type { VideoEmbedBlockData } from "@/lib/types/blogBlocks";
import { youtubeEmbedUrl } from "@/lib/blog/youtube";

// Video embebido de YouTube (fase 3, ago 2026) -- decision de
// infraestructura confirmada con Vicente: en vez de subir/comprimir/hospedar
// video propio, el bloque guarda solo un id de YouTube (ver
// lib/blog/youtube.ts) y lo embebe via iframe. youtube-nocookie.com = modo
// "privacy-enhanced": no planta cookies de tracking hasta que se reproduce
// -- relevante en el sitio de una fundacion de salud.
export default function VideoEmbedBlock({ data }: { data: VideoEmbedBlockData }) {
  if (!data.youtubeId) return null;

  return (
    <figure>
      <div className="relative aspect-video w-full overflow-hidden rounded-card-lg bg-navy/10">
        <iframe
          src={youtubeEmbedUrl(data.youtubeId)}
          title={data.caption ?? "Video"}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {data.caption && <figcaption className="mt-2 text-center text-p-caption text-navy/50">{data.caption}</figcaption>}
    </figure>
  );
}
