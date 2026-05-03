// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [wallet,  setWallet]  = useState(null);
  const [loading, setLoading] = useState(true); // true mientras verifica token

  // ── Cargar sesión al iniciar ───────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const token = api.getToken();
      if (!token) { setLoading(false); return; }

      const res = await api.auth.me();
      if (res.ok) {
        setUser(res.data.user);
        setWallet(res.data.wallet);
      } else {
        api.removeToken(); // token inválido
      }
      setLoading(false);
    };
    init();
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (identifier, password) => {
    const res = await api.auth.login({ identifier, password });
    if (!res.ok) return { ok: false, error: res.error };

    api.setToken(res.data.token);
    setUser(res.data.user);
    setWallet({
      balance_usd:     res.data.user.balance     || 0,
      balance_bonus:   res.data.user.balance_bonus || 0,
      total_deposited: 0,
      total_withdrawn: 0,
    });
    return { ok: true };
  }, []);

  // ── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (data) => {
    const res = await api.auth.register(data);
    if (!res.ok) return { ok: false, error: res.error };

    api.setToken(res.data.token);
    setUser(res.data.user);
    setWallet({ balance_usd: 0, balance_bonus: 0, total_deposited: 0, total_withdrawn: 0 });
    return { ok: true };
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    api.auth.logout();
    setUser(null);
    setWallet(null);
  }, []);

  // ── Refresh wallet ─────────────────────────────────────────────────────────
  const refreshWallet = useCallback(async () => {
    const res = await api.wallet.get();
    if (res.ok) setWallet(res.data);
  }, []);

  // ── Demo login (sin backend) ───────────────────────────────────────────────
  const demoLogin = useCallback(() => {
    setUser({
      id: "demo", email: "demo@solaris.casino",
      username: "demo_player", full_name: "Demo Player",
      vip_level: "silver", kyc_status: "verified",
    });
    setWallet({
      balance_usd: 127.50, balance_bonus: 14.48,
      total_deposited: 297.47, total_withdrawn: 169.97,
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user, wallet, loading,
      login, register, logout, refreshWallet, demoLogin,
      isAuthenticated: !!user,
      balance: wallet?.balance_usd || 0,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
