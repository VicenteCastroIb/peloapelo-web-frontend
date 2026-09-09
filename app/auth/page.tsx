import { Suspense } from "react";
import AuthForm from "./AuthForm";

// El formulario vive en un client component aparte porque lee ?fromQuiz=1 con
// useSearchParams (viene de la pantalla de resultado del quiz) -- y eso exige
// un limite de Suspense, mismo patron que app/auth/restablecer-password.
export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm />
    </Suspense>
  );
}
