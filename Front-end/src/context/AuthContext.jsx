import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import { TOKEN_KEY } from "../api/axiosClient";

const USER_KEY = "deportes.user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const persist = useCallback((t, u) => {
    if (t) {
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    }
    if (u) {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setUser(u);
    } else {
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const data = await authApi.login({ email, password });
        persist(data.token, data.user);
        return data.user;
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  const register = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const data = await authApi.register(payload);
        persist(data.token, data.user);
        return data.user;
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  const logout = useCallback(() => {
    persist(null, null);
  }, [persist]);

  const refreshProfile = useCallback(async () => {
    const me = await authApi.me();
    persist(token, me);
    return me;
  }, [persist, token]);

  const updateProfile = useCallback(
    async (payload) => {
      const updated = await authApi.updateProfile(payload);
      persist(token, updated);
      return updated;
    },
    [persist, token]
  );

  useEffect(() => {
    if (token && !user) {
      authApi
        .me()
        .then((u) => persist(token, u))
        .catch(() => persist(null, null));
    }
  }, [token, user, persist]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.rol === "ADMIN",
      loading,
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
    }),
    [token, user, loading, login, register, logout, refreshProfile, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
