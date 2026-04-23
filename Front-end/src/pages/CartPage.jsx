import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Dumbbell } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { ordersApi } from "../api/ordersApi";
import EmptyState from "../components/EmptyState";
import { formatCurrency } from "../utils/formatters";
import { extractErrorMessage } from "../utils/errors";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setPlacing(true);
    try {
      const payload = {
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
        })),
      };
      const order = await ordersApi.create(payload);
      clear();
      toast.success(`Pedido #${order.id} creado con exito`);
      navigate(`/order/${order.id}`, { state: { order } });
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo completar el pedido"));
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <EmptyState
          icon={ShoppingCart}
          title="Tu carrito esta vacio"
          description="Explora el catalogo y agrega productos a tu carrito para comenzar."
          action={
            <Link to="/" className="btn-primary mt-2">
              <Dumbbell size={16} />
              Ir al catalogo
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Mi carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((it) => (
            <div
              key={it.productId}
              className="card p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              <img
                src={it.imagenUrl}
                alt={it.nombre}
                className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-md bg-slate-100"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/200x200/e2e8f0/64748b?text=Img";
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">{it.nombre}</h3>
                <p className="text-sm text-slate-600">
                  Precio unitario: {formatCurrency(it.precio)}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden">
                    <button
                      className="p-2 hover:bg-slate-100"
                      onClick={() => updateQuantity(it.productId, Math.max(1, it.quantity - 1))}
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm font-medium">{it.quantity}</span>
                    <button
                      className="p-2 hover:bg-slate-100"
                      onClick={() => updateQuantity(it.productId, it.quantity + 1)}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(it.productId)}
                    className="btn-ghost text-rose-600 hover:bg-rose-50"
                    aria-label={`Eliminar ${it.nombre}`}
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-slate-500">Subtotal</p>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(Number(it.precio) * it.quantity)}
                </p>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button onClick={clear} className="btn-ghost text-rose-600">
              <Trash2 size={16} /> Vaciar carrito
            </button>
          </div>
        </div>

        <aside className="card p-6 h-fit sticky top-20">
          <h2 className="text-lg font-bold mb-4">Resumen del pedido</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Articulos</dt>
              <dd className="font-medium">
                {items.reduce((a, i) => a + i.quantity, 0)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Subtotal</dt>
              <dd className="font-medium">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Envio</dt>
              <dd className="font-medium text-emerald-600">Gratis</dd>
            </div>
            <div className="h-px bg-slate-200 my-2" />
            <div className="flex justify-between text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold">{formatCurrency(subtotal)}</dd>
            </div>
          </dl>

          <p className="text-xs text-slate-500 mt-4">
            Sera enviado a:{" "}
            <span className="font-medium text-slate-700">
              {user?.direccionEnvio || "(configura tu perfil)"}
            </span>
          </p>

          <button
            onClick={handleCheckout}
            disabled={placing}
            className="btn-primary w-full mt-5"
          >
            <CreditCard size={18} />
            {placing ? "Procesando..." : "Finalizar compra"}
          </button>
        </aside>
      </div>
    </div>
  );
}
