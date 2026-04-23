import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LogIn, Dumbbell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import FormField from "../components/FormField";
import { extractErrorMessage } from "../utils/errors";

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const from = location.state?.from || "/";

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  useEffect(() => {
    if (params.get("sessionExpired")) {
      toast.info("Tu sesion expiro, inicia sesion de nuevo");
    }
  }, [params, toast]);

  const validate = () => {
    const e = {};
    if (!values.email) e.email = "Email obligatorio";
    else if (!/\S+@\S+\.\S+/.test(values.email)) e.email = "Email invalido";
    if (!values.password) e.password = "Contrasena obligatoria";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev) => {
    setValues({ ...values, [ev.target.name]: ev.target.value });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      const user = await login(values.email.trim(), values.password);
      toast.success(`Bienvenido, ${user.nombres}`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err, "Credenciales invalidas"));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="bg-brand-50 text-brand-600 rounded-full p-3">
            <Dumbbell size={28} />
          </div>
          <h1 className="text-2xl font-bold">Iniciar sesion</h1>
          <p className="text-sm text-slate-600">Accede a tu cuenta para comprar</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            required
          />
          <FormField
            label="Contrasena"
            name="password"
            type="password"
            placeholder="********"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
            required
          />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <LogIn size={18} />
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-6 text-center">
          No tienes cuenta?{" "}
          <Link to="/register" className="text-brand-700 font-medium hover:underline">
            Registrate aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
