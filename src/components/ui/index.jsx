// src/components/ui/index.jsx
// Componentes UI reutilizables en toda la app

import { useEffect } from "react";
import { T } from "../../utils/theme";

// ── BUTTON ────────────────────────────────────────────────────────────────────
export function Button({ children, variant = "primary", size = "md", disabled, loading, onClick, style = {}, fullWidth }) {
  const base = {
    border: "none", borderRadius: "12px", cursor: disabled || loading ? "not-allowed" : "pointer",
    fontWeight: 900, letterSpacing: "0.06em", fontFamily: "inherit",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
    transition: "all 0.3s", width: fullWidth ? "100%" : "auto",
    opacity: disabled ? 0.5 : 1,
  };
  const sizes = { sm: "8px 16px", md: "12px 22px", lg: "15px 32px" };
  const fontSizes = { sm: "11px", md: "13px", lg: "15px" };

  const variants = {
    primary:  { background: `linear-gradient(135deg,${T.orange},${T.gold})`, color: "#000",
      boxShadow: disabled ? "none" : `0 6px 20px ${T.gold}44` },
    secondary:{ background: "rgba(255,255,255,0.05)", color: T.muted,
      border: `1px solid rgba(255,255,255,0.08)` },
    danger:   { background: "rgba(225,29,72,0.08)", color: T.red,
      border: `1px solid rgba(225,29,72,0.2)` },
    success:  { background: "rgba(0,200,83,0.08)", color: T.green,
      border: `1px solid rgba(0,200,83,0.2)` },
    ghost:    { background: "transparent", color: T.muted, border: "none" },
  };

  return (
    <button onClick={!disabled && !loading ? onClick : undefined}
      style={{ ...base, ...variants[variant], padding: sizes[size], fontSize: fontSizes[size], ...style }}>
      {loading && <div style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.2)",
        borderTop: "2px solid currentColor", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}/>}
      {children}
    </button>
  );
}

// ── INPUT ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, prefix, suffix, ...props }) {
  return (
    <div>
      {label && <label style={{ fontSize: "10px", color: T.muted, letterSpacing: "0.1em",
        display: "block", marginBottom: "5px" }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {prefix && <span style={{ position: "absolute", left: "13px", top: "50%",
          transform: "translateY(-50%)", color: T.gold, fontSize: "16px", fontWeight: 800 }}>{prefix}</span>}
        <input {...props} style={{
          width: "100%", padding: `11px ${suffix ? "40px" : "14px"} 11px ${prefix ? "36px" : "14px"}`,
          borderRadius: "10px", background: "rgba(255,255,255,0.04)",
          border: `1px solid ${error ? T.red : "rgba(255,255,255,0.08)"}`,
          color: T.white, fontSize: "14px", outline: "none",
          fontFamily: "inherit", boxSizing: "border-box", transition: "border 0.2s",
          ...(props.style || {}),
        }}/>
        {suffix && <span style={{ position: "absolute", right: "13px", top: "50%",
          transform: "translateY(-50%)", color: T.muted }}>{suffix}</span>}
      </div>
      {error && <p style={{ fontSize: "11px", color: T.red, marginTop: "4px" }}>{error}</p>}
    </div>
  );
}

// ── BADGE ─────────────────────────────────────────────────────────────────────
export function Badge({ label, color = T.muted }) {
  return (
    <span style={{ fontSize: "10px", fontWeight: 700, color,
      background: color + "18", border: `1px solid ${color}33`,
      padding: "2px 9px", borderRadius: "20px", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, size = "md", sheet = false }) {
  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  const maxWidths = { sm: "380px", md: "520px", lg: "680px" };

  if (sheet) {
    // Bottom sheet para mobile
    return (
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
        zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center",
        backdropFilter: "blur(12px)", animation: "fadeIn 0.2s" }}>
        <div onClick={e => e.stopPropagation()}
          style={{ background: "linear-gradient(160deg,#0e0e1e,#14142a)",
            borderRadius: "24px 24px 0 0", padding: "22px 20px 40px",
            width: "100%", maxWidth: "480px", maxHeight: "92vh", overflowY: "auto",
            boxShadow: "0 -20px 60px rgba(0,0,0,0.8)", animation: "modalUp 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px",
            background: "rgba(255,255,255,0.12)", margin: "0 auto 20px" }}/>
          {title && <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px",
            fontWeight: 700, color: T.white, marginBottom: "18px" }}>{title}</h3>}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(10px)", padding: "20px", animation: "fadeIn 0.2s" }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: "linear-gradient(160deg,#0c0c18,#12121e)",
          border: `1px solid ${T.border}`, borderRadius: "20px", padding: "28px 24px",
          maxWidth: maxWidths[size], width: "100%", maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 40px 80px rgba(0,0,0,0.7)", animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
        {title && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", fontWeight: 700, color: T.white }}>{title}</h3>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "none",
              color: T.muted, fontSize: "16px", cursor: "pointer", borderRadius: "8px", padding: "6px 10px" }}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ── SPINNER ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 32, color = T.gold }) {
  return (
    <div style={{ width: size, height: size,
      border: `3px solid ${color}22`, borderTop: `3px solid ${color}`,
      borderRadius: "50%", animation: "spin 0.8s linear infinite" }}/>
  );
}

// ── TOGGLE ────────────────────────────────────────────────────────────────────
export function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      style={{ width: "44px", height: "24px", borderRadius: "12px", border: "none",
        background: value ? T.teal : "rgba(255,255,255,0.1)",
        cursor: "pointer", position: "relative", transition: "all 0.25s", flexShrink: 0 }}>
      <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#fff",
        position: "absolute", top: "3px", left: value ? "23px" : "3px",
        transition: "left 0.25px", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}/>
    </button>
  );
}

// ── EMPTY STATE ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = "🎴", title, desc, action }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "48px", marginBottom: "14px" }}>{icon}</div>
      {title && <p style={{ fontSize: "16px", color: T.white, fontWeight: 600, marginBottom: "8px" }}>{title}</p>}
      {desc  && <p style={{ fontSize: "13px", color: T.muted, marginBottom: "20px" }}>{desc}</p>}
      {action}
    </div>
  );
}

// ── CARD ──────────────────────────────────────────────────────────────────────
export function Card({ children, style = {}, glow }) {
  return (
    <div style={{ background: "linear-gradient(160deg,#0d0d18,#101020)",
      border: `1px solid ${T.border}`, borderRadius: "16px", padding: "20px",
      boxShadow: glow ? `0 0 30px ${glow}` : "0 4px 20px rgba(0,0,0,0.3)",
      ...style }}>
      {children}
    </div>
  );
}

// ── SECTION TITLE ─────────────────────────────────────────────────────────────
export function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px",
        fontWeight: 700, color: T.white, marginBottom: sub ? "4px" : 0 }}>{children}</h2>
      {sub && <p style={{ fontSize: "12px", color: T.muted }}>{sub}</p>}
    </div>
  );
}
