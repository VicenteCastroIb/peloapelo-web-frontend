import type { HeadingBlockData } from "@/lib/types/blogBlocks";
import { resolveIcon } from "./iconMap";

export default function HeadingBlock({ data }: { data: HeadingBlockData }) {
  const Icon = resolveIcon(data.icon);

  if (Icon) {
    return (
      <h2 className="flex items-center gap-2.5 text-h2-md text-navy">
        <Icon size={30} className="shrink-0 text-accent" />
        {data.text}
      </h2>
    );
  }

  return <h2 className="text-h2-md text-navy">{data.text}</h2>;
}
