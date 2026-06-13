# SabaneraConnect

Plataforma que conecta organizadores de eventos con bandas culturales del Caribe colombiano. Permite buscar bandas, gestionar solicitudes de contratación, chat entre partes, reseñas y pagos en línea.

🔗 **Demo en producción:** [sabaneraconnect.vercel.app](https://sabaneraconnect.vercel.app)

## Stack tecnológico

- **Frontend:** React + Vite — desplegado en Vercel
- **Backend:** Node.js + Express + Prisma 7 (`@prisma/adapter-pg`) — desplegado en Render
- **Base de datos:** PostgreSQL hospedado en Neon
- **Servicios externos:** Cloudinary (multimedia), Resend (correos), Stripe (pagos)

## Estructura del repositorio

- `frontend/` — proyecto React + Vite
- `backend/` — proyecto Node.js + Express + Prisma

## Configuración local

### Requisitos previos

Cuentas activas en: Neon, Cloudinary, Resend y Stripe (modo test).

### Backend

Crea `backend/.env` con las siguientes variables:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
FRONTEND_URL=http://localhost:5173
```

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

### Frontend

Crea `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

```bash
cd frontend
npm install
npm run dev
```

## Estrategia de ramas

- `main` — código estable listo para presentar
- `develop` — rama de integración
- `feature/*` — ramas de trabajo individual

## Convenciones de commits

- `feat:` nueva funcionalidad
- `fix:` corrección de error
- `chore:` configuración o mantenimiento
- `docs:` documentación
