import { useEffect, useState } from "react";
import { Save, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import FormField from "../components/FormField";
import Loader from "../components/Loader";
import { extractErrorMessage } from "../utils/errors";

export default function ProfilePage() {
  const { user, refreshProfile, updateProfile } = useAuth();
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    refreshProfile()
      .then((u) =>
        setValues({
          nombres: u.nombres,
          apellidos: u.apellidos,
          direccionEnvio: u.direccionEnvio,
          fechaNacimiento: u.fechaNacimiento,
        })
      )
      .catch((err) => toast.error(extractErrorMessage(err)));
  }, []); // eslint-disable-line

  const handleChange = (ev) =>
    setValues({ ...values, [ev.target.name]: ev.target.value });

  const validate = () => {
    const e = {};
    if (!values.nombres?.trim()) e.nombres = "Nombres obligatorios";
    if (!values.apellidos?.trim()) e.apellidos = "Apellidos obligatorios";
    if (!values.direccionEnvio?.trim()) e.direccionEnvio = "Direccion obligatoria";
    if (!values.fechaNacimiento) e.fechaNacimiento = "Fecha obligatoria";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await updateProfile(values);
      toast.success("Perfil actualizado");
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo actualizar"));
    } finally {
      setSaving(false);
    }
  };

  if (!values) return <Loader label="Cargando perfil..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-brand-50 text-brand-600 rounded-full p-3">
            <User size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Mi perfil</h1>
            <p className="text-sm text-slate-600">
              Actualiza tus datos personales y de envio
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="label">Email</p>
            <p className="input bg-slate-50 cursor-not-allowed select-all">
              {user?.email}
            </p>
          </div>
          <div>
            <p className="label">ID de usuario</p>
            <p className="input bg-slate-50 cursor-not-allowed">{user?.id}</p>
          </div>
        </div>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit} noValidate>
          <FormField
            label="Nombres"
            name="nombres"
            value={values.nombres}
            onChange={handleChange}
            error={errors.nombres}
            required
          />
          <FormField
            label="Apellidos"
            name="apellidos"
            value={values.apellidos}
            onChange={handleChange}
            error={errors.apellidos}
            required
          />
          <div className="sm:col-span-2">
            <FormField
              label="Direccion de envio"
              name="direccionEnvio"
              value={values.direccionEnvio}
              onChange={handleChange}
              error={errors.direccionEnvio}
              required
            />
          </div>
          <FormField
            label="Fecha de nacimiento"
            name="fechaNacimiento"
            type="date"
            value={values.fechaNacimiento}
            onChange={handleChange}
            error={errors.fechaNacimiento}
            required
          />

          <div className="sm:col-span-2 pt-2 flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary">
              <Save size={18} />
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
