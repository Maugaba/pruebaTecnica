import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "../utils/formatters";

export default function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="card overflow-hidden flex flex-col group hover:shadow-md transition">
      <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={product.imagenUrl}
          alt={product.nombre}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x450/e2e8f0/64748b?text=Sin+imagen";
          }}
        />
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        {product.categoria && (
          <span className="self-start text-[11px] font-medium uppercase tracking-wide text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
            {product.categoria}
          </span>
        )}
        <h3 className="font-semibold text-slate-900 line-clamp-2">{product.nombre}</h3>
        <p className="text-sm text-slate-600 line-clamp-3 flex-1">{product.descripcion}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-slate-900">
            {formatCurrency(product.precio)}
          </span>
          <button
            onClick={handleAdd}
            className={added ? "btn bg-emerald-600 text-white" : "btn-primary"}
            aria-label={`Agregar ${product.nombre} al carrito`}
          >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
            {added ? "Agregado" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}
