# College Club Management System — Frontend

Modern, responsive university portal interface built with **React 18**, **Vite**, and **Tailwind CSS**. Designed following the **Classic University Aesthetic** (Deep Navy, Forest Green, Warm Ivory, and Muted Gold).

## 🚀 Features

- **Public Campus Hub:** Club directory, event calendar, landing page telemetry, and organization discovery.
- **Student Dashboard:** Club memberships, event RSVPs, verified attendance records, announcements feed, and post-event rating reviews.
- **Club Administrator Console:** Application review workflow, event scheduler, attendance verification, and club announcement broadcasting.
- **Institutional Governance:** System metrics with Recharts analytics, user directory role management, club charters, and security audit logs.
- **Authentication & Security:** JWT tokens with automatic Axios refresh interceptors, role-based routing guards (`STUDENT`, `CLUB_ADMIN`, `SYSTEM_ADMIN`).

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Data Visualizations:** Recharts
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form + Zod
- **Animations:** Framer Motion

## 📦 Getting Started

### Prerequisites
- Node.js 18+ and npm 9+

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Runs at [http://localhost:5173](http://localhost:5173). Requests to `/api` are automatically proxied to the backend at `http://localhost:8080`.

### Production Build
```bash
npm run build
```
Builds the static application to the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## 🐳 Docker Deployment

A multi-stage Dockerfile using Nginx Alpine is included:
```bash
docker build -t club-management-frontend .
docker run -p 80:80 club-management-frontend
```

## 📄 License
MIT
