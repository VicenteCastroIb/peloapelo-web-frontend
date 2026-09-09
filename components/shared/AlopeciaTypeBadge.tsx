import Badge from "@/components/ui/Badge";
import { alopeciaTypeByCode, type AlopeciaTypeCode } from "@/lib/data/alopeciaTypes";

// Badge de tipo de alopecia, compartido entre /profile (la propia usuaria) y
// /admin/usuarias (el panel de Jessica) para que usen exactamente el mismo
// label y tono. El caso "no completó el quiz" lo decide quien llama (en
// /profile es un link al quiz; en la lista de admin, "Quiz sin completar").
export default function AlopeciaTypeBadge({ code }: { code: AlopeciaTypeCode }) {
  return <Badge tone="neutral">{alopeciaTypeByCode(code).name}</Badge>;
}
