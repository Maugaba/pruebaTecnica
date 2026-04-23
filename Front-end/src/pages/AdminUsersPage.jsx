import { useEffect, useState } from "react";
import { Pencil, Plus, Shield, Trash2, User as UserIcon } from "lucide-react";
import { usersApi } from "../api/usersApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { extractErrorMessage } from "../utils/errors";

const EMPTY_FORM = {
  nombres: "",
  apellidos: "",
  direccionEnvio: "",
  email: "",
  fechaNacimiento: "",
  password: "",
  rol: "CLIENTE",
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchAll = () => {
    setLoading(true);
    usersApi
      .list()
      .then(setUsers)
      .catch((err) => toast.error(extractErrorMessage(err, "No se pudieron cargar los usuarios")))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAll, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditingId(u.id);
    setForm({
      nombres: u.nombres ?? "",
      apellidos: u.apellidos ?? "",
      direccionEnvio: u.direccionEnvio ?? "",
      email: u.email ?? "",
      fechaNacimiento: u.fechaNacimiento ?? "",
      password: "",
      rol: u.rol ?? "CLIENTE",
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.nombres.trim()) e.nombres = "Obligatorio";
    if (!form.apellidos.trim()) e.apellidos = "Obligatorio";
    if (!form.direccionEnvio.trim()) e.direccionEnvio = "Obligatorio";
    if (!form.fechaNacimiento) e.fechaNacimiento = "Obligatorio";
    if (!form.rol) e.rol = "Obligatorio";
    if (!editingId) {
      if (!form.email.trim()) e.email = "Obligatorio";
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email invalido";
      if (!form.password || form.password.length < 6)
        e.password = "Minimo 6 caracteres";
    } else if (form.password && form.password.length < 6) {
      e.password = "Minimo 6 caracteres (dejar vacio para no cambiar)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (ev) => {
    const { name, value } = ev.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editingId) {
        const payload = {
          nombres: form.nombres.trim(),
          apellidos: form.apellidos.trim(),
          direccionEnvio: form.direccionEnvio.trim(),
          fechaNacimiento: form.fechaNacimiento,
          rol: form.rol,
        };
        if (form.password) payload.password = form.password;
        await usersApi.update(editingId, payload);
        toast.success("Usuario actualizado");
      } else {
        await usersApi.create({
          nombres: form.nombres.trim(),
          apellidos: form.apellidos.trim(),
          direccionEnvio: form.direccionEnvio.trim(),
          email: form.email.trim().toLowerCase(),
          fechaNacimiento: form.fechaNacimiento,
          password: form.password,
          rol: form.rol,
        });
        toast.success("Usuario creado");
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo guardar el usuario"));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (u) => {
    if (u.id === currentUser?.id) {
      toast.error("No puedes eliminar tu propia cuenta");
      return;
    }
    if (!window.confirm(`Eliminar a "${u.nombres} ${u.apellidos}"?`)) return;
    try {
      await usersApi.remove(u.id);
      toast.success("Usuario eliminado");
      fetchAll();
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo eliminar"));
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administracion de usuarios</h1>
          <p className="text-slate-500 text-sm">Crea, edita o elimina usuarios y sus roles</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={18} />
          Nuevo usuario
        </button>
      </div>

      {loading ? (
        <Loader label="Cargando usuarios..." />
      ) : users.length === 0 ? (
        <EmptyState title="Sin usuarios" description="No hay usuarios registrados todavia" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Direccion</th>
                <th className="text-center px-4 py-3 font-semibold">Rol</th>
                <th className="text-right px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className="px-4 py-2 font-medium text-slate-900">
                    {u.nombres} {u.apellidos}
                  </td>
                  <td className="px-4 py-2 text-slate-600">{u.email}</td>
                  <td className="px-4 py-2 text-slate-600">
                    <span className="line-clamp-1 max-w-[260px] block">{u.direccionEnvio}</span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.rol === "ADMIN"
                          ? "bg-brand-50 text-brand-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {u.rol === "ADMIN" ? <Shield size={12} /> : <UserIcon size={12} />}
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <button className="btn-ghost p-2" title="Editar" onClick={() => openEdit(u)}>
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn-ghost p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-transparent"
                        title={u.id === currentUser?.id ? "No puedes eliminarte" : "Eliminar"}
                        onClick={() => onDelete(u)}
                        disabled={u.id === currentUser?.id}
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
        title={editingId ? "Editar usuario" : "Nuevo usuario"}
        size="lg"
      >
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Nombres"
            name="nombres"
            value={form.nombres}
            onChange={onChange}
            error={errors.nombres}
            autoFocus
          />
          <FormField
            label="Apellidos"
            name="apellidos"
            value={form.apellidos}
            onChange={onChange}
            error={errors.apellidos}
          />
          <div className="sm:col-span-2">
            <FormField
              label="Direccion de envio"
              name="direccionEnvio"
              value={form.direccionEnvio}
              onChange={onChange}
              error={errors.direccionEnvio}
            />
          </div>
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            error={errors.email}
            disabled={Boolean(editingId)}
          />
          <FormField
            label="Fecha de nacimiento"
            name="fechaNacimiento"
            type="date"
            value={form.fechaNacimiento}
            onChange={onChange}
            error={errors.fechaNacimiento}
          />
          <FormField
            label={editingId ? "Nueva contrasena (opcional)" : "Contrasena"}
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            error={errors.password}
            placeholder={editingId ? "Dejar vacio para no cambiar" : ""}
          />
          <FormField
            label="Rol"
            name="rol"
            as="select"
            value={form.rol}
            onChange={onChange}
            error={errors.rol}
          >
            <option value="CLIENTE">CLIENTE</option>
            <option value="ADMIN">ADMIN</option>
          </FormField>
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
              {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
