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
  options: { method?: string; body?: unknown; token?: string | null } = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
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
