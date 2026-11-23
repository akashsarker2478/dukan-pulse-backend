# DokanPulse — Multi-Tenant Retail POS, Inventory & Credit (Due) Management SaaS

> Smart POS, Real Profit & Due Tracking for Local Businesses. Built as a production-grade, secure multi-tenant B2B SaaS platform.

---

## 🚀 Key Architectural Highlights & Tech Stack

* **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, Dual-Language (EN / বাংলা) Toggle via JSON Dictionaries.
* **Backend:** Express.js, TypeScript, Node.js.
* **Database & ORM:** PostgreSQL, Prisma ORM (with ACID-compliant `$transaction` for POS stock safety).
* **Authentication & Security:** JWT-based hybrid token system (Access Tokens in body, Refresh Tokens in `HttpOnly` cookies) with Role-Based Access Control (SUPER_ADMIN, MERCHANT, STAFF).
* **AI Integration:** Gemini AI API for smart product entry assistance and business insights.

---

## 👥 User Roles & Access Control (RBAC)

1. **SUPER_ADMIN:** Platform gatekeeper. Manages merchant accounts and store onboarding requests. Has no visibility into private store inventories, buy prices, or net profits.
2. **MERCHANT:** Store owner. Manages multiple stores, creates staff/cashiers, and views complete business analytics and net profit.
3. **STAFF:** Cashier/Salesman. Operates the store POS counter. Restricted from viewing product buy prices or store net profits.

---

## 🗄️ Database Schema Overview (7 Core Tables)

* **users:** Manages multi-role users (SUPER_ADMIN, MERCHANT, STAFF) and statuses (PENDING, ACTIVE, BLOCKED).
* **stores:** Multi-tenant store entities tied to merchant owners with individual approval statuses.
* **categories:** Product categorization mapped per store.
* **products:** Inventory items with `buyPrice`, `sellPrice`, stock levels, and low-stock thresholds.
* **orders:** POS sales invoices tracking subtotal, VAT, discount, payment methods, and due tracking (`dueDate`, `dueAmount`).
* **order_items:** Line items per order capturing historical `unitBuyPrice` and `unitSellPrice`.
* **notifications:** Unified notification center for store requests, approval updates, due alerts, and low-stock warnings.

---
## 📡 Implemented API Endpoints

**Base URL:** `/api/v1`

### **Authentication (`/api/v1/auth`)**
- `POST /api/v1/auth/register-merchant` - Register a new merchant account and initialize store
- `POST /api/v1/auth/login` - Authenticate user and issue Access & Refresh tokens
- `GET /api/v1/auth/me` - Get user profile route.
- `POST /api/v1/auth/refresh-token` — Verifies the `refreshToken` cookie, checks user account status, and issues a new `accessToken` cookie.
- `POST /api/v1/auth/logout` — Clears `accessToken` and `refreshToken` cookies to log out the user.

### **Store Management (`/api/v1/stores`)**
- `POST /api/v1/stores` - Submit a new store creation request (`status: PENDING`) *(Merchant only)*

- `GET /api/v1/stores/my` - Retrieve logged-in merchant's stores with optional status filtering (`?status=PENDING|ACTIVE|BLOCKED`) *(Merchant only)*
- `PATCH /api/v1/stores/:id` - Update store settings (`name`, `address`, `phone`, `logo`, `vatRate`) with ownership check *(Merchant only)*

- `GET /api/v1/stores/:id` - Retrieve a single store's details by ID with ownership verification *(Merchant only)*

### **Admin Moderation (`/api/v1/admin`)**
- `GET /api/v1/admin/merchants` - Retrieve all merchants with optional status filtering (`?status=PENDING|ACTIVE|BLOCKED`) *(Super Admin only)*

- `PATCH /api/v1/admin/merchants/:id/status` - Approve (`ACTIVE`) or block (`BLOCKED`) a merchant and synchronize their store status *(Super Admin only)*

- `GET /api/v1/admin/stores` - Retrieve all stores with optional status filtering (`?status=PENDING|ACTIVE|BLOCKED`) and owner details *(Super Admin only)*

- `PATCH /api/v1/admin/stores/:id/status` - Update store status to `ACTIVE` or `BLOCKED` (requires owner to be `ACTIVE` when activating) and return `previousStatus` *(Super Admin only)*

### **Category Management (`/api/v1/stores/:storeId/categories`)**
- `POST /api/v1/stores/:storeId/categories` - Create a new category within a store with unique name check per store (`@@unique([storeId, name])`) and active store/user access verification *(Merchant or Staff)*
- `GET /api/v1/stores/:storeId/categories` - Retrieve all categories belonging to a specific store with store access and active status verification *(Merchant or Staff)*

## 📂 Project Structure

```text
src/
├── app/
│   ├── modules/            # Modular architecture (auth, stores, products, orders, dues, admin)
│   └── middlewares/        # Auth guards, RBAC, and error handlers
├── config/                 # Centralized environment configurations
├── shared/                 # Reusable utilities (catchAsync, sendResponse, jwtHelper)
├── app.ts                  # Express application setup
└── server.ts               # Server entry point & database connection
```

---

## ⚙️ Getting Started & Installation

### **1. Clone the repository**
```bash
git clone <https://github.com/akashsarker2478/dukan-pulse-backend.git>
cd dukanpulse-backend
```

### **2. Install dependencies**
```bash
npm install
```

### **3. Configure Environment Variables**
Create a `.env` file in the root directory and add the following:
```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/dokan_pulse?schema=public"
NODE_ENV=development
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
```

### **4. Run migrations & start server**
```bash
npx prisma migrate dev
npm run dev
```

---

## 📄 License & Contributing

* **License:** Developed as a production-grade B2B SaaS platform. All rights reserved.
* **Contributing:** Contributions, issues, and feature requests are welcome!

---

*Built with ❤️ for local retail businesses.*