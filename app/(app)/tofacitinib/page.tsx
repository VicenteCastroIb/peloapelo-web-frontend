import { Lock } from "lucide-react";
import Button from "@/components/ui/Button";

export default function TofacitinibPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 text-navy/40">
        <Lock size={24} />
      </span>
      <h1 className="mt-4 text-xl font-semibold">Guía Tofacitinib</h1>
      <p className="mt-2 text-navy/60">Esta sección estará disponible próximamente.</p>
      <Button href="/dashboard" variant="gradient" className="mt-6">
        Volver al Dashboard
      </Button>
    </div>
  );
}
