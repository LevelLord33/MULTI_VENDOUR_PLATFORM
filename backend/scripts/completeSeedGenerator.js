import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 10 Realistic Verified Physical Merchants (v11 to v20)
const additionalVendors = [
  {
    id: "v11",
    businessName: "ChaiCulture & Spices Heritage",
    storeSlug: "chaiculture",
    tagline: "Single-Estate Darjeeling Teas, Assam Orthodox Blends & Malabar GI-Tagged Spices",
    ownerName: "Vikramaditya Roy",
    email: "vikram@chaiculture.in",
    password: "Vendor@123",
    mobile: "9830198765",
    businessAddress: "28, Park Street, Camac Street Crossing",
    location: "Kolkata, West Bengal",
    joinedDate: "2024-03-12",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&h=120&fit=crop",
    banner: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&h=300&fit=crop",
    themeColor: "#D97706",
    themePreset: "amber",
    storeStatus: "published",
    isVerified: true,
    gstin: "19AABCU4512D1ZX",
    announcement: "☕ Direct Garden Dispatches from Darjeeling & Assam with Nitrogen Flush Sealed Packaging.",
    featuredProductIds: ["p151", "p152", "p153", "p154"],
    storeRating: 4.9,
    totalOrdersFulfilled: 1420,
    onTimeDispatchRate: "99.1%",
    shippingPartners: ["BlueDart Express", "Delhivery Surface", "DTDC Air"],
    returnPolicy: "7 Days Freshness Guarantee - Full Replacement for Damaged Aroma Seals",
    warrantyPolicy: "100% Certified Organic & FSSAI Lab Tested Batch Reports",
    description: "ChaiCulture sources directly from heritage tea estates in Darjeeling, the Brahmaputra Valley, and Malabar spice gardens for unparalleled aroma and authenticity."
  },
  {
    id: "v12",
    businessName: "Lumina Home & Smart Lighting",
    storeSlug: "lumina",
    tagline: "Architectural Magnetic Tracks, Smart Ambient Fixtures & Nordic Minimalist Chandeliers",
    ownerName: "Sneha Singhania",
    email: "sneha@lumina.in",
    password: "Vendor@123",
    mobile: "9820543210",
    businessAddress: "Plot 42, Road No. 36, Jubilee Hills",
    location: "Hyderabad, Telangana",
    joinedDate: "2024-02-18",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop",
    banner: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&h=300&fit=crop",
    themeColor: "#F59E0B",
    themePreset: "amber",
    storeStatus: "published",
    isVerified: true,
    gstin: "36AABCL8890K1ZW",
    announcement: "💡 Free Remote Lighting Design Consultations with Certified Illuminating Engineers.",
    featuredProductIds: ["p161", "p162", "p163", "p164"],
    storeRating: 4.8,
    totalOrdersFulfilled: 890,
    onTimeDispatchRate: "98.4%",
    shippingPartners: ["BlueDart Express", "Delhivery Surface"],
    returnPolicy: "10 Days Hassle-Free Replacement for Driver or Optical Module Defects",
    warrantyPolicy: "2 to 5 Years Comprehensive On-Site Warranty with Official Tax Invoice",
    description: "Lumina Studio curates architectural-grade smart illumination, CRI 95+ light engines, and high-efficiency smart LED fixtures for modern residences."
  },
  {
    id: "v13",
    businessName: "Himalayan Pure Organics",
    storeSlug: "himalayanpure",
    tagline: "Wild Forest Raw Honeys, Wood-Pressed Oils, A2 Bilona Ghee & High-Altitude Herbs",
    ownerName: "Rahul Rawat",
    email: "rahul@himalayanpure.in",
    password: "Vendor@123",
    mobile: "9816045678",
    businessAddress: "12/A, Rajpur Road, Near Jakhan",
    location: "Dehradun, Uttarakhand",
    joinedDate: "2024-01-20",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop",
    banner: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=300&fit=crop",
    themeColor: "#059669",
    themePreset: "emerald",
    storeStatus: "published",
    isVerified: true,
    gstin: "05AABCH9912M1Z5",
    announcement: "🌿 Harvested sustainably at 6,500+ ft altitude with zero chemical processing.",
    featuredProductIds: ["p171", "p172", "p173", "p174"],
    storeRating: 4.9,
    totalOrdersFulfilled: 2150,
    onTimeDispatchRate: "99.5%",
    shippingPartners: ["Delhivery Surface", "BlueDart Express", "India Post Air"],
    returnPolicy: "7 Days Replacement for Broken Glass Containers or Seal Tampering",
    warrantyPolicy: "100% Raw Unpasteurized Guarantee with Nuclear Magnetic Resonance (NMR) Lab Reports",
    description: "Himalayan Pure Organics works with Uttarakhand self-help farmer collectives to bring mountain produce directly to discerning households nationwide."
  },
  {
    id: "v14",
    businessName: "Aethelgard Leather Works",
    storeSlug: "aethelgard",
    tagline: "Full-Grain Vegetable Tanned Bags, Laptop Messengers & Handcrafted Everyday Carry",
    ownerName: "Kabir Kapoor",
    email: "kabir@aethelgard.in",
    password: "Vendor@123",
    mobile: "9821167890",
    businessAddress: "78, Civil Lines, Near Parade Square",
    location: "Kanpur, Uttar Pradesh",
    joinedDate: "2024-04-05",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    banner: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=300&fit=crop",
    themeColor: "#78350F",
    themePreset: "slate",
    storeStatus: "published",
    isVerified: true,
    gstin: "09AABCA7766L1ZQ",
    announcement: "🎒 Lifetime Stitching & Hardware Guarantee on All Full-Grain Buffalo Leather Bags.",
    featuredProductIds: ["p181", "p182", "p183", "p184"],
    storeRating: 4.8,
    totalOrdersFulfilled: 980,
    onTimeDispatchRate: "98.7%",
    shippingPartners: ["BlueDart Express", "Delhivery Surface"],
    returnPolicy: "15 Days Physical Return or Size Exchange with Complimentary Reverse Pickup",
    warrantyPolicy: "Lifetime Stitching & Solid Brass Hardware Warranty",
    description: "Master leathercrafters in Kanpur building heirloom-grade leather gear that ages gracefully with a rich patina over decades of daily adventures."
  },
  {
    id: "v15",
    businessName: "Apex Pro Fitness & Strength Lab",
    storeSlug: "apexfitness",
    tagline: "Commercial Olympic Barbells, Heavy-Duty Racks & High-Density Bumper Plates",
    ownerName: "Harpreet Brar",
    email: "harpreet@apexfitness.in",
    password: "Vendor@123",
    mobile: "9872054321",
    businessAddress: "B-XXII, Ferozepur Road, Gurdev Nagar",
    location: "Ludhiana, Punjab",
    joinedDate: "2024-02-10",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    banner: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&h=300&fit=crop",
    themeColor: "#DC2626",
    themePreset: "rose",
    storeStatus: "published",
    isVerified: true,
    gstin: "03AABCA2233P1ZR",
    announcement: "🏋️ Heavy-duty pallet freight dispatch across India with drop-test safety certifications.",
    featuredProductIds: ["p191", "p192", "p193", "p194"],
    storeRating: 4.9,
    totalOrdersFulfilled: 1120,
    onTimeDispatchRate: "98.9%",
    shippingPartners: ["Delhivery Heavy Freight", "Gati KWE", "BlueDart Express"],
    returnPolicy: "10 Days Component Replacement for Manufacturing Flaws or Knurling Imperfections",
    warrantyPolicy: "5-Year Barbell Shaft Warranty & 2-Year Frame Structural Warranty",
    description: "Apex Pro manufactures professional strength training gear engineered to IPF and IWF tolerances for commercial fitness centers and home gyms."
  },
  {
    id: "v16",
    businessName: "Kaveri Handlooms & Silks",
    storeSlug: "kaverisilks",
    tagline: "GI-Certified Pure Kanchipuram Silks, Tussar Weaves & Handloom Linen Essentials",
    ownerName: "Meenakshi Sundaram",
    email: "meenakshi@kaverisilks.in",
    password: "Vendor@123",
    mobile: "9840187654",
    businessAddress: "112, Gandhi Road, Temple Town",
    location: "Kanchipuram, Tamil Nadu",
    joinedDate: "2024-01-08",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
    banner: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&h=300&fit=crop",
    themeColor: "#BE185D",
    themePreset: "rose",
    storeStatus: "published",
    isVerified: true,
    gstin: "33AABCK6655J1ZX",
    announcement: "🥻 Silk Mark India Certified 100% Pure Mulberry Silk & Handwoven Real Silver Zari.",
    featuredProductIds: ["p201", "p202", "p203", "p204"],
    storeRating: 4.9,
    totalOrdersFulfilled: 1670,
    onTimeDispatchRate: "99.4%",
    shippingPartners: ["BlueDart Express", "DTDC Air"],
    returnPolicy: "7 Days Return Policy with Silk Mark Tag Untampered",
    warrantyPolicy: "Official Silk Mark & Handloom Mark Tag Authenticated",
    description: "Kaveri Silks preserves centuries-old weaving traditions from master looms in Kanchipuram and Arani with authenticated Silk Mark verification."
  },
  {
    id: "v17",
    businessName: "AutoCraft Pro Accessories",
    storeSlug: "autocraft",
    tagline: "4K Dual Dash Cams, High-Flow Inflators, Jump Starters & Ceramic Auto Detailing",
    ownerName: "Gaurav Malhotra",
    email: "gaurav@autocraft.in",
    password: "Vendor@123",
    mobile: "9811122334",
    businessAddress: "Shop 18, Sector 14 Main Market",
    location: "Gurugram, Haryana",
    joinedDate: "2024-03-01",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    banner: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=300&fit=crop",
    themeColor: "#0284C7",
    themePreset: "indigo",
    storeStatus: "published",
    isVerified: true,
    gstin: "06AABCA3344R1ZS",
    announcement: "🚗 Direct Importer of Flagship STARVIS 2 Night Vision Dash Cams & Tyre Systems.",
    featuredProductIds: ["p211", "p212", "p213", "p214"],
    storeRating: 4.8,
    totalOrdersFulfilled: 1350,
    onTimeDispatchRate: "99.0%",
    shippingPartners: ["BlueDart Express", "Delhivery Surface", "DTDC Air"],
    returnPolicy: "7 Days Replacement for Electronic or Pressure Calibration Faults",
    warrantyPolicy: "1-Year Direct Brand Warranty with Official Indian Tax Invoices",
    description: "AutoCraft Pro equips car owners with essential automotive tech, intelligent dashcams, emergency battery packs, and detailing solutions."
  },
  {
    id: "v18",
    businessName: "NourishBotanica Ayurveda",
    storeSlug: "nourishbotanica",
    tagline: "Clinical Botanical Skincare, Kumkumadi Elixirs & Cold-Pressed Kerala Hair Tonics",
    ownerName: "Dr. Ananya Nambiar",
    email: "ananya@nourishbotanica.in",
    password: "Vendor@123",
    mobile: "9845012398",
    businessAddress: "Door 45/182, Panampilly Nagar Main Ave",
    location: "Kochi, Kerala",
    joinedDate: "2024-02-14",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    banner: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&h=300&fit=crop",
    themeColor: "#16A34A",
    themePreset: "emerald",
    storeStatus: "published",
    isVerified: true,
    gstin: "32AABCN5544K1ZV",
    announcement: "✨ Formulated with Kerala AYUSH-Licensed Botanical Decoctions & Saffron Extracts.",
    featuredProductIds: ["p221", "p222", "p223", "p224"],
    storeRating: 4.9,
    totalOrdersFulfilled: 2450,
    onTimeDispatchRate: "99.6%",
    shippingPartners: ["BlueDart Express", "Delhivery Surface", "DTDC Air"],
    returnPolicy: "7 Days Replacement for Breakage or Seal Damage during transit",
    warrantyPolicy: "100% Ayurvedic Pharmacopoeia Standards & Dermatologist Clinically Tested",
    description: "Doctor-formulated Ayurvedic skin and scalp remedies crafted with classical decoctions, cold-pressed herbs, and natural essential oils."
  },
  {
    id: "v19",
    businessName: "Crestview Premium Eyewear",
    storeSlug: "crestview",
    tagline: "Japanese Titanium Spectacles, Polarized TR90 Sunglasses & Blue-Cut Optics",
    ownerName: "Amit Trivedi",
    email: "amit@crestview.in",
    password: "Vendor@123",
    mobile: "9825098712",
    businessAddress: "G-4, Silver Square, Athwa Lines",
    location: "Surat, Gujarat",
    joinedDate: "2024-03-20",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&h=120&fit=crop",
    banner: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&h=300&fit=crop",
    themeColor: "#2563EB",
    themePreset: "indigo",
    storeStatus: "published",
    isVerified: true,
    gstin: "24AABCC1122D1ZT",
    announcement: "👓 Complimentary Blue-Cut Screen Coating & Premium Hard Travel Case Included.",
    featuredProductIds: ["p231", "p232", "p233", "p234"],
    storeRating: 4.8,
    totalOrdersFulfilled: 1220,
    onTimeDispatchRate: "98.8%",
    shippingPartners: ["BlueDart Express", "Delhivery Surface"],
    returnPolicy: "14 Days Hassle-Free Frame Fit Exchange with Reverse Pickup",
    warrantyPolicy: "1-Year Frame Hinge & Coating Delamination Warranty",
    description: "Crestview crafts ultralight beta-titanium and Italian Mazzucchelli acetate spectacles paired with distortion-free optical coatings."
  },
  {
    id: "v20",
    businessName: "Artisanal Brew & Barware Studio",
    storeSlug: "artisanalbrew",
    tagline: "Specialty Pour-Overs, Precision Hand Grinders & Hand-Blown Whiskey Crystal",
    ownerName: "Siddharth Sengupta",
    email: "siddharth@artisanalbrew.in",
    password: "Vendor@123",
    mobile: "9831076543",
    businessAddress: "Plot 104, Saheed Nagar, Janpath Road",
    location: "Bhubaneswar, Odisha",
    joinedDate: "2024-04-10",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop",
    banner: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=300&fit=crop",
    themeColor: "#D97706",
    themePreset: "amber",
    storeStatus: "published",
    isVerified: true,
    gstin: "21AABCA8877E1ZX",
    announcement: "☕ Master the perfect extraction with barista-grade stainless steel & crystal tools.",
    featuredProductIds: ["p241", "p242", "p243", "p244"],
    storeRating: 4.9,
    totalOrdersFulfilled: 1540,
    onTimeDispatchRate: "99.2%",
    shippingPartners: ["BlueDart Express", "Delhivery Surface", "DTDC Air"],
    returnPolicy: "7 Days Free Replacement for Glassware Breakage or Calibration Issues",
    warrantyPolicy: "2-Year Burrs & Mechanical Warranty on Precision Grinders",
    description: "Artisanal Brew supplies specialty coffee gear, pour-over equipment, burr grinders, and lead-free crystal barware to connoisseurs across India."
  }
];

