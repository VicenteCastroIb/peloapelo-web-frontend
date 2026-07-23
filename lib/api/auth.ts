import { apiFetch } from "./client";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  expiresInSeconds: number;
  user: AuthUser;
}

export function register(email: string, password: string, fullName: string) {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: { email, password, fullName },
  });
}

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function fetchMe(token: string) {
  return apiFetch<AuthUser>("/api/users/me", { token });
}
