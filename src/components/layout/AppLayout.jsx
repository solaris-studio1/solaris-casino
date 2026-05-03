// src/components/layout/AppLayout.jsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { T } from "../../utils/theme";
import DepositModal from "../wallet/DepositModal";

const NAV_TABS = [
  { path: "/games",   icon: "🎮", label: "Juegos"  },
  { path: "/bonuses", icon: "🎁", label: "Bonos"   },
  { path: "/wallet",  icon: "💰", label: "Wallet"  },
  { path: "/vip",     icon: "👑", label: "VIP"     },
];

export default function AppLayout() {
  const { user, balance, refreshWallet } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [deposit,  setDeposit]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>

      {/* ── Top Nav ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        background: scrolled ? "rgba(5,5,14,0.97)" : "rgba(5,5,14,0.8)",
        borderBottom: `1px solid ${scrolled ? T.border : "transparent"}`,
        backdropFilter: "blur(24px)",
        padding: "0 20px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.3s",
      }}>
        {/* Logo */}
        <div onClick={() => navigate("/games")}
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "9px",
            background: "linear-gradient(135deg,#ff6a00,#ffb400)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>☀</div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "21px",
            fontWeight: 700, letterSpacing: "0.1em",
            background: "linear-gradient(90deg,#ffb400,#fff8e0,#ffb400)",
            backgroundSize: "200%", WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite" }}>
            SOLARIS
          </span>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Balance */}
          <div onClick={() => setDeposit(true)}
            style={{ background: "rgba(255,180,0,0.08)", border: "1px solid rgba(255,180,0,0.2)",
              borderRadius: "10px", padding: "5px 12px", cursor: "pointer" }}>
            <div style={{ fontSize: "8px", color: T.muted, letterSpacing: "0.1em" }}>SALDO</div>
            <div style={{ fontSize: "15px", fontWeight: 900, color: T.gold }}>
              ${balance.toFixed(2)}
            </div>
          </div>

          {/* Deposit button */}
          <button onClick={() => setDeposit(true)}
            style={{ padding: "8px 14px", borderRadius: "10px", border: "none",
              background: `linear-gradient(135deg,${T.orange},${T.gold})`,
              color: "#000", fontWeight: 900, fontSize: "11px", cursor: "pointer",
              letterSpacing: "0.06em" }}>
            + Dep.
          </button>

          {/* Avatar */}
          <div onClick={() => navigate("/profile")}
            style={{ width: "32px", height: "32px", borderRadius: "50%",
              background: "linear-gradient(135deg,#9b5de5,#e11d48)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", cursor: "pointer", fontWeight: 700, color: "#fff" }}>
            {user?.full_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </nav>

      {/* ── Page content ── */}
      <main style={{ paddingBottom: "72px" }}>
        <Outlet />
      </main>

      {/* ── Bottom Tab Nav ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
        background: "rgba(5,5,14,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        display: "flex", height: "62px",
      }}>
        {NAV_TABS.map(tab => {
          const active = location.pathname === tab.path ||
            (tab.path !== "/" && location.pathname.startsWith(tab.path));
          return (
            <button key={tab.path} onClick={() => navigate(tab.path)}
              style={{ flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "3px",
                background: "transparent", border: "none", cursor: "pointer",
                position: "relative", transition: "all 0.2s" }}>
              <span style={{ fontSize: "19px", filter: active ? "none" : "grayscale(1) opacity(0.4)" }}>
                {tab.icon}
              </span>
              <span style={{ fontSize: "9px", fontWeight: 700,
                color: active ? T.gold : T.muted, letterSpacing: "0.05em" }}>
                {tab.label}
              </span>
              {active && (
                <div style={{ position: "absolute", bottom: 0, width: "28px",
                  height: "2px", background: T.gold, borderRadius: "2px 2px 0 0" }}/>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Deposit Modal ── */}
      {deposit && (
        <DepositModal
          onClose={() => setDeposit(false)}
          onSuccess={() => { setDeposit(false); refreshWallet(); }}
        />
      )}
    </div>
  );
}
