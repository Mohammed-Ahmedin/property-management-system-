# Kuru Rent — Property Management System

A full-stack property booking and management platform for hotels, guest houses, apartments, and villas. Built for property owners, brokers, staff, and guests.

<div align="center">

[![Client Site](https://img.shields.io/badge/🌐%20Client%20Site-Live%20Demo-4CAF50?style=for-the-badge)](https://property-booking-project-ui9i.vercel.app)
[![Admin Panel](https://img.shields.io/badge/🛠️%20Admin%20Panel-Live%20Demo-1a4a2e?style=for-the-badge)](https://property-management-system-s61h.vercel.app)

</div>

---

## Overview

Kuru Rent is a multi-role property management system with a public-facing booking site and a full-featured admin panel. It supports property listings, room management, online bookings with payment integration, staff and broker management, and an AI-powered assistant.

## Live Demo

| App | URL |
|-----|-----|
| 🌐 Client Site | [property-booking-project-ui9i.vercel.app](https://property-booking-project-ui9i.vercel.app) |
| 🛠️ Admin Panel | [property-management-system-s61h.vercel.app](https://property-management-system-s61h.vercel.app) |
| ⚙️ Backend API | [property-management-system-u4qy.onrender.com](https://property-management-system-u4qy.onrender.com) |

### Admin Demo Credentials
```
Email:    admin@example.com
Password: A123456a
```

---

## Features

### Client Site
- Browse and search properties by location, type, and price
- View property details, rooms, gallery, and nearby places
- Online booking with Chapa payment integration
- User registration (Owner / Broker) with document upload
- Account management — bookings, profile, settings
- AI-powered booking assistant (Kuru Rent AI)
- Bilingual support (English / Amharic)
- Favorites / saved properties

### Admin Panel
- Dashboard with booking, revenue, and activity stats
- Property management (create, edit, approve, manage rooms)
- Booking management with manual booking support
- User management — view, edit, ban, verify, add users
- Registration request review with document verification
- Staff and broker management
- Commission and income tracking
- Real-time messaging
- Site customization (logo, social links, contact info, hero text)
- Activity log
- AI management assistant (Kuru Rent AI)

---

## Tech Stack

### Frontend (Client Site)
- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** + **shadcn/ui**
- **Redux Toolkit** — state management
- **TanStack Query** — data fetching
- **React Router** — routing

### Frontend (Admin Panel)
- **Next.js 15** + **TypeScript**
- **TailwindCSS** + **shadcn/ui**
- **TanStack Query** — data fetching
- **Recharts** — analytics charts
- **Better Auth** — authentication

### Backend
- **Node.js** + **Express 5** + **TypeScript**
- **Prisma ORM** + **PostgreSQL** (Neon)
- **Better Auth** — auth with session management
- **Socket.io** — real-time messaging
- **Cloudinary** — image and document storage
- **Chapa** — payment processing
- **Nodemailer** — email notifications
- **Google Gemini AI** — AI assistant

---

## Project Structure

```
├── admin/          # Next.js admin panel
├── web/            # React client site (Vite)
└── backend/        # Express API server
    └── prisma/     # Database schema and migrations
```

---

## Local Setup

### Prerequisites
- Node.js 22+
- PostgreSQL database (or Neon account)

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your env vars
npm run db:push
npm run dev
```

### Admin Panel
```bash
cd admin
npm install
npm run dev            # runs on http://localhost:4000
```

### Client Site
```bash
cd web
npm install
npm run dev            # runs on http://localhost:5173
```

### Environment Variables

**Backend** (`backend/.env`):
```
DATABASE_URL=
BETTER_AUTH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CHAPA_SECRET_KEY=
SMTP_USER=
SMTP_PASS=
GOOGLE_GEMINI_API_KEY=
ADMIN_FRONTEND_URL=http://localhost:4000
CLIENT_FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:3000
```

**Admin** (`admin/.env`):
```
NEXT_PUBLIC_SERVER_BASE_URL=http://localhost:3000
GOOGLE_GEMINI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Client** (`web/.env`):
```
VITE_SERVER_BASE_URL=http://localhost:3000
```

---

## User Roles

| Role | Description |
|------|-------------|
| **ADMIN** | Full system access — manage all users, properties, bookings, settings |
| **OWNER** | Manage their own properties and rooms |
| **BROKER** | Manage assigned properties, view clients and bookings |
| **STAFF** | Limited property management access |
| **GUEST** | Browse and book properties |

---

## Deployment

- **Admin Panel** — Vercel
- **Client Site** — Vercel
- **Backend** — Render
- **Database** — Neon (PostgreSQL)
- **Media Storage** — Cloudinary
