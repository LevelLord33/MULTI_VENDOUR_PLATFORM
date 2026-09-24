# VENDOR HUB
## Multi-Vendor Marketplace Platform — Complete Project Workflow & System Architecture

| Metadata Field | Specification |
| :--- | :--- |
| **Project Status** | Production Ready v2.4 |
| **Tech Stack** | React 18 · Node.js · Express · MongoDB |
| **Document Type** | Comprehensive Technical Workflow & Architecture Specification |
| **Date of Specification** | September 2026 |

---

## 1. Executive Summary & Platform Overview

**Vendor Hub** is an enterprise-grade multi-vendor e-commerce and logistics marketplace engineered to empower local vendors, facilitate real-time warehouse inventory management, enforce strict administrative catalog governance, and deliver a frictionless customer shopping experience across desktop and mobile devices.

Unlike conventional digital storefronts, Vendor Hub is architected **exclusively for physical inventory** with live courier dispatch, verified brand warranties, and tamper-proof delivery handoffs.

> 📌 **Core Value Proposition**:
> Zero-ghost inventory model where every listed SKU represents physically stocked merchandise in verified merchant warehouses, backed by dynamic courier tracking, automated 4-digit doorstep delivery OTPs, and native multilingual support in 6 Indian languages.

### 1.1 Key Business & Technical Objectives

| Objective Area | System Implementation | Key Metric / Outcome |
| :--- | :--- | :--- |
| **Physical Inventory Integrity** | Mandatory warehouse stock tracking & live quantity decrements on checkout | 0% overselling / live stock sync |
| **Admin Governance** | Two-tier product verification queue with rejection audit trails | 100% verified merchant listings |
| **Flexible Checkout & Trust** | Dynamic UPI QR Code + Cash on Delivery with 4-Digit Delivery OTP | Zero prepaid friction & anti-fraud delivery |
| **Regional Accessibility** | Full localization in Tamil, English, Malayalam, Telugu, Kannada, Hindi | Native scripts & 100% UI translation |
| **Modern Visual Experience** | Official website style 1-click Light & Dark mode toggle | Instant theme switching with zero page reload |

---

## 2. System Architecture & Technology Stack

The application employs a decoupled modern architecture combining a reactive client single-page application (SPA) with a lightweight, scalable Node.js/Express REST API backend. The system supports dual-mode database persistence (MongoDB via Mongoose with an automatic resilient in-memory fallback), ensuring uninterrupted operations during development, staging, and production deployments.

### 2.1 Technology Stack Breakdown

| Layer | Technology | Architectural Role |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (Vite Bundler) | Component-driven reactive UI, fast HMR, and tree-shaken builds |
| **Routing & Navigation** | React Router v6 | Role-based guarded routes for Customer, Vendor, and Admin portals |
| **State Management** | React Context API (8 Contexts) | Isolated stores: Auth, Products, Cart, Disputes, i18n, Theme, Compare, Toast |
| **Styling System** | Vanilla CSS + Custom Design Tokens | Modern responsive design tokens, glassmorphism, native dark/light modes |
| **Backend API** | Node.js & Express.js | RESTful micro-controllers handling authentication, orders, inventory, and disputes |
| **Database Layer** | MongoDB + In-Memory Fallback | Document-based persistence for products, merchants, users, and audit logs |
| **Security & Validation** | CORS, JWT & Role Guards | Endpoint isolation, route protection, tamper-proof OTP generation |

### 2.2 Frontend Context & State Hierarchy

Global application state is managed across 8 dedicated React Context Providers organized cleanly in the root tree:

| Context Provider | Scope & State | Key Exposed Methods |
| :--- | :--- | :--- |
| `AuthContext` | User session, credentials & role | `login()`, `register()`, `logout()`, `switchRole()`, `getVendorById()` |
| `ProductContext` | Global physical product catalog | `addProduct()`, `updateProduct()`, `approveProduct()`, `rejectProduct()` |
| `CartContext` | Cart items, checkout & orders | `addToCart()`, `updateCartQuantity()`, `placeOrder()`, `getCustomerOrders()` |
| `DisputeContext` | Post-delivery disputes & claims | `fileDispute()`, `resolveDispute()`, `updateDisputeStatus()` |
| `LanguageContext` | 6-language i18n dictionary | `setLanguage()`, `t(key, fallback)`, `currentLangMeta` |
| `ThemeContext` | Light / Dark theme engine | `toggleTheme()`, `setTheme()`, `isDark`, `isLight` |
| `ComparisonContext` | Multi-product side-by-side comparison | `toggleCompare()`, `clearCompare()`, `removeFromCompare()` |
| `ToastContext` | Interactive notification system | `addToast(message, type)`, `removeToast()` |

---

## 3. User Roles, Portals & Permissions Matrix

Vendor Hub enforces strict separation of concerns across three dedicated portals accessible directly via topstrip chips or authenticated route transitions:

| Role | Portal Route | Primary Responsibilities | Access Permissions |
| :--- | :--- | :--- | :--- |
| **Customer** | `/shop`, `/shop/cart`, `/shop/orders` | Browse catalog, compare items, checkout with UPI/COD, track courier, raise disputes | Public / Authenticated customer session |
| **Vendor** | `/vendor/dashboard`, `/vendor/products` | Onboard storefront, list physical SKUs, manage stock, dispatch orders, view revenue | Verified merchant login with GSTIN & business profile |
| **Admin** | `/admin/dashboard`, `/admin/products` | Audit physical catalog listings, approve/reject products, mediate disputes, govern merchants | Superuser administrator credentials |

---

## 4. End-to-End Workflow Lifecycles

### 4.1 Vendor Registration, Onboarding & Product Listing Workflow
1. **Storefront Registration**: The vendor registers with their business name, contact person, email, phone, GSTIN tax identifier, and physical pickup address.
2. **Merchant Catalog Creation**: The vendor accesses the *Add Physical Product* portal, specifying:
   - Product Title, Brand Name, Physical SKU Code, and Master Category.
   - Price (₹) and Maximum Retail Price (MRP) to compute dynamic discount badges.
   - Initial Physical Warehouse Stock Count (with automatic low-stock badge thresholds).
   - Shipping Specifications: Package dimensions, dispatch window ("Ships in 24 hours"), and warranty duration.
   - Variant Configurations: Selectable color swatches with hex codes and option sizes/configurations.
3. **Initial Submission State**: Upon form submission, the product is assigned a status of `Pending` and placed into the Administrative Verification Queue.

### 4.2 Administrative Verification & Governance Workflow
1. **Real-Time Inspection**: Platform administrators access the *Admin Products* queue displaying all unverified merchant submissions.
2. **Compliance & Quality Check**: The administrator examines high-resolution product imagery, SKU uniqueness, realistic pricing, and physical warranty validity.
3. **Decision Branch**:
   - **Approval**: Setting status to `Approved`. The product instantly becomes visible to all customers across the marketplace.
   - **Rejection**: Setting status to `Rejected` with mandatory administrator feedback notes explaining why the listing was disapproved.
4. **Merchant Notification**: The merchant dashboard immediately reflects the approval or rejection badge with audit timestamps.

### 4.3 Customer Shopping, Multi-Facet Filters & Product Comparison
1. **Category Navigation**: Customers browse across 7 top-level categories (*All, Electronics, Fashion, Grocery, Home & Living, Sports, Beauty*).
2. **Smart Filtering Pipeline**:
   - **Live Search**: Instant search across names, brands, descriptions, and SKUs with keyboard shortcuts (`/` to search, `Esc` to clear).
   - **In-Stock Filter**: One-click toggle filtering out warehouse items with zero physical stock.
   - **Fast Courier Dispatch**: Filters items flagged with *Ships in 24 hours* priority courier dispatch.
   - **Sorting Engine**: Sort by Newest Arrivals, Price: Low to High, Price: High to Low, or Top Customer Rated.
3. **Side-by-Side Product Comparison**: Customers can select 2 to 4 products across any vendor to compare side-by-side specs, price variations, warranties, and stock levels in a floating comparison drawer.

