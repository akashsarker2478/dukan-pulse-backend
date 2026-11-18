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

---

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