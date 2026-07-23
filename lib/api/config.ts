// URL base del backend (Spring Boot). En desarrollo apunta a localhost:8080;
// en producción se define via variable de entorno NEXT_PUBLIC_API_URL
// (ver .env.local.example).
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