### 4.4 Cart, Courier Selection & Multi-Option Payment Gateway
1. **Cart Consolidation**: Items added to the cart preserve selected variant colors, sizing options, and real-time inventory quantity caps.
2. **Courier Dispatch Method Selection**:
   - **Delhivery Surface Express**: Standard nationwide dispatch (Est. 3-5 business days; Free for orders over ₹999).
   - **BlueDart Priority Air**: Guaranteed express courier dispatch (Est. 1-2 business days; ₹199 flat).
3. **Multi-Mode Payment Options**:
   - **Option A: Dynamic UPI & QR Code**: Auto-generates an interactive UPI QR code encoded with merchant VPA and order amount. Includes 1-click VPA copy, 10-minute validity countdown timer, and banking gateway simulation.
   - **Option B: Cash on Delivery (COD) with 4-Digit Delivery OTP**: Generates a tamper-proof 4-digit security OTP upon order placement. Customers are instructed to share this OTP with the delivery executive only after verifying the package at their doorstep.
   - **Option C: Credit / Debit Cards & NetBanking**: 256-bit SSL encrypted card processing simulator compliant with PCI-DSS guidelines.

> 📌 **Anti-Fraud Doorstep Security**:
> The Cash on Delivery (COD) workflow features an automated 4-digit Delivery OTP generated upon order creation. The customer shares this OTP with the delivery executive only after physically inspecting the outer package carton, eliminating delivery fraud and parcel tampering.

### 4.5 Courier Logistics, Real-Time Tracking & Fulfillment
Upon order placement, the system transitions orders through a 5-stage physical fulfillment lifecycle:
1. **Stock Reserved (Placed)**: Inventory is decremented from the merchant's physical warehouse count.
2. **Packaging Verified (Confirmed)**: The merchant prints the invoice and packs the item in barcode-scanned cartons.
3. **In Transit with Courier (Dispatched)**: Assigned an authentic Indian logistics tracking number (e.g. `DEL-8492019`).
4. **Out for Delivery**: The courier reaches the local delivery hub and initiates final-mile delivery.
5. **Physically Delivered**: Handed over to the recipient upon OTP verification (COD) or signature confirmation (Prepaid).

### 4.6 Post-Purchase Returns, Warranty Claims & Dispute Resolution
1. **Dispute Filing**: Customers can raise an official dispute from their *My Orders* portal for issues like transit damage, defective goods, or wrong item delivery.
2. **Resolution Paths**: Customers request either an immediate courier replacement or a full payment refund.
3. **Tri-Party Mediation**: Admin, Vendor, and Customer interact through the Dispute Management portal with resolution timestamps and settlement audit trails.

---

## 5. Cross-Cutting Capabilities: Localization & Theme Engine

### 5.1 6-Language Internationalization (i18n) Architecture
The application features a complete internationalization dictionary architecture supporting 6 languages with native script typography:

| Code | Language | Native Script | Coverage Areas |
| :--- | :--- | :--- | :--- |
| `en` | English | English 🇬🇧 | Topstrip, Navbar, Catalog, Cart, Checkout, Tracking, Admin |
| `ta` | Tamil | தமிழ் 🇮🇳 | 100% UI translation, Category labels, Buttons, COD Notices |
| `ml` | Malayalam | മലയാളം 🇮🇳 | 100% UI translation, Cart summaries, Courier labels, Disputes |
| `te` | Telugu | తెలుగు 🇮🇳 | 100% UI translation, Payment methods, Stock statuses, Navbar |
| `kn` | Kannada | ಕನ್ನಡ 🇮🇳 | 100% UI translation, Filters, Product descriptions, Orders |
| `hi` | Hindi | हिन्दी 🇮🇳 | 100% UI translation, Search bar, Delivery forms, Review modals |

