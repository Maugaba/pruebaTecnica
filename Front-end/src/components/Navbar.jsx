import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Dumbbell,
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive ? "text-brand-700 bg-brand-50" : "text-slate-600 hover:text-brand-700 hover:bg-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-brand-700" onClick={() => setOpen(false)}>
          <Dumbbell size={26} />
          <span className="font-extrabold text-lg tracking-tight">Deportes Store</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Catalogo
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/orders" className={linkClass}>
                {isAdmin ? "Pedidos" : "Mis pedidos"}
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                Mi Perfil
              </NavLink>
            </>
          )}
          {isAdmin && (
            <>
              <NavLink to="/admin/products" className={linkClass}>
                Admin Productos
              </NavLink>
              <NavLink to="/admin/users" className={linkClass}>
                Admin Usuarios
              </NavLink>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/cart"
            className="relative btn-secondary"
            aria-label={`Carrito con ${totalItems} articulos`}
          >
            <ShoppingCart size={18} />
            <span>Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <div className="hidden lg:flex items-center gap-2 text-sm text-slate-600 ml-2">
                {isAdmin ? <Shield size={16} className="text-brand-700" /> : <User size={16} />}
                <span className="truncate max-w-[140px]">{user?.nombres}</span>
              </div>
              <button onClick={handleLogout} className="btn-ghost" title="Cerrar sesion">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                <LogIn size={16} />
                Entrar
              </Link>
              <Link to="/register" className="btn-primary">
                <UserPlus size={16} />
                Registrarse
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden btn-ghost"
          onClick={() => setOpen((s) => !s)}
          aria-label={open ? "Cerrar menu" : "Abrir menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
              Catalogo
            </NavLink>
            <NavLink to="/cart" className={linkClass} onClick={() => setOpen(false)}>
              Carrito {totalItems > 0 && <span className="text-brand-600">({totalItems})</span>}
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/orders" className={linkClass} onClick={() => setOpen(false)}>
                  {isAdmin ? "Pedidos" : "Mis pedidos"}
                </NavLink>
                <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                  Mi Perfil
                </NavLink>
                {isAdmin && (
                  <>
                    <NavLink to="/admin/products" className={linkClass} onClick={() => setOpen(false)}>
                      Admin Productos
                    </NavLink>
                    <NavLink to="/admin/users" className={linkClass} onClick={() => setOpen(false)}>
                      Admin Usuarios
                    </NavLink>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="text-left px-3 py-2 rounded-md text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  Cerrar sesion
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
                  Entrar
                </NavLink>
                <NavLink to="/register" className={linkClass} onClick={() => setOpen(false)}>
                  Registrarse
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
