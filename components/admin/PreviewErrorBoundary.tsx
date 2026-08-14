"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

// Compartido por las vistas previas en vivo del blog (LiveArticlePreview) y
// de cursos (LiveCoursePreview) -- ambas re-renderizan en cada tecla con
// datos a medio escribir (una URL de imagen incompleta, un numero vacio,
// etc.). La mayoria de esos casos ya se manejan con guardas puntuales, pero
// un error boundary es la ultima red: si algun combo raro de datos igual
// rompe el render, que se apague solo la vista previa (con un aviso) y no
// toda la pagina de edicion -- Jessica no deberia perder el formulario que
// esta llenando por un problema de la previsualizacion.
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class PreviewErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: Props) {
    // Si el contenido que causo el error cambia (la persona sigue
    // escribiendo), reintentamos mostrar la preview en vez de quedar
    // apagada para siempre.
    if (this.state.hasError && prevProps.children !== this.props.children) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center gap-2 rounded-card-lg border border-coral/30 bg-coral-soft p-6 text-p-small text-coral">
          <AlertTriangle size={16} className="shrink-0" />
          No se pudo mostrar la vista previa con estos datos. Sigue editando o revisa el bloque
          que acabas de tocar.
        </div>
      );
    }
    return this.props.children;
  }
}
