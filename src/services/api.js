// src/services/api.js
// Cliente central de API — todas las llamadas al backend pasan por aquí

const BASE = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "solaris_token";

const api = {
  // ── Token ──────────────────────────────────────────────────────────────────
  getToken:    ()  => localStorage.getItem(TOKEN_KEY),
  setToken:    (t) => localStorage.setItem(TOKEN_KEY, t),
  removeToken: ()  => localStorage.removeItem(TOKEN_KEY),

  // ── Headers ────────────────────────────────────────────────────────────────
  headers(extra = {}) {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extra,
    };
  },

  // ── Call base ──────────────────────────────────────────────────────────────
  async call(method, path, body) {
    try {
      const res = await fetch(`${BASE}${path}`, {
        method,
        headers: this.headers(),
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error del servidor");
      return { data, ok: true };
    } catch (err) {
      return { error: err.message, ok: false };
    }
  },

  // ── Upload (multipart) ─────────────────────────────────────────────────────
  async upload(path, formData) {
    try {
      const token = this.getToken();
      const res = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      return { data, ok: true };
    } catch (err) {
      return { error: err.message, ok: false };
    }
  },

  // ── Shortcuts ──────────────────────────────────────────────────────────────
  get:    (path)       => api.call("GET",    path),
  post:   (path, body) => api.call("POST",   path, body),
  put:    (path, body) => api.call("PUT",    path, body),
  delete: (path)       => api.call("DELETE", path),

  // ── Auth ───────────────────────────────────────────────────────────────────
  auth: {
    login:    (body) => api.post("/auth/login",           body),
    register: (body) => api.post("/auth/register",        body),
    me:       ()     => api.get("/auth/me"),
    logout:   ()     => { api.removeToken(); },
    changePassword: (body) => api.put("/auth/change-password", body),
  },

  // ── Wallet ─────────────────────────────────────────────────────────────────
  wallet: {
    get:         ()     => api.get("/wallet"),
    transactions:(q="") => api.get(`/wallet/transactions${q}`),
    deposit:     (body) => api.post("/wallet/deposit",  body),
    withdraw:    (body) => api.post("/wallet/withdraw", body),
    confirmDeposit: (id) => api.post(`/wallet/deposit/${id}/confirm`, {}),
  },

  // ── Payments ───────────────────────────────────────────────────────────────
  payments: {
    stripeIntent: (body) => api.post("/payments/stripe/create-intent",  body),
    cashappOrder: (body) => api.post("/payments/cashapp/create-order",  body),
    cryptoCharge: (body) => api.post("/payments/crypto/create-charge",  body),
  },

  // ── Games ──────────────────────────────────────────────────────────────────
  games: {
    list:      (q="") => api.get(`/games${q}`),
    providers: ()     => api.get("/games/providers"),
    init:      (body) => api.post("/games/init", body),
  },

  // ── Bonuses ────────────────────────────────────────────────────────────────
  bonuses: {
    list:  ()     => api.get("/bonuses"),
    claim: (type) => api.post(`/bonuses/claim/${type}`, {}),
  },

  // ── KYC ────────────────────────────────────────────────────────────────────
  kyc: {
    status: ()     => api.get("/kyc/status"),
    submit: (body) => api.post("/kyc/submit", body),
  },

  // ── Notifications ──────────────────────────────────────────────────────────
  notifications: {
    preferences:    ()     => api.get("/notifications/preferences"),
    savePrefs:      (body) => api.put("/notifications/preferences", body),
    sendTest:       (type) => api.post("/notifications/test", { type }),
  },

  // ── Reports (admin) ────────────────────────────────────────────────────────
  reports: {
    overview:   (period) => api.get(`/reports/overview?period=${period}`),
    players:    ()       => api.get("/reports/players"),
    games:      ()       => api.get("/reports/games"),
    cashflow:   ()       => api.get("/reports/cashflow"),
  },

  // ── Admin ──────────────────────────────────────────────────────────────────
  admin: {
    users:              (q="") => api.get(`/admin/users${q}`),
    transactions:       (q="") => api.get(`/admin/transactions${q}`),
    pendingWithdrawals: ()     => api.get("/admin/withdrawals/pending"),
    approveWithdrawal:  (id)   => api.post(`/admin/withdrawals/${id}/approve`, {}),
    rejectWithdrawal:   (id, reason) => api.post(`/admin/withdrawals/${id}/reject`, { reason }),
    kycPending:         ()     => api.get("/kyc/admin/pending"),
    approveKYC:         (id)   => api.post(`/kyc/admin/${id}/approve`, {}),
    rejectKYC:          (id, reason) => api.post(`/kyc/admin/${id}/reject`, { reason }),
  },
};

export default api;
