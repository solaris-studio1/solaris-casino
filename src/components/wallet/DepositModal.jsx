// src/components/wallet/DepositModal.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { T } from "../../utils/theme";
import api from "../../services/api";

const METHODS = [
  {id:"card",    label:"Tarjeta",   icon:"💳",color:"#ffb400",bg:"#ffb40015"},
  {id:"applepay",label:"Apple Pay", icon:"🍎",color:"#ffffff",bg:"#ffffff10"},
  {id:"cashapp", label:"CashApp",   icon:"💚",color:"#00d632",bg:"#00d63215"},
  {id:"crypto",  label:"Crypto",    icon:"₿", color:"#f7931a",bg:"#f7931a15"},
  {id:"paypal",  label:"PayPal",    icon:"🅿", color:"#009cde",bg:"#009cde15"},
  {id:"googlepay",label:"Google Pay",icon:"G",color:"#4285F4",bg:"#4285F415"},
];

const PRESETS = [
  {amount:9.99},{amount:19.99},{amount:30.99,bonus:0.61},
  {amount:49.99,bonus:1.49,hot:true},{amount:99.99,bonus:4.99,hot:true},
  {amount:149.99,bonus:7.49},{amount:199.99,bonus:9.99},{amount:499.99,bonus:39.99},
];

