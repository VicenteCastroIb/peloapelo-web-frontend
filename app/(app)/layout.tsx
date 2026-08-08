"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { isImmersiveLessonPath } from "@/lib/routes";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // La leccion (ver lib/routes.ts) ya no lleva Header global ni este
  // DashboardSidebar -- LessonImmersiveHeader los reemplaza a ambos con una
  // barra compacta propia (ver app/(app)/courses/[slug]/[lessonSlug]/layout.tsx).
  const immersive = isImmersiveLessonPath(pathname);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className={`flex items-center justify-center ${immersive ? "min-h-screen" : "min-h-[calc(100vh-72px)]"}`}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (immersive) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)]">
      <DashboardSidebar />
      <div className="flex-1 overflow-y-auto px-8 py-10 lg:px-12">{children}</div>
    </div>
  );
}
