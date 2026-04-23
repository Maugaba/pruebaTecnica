import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackageSearch, Search } from "lucide-react";
import { productsApi } from "../api/productsApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { extractErrorMessage } from "../utils/errors";

export default function CatalogPage() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    setLoading(true);
    productsApi
      .list()
      .then(setProducts)
      .catch((err) =>
        toast.error(extractErrorMessage(err, "No se pudieron cargar los productos"))
      )
      .finally(() => setLoading(false));
  }, [toast]);

  const categorias = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.categoria && set.add(p.categoria));
    return ["", ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQ =
        !q ||
        p.nombre?.toLowerCase().includes(q) ||
        p.descripcion?.toLowerCase().includes(q);
      const matchesC = !categoria || p.categoria === categoria;
      return matchesQ && matchesC;
    });
  }, [products, query, categoria]);

  const handleAdd = (product) => {
    if (!isAuthenticated) {
      toast.info("Inicia sesion para agregar productos al carrito");
      navigate("/login", { state: { from: "/" } });
      return;
    }
    addItem(product);
    toast.success(`"${product.nombre}" agregado al carrito`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Catalogo deportivo
          </h1>
          <p className="text-slate-600 mt-1">
            Descubre equipamiento de calidad para cada disciplina.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="input pl-9 sm:w-64"
              aria-label="Buscar productos"
            />
          </div>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="input sm:w-48"
            aria-label="Filtrar por categoria"
          >
            {categorias.map((c) => (
              <option key={c || "all"} value={c}>
                {c || "Todas las categorias"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Loader label="Cargando catalogo..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="Sin resultados"
          description="No encontramos productos con esos filtros. Intenta con otros criterios."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>
      )}
    </div>
  );
}
