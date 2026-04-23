import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import FormField from "../components/FormField";
import { extractErrorMessage } from "../utils/errors";

const emptyValues = {
  nombres: "",
  apellidos: "",
  direccionEnvio: "",
  email: "",
  fechaNacimiento: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const { register, loading, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const e = {};
    if (!values.nombres.trim()) e.nombres = "Nombres obligatorios";
    if (!values.apellidos.trim()) e.apellidos = "Apellidos obligatorios";
    if (!values.direccionEnvio.trim()) e.direccionEnvio = "Direccion obligatoria";
    if (!values.email) e.email = "Email obligatorio";
    else if (!/\S+@\S+\.\S+/.test(values.email)) e.email = "Email invalido";
    if (!values.fechaNacimiento) e.fechaNacimiento = "Fecha de nacimiento obligatoria";
    else {
      const today = new Date();
      const birth = new Date(values.fechaNacimiento);
      if (birth >= today) e.fechaNacimiento = "La fecha debe ser anterior a hoy";
    }
    if (!values.password) e.password = "Contrasena obligatoria";
    else if (values.password.length < 6) e.password = "Minimo 6 caracteres";
    if (values.password !== values.confirmPassword)
      e.confirmPassword = "Las contrasenas no coinciden";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev) =>
    setValues({ ...values, [ev.target.name]: ev.target.value });

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      const { confirmPassword, ...payload } = values;
      const user = await register(payload);
      toast.success(`Cuenta creada. Bienvenido ${user.nombres}!`);
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo registrar"));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-2xl p-8">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="bg-brand-50 text-brand-600 rounded-full p-3">
            <UserPlus size={28} />
          </div>
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="text-sm text-slate-600">
            Todos los campos son obligatorios
          </p>
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
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            required
          />
          <FormField
            label="Fecha de nacimiento"
            name="fechaNacimiento"
            type="date"
            value={values.fechaNacimiento}
            onChange={handleChange}
            error={errors.fechaNacimiento}
            required
          />
          <FormField
            label="Contrasena"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
            required
          />
          <FormField
            label="Confirmar contrasena"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
          />

          <div className="sm:col-span-2 pt-2">
            <button type="submit" disabled={loading} className="btn-primary w-full">
              <UserPlus size={18} />
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </div>
        </form>

        <p className="text-sm text-slate-600 mt-6 text-center">
          Ya tienes cuenta?{" "}
          <Link to="/login" className="text-brand-700 font-medium hover:underline">
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  );
}
