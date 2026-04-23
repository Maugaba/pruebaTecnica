import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let idSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback(
    (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    []
  );

  const push = useCallback(
    (message, type = "info", duration = 3500) => {
      const id = ++idSeq;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => remove(id), duration);
      }
      return id;
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      info: (msg, d) => push(msg, "info", d),
      success: (msg, d) => push(msg, "success", d),
      error: (msg, d) => push(msg, "error", d ?? 5000),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed z-50 top-4 right-4 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const styles =
    toast.type === "success"
      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
      : toast.type === "error"
      ? "bg-rose-50 text-rose-900 border-rose-200"
      : "bg-sky-50 text-sky-900 border-sky-200";

  const Icon =
    toast.type === "success" ? CheckCircle2 : toast.type === "error" ? AlertTriangle : Info;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border shadow-sm px-3 py-2 ${styles} animate-[fadeIn_.2s_ease-out]`}
      role="status"
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1 text-sm">{toast.message}</div>
      <button
        onClick={onClose}
        className="text-current/70 hover:opacity-70"
        aria-label="Cerrar notificacion"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
