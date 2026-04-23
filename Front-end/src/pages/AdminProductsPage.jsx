import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { productsApi } from "../api/productsApi";
import { useToast } from "../context/ToastContext";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { formatCurrency } from "../utils/formatters";
import { extractErrorMessage } from "../utils/errors";

const EMPTY_FORM = {
  nombre: "",
  descripcion: "",
  precio: "",
  imagenUrl: "",
  categoria: "",
  activo: true,
};

export default function AdminProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchAll = () => {
    setLoading(true);
    productsApi
      .list()
      .then(setProducts)
      .catch((err) => toast.error(extractErrorMessage(err, "No se pudieron cargar los productos")))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAll, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      nombre: p.nombre ?? "",
      descripcion: p.descripcion ?? "",
      precio: p.precio ?? "",
      imagenUrl: p.imagenUrl ?? "",
      categoria: p.categoria ?? "",
      activo: p.activo ?? true,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.descripcion.trim()) e.descripcion = "La descripcion es obligatoria";
    const precio = Number(form.precio);
    if (!form.precio || Number.isNaN(precio) || precio <= 0) e.precio = "El precio debe ser mayor a 0";
    if (!form.imagenUrl.trim()) e.imagenUrl = "La URL de imagen es obligatoria";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (ev) => {
    const { name, value, type, checked } = ev.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        imagenUrl: form.imagenUrl.trim(),
        categoria: form.categoria.trim() || null,
        activo: form.activo,
      };
      if (editingId) {
        await productsApi.update(editingId, payload);
        toast.success("Producto actualizado");
      } else {
        await productsApi.create(payload);
        toast.success("Producto creado");
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo guardar el producto"));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (p) => {
    if (!window.confirm(`Eliminar "${p.nombre}"?`)) return;
    try {
      await productsApi.remove(p.id);
      toast.success("Producto eliminado");
      fetchAll();
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo eliminar"));
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administracion de productos</h1>
          <p className="text-slate-500 text-sm">Crea, edita o elimina articulos del catalogo</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>

      {loading ? (
        <Loader label="Cargando productos..." />
      ) : products.length === 0 ? (
        <EmptyState title="Sin productos" description="Crea el primer producto del catalogo" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Imagen</th>
                <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                <th className="text-left px-4 py-3 font-semibold">Categoria</th>
                <th className="text-right px-4 py-3 font-semibold">Precio</th>
                <th className="text-center px-4 py-3 font-semibold">Estado</th>
                <th className="text-right px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className="px-4 py-2">
                    <img
                      src={p.imagenUrl}
                      alt={p.nombre}
                      className="w-12 h-12 object-cover rounded-md border border-slate-200"
                      onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-medium text-slate-900">{p.nombre}</div>
                    <div className="text-xs text-slate-500 line-clamp-1 max-w-xs">
                      {p.descripcion}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-slate-600">{p.categoria || "-"}</td>
                  <td className="px-4 py-2 text-right font-medium">{formatCurrency(p.precio)}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.activo
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="btn-ghost p-2"
                        title="Editar"
                        onClick={() => openEdit(p)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn-ghost p-2 text-rose-600 hover:bg-rose-50"
                        title="Eliminar"
                        onClick={() => onDelete(p)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar producto" : "Nuevo producto"}
        size="lg"
      >
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FormField
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              error={errors.nombre}
              autoFocus
            />
          </div>
          <div className="sm:col-span-2">
            <FormField
              label="Descripcion"
              name="descripcion"
              as="textarea"
              rows={3}
              value={form.descripcion}
              onChange={onChange}
              error={errors.descripcion}
            />
          </div>
          <FormField
            label="Precio"
            name="precio"
            type="number"
            step="0.01"
            min="0"
            value={form.precio}
            onChange={onChange}
            error={errors.precio}
          />
          <FormField
            label="Categoria"
            name="categoria"
            value={form.categoria}
            onChange={onChange}
            error={errors.categoria}
          />
          <div className="sm:col-span-2">
            <FormField
              label="URL de imagen"
              name="imagenUrl"
              value={form.imagenUrl}
              onChange={onChange}
              error={errors.imagenUrl}
              placeholder="https://..."
            />
          </div>
          <label className="sm:col-span-2 inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={onChange}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Producto activo (visible en catalogo)
          </label>
          <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