### 5.2 Official Website Light / Dark Theme Engine
The theme engine follows the design pattern of official modern engineering platforms (e.g. Vite, GitHub, Tailwind):
- **1-Click Interactive Switch**: A pill switch located in the navbar containing a sliding circular thumb with animated ☀️ Sun and 🌙 Moon icons.
- **Light Mode**: Soft slate background (`#F8F9FC`), pure white surfaces (`#FFFFFF`), crisp dark slate typography (`#0F172A`), and subtle shadows.
- **Dark Mode**: Deep midnight slate background (`#0B0F19`), dark card surfaces (`#1E293B`, `#111827`), high-contrast light text (`#F9FAFB`), and muted borders (`#374151`).
- **Instantaneous DOM Injection**: Seamlessly updates CSS custom properties on `:root` and toggles the `data-theme` attribute with 0.28s spring transitions and zero reload.
- **Session Persistence**: User preference is stored in `localStorage` under `vh_theme` and syncs across browser tabs.

---

## 6. Data Models & Entity Schema Design

The platform schema captures rich entity relationships between merchants, catalog SKUs, customer orders, and disputes:

| Entity Model | Key Attributes & Data Fields | Business Rules & Constraints |
| :--- | :--- | :--- |
| **Product** | `id`, `name`, `brand`, `sku`, `category`, `price`, `mrp`, `stock`, `status` (`'Pending'\|'Approved'\|'Rejected'`), `variants`, `shipping`, `images` | Price <= MRP; Stock >= 0; SKU must be unique per merchant; Approval required to display on `/shop` |
| **Vendor** | `id`, `businessName`, `email`, `phone`, `gstin`, `address`, `rating`, `active`, `commissionRate`, `totalRevenue` | GSTIN validation; Business name uniqueness; Rating computed from approved customer reviews |
| **Order** | `id`, `customerId`, `items`, `subtotal`, `shippingFee`, `total`, `shippingMethod`, `paymentMethod` (`'UPI_QR'\|'COD'\|'CARD'`), `status`, `trackingNumber`, `deliveryOtp` | `deliveryOtp` generated only for COD orders; stock decremented upon creation; `trackingNumber` auto-assigned |
| **Dispute** | `id`, `orderId`, `customerId`, `vendorId`, `reason`, `actionRequested` (`'replacement'\|'refund'`), `status` (`'Open'\|'Under Review'\|'Resolved'`), `adminNotes` | Can only be filed for Delivered physical orders; 7-day replacement window enforcement |

---

## 7. Security, Integrity & Validation Safeguards

1. **Anti-Tampering Delivery Protection**: COD orders generate an isolated 4-digit verification token saved securely in order state. Delivery is only marked complete once verified.
2. **Real-Time Inventory Locking**: When items are purchased, available stock count is validated and locked in real time to prevent double-allocation during high-concurrency flashes.
3. **Role-Based Route Guards**: React Router guards prevent unauthenticated or non-vendor accounts from accessing administrative and merchant store controls.
4. **Sanitized Input Parsing**: Search queries and user reviews are trimmed and sanitized to prevent XSS injection attacks across the client DOM.
5. **Encrypted Client Storage**: User tokens and session preferences are stored using isolated `localStorage` keys with error-handled JSON parsers.

---

## 8. Deployment Verification & Future Roadmap

- **Production Build Command**: `npm run build` (Compiled via Vite with 0 syntax errors or broken dependencies).
- **Development Server**: `npm run dev` (Running on `http://localhost:5173/` with instant Hot Module Replacement).
- **Backend Server**: `npm run server` (Express API listening on port 5000 with MongoDB connection pooling).

### 8.1 Strategic Enhancement Roadmap

| Phase | Target Feature | Technical Scope |
| :--- | :--- | :--- |
| **Phase 1 (Complete)** | Multi-Vendor Marketplace Core | Physical catalog, Vendor portal, Admin verification, Multi-product comparison |
| **Phase 2 (Complete)** | Payment & Doorstep Security | Dynamic UPI QR code, Cash on Delivery with 4-Digit Delivery OTP, Courier tracking |
| **Phase 3 (Complete)** | Localization & Theme Engine | 6 Indian languages (ta, ml, te, kn, hi, en) and official Light/Dark toggle switch |
| **Phase 4 (Future)** | Real Logistics API Webhooks | Direct webhooks with Delhivery & BlueDart API for automated shipment dispatch & live SMS alerts |
| **Phase 5 (Future)** | Automated Vendor Payouts | Automated UPI AutoPay & Escrow settlement release upon doorstep delivery confirmation |
