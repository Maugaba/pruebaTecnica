import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="card p-10 max-w-md text-center">
        <div className="mx-auto bg-amber-50 text-amber-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <AlertTriangle size={30} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Pagina no encontrada</h1>
        <p className="text-slate-600 mb-6">
          La ruta que buscas no existe o fue movida.
        </p>
        <Link to="/" className="btn-primary">
          <Home size={16} />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
