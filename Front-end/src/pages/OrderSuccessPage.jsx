import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { ordersApi } from "../api/ordersApi";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";
import { formatCurrency, formatDate } from "../utils/formatters";
import { extractErrorMessage } from "../utils/errors";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const toast = useToast();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order) {
      setLoading(true);
      ordersApi
        .getById(id)
        .then(setOrder)
        .catch((err) => toast.error(extractErrorMessage(err)))
        .finally(() => setLoading(false));
    }
  }, [id, order, toast]);

  if (loading) return <Loader label="Cargando pedido..." />;
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="card p-8">
        <div className="flex flex-col items-center text-center gap-3 mb-8">
          <div className="bg-emerald-50 text-emerald-600 rounded-full p-4">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Pedido confirmado!</h1>
          <p className="text-slate-600">
            Gracias por tu compra. Abajo estan los detalles de tu pedido.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card p-4 bg-brand-50 border-brand-100">
            <p className="text-xs uppercase tracking-wide text-brand-700 font-semibold">
              ID de la orden
            </p>
            <p className="text-2xl font-extrabold text-brand-900"># {order.id}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
              Fecha
            </p>
            <p className="text-sm font-medium text-slate-900 mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
              Estado
            </p>
            <p className="text-sm font-medium text-emerald-700 mt-1">{order.estado}</p>
          </div>
        </div>

        <h2 className="font-semibold mb-2 flex items-center gap-2">
          <Package size={18} /> Articulos
        </h2>
        <ul className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
          {order.items.map((it) => (
            <li key={it.id} className="p-3 flex items-center gap-3">
              {it.productImage && (
                <img
                  src={it.productImage}
                  alt={it.productName}
                  className="w-14 h-14 object-cover rounded-md bg-slate-100"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">
                  {it.productName}
                </p>
                <p className="text-xs text-slate-500">
                  {it.quantity} x {formatCurrency(it.price)}
                </p>
              </div>
              <p className="font-semibold">{formatCurrency(it.subtotal)}</p>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center text-lg font-bold border-t border-slate-200 mt-4 pt-4">
          <span>Total pagado</span>
          <span>{formatCurrency(order.total)}</span>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <ShoppingBag size={16} />
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
