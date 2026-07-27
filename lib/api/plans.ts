import { API_URL } from "./config";

export interface BackendPlan {
  id: string;
  code: string;
  name: string;
  priceClp: number;
  billingPeriod: string;
}

/**
 * Planes reales desde el backend (tabla `plans`, editable por la fundacion
 * sin tocar codigo -- ver backend Plan.java). Se usa para sobreescribir
 * precio/nombre en lib/data/plans.ts (ver withLivePricing), que sigue
 * siendo la fuente del copy de marketing (features, descripcion, cta).
 *
 * revalidate: 300 -- los precios no cambian a cada rato, pero tampoco
 * queremos servir un valor cacheado indefinidamente si la fundacion lo
 * edita desde el panel de Supabase.
 *
 * Timeout corto (3s) a proposito: esto se llama durante el build/SSR de la
 * home y de /pricing (ver Planes.tsx), y ambos ya tienen fallback al valor
 * estatico si esto falla -- sin un timeout explicito, un backend
 * inalcanzable podria colgar cada build en vez de fallar rapido y usar el
 * fallback.
 */
export async function fetchBackendPlans(): Promise<BackendPlan[]> {
  const response = await fetch(`${API_URL}/api/plans`, {
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(3000),
  });

  if (!response.ok) {
    throw new Error(`No se pudieron obtener los planes del backend: ${response.status}`);
  }

  return response.json();
}
