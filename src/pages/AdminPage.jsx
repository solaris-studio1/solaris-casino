// src/pages/AdminPage.jsx
// Panel de administración completo
// El código completo está en solaris-admin.jsx
// Aquí integramos el componente

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { T } from "../utils/theme";
import { Button, Badge, Card } from "../components/ui";
import api from "../services/api";

const fm = n => `$${Number(n||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fn = n => Number(n||0).toLocaleString("en-US");

// Mock data para demo
const MOCK = {
  stats:{ total_users:1284, users_today:23, total_revenue:94820, revenue_today:3240, active_sessions:187, pending_withdrawals:2 },
  users:[
    {id:"u001",username:"carlos_mx",email:"carlos@gmail.com",full_name:"Carlos Mendoza",balance:840.50,total_deposited:2400,vip_level:"gold",kyc_status:"verified",is_banned:false},
    {id:"u002",username:"sofia_cl",email:"sofia@gmail.com",full_name:"Sofía Martínez",balance:2140.00,total_deposited:8400,vip_level:"gold",kyc_status:"verified",is_banned:false},
    {id:"u003",username:"juan_pe",email:"juan@email.com",full_name:"Juan Pérez",balance:0,total_deposited:99.99,vip_level:"bronze",kyc_status:"pending",is_banned:false},
  ],
  transactions:[
    {id:"tx001",user:"carlos_mx",type:"deposit",method:"cashapp",amount:99.99,status:"completed",created_at:"2026-05-02 14:32"},
    {id:"tx002",user:"sofia_cl",type:"deposit",method:"card",amount:299.99,status:"completed",created_at:"2026-05-02 13:18"},
    {id:"tx003",user:"sofia_cl",type:"withdrawal",method:"cashapp",amount:500.00,status:"pending",created_at:"2026-05-01 22:10"},
  ],
  withdrawals:[
    {id:"wd001",user:"sofia_cl",email:"sofia@gmail.com",method:"cashapp",destination:"$sofiamart",amount:500.00,requested_at:"2026-05-01 22:10"},
  ],
};

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState("overview");
  const [toast, setToast] = useState(null);
  const [withdrawals, setWithdrawals] = useState(MOCK.withdrawals);

  const showToast = (msg, type="success") => { setToast({msg,type,k:Date.now()}); setTimeout(()=>setToast(null),3500); };

  const navItems = [
    {k:"overview",l:"Dashboard",i:"📊"},
    {k:"users",l:"Usuarios",i:"👥"},
    {k:"transactions",l:"Transacciones",i:"💳"},
    {k:"withdrawals",l:"Retiros",i:"📤",badge:withdrawals.length},
  ];

  const approve = async (wd) => {
    setWithdrawals(p => p.filter(x => x.id !== wd.id));
    showToast(`✅ Retiro aprobado: ${fm(wd.amount)} → ${wd.user}`);
  };

  const reject = async (wd) => {
    setWithdrawals(p => p.filter(x => x.id !== wd.id));
    showToast(`Retiro rechazado: ${wd.user}`, "error");
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans',sans-serif", color: T.white, display: "flex" }}>

      {/* Sidebar */}
      <aside style={{ width: "200px", minHeight: "100vh", background: "#07070f", borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
        <div style={{ padding: "18px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg,#ff6a00,#ffb400)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>☀</div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "16px", fontWeight: 700, color: T.gold }}>SOLARIS</div>
            <div style={{ fontSize: "8px", color: T.muted, letterSpacing: "0.12em" }}>ADMIN</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "10px 8px" }}>
          {navItems.map(item => {
            const active = page === item.k;
            return (
              <button key={item.k} onClick={() => setPage(item.k)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "10px", border: "none", background: active?"rgba(255,180,0,0.1)":"transparent", color: active?T.gold:T.muted, fontWeight: active?700:500, fontSize: "12px", cursor: "pointer", marginBottom: "2px", transition: "all 0.15s", fontFamily: "inherit", position: "relative" }}>
                <span style={{ fontSize: "14px" }}>{item.i}</span>
                <span>{item.l}</span>
                {item.badge>0 && <span style={{ marginLeft: "auto", background: T.orange, color: "#000", fontSize: "9px", fontWeight: 900, padding: "1px 6px", borderRadius: "10px" }}>{item.badge}</span>}
              </button>
            );
          })}
          <button onClick={() => navigate("/admin/reports")}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "10px", border: "none", background: "transparent", color: T.muted, fontWeight: 500, fontSize: "12px", cursor: "pointer", marginBottom: "2px", fontFamily: "inherit" }}>
            <span style={{ fontSize: "14px" }}>📈</span><span>Reportes</span>
          </button>
        </nav>
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "10px 8px" }}>
          <button onClick={() => { logout(); navigate("/login"); }}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "none", background: "rgba(225,29,72,0.06)", color: T.red, fontSize: "11px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            ⏻ Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "28px", overflowX: "hidden", minWidth: 0 }}>

        {/* Overview */}
        {page==="overview" && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", color: T.white, marginBottom: "20px" }}>Panel General</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "12px", marginBottom: "24px" }}>
              {[
                {l:"Usuarios totales",v:fn(MOCK.stats.total_users),i:"👥",c:T.blue},
                {l:"Ingresos totales",v:fm(MOCK.stats.total_revenue),i:"💰",c:T.gold},
                {l:"Sesiones activas",v:fn(MOCK.stats.active_sessions),i:"🟢",c:T.teal},
                {l:"Retiros pendientes",v:MOCK.stats.pending_withdrawals,i:"⏳",c:T.orange},
              ].map(k=>(
                <Card key={k.l} style={{ border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: "22px", marginBottom: "8px" }}>{k.i}</div>
                  <div style={{ fontSize: "24px", fontWeight: 900, color: k.c, fontFamily: "'Cormorant Garamond',serif" }}>{k.v}</div>
                  <div style={{ fontSize: "12px", color: T.muted, marginTop: "2px" }}>{k.l}</div>
                </Card>
              ))}
            </div>
            <Card>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", color: T.white, marginBottom: "14px" }}>Transacciones recientes</h3>
              {MOCK.transactions.map((tx,i)=>(
                <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i<MOCK.transactions.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: T.white }}>{tx.user}</div>
                    <div style={{ fontSize: "10px", color: T.muted }}>{tx.method} · {tx.created_at}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: tx.type==="withdrawal"?T.red:T.gold }}>{tx.type==="withdrawal"?"-":"+"}${tx.amount.toFixed(2)}</div>
                    <Badge label={tx.status==="completed"?"✓ Completado":"⏳ Pendiente"} color={tx.status==="completed"?T.teal:"#f7931a"}/>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Users */}
        {page==="users" && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", color: T.white, marginBottom: "20px" }}>Usuarios ({MOCK.users.length})</h2>
            <Card>
              {MOCK.users.map((u,i)=>(
                <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i<MOCK.users.length-1?"1px solid rgba(255,255,255,0.04)":"none", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: T.white }}>{u.username}</div>
                    <div style={{ fontSize: "11px", color: T.muted }}>{u.email}</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <Badge label={fm(u.balance)} color={T.gold}/>
                    <Badge label={u.vip_level.toUpperCase()} color={u.vip_level==="gold"?T.gold:u.vip_level==="silver"?"#c0c0c0":"#cd7f32"}/>
                    <Badge label={u.kyc_status} color={u.kyc_status==="verified"?T.teal:T.orange}/>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Withdrawals */}
        {page==="withdrawals" && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", color: T.white, marginBottom: "20px" }}>Retiros pendientes ({withdrawals.length})</h2>
            {withdrawals.length===0 ? (
              <Card style={{ textAlign: "center", padding: "60px" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
                <p style={{ color: T.muted }}>No hay retiros pendientes</p>
              </Card>
            ) : withdrawals.map(wd=>(
              <Card key={wd.id} style={{ marginBottom: "14px", border: "1px solid rgba(247,147,26,0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: T.white }}>{wd.user}</div>
                    <div style={{ fontSize: "12px", color: T.muted }}>{wd.email} · {wd.requested_at}</div>
                    <div style={{ fontSize: "12px", color: T.muted, marginTop: "4px" }}>→ {wd.destination}</div>
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: 900, color: T.red, fontFamily: "'Cormorant Garamond',serif" }}>{fm(wd.amount)}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <Button variant="success" onClick={() => approve(wd)}>✓ Aprobar retiro</Button>
                  <Button variant="danger"  onClick={() => reject(wd)}>✗ Rechazar</Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Transactions */}
        {page==="transactions" && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", color: T.white, marginBottom: "20px" }}>Transacciones</h2>
            <Card>
              {MOCK.transactions.map((tx,i)=>(
                <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i<MOCK.transactions.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: T.white }}>{tx.user} · {tx.method}</div>
                    <div style={{ fontSize: "10px", color: T.muted, fontFamily: "monospace" }}>{tx.id} · {tx.created_at}</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: tx.type==="withdrawal"?T.red:T.gold }}>{tx.type==="withdrawal"?"-":"+"}${tx.amount.toFixed(2)}</span>
                    <Badge label={tx.status==="completed"?"✓ Completado":"⏳ Pendiente"} color={tx.status==="completed"?T.teal:"#f7931a"}/>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </main>

      {toast && (
        <div key={toast.k} style={{ position: "fixed", bottom: "24px", right: "24px", background: toast.type==="error"?`linear-gradient(135deg,#7f0020,${T.red})`:`linear-gradient(135deg,#064e3b,#10b981)`, color: "#fff", padding: "12px 20px", borderRadius: "12px", fontSize: "13px", fontWeight: 700, zIndex: 3000, boxShadow: "0 8px 24px rgba(0,0,0,0.5)", animation: "slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)", maxWidth: "320px" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