// Helper to create product
function makeProduct({
  id, sku, name, category, brand, price, mrp, discountPercent, stock, barcode,
  vendorId, img1, img2, description, specs, weight, variants, badge, tags
}) {
  return {
    id,
    sku,
    name,
    category,
    brand,
    price,
    mrp,
    discountPercent,
    stock,
    quantity: stock,
    barcode,
    lowStockThreshold: Math.max(4, Math.floor(stock * 0.2)),
    reservedStock: 0,
    warehouseLocation: `Rack ${id.toUpperCase().replace('P', 'R-')}`,
    restockLeadDays: 3,
    vendorId,
    status: "approved",
    images: [img1, img2],
    description,
    condition: "Brand New (Sealed)",
    specifications: specs,
    shipping: {
      weight,
      dispatchTime: "Ships within 24 hours",
      estimatedDays: "2 - 4 days",
      courierPartners: ["BlueDart Express", "Delhivery Surface", "DTDC Air"],
      codAvailable: true,
      returnWindowDays: 7
    },
    variants: variants || {
      colors: [{ name: "Standard", hex: "#334155", inStock: true }],
      options: [{ label: "Standard Unit", priceDelta: 0, stock }]
    },
    badge: badge || "Verified Brand",
    tags: tags || [category.toLowerCase(), brand.toLowerCase()]
  };
}

