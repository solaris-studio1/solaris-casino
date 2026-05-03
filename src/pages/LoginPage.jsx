// src/pages/LoginPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { T } from "../utils/theme";
import { Button, Input } from "../components/ui";

export default function LoginPage() {
  const { login, register, demoLogin } = useAuth();
  const toast = useToast();
  const [tab,      setTab]      = useState("login");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ identifier:"", password:"", username:"", full_name:"" });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    setLoading(true);
    let res;
    if (tab === "login") {
      res = await login(form.identifier, form.password);
    } else {
      res = await register({ email: form.identifier, username: form.username,
        password: form.password, full_name: form.full_name });
    }
    setLoading(false);
    if (!res.ok) toast.error(res.error);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "20px", position: "relative", overflow: "hidden" }}>

      {/* BG glows */}
      <div style={{ position: "absolute", top: "-10%", left: "5%", width: "400px", height: "400px",
        background: "radial-gradient(circle,rgba(255,180,0,0.1),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }}/>
      <div style={{ position: "absolute", bottom: "5%", right: "5%", width: "300px", height: "300px",
        background: "radial-gradient(circle,rgba(155,93,229,0.1),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }}/>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "400px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "16px",
            background: "linear-gradient(135deg,#ff6a00,#ffb400)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "30px", margin: "0 auto 14px", boxShadow: "0 8px 28px #ffb40066" }}>☀</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px",
            fontWeight: 700, letterSpacing: "0.12em",
            background: "linear-gradient(90deg,#ffb400,#fff8e0,#ffb400)",
            backgroundSize: "200%", WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite" }}>
            SOLARIS
          </h1>
          <p style={{ color: T.muted, fontSize: "12px", marginTop: "4px" }}>
            Casino Online · Entretenimiento Premium
          </p>
        </div>

        {/* Card */}
        <div style={{ background: "linear-gradient(160deg,#0e0e1e,#14142a)",
          border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "26px 22px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.04)",
            borderRadius: "12px", padding: "4px", marginBottom: "22px" }}>
            {[["login","Iniciar sesión"],["signup","Registrarse"]].map(([k,l]) => (
              <button key={k} onClick={() => { setTab(k); }}
                style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "none",
                  background: tab === k ? `linear-gradient(135deg,${T.orange},${T.gold})` : "transparent",
                  color: tab === k ? "#000" : T.muted,
                  fontWeight: 800, fontSize: "13px", cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "inherit" }}>
                {l}
              </button>
            ))}
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {tab === "signup" && <>
              <Input label="NOMBRE COMPLETO" placeholder="Tu nombre" value={form.full_name}
                onChange={e => f("full_name", e.target.value)}/>
              <Input label="USERNAME" placeholder="sin espacios" value={form.username}
                onChange={e => f("username", e.target.value)}/>
            </>}

            <Input label="EMAIL" placeholder="correo@email.com" type="email"
              value={form.identifier} onChange={e => f("identifier", e.target.value)}/>

            <div>
              <label style={{ fontSize: "10px", color: T.muted, letterSpacing: "0.1em",
                display: "block", marginBottom: "5px" }}>CONTRASEÑA</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} placeholder="••••••••"
                  value={form.password} onChange={e => f("password", e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submit()}
                  style={{ width: "100%", padding: "11px 44px 11px 14px",
                    borderRadius: "10px", background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)", color: T.white,
                    fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}/>
                <button onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", background: "none", border: "none",
                    color: T.muted, cursor: "pointer", fontSize: "16px" }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>
          </div>

          <Button fullWidth loading={loading}
            disabled={!form.identifier || !form.password}
            onClick={submit} style={{ marginTop: "18px" }}>
            {tab === "login" ? "Iniciar sesión →" : "Crear cuenta →"}
          </Button>

          <p style={{ textAlign: "center", fontSize: "11px", color: T.muted,
            marginTop: "14px", lineHeight: 1.6 }}>
            Al ingresar confirmas que tienes +18 años y aceptas los{" "}
            <span style={{ color: T.gold, cursor: "pointer" }}>Términos</span>
          </p>
        </div>

        {/* Demo */}
        <button onClick={demoLogin}
          style={{ width: "100%", marginTop: "12px", padding: "11px",
            borderRadius: "12px", border: `1px solid ${T.border}`,
            background: "rgba(255,255,255,0.02)", color: T.muted,
            fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>
          💡 Entrar en modo demo (sin backend)
        </button>
      </div>
    </div>
  );
}
