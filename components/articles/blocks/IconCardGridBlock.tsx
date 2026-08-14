import Image from "next/image";
import type { IconCardGridBlockData, IconCardItem, RichParagraph } from "@/lib/types/blogBlocks";
import { RichText } from "@/lib/blog/richText";
import { resolveIcon } from "./iconMap";
import ConfidenceDots from "./ConfidenceDots";

// Bloque generico de "tarjetas con icono": cubre las 5 variantes de card que
// existian a mano en los 3 articulos originales (TOOLS, HAIR_TYPES,
// TREATMENTS, BODY_HABITS, MIND_HABITS), como combinaciones de las mismas
// props en vez de 5 componentes distintos. Dos layouts:
//  - "horizontal-row": icono a la izquierda (fondo gris plano, sin franja),
//    texto a la derecha -- una sola columna (ex TOOLS).
//  - "vertical-card": franja de color detras de un circulo superpuesto
//    arriba de la card, texto abajo -- 1 o 2 columnas (ex HAIR_TYPES /
//    TREATMENTS / BODY_HABITS / MIND_HABITS).
export default function IconCardGridBlock({ data }: { data: IconCardGridBlockData }) {
  const wrapperClass =
    data.layout === "horizontal-row"
      ? "flex flex-col gap-5"
      : data.columns === 2
        ? "grid gap-5 sm:grid-cols-2"
        : "flex flex-col gap-4 sm:flex-row";

  const isOdd = data.items.length % 2 === 1;

  return (
    <div className={wrapperClass}>
      {data.items.map((item, index) => {
        const centerLastOddClass =
          data.centerLastOdd && data.columns === 2 && isOdd && index === data.items.length - 1
            ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-10px)]"
            : "";

        return data.layout === "horizontal-row" ? (
          <HorizontalRowItem key={item.title} item={item} index={index} numberStyle={data.numberStyle} circleSize={data.circleSize} />
        ) : (
          <VerticalCardItem
            key={item.title}
            item={item}
            index={index}
            data={data}
            className={centerLastOddClass}
          />
        );
      })}
    </div>
  );
}

function ItemParagraphs({ paragraphs }: { paragraphs: RichParagraph[] }) {
  return (
    <>
      {paragraphs.map((p, i) => {
        const tone = p.tone ?? "primary";
        const sizeClass = tone === "secondary" ? "text-p-small text-navy/55" : "text-p-body text-navy/75";
        return (
          <p key={i} className={`${i > 0 ? "mt-2 " : ""}${sizeClass}`}>
            <RichText text={p.text} />
          </p>
        );
      })}
    </>
  );
}

function HorizontalRowItem({
  item,
  index,
  numberStyle,
  circleSize,
}: {
  item: IconCardItem;
  index: number;
  numberStyle: IconCardGridBlockData["numberStyle"];
  circleSize: number;
}) {
  const Icon = resolveIcon(item.icon);

  return (
    <div className="flex flex-col gap-4 rounded-card-lg border border-navy/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
      <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2">
        <span
          className="relative shrink-0 overflow-hidden rounded-full bg-navy/5 shadow-sm"
          style={{ height: circleSize, width: circleSize }}
        >
          {item.image ? (
            // unoptimized: URL externa pegada a mano en /admin/blog, ver nota en ArticleCard.tsx
            <Image src={item.image} alt="" aria-hidden fill unoptimized sizes={`${circleSize}px`} className="object-cover" />
          ) : (
            Icon && (
              <span className="flex h-full w-full items-center justify-center" style={{ color: item.tint }}>
                <Icon size={Math.round(circleSize * 0.28)} />
              </span>
            )
          )}
        </span>
        {numberStyle === "mobile-index" && (
          <span className="text-p-caption font-bold uppercase tracking-wide text-navy/40 sm:hidden">
            {index + 1}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-h3-md text-navy">{item.title}</h3>
        <ItemParagraphs paragraphs={item.paragraphs} />
      </div>
    </div>
  );
}

function VerticalCardItem({
  item,
  index,
  data,
  className,
}: {
  item: IconCardItem;
  index: number;
  data: IconCardGridBlockData;
  className: string;
}) {
  const Icon = resolveIcon(item.icon);
  const circleSize = data.circleSize;
  const bannerHeight = data.bannerHeight ?? Math.round(circleSize * 0.6);
  const overlap = Math.round(circleSize / 2);

  return (
    <div className={`relative overflow-hidden rounded-card-lg border border-navy/10 bg-white shadow-sm ${className}`}>
      {data.bannerStyle === "half" && (
        <div
          className="w-full"
          style={{ height: bannerHeight, backgroundColor: `color-mix(in srgb, ${item.tint} 16%, white)` }}
        />
      )}
      <div className={`px-6 pb-6 ${data.centerText ? "text-center sm:px-7 sm:pb-7" : ""}`}>
        <span
          className={`relative inline-flex shrink-0 ${data.centerText ? "mx-auto" : ""}`}
          style={{ height: circleSize, width: circleSize, marginTop: -overlap }}
        >
          <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-sm">
            {item.image ? (
              <Image
                src={item.image}
                alt=""
                aria-hidden
                fill
                unoptimized
                sizes={`${circleSize}px`}
                className="object-cover"
                style={item.imageScale && item.imageScale !== 1 ? { transform: `scale(${item.imageScale})` } : undefined}
              />
            ) : (
              Icon && <Icon size={Math.round(circleSize * 0.3)} style={{ color: item.tint }} />
            )}
          </span>
          {data.numberStyle === "badge" && (
            <span
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white"
              style={{ backgroundColor: item.tint }}
            >
              {index + 1}
            </span>
          )}
        </span>

        <h3 className="mt-3 text-h3-md text-navy">{item.title}</h3>

        {data.showTag && item.tag && (
          <p className="mt-1 text-p-caption font-bold uppercase tracking-wide" style={{ color: item.tint }}>
            {item.tag}
          </p>
        )}

        {data.showConfidenceDots && item.evidenceLabel && (
          <p
            className="mt-1 flex items-center gap-1.5 text-p-caption font-bold uppercase tracking-wide"
            style={{ color: item.tint }}
          >
            {item.confidence != null && <ConfidenceDots level={item.confidence} />}
            {item.evidenceLabel}
          </p>
        )}

        <div className={data.centerText ? "mt-3 text-left" : "mt-2"}>
          <ItemParagraphs paragraphs={item.paragraphs} />
        </div>
      </div>
    </div>
  );
}
