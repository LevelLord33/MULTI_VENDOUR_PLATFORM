import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def add_callout(doc, title, text, bg_hex="EEF2FF", border_hex="4F46E5"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_hex)
    set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="{border_hex}"/>'
        f'<w:top w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    run_title = p.add_run(f"📌 {title}: ")
    run_title.bold = True
    run_title.font.size = Pt(10.5)
    run_title.font.color.rgb = RGBColor(0x37, 0x30, 0xA3)
    
    run_text = p.add_run(text)
    run_text.font.size = Pt(10)
    run_text.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def format_table(tbl, col_widths, headers, data, header_bg="3730A3", alt_bg="F9FAFB"):
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    hdr_cells = tbl.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], header_bg)
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=140, right=140)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            run.font.size = Pt(9.5)
            
    for row_idx, row_data in enumerate(data):
        row_cells = tbl.add_row().cells
        bg = alt_bg if row_idx % 2 == 1 else "FFFFFF"
        for i, val in enumerate(row_data):
            row_cells[i].text = str(val)
            set_cell_background(row_cells[i], bg)
            set_cell_margins(row_cells[i], top=100, bottom=100, left=140, right=140)
            p = row_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.size = Pt(9)
                run.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
                
    for row in tbl.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = Inches(width)

def build_workflow_document():
    doc = Document()
    
    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.9)
        section.right_margin = Inches(0.9)
        
    # Default typography
    style_normal = doc.styles['Normal']
    font_normal = style_normal.font
    font_normal.name = 'Calibri'
    font_normal.size = Pt(10.5)
    font_normal.color.rgb = RGBColor(0x1F, 0x29, 0x37)
    
    # ── COVER / TITLE HEADER ──
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(36)
    p_title.paragraph_format.space_after = Pt(6)
    r_title = p_title.add_run("VENDOR HUB")
    r_title.bold = True
    r_title.font.size = Pt(28)
    r_title.font.color.rgb = RGBColor(0x31, 0x2E, 0x81) # Deep Indigo
    
    p_subtitle = doc.add_paragraph()
    p_subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_subtitle.paragraph_format.space_before = Pt(0)
    p_subtitle.paragraph_format.space_after = Pt(18)
    r_sub = p_subtitle.add_run("Multi-Vendor Marketplace Platform — Complete Project Workflow & System Architecture")
    r_sub.font.size = Pt(13)
    r_sub.font.color.rgb = RGBColor(0x4B, 0x55, 0x63)
    
    # Meta badge table
    meta_tbl = doc.add_table(rows=1, cols=3)
    meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cols = [Inches(2.1), Inches(2.1), Inches(2.1)]
    meta_cells = meta_tbl.rows[0].cells
    meta_items = [
        ("PROJECT STATUS", "Production Ready v2.4"),
        ("TECH STACK", "React 18 · Express · Node · MongoDB"),
        ("DOCUMENT TYPE", "Technical Workflow Specification")
    ]
    for idx, (label, val) in enumerate(meta_items):
        meta_cells[idx].width = cols[idx]
        set_cell_background(meta_cells[idx], "F1F5F9")
        set_cell_margins(meta_cells[idx], top=80, bottom=80, left=100, right=100)
        p = meta_cells[idx].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r1 = p.add_run(f"{label}\n")
        r1.font.size = Pt(7.5)
        r1.bold = True
        r1.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)
        r2 = p.add_run(val)
        r2.font.size = Pt(9.5)
        r2.bold = True
        r2.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        
    doc.add_paragraph().paragraph_format.space_after = Pt(16)
    
    # ── SECTION 1: EXECUTIVE SUMMARY ──
    h1 = doc.add_heading(level=1)
    r_h1 = h1.add_run("1. Executive Summary & Platform Overview")
    r_h1.bold = True
    r_h1.font.size = Pt(16)
    r_h1.font.color.rgb = RGBColor(0x31, 0x2E, 0x81)
    
    p = doc.add_paragraph()
    p.add_run(
        "Vendor Hub is an enterprise-grade multi-vendor e-commerce and logistics marketplace engineered to empower local vendors, "
        "facilitate real-time warehouse inventory management, enforce strict administrative catalog governance, and deliver a frictionless "
        "customer shopping experience across desktop and mobile devices. Unlike conventional digital storefronts, Vendor Hub is architected "
        "exclusively for physical inventory with live courier dispatch, verified brand warranties, and tamper-proof delivery handoffs."
    )
    
    add_callout(
        doc,
        "Core Value Proposition",
        "Zero-ghost inventory model where every listed SKU represents physically stocked merchandise in verified merchant warehouses, "
        "backed by dynamic courier tracking, automated 4-digit doorstep delivery OTPs, and native multilingual support in 6 Indian languages."
    )
    
    # Key Objectives Table
    doc.add_heading(level=2).add_run("1.1 Key Business & Technical Objectives")
    obj_tbl = doc.add_table(rows=1, cols=3)
    format_table(
        obj_tbl,
        [1.8, 2.5, 2.2],
        ["Objective Area", "System Implementation", "Key Metric / Outcome"],
        [
            ("Physical Inventory Integrity", "Mandatory warehouse stock tracking & live quantity decrements on checkout", "0% overselling / live stock sync"),
            ("Admin Governance", "Two-tier product verification queue with rejection audit trails", "100% verified merchant listings"),
            ("Flexible Checkout & Trust", "Dynamic UPI QR Code + Cash on Delivery with 4-Digit Delivery OTP", "Zero prepaid friction & anti-fraud delivery"),
            ("Regional Accessibility", "Full localization in Tamil, English, Malayalam, Telugu, Kannada, Hindi", "Native scripts & 100% UI translation"),
            ("Modern Visual Experience", "Official website style 1-click Light & Dark mode toggle", "Instant theme switching with zero page reload")
        ]
    )
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # ── SECTION 2: SYSTEM ARCHITECTURE & TECH STACK ──
    h2 = doc.add_heading(level=1)
    r_h2 = h2.add_run("2. System Architecture & Technology Stack")
    r_h2.bold = True
    r_h2.font.size = Pt(16)
    r_h2.font.color.rgb = RGBColor(0x31, 0x2E, 0x81)
    
    p = doc.add_paragraph()
    p.add_run(
        "The application employs a decoupled modern architecture combining a reactive client single-page application (SPA) with a lightweight, "
        "scalable Node.js/Express REST API backend. The system supports dual-mode database persistence (MongoDB via Mongoose with an automatic "
        "resilient in-memory fallback), ensuring uninterrupted operations during development, staging, and production deployments."
    )
    
    tech_tbl = doc.add_table(rows=1, cols=3)
    format_table(
        tech_tbl,
        [1.6, 2.2, 2.7],
        ["Layer", "Technology", "Architectural Role"],
        [
            ("Frontend Framework", "React 18 (Vite Bundler)", "Component-driven reactive UI, fast HMR, and tree-shaken builds"),
            ("Routing & Navigation", "React Router v6", "Role-based guarded routes for Customer, Vendor, and Admin portals"),
            ("State Management", "React Context API (8 Contexts)", "Isolated stores: Auth, Products, Cart, Disputes, i18n, Theme, Compare, Toast"),
            ("Styling System", "Vanilla CSS + Custom Design Tokens", "Modern responsive design tokens, glassmorphism, native dark/light modes"),
            ("Backend API", "Node.js & Express.js", "RESTful micro-controllers handling authentication, orders, inventory, and disputes"),
            ("Database Layer", "MongoDB + In-Memory Fallback", "Document-based persistence for products, merchants, users, and audit logs"),
            ("Security & Validation", "CORS, JWT & Role Guards", "Endpoint isolation, route protection, tamper-proof OTP generation")
        ]
    )
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # Context State Architecture Table
    doc.add_heading(level=2).add_run("2.1 Frontend Context & State Hierarchy")
    p = doc.add_paragraph("Global application state is managed across 8 dedicated React Context Providers organized cleanly in the root tree:")
    
    ctx_tbl = doc.add_table(rows=1, cols=3)
    format_table(
        ctx_tbl,
        [1.8, 1.8, 2.9],
        ["Context Provider", "Scope & State", "Key Exposed Methods"],
        [
            ("AuthContext", "User session, credentials & role", "login(), register(), logout(), switchRole(), getVendorById()"),
            ("ProductContext", "Global physical product catalog", "addProduct(), updateProduct(), approveProduct(), rejectProduct()"),
            ("CartContext", "Cart items, checkout & orders", "addToCart(), updateCartQuantity(), placeOrder(), getCustomerOrders()"),
            ("DisputeContext", "Post-delivery disputes & claims", "fileDispute(), resolveDispute(), updateDisputeStatus()"),
            ("LanguageContext", "6-language i18n dictionary", "setLanguage(), t(key, fallback), currentLangMeta"),
            ("ThemeContext", "Light / Dark theme engine", "toggleTheme(), setTheme(), isDark, isLight"),
            ("ComparisonContext", "Multi-product side-by-side comparison", "toggleCompare(), clearCompare(), removeFromCompare()"),
            ("ToastContext", "Interactive notification system", "addToast(message, type), removeToast()")
        ]
    )
    doc.add_paragraph().paragraph_format.space_after = Pt(14)
    
    # ── SECTION 3: USER ROLES & PORTALS ──
    h3 = doc.add_heading(level=1)
    r_h3 = h3.add_run("3. User Roles, Portals & Permissions Matrix")
    r_h3.bold = True
    r_h3.font.size = Pt(16)
    r_h3.font.color.rgb = RGBColor(0x31, 0x2E, 0x81)
    
    p = doc.add_paragraph(
        "Vendor Hub enforces strict separation of concerns across three dedicated portals accessible directly via topstrip chips or authenticated route transitions:"
    )
    
    role_tbl = doc.add_table(rows=1, cols=4)
    format_table(
        role_tbl,
        [1.3, 1.8, 1.8, 1.6],
        ["Role", "Portal Route", "Primary Responsibilities", "Access Permissions"],
        [
            ("Customer", "/shop, /shop/cart, /shop/orders", "Browse catalog, compare items, checkout with UPI/COD, track courier, raise disputes", "Public / Authenticated customer session"),
            ("Vendor", "/vendor/dashboard, /vendor/products", "Onboard storefront, list physical SKUs, manage stock, dispatch orders, view revenue", "Verified merchant login with GSTIN & business profile"),
            ("Admin", "/admin/dashboard, /admin/products", "Audit physical catalog listings, approve/reject products, mediate disputes, govern merchants", "Superuser administrator credentials")
        ]
    )
    doc.add_paragraph().paragraph_format.space_after = Pt(14)
    
    # ── SECTION 4: END-TO-END WORKFLOW LIFECYCLES ──
    h4 = doc.add_heading(level=1)
    r_h4 = h4.add_run("4. End-to-End Workflow Lifecycles")
    r_h4.bold = True
    r_h4.font.size = Pt(16)
    r_h4.font.color.rgb = RGBColor(0x31, 0x2E, 0x81)
    
    # 4.1 Vendor Workflow
    doc.add_heading(level=2).add_run("4.1 Vendor Registration, Onboarding & Product Listing Workflow")
    doc.add_paragraph(
        "1. Storefront Registration: The vendor registers with their business name, contact person, email, phone, GSTIN tax identifier, and physical pickup address.\n"
        "2. Merchant Catalog Creation: The vendor accesses the 'Add Physical Product' portal, specifying:\n"
        "   • Product Title, Brand Name, Physical SKU Code, and Master Category.\n"
        "   • Price (₹) and Maximum Retail Price (MRP) to compute dynamic discount badges.\n"
        "   • Initial Physical Warehouse Stock Count (with automatic low-stock badge thresholds).\n"
        "   • Shipping Specifications: Package dimensions, dispatch window ('Ships in 24 hours'), and warranty duration.\n"
        "   • Variant Configurations: Selectable color swatches with hex codes and option sizes/configurations.\n"
        "3. Initial Submission State: Upon form submission, the product is assigned a status of 'Pending' and placed into the Administrative Verification Queue."
    )
    
    # 4.2 Admin Governance
    doc.add_heading(level=2).add_run("4.2 Administrative Verification & Governance Workflow")
    doc.add_paragraph(
        "1. Real-Time Inspection: Platform administrators access the 'Admin Products' queue displaying all unverified merchant submissions.\n"
        "2. Compliance & Quality Check: The administrator examines high-resolution product imagery, SKU uniqueness, realistic pricing, and physical warranty validity.\n"
        "3. Decision Branch:\n"
        "   • Approval: Setting status to 'Approved'. The product instantly becomes visible to all customers across the marketplace.\n"
        "   • Rejection: Setting status to 'Rejected' with mandatory administrator feedback notes explaining why the listing was disapproved.\n"
        "4. Merchant Notification: The merchant dashboard immediately reflects the approval or rejection badge with audit timestamps."
    )
    
    # 4.3 Customer Discovery
    doc.add_heading(level=2).add_run("4.3 Customer Shopping, Multi-Facet Filters & Product Comparison")
    doc.add_paragraph(
        "1. Category Navigation: Customers browse across 7 top-level categories (All, Electronics, Fashion, Grocery, Home & Living, Sports, Beauty).\n"
        "2. Smart Filtering Pipeline:\n"
        "   • Live Search: Instant search across names, brands, descriptions, and SKUs with keyboard shortcuts ('/' to search, 'Esc' to clear).\n"
        "   • In-Stock Filter: One-click toggle filtering out warehouse items with zero physical stock.\n"
        "   • Fast Courier Dispatch: Filters items flagged with 'Ships in 24 hours' priority courier dispatch.\n"
        "   • Sorting Engine: Sort by Newest Arrivals, Price: Low to High, Price: High to Low, or Top Customer Rated.\n"
        "3. Side-by-Side Product Comparison: Customers can select 2 to 4 products across any vendor to compare side-by-side specs, price variations, warranties, and stock levels in a floating comparison drawer."
    )
    
    # 4.4 Checkout & Payment Options
    doc.add_heading(level=2).add_run("4.4 Cart, Courier Selection & Multi-Option Payment Gateway")
    doc.add_paragraph(
        "1. Cart Consolidation: Items added to the cart preserve selected variant colors, sizing options, and real-time inventory quantity caps.\n"
        "2. Courier Dispatch Method Selection:\n"
        "   • Delhivery Surface Express: Standard nationwide dispatch (Est. 3-5 business days; Free for orders over ₹999).\n"
        "   • BlueDart Priority Air: Guaranteed express courier dispatch (Est. 1-2 business days; ₹199 flat).\n"
        "3. Multi-Mode Payment Options:\n"
        "   • Option A: Dynamic UPI & QR Code: Auto-generates an interactive UPI QR code encoded with merchant VPA and order amount. Includes 1-click VPA copy, 10-minute validity countdown timer, and banking gateway simulation.\n"
        "   • Option B: Cash on Delivery (COD) with 4-Digit Delivery OTP: Generates a tamper-proof 4-digit security OTP upon order placement. Customers are instructed to share this OTP with the delivery executive only after verifying the package at their doorstep.\n"
        "   • Option C: Credit / Debit Cards & NetBanking: 256-bit SSL encrypted card processing simulator compliant with PCI-DSS guidelines."
    )
    
    add_callout(
        doc,
        "Anti-Fraud Doorstep Security",
        "The Cash on Delivery (COD) workflow features an automated 4-digit Delivery OTP generated upon order creation. "
        "The customer shares this OTP with the delivery executive only after physically inspecting the outer package carton, "
        "eliminating delivery fraud and parcel tampering."
    )
    
    # 4.5 Courier Tracking & Delivery
    doc.add_heading(level=2).add_run("4.5 Courier Logistics, Real-Time Tracking & Fulfillment")
    doc.add_paragraph(
        "Upon order placement, the system transitions orders through a 5-stage physical fulfillment lifecycle:\n"
        "1. Stock Reserved (Placed): Inventory is decremented from the merchant's physical warehouse count.\n"
        "2. Packaging Verified (Confirmed): The merchant prints the invoice and packs the item in barcode-scanned cartons.\n"
        "3. In Transit with Courier (Dispatched): Assigned an authentic Indian logistics tracking number (e.g. DEL-8492019).\n"
        "4. Out for Delivery: The courier reaches the local delivery hub and initiates final-mile delivery.\n"
        "5. Physically Delivered: Handed over to the recipient upon OTP verification (COD) or signature confirmation (Prepaid)."
    )
    
    # 4.6 Post-Purchase Disputes
    doc.add_heading(level=2).add_run("4.6 Post-Purchase Returns, Warranty Claims & Dispute Resolution")
    doc.add_paragraph(
        "1. Dispute Filing: Customers can raise an official dispute from their 'My Orders' portal for issues like transit damage, defective goods, or wrong item delivery.\n"
        "2. Resolution Paths: Customers request either an immediate courier replacement or a full payment refund.\n"
        "3. Tri-Party Mediation: Admin, Vendor, and Customer interact through the Dispute Management portal with resolution timestamps and settlement audit trails."
    )
    doc.add_paragraph().paragraph_format.space_after = Pt(14)
    
    # ── SECTION 5: CROSS-CUTTING ARCHITECTURAL CAPABILITIES ──
    h5 = doc.add_heading(level=1)
    r_h5 = h5.add_run("5. Cross-Cutting Capabilities: Localization & Theme Engine")
    r_h5.bold = True
    r_h5.font.size = Pt(16)
    r_h5.font.color.rgb = RGBColor(0x31, 0x2E, 0x81)
    
    # 5.1 Languages Table
    doc.add_heading(level=2).add_run("5.1 6-Language Internationalization (i18n) Architecture")
    p = doc.add_paragraph(
        "The application features a complete internationalization dictionary architecture supporting 6 languages with native script typography:"
    )
    
    lang_tbl = doc.add_table(rows=1, cols=4)
    format_table(
        lang_tbl,
        [1.2, 1.5, 1.8, 2.0],
        ["Code", "Language", "Native Script", "Coverage Areas"],
        [
            ("en", "English", "English 🇬🇧", "Topstrip, Navbar, Catalog, Cart, Checkout, Tracking, Admin"),
            ("ta", "Tamil", "தமிழ் 🇮🇳", "100% UI translation, Category labels, Buttons, COD Notices"),
            ("ml", "Malayalam", "മലയാളം 🇮🇳", "100% UI translation, Cart summaries, Courier labels, Disputes"),
            ("te", "Telugu", "తెలుగు 🇮🇳", "100% UI translation, Payment methods, Stock statuses, Navbar"),
            ("kn", "Kannada", "ಕನ್ನಡ 🇮🇳", "100% UI translation, Filters, Product descriptions, Orders"),
            ("hi", "Hindi", "हिन्दी 🇮🇳", "100% UI translation, Search bar, Delivery forms, Review modals")
        ]
    )
    doc.add_paragraph().paragraph_format.space_after = Pt(10)
    
    # 5.2 Theme Engine
    doc.add_heading(level=2).add_run("5.2 Official Website Light / Dark Theme Engine")
    doc.add_paragraph(
        "The theme engine follows the design pattern of official modern engineering platforms (e.g. Vite, GitHub, Tailwind):\n"
        "• 1-Click Interactive Switch: A pill switch located in the navbar containing a sliding circular thumb with animated ☀️ Sun and 🌙 Moon icons.\n"
        "• Light Mode: Soft slate background (#F8F9FC), pure white surfaces (#FFFFFF), crisp dark slate typography (#0F172A), and subtle shadows.\n"
        "• Dark Mode: Deep midnight slate background (#0B0F19), dark card surfaces (#1E293B, #111827), high-contrast light text (#F9FAFB), and muted borders (#374151).\n"
        "• Instantaneous DOM Injection: Seamlessly updates CSS custom properties on :root and toggles the data-theme attribute with 0.28s spring transitions and zero reload.\n"
        "• Session Persistence: User preference is stored in localStorage under 'vh_theme' and syncs across browser tabs."
    )
    doc.add_paragraph().paragraph_format.space_after = Pt(14)
    
    # ── SECTION 6: DATA MODELS & SCHEMA SPECIFICATIONS ──
    h6 = doc.add_heading(level=1)
    r_h6 = h6.add_run("6. Data Models & Entity Schema Design")
    r_h6.bold = True
    r_h6.font.size = Pt(16)
    r_h6.font.color.rgb = RGBColor(0x31, 0x2E, 0x81)
    
    p = doc.add_paragraph("The platform schema captures rich entity relationships between merchants, catalog SKUs, customer orders, and disputes:")
    
    schema_tbl = doc.add_table(rows=1, cols=3)
    format_table(
        schema_tbl,
        [1.5, 2.5, 2.5],
        ["Entity Model", "Key Attributes & Data Fields", "Business Rules & Constraints"],
        [
            ("Product", "id, name, brand, sku, category, price, mrp, stock, status ('Pending'|'Approved'|'Rejected'), variants, shipping, images", "Price <= MRP; Stock >= 0; SKU must be unique per merchant; Approval required to display on /shop"),
            ("Vendor", "id, businessName, email, phone, gstin, address, rating, active, commissionRate, totalRevenue", "GSTIN validation; Business name uniqueness; Rating computed from approved customer reviews"),
            ("Order", "id, customerId, items, subtotal, shippingFee, total, shippingMethod, paymentMethod ('UPI_QR'|'COD'|'CARD'), status, trackingNumber, deliveryOtp", "deliveryOtp generated only for COD orders; stock decremented upon creation; trackingNumber auto-assigned"),
            ("Dispute", "id, orderId, customerId, vendorId, reason, actionRequested ('replacement'|'refund'), status ('Open'|'Under Review'|'Resolved'), adminNotes", "Can only be filed for Delivered physical orders; 7-day replacement window enforcement")
        ]
    )
    doc.add_paragraph().paragraph_format.space_after = Pt(14)
    
    # ── SECTION 7: SECURITY & INTEGRITY ──
    h7 = doc.add_heading(level=1)
    r_h7 = h7.add_run("7. Security, Integrity & Validation Safeguards")
    r_h7.bold = True
    r_h7.font.size = Pt(16)
    r_h7.font.color.rgb = RGBColor(0x31, 0x2E, 0x81)
    
    doc.add_paragraph(
        "1. Anti-Tampering Delivery Protection: COD orders generate an isolated 4-digit verification token saved securely in order state. Delivery is only marked complete once verified.\n"
        "2. Real-Time Inventory Locking: When items are purchased, available stock count is validated and locked in real time to prevent double-allocation during high-concurrency flashes.\n"
        "3. Role-Based Route Guards: React Router guards prevent unauthenticated or non-vendor accounts from accessing administrative and merchant store controls.\n"
        "4. Sanitized Input Parsing: Search queries and user reviews are trimmed and sanitized to prevent XSS injection attacks across the client DOM.\n"
        "5. Encrypted Client Storage: User tokens and session preferences are stored using isolated localStorage keys with error-handled JSON parsers."
    )
    doc.add_paragraph().paragraph_format.space_after = Pt(14)
    
    # ── SECTION 8: EXECUTION & ROADMAP ──
    h8 = doc.add_heading(level=1)
    r_h8 = h8.add_run("8. Deployment Verification & Future Roadmap")
    r_h8.bold = True
    r_h8.font.size = Pt(16)
    r_h8.font.color.rgb = RGBColor(0x31, 0x2E, 0x81)
    
    doc.add_paragraph(
        "• Production Build Command: npm run build (Compiled via Vite with 0 syntax errors or broken dependencies).\n"
        "• Development Server: npm run dev (Running on http://localhost:5173/ with instant Hot Module Replacement).\n"
        "• Backend Server: npm run server (Express API listening on port 5000 with MongoDB connection pooling)."
    )
    
    doc.add_heading(level=2).add_run("8.1 Strategic Enhancement Roadmap")
    roadmap_tbl = doc.add_table(rows=1, cols=3)
    format_table(
        roadmap_tbl,
        [1.4, 2.4, 2.7],
        ["Phase", "Target Feature", "Technical Scope"],
        [
            ("Phase 1 (Complete)", "Multi-Vendor Marketplace Core", "Physical catalog, Vendor portal, Admin verification, Multi-product comparison"),
            ("Phase 2 (Complete)", "Payment & Doorstep Security", "Dynamic UPI QR code, Cash on Delivery with 4-Digit Delivery OTP, Courier tracking"),
            ("Phase 3 (Complete)", "Localization & Theme Engine", "6 Indian languages (ta, ml, te, kn, hi, en) and official Light/Dark toggle switch"),
            ("Phase 4 (Future)", "Real Logistics API Webhooks", "Direct webhooks with Delhivery & BlueDart API for automated shipment dispatch & live SMS alerts"),
            ("Phase 5 (Future)", "Automated Vendor Payouts", "Automated UPI AutoPay & Escrow settlement release upon doorstep delivery confirmation")
        ]
    )
    
    output_path = os.path.abspath("Vendor_Hub_Complete_Project_Workflow.docx")
    doc.save(output_path)
    print(f"DOCUMENT_CREATED: {output_path}")

if __name__ == "__main__":
    build_workflow_document()
