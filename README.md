# LiveHero

> A highly engineered, premium digital gallery and marketplace for elite UI components, landing pages, and web applications.

LiveHero is a state-of-the-art full-stack platform designed for creators, developers, and designers seeking uncompromising visual excellence. Replacing generic layouts and standard UI patterns with liquid glass refraction, cinematic typography, and fluid spring-physics micro-interactions, LiveHero operates as an exclusive digital gallery. Users can explore, unlock, preview, and download premium React/Tailwind components and prompts, powered by a robust Express/MongoDB backend with integrated Razorpay monetization and a multi-tier affiliate referral system.

---

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Design System Architecture](#design-system-architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup (Server)](#2-backend-setup-server)
  - [3. Frontend Setup (Client)](#3-frontend-setup-client)
  - [4. Database Seeding](#4-database-seeding)
  - [5. Start Development Servers](#5-start-development-servers)
- [Architecture Overview](#architecture-overview)
  - [Directory Structure](#directory-structure)
  - [Request Lifecycle & Data Flow](#request-lifecycle--data-flow)
  - [Key Core Modules](#key-core-modules)
  - [Database Schema (MongoDB / Mongoose)](#database-schema-mongodb--mongoose)
- [Environment Variables Reference](#environment-variables-reference)
  - [Server (`server/.env`)](#server-serverenv)
  - [Client (`client/.env`)](#client-clientenv)
- [Available Scripts](#available-scripts)
  - [Backend Scripts (`server/package.json`)](#backend-scripts-serverpackagejson)
  - [Frontend Scripts (`client/package.json`)](#frontend-scripts-clientpackagejson)
- [Monetization & Plans](#monetization--plans)
- [Affiliate & Referral System](#affiliate--referral-system)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Deployment Guide](#deployment-guide)
  - [Frontend (Vercel)](#frontend-vercel)
  - [Backend (Render / VPS / Docker)](#backend-render--vps--docker)
- [Troubleshooting & Common Issues](#troubleshooting--common-issues)
- [Contributing](#contributing)
- [License](#license)

---

## Key Features

- **Cinematic Visual Experience:** Built with a custom design system emphasizing liquid glass refraction (`backdrop-blur-md`, rgba borders), asymmetric whitespace, and high-performance Framer Motion spring physics.
- **Component Showcase & Video Previews:** Every component features a mandatory 5-second showcase video hosted via Cloudinary or local fallback, with configurable viewport heights (`h-[240px]` to `h-[450px]`).
- **Multi-Tier Monetization:** Integrated Razorpay payment gateway supporting tiered subscription plans (Starter/Unlimited, Power, Creator) to unlock premium code prompts and components.
- **Creator Ecosystem:** Dedicated roles allowing vetted creators to publish components directly to the live gallery or undergo admin curation.
- **Built-in Affiliate System:** Automated 40% commission tracking with unique referral codes (`LH-XXXXXX`), referral counts, and secure payout accounting.
- **Enterprise Security & Performance:** Hardened Express backend utilizing Helmet, compression, strict CORS reflection, JWT cookie/header authorization, and graceful uncaught exception handling.

---

## Tech Stack

### Frontend (Client)
- **Framework:** React 19 (TypeScript) + Vite
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) + `clsx` + `tailwind-merge`
- **Animation & Motion:** Framer Motion v12 + GSAP v3.14 + React Intersection Observer
- **Icons:** Lucide React
- **Routing:** React Router DOM v7

### Backend (Server)
- **Runtime:** Node.js (Express v5.2)
- **Database & ORM:** MongoDB (Mongoose v9.3)
- **Authentication:** JSON Web Tokens (JWT) + `bcryptjs`
- **Payment Gateway:** Razorpay SDK v2.9
- **Media Management:** Cloudinary v2 + Multer (Disk storage fallback)
- **Security & Utilities:** Helmet, Compression, CORS, `dotenv`

---

## Design System Architecture

LiveHero adheres to strict, premium design principles outlined in `DESIGN.md`. It rejects generic, cookie-cutter SaaS aesthetics in favor of a curated, atmospheric gallery vibe.

- **Atmosphere & Density:** 3/10 Density. High variance, asymmetric whitespace, avoiding predictable 3-column grids.
- **Color Palette:**
  - `Canvas Edge`: `#09090b` / `zinc-950` (Deep dark background)
  - `Surface Elevation`: `#18181b` / `zinc-900` (Cards, dropdowns, sticky navs)
  - `Heroic Spark`: `#0ea5e9` / `sky-500` (Desaturated primary accent)
  - `Liquid Glass`: `rgba(255, 255, 255, 0.05)` with `1px inset border rgba(255, 255, 255, 0.1)` and `backdrop-blur(12px)`
- **Typography:**
  - `Display (H1/H2)`: Instrument Serif or Geist (Track-tight, elegant bold/italic contrast)
  - `Body`: Satoshi or Geist (`max-w-[65ch]`, 1.6 leading)
  - `Monospace`: Geist Mono (Strictly for pricing/developer metadata)
- **Motion Principles:**
  - Framer Motion configured strictly to `type: "spring", stiffness: 100, damping: 20`.
  - GSAP handles full-section scrub scrolls and staggered cinematic reveals.
  - *Rule:* Never animate `width/height` or `top/left`. Animate ONLY `transform` and `opacity`.
- **Anti-Patterns (Strictly Banned):** No emojis in markup, no AI clichés ("Elevate", "Next-Gen", "Seamless"), no generic circular loading spinners (use skeleton shimmers).

---

## Prerequisites

Ensure your local development environment meets the following requirements before proceeding:

- **Node.js:** v20.x or higher (v22+ recommended)
- **Package Manager:** `npm` v10+ (or `pnpm` / `yarn`)
- **Database:** MongoDB instance (Local MongoDB server or MongoDB Atlas Cluster)
- **External Services (Required for full functionality):**
  - Razorpay Account & API Keys (For payment checkout & verification)
  - Cloudinary Account & API Keys (For video/image storage)

---

## Getting Started

Follow these step-by-step instructions to get the complete full-stack application running locally on a fresh machine.

### 1. Clone the Repository

```bash
git clone https://github.com/<your-org>/LiveHero.git
cd LiveHero
```

### 2. Backend Setup (Server)

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory by copying the example or creating a fresh configuration:

```bash
cp .env.example .env
# Or create .env manually
```

Populate `server/.env` with your local/cloud database URI and API keys:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/livehero
JWT_SECRET=livehero_ultra_secret_key_change_in_production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173

# Razorpay Credentials
RAZORPAY_KEY_ID=rzp_test_REPLACE_ME
RAZORPAY_KEY_SECRET=REPLACE_ME

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=do5yfn8cg
CLOUDINARY_API_KEY=332264163251138
CLOUDINARY_API_SECRET=CiMNNkVm5oW5YpPC7ijVY3eyeko
```

### 3. Frontend Setup (Client)

Open a new terminal, navigate to the `client` directory, and install dependencies:

```bash
cd client
npm install
```

*(Optional)* If your frontend requires explicit environment variables for API URLs, create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Database Seeding

To populate your MongoDB instance with initial administrative users, creators, premium plans, and sample showcase components, run the database seed script from the `server` directory:

```bash
cd server
npm run seed
```

*Note: The seed script verifies existing collections, cleans up broken indexes, and inserts fresh sample data with pre-hashed/matched credentials.*

### 5. Start Development Servers

You can run both the frontend and backend development servers concurrently.

**Terminal 1: Start Express Backend Server**
```bash
cd server
npm run dev
```
*The server will start on `http://localhost:5000`. You can verify health at `http://localhost:5000/api/health`.*

**Terminal 2: Start Vite Frontend Server**
```bash
cd client
npm run dev
```
*The client will be accessible at `http://localhost:5173`. Open this URL in your browser.*

---

## Architecture Overview

### Directory Structure

```
LiveHero/
├── client/                     # Frontend React 19 / Vite SPA
│   ├── public/                 # Static public assets (fallback videos, favicons)
│   ├── src/                    # Application source code
│   │   ├── components/         # Reusable UI building blocks (Buttons, Glass Navbar)
│   │   ├── pages/              # Route-level page components (Gallery, Dashboard, Pricing)
│   │   ├── context/            # React Context providers (Auth, Theme, Cart)
│   │   ├── hooks/              # Custom React hooks (useGSAP, useAuth, useIntersection)
│   │   ├── utils/              # Helper utilities (cn, formatting, API clients)
│   │   ├── App.tsx             # Root component & Route definitions
│   │   └── main.tsx            # React DOM entry point
│   ├── vercel.json             # Vercel deployment & rewrite rules
│   ├── vite.config.ts          # Vite bundler configuration
│   └── package.json            # Frontend dependencies & scripts
│
├── server/                     # Backend Express 5 API
│   ├── config/                 # Configuration modules
│   │   └── db.js               # MongoDB Mongoose connection setup
│   ├── controllers/            # Route handler business logic
│   │   ├── authController.js   # Registration, Login, Profile fetching
│   │   ├── componentController.js # Component CRUD, Feed generation, Slot unlocking
│   │   └── paymentController.js   # Razorpay checkout, verification, webhook handling
│   ├── middleware/             # Express route middleware
│   │   ├── auth.js             # JWT verification, Role authorization (`protect`, `authorize`)
│   │   └── async.js            # Async wrapper for clean error handling
│   ├── models/                 # Mongoose Database Schemas
│   │   ├── Component.js        # UI Component schema & indexes
│   │   ├── Transaction.js      # Payment & Payout ledger schema
│   │   └── User.js             # User accounts, referral tracking, unlocked slots
│   ├── routes/                 # Express REST API route definitions
│   │   ├── affiliateRoutes.js  # Affiliate stats & earnings endpoints
│   │   ├── authRoutes.js       # Authentication endpoints
│   │   ├── componentRoutes.js  # Component feed & upload endpoints
│   │   └── paymentRoutes.js    # Razorpay checkout & history endpoints
│   ├── uploads/                # Local disk storage fallback for video showcases
│   ├── seed.js                 # Database seeding & migration utility
│   ├── server.js               # Express application entry point & middleware wiring
│   └── package.json            # Backend dependencies & scripts
│
├── DESIGN.md                   # Core Design System & UI/UX guidelines
└── README.md                   # Master project documentation
```

### Request Lifecycle & Data Flow

```
[User Browser] 
   │ (1. React 19 / Framer Motion UI interaction)
   ▼
[Vite Dev Server / Vercel Edge]
   │ (2. Axios / Fetch HTTP REST Call)
   ▼
[Express 5 Router (`server/server.js`)]
   │ (3. Helmet Security, Compression, CORS validation)
   ▼
[Auth Middleware (`server/middleware/auth.js`)]
   │ (4. Bearer JWT validation & Role-based Access Control)
   ▼
[Controller Logic (`server/controllers/*.js`)]
   │ (5. Business logic execution, Cloudinary upload, Razorpay order creation)
   ▼
[Mongoose ORM (`server/models/*.js`)]
   │ (6. MongoDB Query Execution / Index Lookup)
   ▼
[MongoDB Atlas / Local Instance]
   │ (7. Data persistence & retrieval)
   ▼
(Reverse chain: JSON response back to Client -> State Update -> GSAP/Spring reveal)
```

### Key Core Modules

#### Authentication & Authorization (`authController.js` & `auth.js`)
- Uses Bearer tokens passed via the `Authorization` header.
- `protect` middleware ensures the user exists and attaches `req.user`.
- `authorize(...roles)` restricts endpoints to specific hierarchies (`admin`, `creator`).
- Automatic generation of unique referral codes (`LH-XXXXXX`) on user creation via Mongoose pre-save hooks.

#### Component Management (`componentController.js`)
- Handles uploading 5-second video showcases. Uses Multer for temporary disk buffering before piping to Cloudinary (or retaining locally if Cloudinary is unconfigured).
- Implements strict field filtering: `codePrompt` is stripped from responses for premium components unless the requester is an Admin, the Creator, a Power/Creator subscriber, or has explicitly unlocked the component using a download slot.

#### Payment & Ledger Engine (`paymentController.js`)
- Integrates Razorpay orders API. Creates a pending `Transaction` document upon checkout initiation.
- Upon client-side completion, `verifyPayment` validates the `razorpay_signature` using HMAC SHA-256.
- Grants appropriate membership tiers (`unlimited`, `power`, `creator`), allocates download slots, and calculates 40% affiliate commissions, automatically crediting the referrer's account balance.

### Database Schema (MongoDB / Mongoose)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                  USERS                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ _id                : ObjectId (PK)                                      │
│ name               : String                                             │
│ email              : String (Unique, Indexed)                           │
│ password           : String (Hashed)                                    │
│ role               : String ['user', 'creator', 'admin']                │
│ isPremium          : Boolean (default: false)                           │
│ plan               : String ['free', 'unlimited', 'power', 'creator']   │
│ referralCode       : String (Unique, e.g., LH-A1B2C3)                   │
│ referredBy         : ObjectId (FK -> Users)                             │
│ referralsCount     : Number (default: 0)                                │
│ allowedDownloads   : Number (default: 0)                                │
│ usedDownloads      : Number (default: 0)                                │
│ unlockedComponents : [ObjectId] (FK -> Components)                      │
│ earnings           : Number (Affiliate balance in cents/paise)          │
│ timestamps         : createdAt, updatedAt                               │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ 1:M
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                               COMPONENTS                                │
├─────────────────────────────────────────────────────────────────────────┤
│ _id                : ObjectId (PK)                                      │
│ title              : String (max 100 chars)                             │
│ category           : String ['Landing Page', 'SaaS', 'Portfolio', ...]  │
│ videoUrl           : String (Cloudinary secure_url or local /uploads)   │
│ videoPublicId      : String (Cloudinary public_id for cleanup)          │
│ codePrompt         : String (Premium code or prompt payload)            │
│ isPremium          : Boolean (default: true)                            │
│ creatorId          : ObjectId (FK -> Users, Indexed)                    │
│ downloads          : Number (default: 0)                                │
│ status             : String ['pending', 'approved', 'rejected']         │
│ heightClass        : String ['h-[240px]', ..., 'h-[450px]']             │
│ timestamps         : createdAt, updatedAt                               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              TRANSACTIONS                               │
├─────────────────────────────────────────────────────────────────────────┤
│ _id                : ObjectId (PK)                                      │
│ userId             : ObjectId (FK -> Users, Indexed)                    │
│ type               : String ['purchase', 'referral_payout', ...]        │
│ amount             : Number (Amount in paise/cents)                     │
│ plan               : String ['unlimited', 'power', 'creator']           │
│ razorpayOrderId    : String                                             │
│ razorpayPaymentId  : String                                             │
│ status             : String ['pending', 'completed', 'failed']          │
│ timestamps         : createdAt, updatedAt                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Environment Variables Reference

### Server (`server/.env`)

| Variable | Description | Required | Example / Default |
| :--- | :--- | :---: | :--- |
| `PORT` | Backend Express server listening port | No | `5000` |
| `MONGO_URI` | MongoDB connection string | **Yes** | `mongodb+srv://user:pass@cluster0.mongodb.net/livehero` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | **Yes** | `livehero_ultra_secret_key...` |
| `JWT_EXPIRE` | Expiration timeframe for JWT tokens | No | `30d` |
| `CLIENT_URL` | Allowed frontend origin for CORS / Cookies | **Yes** | `http://localhost:5173` |
| `RAZORPAY_KEY_ID` | Razorpay Gateway Key ID | **Yes** | `rzp_test_REPLACE_ME` |
| `RAZORPAY_KEY_SECRET` | Razorpay Gateway Key Secret | **Yes** | `REPLACE_ME` |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary Cloud Name for media storage | No | `do5yfn8cg` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | No | `332264163251138` |
| `CLOUDINARY_API_SECRET`| Cloudinary API Secret | No | `CiMNNkVm5oW5YpPC7ijVY3eyeko` |

### Client (`client/.env`)

| Variable | Description | Required | Example / Default |
| :--- | :--- | :---: | :--- |
| `VITE_API_BASE_URL` | Base URL pointing to the Express backend API | No | `http://localhost:5000/api` |

---

## Available Scripts

### Backend Scripts (`server/package.json`)

| Command | Description |
| :--- | :--- |
| `npm start` | Starts the Express server in production mode using Node.js (`node server.js`) |
| `npm run dev` | Starts the Express server in development mode with hot-reloading via `nodemon` |
| `npm run seed` | Executes `seed.js` to clear/reset MongoDB collections and populate initial mock/admin data |

### Frontend Scripts (`client/package.json`)

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR) |
| `npm run build`| Compiles TypeScript (`tsc -b`) and bundles the production-ready SPA via Vite |
| `npm run lint` | Runs ESLint across all TypeScript/TSX source files to enforce code quality |
| `npm run preview`| Bootstraps a local static web server to preview the compiled `dist/` production bundle |

---

## Monetization & Plans

LiveHero operates on a tiered pricing architecture managed via Razorpay. Prices are configured in `server/controllers/paymentController.js`.

| Plan Name | Price (INR) | Value (Paise) | Key Benefits & Permissions |
| :--- | :---: | :---: | :--- |
| **Free / Guest** | ₹0 | `0` | Browse gallery, view showcase videos, access free components |
| **Starter (Unlimited)**| ₹19 | `1900` | Unlocks premium status + grants 2 premium component download slots |
| **Power User** | ₹99 | `9900` | Unlimited permanent access to all premium components & prompts |
| **Creator Pro** | ₹129 | `12900` | Unlimited access + upgrades account role to `creator` to publish components |

---

## Affiliate & Referral System

LiveHero includes a highly lucrative, transparent affiliate engine built directly into the core schema:

1. **Code Generation:** Every user receives a unique referral code (`LH-XXXXXX`) automatically generated upon signup.
2. **Attribution:** When a new user registers using a referral code, `referredBy` is permanently attached to their account profile.
3. **Commission Calculation:** Whenever the referred user purchases a premium plan (Starter, Power, Creator), `verifyPayment` intercepts the transaction and calculates a **40% commission**.
4. **Payout Accounting:** The commission is credited to the referrer's `earnings` balance, their `referralsCount` is incremented, and a `referral_earned` transaction record is logged for auditing.
5. **Dashboard Stats:** Creators and affiliates can track their performance in real-time via `GET /api/affiliates/stats`.

---

## Testing & Quality Assurance

### Backend API Verification
You can test the backend API endpoints using tools like Postman, Insomnia, or cURL.

**1. Health Check**
```bash
curl http://localhost:5000/api/health
```
*Expected Output:* `{"status":"alive","timestamp":"2026-05-16T10:00:00.000Z"}`

**2. User Login Test**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"karan@livehero.ai","password":"password123"}'
```

### Frontend Verification
Ensure TypeScript compilation and linting pass without errors before committing changes:

```bash
cd client
npm run lint
npm run build
```

---

## Deployment Guide

### Frontend (Vercel)

The `client` directory includes a pre-configured `vercel.json` file to handle single-page application (SPA) routing rewrites.

1. Install the Vercel CLI or connect your GitHub repository via the Vercel Dashboard.
2. Set the Root Directory to `client`.
3. Configure the Build Command: `npm run build` and Output Directory: `dist`.
4. Add environment variables (`VITE_API_BASE_URL` pointing to your production backend URL).
5. Deploy:

```bash
cd client
vercel --prod
```

**`vercel.json` Configuration:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Backend (Render / VPS / Docker)

#### Option A: Render / PaaS Deployment
1. Connect your repository to Render and create a new **Web Service**.
2. Set the Root Directory to `server`.
3. Set Build Command: `npm install` and Start Command: `npm start`.
4. Add all required environment variables (`MONGO_URI`, `JWT_SECRET`, `RAZORPAY_*`, `CLOUDINARY_*`, `CLIENT_URL`).
5. Deploy. The backend includes global `uncaughtException` handlers to ensure clean logging within Render's dashboard.

#### Option B: Manual VPS Deployment (Ubuntu / Nginx / PM2)
On your Linux server:

```bash
# Clone repository & navigate to server
git clone https://github.com/<your-org>/LiveHero.git
cd LiveHero/server

# Install production dependencies
npm install --production

# Install PM2 process manager globally
sudo npm install -g pm2

# Start backend server with PM2
pm2 start server.js --name "livehero-backend"

# Save PM2 process list to start on system boot
pm2 save
pm2 startup
```

Configure Nginx as a reverse proxy pointing to `http://localhost:5000`.

---

## Troubleshooting & Common Issues

### 1. MongoDB Connection Refused / Timeout
**Error:** `MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster.`
- **Solution:** Verify that your current IP address is whitelisted in the MongoDB Atlas Network Access dashboard (set to `0.0.0.0/0` for dynamic IPs). Ensure your `MONGO_URI` contains the correct password with special characters properly URL-encoded.

### 2. Video Uploads Failing (500 Internal Server Error)
**Error:** `MulterError: File too large` or Cloudinary authentication failure.
- **Solution:** 
  1. Check `server/uploads/` directory permissions. The server attempts to create it automatically, but missing write permissions will cause disk buffering to fail.
  2. Verify your Cloudinary credentials in `server/.env`. If Cloudinary keys are invalid or set to `REPLACE_ME`, the server automatically falls back to local storage (`/uploads/filename`). Ensure your production server persists the `/uploads` volume if using local fallback.

### 3. Razorpay Signature Verification Failed
**Error:** `{"success":false,"message":"Invalid signature"}` during `/api/payments/verify`.
- **Solution:** Ensure `RAZORPAY_KEY_SECRET` in `server/.env` exactly matches the secret key generated in your Razorpay webhook/API dashboard. Do not include leading or trailing whitespace.

### 4. Vite / Tailwind CSS v4 Styling Not Applying
**Error:** Unstyled components or broken glassmorphism classes.
- **Solution:** LiveHero uses Tailwind CSS v4 (`@tailwindcss/vite`). Ensure your Vite dev server is running and `vite.config.ts` correctly invokes the Tailwind plugin. If caching issues occur, clear Vite cache:
```bash
cd client
rm -rf node_modules/.vite
npm run dev
```

### 5. Premium Code Prompts Returning Null
**Error:** `codePrompt` is `null` when inspecting API responses.
- **Solution:** This is intended security behavior. The backend automatically strips `codePrompt` from the payload unless the user is authenticated AND meets one of the following criteria: Admin role, Component Creator, Power User / Creator plan subscriber, or has unlocked the component via `POST /api/components/:id/unlock`.

---

## Contributing

We welcome contributions from the community! To ensure stability and maintain premium design standards:

1. Fork the repository and create a feature branch (`git checkout -b feature/amazing-component`).
2. Adhere strictly to the design system rules in `DESIGN.md` (no generic UI, maintain spring physics, verify glassmorphism contrast).
3. Ensure all new API endpoints are protected with appropriate middleware (`protect`, `authorize`).
4. Run linters and verify the build (`npm run lint && npm run build`).
5. Open a Pull Request with a detailed description and a 5-second video/GIF demonstrating the UI interaction.

---

## License

Distributed under the ISC License. See `LICENSE` for more information.
