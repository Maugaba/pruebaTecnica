import { Fragment, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Package, ShoppingBag } from "lucide-react";
import { ordersApi } from "../api/ordersApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { formatCurrency, formatDate } from "../utils/formatters";
import { extractErrorMessage } from "../utils/errors";

export default function OrdersPage() {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetcher = isAdmin ? ordersApi.listAll : ordersApi.list;
    fetcher()
      .then(setOrders)
      .catch((err) => toast.error(extractErrorMessage(err, "No se pudieron cargar los pedidos")))
      .finally(() => setLoading(false));
  }, [isAdmin, toast]);

  const toggle = (id) => setExpandedId((curr) => (curr === id ? null : id));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShoppingBag size={22} className="text-brand-700" />
          {isAdmin ? "Todos los pedidos" : "Mis pedidos"}
        </h1>
        <p className="text-slate-500 text-sm">
          {isAdmin
            ? "Listado completo de pedidos realizados por los clientes"
            : "Historial de pedidos realizados con tu cuenta"}
        </p>
      </div>

      {loading ? (
        <Loader label="Cargando pedidos..." />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Sin pedidos"
          description={
            isAdmin
              ? "Aun no hay pedidos registrados"
              : "No has realizado ningun pedido todavia"
          }
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Pedido</th>
                {isAdmin && <th className="text-left px-4 py-3 font-semibold">Usuario</th>}
                <th className="text-left px-4 py-3 font-semibold">Fecha</th>
                <th className="text-center px-4 py-3 font-semibold">Items</th>
                <th className="text-center px-4 py-3 font-semibold">Estado</th>
                <th className="text-right px-4 py-3 font-semibold">Total</th>
                <th className="text-right px-4 py-3 font-semibold">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const expanded = expandedId === o.id;
                const totalItems = o.items?.reduce((acc, it) => acc + it.quantity, 0) ?? 0;
                return (
                  <Fragment key={o.id}>
                    <tr className="border-t border-slate-100 hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-brand-700">#{o.id}</td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-slate-600">ID {o.userId}</td>
                      )}
                      <td className="px-4 py-3 text-slate-600">{formatDate(o.createdAt)}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{totalItems}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-medium">
                          {o.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatCurrency(o.total)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          className="btn-ghost p-2"
                          onClick={() => toggle(o.id)}
                          aria-label={expanded ? "Ocultar detalle" : "Ver detalle"}
                        >
                          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="bg-slate-50/60">
                        <td colSpan={isAdmin ? 7 : 6} className="px-4 py-4">
                          <div className="flex items-center gap-2 text-slate-700 font-medium mb-3">
                            <Package size={16} />
                            Articulos del pedido
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                              <thead className="text-slate-500">
                                <tr>
                                  <th className="text-left px-3 py-2 font-semibold">Producto</th>
                                  <th className="text-right px-3 py-2 font-semibold">Precio</th>
                                  <th className="text-center px-3 py-2 font-semibold">Cantidad</th>
                                  <th className="text-right px-3 py-2 font-semibold">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {o.items?.map((it) => (
                                  <tr key={it.id} className="border-t border-slate-200">
                                    <td className="px-3 py-2">
                                      <div className="flex items-center gap-2">
                                        {it.productImage && (
                                          <img
                                            src={it.productImage}
                                            alt={it.productName}
                                            className="w-8 h-8 object-cover rounded border border-slate-200"
                                            onError={(e) =>
                                              (e.currentTarget.style.visibility = "hidden")
                                            }
                                          />
                                        )}
                                        <span className="text-slate-800 font-medium">
                                          {it.productName}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                      {formatCurrency(it.price)}
                                    </td>
                                    <td className="px-3 py-2 text-center">{it.quantity}</td>
                                    <td className="px-3 py-2 text-right font-medium">
                                      {formatCurrency(it.subtotal)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