export default function DepositModal({ onClose, onSuccess }) {
  const { refreshWallet } = useAuth();
  const toast = useToast();
  const [step,    setStep]    = useState(0);
  const [method,  setMethod]  = useState(null);
  const [amount,  setAmount]  = useState(null);
  const [custom,  setCustom]  = useState("");
  const [loading, setLoading] = useState(false);

  const finalAmt = custom ? parseFloat(custom) : amount;
  const isValid  = finalAmt >= (method==="card" ? 30 : 9.99);

  const handlePay = async () => {
    setLoading(true);

    // Crear orden en el backend
    const res = await api.wallet.deposit({ amount: finalAmt, method });
    if (res.ok) {
      // En producción: redirigir a Stripe, CashApp QR, etc.
      // Por ahora confirmamos directo (demo)
      await api.wallet.confirmDeposit(res.data.transaction_id);
    }

    await new Promise(r => setTimeout(r, 1500)); // simular procesamiento
    setLoading(false);
    setStep(3);
    await refreshWallet();
    onSuccess?.();
  };

  return (
    <div onClick={() => { if (step!==3) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 1000,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        backdropFilter: "blur(12px)", animation: "fadeIn 0.2s" }}>

      <div onClick={e => e.stopPropagation()}
        style={{ background: "linear-gradient(160deg,#0e0e1e,#14142a)",
          borderRadius: "24px 24px 0 0", padding: "22px 18px 40px",
          width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.8)", animation: "modalUp 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>

        <div style={{ width: "36px", height: "4px", borderRadius: "2px",
          background: "rgba(255,255,255,0.12)", margin: "0 auto 18px" }}/>

        {/* Tabs */}
        {step < 3 && (
          <div style={{ display: "flex", gap: "3px", background: "rgba(255,255,255,0.04)",
            borderRadius: "10px", padding: "3px", marginBottom: "18px" }}>
            {["Depósito USD","Retiro USD","Dep. USDT","Ret. USDT"].map((t,i) => (
              <button key={t} style={{ flex: 1, padding: "7px 2px", borderRadius: "8px", border: "none",
                background: i===0?`linear-gradient(135deg,${T.orange},${T.gold})`:"transparent",
                color: i===0?"#000":T.muted, fontSize: "8px", fontWeight: 800, cursor: "pointer",
                whiteSpace: "nowrap", fontFamily: "inherit" }}>{t}</button>
            ))}
          </div>
        )}

        {/* Step 0: Método */}
        {step===0 && (
          <>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px",
              fontWeight: 700, marginBottom: "14px", color: T.white }}>Método de pago</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "18px" }}>
              {METHODS.map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  style={{ padding: "13px 5px", borderRadius: "12px",
                    border: `2px solid ${method===m.id?m.color:"rgba(255,255,255,0.07)"}`,
                    background: method===m.id?m.bg:"rgba(255,255,255,0.02)",
                    cursor: "pointer", display: "flex", flexDirection: "column",
                    alignItems: "center", gap: "5px", transition: "all 0.2s",
                    boxShadow: method===m.id?`0 0 14px ${m.color}44`:"none", fontFamily: "inherit" }}>
                  <span style={{ fontSize: "22px" }}>{m.icon}</span>
                  <span style={{ fontSize: "8px", fontWeight: 800,
                    color: method===m.id?m.color:T.muted, letterSpacing: "0.04em" }}>{m.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} disabled={!method}
              style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none",
                background: method?`linear-gradient(135deg,${T.orange},${T.gold})`:"rgba(255,255,255,0.05)",
                color: method?"#000":T.muted, fontWeight: 900, fontSize: "13px",
                cursor: method?"pointer":"not-allowed", transition: "all 0.3s",
                boxShadow: method?`0 6px 18px ${T.gold}44`:"none", fontFamily: "inherit" }}>
              Continuar →
            </button>
          </>
        )}

        {/* Step 1: Monto */}
        {step===1 && (
          <>
            <button onClick={() => setStep(0)}
              style={{ background: "none", border: "none", color: T.muted, cursor: "pointer",
                fontSize: "12px", marginBottom: "12px", fontFamily: "inherit" }}>← Volver</button>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px",
              fontWeight: 700, marginBottom: "6px", color: T.white }}>Selecciona monto</h2>
            <p style={{ color: T.muted, fontSize: "11px", marginBottom: "14px" }}>
              Mínimo: <span style={{ color: T.gold }}>${method==="card"?30:9.99}</span>
            </p>
            <div style={{ position: "relative", marginBottom: "14px" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%",
                transform: "translateY(-50%)", color: T.gold, fontSize: "18px", fontWeight: 800 }}>$</span>
              <input type="number" placeholder="Monto personalizado" value={custom}
                onChange={e => { setCustom(e.target.value); setAmount(null); }}
                style={{ width: "100%", padding: "13px 13px 13px 32px", borderRadius: "12px",
                  background: "rgba(255,255,255,0.04)",
                  border: `2px solid ${custom?T.gold:"rgba(255,255,255,0.08)"}`,
                  color: T.white, fontSize: "18px", fontWeight: 800,
                  outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "7px", marginBottom: "18px" }}>
              {PRESETS.map(p => {
                const sel = amount===p.amount && !custom;
                return (
                  <button key={p.amount} onClick={() => { setAmount(p.amount); setCustom(""); }}
                    style={{ padding: "10px 4px", borderRadius: "10px",
                      border: `2px solid ${sel?T.gold:"rgba(255,255,255,0.07)"}`,
                      background: sel?"rgba(255,180,0,0.1)":"rgba(255,255,255,0.02)",
                      cursor: "pointer", position: "relative", transition: "all 0.2s",
                      boxShadow: sel?`0 0 10px ${T.gold}33`:"none", fontFamily: "inherit" }}>
                    {p.hot&&!sel && <span style={{ position: "absolute", top: "-6px", right: "3px",
                      fontSize: "7px", background: T.red, color: "#fff",
                      padding: "1px 5px", borderRadius: "8px", fontWeight: 800 }}>HOT</span>}
                    <div style={{ fontSize: "11px", fontWeight: 800, color: sel?T.gold:T.white }}>${p.amount}</div>
                    {p.bonus && <div style={{ fontSize: "9px", color: T.teal, fontWeight: 700 }}>+${p.bonus}</div>}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setStep(2)} disabled={!isValid}
              style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none",
                background: isValid?`linear-gradient(135deg,${T.orange},${T.gold})`:"rgba(255,255,255,0.05)",
                color: isValid?"#000":T.muted, fontWeight: 900, fontSize: "13px",
                cursor: isValid?"pointer":"not-allowed", transition: "all 0.3s", fontFamily: "inherit" }}>
              Ir a pagar ${finalAmt?.toFixed(2)||"—"} →
            </button>
          </>
        )}

        {/* Step 2: Confirmación del pago */}
        {step===2 && (
          <>
            <button onClick={() => setStep(1)}
              style={{ background: "none", border: "none", color: T.muted, cursor: "pointer",
                fontSize: "12px", marginBottom: "12px", fontFamily: "inherit" }}>← Volver</button>
            <div style={{ background: `linear-gradient(135deg,${T.orange},${T.gold})`,
              borderRadius: "14px", padding: "14px 18px", marginBottom: "20px",
              display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "9px", color: "rgba(0,0,0,0.6)", fontWeight: 700, letterSpacing: "0.12em" }}>DEPÓSITO</div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#000",
                  fontFamily: "'Cormorant Garamond',serif" }}>${finalAmt?.toFixed(2)}</div>
              </div>
              <span style={{ fontSize: "28px" }}>{METHODS.find(m=>m.id===method)?.icon}</span>
            </div>
            <p style={{ color: T.muted, fontSize: "13px", textAlign: "center", marginBottom: "20px", lineHeight: 1.7 }}>
              Tu pago de <b style={{ color: T.gold }}>${finalAmt?.toFixed(2)}</b> será procesado de forma segura mediante{" "}
              <b style={{ color: T.white }}>{METHODS.find(m=>m.id===method)?.label}</b>.
            </p>
            <div style={{ background: "rgba(255,180,0,0.04)", border: "1px solid rgba(255,180,0,0.1)",
              borderRadius: "10px", padding: "10px 14px", marginBottom: "16px",
              fontSize: "11px", color: "#aaa", lineHeight: 1.7 }}>
              🔒 Pago encriptado SSL. Tu información está protegida.
            </div>
            <button onClick={handlePay} disabled={loading}
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: `linear-gradient(135deg,${T.orange},${T.gold})`,
                color: "#000", fontWeight: 900, fontSize: "14px", cursor: "pointer",
                letterSpacing: "0.04em", boxShadow: `0 6px 20px ${T.gold}44`,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                fontFamily: "inherit", opacity: loading?0.8:1 }}>
              {loading?(
                <><div style={{ width: "16px", height: "16px", border: "2px solid rgba(0,0,0,0.2)",
                  borderTop: "2px solid #000", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}/> Procesando...</>
              ):`💳 Confirmar pago de $${finalAmt?.toFixed(2)}`}
            </button>
          </>
        )}

        {/* Step 3: Éxito */}
        {step===3 && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ width: "70px", height: "70px", borderRadius: "50%",
              background: "linear-gradient(135deg,#00c853,#00d4aa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px", fontSize: "30px",
              boxShadow: "0 0 32px rgba(0,200,83,0.5)",
              animation: "bounce 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>✓</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px",
              fontWeight: 700, marginBottom: "8px", color: T.white }}>¡Depósito exitoso!</h2>
            <p style={{ color: T.muted, fontSize: "13px", marginBottom: "22px", lineHeight: 1.6 }}>
              Tu saldo ha sido actualizado. ¡Disfruta los juegos!
            </p>
            <button onClick={onClose}
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: `linear-gradient(135deg,${T.orange},${T.gold})`,
                color: "#000", fontWeight: 900, fontSize: "14px", cursor: "pointer",
                letterSpacing: "0.04em", fontFamily: "inherit" }}>
              🎮 Ir a jugar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
