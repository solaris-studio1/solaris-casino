// src/pages/ReportsPage.jsx
// El módulo completo de reportes está en solaris-reports.jsx
// Esta página es un placeholder que muestra el link al módulo completo

import { useNavigate } from "react-router-dom";
import { T } from "../utils/theme";
import { Button, Card } from "../components/ui";

export default function ReportsPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans',sans-serif", color: T.white, padding: "40px 24px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>📊</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "32px", color: T.white, marginBottom: "10px" }}>Reportes Financieros</h1>
        <p style={{ color: T.muted, fontSize: "14px", lineHeight: 1.7, marginBottom: "28px" }}>
          El módulo completo de reportes (GGR, análisis de jugadores, flujo de caja) está en <code style={{ color: T.gold }}>solaris-reports.jsx</code>.
          Intégralo en el admin panel para ver todas las métricas en tiempo real.
        </p>
        <Card style={{ textAlign: "left", marginBottom: "20px" }}>
          {["GGR diario y mensual","Total girado vs depositado","House edge real","Top jugadores por rentabilidad","Análisis por juego","Flujo de caja y liquidez"].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "13px", color: T.muted }}>
              <span style={{ color: T.teal }}>✓</span>{f}
            </div>
          ))}
        </Card>
        <Button onClick={() => navigate("/admin")}>← Volver al admin</Button>
      </div>
    </div>
  );
}
