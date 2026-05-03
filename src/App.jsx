// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { T } from "./utils/theme";

// Pages
import LoginPage       from "./pages/LoginPage";
import GamesPage       from "./pages/GamesPage";
import BonusesPage     from "./pages/BonusesPage";
import WalletPage      from "./pages/WalletPage";
import VIPPage         from "./pages/VIPPage";
import ProfilePage     from "./pages/ProfilePage";
import KYCPage         from "./pages/KYCPage";
import AdminPage       from "./pages/AdminPage";
import ReportsPage     from "./pages/ReportsPage";
import NotFoundPage    from "./pages/NotFoundPage";

// Layout
import AppLayout from "./components/layout/AppLayout";

// ── Protected route ────────────────────────────────────────────────────────────
function Protected({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex",
        alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: "48px", animation: "pulse 1s infinite" }}>☀</div>
        <div style={{ color: T.muted, fontSize: "14px" }}>Cargando Solaris...</div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// ── Public route (redirige si ya está logueado) ────────────────────────────────
function Public({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/games" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/login" element={<Public><LoginPage /></Public>} />

      {/* App principal con layout */}
      <Route path="/" element={<Protected><AppLayout /></Protected>}>
        <Route index element={<Navigate to="/games" replace />} />
        <Route path="games"    element={<GamesPage />} />
        <Route path="bonuses"  element={<BonusesPage />} />
        <Route path="wallet"   element={<WalletPage />} />
        <Route path="vip"      element={<VIPPage />} />
        <Route path="profile"  element={<ProfilePage />} />
        <Route path="kyc"      element={<KYCPage />} />
      </Route>

      {/* Admin (layout separado) */}
      <Route path="/admin/*" element={<Protected><AdminPage /></Protected>} />
      <Route path="/admin/reports" element={<Protected><ReportsPage /></Protected>} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
