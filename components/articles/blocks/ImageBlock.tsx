import Image from "next/image";
import type { ImageBlockData } from "@/lib/types/blogBlocks";

// Imagen subida de verdad a Supabase Storage (fase 3, ago 2026, ver
// components/admin/blog/ImageUploadField.tsx + backend AdminMediaController)
// -- a diferencia de coverImageUrl (portada, decorativa), `alt` es
// obligatorio: es contenido dentro del cuerpo del articulo. aspect-[16/9] +
// object-cover, mismo tratamiento que la portada (ArticleHeaderPreview) y
// las tarjetas del listado -- recorta imagenes que no sean 16:9, a proposito
// para mantener consistencia visual en vez de layouts de alto variable.
export default function ImageBlock({ data }: { data: ImageBlockData }) {
  if (!data.url) return null;

  return (
    <figure>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card-lg bg-navy/10">
        <Image
          src={data.url}
          alt={data.alt}
          fill
          unoptimized
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
      </div>
      {data.caption && <figcaption className="mt-2 text-center text-p-caption text-navy/75">{data.caption}</figcaption>}
    </figure>
  );
}
