# ☀ Solaris Casino — Frontend

React + Vite · Router · Context API · Diseño oscuro premium

## Estructura

```
src/
├── main.jsx                    ← Punto de entrada
├── App.jsx                     ← Router principal
├── index.css                   ← Estilos globales + animaciones
├── context/
│   ├── AuthContext.jsx         ← Estado global del usuario
│   └── ToastContext.jsx        ← Notificaciones toast
├── services/
│   └── api.js                  ← Cliente API central
├── utils/
│   └── theme.js                ← Colores y constantes
├── components/
│   ├── layout/
│   │   └── AppLayout.jsx       ← Nav + Bottom tabs
│   ├── ui/
│   │   └── index.jsx           ← Button, Input, Modal, Badge, Toggle...
│   └── wallet/
│       └── DepositModal.jsx    ← Modal de depósito
└── pages/
    ├── LoginPage.jsx           ← Login / Registro
    ├── GamesPage.jsx           ← Juegos + todos los demás exports
    ├── BonusesPage.jsx         ← Bonos
    ├── WalletPage.jsx          ← Wallet e historial
    ├── VIPPage.jsx             ← Club VIP
    ├── ProfilePage.jsx         ← Perfil de usuario
    ├── KYCPage.jsx             ← Verificación KYC
    ├── AdminPage.jsx           ← Panel de administración
    ├── ReportsPage.jsx         ← Reportes financieros
    └── NotFoundPage.jsx        ← 404
```

## Instalación y uso

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Correr en desarrollo
npm run dev
# → http://localhost:3000

# 4. Build para producción
npm run build
# → carpeta dist/
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del backend (Railway) |
| `VITE_STRIPE_PK` | Clave pública de Stripe |
| `VITE_APP_NAME` | Nombre del casino |
| `VITE_APP_URL` | URL del casino en producción |

## Rutas disponibles

| Ruta | Descripción |
|---|---|
| `/login` | Página de autenticación |
| `/games` | Lobby de juegos |
| `/bonuses` | Página de bonos |
| `/wallet` | Wallet y depósitos |
| `/vip` | Club VIP |
| `/profile` | Perfil del usuario |
| `/kyc` | Verificación de identidad |
| `/admin` | Panel de administración |
| `/admin/reports` | Reportes financieros |

## Módulos adicionales

Estos archivos se integran por separado:
- `solaris-stripe.jsx` → Pagos reales con Stripe.js
- `solaris-kyc.jsx` → Flujo KYC completo de 5 pasos
- `solaris-reports.jsx` → Reportes financieros avanzados
- `solaris-admin.jsx` → Admin panel completo

## Deploy en Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

O conecta el repo en vercel.com y se despliega automáticamente con cada push.
