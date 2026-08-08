import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /pricing se renombro a /planes (ver tarea de reestructuracion, ago
  // 2026). Redirect permanente para no romper links externos/guardados
  // hacia la URL vieja -- corre antes de que Next intente matchear rutas de
  // archivos, asi que funciona aunque ya no exista app/pricing/page.tsx.
  async redirects() {
    return [
      {
        source: "/pricing",
        destination: "/planes",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
