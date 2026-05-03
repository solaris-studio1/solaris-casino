// src/context/ToastContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import { T } from "../utils/theme";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((msg, type = "success", duration = 3500) => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), duration);
  }, []);

  const success = useCallback((msg) => show(msg, "success"), [show]);
  const error   = useCallback((msg) => show(msg, "error"),   [show]);
  const info    = useCallback((msg) => show(msg, "info"),    [show]);

  return (
    <ToastContext.Provider value={{ show, success, error, info }}>
      {children}
      {/* Toast container */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
        display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: "12px 20px", borderRadius: "12px", fontSize: "13px",
            fontWeight: 700, color: "#fff", maxWidth: "320px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            animation: "toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            background:
              t.type === "error"   ? `linear-gradient(135deg,#7f0020,${T.red})`   :
              t.type === "info"    ? `linear-gradient(135deg,#1e3a5f,${T.blue})`  :
              `linear-gradient(135deg,#064e3b,#10b981)`,
          }}>
            {t.msg}
          </div>
        ))}
      </div>
      <style>{`@keyframes toastIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
