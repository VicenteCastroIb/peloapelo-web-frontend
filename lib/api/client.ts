import { API_URL } from "./config";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Wrapper minimo sobre fetch para hablar con el backend.
 *
 * credentials: "include" siempre -- el backend setea el JWT como cookie
 * httpOnly (ver AuthContext.tsx: ya no se persiste el token en
 * localStorage, que era legible por cualquier script y por eso vulnerable
 * a robo via XSS). El header Authorization se sigue mandando tambien
 * cuando hay un token en memoria, como respaldo (ver JwtAuthenticationFilter
 * en el backend, que acepta cualquiera de los dos).
 */
export async function apiFetch<T>(
  path: string,
  options: {
    method?: string;
    /** FormData (ver adminMedia.ts) se manda tal cual, sin JSON.stringify ni Content-Type -- el navegador arma el boundary multipart solo; fijarlo a mano rompe el parseo en el backend. */
    body?: unknown;
    token?: string | null;
    cache?: RequestCache;
    /**
     * ISR (ago 2026, optimizacion de tiempos de carga): pasa
     * `next: { revalidate }` al fetch patcheado por Next.js en Server
     * Components. Antes el blog usaba cache: "no-store" en todas sus
     * lecturas publicas -- eso bloqueaba el SSR de /blog y /blog/[slug]
     * esperando una respuesta fresca del backend en CADA visita, sin
     * ningun cache. Con revalidate, Next sirve la version cacheada
     * (rapidisima) y solo vuelve a pedirle al backend despues de que pasen
     * `revalidate` segundos -- el contenido tarda como mucho eso en verse
     * fresco tras publicar, a cambio de que la enorme mayoria de las
     * visitas no dependan en absoluto de la latencia de red hacia el
     * backend/Supabase. No tiene efecto en fetches desde Client Components
     * (fetch del navegador ignora las extensiones de Next), asi que ahi
     * seguimos dependiendo de que el backend responda rapido.
     */
    revalidate?: number;
  } = {}
): Promise<T> {
  const { method = "GET", body, token, cache, revalidate } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const headers: Record<string, string> = isFormData ? {} : { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    // cache es opcional (ej. "no-store" cuando de verdad hace falta
    // maxima frescura). Sin cache ni revalidate, fetch usa su
    // comportamiento default. Los dos son mutuamente excluyentes en la API
    // de fetch de Next -- cache/revalidate no pueden ir juntos.
    ...(cache ? { cache } : revalidate !== undefined ? { next: { revalidate } } : {}),
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      // el backend no siempre devuelve JSON (ej. 401 generico de Spring Security)
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  // Algunos endpoints devuelven 201 sin body (ej. POST /api/leads). response.json()
  // lanza una excepcion con un body vacio, y eso se terminaba reportando en el
  // frontend como "no pudimos conectar con el servidor" -- un error de UX enganoso
  // para un caso que en realidad fue exitoso. Leemos como texto primero y solo
  // parseamos si hay contenido.
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
