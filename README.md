## 🎯 Features

✅ **6-Step User Flow** (PDF exact match):
```
Home → Delivery Address → Configuration → Login → Checkout → Thank You
```

✅ **Real Backend Integration**:
- Distance calculation from company (Reutlingen 72762) to customer PLZ
- Local newspaper editions based on PLZ region
- Mock customer + subscription database

✅ **Dynamic Pricing** (real-time preview):
- Distance-based delivery premiums
- Daily vs Weekend editions
- Monthly vs Annual (10% discount)

✅ **Production-ready**:
- TypeScript + Next.js 14 App Router
- Tailwind CSS + Component library
- Form validation + Error handling
- Mobile-responsive design

## 🏗️ Architecture

```
src/
├── app/                 # Next.js App Router
│   ├── (main)/          # Route group
│   │   ├── page.tsx     # Home (/)
│   │   ├── delivery-address/page.tsx
│   │   ├── configuration/page.tsx
│   │   ├── login/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── thank-you/page.tsx
├── context/             # React Context API state
├── utils/pricing.ts     # Price calculation logic
├── api/                 # Backend mock (Api.js + Database.js)
└── components/          # Reusable UI components
```

## 📊 Business Logic Details

### 1. **Distance Calculation**
```
Company HQ: Reutlingen (PLZ 72762)

Algorithm (Database.js):
1. If customer PLZ == 72762 → 0 km
2. Lookup coordinates for both PLZs in plzToCoordinates (~6k German PLZs)
3. Haversine formula: Great-circle distance in km
4. Unknown PLZ → 0 km fallback

Examples:
- PLZ 70173 (Stuttgart) → ~20.5 km  
- PLZ 01945 → ~550 km
- PLZ 5020 → 0 km (not in DB)
```

### 2. **Local Editions by PLZ** (Database.js)
```
localpaperversions:
1. Stadtausgabe
2. Sportversion  
3. Landkreisinfos

PLZ First Digit Rules:
0,1,2 → Stadtausgabe + Sportversion
3,4,5 → Stadtausgabe only
6+    → All editions
```

### 3. **Dynamic Pricing** (utils/pricing.ts)
```
Base Monthly:
Daily:  €30.00
Weekend: €15.00

Distance Factors:
0km:     ×1.0
0-50km:  ×1.1
50-200km:×1.3  
>200km:  ×1.6

Annual: 10% discount vs 12×monthly

Example (PLZ 70173, 20km, Daily, Annual):
€30 × 1.1 = €33.00/month
€33 × 12 × 0.9 = €356.40/year
```

### 4. **Simulated Flows**
```
Login: Email + Password → Always success (no real auth)
Payment: Direct debit only (IBAN validation: DE + 20 digits)
Database: Mock CRUD ready (saveCustomer, saveAboForCustomer)
```

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/ab-3333/newspaper-subscription-next.git
cd newspaper-subscription-next

# Install
npm install

# Run
npm run dev

# Open http://localhost:3000
```

## 🧪 Test Full Flow

```
1. Home → "Start Your Subscription"
2. Delivery: PLZ 70173 (Stuttgart) → Distance 20km → Stadtausgabe edition
3. Config: Daily + Annual → Price updates live (€33→€356.40)
4. Login: any@email.com / password123
5. Checkout: IBAN DE89370400440532013000 + Mandate
6. Thank You: Order confirmed
```

## 🛠️ Tech Stack

| Frontend | Next.js 14 (App Router) + React 18 + TypeScript |
|----------|------------------------------------------------|
| Styling  | Tailwind CSS + Component library |
| State    | React Context API |
| Routing  | Next.js file-based |
| Backend  | Mock API (Api.js + Database.js) |
| Form     | React Hook Form principles |

## 📈 Production Build

```bash
npm run build
npm start
```