const additionalProducts = [
  // v11: ChaiCulture (p151 - p160)
  makeProduct({
    id: "p151", sku: "VM-TEA-P151-DAR", name: "Darjeeling First Flush FTGFOP1 Whole Leaf Tea 250g",
    category: "Grocery", brand: "ChaiCulture Heritage", price: 1250, mrp: 1499, discountPercent: 17, stock: 45, barcode: "8901000001511",
    vendorId: "v11", img1: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop",
    description: "Hand-plucked spring harvest from high-elevation Darjeeling slopes. Exhibits bright floral muscatel notes with an amber liquor.",
    specs: { "Grade": "FTGFOP1", "Flush": "First Flush (Spring)", "Weight": "250 g", "Packaging": "Aroma Lock Tin Caddy" },
    weight: "380 g", badge: "Bestseller", tags: ["darjeeling", "tea", "organic", "first flush"]
  }),
  makeProduct({
    id: "p152", sku: "VM-TEA-P152-ASS", name: "Assam Golden Tips Orthodox Black Tea 500g",
    category: "Grocery", brand: "ChaiCulture Heritage", price: 890, mrp: 1099, discountPercent: 19, stock: 60, barcode: "8901000001528",
    vendorId: "v11", img1: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&h=600&fit=crop",
    description: "Robust, malty breakfast tea with rich golden tips grown in the Upper Assam floodplains. Perfect with a splash of milk.",
    specs: { "Origin": "Upper Assam", "Weight": "500 g", "Leaf Style": "Orthodox Broken Orange Pekoe" },
    weight: "620 g", badge: "Staff Pick", tags: ["assam", "black tea", "malty"]
  }),
  makeProduct({
    id: "p153", sku: "VM-TEA-P153-CRD", name: "Alleppey Green Cardamom 8mm Bold Grade 200g",
    category: "Grocery", brand: "Malabar Heritage", price: 950, mrp: 1200, discountPercent: 21, stock: 35, barcode: "8901000001535",
    vendorId: "v11", img1: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop",
    description: "GI-tagged giant 8mm extra bold green cardamom pods hand-picked from the Western Ghats of Idukki. Intense aroma and essential oil density.",
    specs: { "Pod Size": "8 mm+ Extra Bold", "Origin": "Idukki, Kerala", "Moisture": "<10%", "Weight": "200 g" },
    weight: "280 g", badge: "GI Tagged", tags: ["cardamom", "spices", "kerala"]
  }),
  makeProduct({
    id: "p154", sku: "VM-TEA-P154-PEP", name: "Wayanad Tellicherry Garbled Extra Bold Black Pepper 250g",
    category: "Grocery", brand: "Malabar Heritage", price: 499, mrp: 650, discountPercent: 23, stock: 80, barcode: "8901000001542",
    vendorId: "v11", img1: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop",
    description: "The world's highest grade peppercorn (TGSEB). Sun-dried black pepper berries with complex citrus-pine warmth and high piperine index.",
    specs: { "Grade": "TGSEB Extra Bold", "Size": "4.75mm+", "Weight": "250 g", "Origin": "Wayanad, Kerala" },
    weight: "320 g", badge: "Verified Indian Brand", tags: ["pepper", "tellicherry", "spices"]
  }),
  makeProduct({
    id: "p155", sku: "VM-TEA-P155-SAF", name: "Kashmiri Mogra Saffron (Kesar) 2g Certified Grade A1",
    category: "Grocery", brand: "ChaiCulture Heritage", price: 999, mrp: 1350, discountPercent: 26, stock: 25, barcode: "8901000001559",
    vendorId: "v11", img1: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop",
    description: "Pure Pampore saffron crimson stigmata without yellow styles. Delivers golden color, intoxicating floral fragrance, and natural antioxidant potency.",
    specs: { "Origin": "Pampore, Kashmir", "Net Weight": "2 g", "Grade": "Mogra Grade 1" },
    weight: "120 g", badge: "Pure Saffron", tags: ["saffron", "kesar", "kashmir"]
  }),
  makeProduct({
    id: "p156", sku: "VM-TEA-P156-NIL", name: "Nilgiri Winter Frost White Tea 100g",
    category: "Grocery", brand: "ChaiCulture Heritage", price: 1100, mrp: 1400, discountPercent: 21, stock: 30, barcode: "8901000001566",
    vendorId: "v11", img1: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&h=600&fit=crop",
    description: "Rare silver needles harvested during freezing winter mornings at 7,000 feet in Coonoor. Notes of honeydew melon and white peach.",
    specs: { "Altitude": "7,000 ft", "Type": "Silver Needle White Tea", "Weight": "100 g" },
    weight: "220 g", badge: "Rare Harvest", tags: ["white tea", "nilgiri"]
  }),
  makeProduct({
    id: "p157", sku: "VM-TEA-P157-MAS", name: "Royal Kadak Masala Chai Blend with Real Spices 500g",
    category: "Grocery", brand: "ChaiCulture Heritage", price: 450, mrp: 550, discountPercent: 18, stock: 90, barcode: "8901000001573",
    vendorId: "v11", img1: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=600&fit=crop",
    description: "Granular CTC blended with crushed green cardamom, ginger, cinnamon, clove, and nutmeg. Yields a rich spiced dhaba-style cup.",
    specs: { "Spices": "Cardamom, Ginger, Clove, Cinnamon", "Base": "Assam CTC", "Weight": "500 g" },
    weight: "580 g", badge: "Popular Daily Pick", tags: ["masala chai", "tea"]
  }),
  makeProduct({
    id: "p158", sku: "VM-TEA-P158-TUL", name: "Organic Whole Leaf Green Tea with Rama & Krishna Tulsi 250g",
    category: "Grocery", brand: "ChaiCulture Heritage", price: 520, mrp: 650, discountPercent: 20, stock: 55, barcode: "8901000001580",
    vendorId: "v11", img1: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop",
    description: "Non-bitter steamed green tea leaves paired with sacred Rama and Krishna Tulsi herbs for immunity, relaxation, and digestion.",
    specs: { "Certification": "USDA Organic & India Organic", "Weight": "250 g", "Antioxidants": "High EGCG" },
    weight: "340 g", badge: "100% Organic", tags: ["green tea", "tulsi", "detox"]
  }),
  makeProduct({
    id: "p159", sku: "VM-TEA-P159-CIN", name: "Ceylon True Cinnamon Quills (Sri Lankan Dalchini) 150g",
    category: "Grocery", brand: "Malabar Heritage", price: 399, mrp: 520, discountPercent: 23, stock: 70, barcode: "8901000001597",
    vendorId: "v11", img1: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&h=600&fit=crop",
    description: "Authentic paper-thin layered Alba-grade Ceylon cinnamon sticks. Ultra-low coumarin content, sweet woody fragrance, safe for daily baking and tea.",
    specs: { "Type": "Cinnamomum Verum", "Weight": "150 g", "Coumarin": "<0.004%" },
    weight: "240 g", badge: "Low Coumarin", tags: ["cinnamon", "dalchini", "spices"]
  }),
  makeProduct({
    id: "p160", sku: "VM-TEA-P160-GFT", name: "Grand Heritage Indian Tea Connoisseur Gift Chest (4 Tins)",
    category: "Grocery", brand: "ChaiCulture Heritage", price: 2499, mrp: 3200, discountPercent: 22, stock: 20, barcode: "8901000001603",
    vendorId: "v11", img1: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&h=600&fit=crop",
    description: "Artisanal handcrafted pine wood chest containing 4 airtight embossed caddies: Darjeeling First Flush, Assam Golden Tips, Kashmiri Kahwa, and Nilgiri Oolong.",
    specs: { "Chest Material": "Polished Natural Pine Wood", "Contents": "4 x 75g Tins" },
    weight: "1250 g", badge: "Luxury Gift Set", tags: ["gift", "luxury tea", "assortment"]
  }),

  // v12: Lumina Smart Lighting (p161 - p170)
  makeProduct({
    id: "p161", sku: "VM-LGT-P161-HUE", name: "Philips Hue 16M Colors Smart LED Bulb E27 10W",
    category: "Electronics", brand: "Philips", price: 2499, mrp: 2999, discountPercent: 17, stock: 40, barcode: "8901000001610",
    vendorId: "v12", img1: "https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop",
    description: "Connect to Alexa, Google Home or Apple HomeKit. Experience 16 million colors and preset dynamic light scenes with warm-to-cool white ambiances.",
    specs: { "Lumen Output": "806 Lumens", "Base": "E27 Screw", "Connectivity": "Bluetooth + Zigbee", "Lifespan": "25,000 Hours" },
    weight: "150 g", badge: "Smart Connected", tags: ["smart bulb", "lighting", "philips", "hue"]
  }),
  makeProduct({
    id: "p162", sku: "VM-LGT-P162-WIP", name: "Wipro Smart LED Batten 20W Color Changing & Dimming",
    category: "Home & Living", brand: "Wipro", price: 999, mrp: 1499, discountPercent: 33, stock: 65, barcode: "8901000001627",
    vendorId: "v12", img1: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=600&h=600&fit=crop",
    description: "4-foot slimline tube light with Wi-Fi app tuning from warm cozy yellow to energizing daylight white without replacing switches.",
    specs: { "Wattage": "20W", "Length": "4 Feet (1200mm)", "Color Temp": "2700K - 6500K", "CRI": ">80" },
    weight: "380 g", badge: "Energy Saver", tags: ["batten", "wipro", "led"]
  }),
  makeProduct({
    id: "p163", sku: "VM-LGT-P163-NOR", name: "Nordic Minimalist Trio Pendant Chandelier Matte Black",
    category: "Home & Living", brand: "Lumina Studio", price: 5499, mrp: 7999, discountPercent: 31, stock: 20, barcode: "8901000001634",
    vendorId: "v12", img1: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop",
    description: "Contemporary geometric spun aluminum shades with warm teak wood detailing. Ideal for dining table islands and modern living rooms.",
    specs: { "Heads": "3 Pendants", "Suspension": "Adjustable 1.2m Braided Cable", "Material": "Spun Aluminum & Natural Oak" },
    weight: "2400 g", badge: "Architectural Pick", tags: ["chandelier", "nordic", "pendant"]
  }),
  makeProduct({
    id: "p164", sku: "VM-LGT-P164-SYS", name: "Syska 10W Smart Wi-Fi Recessed Downlight 90mm Cutout",
    category: "Home & Living", brand: "Syska", price: 749, mrp: 999, discountPercent: 25, stock: 80, barcode: "8901000001641",
    vendorId: "v12", img1: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=600&h=600&fit=crop",
    description: "Flush ceiling spotlight with anti-glare reflector. Controlled via Syska Smart Home app for scheduling, mood scenes, and rhythm sync.",
    specs: { "Wattage": "10W", "Cutout": "90 mm", "Beam Angle": "38 Degrees", "Lumens": "850 lm" },
    weight: "210 g", badge: "Top Value", tags: ["downlight", "syska", "ceiling light"]
  }),
  makeProduct({
    id: "p165", sku: "VM-LGT-P165-YEE", name: "Yeelight Starlight Smart Ambient LED Bedside Lamp",
    category: "Electronics", brand: "Yeelight", price: 3299, mrp: 4499, discountPercent: 27, stock: 30, barcode: "8901000001658",
    vendorId: "v12", img1: "https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&h=600&fit=crop",
    description: "Touch-sensitive 360-degree cylindrical diffused nightstand lamp. Syncs with music rhythms and mimics sunrise for natural morning wakeups.",
    specs: { "Luminance": "400 Lumens", "Color Spectrum": "16 Million Colors", "Controls": "Top Touch Bar + App" },
    weight: "850 g", badge: "Bedroom Essential", tags: ["lamp", "bedside", "ambient"]
  }),
  makeProduct({
    id: "p166", sku: "VM-LGT-P166-MAG", name: "Architectural 48V Low Voltage Magnetic Track Rail 1 Meter",
    category: "Home & Living", brand: "Lumina Studio", price: 1850, mrp: 2400, discountPercent: 23, stock: 45, barcode: "8901000001665",
    vendorId: "v12", img1: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&h=600&fit=crop",
    description: "Extruded aerospace-grade aluminum magnetic channel allowing tool-free repositioning of linear floodlights and accent track spots safely at 48V DC.",
    specs: { "Voltage": "48V DC Safe Touch", "Length": "1000 mm", "Profile": "Surface / Recessed Mount", "Color": "Matte Anodized Black" },
    weight: "1100 g", badge: "Architectural Grade", tags: ["magnetic track", "lighting rail"]
  }),
  makeProduct({
    id: "p167", sku: "VM-LGT-P167-HAV", name: "Havells Adore K9 Crystal Wall Sconce Light Warm White",
    category: "Home & Living", brand: "Havells", price: 1699, mrp: 2299, discountPercent: 26, stock: 50, barcode: "8901000001672",
    vendorId: "v12", img1: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop",
    description: "Faceted optical K9 crystals cast shimmering refraction across foyer and bedroom walls. Rust-resistant electroplated champagne gold brass chassis.",
    specs: { "Socket": "G9 LED (Included)", "Finish": "Champagne Gold Electroplated", "Crystal": "Precision Cut K9 Optical Glass" },
    weight: "920 g", badge: "Premium Finish", tags: ["wall sconce", "crystal", "havells"]
  }),
  makeProduct({
    id: "p168", sku: "VM-LGT-P168-TUY", name: "Tuya Zigbee Smart Touch Dimmer Switch Tempered Glass",
    category: "Electronics", brand: "Lumina Studio", price: 1299, mrp: 1899, discountPercent: 32, stock: 75, barcode: "8901000001689",
    vendorId: "v12", img1: "https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop",
    description: "Replaces standard Indian 2-module switchboard slots. Capacitive slider touch bar provides 1% to 100% stepless smooth dimming without flicker.",
    specs: { "Standard": "Indian 2-Module Gang Box", "Load": "Max 400W LED", "Panel": "2.5D Scratch-Resistant Tempered Glass" },
    weight: "180 g", badge: "Smart Automation", tags: ["dimmer", "smart switch", "zigbee"]
  }),
  makeProduct({
    id: "p169", sku: "VM-LGT-P169-EVE", name: "Eveready 30W High-Lumen Outdoor Floodlight IP66",
    category: "Home & Living", brand: "Eveready", price: 850, mrp: 1199, discountPercent: 29, stock: 60, barcode: "8901000001696",
    vendorId: "v12", img1: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=600&h=600&fit=crop",
    description: "Heavy-duty die-cast aluminum housing for garden, facade, and parking illumination. Withstands torrential monsoon rain and 4kV surge protection.",
    specs: { "Protection": "IP66 Waterproof & Dustproof", "Wattage": "30W (3300 Lumens)", "Surge": "4kV Inbuilt Protection" },
    weight: "740 g", badge: "Heavy Duty", tags: ["floodlight", "outdoor", "waterproof"]
  }),
  makeProduct({
    id: "p170", sku: "VM-LGT-P170-EDI", name: "Vintage Edison Filament ST64 Amber Glass Bulb 4W E27",
    category: "Home & Living", brand: "Lumina Studio", price: 320, mrp: 499, discountPercent: 36, stock: 120, barcode: "8901000001702",
    vendorId: "v12", img1: "https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&h=600&fit=crop",
    description: "Retro spiral LED filaments encased in hand-blown golden amber teardrop glass. Emits a comforting 2200K candle-warm ambiance for cafes and homes.",
    specs: { "Color Temp": "2200K Golden Warm", "Wattage": "4W (Equivalent to 40W Incandescent)", "Shape": "ST64 Teardrop" },
    weight: "95 g", badge: "Vintage Aesthetic", tags: ["edison bulb", "filament", "warm light"]
  }),

  // v13: Himalayan Pure Organics (p171 - p180)
  makeProduct({
    id: "p171", sku: "VM-ORG-P171-HON", name: "Raw Wild Forest White Honey 500g NMR Tested",
    category: "Grocery", brand: "Himalayan Pure", price: 650, mrp: 850, discountPercent: 24, stock: 55, barcode: "8901000001719",
    vendorId: "v13", img1: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop",
    description: "Unprocessed, unheated raw wild flower nectar harvested from cliff bee hives in the Garhwal Himalayas. Creamy texture with natural pollen granules.",
    specs: { "Purity": "100% NMR Tested (Zero Added Sugars)", "Origin": "Garhwal, Uttarakhand", "Weight": "500 g" },
    weight: "780 g", badge: "NMR Certified", tags: ["honey", "raw honey", "himalayan"]
  }),
  makeProduct({
    id: "p172", sku: "VM-ORG-P172-GHE", name: "A2 Desi Gir Cow Vedic Bilona Ghee 1 Litre Glass Jar",
    category: "Grocery", brand: "Himalayan Pure", price: 2199, mrp: 2699, discountPercent: 19, stock: 40, barcode: "8901000001726",
    vendorId: "v13", img1: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
    description: "Prepared using traditional clay pot bilona churning of whole curd from grass-fed mountain cows. Golden granular aroma rich in butyric acid and Omega-3.",
    specs: { "Method": "Traditional Vedic Bilona (Curd Churned)", "Source": "Free-Grazing A2 Gir Cows", "Volume": "1000 ml" },
    weight: "1450 g", badge: "Vedic Bilona", tags: ["ghee", "a2 ghee", "bilona"]
  }),
  makeProduct({
    id: "p173", sku: "VM-ORG-P173-OIL", name: "Wood Cold-Pressed Yellow Mustard Oil (Kachi Ghani) 1L",
    category: "Grocery", brand: "Himalayan Pure", price: 380, mrp: 499, discountPercent: 24, stock: 85, barcode: "8901000001733",
    vendorId: "v13", img1: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
    description: "Extracted in traditional Mara Chekku wooden kolhus below 40°C. Sweet pungent aroma, naturally rich in MUFA and natural antioxidants.",
    specs: { "Extraction": "Cold-Pressed Wooden Ghani", "Seed": "Non-GMO Yellow Mustard", "Volume": "1000 ml" },
    weight: "1150 g", badge: "Cold-Pressed", tags: ["mustard oil", "kachi ghani", "cooking oil"]
  }),
  makeProduct({
    id: "p174", sku: "VM-ORG-P174-SLT", name: "Himalayan Pink Rock Salt Mineral Coarse Crystals 1kg",
    category: "Grocery", brand: "Himalayan Pure", price: 160, mrp: 220, discountPercent: 27, stock: 150, barcode: "8901000001740",
    vendorId: "v13", img1: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
    description: "Unrefined pink salt mined from pristine ancient sea beds containing 84 essential trace minerals including iron, magnesium, and potassium.",
    specs: { "Form": "Coarse Crystal Grain (For Salt Grinders)", "Purity": "100% Natural Unbleached", "Weight": "1000 g" },
    weight: "1050 g", badge: "84 Trace Minerals", tags: ["pink salt", "rock salt", "himalayan salt"]
  }),
  makeProduct({
    id: "p175", sku: "VM-ORG-P175-RAJ", name: "Pahadi Harsil Red-Speckled White Rajma 1kg",
    category: "Grocery", brand: "Himalayan Pure", price: 290, mrp: 380, discountPercent: 24, stock: 70, barcode: "8901000001757",
    vendorId: "v13", img1: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop",
    description: "Sourced from the scenic valleys of Harsil, Uttarkashi. Cooks tender without falling apart and produces a creamy, deeply savory gravy.",
    specs: { "Origin": "Harsil, Bhagirathi Valley (8,000 ft)", "Glazing": "Unpolished (Zero Wax)", "Weight": "1000 g" },
    weight: "1020 g", badge: "Valley Harvest", tags: ["rajma", "pulses", "organic"]
  }),
  makeProduct({
    id: "p176", sku: "VM-ORG-P176-ACV", name: "Raw Apple Cider Vinegar with Mother & Fenugreek 500ml",
    category: "Grocery", brand: "Himalayan Pure", price: 340, mrp: 450, discountPercent: 24, stock: 60, barcode: "8901000001764",
    vendorId: "v13", img1: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
    description: "Brewed from crunchy Kinnaur mountain apples, naturally fermented without pasteurization. Infused with methi (fenugreek) for metabolic balance.",
    specs: { "Acidity": "5% Natural Acidity", "Processing": "Unfiltered & Unpasteurized", "Volume": "500 ml" },
    weight: "820 g", badge: "Live Cultures", tags: ["acv", "apple cider vinegar", "gut health"]
  }),
  makeProduct({
    id: "p177", sku: "VM-ORG-P177-CHM", name: "Organic Whole Chamomile Flower Dried Herbal Infusion 100g",
    category: "Grocery", brand: "Himalayan Pure", price: 420, mrp: 550, discountPercent: 24, stock: 45, barcode: "8901000001771",
    vendorId: "v13", img1: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop",
    description: "Whole sun-dried matricaria chamomile blooms harvested from alpine herb beds. Soothing bedtime caffeine-free herbal tea with apple-like floral aroma.",
    specs: { "Form": "Intact Whole Dried Flowers", "Caffeine": "100% Caffeine Free", "Weight": "100 g" },
    weight: "180 g", badge: "Sleep & Calm", tags: ["chamomile", "herbal tea", "sleep"]
  }),
  makeProduct({
    id: "p178", sku: "VM-ORG-P178-CHI", name: "Certified Organic Black Chia Seeds 250g Zip Pouch",
    category: "Grocery", brand: "Himalayan Pure", price: 240, mrp: 320, discountPercent: 25, stock: 90, barcode: "8901000001788",
    vendorId: "v13", img1: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
    description: "Hydrophilic superfood seeds packed with dietary fiber, Omega-3 fatty acids, and plant protein. Perfect for puddings, smoothies, and overnight oats.",
    specs: { "Dietary Fiber": "38 g per 100g", "Purity": "99.9% Cleaned & Sortexed", "Weight": "250 g" },
    weight: "270 g", badge: "Superfood", tags: ["chia seeds", "fiber", "superfood"]
  }),
  makeProduct({
    id: "p179", sku: "VM-ORG-P179-ALM", name: "Cold-Pressed Sweet Kashmiri Almond Oil 200ml Glass Dropper",
    category: "Grocery", brand: "Himalayan Pure", price: 580, mrp: 750, discountPercent: 23, stock: 50, barcode: "8901000001795",
    vendorId: "v13", img1: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
    description: "Pure edible grade Rogan Badam Shirin pressed from sweet mamra almonds. Nourishing for brain development, infant massage, and radiant skin.",
    specs: { "Grade": "100% Edible & Therapeutic Grade", "Extraction": "First Cold Press", "Volume": "200 ml" },
    weight: "430 g", badge: "Therapeutic Grade", tags: ["almond oil", "badam rogan"]
  }),
  makeProduct({
    id: "p180", sku: "VM-ORG-P180-SHI", name: "Shilajit Pure Himalayan Soft Resin 20g Gold Grade",
    category: "Grocery", brand: "Himalayan Pure", price: 1450, mrp: 1999, discountPercent: 27, stock: 35, barcode: "8901000001801",
    vendorId: "v13", img1: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop",
    description: "Purified using traditional Shodhana Ayurvedic decoction. Yields over 80% fulvic acid with 84+ ionic minerals for cellular vitality, strength, and endurance.",
    specs: { "Fulvic Acid": ">80%", "Form": "Pure Soft Mineral Pitch Resin", "Weight": "20 g (With Measuring Spoon)" },
    weight: "160 g", badge: "Gold Grade Resin", tags: ["shilajit", "stamina", "ayurveda"]
  }),

  // v14: Aethelgard Leather Works (p181 - p190)
  makeProduct({
    id: "p181", sku: "VM-LTH-P181-LAP", name: "Vintage Full-Grain Leather 15.6\" Laptop Messenger Bag",
    category: "Fashion", brand: "Aethelgard", price: 4999, mrp: 6999, discountPercent: 29, stock: 25, barcode: "8901000001818",
    vendorId: "v14", img1: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    description: "Crafted from thick vegetable-tanned buffalo hide with antiqued solid brass hardware. Padded sleeve protects laptops up to 15.6 inches.",
    specs: { "Material": "100% Full-Grain Buffalo Hide", "Laptop Compatibility": "Up to 15.6 Inches", "Dimensions": "40 x 30 x 10 cm" },
    weight: "1450 g", badge: "Heirloom Grade", tags: ["leather bag", "messenger", "laptop bag"]
  }),
  makeProduct({
    id: "p182", sku: "VM-LTH-P182-DUF", name: "Handcrafted Weekend Buffalo Leather Duffle Bag 45L",
    category: "Fashion", brand: "Aethelgard", price: 6499, mrp: 8999, discountPercent: 28, stock: 18, barcode: "8901000001825",
    vendorId: "v14", img1: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
    description: "Spacious airline carry-on approved duffle with separate shoe compartment and reinforced water-resistant canvas lining.",
    specs: { "Capacity": "45 Litres", "Zippers": "YKK Solid Brass", "Carry": "Padded Removable Shoulder Strap" },
    weight: "1850 g", badge: "Travel Essential", tags: ["duffle bag", "leather", "weekend travel"]
  }),
  makeProduct({
    id: "p183", sku: "VM-LTH-P183-WAL", name: "Minimalist RFID-Blocking Bi-Fold Leather Cardholder Wallet",
    category: "Fashion", brand: "Aethelgard", price: 899, mrp: 1299, discountPercent: 31, stock: 70, barcode: "8901000001832",
    vendorId: "v14", img1: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
    description: "Slim 8mm profile wallet with 6 card slots, quick thumb-slide access, and electromagnetic RFID shielding against digital skimming.",
    specs: { "RFID Shielding": "13.56 MHz High-Frequency Protection", "Slots": "6 Cards + Cash Pocket", "Thickness": "8 mm" },
    weight: "95 g", badge: "Slim EDC", tags: ["wallet", "cardholder", "rfid"]
  }),
  makeProduct({
    id: "p184", sku: "VM-LTH-P184-BLT", name: "Vegetable-Tanned Full-Grain Brass Buckle Formal Belt 38mm",
    category: "Fashion", brand: "Aethelgard", price: 1450, mrp: 1999, discountPercent: 27, stock: 55, barcode: "8901000001849",
    vendorId: "v14", img1: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop",
    description: "One single piece of 3.8mm thick unbonded harness leather. No cracking or peeling. Solid single-cast brass prong buckle.",
    specs: { "Width": "38 mm (1.5 Inch)", "Thickness": "3.8 mm Single Ply", "Buckle": "Solid Cast Brushed Brass" },
    weight: "220 g", badge: "Lifetime Guarantee", tags: ["belt", "leather belt", "formal"]
  }),
  makeProduct({
    id: "p185", sku: "VM-LTH-P185-ORG", name: "Genuine Leather Tech Travel Cable & Charger Organizer Case",
    category: "Fashion", brand: "Aethelgard", price: 1250, mrp: 1699, discountPercent: 26, stock: 40, barcode: "8901000001856",
    vendorId: "v14", img1: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
    description: "Elastic loop compartments accommodate charging bricks, braided cables, flash drives, power banks, and wireless earbuds in organized elegance.",
    specs: { "Interior": "Soft Scratch-Proof Microfiber", "Hardware": "YKK Antique Brass", "Dimensions": "22 x 15 x 6 cm" },
    weight: "260 g", badge: "Tech Organizer", tags: ["tech pouch", "cable organizer"]
  }),
  makeProduct({
    id: "p186", sku: "VM-LTH-P186-KEY", name: "Horween Leather Key Clip Organizer with AirTag Holder",
    category: "Fashion", brand: "Aethelgard", price: 699, mrp: 999, discountPercent: 30, stock: 80, barcode: "8901000001863",
    vendorId: "v14", img1: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
    description: "Compact swivel screw design holds up to 6 keys noiselessly without pocket scratching. Integrated snug sleeve for Apple AirTag tracking.",
    specs: { "Key Capacity": "6 Keys", "Hardware": "Stainless Steel Fasteners", "AirTag Fit": "Precision Cutout" },
    weight: "65 g", badge: "Compact EDC", tags: ["keychain", "airtag", "leather"]
  }),
  makeProduct({
    id: "p187", sku: "VM-LTH-P187-PAS", name: "Rugged Leather Passport & Travel Document Wallet",
    category: "Fashion", brand: "Aethelgard", price: 1150, mrp: 1599, discountPercent: 28, stock: 45, barcode: "8901000001870",
    vendorId: "v14", img1: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop",
    description: "Holds two international passports, boarding pass foldouts, 4 credit cards, and a micro SIM / ejector pin in secure burnished leather slots.",
    specs: { "Slots": "Dual Passport + Boarding Pass Sleeve", "Stitching": "Hand-Waxed Nylon Thread", "Closure": "Hidden Magnetic Snap" },
    weight: "140 g", badge: "Frequent Flyer", tags: ["passport wallet", "travel"]
  }),
  makeProduct({
    id: "p188", sku: "VM-LTH-P188-PEN", name: "Slimline Leather Fountain Pen & Apple Pencil Case",
    category: "Fashion", brand: "Aethelgard", price: 499, mrp: 699, discountPercent: 29, stock: 65, barcode: "8901000001887",
    vendorId: "v14", img1: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
    description: "Protects high-end fountain pens or digital styluses from bag abrasions. Snug single-piece fold construction with burnished hand-dyed edges.",
    specs: { "Pen Length": "Up to 165 mm", "Material": "Full-Grain Cowhide", "Lining": "Suede" },
    weight: "45 g", badge: "Stationery Essential", tags: ["pen case", "pencil sleeve"]
  }),
  makeProduct({
    id: "p189", sku: "VM-LTH-P189-DSK", name: "Desk Mat Pure Hand-Stitched Cowhide Leather 90x40cm",
    category: "Home & Living", brand: "Aethelgard", price: 2199, mrp: 2999, discountPercent: 27, stock: 30, barcode: "8901000001894",
    vendorId: "v14", img1: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    description: "Transforms home office desks with rich natural leather scent. Smooth mouse tracking surface with non-slip suede bottom backing.",
    specs: { "Dimensions": "900 x 400 mm", "Thickness": "2.2 mm", "Backing": "Anti-Skid Natural Suede" },
    weight: "680 g", badge: "Workspace Upgrade", tags: ["desk mat", "leather pad", "workspace"]
  }),
  makeProduct({
    id: "p190", sku: "VM-LTH-P190-TOI", name: "Water-Resistant Hanging Leather Dopp Kit Toiletry Bag",
    category: "Fashion", brand: "Aethelgard", price: 1850, mrp: 2499, discountPercent: 26, stock: 35, barcode: "8901000001900",
    vendorId: "v14", img1: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
    description: "Equipped with an internal swivel hook to hang from hotel towel racks. Dual waterproof zippered compartments prevent toiletry spills.",
    specs: { "Interior Lining": "100% Waterproof TPU Coated Nylon", "Hardware": "Brass Hook & Pulls", "Dimensions": "25 x 16 x 12 cm" },
    weight: "480 g", badge: "Travel Master", tags: ["dopp kit", "toiletry bag", "leather"]
  }),

  // v15: Apex Pro Fitness (p191 - p200)
  makeProduct({
    id: "p191", sku: "VM-FIT-P191-DMB", name: "Quick-Dial Adjustable Dumbbells Pair (2.5kg to 24kg)",
    category: "Sports", brand: "Apex Pro", price: 14999, mrp: 19999, discountPercent: 25, stock: 20, barcode: "8901000001917",
    vendorId: "v15", img1: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop",
    description: "Replaces 15 pairs of dumbbells with a single dial turn mechanism. Heavy-duty interlocking steel plate mold with quiet rubber molding.",
    specs: { "Weight Range": "2.5 kg to 24 kg per dumbbell", "Increments": "15 Weight Settings", "Includes": "2 Dumbbells + Storage Trays" },
    weight: "51000 g", badge: "Home Gym Hero", tags: ["dumbbells", "adjustable dumbbells", "gym"]
  }),
  makeProduct({
    id: "p192", sku: "VM-FIT-P192-BAR", name: "Olympic Hard Chrome Barbell 20kg 7ft 1000lb Capacity",
    category: "Sports", brand: "Apex Pro", price: 8499, mrp: 11999, discountPercent: 29, stock: 25, barcode: "8901000001924",
    vendorId: "v15", img1: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop",
    description: "Machined from spring steel with 190,000 PSI tensile strength. Dual 4-needle bearings provide smooth rotation for Olympic snatches and cleans.",
    specs: { "Shaft Diameter": "28 mm", "Weight": "20 kg (44 lbs)", "Bearings": "8 Needle Bearings + Brass Bushings", "Knurling": "Volcano 1.2mm" },
    weight: "20500 g", badge: "IPF Spec", tags: ["barbell", "olympic bar", "powerlifting"]
  }),
  makeProduct({
    id: "p193", sku: "VM-FIT-P193-KTL", name: "Cast Iron Powder-Coated Kettlebell 16kg Competition Grade",
    category: "Sports", brand: "Apex Pro", price: 2499, mrp: 3299, discountPercent: 24, stock: 40, barcode: "8901000001931",
    vendorId: "v15", img1: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop",
    description: "Single-piece gravity cast iron with zero plastic fills. Textured matte powder coat holds chalk for high-rep swings, snatches, and Turkish get-ups.",
    specs: { "Weight": "16 kg (Yellow Band)", "Handle Diameter": "35 mm", "Finish": "Matte Anti-Slip Powder Coat" },
    weight: "16200 g", badge: "Single Cast Iron", tags: ["kettlebell", "strength", "fitness"]
  }),
  makeProduct({
    id: "p194", sku: "VM-FIT-P194-BNC", name: "Commercial Heavy-Duty Adjustable Workout Incline Bench",
    category: "Sports", brand: "Apex Pro", price: 7999, mrp: 10999, discountPercent: 27, stock: 15, barcode: "8901000001948",
    vendorId: "v15", img1: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop",
    description: "Laser-cut 11-gauge steel frame supporting up to 450 kg. Ladder adjustment system provides 7 backrest angles from decline to 90-degree shoulder press.",
    specs: { "Weight Capacity": "450 kg (1000 lbs)", "Angles": "-15° to 90° (7 Positions)", "Padding": "High-Density Recycled Bonded Foam" },
    weight: "26000 g", badge: "Heavy Commercial", tags: ["workout bench", "incline bench", "gym"]
  }),
  makeProduct({
    id: "p195", sku: "VM-FIT-P195-PUL", name: "Multi-Grip Wall-Mounted Heavy Duty Pull-Up & Chin-Up Bar",
    category: "Sports", brand: "Apex Pro", price: 2199, mrp: 2999, discountPercent: 27, stock: 35, barcode: "8901000001955",
    vendorId: "v15", img1: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop",
    description: "Features wide, narrow, neutral, and angled hand positions. Mounts onto solid brick or concrete with supplied high-tensile anchor bolts.",
    specs: { "Load Limit": "250 kg", "Grip Options": "4 Hand Grip Ergonomics", "Wall Distance": "50 cm Clearance" },
    weight: "8500 g", badge: "Calisthenics Pick", tags: ["pull up bar", "calisthenics", "fitness"]
  }),
  makeProduct({
    id: "p196", sku: "VM-FIT-P196-BMP", name: "High-Density Virgin Rubber Bumper Plates 10kg Pair",
    category: "Sports", brand: "Apex Pro", price: 4299, mrp: 5499, discountPercent: 22, stock: 30, barcode: "8901000001962",
    vendorId: "v15", img1: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop",
    description: "Standard 450mm IWF diameter bumper plates made with odorless virgin rubber. Stainless steel center ring fits all 50mm Olympic barbell sleeves.",
    specs: { "Plate Weight": "2 x 10 kg (20 kg Pair)", "Center Insert": "50.4 mm Stainless Steel", "Diameter": "450 mm Standard" },
    weight: "20200 g", badge: "Deadlift Approved", tags: ["bumper plates", "weights", "crossfit"]
  }),
  makeProduct({
    id: "p197", sku: "VM-FIT-P197-BAT", name: "Heavy PolyDacron Battle Rope 1.5\" x 30ft with Sleeve",
    category: "Sports", brand: "Apex Pro", price: 2850, mrp: 3800, discountPercent: 25, stock: 40, barcode: "8901000001979",
    vendorId: "v15", img1: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop",
    description: "3-strand twisted synthetic PolyDacron covered with high-tenacity nylon friction sleeve. Heavy heat-shrink handles for blister-free grip.",
    specs: { "Thickness": "38 mm (1.5 Inch)", "Length": "9.1 Meters (30 ft)", "Includes": "Wall Anchor Kit" },
    weight: "8200 g", badge: "HIIT Cardio", tags: ["battle rope", "hiit", "cardio"]
  }),
  makeProduct({
    id: "p198", sku: "VM-FIT-P198-HEX", name: "Hexagonal Rubber Encased Dumbbells 10kg Pair",
    category: "Sports", brand: "Apex Pro", price: 2999, mrp: 3999, discountPercent: 25, stock: 50, barcode: "8901000001986",
    vendorId: "v15", img1: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop",
    description: "Anti-roll hexagonal cast iron core encased in heavy vulcanized natural rubber. Contoured chrome-plated knurled grip handles.",
    specs: { "Weight": "2 x 10 kg", "Handle": "Ergonomic Chrome Knurl", "Head Style": "Anti-Roll Hexagonal" },
    weight: "20200 g", badge: "Durable Rubber", tags: ["hex dumbbells", "dumbbells", "weights"]
  }),
  makeProduct({
    id: "p199", sku: "VM-FIT-P199-MAT", name: "Non-Slip High-Density TPE 8mm Extra Thick Yoga Mat",
    category: "Sports", brand: "Apex Pro", price: 1299, mrp: 1799, discountPercent: 28, stock: 75, barcode: "8901000001993",
    vendorId: "v15", img1: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop",
    description: "Laser-engraved body alignment lines guide posture in warrior and downward-dog poses. 8mm dual-layer cushioning protects knees and joints.",
    specs: { "Thickness": "8 mm High Density", "Material": "Eco TPE (PVC & Latex Free)", "Dimensions": "183 x 61 cm" },
    weight: "980 g", badge: "Joint Cushion", tags: ["yoga mat", "tpe", "fitness"]
  }),
  makeProduct({
    id: "p200", sku: "VM-FIT-P200-CAG", name: "Commercial Power Rack Squat Cage with Pull-Up Bar",
    category: "Sports", brand: "Apex Pro", price: 28999, mrp: 39999, discountPercent: 28, stock: 8, barcode: "8901000002006",
    vendorId: "v15", img1: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop",
    description: "Engineered from 2x2 inch 12-gauge square steel tubing. Includes dual J-cups, full-length solid steel safety spotter pins, and plate storage horns.",
    specs: { "Load Capacity": "400 kg", "Uprights": "50 x 50 mm 12-Gauge Steel", "Footprint": "120 x 115 x 215 cm" },
    weight: "62000 g", badge: "Heavy Powerhouse", tags: ["squat rack", "power cage", "gym equipment"]
  }),

  // v16: Kaveri Silks (p201 - p210)
  makeProduct({
    id: "p201", sku: "VM-SLK-P201-KAN", name: "Pure Kanchipuram Silk Saree Royal Blue Gold Zari",
    category: "Fashion", brand: "Kaveri Silks", price: 14999, mrp: 19999, discountPercent: 25, stock: 15, barcode: "8901000002013",
    vendorId: "v16", img1: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop",
    description: "Authenticated with Silk Mark tag. Handwoven Korvai border with traditional Mayil (peacock) and Rudraksha zari motifs in pure silver thread.",
    specs: { "Certification": "Silk Mark India Certified", "Zari": "Silver Dipped Gold Zari", "Length": "6.2 Meters with Blouse" },
    weight: "850 g", badge: "Silk Mark Certified", tags: ["kanchipuram", "silk saree", "bridal"]
  }),
  makeProduct({
    id: "p202", sku: "VM-SLK-P202-CHA", name: "Handloom Chanderi Cotton Silk Saree Pastel Peach",
    category: "Fashion", brand: "Kaveri Silks", price: 3499, mrp: 4899, discountPercent: 29, stock: 35, barcode: "8901000002020",
    vendorId: "v16", img1: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop",
    description: "Sheer, airy handspun Chanderi fabric with delicate golden zari ashrafi butis. Exceptionally comfortable for warm daytime festivities.",
    specs: { "Weft & Warp": "Fine Cotton & Pure Mulberry Silk", "Feel": "Featherlight & Crisp", "Length": "6.3 Meters" },
    weight: "480 g", badge: "Handloom Mark", tags: ["chanderi", "saree", "handloom"]
  }),
  makeProduct({
    id: "p203", sku: "VM-SLK-P203-TUS", name: "Bhagalpuri Tussar Silk Saree Hand Block Printed Kalamkari",
    category: "Fashion", brand: "Kaveri Silks", price: 4999, mrp: 6999, discountPercent: 29, stock: 25, barcode: "8901000002037",
    vendorId: "v16", img1: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop",
    description: "Wild natural golden sheen tussar silk adorned with intricate natural vegetable dye Kalamkari tree-of-life motifs.",
    specs: { "Silk Type": "Wild Tussar / Kosa Silk", "Printing": "Hand Block Vegetable Dyes", "Length": "6.25 Meters" },
    weight: "580 g", badge: "Natural Dye", tags: ["tussar silk", "kalamkari", "saree"]
  }),
  makeProduct({
    id: "p204", sku: "VM-SLK-P204-LIN", name: "Pure Organic Linen Full-Sleeve Kurta for Men Ivory White",
    category: "Fashion", brand: "Kaveri Silks", price: 2299, mrp: 2999, discountPercent: 23, stock: 50, barcode: "8901000002044",
    vendorId: "v16", img1: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop",
    description: "Woven from 60 lea European flax linen yarn with a mandarin collar, mother-of-pearl buttons, and side slit pockets.",
    specs: { "Yarn": "60 Lea 100% Pure Flax Linen", "Buttons": "Natural Mother of Pearl", "Fit": "Regular Comfort Fit" },
    weight: "320 g", badge: "Pure Flax Linen", tags: ["linen kurta", "menswear", "ethnic"]
  }),
  makeProduct({
    id: "p205", sku: "VM-SLK-P205-STL", name: "Pure Mulberry Silk Stole Crimson Red with Hand-Tied Tassels",
    category: "Fashion", brand: "Kaveri Silks", price: 1850, mrp: 2499, discountPercent: 26, stock: 45, barcode: "8901000002051",
    vendorId: "v16", img1: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop",
    description: "Glossy double-sided woven mulberry silk scarf with a featherlight drape. Accentuates evening gowns or traditional kurtas with vibrant elegance.",
    specs: { "Dimensions": "70 x 200 cm", "Edge": "Hand-Twisted Fringe", "Fabric": "100% Mulberry Silk" },
    weight: "160 g", badge: "Silk Mark", tags: ["silk stole", "scarf", "luxury"]
  }),
  makeProduct({
    id: "p206", sku: "VM-SLK-P206-BAN", name: "Banarasi Katan Silk Brocade Bridal Dupatta Emerald Green",
    category: "Fashion", brand: "Kaveri Silks", price: 3999, mrp: 5499, discountPercent: 27, stock: 20, barcode: "8901000002068",
    vendorId: "v16", img1: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop",
    description: "Opulent Kadwa weave technique where each gold flower motif is individually hand-interlocked into the pure silk warp without loose float threads.",
    specs: { "Weave": "Kadwa Hand-Brocade", "Length": "2.5 Meters x 1 Meter", "Fabric": "Pure Katan Silk" },
    weight: "440 g", badge: "Bridal Heirloom", tags: ["banarasi", "dupatta", "brocade"]
  }),
  makeProduct({
    id: "p207", sku: "VM-SLK-P207-IKA", name: "Handcrafted Pochampally Ikat Mercerized Cotton Dress Material",
    category: "Fashion", brand: "Kaveri Silks", price: 1950, mrp: 2600, discountPercent: 25, stock: 40, barcode: "8901000002075",
    vendorId: "v16", img1: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop",
    description: "Geometrical tie-dye warp and weft double-ikat weaving from Bhoodan Pochampally, Telangana. Includes matching kurta, bottom, and dupatta fabric.",
    specs: { "Set": "Kurta (2.5m) + Bottom (2.0m) + Dupatta (2.4m)", "Fabric": "100% Combed Mercerized Cotton" },
    weight: "620 g", badge: "GI Certified", tags: ["ikat", "pochampally", "dress material"]
  }),
  makeProduct({
    id: "p208", sku: "VM-SLK-P208-CLU", name: "Raw Silk Box Clutch Evening Purse with Floral Zardozi",
    category: "Fashion", brand: "Kaveri Silks", price: 1299, mrp: 1799, discountPercent: 28, stock: 35, barcode: "8901000002082",
    vendorId: "v16", img1: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop",
    description: "Hard-shell rectangular minaudiere clutch upholstered in rich magenta raw silk and embroidered with French wire dabka zardozi.",
    specs: { "Closure": "Crystal Studded Push Clasp", "Includes": "Detachable Gold Chain Strap", "Dimensions": "19 x 12 x 5 cm" },
    weight: "360 g", badge: "Handmade Zardozi", tags: ["clutch", "purse", "zardozi"]
  }),
  makeProduct({
    id: "p209", sku: "VM-SLK-P209-MYS", name: "Traditional Mysore Crepe Silk Saree Maroon Contrast Pallu",
    category: "Fashion", brand: "Kaveri Silks", price: 7999, mrp: 10999, discountPercent: 27, stock: 22, barcode: "8901000002099",
    vendorId: "v16", img1: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop",
    description: "Supple 100% natural crepe de chine silk with distinctive pebbled texture and pure 0.65% real gold content zari borders.",
    specs: { "Weight of Saree": "540 g (Heavy Crepe)", "Silk": "Karnataka Silk Industries Standard", "Length": "6.2 Meters" },
    weight: "590 g", badge: "Mysore Silk", tags: ["mysore silk", "crepe saree"]
  }),
  makeProduct({
    id: "p210", sku: "VM-SLK-P210-NEH", name: "Khadi Handspun Nehru Bundi Jacket Midnight Blue",
    category: "Fashion", brand: "Kaveri Silks", price: 2499, mrp: 3499, discountPercent: 29, stock: 40, barcode: "8901000002105",
    vendorId: "v16", img1: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop",
    description: "Hand-spun and hand-woven khadi cotton jacket with a structured stand collar, five front brass buttons, and three jetted welt pockets.",
    specs: { "Weave": "Certified Handspun Khadi", "Lining": "Breathable Viscose Satin", "Style": "Nehru Bundi Sleeveless" },
    weight: "380 g", badge: "Authentic Khadi", tags: ["nehru jacket", "khadi", "menswear"]
  }),

  // v17: AutoCraft Pro Accessories (p211 - p220)
  makeProduct({
    id: "p211", sku: "VM-AUT-P211-DSH", name: "70mai A810 4K HDR Front & 1080p Rear Dual Dash Cam with GPS",
    category: "Automotive", brand: "70mai", price: 16999, mrp: 21999, discountPercent: 23, stock: 25, barcode: "8901000002112",
    vendorId: "v17", img1: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop",
    description: "Features Sony Starvis 2 IMX678 sensor for ultra-clear license plate capture in dark highway conditions. Built-in GPS logger and ADAS driver alerts.",
    specs: { "Sensor": "Sony STARVIS 2 IMX678", "Resolution": "4K UHD 3840x2160p 60FPS", "Parking Mode": "24h AI Motion Detection" },
    weight: "450 g", badge: "Flagship 4K", tags: ["dashcam", "70mai", "car camera"]
  }),
  makeProduct({
    id: "p212", sku: "VM-AUT-P212-INF", name: "Michelin Digital Preset Rapid Tyre Inflator 12V High Flow",
    category: "Automotive", brand: "Michelin", price: 3999, mrp: 4999, discountPercent: 20, stock: 45, barcode: "8901000002129",
    vendorId: "v17", img1: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=600&fit=crop",
    description: "Inflates a standard car tire from 0 to 35 PSI in under 3 minutes. Auto-stop digital display prevents over-inflation with ±1 PSI precision.",
    specs: { "Max Pressure": "150 PSI", "Display": "Backlit Digital LCD (PSI, BAR, kPa)", "Cord": "3.5m Power Cable + Brass Screw Valve" },
    weight: "1250 g", badge: "Michelin Certified", tags: ["tyre inflator", "car pump", "air compressor"]
  }),
  makeProduct({
    id: "p213", sku: "VM-AUT-P213-JMP", name: "70mai Emergency Car Jump Starter 11100mAh 600A Peak",
    category: "Automotive", brand: "70mai", price: 4899, mrp: 6499, discountPercent: 25, stock: 35, barcode: "8901000002136",
    vendorId: "v17", img1: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop",
    description: "Instantly cranks dead batteries for up to 4.0L petrol and 2.0L diesel engines. Doubles as a fast-charging power bank with an emergency LED flashlight.",
    specs: { "Battery Capacity": "11,100 mAh (41.07Wh)", "Peak Current": "600A", "Safety": "Short Circuit & Reverse Polarity Protection" },
    weight: "720 g", badge: "Emergency Must-Have", tags: ["jump starter", "car battery", "powerbank"]
  }),
  makeProduct({
    id: "p214", sku: "VM-AUT-P214-WAX", name: "Meguiar's Ultimate Ceramic Liquid Wax Hydrophobic 473ml",
    category: "Automotive", brand: "Meguiar's", price: 2199, mrp: 2899, discountPercent: 24, stock: 50, barcode: "8901000002143",
    vendorId: "v17", img1: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop",
    description: "Hybrid ceramic chemistry creates a hyper-slick SiO2 barrier on clear coats. Delivers extreme water beading and UV paint oxidation defense.",
    specs: { "Volume": "473 ml (16 fl oz)", "Technology": "SiO2 Hybrid Ceramic", "Application": "Manual Foam Pad or DA Polisher" },
    weight: "560 g", badge: "Extreme Beading", tags: ["ceramic wax", "meguiars", "car polish"]
  }),
  makeProduct({
    id: "p215", sku: "VM-AUT-P215-WSH", name: "Bosch EasyAquatak 120 Compact High Pressure Washer 1500W",
    category: "Automotive", brand: "Bosch", price: 7999, mrp: 10500, discountPercent: 24, stock: 20, barcode: "8901000002150",
    vendorId: "v17", img1: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&h=600&fit=crop",
    description: "120-bar operating pressure blasts away road grime from wheel wells and body panels with 350 L/h flow rate. Includes high-pressure detergent nozzle.",
    specs: { "Pressure": "120 Bar Max", "Motor Power": "1500W High Efficiency", "Hose Length": "5 Meters Heavy Duty" },
    weight: "4800 g", badge: "Bosch Professional", tags: ["pressure washer", "bosch", "car wash"]
  }),
  makeProduct({
    id: "p216", sku: "VM-AUT-P216-DUS", name: "Jopasu International Microfiber Car Duster Wax Treated",
    category: "Automotive", brand: "Jopasu", price: 899, mrp: 1199, discountPercent: 25, stock: 90, barcode: "8901000002167",
    vendorId: "v17", img1: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop",
    description: "Baked-on paraffin wax stranded microfiber head lifts dust without scratching paint. Cleans an entire SUV exterior in 2 minutes without water.",
    specs: { "Treatment": "Permanently Baked-in Wax Strands", "Handle": "Extendable Unbreakable ABS", "Washable": "Yes (Re-waxable)" },
    weight: "620 g", badge: "Auto Bestseller", tags: ["car duster", "jopasu", "cleaning"]
  }),
  makeProduct({
    id: "p217", sku: "VM-AUT-P217-CHG", name: "Baseus 65W USB-C PD 3.0 & QC 4.0 Dual Port Car Charger",
    category: "Electronics", brand: "Baseus", price: 1499, mrp: 1999, discountPercent: 25, stock: 65, barcode: "8901000002174",
    vendorId: "v17", img1: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&h=600&fit=crop",
    description: "Charges MacBooks and Dell XPS laptops at full 65W speed via 12V cigarette lighter port. Translucent chassis reveals ice-blue internal circuitry.",
    specs: { "Total Output": "65W Max Power Delivery", "Ports": "USB-C (65W) + USB-A (30W)", "Body": "Aluminum Alloy & Polycarbonate" },
    weight: "60 g", badge: "65W Laptop PD", tags: ["car charger", "fast charge", "usb-c"]
  }),
  makeProduct({
    id: "p218", sku: "VM-AUT-P218-MAT", name: "7D Custom-Molded All-Weather Waterproof Car Floor Mat Set",
    category: "Automotive", brand: "AutoCraft", price: 3499, mrp: 4999, discountPercent: 30, stock: 30, barcode: "8901000002181",
    vendorId: "v17", img1: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&h=600&fit=crop",
    description: "7-layer constructed car floor liners with detachable curly grass matting for mud and rain protection. Laser scanned fit with anti-skid backing.",
    specs: { "Construction": "7-Layer EVA + Leatherette + Grass Mat", "Coverage": "Edge-to-Edge Raised Borders", "Set": "Front & Rear Rows" },
    weight: "4200 g", badge: "Custom 7D", tags: ["floor mats", "car mats", "7d"]
  }),
  makeProduct({
    id: "p219", sku: "VM-AUT-P219-SHM", name: "Wavex Wonder Wash Carnauba Wax High-Foam Shampoo 5L",
    category: "Automotive", brand: "Wavex", price: 1199, mrp: 1600, discountPercent: 25, stock: 45, barcode: "8901000002198",
    vendorId: "v17", img1: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=600&fit=crop",
    description: "pH-neutral snow foam wash enriched with genuine carnauba wax. Gently loosens abrasive dirt without stripping existing wax or sealant coatings.",
    specs: { "Volume": "5 Litres Bulk Can", "pH Level": "7.0 (Neutral)", "Dilution Ratio": "1:200 for Foam Cannon" },
    weight: "5300 g", badge: "Pro Detailer", tags: ["car shampoo", "snow foam", "car wash"]
  }),
  makeProduct({
    id: "p220", sku: "VM-AUT-P220-LED", name: "Philips Ultinon Pro9000 LED Headlight Bulb Set H7 5800K",
    category: "Automotive", brand: "Philips", price: 6499, mrp: 8999, discountPercent: 28, stock: 25, barcode: "8901000002204",
    vendorId: "v17", img1: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop",
    description: "Provides up to 250% brighter beam cut-off on night highways without blinding oncoming traffic. Lumileds TopContact LEDs with AirCool heat dissipation.",
    specs: { "Socket": "H7 (12V / 24V Compatible)", "Color Temp": "5800K Crisp White", "Lifespan": "Up to 5,000 Hours" },
    weight: "340 g", badge: "250% Brighter", tags: ["headlight", "led bulb", "philips"]
  }),

  // v18: NourishBotanica Ayurveda (p221 - p230)
  makeProduct({
    id: "p221", sku: "VM-BOT-P221-KUM", name: "Authentic Kumkumadi Miraculous Beauty Fluid 30ml",
    category: "Beauty", brand: "NourishBotanica", price: 1850, mrp: 2400, discountPercent: 23, stock: 50, barcode: "8901000002211",
    vendorId: "v18", img1: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
    description: "Ayurvedic classical formulation cooked for 72 hours with Kashmiri saffron, red sandalwood, vetiver, and goat's milk to illuminate skin tone.",
    specs: { "Key Herb": "Kashmiri Crocus Sativus (Saffron)", "Base": "Pure Sesame Seed Oil", "Volume": "30 ml" },
    weight: "140 g", badge: "100% Ayurvedic", tags: ["kumkumadi", "face oil", "saffron serum"]
  }),
  makeProduct({
    id: "p222", sku: "VM-BOT-P222-BRI", name: "Bringadi Intensive Scalp & Hair Fall Treatment Oil 200ml",
    category: "Beauty", brand: "NourishBotanica", price: 899, mrp: 1199, discountPercent: 25, stock: 80, barcode: "8901000002228",
    vendorId: "v18", img1: "https://images.unsplash.com/photo-1608248597359-00998f48354c?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop",
    description: "Infused with Bhringraj, Amla, and Indigo leaves boiled in virgin coconut milk to revitalize dormant follicles and prevent premature graying.",
    specs: { "Herbal Actives": "Bhringraj, Indigo, Cardamom, Amla", "Base": "Kerala Virgin Coconut Oil", "Volume": "200 ml" },
    weight: "260 g", badge: "Hair Revitalizer", tags: ["hair oil", "bhringraj", "hair fall"]
  }),
  makeProduct({
    id: "p223", sku: "VM-BOT-P223-ROS", name: "Pure Kashmiri Rose Water Hydro-Steam Distilled 200ml",
    category: "Beauty", brand: "NourishBotanica", price: 499, mrp: 650, discountPercent: 23, stock: 95, barcode: "8901000002235",
    vendorId: "v18", img1: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop",
    description: "Hydro-distilled from freshly plucked Rosa Damascena petals in traditional copper deg-bhapka stills. Balances facial pH and cools tired eyes.",
    specs: { "Botanical": "Rosa Damascena", "Method": "Steam Distillation (Deg-Bhapka)", "Alcohol": "0% Alcohol & Preservative Free" },
    weight: "280 g", badge: "Pure Steam Distilled", tags: ["rose water", "toner", "skincare"]
  }),
  makeProduct({
    id: "p224", sku: "VM-BOT-P224-NIA", name: "Clinical Niacinamide 10% + Zinc 1% Blemish Recovery Serum 30ml",
    category: "Beauty", brand: "NourishBotanica", price: 549, mrp: 699, discountPercent: 21, stock: 70, barcode: "8901000002242",
    vendorId: "v18", img1: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1608248597359-00998f48354c?w=600&h=600&fit=crop",
    description: "Regulates sebum production, tightens enlarged pores, and lightens post-inflammatory hyperpigmentation with high-purity Vitamin B3.",
    specs: { "Active Ingredients": "10% Niacinamide + 1% Zinc PCA", "pH Range": "5.0 - 5.5", "Skin Type": "Oily / Acne-Prone" },
    weight: "110 g", badge: "Clinical Actives", tags: ["niacinamide", "serum", "acne"]
  }),
  makeProduct({
    id: "p225", sku: "VM-BOT-P225-SUN", name: "Mineral Matte Sunscreen SPF 50 PA++++ Invisible Shield 50g",
    category: "Beauty", brand: "NourishBotanica", price: 699, mrp: 899, discountPercent: 22, stock: 85, barcode: "8901000002259",
    vendorId: "v18", img1: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop",
    description: "100% zinc oxide physical mineral sunscreen leaves zero white cast on brown skin tones. Enriched with blue light defense and centella asiatica.",
    specs: { "Broad Spectrum": "SPF 50+ PA++++", "Filters": "Zinc Oxide Micronized (Non-Nano)", "Finish": "Oil-Free Ultra-Matte" },
    weight: "90 g", badge: "Zero White Cast", tags: ["sunscreen", "spf 50", "mineral sunscreen"]
  }),
  makeProduct({
    id: "p226", sku: "VM-BOT-P226-UBT", name: "Kashmiri Saffron & Wild Sandalwood Radiance Face Ubtan 100g",
    category: "Beauty", brand: "NourishBotanica", price: 650, mrp: 850, discountPercent: 24, stock: 60, barcode: "8901000002266",
    vendorId: "v18", img1: "https://images.unsplash.com/photo-1608248597359-00998f48354c?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
    description: "Exfoliating micro-ground chickpea flour blended with wild turmeric (kasturi manjal), neem, and pure chandan for weekly radiance facials.",
    specs: { "Ingredients": "Sandalwood, Saffron, Kasturi Manjal, Almond Flour", "Form": "Dry Powder (Mix with Rose Water)", "Weight": "100 g" },
    weight: "180 g", badge: "Wedding Radiance", tags: ["ubtan", "face pack", "ayurveda"]
  }),
  makeProduct({
    id: "p227", sku: "VM-BOT-P227-NIG", name: "Gotu Kola & Hyaluronic Acid Overnight Peptide Repair Crème 50g",
    category: "Beauty", brand: "NourishBotanica", price: 1199, mrp: 1599, discountPercent: 25, stock: 45, barcode: "8901000002273",
    vendorId: "v18", img1: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
    description: "Velvety night cream powered by Brahmi (Gotu Kola) to stimulate collagen synthesis while multi-molecular hyaluronic acid plumps fine lines.",
    specs: { "Key Actives": "Centella Asiatica + Multi-Molecular HA + Peptides", "Texture": "Rich Cushion Crème", "Volume": "50 g" },
    weight: "220 g", badge: "Collagen Booster", tags: ["night cream", "anti aging", "gotu kola"]
  }),
  makeProduct({
    id: "p228", sku: "VM-BOT-P228-COC", name: "Cold-Pressed Extra Virgin Coconut Oil from Kerala 500ml",
    category: "Beauty", brand: "NourishBotanica", price: 399, mrp: 520, discountPercent: 23, stock: 75, barcode: "8901000002280",
    vendorId: "v18", img1: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1608248597359-00998f48354c?w=600&h=600&fit=crop",
    description: "Extracted from fresh raw coconut milk within 2 hours of husking. Retains fresh tropical aroma and high lauric acid content for hair and skin.",
    specs: { "Source": "Centrifuged Fresh Coconut Milk", "Color": "Crystal Clear (Non-Rancid)", "Volume": "500 ml" },
    weight: "680 g", badge: "Raw Virgin", tags: ["coconut oil", "hair care", "kerala"]
  }),
  makeProduct({
    id: "p229", sku: "VM-BOT-P229-WSH", name: "Activated Bamboo Charcoal & Tea Tree Deep Pore Face Wash 150ml",
    category: "Beauty", brand: "NourishBotanica", price: 380, mrp: 499, discountPercent: 24, stock: 80, barcode: "8901000002297",
    vendorId: "v18", img1: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
    description: "Sulfate-free micro-foaming cleanser traps pollution particulates and dissolves stubborn blackhead buildup without stripping natural lipids.",
    specs: { "Surfactants": "100% Coconut Derived Mild Glucosides", "Sulfate / Paraben": "0% Harsh Chemicals", "Volume": "150 ml" },
    weight: "190 g", badge: "Deep Cleansing", tags: ["face wash", "charcoal", "tea tree"]
  }),
  makeProduct({
    id: "p230", sku: "VM-BOT-P230-VET", name: "Pure Khus (Vetiver) Root Water Hydrosol Facial Mist 100ml",
    category: "Beauty", brand: "NourishBotanica", price: 450, mrp: 599, discountPercent: 25, stock: 65, barcode: "8901000002303",
    vendorId: "v18", img1: "https://images.unsplash.com/photo-1608248597359-00998f48354c?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
    description: "Earthy, grounding aroma distilled from wild vetiver grass roots. Acts as a natural astringent to minimize pores and soothe irritated summer skin.",
    specs: { "Botanical": "Chrysopogon Zizanioides (Vetiver)", "Packaging": "Amber Glass Spray Bottle", "Volume": "100 ml" },
    weight: "210 g", badge: "Cooling Mist", tags: ["vetiver mist", "khus", "facial toner"]
  }),

  // v19: Crestview Eyewear (p231 - p240)
  makeProduct({
    id: "p231", sku: "VM-EYE-P231-AVI", name: "Japanese Beta-Titanium Ultralight Aviator Spectacles",
    category: "Fashion", brand: "Crestview", price: 3499, mrp: 4999, discountPercent: 30, stock: 35, barcode: "8901000002310",
    vendorId: "v19", img1: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
    description: "Weighing only 12 grams, crafted from aerospace beta-titanium that bends and snaps back into shape. Screwless cylinder hinges for lifelong durability.",
    specs: { "Weight": "12.4 Grams (Ultralight)", "Material": "Pure Japanese Beta-Titanium", "Frame Size": "52-19-145 mm" },
    weight: "180 g", badge: "Ultralight 12g", tags: ["titanium spectacles", "eyewear", "glasses"]
  }),
  makeProduct({
    id: "p232", sku: "VM-EYE-P232-WAY", name: "Polarized TR90 Matte Black Wayfarer Sunglasses UV400",
    category: "Fashion", brand: "Crestview", price: 1699, mrp: 2499, discountPercent: 32, stock: 60, barcode: "8901000002327",
    vendorId: "v19", img1: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop",
    description: "TAC polarized lenses eliminate harsh glare from wet roads and water surfaces. Flexible Swiss memory TR90 polymer frames resist high drops.",
    specs: { "Lenses": "9-Layer HD TAC Polarized", "UV Protection": "100% UV400 (UVA & UVB)", "Frame": "Swiss Grilamid TR90" },
    weight: "160 g", badge: "Polarized HD", tags: ["sunglasses", "polarized", "wayfarer"]
  }),
  makeProduct({
    id: "p233", sku: "VM-EYE-P233-BLU", name: "Zero-Power Blue Light Filter Glasses for Digital Screens",
    category: "Fashion", brand: "Crestview", price: 999, mrp: 1499, discountPercent: 33, stock: 90, barcode: "8901000002334",
    vendorId: "v19", img1: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
    description: "Filters 90% of harmful blue-violet light emitted by laptops, smartphones, and monitors. Relieves digital eye strain and prevents dry eyes.",
    specs: { "Blue Light Cut": "90% at 415-455nm Spectrum", "Coating": "Anti-Reflective Hydrophobic", "Power": "Zero Power (Plano)" },
    weight: "140 g", badge: "Screen Defense", tags: ["computer glasses", "blue light", "anti glare"]
  }),
  makeProduct({
    id: "p234", sku: "VM-EYE-P234-TOR", name: "Handcrafted Tortoise Shell Round Acetate Eyeglass Frame",
    category: "Fashion", brand: "Crestview", price: 2499, mrp: 3499, discountPercent: 29, stock: 40, barcode: "8901000002341",
    vendorId: "v19", img1: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop",
    description: "Machined from Italian Mazzucchelli cellulose acetate blocks with wire core temples. Hand-polished over 72 hours for deep lustrous tortoiseshell depth.",
    specs: { "Material": "Italian Mazzucchelli Cellulose Acetate", "Hinges": "5-Barrel German Riveted", "Shape": "Classic P3 Round" },
    weight: "175 g", badge: "Handmade Acetate", tags: ["acetate frames", "tortoiseshell", "glasses"]
  }),
  makeProduct({
    id: "p235", sku: "VM-EYE-P235-CLB", name: "Clubmaster Semi-Rimless Vintage Acetate & Gold Alloy Frames",
    category: "Fashion", brand: "Crestview", price: 2199, mrp: 2999, discountPercent: 27, stock: 45, barcode: "8901000002358",
    vendorId: "v19", img1: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
    description: "The iconic 1950s browline silhouette featuring glossy black acetate upper rims accented by engraved monel metal lower frames.",
    specs: { "Bridge": "Adjustable Soft Silicone Nose Pads", "Width": "50 mm Eye Size", "Finish": "Polished Black & Gold" },
    weight: "165 g", badge: "Classic Browline", tags: ["clubmaster", "retro glasses", "vintage"]
  }),
  makeProduct({
    id: "p236", sku: "VM-EYE-P236-SPO", name: "Sports Wrap-Around Polarized Sunglasses for Cycling & Running",
    category: "Sports", brand: "Crestview", price: 1899, mrp: 2699, discountPercent: 30, stock: 50, barcode: "8901000002365",
    vendorId: "v19", img1: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop",
    description: "Curved 8-base panoramic wrap protects eyes from wind, dust, and side peripheral glare. Hydrophilic rubber nose pads grip tighter as you sweat.",
    specs: { "Lens Geometry": "8-Base Panoramic Shield", "Ventilation": "Anti-Fog Aerodynamic Brow Ports", "Nosepad": "Unobtainium Anti-Slip Rubber" },
    weight: "145 g", badge: "Sports Performance", tags: ["sports sunglasses", "cycling", "running"]
  }),
  makeProduct({
    id: "p237", sku: "VM-EYE-P237-RIM", name: "Rimless Flexible Memory Metal Lightweight Eyeglasses Silver",
    category: "Fashion", brand: "Crestview", price: 2899, mrp: 3999, discountPercent: 28, stock: 30, barcode: "8901000002372",
    vendorId: "v19", img1: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
    description: "Minimalist three-piece rimless design mounts directly into prescription lenses. Super-elastic Nitinol memory alloy temples twist 360 degrees without snapping.",
    specs: { "Frame Type": "3-Piece Drill Mount Rimless", "Temple Metal": "Nitinol Shape-Memory Alloy", "Weight": "9.8 Grams" },
    weight: "150 g", badge: "Zero Frame Weight", tags: ["rimless", "memory metal", "glasses"]
  }),
  makeProduct({
    id: "p238", sku: "VM-EYE-P238-TRA", name: "Photochromic Light-Adaptive Transition Frame Glasses",
    category: "Fashion", brand: "Crestview", price: 3199, mrp: 4499, discountPercent: 29, stock: 40, barcode: "8901000002389",
    vendorId: "v19", img1: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop",
    description: "Clear indoors, transforms into dark sunglasses within 30 seconds of stepping under sunlight UV rays. The only pair of glasses you need all day.",
    specs: { "Adaptive Range": "Category 0 (Indoor Clear) to Category 3 (Dark Outdoor)", "Activation Time": "<30 Seconds" },
    weight: "160 g", badge: "Indoor & Outdoor", tags: ["transition glasses", "photochromic", "spectacles"]
  }),
  makeProduct({
    id: "p239", sku: "VM-EYE-P239-REA", name: "Ultra-Slim Foldable Pocket Reading Glasses +2.00 Case",
    category: "Fashion", brand: "Crestview", price: 799, mrp: 1199, discountPercent: 33, stock: 75, barcode: "8901000002396",
    vendorId: "v19", img1: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
    description: "Telescopic temples fold flat into a 9mm slim aluminum pod that slips into coin pockets or attaches to keyrings. Crystal clear optical grade lenses.",
    specs: { "Power": "+2.00 Diopters", "Case Profile": "9 mm Ultra-Slim Aluminum Capsule", "Mechanism": "Telescopic Folding Temples" },
    weight: "85 g", badge: "Pocket Portable", tags: ["reading glasses", "pocket glasses", "readers"]
  }),
  makeProduct({
    id: "p240", sku: "VM-EYE-P240-CLO", name: "Optical High-Density Microfiber Lens Cleaning Cloth 5-Pack",
    category: "Fashion", brand: "Crestview", price: 299, mrp: 450, discountPercent: 34, stock: 120, barcode: "8901000002402",
    vendorId: "v19", img1: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
    description: "Silky 250 GSM micro-weave wipes away fingerprint smudges, oils, and moisture from camera lenses, spectacles, and touchscreens without lint.",
    specs: { "Quantity": "5 Individual Wrapped Cloths", "Size": "18 x 15 cm", "Material": "High Density 250 GSM Microfiber" },
    weight: "75 g", badge: "Lint-Free Essential", tags: ["lens cloth", "microfiber", "cleaning"]
  }),

  // v20: Artisanal Brew & Barware (p241 - p250)
  makeProduct({
    id: "p241", sku: "VM-COF-P241-GRN", name: "Timemore Chestnut C2 High-Precision Aluminum Hand Grinder",
    category: "Home & Living", brand: "Timemore", price: 4999, mrp: 6499, discountPercent: 23, stock: 30, barcode: "8901000002419",
    vendorId: "v20", img1: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    description: "CNC-machined stainless steel conical burrs deliver uniform particle distribution from fine espresso to coarse French press. Dual-bearing shaft stabilization.",
    specs: { "Burrs": "38 mm CNC High Carbon Stainless Steel", "Capacity": "25g Beans", "Body": "Checkered Non-Slip Aluminum" },
    weight: "520 g", badge: "Barista Choice", tags: ["coffee grinder", "hand grinder", "timemore"]
  }),
  makeProduct({
    id: "p242", sku: "VM-COF-P242-V60", name: "Hario V60 Ceramic Pour-Over Coffee Dripper Size 02 White",
    category: "Home & Living", brand: "Hario", price: 1899, mrp: 2499, discountPercent: 24, stock: 45, barcode: "8901000002426",
    vendorId: "v20", img1: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop",
    description: "Made in Arita, Japan with 400-year pottery heritage. Internal spiral ribs allow water to penetrate coffee bed evenly for clean, nuanced extraction.",
    specs: { "Size": "02 (1 - 4 Cups)", "Material": "High-Grade Japanese Ceramic (Arita Yaki)", "Dishwasher Safe": "Yes" },
    weight: "440 g", badge: "Made in Japan", tags: ["hario v60", "pour over", "coffee dripper"]
  }),
  makeProduct({
    id: "p243", sku: "VM-COF-P243-FRP", name: "Borosilicate Glass French Press Coffee Plunger 600ml Copper",
    category: "Home & Living", brand: "Artisanal Brew", price: 1299, mrp: 1799, discountPercent: 28, stock: 55, barcode: "8901000002433",
    vendorId: "v20", img1: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    description: "Thermal shock-resistant borosilicate carafe encased in an electroplated copper steel frame. 4-level filtration system prevents gritty coffee silt.",
    specs: { "Capacity": "600 ml (4 Cups)", "Glass": "Heat Resistant Borosilicate (-20°C to 150°C)", "Filter": "Double Stainless Steel Mesh" },
    weight: "580 g", badge: "Rich Body Coffee", tags: ["french press", "coffee maker", "plunger"]
  }),
  makeProduct({
    id: "p244", sku: "VM-COF-P244-KTL", name: "Stainless Steel Gooseneck Drip Kettle with Thermometer 1L",
    category: "Home & Living", brand: "Artisanal Brew", price: 2199, mrp: 2999, discountPercent: 27, stock: 40, barcode: "8901000002440",
    vendorId: "v20", img1: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop",
    description: "Slender 6mm curved spout provides precise 90-degree laminar water flow control. Built-in lid dial displays optimal 90°C–96°C brewing window.",
    specs: { "Capacity": "1000 ml", "Integrated Gauge": "Bimetallic Celsius & Fahrenheit Dial", "Stovetop Compatible": "Gas, Induction, Electric" },
    weight: "620 g", badge: "Precision Flow", tags: ["gooseneck kettle", "pour over", "coffee kettle"]
  }),
  makeProduct({
    id: "p245", sku: "VM-COF-P245-MOK", name: "Classic Moka Express 6-Cup Stovetop Espresso Pot",
    category: "Home & Living", brand: "Artisanal Brew", price: 1999, mrp: 2699, discountPercent: 26, stock: 50, barcode: "8901000002457",
    vendorId: "v20", img1: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    description: "Octagonal aluminum design diffuses heat evenly to extract bold, rich, crema-topped stovetop espresso in 4 minutes flat.",
    specs: { "Yield": "6 Espresso Cups (300 ml)", "Safety Valve": "Patented Pressure Release Valve", "Handle": "Ergonomic Heat-Resistant Bakelite" },
    weight: "590 g", badge: "Stovetop Espresso", tags: ["moka pot", "espresso", "coffee"]
  }),
  makeProduct({
    id: "p246", sku: "VM-COF-P246-GLS", name: "Double-Walled Insulated Borosilicate Latte Glasses 350ml Pair",
    category: "Home & Living", brand: "Artisanal Brew", price: 899, mrp: 1299, discountPercent: 31, stock: 65, barcode: "8901000002464",
    vendorId: "v20", img1: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop",
    description: "Suspends your cappuccino or macchiato in mid-air. Thermal air pocket keeps hot drinks steaming while exterior glass stays cool to touch with zero condensation.",
    specs: { "Set": "Pair of 2 Glasses", "Capacity": "350 ml each", "Thermal Shock Resistance": "Up to 150°C" },
    weight: "360 g", badge: "Floating Latte", tags: ["double wall glasses", "latte cups", "coffee mug"]
  }),
  makeProduct({
    id: "p247", sku: "VM-COF-P247-BAR", name: "Professional Stainless Steel Boston Cocktail Shaker Set 8-Piece",
    category: "Home & Living", brand: "Artisanal Brew", price: 2499, mrp: 3499, discountPercent: 29, stock: 35, barcode: "8901000002471",
    vendorId: "v20", img1: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    description: "Includes weighted 28oz & 18oz shaker tins, Hawthorne strainer, Japanese jigger (30/60ml), spiral bar spoon, muddler, and ice tongs in brushed steel.",
    specs: { "Grade": "Food Grade 304 (18/8) Stainless Steel", "Pieces": "8 Essential Bartender Tools", "Seal": "Watertight Thermal Fit" },
    weight: "920 g", badge: "Mixology Pro", tags: ["cocktail shaker", "barware", "bartender kit"]
  }),
  makeProduct({
    id: "p248", sku: "VM-COF-P248-WHI", name: "Twisted Heavy-Base Old Fashioned Crystal Whiskey Tumblers Set of 4",
    category: "Home & Living", brand: "Artisanal Brew", price: 1699, mrp: 2399, discountPercent: 29, stock: 45, barcode: "8901000002488",
    vendorId: "v20", img1: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    description: "Heavy weighted base with twisted spiral facet cuts that refract amber whiskey tones. Lead-free crystal glasses with 300ml capacity for large ice spheres.",
    specs: { "Set": "4 Crystal Tumblers", "Capacity": "300 ml each", "Weight Per Glass": "380 Grams (Solid Heavy Base)" },
    weight: "1650 g", badge: "Lead-Free Crystal", tags: ["whiskey glasses", "crystal tumblers", "barware"]
  }),
  makeProduct({
    id: "p249", sku: "VM-COF-P249-AER", name: "AeroPress Original Coffee & Espresso Maker System with 350 Filters",
    category: "Home & Living", brand: "AeroPress", price: 3899, mrp: 4999, discountPercent: 22, stock: 35, barcode: "8901000002495",
    vendorId: "v20", img1: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop",
    description: "Rapid total immersion brewing yields rich coffee without bitterness or acidity. Compact, shatterproof travel companion with 350 micro-filters included.",
    specs: { "Brews": "American, Cold Brew, or Espresso Style", "Prep Time": "1 Minute Press", "Includes": "Chamber, Plunger, Stirrer, Scoop, 350 Filters" },
    weight: "480 g", badge: "Iconic Coffee Tool", tags: ["aeropress", "coffee maker", "travel coffee"]
  }),
  makeProduct({
    id: "p250", sku: "VM-COF-P250-SCL", name: "Digital Precision Barista Gram Scale with Built-in Timer 0.1g",
    category: "Home & Living", brand: "Artisanal Brew", price: 1799, mrp: 2499, discountPercent: 28, stock: 50, barcode: "8901000002501",
    vendorId: "v20", img1: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop", img2: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    description: "Essential for exact coffee-to-water brew ratios. High-precision strain gauge provides 0.1g increments with integrated countdown extraction timer.",
    specs: { "Accuracy": "0.1 g (Max Capacity 3000g)", "Display": "Dual Timer & Weight Backlit LED", "Includes": "Heat-Resistant Silicone Mat" },
    weight: "340 g", badge: "0.1g Precision", tags: ["coffee scale", "kitchen scale", "barista scale"]
  })
];

export { additionalVendors, additionalProducts };
