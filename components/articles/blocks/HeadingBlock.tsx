import type { HeadingBlockData } from "@/lib/types/blogBlocks";
import { resolveIcon } from "./iconMap";
import { TEXT_COLOR_CLASS, TEXT_SIZE_CLASS } from "@/lib/blog/textStyleTokens";

export default function HeadingBlock({ data }: { data: HeadingBlockData }) {
  const Icon = resolveIcon(data.icon);
  const sizeClass = data.fontSize ? TEXT_SIZE_CLASS[data.fontSize] : "text-h2-md";
  const colorClass = data.color ? TEXT_COLOR_CLASS[data.color] : "text-navy";

  if (Icon) {
    return (
      <h2 className={`flex items-center gap-2.5 ${sizeClass} ${colorClass}`}>
        <Icon size={30} className="shrink-0 text-accent" />
        {data.text}
      </h2>
    );
  }

  return <h2 className={`${sizeClass} ${colorClass}`}>{data.text}</h2>;
}
