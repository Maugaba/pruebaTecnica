import { Loader2 } from "lucide-react";

export default function Loader({ label = "Cargando...", className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 py-10 text-slate-500 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="animate-spin" size={28} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
