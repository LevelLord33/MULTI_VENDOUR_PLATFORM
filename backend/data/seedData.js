// ─────────────────────────────────────────────
//  Vendor Hub · Multi-Vendor Physical Marketplace Seed Data
//  10 Verified Merchants · 150 Catalog SKUs (15 per vendor)
// ─────────────────────────────────────────────

export const ADMIN_CREDENTIALS = {
  "email": "admin@vendour.com",
  "password": "Admin@1234",
  "name": "Platform Admin"
};

// ── 10 Physical Merchants ────────────────────────
export const seedVendors = [
  {
    "id": "v1",
    "businessName": "TechZone Electronics",
    "storeSlug": "techzone",
    "tagline": "Premier Destination for Flagship Tech, Audio & Wearables with Express Dispatch",
    "ownerName": "Rajesh Kumar",
    "email": "rajesh@techzone.in",
    "password": "Vendor@123",
    "mobile": "9876543210",
    "businessAddress": "14, Electronics Street, Nehru Place",
    "location": "New Delhi, Delhi",
    "joinedDate": "2024-01-15",
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop",
    "banner": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=300&fit=crop",
    "themeColor": "#4F46E5",
    "themePreset": "indigo",
    "storeStatus": "published",
    "isVerified": true,
    "gstin": "07AABCT1234F1Z8",
    "announcement": "\u26a1 Same-Day Courier Dispatch across India & 1-Year Direct Brand Warranty!",
    "featuredProductIds": [
      "p1",
      "p2",
      "p3",
      "p4"
    ],
    "storeRating": 4.8,
    "totalOrdersFulfilled": 1240,
    "onTimeDispatchRate": "98.8%",
    "shippingPartners": [
      "BlueDart Express",
      "Delhivery Surface",
      "DTDC Air"
    ],
    "returnPolicy": "7 Days Hassle-Free Physical Replacement or Full Refund",
    "warrantyPolicy": "100% Verified Brand Warranty & Tax Invoice Included",
    "description": "Official verified physical retail store of TechZone Electronics. We stock 100% genuine consumer electronics with same-day warehouse dispatch."
  },
  {
    "id": "v2",
    "businessName": "StyleHub Fashion",
    "storeSlug": "stylehub",
    "tagline": "Curated Contemporary Apparel, Pure Silk Sarees & Handcrafted Footwear",
    "ownerName": "Priya Sharma",
    "email": "priya@stylehub.in",
    "password": "Vendor@123",
    "mobile": "9123456789",
    "businessAddress": "5, Fashion Lane, Linking Road, Bandra West",
    "location": "Mumbai, Maharashtra",
    "joinedDate": "2024-02-20",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop",
    "banner": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=300&fit=crop",
    "themeColor": "#EC4899",
    "themePreset": "rose",
    "storeStatus": "published",
    "isVerified": true,
    "gstin": "27AABCS5678G2Z1",
    "announcement": "\u2728 Festive Collection Live: Complimentary Garment Care Kit on orders above \u20b92,499!",
    "featuredProductIds": [
      "p16",
      "p17",
      "p18",
      "p19"
    ],
    "storeRating": 4.8,
    "totalOrdersFulfilled": 1555,
    "onTimeDispatchRate": "99.1%",
    "shippingPartners": [
      "BlueDart Express",
      "Delhivery Surface",
      "DTDC Air"
    ],
    "returnPolicy": "7 Days Hassle-Free Physical Replacement or Full Refund",
    "warrantyPolicy": "100% Authentic Fabric & Quality Assurance Guarantee",
    "description": "StyleHub Fashion brings handpicked designer wear, handcrafted Banarasi silks, and tailored wardrobe essentials from master artisans across India."
  },
  {
    "id": "v3",
    "businessName": "FreshBazaar Grocery",
    "storeSlug": "freshbazaar",
    "tagline": "Single-Estate Cold-Pressed Oils, Organic Staples & Rare Himalayan Superfoods",
    "ownerName": "Amit Patel",
    "email": "amit@freshbazaar.in",
    "password": "Vendor@123",
    "mobile": "9988776655",
    "businessAddress": "22, Market Road, Majestic",
    "location": "Bengaluru, Karnataka",
    "joinedDate": "2024-03-10",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    "banner": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=300&fit=crop",
    "themeColor": "#059669",
    "themePreset": "emerald",
    "storeStatus": "published",
    "isVerified": true,
    "gstin": "29AABCF9012H3Z4",
    "announcement": "\ud83c\udf3f 100% Certified Organic Warehouse Stock with Nitrogen-Flushed Tamper-Proof Packaging.",
    "featuredProductIds": [
      "p31",
      "p32",
      "p33",
      "p34"
    ],
    "storeRating": 4.9,
    "totalOrdersFulfilled": 1870,
    "onTimeDispatchRate": "99.4%",
    "shippingPartners": [
      "BlueDart Express",
      "Delhivery Surface",
      "Shadowfax"
    ],
    "returnPolicy": "7 Days Replacement for sealed grocery items upon delivery inspection",
    "warrantyPolicy": "FSSAI Certified, 100% Pesticide-Free Laboratory Tested",
    "description": "FreshBazaar connects health-conscious households with organic farm cooperatives producing A2 cultured ghee, cold-pressed oils, and pure superfoods."
  },
  {
    "id": "v4",
    "businessName": "HomeEssentials Store",
    "storeSlug": "homeessentials",
    "tagline": "Pre-Seasoned Cast Iron Cookware, Tri-Ply Steel & Kitchen Ergonomics",
    "ownerName": "Sunita Rao",
    "email": "sunita@homeessentials.in",
    "password": "Vendor@123",
    "mobile": "9765432100",
    "businessAddress": "7, Gandhi Nagar, Park Street",
    "location": "Kolkata, West Bengal",
    "joinedDate": "2024-04-05",
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop",
    "banner": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=300&fit=crop",
    "themeColor": "#D97706",
    "themePreset": "amber",
    "storeStatus": "published",
    "isVerified": true,
    "gstin": "19AABCH3456J4Z7",
    "announcement": "\ud83c\udfe0 Free Silicone Hot Handle Grips included with every Cast Iron Cookware order!",
    "featuredProductIds": [
      "p46",
      "p47",
      "p48",
      "p49"
    ],
    "storeRating": 4.8,
    "totalOrdersFulfilled": 2185,
    "onTimeDispatchRate": "98.7%",
    "shippingPartners": [
      "BlueDart Express",
      "Delhivery Surface",
      "DTDC Air"
    ],
    "returnPolicy": "7 Days Hassle-Free Physical Replacement or Full Refund",
    "warrantyPolicy": "5-Year Structural Replacement Warranty on Heavy Cast Iron",
    "description": "HomeEssentials Store crafts heirloom-quality kitchenware designed to last generations, combining traditional metallurgy with modern ergonomic standards."
  },
  {
    "id": "v5",
    "businessName": "Apex Sports & Outdoors",
    "storeSlug": "apexsports",
    "tagline": "High-Performance Athletics, Tournament Badminton & Calisthenics Equipment",
    "ownerName": "Vikram Malhotra",
    "email": "vikram@apexsports.in",
    "password": "Vendor@123",
    "mobile": "9845123456",
    "businessAddress": "88, Jubilee Hills Road No. 36",
    "location": "Hyderabad, Telangana",
    "joinedDate": "2024-07-10",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    "banner": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&h=300&fit=crop",
    "themeColor": "#EA580C",
    "themePreset": "orange",
    "storeStatus": "published",
    "isVerified": true,
    "gstin": "36AABCA7890K1Z2",
    "announcement": "\ud83d\udd25 New Merchant Special: Priority Express Courier Dispatch across India within 18 hours!",
    "featuredProductIds": [
      "p61",
      "p62",
      "p63",
      "p64"
    ],
    "storeRating": 4.9,
    "totalOrdersFulfilled": 74,
    "onTimeDispatchRate": "99.5%",
    "shippingPartners": [
      "BlueDart Express",
      "Delhivery Surface",
      "DTDC Air"
    ],
    "returnPolicy": "7 Days Physical Replacement for Sports Equipment",
    "warrantyPolicy": "1-Year Official Manufacturer Warranty on all Rackets & Gym Gear",
    "description": "Apex Sports is an emerging boutique retailer in Hyderabad supplying tournament-grade badminton racquets, Olympic gym dumbbells, and mountain biking gear."
  },
  {
    "id": "v6",
    "businessName": "GlowAura Beauty & Wellness",
    "storeSlug": "glowaura",
    "tagline": "Clean Ayurvedic Formulations, Botanical Face Elixirs & Organic Hair Spa",
    "ownerName": "Ananya Iyer",
    "email": "ananya@glowaura.in",
    "password": "Vendor@123",
    "mobile": "9789012345",
    "businessAddress": "42, Khader Nawaz Khan Road, Nungambakkam",
    "location": "Chennai, Tamil Nadu",
    "joinedDate": "2024-08-01",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
    "banner": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&h=300&fit=crop",
    "themeColor": "#8B5CF6",
    "themePreset": "purple",
    "storeStatus": "published",
    "isVerified": true,
    "gstin": "33AABCG1234L2Z3",
    "announcement": "\ud83c\udf38 100% Cruelty-Free, Zero Parabens, Handcrafted in small fresh apothecary batches.",
    "featuredProductIds": [
      "p76",
      "p77",
      "p78",
      "p79"
    ],
    "storeRating": 4.9,
    "totalOrdersFulfilled": 58,
    "onTimeDispatchRate": "99.2%",
    "shippingPartners": [
      "BlueDart Express",
      "Delhivery Surface"
    ],
    "returnPolicy": "7 Days Return on unopened products with intact safety seals",
    "warrantyPolicy": "Dermatologically Tested & Ayush Ministry Certified",
    "description": "GlowAura Beauty is a Chennai-based clean apothecary formulating pure Kumkumadi facial oils, Kannauj rose water, and organic hair restoration solutions."
  },
  {
    "id": "v7",
    "businessName": "CraftArtisans Studio",
    "storeSlug": "craftartisans",
    "tagline": "GI-Tagged Jaipur Blue Pottery, Brass Statues & Handwoven Jute Kilims",
    "ownerName": "Mohanlal Kumawat",
    "email": "mohanlal@craftartisans.in",
    "password": "Vendor@123",
    "mobile": "9414012345",
    "businessAddress": "19, Amber Fort Road, Sanganer",
    "location": "Jaipur, Rajasthan",
    "joinedDate": "2024-08-15",
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop",
    "banner": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&h=300&fit=crop",
    "themeColor": "#0284C7",
    "themePreset": "sky",
    "storeStatus": "published",
    "isVerified": true,
    "gstin": "08AABCC5678M3Z4",
    "announcement": "\ud83c\udffa Direct-from-Artisan: Custom double-layered bubble packaging ensures 0 transit breakage.",
    "featuredProductIds": [
      "p91",
      "p92",
      "p93",
      "p94"
    ],
    "storeRating": 4.9,
    "totalOrdersFulfilled": 42,
    "onTimeDispatchRate": "98.9%",
    "shippingPartners": [
      "BlueDart Express",
      "Delhivery Surface",
      "DTDC Air"
    ],
    "returnPolicy": "100% Free Replacement for any item damaged during physical transit",
    "warrantyPolicy": "Authentic Handicraft Certificate & Origin Verification Included",
    "description": "Direct heritage craft collective in Jaipur preserving 500-year-old Blue Pottery techniques, bell-metal casting, and block-printed home furnishings."
  },
  {
    "id": "v8",
    "businessName": "UrbanDen Home & Office",
    "storeSlug": "urbanden",
    "tagline": "Minimalist Solid Oak Monitor Stands, Desk Blotters & Ergonomic Tools",
    "ownerName": "Rohan Kulkarni",
    "email": "rohan@urbanden.in",
    "password": "Vendor@123",
    "mobile": "9822012345",
    "businessAddress": "104, IT Park Road, Aundh",
    "location": "Pune, Maharashtra",
    "joinedDate": "2024-08-20",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    "banner": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=300&fit=crop",
    "themeColor": "#475569",
    "themePreset": "slate",
    "storeStatus": "published",
    "isVerified": true,
    "gstin": "27AABCU9012N4Z5",
    "announcement": "\ud83d\udda5\ufe0f Transform your WFH desk setup: Complimentary cable management straps with every stand!",
    "featuredProductIds": [
      "p106",
      "p107",
      "p108",
      "p109"
    ],
    "storeRating": 4.8,
    "totalOrdersFulfilled": 36,
    "onTimeDispatchRate": "99.0%",
    "shippingPartners": [
      "BlueDart Express",
      "Delhivery Surface"
    ],
    "returnPolicy": "7 Days Hassle-Free Physical Replacement or Full Refund",
    "warrantyPolicy": "3-Year Solid Hardwood Structural Guarantee",
    "description": "UrbanDen designs productivity-boosting desktop accessories using sustainably sourced oak wood, heavy-gauge aluminum, and vegan leather."
  },
  {
    "id": "v9",
    "businessName": "GreenLeaf Plant Boutique",
    "storeSlug": "greenleaf",
    "tagline": "Nursery-Conditioned Exotic Houseplants, Terracotta Planters & Plant Care",
    "ownerName": "Meera Nambiar",
    "email": "meera@greenleaf.in",
    "password": "Vendor@123",
    "mobile": "9847012345",
    "businessAddress": "12, Panampilly Nagar Main Avenue",
    "location": "Kochi, Kerala",
    "joinedDate": "2024-09-01",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    "banner": "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=1200&h=300&fit=crop",
    "themeColor": "#16A34A",
    "themePreset": "green",
    "storeStatus": "published",
    "isVerified": true,
    "gstin": "32AABCG3456P5Z6",
    "announcement": "\ud83c\udf31 Live Plant Guarantee: Guaranteed healthy arrival or instant free doorstep replacement.",
    "featuredProductIds": [
      "p121",
      "p122",
      "p123",
      "p124"
    ],
    "storeRating": 4.9,
    "totalOrdersFulfilled": 29,
    "onTimeDispatchRate": "99.8%",
    "shippingPartners": [
      "BlueDart Air Priority",
      "Delhivery Express"
    ],
    "returnPolicy": "Guaranteed Healthy Delivery: 48-Hour Live Plant Replacement Guarantee",
    "warrantyPolicy": "Potted in organic nutrient-rich soil mix with care instructions",
    "description": "GreenLeaf Boutique grows resilient, air-purifying indoor plants packaged with specialized breathable root-protective cartons for safe express delivery."
  },
  {
    "id": "v10",
    "businessName": "SoundMaster Pro Audio",
    "storeSlug": "soundmaster",
    "tagline": "Studio Microphones, Audio Interfaces, Reference Monitors & Soundproofing",
    "ownerName": "Gurpreet Singh",
    "email": "gurpreet@soundmaster.in",
    "password": "Vendor@123",
    "mobile": "9814012345",
    "businessAddress": "56, Sector 34-A, Sub City Centre",
    "location": "Chandigarh, Punjab",
    "joinedDate": "2024-09-05",
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop",
    "banner": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=300&fit=crop",
    "themeColor": "#9333EA",
    "themePreset": "violet",
    "storeStatus": "published",
    "isVerified": true,
    "gstin": "03AABCS7890Q6Z7",
    "announcement": "\ud83c\udf99\ufe0f Authorised Indian Distributor for Professional Recording Gear & Microphones.",
    "featuredProductIds": [
      "p136",
      "p137",
      "p138",
      "p139"
    ],
    "storeRating": 4.9,
    "totalOrdersFulfilled": 21,
    "onTimeDispatchRate": "99.3%",
    "shippingPartners": [
      "BlueDart Express",
      "Delhivery Surface",
      "DTDC Air"
    ],
    "returnPolicy": "7 Days Physical Replacement for Technical Defects",
    "warrantyPolicy": "2-Year Direct Importer Warranty & Official Tax Invoice",
    "description": "SoundMaster Pro Audio supplies verified studio condenser microphones, reference monitors, and acoustic solutions for podcasters, musicians, and creators."
  }
];

// ── Customers ─────────────────────────────────
export const seedCustomers = [
  {
    "id": "c1",
    "fullName": "Arun Mehta",
    "email": "arun@example.com",
    "password": "Customer@123",
    "mobile": "9000011111",
    "address": "45, Sector 12, Dwarka",
    "location": "New Delhi, Delhi",
    "city": "New Delhi",
    "state": "Delhi",
    "pincode": "110075",
    "joinedDate": "2024-05-01",
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop"
  },
  {
    "id": "c2",
    "fullName": "Neha Singh",
    "email": "neha@example.com",
    "password": "Customer@123",
    "mobile": "9000022222",
    "address": "12, Koregaon Park",
    "location": "Pune, Maharashtra",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "411001",
    "joinedDate": "2024-05-15",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
  }
];

// ── 150 Physical Products (15 per vendor) ──────
export const seedProducts = [
  {
    "id": "p1",
    "sku": "VM-ELEC-P1-SAM",
    "name": "Samsung Galaxy S24 Ultra",
    "category": "Electronics",
    "brand": "Samsung",
    "price": 129999,
    "mrp": 158599,
    "discountPercent": 18,
    "stock": 18,
    "quantity": 18,
    "barcode": "8901000000642",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-2",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop"
    ],
    "description": "The Samsung Galaxy S24 Ultra features groundbreaking Galaxy AI, an integrated S Pen, and a titanium frame. 200MP quad camera and Snapdragon 8 Gen 3 redefines flagship smartphone performance.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Display": "6.8\" Dynamic AMOLED 2X, 120Hz",
      "Processor": "Snapdragon 8 Gen 3",
      "RAM": "12 GB",
      "Storage": "256 GB / 512 GB",
      "Rear Camera": "200 MP + 12 MP + 10 MP + 50 MP",
      "Battery": "5000 mAh 45W Fast Charge"
    },
    "shipping": {
      "weight": "232 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 18
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 15600,
          "stock": 16
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 27,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P1-SAM-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Samsung Galaxy S24 Ultra in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P1-SAM-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P1-SAM-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P1-SAM-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Samsung Galaxy S24 Ultra brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p2",
    "sku": "VM-ELEC-P2-APP",
    "name": "Apple iPhone 15 Pro Max 256GB",
    "category": "Electronics",
    "brand": "Apple",
    "price": 134900,
    "mrp": 159900,
    "discountPercent": 16,
    "stock": 15,
    "quantity": 15,
    "barcode": "8901000001284",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-3",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=600&fit=crop"
    ],
    "description": "Forged in titanium with the ground-breaking A17 Pro chip, customizable Action button, and the most versatile 5x optical telephoto camera system in iPhone history.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Display": "6.7\" Super Retina XDR OLED, 120Hz",
      "Chip": "A17 Pro",
      "Camera": "48 MP Main with 5x Telephoto",
      "Weight": "221 g",
      "Charging": "USB-C with USB 3 Speeds"
    },
    "shipping": {
      "weight": "221 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 15
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 16188,
          "stock": 13
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 30,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P2-APP-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Apple iPhone 15 Pro Max 256GB in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P2-APP-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P2-APP-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P2-APP-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Apple iPhone 15 Pro Max 256GB brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p3",
    "sku": "VM-ELEC-P3-SON",
    "name": "Sony WH-1000XM5 Noise-Cancelling Headphones",
    "category": "Electronics",
    "brand": "Sony",
    "price": 29990,
    "mrp": 34990,
    "discountPercent": 14,
    "stock": 24,
    "quantity": 24,
    "barcode": "8901000001926",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-4",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop"
    ],
    "description": "Industry-leading active noise cancellation with two processors and 8 microphones. Hi-Res audio wireless, 30-hour battery life, and crystal-clear hands-free calling.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Driver": "30mm Precision Engineered",
      "Battery Life": "Up to 30 hours",
      "Charging": "3 min charge for 3 hours playback",
      "Bluetooth": "v5.2 with LDAC and Multipoint"
    },
    "shipping": {
      "weight": "250 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 24
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 3599,
          "stock": 22
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 33,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P3-SON-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Sony WH-1000XM5 Noise-Cancelling Headphones in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P3-SON-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P3-SON-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P3-SON-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Sony WH-1000XM5 Noise-Cancelling Headphones brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p4",
    "sku": "VM-ELEC-P4-MAC",
    "name": "Apple MacBook Air 13-inch M3",
    "category": "Electronics",
    "brand": "Apple",
    "price": 104990,
    "mrp": 114900,
    "discountPercent": 9,
    "stock": 12,
    "quantity": 12,
    "barcode": "8901000002568",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-5",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop"
    ],
    "description": "Strikingly thin and fast MacBook Air with the M3 chip. Delivers up to 18 hours of battery life and support for up to two external displays in a durable recycled aluminum enclosure.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Processor": "Apple M3 8-core CPU",
      "GPU": "10-core GPU",
      "Memory": "8 GB Unified Memory",
      "Storage": "256 GB SSD",
      "Display": "13.6\" Liquid Retina Display"
    },
    "shipping": {
      "weight": "1.24 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 12
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 12599,
          "stock": 10
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 36,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P4-MAC-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Apple MacBook Air 13-inch M3 in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P4-MAC-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P4-MAC-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P4-MAC-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Apple MacBook Air 13-inch M3 brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p5",
    "sku": "VM-ELEC-P5-ONE",
    "name": "OnePlus Watch 2 WearOS Smartwatch",
    "category": "Electronics",
    "brand": "OnePlus",
    "price": 21999,
    "mrp": 27999,
    "discountPercent": 21,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000003210",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-6",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"
    ],
    "description": "Dual-Engine Architecture with Wear OS 4 and RTOS co-processors. Up to 100-hour battery life in Smart Mode, stainless steel chassis, 2.5D sapphire crystal face, and precision dual-frequency GPS.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Battery": "100 Hours Smart Mode",
      "OS": "Wear OS by Google + RTOS",
      "Display": "1.43\" AMOLED 1000 nits",
      "Water Resistance": "5ATM + IP68"
    },
    "shipping": {
      "weight": "80 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 30
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 2640,
          "stock": 28
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 39,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P5-ONE-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received OnePlus Watch 2 WearOS Smartwatch in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P5-ONE-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P5-ONE-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P5-ONE-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this OnePlus Watch 2 WearOS Smartwatch brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p6",
    "sku": "VM-ELEC-P6-IPA",
    "name": "Apple iPad Air 11-inch M2",
    "category": "Electronics",
    "brand": "Apple",
    "price": 59900,
    "mrp": 64900,
    "discountPercent": 8,
    "stock": 16,
    "quantity": 16,
    "barcode": "8901000003852",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-7",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop"
    ],
    "description": "The redesigned 11-inch iPad Air is supercharged by the Apple M2 chip. Features a Liquid Retina display, landscape 12MP front camera with Center Stage, and Wi-Fi 6E.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Display": "11\" Liquid Retina True Tone",
      "Processor": "Apple M2 Chip",
      "Storage": "128 GB",
      "Camera": "12MP Wide back, 12MP Ultra Wide front"
    },
    "shipping": {
      "weight": "462 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 16
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 7188,
          "stock": 14
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 42,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P6-IPA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Apple iPad Air 11-inch M2 in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P6-IPA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P6-IPA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P6-IPA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Apple iPad Air 11-inch M2 brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p7",
    "sku": "VM-ELEC-P7-BOS",
    "name": "Bose QuietComfort Ultra Wireless Earbuds",
    "category": "Electronics",
    "brand": "Bose",
    "price": 23900,
    "mrp": 29900,
    "discountPercent": 20,
    "stock": 22,
    "quantity": 22,
    "barcode": "8901000004494",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-8",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop"
    ],
    "description": "Breakthrough spatialized audio for immersive listening no matter the content. World-class noise cancellation and CustomTune technology for personalized sound.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Noise Cancelling": "Active with CustomTune",
      "Battery": "Up to 6 hours (24 with case)",
      "Microphones": "Built-in beamforming array",
      "Water Resistance": "IPX4"
    },
    "shipping": {
      "weight": "60 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 22
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 2868,
          "stock": 20
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 45,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P7-BOS-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Bose QuietComfort Ultra Wireless Earbuds in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P7-BOS-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P7-BOS-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P7-BOS-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Bose QuietComfort Ultra Wireless Earbuds brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p8",
    "sku": "VM-ELEC-P8-ASU",
    "name": "ASUS ROG Zephyrus G14 Gaming Laptop",
    "category": "Electronics",
    "brand": "ASUS",
    "price": 149990,
    "mrp": 174990,
    "discountPercent": 14,
    "stock": 8,
    "quantity": 8,
    "barcode": "8901000005136",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-9",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop"
    ],
    "description": "Ultra-compact 14-inch gaming beast powered by AMD Ryzen 9 8945HS and NVIDIA GeForce RTX 4070. Features an OLED 3K 120Hz ROG Nebula Display in a CNC machined aluminum chassis.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Processor": "AMD Ryzen 9 8945HS",
      "Graphics": "NVIDIA GeForce RTX 4070 8GB",
      "RAM": "32 GB LPDDR5X",
      "Storage": "1 TB PCIe 4.0 NVMe",
      "Display": "14\" 3K 120Hz 0.2ms OLED"
    },
    "shipping": {
      "weight": "1.5 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 8
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 17999,
          "stock": 6
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 48,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P8-ASU-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received ASUS ROG Zephyrus G14 Gaming Laptop in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P8-ASU-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P8-ASU-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P8-ASU-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this ASUS ROG Zephyrus G14 Gaming Laptop brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p9",
    "sku": "VM-ELEC-P9-KEY",
    "name": "Keychron K2 V2 Wireless Mechanical Keyboard",
    "category": "Electronics",
    "brand": "Keychron",
    "price": 8499,
    "mrp": 10999,
    "discountPercent": 23,
    "stock": 35,
    "quantity": 35,
    "barcode": "8901000005778",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-10",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop"
    ],
    "description": "75% layout compact wireless mechanical keyboard with Gateron G Pro Brown tactile switches, RGB backlighting, and dual Mac & Windows compatibility via Bluetooth 5.1 or USB-C.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Layout": "75% (84 Keys)",
      "Switches": "Gateron G Pro Brown Tactile",
      "Connectivity": "Bluetooth 5.1 & Type-C Cable",
      "Battery": "4000 mAh Rechargeable"
    },
    "shipping": {
      "weight": "790 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 35
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 51,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P9-KEY-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Keychron K2 V2 Wireless Mechanical Keyboard in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P9-KEY-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P9-KEY-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P9-KEY-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Keychron K2 V2 Wireless Mechanical Keyboard brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p10",
    "sku": "VM-ELEC-P10-LOG",
    "name": "Logitech MX Master 3S Wireless Performance Mouse",
    "category": "Electronics",
    "brand": "Logitech",
    "price": 8995,
    "mrp": 10995,
    "discountPercent": 18,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000006420",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-11",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=600&fit=crop"
    ],
    "description": "Remastered flagship ergonomic mouse with Quiet Clicks and 8,000 DPI track-on-glass sensor. MagSpeed electromagnetic scrolling scrolls 1,000 lines in a second with pixel-level precision.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Sensor": "Darkfield 8000 DPI (Tracks on glass)",
      "Battery": "Up to 70 days on full charge",
      "Buttons": "7 customizable buttons + gesture button",
      "Connectivity": "Bluetooth & Logi Bolt"
    },
    "shipping": {
      "weight": "141 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 54,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P10-LOG-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Logitech MX Master 3S Wireless Performance Mouse in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P10-LOG-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P10-LOG-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P10-LOG-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Logitech MX Master 3S Wireless Performance Mouse brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p11",
    "sku": "VM-ELEC-P11-ANK",
    "name": "Anker 737 Power Bank 24,000mAh 140W",
    "category": "Electronics",
    "brand": "Anker",
    "price": 11999,
    "mrp": 14999,
    "discountPercent": 20,
    "stock": 25,
    "quantity": 25,
    "barcode": "8901000007062",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-12",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop"
    ],
    "description": "Ultra-powerful two-way fast charging with Power Delivery 3.1 and bi-directional 140W output. Smart digital display shows output/input power and estimated full recharge time.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Capacity": "24,000 mAh / 86.4Wh",
      "Max Output": "140W Single Port",
      "Ports": "2x USB-C + 1x USB-A",
      "Display": "Smart Digital Color Display"
    },
    "shipping": {
      "weight": "630 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 25
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 1440,
          "stock": 23
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 57,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P11-ANK-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Anker 737 Power Bank 24,000mAh 140W in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P11-ANK-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P11-ANK-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P11-ANK-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Anker 737 Power Bank 24,000mAh 140W brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p12",
    "sku": "VM-ELEC-P12-MAR",
    "name": "Marshall Stanmore III Bluetooth Home Speaker",
    "category": "Electronics",
    "brand": "Marshall",
    "price": 31999,
    "mrp": 37999,
    "discountPercent": 16,
    "stock": 14,
    "quantity": 14,
    "barcode": "8901000007704",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-13",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop"
    ],
    "description": "Re-engineered for an expansive, room-shaking Marshall signature home audio experience. Features outward-angled tweeters, updated waveguides, and Bluetooth 5.2 with analog brass controls.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Power Output": "80W Class D Amplification",
      "Frequency Range": "45\u201320,000 Hz",
      "Inputs": "3.5 mm AUX, RCA, Bluetooth 5.2",
      "Design": "Textured Vinyl & Classic Script Logo"
    },
    "shipping": {
      "weight": "4.25 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 14
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 3840,
          "stock": 12
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 60,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P12-MAR-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Marshall Stanmore III Bluetooth Home Speaker in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P12-MAR-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P12-MAR-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P12-MAR-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Marshall Stanmore III Bluetooth Home Speaker brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p13",
    "sku": "VM-ELEC-P13-KIN",
    "name": "Amazon Kindle Paperwhite 16GB Waterproof",
    "category": "Electronics",
    "brand": "Amazon",
    "price": 14999,
    "mrp": 17999,
    "discountPercent": 17,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000008346",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-14",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&h=600&fit=crop"
    ],
    "description": "Now with a 6.8\" glare-free 300 ppi display, thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns. IPX8 waterproof rating for poolside reading.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Display": "6.8\" Glare-Free 300 ppi",
      "Storage": "16 GB (Holds thousands of books)",
      "Lighting": "Adjustable White to Warm Amber",
      "Battery": "Up to 10 Weeks",
      "Waterproof": "IPX8"
    },
    "shipping": {
      "weight": "205 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 30
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 1800,
          "stock": 28
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 63,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P13-KIN-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Amazon Kindle Paperwhite 16GB Waterproof in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P13-KIN-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P13-KIN-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P13-KIN-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Amazon Kindle Paperwhite 16GB Waterproof brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p14",
    "sku": "VM-ELEC-P14-SAN",
    "name": "SanDisk Extreme PRO 1TB Portable SSD 2000MB/s",
    "category": "Electronics",
    "brand": "SanDisk",
    "price": 12499,
    "mrp": 16999,
    "discountPercent": 26,
    "stock": 28,
    "quantity": 28,
    "barcode": "8901000008988",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-15",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=600&fit=crop"
    ],
    "description": "Blazing fast NVMe performance up to 2000MB/s read/write speeds over USB 3.2 Gen 2x2. Forged aluminum chassis acts as a heatsink, while silicone shell delivers IP65 dust and water resistance.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Speed": "Up to 2000 MB/s Read & Write",
      "Capacity": "1 TB",
      "Interface": "USB 3.2 Gen 2x2 Type-C",
      "Durability": "IP65 Water & Dust + 3-Meter Drop Protection"
    },
    "shipping": {
      "weight": "77 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 28
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 1500,
          "stock": 26
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 66,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P14-SAN-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received SanDisk Extreme PRO 1TB Portable SSD 2000MB/s in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P14-SAN-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P14-SAN-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P14-SAN-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this SanDisk Extreme PRO 1TB Portable SSD 2000MB/s brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p15",
    "sku": "VM-ELEC-P15-BEL",
    "name": "Belkin BoostCharge Pro 3-in-1 MagSafe Stand",
    "category": "Electronics",
    "brand": "Belkin",
    "price": 12999,
    "mrp": 15999,
    "discountPercent": 19,
    "stock": 20,
    "quantity": 20,
    "barcode": "8901000009630",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-16",
    "restockLeadDays": 3,
    "vendorId": "v1",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop"
    ],
    "description": "Fast wireless charging up to 15W for iPhone 15/14/13/12 models, Apple Watch Series 9/Ultra, and AirPods case simultaneously. Premium stainless steel architecture complements any nightstand.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "iPhone Output": "Official 15W MagSafe Fast Wireless",
      "Watch Output": "Fast Charge Module for Apple Watch",
      "AirPods Output": "5W Qi Base",
      "Build": "Architectural Stainless Steel"
    },
    "shipping": {
      "weight": "520 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 20
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 1560,
          "stock": 18
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 69,
    "reviews": [
      {
        "id": "rev-VM-ELEC-P15-BEL-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Belkin BoostCharge Pro 3-in-1 MagSafe Stand in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P15-BEL-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-ELEC-P15-BEL-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-ELEC-P15-BEL-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Belkin BoostCharge Pro 3-in-1 MagSafe Stand brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p16",
    "sku": "VM-FASH-P16-BAN",
    "name": "Handcrafted Pure Silk Katan Banarasi Saree",
    "category": "Fashion",
    "brand": "Banaras Weaves",
    "price": 18999,
    "mrp": 24999,
    "discountPercent": 24,
    "stock": 12,
    "quantity": 12,
    "barcode": "8901000010272",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-17",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop"
    ],
    "description": "Woven by master weavers in Varanasi using pure katan silk yarn and genuine gold zari jaal motifs. Includes unstitched matching blouse fabric with ornate sleeve border.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Fabric": "100% Pure Katan Silk",
      "Weave Technique": "Kadhiwa Handloom",
      "Length": "5.5 Meters + 0.8M Blouse Piece",
      "Zari": "Tested Micro Gold Zari",
      "Care": "Dry Clean Only"
    },
    "shipping": {
      "weight": "750 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 12
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 72,
    "reviews": [
      {
        "id": "rev-VM-FASH-P16-BAN-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Handcrafted Pure Silk Katan Banarasi Saree in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P16-BAN-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P16-BAN-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P16-BAN-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Handcrafted Pure Silk Katan Banarasi Saree brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p17",
    "sku": "VM-FASH-P17-LIN",
    "name": "Men's Tailored Pure French Linen Casual Shirt",
    "category": "Fashion",
    "brand": "StyleHub Classics",
    "price": 2799,
    "mrp": 3999,
    "discountPercent": 30,
    "stock": 35,
    "quantity": 35,
    "barcode": "8901000010914",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-18",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop"
    ],
    "description": "Crafted from 100% Normandy French flax linen. Pre-washed for incredible softness, featuring mother-of-pearl buttons and a semi-spread collar designed for tropical elegance.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "100% French Flax Linen",
      "Fit": "Tailored Regular Fit",
      "Collar": "Semi-Spread Soft Collar",
      "Wash": "Enzyme Stone-Washed"
    },
    "shipping": {
      "weight": "240 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 35
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 75,
    "reviews": [
      {
        "id": "rev-VM-FASH-P17-LIN-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Men's Tailored Pure French Linen Casual Shirt in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P17-LIN-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P17-LIN-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P17-LIN-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Men's Tailored Pure French Linen Casual Shirt brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p18",
    "sku": "VM-FASH-P18-ANA",
    "name": "Women's Embroidered Anarkali Kurta Set with Dupatta",
    "category": "Fashion",
    "brand": "Riwaaz Festive",
    "price": 4499,
    "mrp": 6999,
    "discountPercent": 36,
    "stock": 20,
    "quantity": 20,
    "barcode": "8901000011556",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-1",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1583391733975-023a10582d92?w=600&h=600&fit=crop"
    ],
    "description": "Graceful Chanderi silk anarkali adorned with delicate gota patti handwork, paired with matching cotton silk pants and a lightweight organza scalloped dupatta.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Kurta Fabric": "Chanderi Silk with Cotton Lining",
      "Bottom Fabric": "Cotton Silk Trousers",
      "Dupatta": "Pure Organza with Gota Lace",
      "Work": "Hand Gota Patti & Zardozi"
    },
    "shipping": {
      "weight": "680 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 20
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 78,
    "reviews": [
      {
        "id": "rev-VM-FASH-P18-ANA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Women's Embroidered Anarkali Kurta Set with Dupatta in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P18-ANA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P18-ANA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P18-ANA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Women's Embroidered Anarkali Kurta Set with Dupatta brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p19",
    "sku": "VM-FASH-P19-KOL",
    "name": "Handcrafted Genuine Leather Kolhapuri Chappals",
    "category": "Fashion",
    "brand": "Kolhapur Crafts",
    "price": 1899,
    "mrp": 2999,
    "discountPercent": 37,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000012198",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-2",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop"
    ],
    "description": "Authentic vegetable-tanned genuine leather Kolhapuri sandals with hand-braided straps and traditional punch-hole detailing. Molds naturally to your feet over time.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Upper": "Full-Grain Veg-Tanned Buffalo Leather",
      "Sole": "Stacked Leather Sole with Anti-Slip Heel Pod",
      "Stitching": "Hand-stitched Cotton Cord",
      "Origin": "Kolhapur, Maharashtra"
    },
    "shipping": {
      "weight": "420 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 81,
    "reviews": [
      {
        "id": "rev-VM-FASH-P19-KOL-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Handcrafted Genuine Leather Kolhapuri Chappals in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P19-KOL-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P19-KOL-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P19-KOL-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Handcrafted Genuine Leather Kolhapuri Chappals brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p20",
    "sku": "VM-FASH-P20-DEN",
    "name": "Men's Slim-Fit Selvedge Indigo Denim Jeans",
    "category": "Fashion",
    "brand": "DenimWorks",
    "price": 3499,
    "mrp": 4999,
    "discountPercent": 30,
    "stock": 28,
    "quantity": 28,
    "barcode": "8901000012840",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-3",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=600&h=600&fit=crop"
    ],
    "description": "13.5oz Japanese shuttle-loom woven red-line selvedge denim. Raw, unwashed indigo fabric that creates personalized fading whiskers and honeycombs with continuous wear.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Fabric Weight": "13.5 oz Raw Selvedge Denim",
      "Composition": "99% Cotton, 1% Elastane",
      "Hardware": "Solid Copper Rivets & Button Fly",
      "Fit": "Slim Straight Fit"
    },
    "shipping": {
      "weight": "650 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 28
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 84,
    "reviews": [
      {
        "id": "rev-VM-FASH-P20-DEN-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Men's Slim-Fit Selvedge Indigo Denim Jeans in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P20-DEN-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P20-DEN-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P20-DEN-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Men's Slim-Fit Selvedge Indigo Denim Jeans brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p21",
    "sku": "VM-FASH-P21-CHA",
    "name": "Chanderi Hand-Block Print Zari Border Cotton Saree",
    "category": "Fashion",
    "brand": "Chanderi Heritage",
    "price": 5999,
    "mrp": 8999,
    "discountPercent": 33,
    "stock": 16,
    "quantity": 16,
    "barcode": "8901000013482",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-4",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=600&fit=crop"
    ],
    "description": "Feather-light Chanderi cotton silk saree featuring heritage Sanganeri floral block motifs stamped by hand using natural vegetable dyes, crowned with a woven gold zari pattu border.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Fabric": "Chanderi Cotton Silk (70% Cotton, 30% Silk)",
      "Dyes": "Natural Indigo & Madder Plant Dyes",
      "Length": "6.3 Meters with Blouse",
      "Weight": "Ultra-lightweight 380g"
    },
    "shipping": {
      "weight": "380 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 16
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 87,
    "reviews": [
      {
        "id": "rev-VM-FASH-P21-CHA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Chanderi Hand-Block Print Zari Border Cotton Saree in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P21-CHA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P21-CHA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P21-CHA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Chanderi Hand-Block Print Zari Border Cotton Saree brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p22",
    "sku": "VM-FASH-P22-BLA",
    "name": "100% Merino Wool Tailored Casual Blazer for Men",
    "category": "Fashion",
    "brand": "Savile Craft",
    "price": 8999,
    "mrp": 13999,
    "discountPercent": 36,
    "stock": 14,
    "quantity": 14,
    "barcode": "8901000014124",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-5",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=600&fit=crop"
    ],
    "description": "Structured yet comfortable unstructured single-breasted blazer woven from fine Australian Merino wool. Half-canvassed for natural drape with horn buttons and double back vents.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Fabric": "100% Australian Merino Wool",
      "Construction": "Half-Canvas with Bemberg Cupro Lining",
      "Buttons": "Natural Horn",
      "Vents": "Double Back Vents"
    },
    "shipping": {
      "weight": "780 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 14
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 90,
    "reviews": [
      {
        "id": "rev-VM-FASH-P22-BLA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received 100% Merino Wool Tailored Casual Blazer for Men in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P22-BLA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P22-BLA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P22-BLA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this 100% Merino Wool Tailored Casual Blazer for Men brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p23",
    "sku": "VM-FASH-P23-BOO",
    "name": "Goodyear Welted Handcrafted Leather Chelsea Boots",
    "category": "Fashion",
    "brand": "Craftsman Shoes",
    "price": 6499,
    "mrp": 9999,
    "discountPercent": 35,
    "stock": 22,
    "quantity": 22,
    "barcode": "8901000014766",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-6",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=600&fit=crop"
    ],
    "description": "Classic Chelsea boot built with Goodyear welt construction for lifetime resoleability. Features supple calfskin leather, elasticized side gussets, and Dainite rubber studded outsole.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Leather": "Full-Grain European Calfskin",
      "Construction": "Goodyear Welted 360-Degree",
      "Sole": "Dainite All-Weather Studded Rubber",
      "Insole": "Poron Cushion with Cork Bed"
    },
    "shipping": {
      "weight": "1.1 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 22
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 93,
    "reviews": [
      {
        "id": "rev-VM-FASH-P23-BOO-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Goodyear Welted Handcrafted Leather Chelsea Boots in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P23-BOO-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P23-BOO-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P23-BOO-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Goodyear Welted Handcrafted Leather Chelsea Boots brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p24",
    "sku": "VM-FASH-P24-SCA",
    "name": "Floral Printed 100% Mulberry Silk Scarf",
    "category": "Fashion",
    "brand": "SilkRoute",
    "price": 1699,
    "mrp": 2499,
    "discountPercent": 32,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000015408",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-7",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=600&fit=crop"
    ],
    "description": "90x90cm pure twill mulberry silk scarf featuring hand-rolled edges and hand-illustrated botanical motifs inspired by Mughal gardens. Lustrous, smooth, and gentle on sensitive skin.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "100% Pure Mulberry Silk Twill (16 Momme)",
      "Dimensions": "90 cm x 90 cm",
      "Finishing": "Hand-Rolled Hem",
      "Print": "Double-sided Digital Reactive Print"
    },
    "shipping": {
      "weight": "90 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 26,
    "reviews": [
      {
        "id": "rev-VM-FASH-P24-SCA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Floral Printed 100% Mulberry Silk Scarf in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P24-SCA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P24-SCA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P24-SCA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Floral Printed 100% Mulberry Silk Scarf brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p25",
    "sku": "VM-FASH-P25-CHI",
    "name": "Lucknowi Chikankari Hand-Embroidered Modal Kurti",
    "category": "Fashion",
    "brand": "Awadh Weaves",
    "price": 2299,
    "mrp": 3499,
    "discountPercent": 34,
    "stock": 38,
    "quantity": 38,
    "barcode": "8901000016050",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-8",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1583391733975-023a10582d92?w=600&h=600&fit=crop"
    ],
    "description": "Artisanal modal cotton kurti showcasing authentic Lucknowi Chikankari shadow-work (Bakhiya) and knot stitch (Phanda) by rural women artisans in Uttar Pradesh.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Fabric": "Super-Soft Breathable Modal Cotton",
      "Stitches": "Bakhiya, Phanda, Keel Kangan",
      "Fit": "Relaxed Straight Cut",
      "Length": "Calf-Length (44 inches)"
    },
    "shipping": {
      "weight": "280 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 38
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 29,
    "reviews": [
      {
        "id": "rev-VM-FASH-P25-CHI-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Lucknowi Chikankari Hand-Embroidered Modal Kurti in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P25-CHI-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P25-CHI-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P25-CHI-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Lucknowi Chikankari Hand-Embroidered Modal Kurti brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p26",
    "sku": "VM-FASH-P26-NEH",
    "name": "Men's Raw Silk Embroidered Bandhgala Nehru Jacket",
    "category": "Fashion",
    "brand": "Rajputana Royals",
    "price": 4999,
    "mrp": 7499,
    "discountPercent": 33,
    "stock": 18,
    "quantity": 18,
    "barcode": "8901000016692",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-9",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop"
    ],
    "description": "Regal sleeveless Nehru jacket tailored in textured raw Bhagalpuri silk with a mandarin collar, antique metal coin buttons, and subtle thread embroidery on the welt pocket.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Fabric": "100% Raw Tussar Silk",
      "Lining": "Breathable Viscose Satin",
      "Closure": "Antique Brass Buttons",
      "Pockets": "Two Slit Pockets + One Chest Pocket"
    },
    "shipping": {
      "weight": "420 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 18
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 32,
    "reviews": [
      {
        "id": "rev-VM-FASH-P26-NEH-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Men's Raw Silk Embroidered Bandhgala Nehru Jacket in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P26-NEH-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P26-NEH-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P26-NEH-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Men's Raw Silk Embroidered Bandhgala Nehru Jacket brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p27",
    "sku": "VM-FASH-P27-MES",
    "name": "Full-Grain Buff Leather Messenger Laptop Briefcase",
    "category": "Fashion",
    "brand": "Hides & Co",
    "price": 5499,
    "mrp": 7999,
    "discountPercent": 31,
    "stock": 20,
    "quantity": 20,
    "barcode": "8901000017334",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-10",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"
    ],
    "description": "Rugged and refined vegetable-tanned buffalo leather messenger bag with padded 15.6-inch laptop compartment, YKK brass zippers, and detachable heavy cotton webbing shoulder strap.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Leather": "Full-Grain Oiled Buffalo Leather",
      "Hardware": "Solid Antique Brass YKK Zippers",
      "Laptop Compatibility": "Up to 16\" MacBook Pro / ThinkPad",
      "Capacity": "14 Litres"
    },
    "shipping": {
      "weight": "1.3 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 20
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 35,
    "reviews": [
      {
        "id": "rev-VM-FASH-P27-MES-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Full-Grain Buff Leather Messenger Laptop Briefcase in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P27-MES-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P27-MES-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P27-MES-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Full-Grain Buff Leather Messenger Laptop Briefcase brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p28",
    "sku": "VM-FASH-P28-KHA",
    "name": "Handspun Organic Khadi Cotton Kurta Pajama Set",
    "category": "Fashion",
    "brand": "Gram Udyog",
    "price": 2999,
    "mrp": 4499,
    "discountPercent": 33,
    "stock": 32,
    "quantity": 32,
    "barcode": "8901000017976",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-11",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=600&fit=crop"
    ],
    "description": "Certified handspun and handwoven khadi cotton kurta pajama set. Natural porous weave stays cool in summer and warm in winter with wooden coconut shell buttons.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "100% Handspun Organic Khadi Cotton",
      "Certification": "Khadi India Certified",
      "Includes": "Kurta + Churidar Pajama",
      "Pockets": "Two Deep Side Pockets"
    },
    "shipping": {
      "weight": "450 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 32
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 38,
    "reviews": [
      {
        "id": "rev-VM-FASH-P28-KHA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Handspun Organic Khadi Cotton Kurta Pajama Set in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P28-KHA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P28-KHA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P28-KHA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Handspun Organic Khadi Cotton Kurta Pajama Set brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p29",
    "sku": "VM-FASH-P29-LOA",
    "name": "Handcrafted Italian Suede Penny Loafers",
    "category": "Fashion",
    "brand": "Milano Footwear",
    "price": 4299,
    "mrp": 6499,
    "discountPercent": 34,
    "stock": 25,
    "quantity": 25,
    "barcode": "8901000018618",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-12",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop"
    ],
    "description": "Slip-on penny loafers crafted from velvety water-resistant Italian split suede. Unlined vamp creates glove-like flexibility with cushioned leather-covered footbed.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Upper": "Water-Repellent Italian Suede",
      "Lining": "Breathable Calfskin Heel Lining",
      "Outsole": "Flexible Rubber Studded Driving Sole",
      "Style": "Classic Penny Slot Saddle"
    },
    "shipping": {
      "weight": "700 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 25
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 41,
    "reviews": [
      {
        "id": "rev-VM-FASH-P29-LOA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Handcrafted Italian Suede Penny Loafers in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P29-LOA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P29-LOA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P29-LOA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Handcrafted Italian Suede Penny Loafers brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p30",
    "sku": "VM-FASH-P30-PAS",
    "name": "Authentic Kashmiri Pure Pashmina Hand-Embroidered Shawl",
    "category": "Fashion",
    "brand": "Kashmir Loom",
    "price": 14999,
    "mrp": 21999,
    "discountPercent": 32,
    "stock": 10,
    "quantity": 10,
    "barcode": "8901000019260",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-13",
    "restockLeadDays": 3,
    "vendorId": "v2",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=600&fit=crop"
    ],
    "description": "GI-tagged authentic Kashmiri Pashmina shawl hand-spun from Changthangi mountain goat fleece. Decorated with intricate Sozni needle embroidery along the four borders.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Fiber": "100% Grade-A Changthangi Pashmina Cashmere",
      "Fineness": "12-14 Microns",
      "Embroidery": "Hand Sozni Needlework Border",
      "Dimensions": "100 cm x 200 cm"
    },
    "shipping": {
      "weight": "180 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Royal Emerald",
          "hex": "#065F46",
          "inStock": true
        },
        {
          "name": "Crimson Ruby",
          "hex": "#991B1B",
          "inStock": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1E3A8A",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 10
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 44,
    "reviews": [
      {
        "id": "rev-VM-FASH-P30-PAS-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Authentic Kashmiri Pure Pashmina Hand-Embroidered Shawl in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P30-PAS-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-FASH-P30-PAS-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-FASH-P30-PAS-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Authentic Kashmiri Pure Pashmina Hand-Embroidered Shawl brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p31",
    "sku": "VM-GROC-P31-MUS",
    "name": "Organic Wood-Pressed Mustard Oil (5 Litre Tin)",
    "category": "Grocery",
    "brand": "FreshBazaar Pure",
    "price": 1299,
    "mrp": 1699,
    "discountPercent": 24,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000019902",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-14",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop"
    ],
    "description": "Extracted in traditional wooden Kolhu/Chekku at ambient temperatures below 40\u00b0C. 100% pure, unrefined, retaining natural pungent aroma and heart-healthy Omega-3 fatty acids.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Extraction Method": "Traditional Wooden Ghani / Chekku",
      "Purity": "100% Cold-Pressed Unrefined",
      "Free From": "Argemone Oil, Hexane, Chemicals",
      "Shelf Life": "12 Months"
    },
    "shipping": {
      "weight": "5.2 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 47,
    "reviews": [
      {
        "id": "rev-VM-GROC-P31-MUS-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Organic Wood-Pressed Mustard Oil (5 Litre Tin) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P31-MUS-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P31-MUS-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P31-MUS-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Organic Wood-Pressed Mustard Oil (5 Litre Tin) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p32",
    "sku": "VM-GROC-P32-ALM",
    "name": "Premium Royal Kashmiri Mamra Almonds (500g)",
    "category": "Grocery",
    "brand": "Himalayan Harvest",
    "price": 1899,
    "mrp": 2499,
    "discountPercent": 24,
    "stock": 55,
    "quantity": 55,
    "barcode": "8901000020544",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-15",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&h=600&fit=crop"
    ],
    "description": "100% genuine concave Kashmiri Mamra badam. Naturally high oil content exceeding 50%, non-pasteurized, rich in Vitamin E, and free from chemical polishing.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Origin": "Kashmir Valley, India",
      "Oil Content": ">50% Natural Oils",
      "Processing": "Sun-dried in Shells, Hand-Cracked",
      "Grade": "Royal Jumbo Grade"
    },
    "shipping": {
      "weight": "520 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 55
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 50,
    "reviews": [
      {
        "id": "rev-VM-GROC-P32-ALM-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Premium Royal Kashmiri Mamra Almonds (500g) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P32-ALM-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P32-ALM-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P32-ALM-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Premium Royal Kashmiri Mamra Almonds (500g) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p33",
    "sku": "VM-GROC-P33-HON",
    "name": "Raw Unfiltered Forest Wildflower Honey (1kg Glass Jar)",
    "category": "Grocery",
    "brand": "WildRoots",
    "price": 849,
    "mrp": 1199,
    "discountPercent": 29,
    "stock": 60,
    "quantity": 60,
    "barcode": "8901000021186",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-16",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop"
    ],
    "description": "Harvested sustainably by tribal beekeepers in the Jim Corbett biosphere. Unheated, raw, and unfiltered to preserve live beneficial enzymes, pollen, and propolis.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Harvest": "Wild Forest Multiflora",
      "Processing": "Unpasteurized, Single-Filtered",
      "Packaging": "Lead-Free Glass Jar",
      "Testing": "NMR Tested 100% Pure Honey"
    },
    "shipping": {
      "weight": "1.4 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 60
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 53,
    "reviews": [
      {
        "id": "rev-VM-GROC-P33-HON-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Raw Unfiltered Forest Wildflower Honey (1kg Glass Jar) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P33-HON-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P33-HON-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P33-HON-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Raw Unfiltered Forest Wildflower Honey (1kg Glass Jar) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p34",
    "sku": "VM-GROC-P34-GHE",
    "name": "Organic A2 Desi Gir Cow Cultured Bilona Ghee (1 Litre)",
    "category": "Grocery",
    "brand": "Gir Amrit",
    "price": 1799,
    "mrp": 2299,
    "discountPercent": 22,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000021828",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-17",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&h=600&fit=crop"
    ],
    "description": "Made using the ancient Vedic Bilona method from curd of grass-fed Gir cows. Golden, aromatic, granular texture packed with fat-soluble vitamins A, D, E, and K.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Source": "Grass-Fed Desi Gir Cow Whole Milk",
      "Method": "Vedic Curd Churning (Bilona)",
      "Aroma": "Nutty Granular Danedar Texture",
      "Certification": "FSSAI Organic Certified"
    },
    "shipping": {
      "weight": "1.2 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 56,
    "reviews": [
      {
        "id": "rev-VM-GROC-P34-GHE-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Organic A2 Desi Gir Cow Cultured Bilona Ghee (1 Litre) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P34-GHE-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P34-GHE-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P34-GHE-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Organic A2 Desi Gir Cow Cultured Bilona Ghee (1 Litre) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p35",
    "sku": "VM-GROC-P35-QUI",
    "name": "Certified Organic Himalayan White Quinoa (1kg)",
    "category": "Grocery",
    "brand": "GreenEarthy",
    "price": 449,
    "mrp": 650,
    "discountPercent": 31,
    "stock": 75,
    "quantity": 75,
    "barcode": "8901000022470",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-18",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"
    ],
    "description": "Complete plant protein containing all 9 essential amino acids. Pre-washed to eliminate bitter saponin, high in dietary fiber, gluten-free, and pesticide-free.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Protein Content": "14g per 100g",
      "Processing": "Pre-washed & De-saponized",
      "Dietary": "100% Gluten-Free & Vegan",
      "Shelf Life": "18 Months"
    },
    "shipping": {
      "weight": "1.02 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 75
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 59,
    "reviews": [
      {
        "id": "rev-VM-GROC-P35-QUI-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Certified Organic Himalayan White Quinoa (1kg) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P35-QUI-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P35-QUI-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P35-QUI-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Certified Organic Himalayan White Quinoa (1kg) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p36",
    "sku": "VM-GROC-P36-ATT",
    "name": "Traditional Stone-Ground Emmer Wheat Atta (Khapli) (5kg)",
    "category": "Grocery",
    "brand": "Heritage Grains",
    "price": 599,
    "mrp": 799,
    "discountPercent": 25,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000023112",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-1",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop"
    ],
    "description": "Low glycemic index ancient wheat flour stone-ground on slow chakki. Gentle on digestion, rich in complex dietary fiber, magnesium, and trace minerals.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Grain Type": "Ancient Emmer Wheat (Khapli)",
      "Milling": "Slow Cold Stone Chakki",
      "GI Index": "Low Glycemic Index (<55)",
      "Net Weight": "5 kg Air-Tight Bag"
    },
    "shipping": {
      "weight": "5.1 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 62,
    "reviews": [
      {
        "id": "rev-VM-GROC-P36-ATT-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Traditional Stone-Ground Emmer Wheat Atta (Khapli) (5kg) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P36-ATT-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P36-ATT-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P36-ATT-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Traditional Stone-Ground Emmer Wheat Atta (Khapli) (5kg) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p37",
    "sku": "VM-GROC-P37-SAF",
    "name": "Pure Kashmiri Mongra Grade-A Saffron Threads (2g)",
    "category": "Grocery",
    "brand": "Pampore Saffron",
    "price": 999,
    "mrp": 1399,
    "discountPercent": 29,
    "stock": 85,
    "quantity": 85,
    "barcode": "8901000023754",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-2",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop"
    ],
    "description": "Export-grade Mongra saffron from Pampore, Kashmir. Characterized by deep crimson red stigmas, intense natural aroma, and high crocin content for radiant dishes and wellness teas.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Grade": "Kashmir Mongra Grade A-1",
      "Coloring Strength": ">240 Crocin Content",
      "Packaging": "Vacuum Sealed Blister Pack with Glass Vial",
      "Origin": "Pampore, Kashmir"
    },
    "shipping": {
      "weight": "35 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 85
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 65,
    "reviews": [
      {
        "id": "rev-VM-GROC-P37-SAF-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Pure Kashmiri Mongra Grade-A Saffron Threads (2g) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P37-SAF-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P37-SAF-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P37-SAF-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Pure Kashmiri Mongra Grade-A Saffron Threads (2g) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p38",
    "sku": "VM-GROC-P38-COC",
    "name": "Extra Virgin Cold-Pressed Centrifuged Coconut Oil (1 Litre)",
    "category": "Grocery",
    "brand": "Kerala Naturals",
    "price": 649,
    "mrp": 899,
    "discountPercent": 28,
    "stock": 65,
    "quantity": 65,
    "barcode": "8901000024396",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-3",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop"
    ],
    "description": "Extracted from fresh raw organic coconut milk within 3 hours of cracking through chilled centrifugal separation. Rich in Lauric Acid and MCTs without heating.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Extraction": "Chilled Centrifugal Extraction from Fresh Milk",
      "Lauric Acid": "50.2% High Concentration",
      "Appearance": "Water-Clear Liquid / Snow White Solid",
      "Volume": "1000 ml"
    },
    "shipping": {
      "weight": "1.1 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 65
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 68,
    "reviews": [
      {
        "id": "rev-VM-GROC-P38-COC-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Extra Virgin Cold-Pressed Centrifuged Coconut Oil (1 Litre) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P38-COC-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P38-COC-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P38-COC-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Extra Virgin Cold-Pressed Centrifuged Coconut Oil (1 Litre) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p39",
    "sku": "VM-GROC-P39-CHI",
    "name": "Organic Chia Seeds & Roasted Flax Seeds Superfood Blend (500g)",
    "category": "Grocery",
    "brand": "NutriCore",
    "price": 399,
    "mrp": 599,
    "discountPercent": 33,
    "stock": 90,
    "quantity": 90,
    "barcode": "8901000025038",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-4",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&h=600&fit=crop"
    ],
    "description": "50:50 powerhouse mix of raw black chia seeds and lightly roasted brown flax seeds. Packed with plant-based Omega-3 alpha-linolenic acid, calcium, and gut-friendly prebiotic fiber.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Blend Ratio": "50% Organic Chia, 50% Roasted Flax",
      "Omega-3": "6,500mg per serving",
      "Usage": "Smoothies, Oatmeal, Yogurt Toppings",
      "Packaging": "Resealable Stand-Up Zipper Pouch"
    },
    "shipping": {
      "weight": "520 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 90
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 71,
    "reviews": [
      {
        "id": "rev-VM-GROC-P39-CHI-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Organic Chia Seeds & Roasted Flax Seeds Superfood Blend (500g) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P39-CHI-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P39-CHI-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P39-CHI-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Organic Chia Seeds & Roasted Flax Seeds Superfood Blend (500g) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p40",
    "sku": "VM-GROC-P40-PEP",
    "name": "Malabar Whole Black Pepper Pods (Grade TGSEB) (250g)",
    "category": "Grocery",
    "brand": "SpiceCoast",
    "price": 349,
    "mrp": 499,
    "discountPercent": 30,
    "stock": 80,
    "quantity": 80,
    "barcode": "8901000025680",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-5",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&h=600&fit=crop"
    ],
    "description": "Tellicherry Garbled Special Extra Bold (TGSEB) black pepper berries handpicked from Wayanad, Kerala. Unmatched citrusy-pungent bite and high piperine concentration.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Grade": "Tellicherry TGSEB (4.75mm+ Bold Berries)",
      "Harvest": "Wayanad, Kerala",
      "Processing": "Sun-dried & Hand-Garbled",
      "Net Weight": "250 Grams"
    },
    "shipping": {
      "weight": "260 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 80
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 74,
    "reviews": [
      {
        "id": "rev-VM-GROC-P40-PEP-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Malabar Whole Black Pepper Pods (Grade TGSEB) (250g) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P40-PEP-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P40-PEP-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P40-PEP-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Malabar Whole Black Pepper Pods (Grade TGSEB) (250g) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p41",
    "sku": "VM-GROC-P41-TUR",
    "name": "Organic Lakadong Turmeric Powder (High 7.5% Curcumin) (500g)",
    "category": "Grocery",
    "brand": "Meghalaya Roots",
    "price": 299,
    "mrp": 450,
    "discountPercent": 34,
    "stock": 95,
    "quantity": 95,
    "barcode": "8901000026322",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-6",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop"
    ],
    "description": "Grown naturally in the Jaintia Hills of Meghalaya. Tested at 7.5% natural curcumin content (over 3x standard commercial turmeric) with earthy aroma and deep golden amber color.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Curcumin Level": "7.5% Lab Tested",
      "Origin": "Lakadong, Meghalaya",
      "Free From": "Lead Chromate, Starch, Fillers",
      "Packaging": "Eco-Friendly Kraft Stand-Up Pouch"
    },
    "shipping": {
      "weight": "520 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 95
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 77,
    "reviews": [
      {
        "id": "rev-VM-GROC-P41-TUR-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Organic Lakadong Turmeric Powder (High 7.5% Curcumin) (500g) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P41-TUR-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P41-TUR-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P41-TUR-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Organic Lakadong Turmeric Powder (High 7.5% Curcumin) (500g) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p42",
    "sku": "VM-GROC-P42-DAT",
    "name": "Sun-Dried Premium Jumbo Medjool Dates (1kg)",
    "category": "Grocery",
    "brand": "Oasis Delight",
    "price": 1199,
    "mrp": 1599,
    "discountPercent": 25,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000026964",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-7",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&h=600&fit=crop"
    ],
    "description": "Plump, luscious, king-sized Medjool dates with caramel-like texture and melt-in-the-mouth sweetness. Zero added sugar, rich in potassium, copper, and natural dietary fiber.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Variety": "Jumbo Medjool Dates",
      "Added Sugars": "0g (100% Naturally Sweetened)",
      "Grade": "Premium Select",
      "Storage": "Store refrigerated for maximum freshness"
    },
    "shipping": {
      "weight": "1.05 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 80,
    "reviews": [
      {
        "id": "rev-VM-GROC-P42-DAT-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Sun-Dried Premium Jumbo Medjool Dates (1kg) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P42-DAT-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P42-DAT-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P42-DAT-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Sun-Dried Premium Jumbo Medjool Dates (1kg) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p43",
    "sku": "VM-GROC-P43-CAR",
    "name": "Organic Green Cardamom Pods (Idukki Estate 8mm+) (200g)",
    "category": "Grocery",
    "brand": "CardamomHills",
    "price": 699,
    "mrp": 950,
    "discountPercent": 26,
    "stock": 70,
    "quantity": 70,
    "barcode": "8901000027606",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-8",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&h=600&fit=crop"
    ],
    "description": "Giant 8mm+ bold green cardamom pods harvested from high-elevation estates in Idukki, Kerala. Bursting with aromatic essential oils that release intoxicating fragrances.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Pod Size": "8mm+ Jumbo Extra Bold",
      "Color": "Natural Emerald Green (Unbleached)",
      "Origin": "Idukki Hills, Kerala",
      "Packaging": "Tin Caddy with Aroma-Lock Seal"
    },
    "shipping": {
      "weight": "230 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 70
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 83,
    "reviews": [
      {
        "id": "rev-VM-GROC-P43-CAR-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Organic Green Cardamom Pods (Idukki Estate 8mm+) (200g) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P43-CAR-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P43-CAR-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P43-CAR-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Organic Green Cardamom Pods (Idukki Estate 8mm+) (200g) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p44",
    "sku": "VM-GROC-P44-SAL",
    "name": "Natural Himalayan Pink Rock Salt Coarse Crystals (1kg)",
    "category": "Grocery",
    "brand": "SaltValley",
    "price": 179,
    "mrp": 250,
    "discountPercent": 28,
    "stock": 110,
    "quantity": 110,
    "barcode": "8901000028248",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-9",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop"
    ],
    "description": "Unrefined ancient salt crystals hand-mined from pristine Himalayan foothills. Contains 84 natural trace minerals including iron, magnesium, calcium, and potassium.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Mineral Composition": "Contains 84 Natural Trace Minerals",
      "Grain": "Coarse Crystal (Ideal for Salt Grinders)",
      "Additives": "Zero Anti-caking Agents or Microplastics",
      "Net Weight": "1 kg"
    },
    "shipping": {
      "weight": "1.02 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 110
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 86,
    "reviews": [
      {
        "id": "rev-VM-GROC-P44-SAL-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Natural Himalayan Pink Rock Salt Coarse Crystals (1kg) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P44-SAL-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P44-SAL-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P44-SAL-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Natural Himalayan Pink Rock Salt Coarse Crystals (1kg) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p45",
    "sku": "VM-GROC-P45-MOR",
    "name": "Organic Shade-Dried Moringa Oleifera Leaf Powder (250g)",
    "category": "Grocery",
    "brand": "GreenTree Organics",
    "price": 249,
    "mrp": 399,
    "discountPercent": 38,
    "stock": 85,
    "quantity": 85,
    "barcode": "8901000028890",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-10",
    "restockLeadDays": 3,
    "vendorId": "v3",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"
    ],
    "description": "Superfood miracle green powder shade-dried at low temperatures to preserve chlorophyll, plant protein, iron, and antioxidant polyphenols. 100% organic single-origin harvest.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Ingredients": "100% Pure Organic Moringa Oleifera Leaves",
      "Processing": "Shadow-Dried & Finely Pulverized",
      "Usage": "1 tsp in Warm Water, Green Smoothies, or Dal",
      "Certifications": "USDA & India Organic"
    },
    "shipping": {
      "weight": "270 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Natural Fresh Harvest",
          "hex": "#059669",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 85
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 89,
    "reviews": [
      {
        "id": "rev-VM-GROC-P45-MOR-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Organic Shade-Dried Moringa Oleifera Leaf Powder (250g) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P45-MOR-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GROC-P45-MOR-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GROC-P45-MOR-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Organic Shade-Dried Moringa Oleifera Leaf Powder (250g) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p46",
    "sku": "VM-HOME-P46-TAW",
    "name": "Pre-Seasoned Heavy Cast Iron Dosa Tawa 11-inch",
    "category": "Home & Living",
    "brand": "IronHeritage",
    "price": 1399,
    "mrp": 1999,
    "discountPercent": 30,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000029532",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-11",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"
    ],
    "description": "Machined perfectly flat 11-inch heavy cast iron tawa pre-seasoned with 100% cold-pressed gingelly oil. Unmatched heat retention produces paper-crisp golden dosas and rotis.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Diameter": "11 Inches / 28 cm",
      "Weight": "2.8 kg (Heavy Base)",
      "Seasoning": "Triple Pre-seasoned with Natural Sesame Oil",
      "Compatibility": "Gas, Induction, Campfire"
    },
    "shipping": {
      "weight": "2.8 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 92,
    "reviews": [
      {
        "id": "rev-VM-HOME-P46-TAW-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Pre-Seasoned Heavy Cast Iron Dosa Tawa 11-inch in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P46-TAW-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P46-TAW-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P46-TAW-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Pre-Seasoned Heavy Cast Iron Dosa Tawa 11-inch brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p47",
    "sku": "VM-HOME-P47-TRI",
    "name": "Tri-Ply Stainless Steel 3-Piece Cookware Set with Lids",
    "category": "Home & Living",
    "brand": "ProKitchen",
    "price": 4999,
    "mrp": 7499,
    "discountPercent": 33,
    "stock": 20,
    "quantity": 20,
    "barcode": "8901000030174",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-12",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584990347449-307994463a5a?w=600&h=600&fit=crop"
    ],
    "description": "Engineered with 3-ply clad construction: food-grade 304 stainless steel interior, heavy aluminum heat-distributing core, and 430 magnetic steel base for rapid, hotspot-free cooking.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Set Includes": "Kadai 24cm (2.5L), Saucepan 16cm (1.5L), Frying Pan 22cm",
      "Core": "Full Encapsulated Aluminum Core",
      "Handles": "Cast Stay-Cool Riveted Handles",
      "Lids": "Heavy Stainless Steel with Steam Vents"
    },
    "shipping": {
      "weight": "4.8 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 20
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 25,
    "reviews": [
      {
        "id": "rev-VM-HOME-P47-TRI-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Tri-Ply Stainless Steel 3-Piece Cookware Set with Lids in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P47-TRI-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P47-TRI-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P47-TRI-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Tri-Ply Stainless Steel 3-Piece Cookware Set with Lids brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p48",
    "sku": "VM-HOME-P48-CUT",
    "name": "Handcrafted Teak Wood End-Grain Butcher Block Cutting Board",
    "category": "Home & Living",
    "brand": "WoodCrafters",
    "price": 2199,
    "mrp": 3199,
    "discountPercent": 31,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000030816",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-13",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&h=600&fit=crop"
    ],
    "description": "Substantial 16x12 inch end-grain butcher block made from sustainably harvested plantation teak. End-grain orientation protects knife blade edges and self-heals cut marks.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Dimensions": "16\" x 12\" x 1.5\" Thick",
      "Wood": "100% Plantation Grown Indian Teak",
      "Finish": "Food-Grade Mineral Oil & Beeswax",
      "Features": "Carved Juice Groove & Finger Grips"
    },
    "shipping": {
      "weight": "3.2 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 30
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 28,
    "reviews": [
      {
        "id": "rev-VM-HOME-P48-CUT-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Handcrafted Teak Wood End-Grain Butcher Block Cutting Board in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P48-CUT-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P48-CUT-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P48-CUT-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Handcrafted Teak Wood End-Grain Butcher Block Cutting Board brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p49",
    "sku": "VM-HOME-P49-MOR",
    "name": "Pure Heavy Brass Traditional Mortar & Pestle (Imam Dasta)",
    "category": "Home & Living",
    "brand": "BrassCraft",
    "price": 1499,
    "mrp": 2199,
    "discountPercent": 32,
    "stock": 35,
    "quantity": 35,
    "barcode": "8901000031458",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-14",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"
    ],
    "description": "Cast from pure solid brass weighing 1.6kg. Deep pestle chamber crushes whole spices, garlic cloves, ginger, and Ayurvedic herbs without flying out.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "Solid Cast Virgin Brass (100% Lead-Free)",
      "Total Weight": "1.6 kg",
      "Height": "4.5 Inches",
      "Finish": "Traditional Golden Mirror Polish"
    },
    "shipping": {
      "weight": "1.7 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 35
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 31,
    "reviews": [
      {
        "id": "rev-VM-HOME-P49-MOR-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Pure Heavy Brass Traditional Mortar & Pestle (Imam Dasta) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P49-MOR-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P49-MOR-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P49-MOR-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Pure Heavy Brass Traditional Mortar & Pestle (Imam Dasta) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p50",
    "sku": "VM-HOME-P50-KNI",
    "name": "High-Carbon Japanese Steel 8-inch Chef Knife with Sheath",
    "category": "Home & Living",
    "brand": "KatanaEdge",
    "price": 2499,
    "mrp": 3799,
    "discountPercent": 34,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000032100",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-15",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&h=600&fit=crop"
    ],
    "description": "Precision forged from AUS-10 high-carbon Japanese stainless steel hardened to 60\u00b12 HRC. Razor-sharp 15-degree double bevel edge with ergonomic pakkawood handle.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Blade Steel": "AUS-10 High-Carbon Japanese Core",
      "Hardness": "60\u00b12 Rockwell Hardness",
      "Handle": "Military-Grade Ergonomic Pakkawood",
      "Included": "Custom Leather Safety Sheath"
    },
    "shipping": {
      "weight": "310 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 34,
    "reviews": [
      {
        "id": "rev-VM-HOME-P50-KNI-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received High-Carbon Japanese Steel 8-inch Chef Knife with Sheath in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P50-KNI-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P50-KNI-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P50-KNI-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this High-Carbon Japanese Steel 8-inch Chef Knife with Sheath brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p51",
    "sku": "VM-HOME-P51-KAL",
    "name": "Traditional Soapstone (Kalchatti) Slow Cooking Pot (2.5L)",
    "category": "Home & Living",
    "brand": "StoneKitchen",
    "price": 2899,
    "mrp": 3999,
    "discountPercent": 28,
    "stock": 15,
    "quantity": 15,
    "barcode": "8901000032742",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-16",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584990347449-307994463a5a?w=600&h=600&fit=crop"
    ],
    "description": "Hand-carved from natural steatite soapstone by artisans in Tamil Nadu. Retains heat for up to 4 hours after turning off the stove, enhancing flavor and nutritional value of curries.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Capacity": "2.5 Litres",
      "Material": "Natural Hand-Carved Steatite Soapstone",
      "Curing": "Pre-Treated with Turmeric & Castor Oil",
      "Weight": "3.8 kg"
    },
    "shipping": {
      "weight": "3.9 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 15
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 37,
    "reviews": [
      {
        "id": "rev-VM-HOME-P51-KAL-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Traditional Soapstone (Kalchatti) Slow Cooking Pot (2.5L) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P51-KAL-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P51-KAL-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P51-KAL-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Traditional Soapstone (Kalchatti) Slow Cooking Pot (2.5L) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p52",
    "sku": "VM-HOME-P52-DUT",
    "name": "Enameled Heavy Cast Iron Dutch Oven (5.5 Litre)",
    "category": "Home & Living",
    "brand": "CuisineArtisan",
    "price": 4499,
    "mrp": 6499,
    "discountPercent": 31,
    "stock": 18,
    "quantity": 18,
    "barcode": "8901000033384",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-17",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"
    ],
    "description": "Heirloom quality 5.5-quart enameled cast iron Dutch oven with condensation drip rings inside the heavy lid. Impervious porcelain enamel finish requires no seasoning.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Capacity": "5.5 Litres / 5.8 Quarts",
      "Enamel": "Triple-Coat Chip-Resistant Vitreous Enamel",
      "Oven Safe": "Up to 260\u00b0C (500\u00b0F)",
      "Knob": "Heat-Proof Stainless Steel Knob"
    },
    "shipping": {
      "weight": "5.6 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 18
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 40,
    "reviews": [
      {
        "id": "rev-VM-HOME-P52-DUT-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Enameled Heavy Cast Iron Dutch Oven (5.5 Litre) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P52-DUT-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P52-DUT-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P52-DUT-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Enameled Heavy Cast Iron Dutch Oven (5.5 Litre) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p53",
    "sku": "VM-HOME-P53-JAR",
    "name": "Borosilicate Glass Airtight Pantry Food Jars with Bamboo Lids (Set of 6)",
    "category": "Home & Living",
    "brand": "PantryOrganized",
    "price": 1699,
    "mrp": 2499,
    "discountPercent": 32,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000034026",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-18",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584990347449-307994463a5a?w=600&h=600&fit=crop"
    ],
    "description": "Set of 6 stackable high-clarity borosilicate glass storage canisters (2x 500ml, 2x 800ml, 2x 1200ml) with airtight silicone gasket sealed natural bamboo lids.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "Ultra-Clear Heat-Resistant Borosilicate Glass",
      "Lids": "Natural Sustainable Bamboo with Food-Grade Silicone Seal",
      "Set": "6 Jars Assorted Capacities",
      "Dishwasher Safe": "Glass Body Dishwasher Safe"
    },
    "shipping": {
      "weight": "1.8 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 43,
    "reviews": [
      {
        "id": "rev-VM-HOME-P53-JAR-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Borosilicate Glass Airtight Pantry Food Jars with Bamboo Lids (Set of 6) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P53-JAR-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P53-JAR-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P53-JAR-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Borosilicate Glass Airtight Pantry Food Jars with Bamboo Lids (Set of 6) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p54",
    "sku": "VM-HOME-P54-CLA",
    "name": "Handcrafted Natural Clay Handi for Slow Dum Biryani Cooking",
    "category": "Home & Living",
    "brand": "MittiGhar",
    "price": 899,
    "mrp": 1399,
    "discountPercent": 36,
    "stock": 35,
    "quantity": 35,
    "barcode": "8901000034668",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-1",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"
    ],
    "description": "Unglazed porous earthenware handi shaped on potter's wheel using 100% natural clay. Alkalizes acidic foods and circulates steam evenly for authentic slow-cooked dum aroma.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Capacity": "3 Litres",
      "Clay Type": "100% Organic Earthenware (Lead & Cadmium Free)",
      "Includes": "Snug-Fitting Clay Lid",
      "Usage": "Gas Stove on Low-Medium Flame, Microwave"
    },
    "shipping": {
      "weight": "2.1 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 35
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 46,
    "reviews": [
      {
        "id": "rev-VM-HOME-P54-CLA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Handcrafted Natural Clay Handi for Slow Dum Biryani Cooking in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P54-CLA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P54-CLA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P54-CLA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Handcrafted Natural Clay Handi for Slow Dum Biryani Cooking brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p55",
    "sku": "VM-HOME-P55-MAG",
    "name": "Magnetic Acacia Hardwood Wall-Mounted Knife Bar 16-inch",
    "category": "Home & Living",
    "brand": "WoodCrafters",
    "price": 1199,
    "mrp": 1699,
    "discountPercent": 29,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000035310",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-2",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&h=600&fit=crop"
    ],
    "description": "Crafted from solid warm acacia timber embedded with ultra-strong neodymium rare-earth magnets. Holds up to 8 chef knives, cleavers, and kitchen shears securely.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Length": "16 Inches (40 cm)",
      "Wood": "Solid Grade-A Acacia Hardwood",
      "Magnet Type": "Continuous Heavy-Duty Neodymium Core",
      "Mounting": "Includes Wall Screws & 3M Heavy VHB Tape"
    },
    "shipping": {
      "weight": "650 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 49,
    "reviews": [
      {
        "id": "rev-VM-HOME-P55-MAG-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Magnetic Acacia Hardwood Wall-Mounted Knife Bar 16-inch in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P55-MAG-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P55-MAG-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P55-MAG-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Magnetic Acacia Hardwood Wall-Mounted Knife Bar 16-inch brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p56",
    "sku": "VM-HOME-P56-COP",
    "name": "Pure Hammered Copper Water Dispenser Pot with Brass Tap (5L)",
    "category": "Home & Living",
    "brand": "CopperAyur",
    "price": 2299,
    "mrp": 3299,
    "discountPercent": 30,
    "stock": 25,
    "quantity": 25,
    "barcode": "8901000035952",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-3",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"
    ],
    "description": "Hand-hammered from 99.4% pure virgin copper sheeting. Features leak-proof chrome-plated brass spigot and tight-fitting copper lid to naturally ionize and purify drinking water (Tamra Jal).",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Capacity": "5 Litres",
      "Purity": "99.4% Certified Pure Copper",
      "Spigot": "Solid Brass Quarter-Turn Dispenser Tap",
      "Finish": "Artisanal Hand-Hammered Dimple Finish"
    },
    "shipping": {
      "weight": "1.6 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 25
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 52,
    "reviews": [
      {
        "id": "rev-VM-HOME-P56-COP-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Pure Hammered Copper Water Dispenser Pot with Brass Tap (5L) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P56-COP-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P56-COP-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P56-COP-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Pure Hammered Copper Water Dispenser Pot with Brass Tap (5L) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p57",
    "sku": "VM-HOME-P57-BAS",
    "name": "Stainless Steel Multi-Tier Vegetable & Fruit Counter Basket",
    "category": "Home & Living",
    "brand": "KitchenSpace",
    "price": 1299,
    "mrp": 1899,
    "discountPercent": 32,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000036594",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-4",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584990347449-307994463a5a?w=600&h=600&fit=crop"
    ],
    "description": "Durable 2-tier wire mesh storage basket with solid natural pine wood tabletop lid. Open wire construction maximizes air circulation to prevent produce spoiling.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "Powder-Coated Rust-Resistant Carbon Steel",
      "Top": "Removable Natural Pine Wood Cutting Board Top",
      "Dimensions": "32cm x 18cm x 36cm",
      "Load Capacity": "Up to 15 kg"
    },
    "shipping": {
      "weight": "1.9 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 55,
    "reviews": [
      {
        "id": "rev-VM-HOME-P57-BAS-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Stainless Steel Multi-Tier Vegetable & Fruit Counter Basket in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P57-BAS-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P57-BAS-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P57-BAS-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Stainless Steel Multi-Tier Vegetable & Fruit Counter Basket brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p58",
    "sku": "VM-HOME-P58-KAD",
    "name": "Hard Anodized Heavy Base Deep Kadai with Stainless Steel Lid",
    "category": "Home & Living",
    "brand": "ProKitchen",
    "price": 1799,
    "mrp": 2599,
    "discountPercent": 31,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000037236",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-5",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"
    ],
    "description": "Non-reactive hard anodized surface is 2.4 times harder than steel. 4.25mm extra-thick base ensures uniform heat distribution for deep frying, saut\u00e9ing, and gravies.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Capacity": "3.5 Litres / 26 cm Diameter",
      "Thickness": "4.25 mm Heavy Induction Base",
      "Surface": "Hard Anodized Non-Toxic Coating (No PFOA)",
      "Handles": "Stay-Cool Stainless Steel Double Rivets"
    },
    "shipping": {
      "weight": "2.4 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 30
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 58,
    "reviews": [
      {
        "id": "rev-VM-HOME-P58-KAD-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Hard Anodized Heavy Base Deep Kadai with Stainless Steel Lid in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P58-KAD-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P58-KAD-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P58-KAD-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Hard Anodized Heavy Base Deep Kadai with Stainless Steel Lid brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p59",
    "sku": "VM-HOME-P59-COF",
    "name": "Vintage Style Hand-Cranked Heavy Brass Coffee Grinder",
    "category": "Home & Living",
    "brand": "HeritageCraft",
    "price": 1999,
    "mrp": 2899,
    "discountPercent": 31,
    "stock": 22,
    "quantity": 22,
    "barcode": "8901000037878",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-6",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"
    ],
    "description": "Traditional Turkish/South Indian filter coffee mill built with solid brass body and conical steel grinding burrs. Adjustable grind setting from espresso fine to French press coarse.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "Solid Antique Brass Body",
      "Burrs": "Hardened Carbon Steel Conical Burrs",
      "Adjustment": "Stepless Manual Bottom Grind Dial",
      "Portability": "Foldable Crank Handle"
    },
    "shipping": {
      "weight": "850 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 22
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 61,
    "reviews": [
      {
        "id": "rev-VM-HOME-P59-COF-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Vintage Style Hand-Cranked Heavy Brass Coffee Grinder in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P59-COF-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P59-COF-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P59-COF-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Vintage Style Hand-Cranked Heavy Brass Coffee Grinder brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p60",
    "sku": "VM-HOME-P60-MAT",
    "name": "Dual-Sided Microfiber Dish Drying Mat with Silicone Trivet Set",
    "category": "Home & Living",
    "brand": "CleanCounter",
    "price": 599,
    "mrp": 899,
    "discountPercent": 33,
    "stock": 60,
    "quantity": 60,
    "barcode": "8901000038520",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-7",
    "restockLeadDays": 3,
    "vendorId": "v4",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584990347449-307994463a5a?w=600&h=600&fit=crop"
    ],
    "description": "Extra-large 18x24 inch ultra-absorbent microfiber drying mat with thick foam core. Includes pair of heat-resistant honeycomb silicone trivet coasters.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Dimensions": "18\" x 24\" (45 cm x 60 cm)",
      "Absorbency": "Holds 4x Its Weight in Water",
      "Care": "Machine Washable",
      "Includes": "2x Heat-Proof Silicone Trivets"
    },
    "shipping": {
      "weight": "380 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 60
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 64,
    "reviews": [
      {
        "id": "rev-VM-HOME-P60-MAT-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Dual-Sided Microfiber Dish Drying Mat with Silicone Trivet Set in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P60-MAT-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-HOME-P60-MAT-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-HOME-P60-MAT-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Dual-Sided Microfiber Dish Drying Mat with Silicone Trivet Set brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p61",
    "sku": "VM-SPOR-P61-YOG",
    "name": "Apex Pro Grip High-Density Eco-TPE 6mm Yoga Mat with Alignment Lines",
    "category": "Sports",
    "brand": "Apex Sports",
    "price": 1499,
    "mrp": 2499,
    "discountPercent": 40,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000039162",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-8",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=600&fit=crop"
    ],
    "description": "Dual-textured non-slip surface with laser-engraved central posture alignment guides. Made from biodegradable certified eco-TPE, offering optimal knee cushioning and sweat resistance.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Dimensions": "72\" x 26\" x 6mm Thick",
      "Material": "100% Eco-Friendly Non-Toxic TPE (Latex & PVC Free)",
      "Grip": "Dual-Sided Reversible Anti-Skid Textures",
      "Includes": "Cotton Carry Strap & Breathable Mesh Bag"
    },
    "shipping": {
      "weight": "950 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 67,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P61-YOG-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Apex Pro Grip High-Density Eco-TPE 6mm Yoga Mat with Alignment Lines in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P61-YOG-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P61-YOG-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P61-YOG-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Apex Pro Grip High-Density Eco-TPE 6mm Yoga Mat with Alignment Lines brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p62",
    "sku": "VM-SPOR-P62-DUM",
    "name": "Solid Cast Iron Hex Dumbbell Pair (10kg Each) Rubber Coated",
    "category": "Sports",
    "brand": "Apex Sports",
    "price": 3499,
    "mrp": 4999,
    "discountPercent": 30,
    "stock": 25,
    "quantity": 25,
    "barcode": "8901000039804",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-9",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&h=600&fit=crop"
    ],
    "description": "Pair of 10kg anti-roll hexagonal dumbbells with premium virgin rubber heads to protect home gym floors and ergonomic knurled chrome steel handles for non-slip grip.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Weight": "2x 10 kg (20 kg Total Set)",
      "Head Material": "Solid Cast Iron Encased in Virgin Rubber",
      "Handle": "Ergonomic Knurled Solid Chrome Steel",
      "Shape": "Anti-Roll 6-Sided Hexagonal Heads"
    },
    "shipping": {
      "weight": "20.2 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 25
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 70,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P62-DUM-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Solid Cast Iron Hex Dumbbell Pair (10kg Each) Rubber Coated in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P62-DUM-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P62-DUM-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P62-DUM-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Solid Cast Iron Hex Dumbbell Pair (10kg Each) Rubber Coated brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p63",
    "sku": "VM-SPOR-P63-YON",
    "name": "Yonex Nanoflare 800 Pro High-Flex Tournament Badminton Racket",
    "category": "Sports",
    "brand": "Yonex",
    "price": 9999,
    "mrp": 13999,
    "discountPercent": 29,
    "stock": 18,
    "quantity": 18,
    "barcode": "8901000040446",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-10",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=600&fit=crop"
    ],
    "description": "Professional headlight tournament racquet engineered with Sonic Flare System and Torayca M40X graphite for lightning-fast drive speeds and razor-sharp maneuverability.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Frame": "HM Graphite + M40X + Super HMG",
      "Weight / Grip": "4U (Avg. 83g) G5",
      "String Tension": "Pre-strung at 26 lbs (Max 28 lbs)",
      "Flex": "Stiff Lightning Fast Response"
    },
    "shipping": {
      "weight": "83 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 18
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 73,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P63-YON-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Yonex Nanoflare 800 Pro High-Flex Tournament Badminton Racket in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P63-YON-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P63-YON-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P63-YON-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Yonex Nanoflare 800 Pro High-Flex Tournament Badminton Racket brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p64",
    "sku": "VM-SPOR-P64-CYC",
    "name": "Decathlon Btwin Rockrider 21-Speed Alloy Mountain Cycle",
    "category": "Sports",
    "brand": "Btwin",
    "price": 16999,
    "mrp": 21999,
    "discountPercent": 23,
    "stock": 10,
    "quantity": 10,
    "barcode": "8901000041088",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-11",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=600&fit=crop"
    ],
    "description": "Robust 6061 aluminum alloy frame with 80mm front suspension fork, Shimano Tourney 21-speed gears, and mechanical dual disc brakes for rugged trail and city commuting.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Frame": "Lightweight 6061 T6 Aluminum",
      "Gears": "Shimano Tourney 3x7 Speed Thumb Shifters",
      "Brakes": "Dual 160mm Mechanical Disc Brakes",
      "Wheel Size": "27.5\" Double-Wall Alloy Rims"
    },
    "shipping": {
      "weight": "14.8 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 10
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 76,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P64-CYC-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Decathlon Btwin Rockrider 21-Speed Alloy Mountain Cycle in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P64-CYC-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P64-CYC-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P64-CYC-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Decathlon Btwin Rockrider 21-Speed Alloy Mountain Cycle brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p65",
    "sku": "VM-SPOR-P65-SPE",
    "name": "Speedo Biofuse Anti-Fog UV Shield Competitive Swimming Goggles",
    "category": "Sports",
    "brand": "Speedo",
    "price": 1399,
    "mrp": 1999,
    "discountPercent": 30,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000041730",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-12",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=600&fit=crop"
    ],
    "description": "Engineered with Speedo Biofuse technology featuring super-soft gel seals that adapt to facial contours. Anti-fog coated polycarbonate lenses with 100% UV400 sun protection.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Lens": "Polycarbonate with Anti-Fog & UV400 Coating",
      "Seal": "Ultra-Flexible Gel Biofuse Cushions",
      "Strap": "Dual Silicone Strap with Push-Button Adjustment Clip",
      "Field of View": "Wide 180-Degree Peripheral Vision"
    },
    "shipping": {
      "weight": "120 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 79,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P65-SPE-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Speedo Biofuse Anti-Fog UV Shield Competitive Swimming Goggles in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P65-SPE-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P65-SPE-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P65-SPE-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Speedo Biofuse Anti-Fog UV Shield Competitive Swimming Goggles brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p66",
    "sku": "VM-SPOR-P66-STR",
    "name": "Strauss Adjustable Chrome Plated Dumbbell Set (20kg with Steel Case)",
    "category": "Sports",
    "brand": "Strauss",
    "price": 3799,
    "mrp": 5499,
    "discountPercent": 31,
    "stock": 20,
    "quantity": 20,
    "barcode": "8901000042372",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-13",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&h=600&fit=crop"
    ],
    "description": "Complete 20kg weight plate set with 2 knurled chrome dumbbell bars, 4 spinlock safety collars, and hard-shell carry storage case. Easily configure from 2.5kg to 10kg per dumbbell.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Total Weight": "20 kg Combined Set",
      "Plates": "4x 2.5kg, 4x 1.25kg, 4x 0.5kg Chrome Cast Iron Plates",
      "Bars": "2x 14\" Solid Chrome Threaded Handles",
      "Collars": "4x Star Spinlock Threaded Collars"
    },
    "shipping": {
      "weight": "20.5 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 20
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 82,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P66-STR-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Strauss Adjustable Chrome Plated Dumbbell Set (20kg with Steel Case) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P66-STR-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P66-STR-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P66-STR-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Strauss Adjustable Chrome Plated Dumbbell Set (20kg with Steel Case) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p67",
    "sku": "VM-SPOR-P67-COS",
    "name": "Cosco Premier Synthetic Leather Tournament Basketball Size 7",
    "category": "Sports",
    "brand": "Cosco",
    "price": 1199,
    "mrp": 1799,
    "discountPercent": 33,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000043014",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-14",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop"
    ],
    "description": "FIBA certified official size 7 basketball crafted with micro-fiber composite leather. Deep channel contouring and butyl bladder provide superior indoor/outdoor bounce consistency.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Size": "Official Size 7 (29.5 Inches)",
      "Cover": "Composite Microfiber Deep-Pebbled Leather",
      "Bladder": "100% Butyl Rubber Bladder with Nylon Windings",
      "Play Surface": "Indoor Hardwood & Outdoor Concrete Courts"
    },
    "shipping": {
      "weight": "610 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 85,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P67-COS-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Cosco Premier Synthetic Leather Tournament Basketball Size 7 in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P67-COS-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P67-COS-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P67-COS-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Cosco Premier Synthetic Leather Tournament Basketball Size 7 brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p68",
    "sku": "VM-SPOR-P68-PUL",
    "name": "Heavy-Duty Multi-Grip Doorframe Pull-Up and Dip Bar Station",
    "category": "Sports",
    "brand": "Apex Sports",
    "price": 1899,
    "mrp": 2799,
    "discountPercent": 32,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000043656",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-15",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=600&fit=crop"
    ],
    "description": "No-screw leverage doorway trainer fits standard 24-36 inch doorframes. Heavy-gauge steel supports wide-grip pull-ups, chin-ups, push-ups, and hanging leg raises.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Capacity": "Tested up to 150 kg (330 lbs)",
      "Frame": "Reinforced High-Tensile Tubular Steel",
      "Grips": "High-Density Slip-Resistant Foam Padding",
      "Compatibility": "Standard Doorways 24\" to 36\" Wide"
    },
    "shipping": {
      "weight": "3.4 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 30
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 88,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P68-PUL-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Heavy-Duty Multi-Grip Doorframe Pull-Up and Dip Bar Station in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P68-PUL-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P68-PUL-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P68-PUL-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Heavy-Duty Multi-Grip Doorframe Pull-Up and Dip Bar Station brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p69",
    "sku": "VM-SPOR-P69-NIV",
    "name": "Nivia Storm Hand-Stitched High-Tensile Football Size 5",
    "category": "Sports",
    "brand": "Nivia",
    "price": 799,
    "mrp": 1199,
    "discountPercent": 33,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000044298",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-16",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=600&fit=crop"
    ],
    "description": "FIFA quality standard size 5 football featuring 32 hand-stitched PU synthetic leather panels, multi-ply polyester backing, and reinforced latex bladder for aerodynamic true flight.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Size": "Official Size 5 Match Ball",
      "Panels": "32 Hand-Stitched Panels",
      "Material": "Abrasion-Resistant PU Leather",
      "Pressure": "8.5 - 11.5 PSI"
    },
    "shipping": {
      "weight": "430 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 91,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P69-NIV-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Nivia Storm Hand-Stitched High-Tensile Football Size 5 in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P69-NIV-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P69-NIV-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P69-NIV-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Nivia Storm Hand-Stitched High-Tensile Football Size 5 brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p70",
    "sku": "VM-SPOR-P70-RES",
    "name": "Heavy-Duty Resistance Loop Bands Set (5 Progressive Tension Tiers)",
    "category": "Sports",
    "brand": "Apex Sports",
    "price": 699,
    "mrp": 1299,
    "discountPercent": 46,
    "stock": 70,
    "quantity": 70,
    "barcode": "8901000044940",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-17",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=600&fit=crop"
    ],
    "description": "Set of 5 color-coded 100% natural Malaysian latex loop bands ranging from X-Light (5 lbs) to X-Heavy (40 lbs). Perfect for glute activation, physical therapy, and home pilates.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "100% Snap-Resistant Natural Latex",
      "Set Includes": "5 Bands (5lb, 10lb, 20lb, 30lb, 40lb)",
      "Accessories": "Waterproof Drawstring Travel Pouch + Guide",
      "Length": "12 Inches x 2 Inches Wide"
    },
    "shipping": {
      "weight": "220 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 70
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 24,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P70-RES-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Heavy-Duty Resistance Loop Bands Set (5 Progressive Tension Tiers) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P70-RES-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P70-RES-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P70-RES-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Heavy-Duty Resistance Loop Bands Set (5 Progressive Tension Tiers) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p71",
    "sku": "VM-SPOR-P71-FOA",
    "name": "High-Density EVA Foam Roller for Deep Tissue Muscle Recovery 18-inch",
    "category": "Sports",
    "brand": "Apex Sports",
    "price": 899,
    "mrp": 1499,
    "discountPercent": 40,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000045582",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-18",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600&h=600&fit=crop"
    ],
    "description": "Grid-patterned multi-density EVA trigger point foam roller over rigid hollow core. Simulates sports massage therapist fingers to release myofascial knots and relieve back tightness.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Length": "18 Inches x 5.5 Inch Diameter",
      "Core": "Heavy-Duty Rigid PVC Core (Supports 200kg)",
      "Exterior": "Firm 3D Matrix High-Density EVA Foam",
      "Target": "Back, IT Bands, Quads, Hamstrings, Glutes"
    },
    "shipping": {
      "weight": "850 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 27,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P71-FOA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received High-Density EVA Foam Roller for Deep Tissue Muscle Recovery 18-inch in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P71-FOA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P71-FOA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P71-FOA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this High-Density EVA Foam Roller for Deep Tissue Muscle Recovery 18-inch brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p72",
    "sku": "VM-SPOR-P72-RUC",
    "name": "60L All-Weather Waterproof Trekking Rucksack with Rain Cover",
    "category": "Sports",
    "brand": "WildCamp",
    "price": 2999,
    "mrp": 4499,
    "discountPercent": 33,
    "stock": 25,
    "quantity": 25,
    "barcode": "8901000046224",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-1",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"
    ],
    "description": "Expedition grade 60-litre hiking backpack with internal ergonomic aluminum frame, breathable padded lumbar harness, dedicated sleeping bag base compartment, and integrated rain cover.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Volume": "60 Litres + 5L Expansion Collar",
      "Fabric": "1000D Tear-Resistant Ripstop Nylon",
      "Frame": "Internal Dual Ergonomic Aluminum Stays",
      "Features": "Trekking Pole Loops & Hydration Bladder Sleeve"
    },
    "shipping": {
      "weight": "1.65 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 25
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 30,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P72-RUC-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received 60L All-Weather Waterproof Trekking Rucksack with Rain Cover in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P72-RUC-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P72-RUC-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P72-RUC-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this 60L All-Weather Waterproof Trekking Rucksack with Rain Cover brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p73",
    "sku": "VM-SPOR-P73-BOX",
    "name": "Professional Boxing Training Gloves 14oz with Gel Padding",
    "category": "Sports",
    "brand": "Apex Sports",
    "price": 1799,
    "mrp": 2699,
    "discountPercent": 33,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000046866",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-2",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=600&fit=crop"
    ],
    "description": "Constructed with premium engineered synthetic leather and multi-layered shock-absorbing EVA gel foam knuckle padding. Wide wraparound Velcro wrist strap delivers superior joint stabilization.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Weight": "14 oz (Sparring & Heavy Bag Training)",
      "Padding": "Triple-Density Gel Infused Foam",
      "Wrist Support": "360-Degree Wraparound Hook & Loop Strap",
      "Ventilation": "Perforated Palm Airflow Mesh"
    },
    "shipping": {
      "weight": "680 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 30
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 33,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P73-BOX-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Professional Boxing Training Gloves 14oz with Gel Padding in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P73-BOX-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P73-BOX-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P73-BOX-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Professional Boxing Training Gloves 14oz with Gel Padding brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p74",
    "sku": "VM-SPOR-P74-SIP",
    "name": "Double-Wall Vacuum Insulated Stainless Steel Sports Sipper (1000ml)",
    "category": "Sports",
    "brand": "HydroActive",
    "price": 799,
    "mrp": 1299,
    "discountPercent": 38,
    "stock": 60,
    "quantity": 60,
    "barcode": "8901000047508",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-3",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop"
    ],
    "description": "18/8 food-grade stainless steel vacuum flask keeps beverages icy cold for 24 hours or piping hot for 12 hours. Features leak-proof flip straw sports lid with integrated carry handle.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Capacity": "1000 ml / 34 oz",
      "Thermal Insulation": "24h Cold / 12h Hot Vacuum Core",
      "Steel Grade": "Food-Grade 304 (18/8) Stainless Steel",
      "Lid Type": "One-Click Flip Straw Spout"
    },
    "shipping": {
      "weight": "460 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 60
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 36,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P74-SIP-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Double-Wall Vacuum Insulated Stainless Steel Sports Sipper (1000ml) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P74-SIP-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P74-SIP-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P74-SIP-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Double-Wall Vacuum Insulated Stainless Steel Sports Sipper (1000ml) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p75",
    "sku": "VM-SPOR-P75-JUM",
    "name": "High-Speed Adjustable Steel Cable Jump Rope with Ball Bearings",
    "category": "Sports",
    "brand": "Apex Sports",
    "price": 499,
    "mrp": 899,
    "discountPercent": 44,
    "stock": 80,
    "quantity": 80,
    "barcode": "8901000048150",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-4",
    "restockLeadDays": 3,
    "vendorId": "v5",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=600&fit=crop"
    ],
    "description": "Precision 360-degree dual ball bearing mechanism eliminates friction for ultra-fast double unders and cardio endurance. 10ft PVC-coated braided steel wire easily resizes with thumbscrews.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Cable": "10ft (3m) PVC-Coated Braided Steel Wire",
      "Bearings": "Dual 360\u00b0 Stainless Steel Ball Bearings",
      "Handles": "Textured Anti-Slip Aluminum Alloy Handles",
      "Adjustment": "Quick-Lock Thumbscrews"
    },
    "shipping": {
      "weight": "190 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 80
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 39,
    "reviews": [
      {
        "id": "rev-VM-SPOR-P75-JUM-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received High-Speed Adjustable Steel Cable Jump Rope with Ball Bearings in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P75-JUM-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SPOR-P75-JUM-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SPOR-P75-JUM-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this High-Speed Adjustable Steel Cable Jump Rope with Ball Bearings brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p76",
    "sku": "VM-BEAU-P76-KUM",
    "name": "Kumkumadi Miraculous Ayurvedic Night Beauty Face Oil (30ml)",
    "category": "Beauty",
    "brand": "GlowAura",
    "price": 1899,
    "mrp": 2699,
    "discountPercent": 30,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000048792",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-5",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1608248597359-46797a7e58a2?w=600&h=600&fit=crop"
    ],
    "description": "Formulated according to Charaka Samhita with Kashmiri saffron (Kumkuma), sandalwood, and 26 rare Himalayan herbs infused in sesame oil. Restores radiant luminous skin overnight.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Key Ingredients": "Pure Kashmiri Saffron, Sandalwood, Lotus Extracts",
      "Skin Type": "All Skin Types (Ideal for Pigmentation & Glow)",
      "Free From": "Mineral Oils, Parabens, Synthetic Fragrance",
      "Volume": "30 ml Amber Dropper Bottle"
    },
    "shipping": {
      "weight": "110 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 42,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P76-KUM-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Kumkumadi Miraculous Ayurvedic Night Beauty Face Oil (30ml) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P76-KUM-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P76-KUM-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P76-KUM-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Kumkumadi Miraculous Ayurvedic Night Beauty Face Oil (30ml) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p77",
    "sku": "VM-BEAU-P77-ARG",
    "name": "Cold-Pressed Moroccan Argan & Rosemary Scalp Revitalizing Oil (100ml)",
    "category": "Beauty",
    "brand": "GlowAura",
    "price": 999,
    "mrp": 1499,
    "discountPercent": 33,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000049434",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-6",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1608248597359-46797a7e58a2?w=600&h=600&fit=crop"
    ],
    "description": "Pure cold-pressed Moroccan Argan oil blended with concentrated Spanish Rosemary (Rosmarinus officinalis) and Bhringraj. Stimulates hair follicles, combats thinning, and conditions split ends.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Key Active": "Rosemary Extract 2% + Pure Virgin Argan Oil",
      "Benefit": "Strengthens Hair Roots & Reduces Hair Fall",
      "Application": "Pre-shampoo Scalp Massage 2-3 Times Weekly",
      "Volume": "100 ml"
    },
    "shipping": {
      "weight": "220 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 45,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P77-ARG-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Cold-Pressed Moroccan Argan & Rosemary Scalp Revitalizing Oil (100ml) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P77-ARG-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P77-ARG-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P77-ARG-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Cold-Pressed Moroccan Argan & Rosemary Scalp Revitalizing Oil (100ml) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p78",
    "sku": "VM-BEAU-P78-ROS",
    "name": "Pure Hydro-Distilled Kannauj Damask Rosewater Facial Mist (200ml)",
    "category": "Beauty",
    "brand": "GlowAura",
    "price": 549,
    "mrp": 799,
    "discountPercent": 31,
    "stock": 70,
    "quantity": 70,
    "barcode": "8901000050076",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-7",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop"
    ],
    "description": "Steam-distilled in Kannauj using traditional copper Deg-Bhapka stills from fresh morning-harvested Rosa Damascena petals. Balances skin pH and calms redness naturally.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Distillation": "Traditional Copper Deg-Bhapka Steam Distilled",
      "Origin": "Kannauj, Uttar Pradesh",
      "Alcohol Content": "0% Alcohol & Preservative Free",
      "Packaging": "Fine-Mist Sprayer Bottle 200ml"
    },
    "shipping": {
      "weight": "280 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 70
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 48,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P78-ROS-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Pure Hydro-Distilled Kannauj Damask Rosewater Facial Mist (200ml) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P78-ROS-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P78-ROS-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P78-ROS-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Pure Hydro-Distilled Kannauj Damask Rosewater Facial Mist (200ml) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p79",
    "sku": "VM-BEAU-P79-UBT",
    "name": "Kashmiri Saffron & Sandalwood Glow Radiance Ubtan Pack (150g)",
    "category": "Beauty",
    "brand": "GlowAura",
    "price": 699,
    "mrp": 999,
    "discountPercent": 30,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000050718",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-8",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop"
    ],
    "description": "Traditional wedding radiance recipe made with stone-ground chickpea flour, turmeric root, sandalwood, saffron, and sweet almond powder. Gently exfoliates dead cells and lightens tan.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Ingredients": "Besan, Sandalwood, Kashmiri Saffron, Turmeric, Almond Flour",
      "Texture": "Micro-Fine Powder Mask",
      "How to Use": "Mix with Rosewater or Raw Milk",
      "Net Weight": "150 Grams"
    },
    "shipping": {
      "weight": "210 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 51,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P79-UBT-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Kashmiri Saffron & Sandalwood Glow Radiance Ubtan Pack (150g) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P79-UBT-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P79-UBT-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P79-UBT-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Kashmiri Saffron & Sandalwood Glow Radiance Ubtan Pack (150g) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p80",
    "sku": "VM-BEAU-P80-VIT",
    "name": "Stabilized Vitamin C 20% + Ferulic Acid Glow Face Serum (30ml)",
    "category": "Beauty",
    "brand": "GlowAura Clinical",
    "price": 799,
    "mrp": 1199,
    "discountPercent": 33,
    "stock": 60,
    "quantity": 60,
    "barcode": "8901000051360",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-9",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop"
    ],
    "description": "High-potency 20% Ethyl Ascorbic Acid stabilized with 1% Ferulic Acid and Hyaluronic Acid. Fades stubborn dark spots, evens out hyperpigmentation, and stimulates collagen synthesis.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Active Formulation": "20% 3-O-Ethyl Ascorbic Acid + 1% Ferulic Acid",
      "Hydration": "1% Multi-Molecular Hyaluronic Acid",
      "Stability": "Oxidation-Proof Photostable Formula",
      "pH": "Balanced 3.5 - 4.0"
    },
    "shipping": {
      "weight": "110 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 60
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 54,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P80-VIT-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Stabilized Vitamin C 20% + Ferulic Acid Glow Face Serum (30ml) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P80-VIT-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P80-VIT-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P80-VIT-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Stabilized Vitamin C 20% + Ferulic Acid Glow Face Serum (30ml) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p81",
    "sku": "VM-BEAU-P81-CAN",
    "name": "French Lavender & Roman Chamomile Hand-Poured Aromatherapy Soy Candle",
    "category": "Beauty",
    "brand": "GlowAura Home",
    "price": 649,
    "mrp": 950,
    "discountPercent": 32,
    "stock": 55,
    "quantity": 55,
    "barcode": "8901000052002",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-10",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop"
    ],
    "description": "Handcrafted with 100% natural biodegradable soy wax, wooden crackling wick, and therapeutic pure essential oils. Burns cleanly for over 40 hours to promote restorative sleep.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Wax": "100% Natural Biodegradable Golden Soy Wax",
      "Wick": "Natural FSC-Certified Crackling Wood Wick",
      "Burn Time": "40+ Hours Clean Smoke-Free Burn",
      "Vessel": "Amber Glass Jar with Cork Lid"
    },
    "shipping": {
      "weight": "360 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 55
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 57,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P81-CAN-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received French Lavender & Roman Chamomile Hand-Poured Aromatherapy Soy Candle in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P81-CAN-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P81-CAN-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P81-CAN-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this French Lavender & Roman Chamomile Hand-Poured Aromatherapy Soy Candle brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p82",
    "sku": "VM-BEAU-P82-SHA",
    "name": "Organic Bhringraj, Shikakai & Amla Hair Growth Solid Shampoo Bar",
    "category": "Beauty",
    "brand": "GlowAura",
    "price": 399,
    "mrp": 599,
    "discountPercent": 33,
    "stock": 65,
    "quantity": 65,
    "barcode": "8901000052644",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-11",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1607006314643-2287232230ef?w=600&h=600&fit=crop"
    ],
    "description": "Zero-plastic concentrated shampoo bar enriched with Bhringraj, Reetha, Shikakai, and cold-pressed castor oil. pH-balanced 5.5 creates rich lather without stripping natural scalp oils.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Form": "Solid Waterless Concentrated Bar (Equivalent to 3 Bottles)",
      "Packaging": "100% Recyclable Aluminium Travel Tin",
      "Key Herbs": "Bhringraj, Shikakai, Amla, Reetha",
      "Net Weight": "90 Grams"
    },
    "shipping": {
      "weight": "120 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 65
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 60,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P82-SHA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Organic Bhringraj, Shikakai & Amla Hair Growth Solid Shampoo Bar in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P82-SHA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P82-SHA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P82-SHA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Organic Bhringraj, Shikakai & Amla Hair Growth Solid Shampoo Bar brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p83",
    "sku": "VM-BEAU-P83-SCR",
    "name": "Arabica Coffee & Raw Shea Butter Exfoliating Body Polish Scrub (200g)",
    "category": "Beauty",
    "brand": "GlowAura",
    "price": 599,
    "mrp": 899,
    "discountPercent": 33,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000053286",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-12",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop"
    ],
    "description": "Freshly ground Coorg Arabica coffee beans whipped with raw Ghanaian shea butter, sweet almond oil, and brown sugar. Eliminates dry flaky skin and stimulates microcirculation.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Exfoliant": "Coorg Arabica Coffee & Cane Brown Sugar",
      "Nourishment": "Raw Unrefined Shea Butter & Almond Oil",
      "Target": "Body Keratosis Pilaris & Rough Elbows/Knees",
      "Net Weight": "200 Grams"
    },
    "shipping": {
      "weight": "260 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 63,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P83-SCR-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Arabica Coffee & Raw Shea Butter Exfoliating Body Polish Scrub (200g) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P83-SCR-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P83-SCR-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P83-SCR-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Arabica Coffee & Raw Shea Butter Exfoliating Body Polish Scrub (200g) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p84",
    "sku": "VM-BEAU-P84-GUA",
    "name": "Hand-Carved Brazilian Rose Quartz Gua Sha & Dual Facial Roller",
    "category": "Beauty",
    "brand": "GlowAura Rituals",
    "price": 899,
    "mrp": 1499,
    "discountPercent": 40,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000053928",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-13",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop"
    ],
    "description": "Cut from 100% natural Grade-A Brazilian rose quartz stone. Boosts lymphatic drainage, sculpts jawline contours, eases facial muscle tension, and enhances serum absorption.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "100% Genuine Natural Rose Quartz Crystal",
      "Hardware": "Silent Reinforced Rose Gold Zinc Alloy Frame",
      "Includes": "Double-Sided Roller + Heart Shaped Gua Sha Stone",
      "Packaging": "Padded Velvet Storage Box"
    },
    "shipping": {
      "weight": "240 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 66,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P84-GUA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Hand-Carved Brazilian Rose Quartz Gua Sha & Dual Facial Roller in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P84-GUA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P84-GUA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P84-GUA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Hand-Carved Brazilian Rose Quartz Gua Sha & Dual Facial Roller brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p85",
    "sku": "VM-BEAU-P85-JOJ",
    "name": "Pure Cold-Pressed Golden Jojoba Carrier Oil for Deep Hydration (100ml)",
    "category": "Beauty",
    "brand": "GlowAura",
    "price": 699,
    "mrp": 999,
    "discountPercent": 30,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000054570",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-14",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1608248597359-46797a7e58a2?w=600&h=600&fit=crop"
    ],
    "description": "100% pure unrefined golden jojoba oil. Closely mimics the skin's natural sebum, absorbing instantaneously without clogging pores. Balances oily and acne-prone complexions.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Extraction": "Single First Cold-Pressing of Jojoba Seeds",
      "Comedogenic Rating": "0 (Will Not Clog Pores)",
      "Application": "Face, Hair, Beard, Cuticles, Makeup Removal",
      "Volume": "100 ml Glass Dropper"
    },
    "shipping": {
      "weight": "220 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 69,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P85-JOJ-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Pure Cold-Pressed Golden Jojoba Carrier Oil for Deep Hydration (100ml) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P85-JOJ-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P85-JOJ-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P85-JOJ-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Pure Cold-Pressed Golden Jojoba Carrier Oil for Deep Hydration (100ml) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p86",
    "sku": "VM-BEAU-P86-LIP",
    "name": "Tinted Beetroot & Pomegranate Organic Lip Butter Balm (15g)",
    "category": "Beauty",
    "brand": "GlowAura",
    "price": 299,
    "mrp": 450,
    "discountPercent": 34,
    "stock": 80,
    "quantity": 80,
    "barcode": "8901000055212",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-15",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop"
    ],
    "description": "Deeply hydrating lip butter handcrafted with pure beeswax, cocoa butter, cold-pressed pomegranate seed oil, and natural ruby beetroot pigment. Softens chapped lips with sheer tint.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Flavor": "Natural Sweet Pomegranate Extract",
      "Pigment": "100% Plant-Derived Beetroot Extract",
      "Base": "Cocoa Butter, Beeswax, Cold-Pressed Almond Oil",
      "Free From": "Petroleum Jelly, Synthetic Dyes"
    },
    "shipping": {
      "weight": "40 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 80
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 72,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P86-LIP-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Tinted Beetroot & Pomegranate Organic Lip Butter Balm (15g) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P86-LIP-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P86-LIP-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P86-LIP-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Tinted Beetroot & Pomegranate Organic Lip Butter Balm (15g) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p87",
    "sku": "VM-BEAU-P87-DEO",
    "name": "Natural Cream Deodorant with Bergamot & Tea Tree (Aluminium-Free)",
    "category": "Beauty",
    "brand": "GlowAura",
    "price": 449,
    "mrp": 650,
    "discountPercent": 31,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000055854",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-16",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop"
    ],
    "description": "Aluminum-free and baking soda-free deodorant formulated with arrowroot starch, zinc ricinoleate, and organic coconut oil. Neutralizes odor-causing bacteria for 24-hour freshness.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Active Deodorizer": "Zinc Ricinoleate & Tea Tree Essential Oil",
      "Free From": "Aluminium Chlorohydrate, Alcohol, Parabens",
      "Fragrance": "Calabrian Bergamot & Cedarwood",
      "Net Weight": "50 Grams Glass Pot"
    },
    "shipping": {
      "weight": "140 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 75,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P87-DEO-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Natural Cream Deodorant with Bergamot & Tea Tree (Aluminium-Free) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P87-DEO-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P87-DEO-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P87-DEO-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Natural Cream Deodorant with Bergamot & Tea Tree (Aluminium-Free) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p88",
    "sku": "VM-BEAU-P88-CLE",
    "name": "Organic Neem & Wild Haldi Gentle Purifying Gel Cleanser (150ml)",
    "category": "Beauty",
    "brand": "GlowAura",
    "price": 499,
    "mrp": 750,
    "discountPercent": 33,
    "stock": 55,
    "quantity": 55,
    "barcode": "8901000056496",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-17",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop"
    ],
    "description": "Sulfate-free foaming gel face wash packed with fresh organic neem leaf extract, Kasturi Manjal (wild turmeric), and tea tree oil. Cleanses pores deeply without dehydrating the skin barrier.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Surfactants": "Coconut-Derived Gentle Glucosides (Sulfate-Free)",
      "Active Herbs": "Organic Neem, Kasturi Manjal, Aloe Vera",
      "pH Level": "Skin-Friendly pH 5.5",
      "Volume": "150 ml Pump Bottle"
    },
    "shipping": {
      "weight": "210 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 55
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 78,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P88-CLE-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Organic Neem & Wild Haldi Gentle Purifying Gel Cleanser (150ml) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P88-CLE-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P88-CLE-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P88-CLE-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Organic Neem & Wild Haldi Gentle Purifying Gel Cleanser (150ml) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p89",
    "sku": "VM-BEAU-P89-ATT",
    "name": "Traditional Indian Jasmine Sambac & Vetiver Handcrafted Attar (12ml)",
    "category": "Beauty",
    "brand": "GlowAura Perfumery",
    "price": 899,
    "mrp": 1299,
    "discountPercent": 31,
    "stock": 60,
    "quantity": 60,
    "barcode": "8901000057138",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-18",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=600&fit=crop"
    ],
    "description": "Non-alcoholic concentrated perfume oil hydro-distilled from freshly plucked Madurai Malli (Jasmine Sambac) flowers over pure sandalwood base oil. Lingers delicately for up to 14 hours.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Concentration": "100% Pure Attar Oil (No Alcohol / Dipropylene Glycol)",
      "Top Notes": "Madurai Jasmine Sambac Petals",
      "Base Notes": "Earthy Khus (Vetiver) & Mysore Sandalwood",
      "Volume": "12 ml Crystal Roll-On"
    },
    "shipping": {
      "weight": "75 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 60
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 81,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P89-ATT-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Traditional Indian Jasmine Sambac & Vetiver Handcrafted Attar (12ml) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P89-ATT-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P89-ATT-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P89-ATT-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Traditional Indian Jasmine Sambac & Vetiver Handcrafted Attar (12ml) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p90",
    "sku": "VM-BEAU-P90-SAL",
    "name": "Dead Sea Mineral Bath Salts infused with Eucalyptus & Pine (400g)",
    "category": "Beauty",
    "brand": "GlowAura Spa",
    "price": 499,
    "mrp": 799,
    "discountPercent": 38,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000057780",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-1",
    "restockLeadDays": 3,
    "vendorId": "v6",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1608248597359-46797a7e58a2?w=600&h=600&fit=crop"
    ],
    "description": "Authentic 100% pure Dead Sea crystalline salts containing 21 essential minerals including magnesium and potassium. Infused with eucalyptus and pine needle essential oils to soothe sore muscles.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Minerals": "Magnesium, Potassium, Calcium, Bromide",
      "Essential Oils": "Tasmanian Blue Gum Eucalyptus & Siberian Pine",
      "Usage": "Warm Bath Soak or Rejuvenating Foot Spa",
      "Net Weight": "400 Grams Resealable Jar"
    },
    "shipping": {
      "weight": "460 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 84,
    "reviews": [
      {
        "id": "rev-VM-BEAU-P90-SAL-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Dead Sea Mineral Bath Salts infused with Eucalyptus & Pine (400g) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P90-SAL-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-BEAU-P90-SAL-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-BEAU-P90-SAL-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Dead Sea Mineral Bath Salts infused with Eucalyptus & Pine (400g) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p91",
    "sku": "VM-CRAF-P91-BOW",
    "name": "Handpainted Jaipur Blue Pottery Ceramic Serving Bowl Set (Set of 3)",
    "category": "Home & Living",
    "brand": "Jaipur Artisans",
    "price": 1699,
    "mrp": 2499,
    "discountPercent": 32,
    "stock": 25,
    "quantity": 25,
    "barcode": "8901000058422",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-2",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=600&fit=crop"
    ],
    "description": "Authentic GI-tagged Jaipur blue pottery bowls handcrafted without clay using quartz powder, fullers earth, and natural gum. Decorated with Persian floral motifs by master artisans.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "Authentic Quartz-Based Blue Pottery",
      "Set": "3 Bowls (8\", 6.5\", 5\" Diameter)",
      "Glaze": "Food-Safe Low-Fired Glass Glaze",
      "Origin": "Sanganer, Jaipur"
    },
    "shipping": {
      "weight": "1.4 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 25
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 87,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P91-BOW-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Handpainted Jaipur Blue Pottery Ceramic Serving Bowl Set (Set of 3) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P91-BOW-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P91-BOW-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P91-BOW-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Handpainted Jaipur Blue Pottery Ceramic Serving Bowl Set (Set of 3) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p92",
    "sku": "VM-CRAF-P92-ELE",
    "name": "Hand-Carved Sheesham Wood Elephant Stool with Delicate Brass Inlay",
    "category": "Home & Living",
    "brand": "Jaipur Artisans",
    "price": 2899,
    "mrp": 4199,
    "discountPercent": 31,
    "stock": 15,
    "quantity": 15,
    "barcode": "8901000059064",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-3",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&h=600&fit=crop"
    ],
    "description": "Carved from single block of seasoned Indian Rosewood (Sheesham) into an auspicious royal elephant. Adorned with intricate hand-embedded brass wire and sheet artwork (Tarkashi).",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Wood": "Seasoned Solid Sheesham Hardwood",
      "Art Form": "Traditional Tarkashi Brass Wire Inlay",
      "Dimensions": "10\" High x 12\" Wide x 10\" Deep",
      "Weight Capacity": "Supports up to 120 kg"
    },
    "shipping": {
      "weight": "4.2 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 15
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 90,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P92-ELE-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Hand-Carved Sheesham Wood Elephant Stool with Delicate Brass Inlay in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P92-ELE-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P92-ELE-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P92-ELE-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Hand-Carved Sheesham Wood Elephant Stool with Delicate Brass Inlay brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p93",
    "sku": "VM-CRAF-P93-RUG",
    "name": "Handwoven Natural Jute & Wool Bohemian Geometric Kilim Rug (4x6 ft)",
    "category": "Home & Living",
    "brand": "Rajasthan Weaves",
    "price": 3999,
    "mrp": 5999,
    "discountPercent": 33,
    "stock": 18,
    "quantity": 18,
    "barcode": "8901000059706",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-4",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&h=600&fit=crop"
    ],
    "description": "Reversible flat-weave dhurrie rug woven on traditional pit looms using golden natural jute fiber and dyed New Zealand wool. Geometric tribal patterns complement modern boho living rooms.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Dimensions": "4 Feet x 6 Feet (120 cm x 180 cm)",
      "Weave": "Flat-Weave Kilim Dhurrie (Reversible)",
      "Fibers": "60% Natural Jute, 40% New Zealand Wool",
      "Fringes": "Hand-Braided Cotton Tassels"
    },
    "shipping": {
      "weight": "3.8 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 18
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 93,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P93-RUG-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Handwoven Natural Jute & Wool Bohemian Geometric Kilim Rug (4x6 ft) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P93-RUG-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P93-RUG-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P93-RUG-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Handwoven Natural Jute & Wool Bohemian Geometric Kilim Rug (4x6 ft) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p94",
    "sku": "VM-CRAF-P94-DHO",
    "name": "Traditional Lost-Wax Cast Dhokra Bell-Metal Tribal Art Figurine",
    "category": "Home & Living",
    "brand": "Bastar Heritage",
    "price": 1899,
    "mrp": 2799,
    "discountPercent": 32,
    "stock": 20,
    "quantity": 20,
    "barcode": "8901000060348",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-5",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&h=600&fit=crop"
    ],
    "description": "Ancient 4,000-year-old lost-wax (Cire Perdue) casting craft practicing non-ferrous metal casting. Depicts traditional tribal musicians playing horns in rustic golden bronze finish.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Metal": "Traditional Bell Metal (Bronze & Brass Alloy)",
      "Technique": "Lost-Wax (Cire Perdue) Metal Casting",
      "Height": "9.5 Inches",
      "Finish": "Rustic Antiqued Patina"
    },
    "shipping": {
      "weight": "1.2 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 20
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 26,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P94-DHO-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Traditional Lost-Wax Cast Dhokra Bell-Metal Tribal Art Figurine in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P94-DHO-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P94-DHO-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P94-DHO-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Traditional Lost-Wax Cast Dhokra Bell-Metal Tribal Art Figurine brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p95",
    "sku": "VM-CRAF-P95-URL",
    "name": "Hand-Hammered Heavy Brass Diya Urli Bowl 12-inch for Floating Flowers",
    "category": "Home & Living",
    "brand": "Royal Brass",
    "price": 1999,
    "mrp": 2999,
    "discountPercent": 33,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000060990",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-6",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=600&h=600&fit=crop"
    ],
    "description": "Auspicious 12-inch traditional brass urli bowl handcrafted with flared scalloped rim and hand-hammered dimple texture. Ideal for floating flower petals, rosewater, and floating candles.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Diameter": "12 Inches (30 cm)",
      "Material": "100% Solid Cast Brass",
      "Weight": "1.85 kg Heavy Base",
      "Finish": "Lacquered Antique Gold (Tarnish Resistant)"
    },
    "shipping": {
      "weight": "1.9 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 30
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 29,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P95-URL-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Hand-Hammered Heavy Brass Diya Urli Bowl 12-inch for Floating Flowers in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P95-URL-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P95-URL-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P95-URL-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Hand-Hammered Heavy Brass Diya Urli Bowl 12-inch for Floating Flowers brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p96",
    "sku": "VM-CRAF-P96-DOH",
    "name": "Sanganeri Hand-Block Printed Pure Cotton Reversible Dohar Blanket",
    "category": "Home & Living",
    "brand": "Jaipur Artisans",
    "price": 1799,
    "mrp": 2599,
    "discountPercent": 31,
    "stock": 25,
    "quantity": 25,
    "barcode": "8901000061632",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-7",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop"
    ],
    "description": "Traditional 3-layered AC quilt composed of a middle layer of pure falalen flannel sandwiched between two layers of mulmul cotton, hand-block stamped with botanical floral butis.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Size": "Double Bed (90\" x 108\" / 228 x 274 cm)",
      "Fabric": "100% Mulmul Cotton with Soft Flannel Core",
      "Technique": "Hand Wood-Block Stamped by Master Craftsmen",
      "Care": "Machine Washable Gentle Cycle"
    },
    "shipping": {
      "weight": "1.1 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 25
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 32,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P96-DOH-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Sanganeri Hand-Block Printed Pure Cotton Reversible Dohar Blanket in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P96-DOH-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P96-DOH-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P96-DOH-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Sanganeri Hand-Block Printed Pure Cotton Reversible Dohar Blanket brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p97",
    "sku": "VM-CRAF-P97-COA",
    "name": "Handcrafted Agra White Marble Inlay Coasters with Pietra Dura (Set of 6)",
    "category": "Home & Living",
    "brand": "Taj Crafts",
    "price": 1299,
    "mrp": 1899,
    "discountPercent": 32,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000062274",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-8",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&h=600&fit=crop"
    ],
    "description": "Crafted from genuine Makarana white marble inlaid with semi-precious lapis lazuli, malachite, and carnelian stones using the same Pietra Dura techniques found in the Taj Mahal.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "Pure Makarana White Marble",
      "Inlay Gemstones": "Lapis Lazuli, Malachite, Jasper, Carnelian",
      "Diameter": "3.5 Inches (Set of 6 with Holder)",
      "Underlay": "Velvet Base Pads to Protect Tabletops"
    },
    "shipping": {
      "weight": "850 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 35,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P97-COA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Handcrafted Agra White Marble Inlay Coasters with Pietra Dura (Set of 6) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P97-COA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P97-COA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P97-COA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Handcrafted Agra White Marble Inlay Coasters with Pietra Dura (Set of 6) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p98",
    "sku": "VM-CRAF-P98-PLA",
    "name": "Ceramic Blue Pottery Wall Hanging Plates with Floral Mandalas (Set of 4)",
    "category": "Home & Living",
    "brand": "Jaipur Artisans",
    "price": 1899,
    "mrp": 2799,
    "discountPercent": 32,
    "stock": 22,
    "quantity": 22,
    "barcode": "8901000062916",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-9",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=600&fit=crop"
    ],
    "description": "Set of 4 decorative ceramic wall plates (two 8-inch, two 6-inch) hand-painted with cobalt blue, turquoise, and yellow floral mandala patterns. Fitted with rear brass hanging loops.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Sizes": "2x 8-inch & 2x 6-inch Diameter Plates",
      "Art Form": "Jaipur Glazed Quartz Blue Pottery",
      "Hardware": "Pre-Installed Heavy-Duty Brass Wall Hooks",
      "Packaging": "Custom Molded Thermocol Protective Box"
    },
    "shipping": {
      "weight": "1.6 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 22
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 38,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P98-PLA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Ceramic Blue Pottery Wall Hanging Plates with Floral Mandalas (Set of 4) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P98-PLA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P98-PLA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P98-PLA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Ceramic Blue Pottery Wall Hanging Plates with Floral Mandalas (Set of 4) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p99",
    "sku": "VM-CRAF-P99-LAN",
    "name": "Hand-Etched Solid Brass Moroccan Style Hanging Lantern",
    "category": "Home & Living",
    "brand": "Royal Brass",
    "price": 1499,
    "mrp": 2299,
    "discountPercent": 35,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000063558",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-10",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=600&fit=crop"
    ],
    "description": "Hexagonal pierced brass lantern hand-etched with intricate Islamic and Rajasthani jali filigree cutouts. Casts mesmerizing kaleidoscopic shadow patterns across living room walls.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Height": "14 Inches (35 cm) + 12\" Hanging Chain",
      "Material": "Solid Pierced Cutwork Brass",
      "Illumination": "Holds Tealight, Votive Candle, or E27 LED Bulb",
      "Hinged Door": "Convenient Side Latch Door for Candle Access"
    },
    "shipping": {
      "weight": "920 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 30
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 41,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P99-LAN-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Hand-Etched Solid Brass Moroccan Style Hanging Lantern in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P99-LAN-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P99-LAN-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P99-LAN-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Hand-Etched Solid Brass Moroccan Style Hanging Lantern brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p100",
    "sku": "VM-CRAF-P100-CAN",
    "name": "Hand-Turned Teak Wood Architectural Pillar Candle Holders (Set of 3)",
    "category": "Home & Living",
    "brand": "WoodCrafters",
    "price": 1399,
    "mrp": 1999,
    "discountPercent": 30,
    "stock": 35,
    "quantity": 35,
    "barcode": "8901000064200",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-11",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop"
    ],
    "description": "Trio of pillar candle stands (12\", 10\", 8\") hand-turned on wood lathes from salvaged colonial teak wood beams. Distressed whitewash and exposed grain finish.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Heights": "12 Inches, 10 Inches, 8 Inches",
      "Wood": "100% Solid Reclaimed Teak Wood",
      "Candle Fit": "Accepts Standard 3\" Diameter Pillar Candles",
      "Top Plate": "Iron Candle Spikes to Secure Wax"
    },
    "shipping": {
      "weight": "1.3 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 35
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 44,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P100-CAN-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Hand-Turned Teak Wood Architectural Pillar Candle Holders (Set of 3) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P100-CAN-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P100-CAN-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P100-CAN-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Hand-Turned Teak Wood Architectural Pillar Candle Holders (Set of 3) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p101",
    "sku": "VM-CRAF-P101-MAS",
    "name": "Traditional Sheesham Wood 9-Compartment Masala Dabba with Glass Lid",
    "category": "Home & Living",
    "brand": "WoodCrafters",
    "price": 1199,
    "mrp": 1799,
    "discountPercent": 33,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000064842",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-12",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&h=600&fit=crop"
    ],
    "description": "Square heirloom spice box handcrafted in solid Sheesham with 9 removable square spice cups and miniature carved wooden spice spoon. Clear glass lid displays vibrant spices.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Dimensions": "8\" x 8\" x 2.5\" Deep",
      "Compartments": "9 Removable Seasoned Wooden Bowls",
      "Included": "Handcrafted Sheesham Wooden Spoon",
      "Lid": "Scratch-Resistant Tempered Glass Window"
    },
    "shipping": {
      "weight": "1.1 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 47,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P101-MAS-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Traditional Sheesham Wood 9-Compartment Masala Dabba with Glass Lid in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P101-MAS-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P101-MAS-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P101-MAS-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Traditional Sheesham Wood 9-Compartment Masala Dabba with Glass Lid brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p102",
    "sku": "VM-CRAF-P102-MAC",
    "name": "Handwoven Macrame 100% Organic Cotton Boho Wall Tapestry with Fringe",
    "category": "Home & Living",
    "brand": "BohoKnot",
    "price": 899,
    "mrp": 1399,
    "discountPercent": 36,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000065484",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-13",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"
    ],
    "description": "Intricate geometric macrame wall hanging knotted by hand using 4mm unbleached natural cotton cords over a natural pine wooden dowel. Adds texture to bedrooms and nursery spaces.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Dimensions": "16\" Wide x 28\" Long (from dowel to fringe)",
      "Cord": "100% Natural Unbleached Cotton Rope (4mm)",
      "Mount": "Smooth Sanded Natural Pine Dowel",
      "Style": "Scandinavian Minimalist Bohemian"
    },
    "shipping": {
      "weight": "450 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 50,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P102-MAC-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Handwoven Macrame 100% Organic Cotton Boho Wall Tapestry with Fringe in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P102-MAC-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P102-MAC-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P102-MAC-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Handwoven Macrame 100% Organic Cotton Boho Wall Tapestry with Fringe brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p103",
    "sku": "VM-CRAF-P103-INC",
    "name": "Solid Cast Bronze Dancing Peacock Aromatherapy Incense Dhoop Burner",
    "category": "Home & Living",
    "brand": "Royal Brass",
    "price": 1299,
    "mrp": 1899,
    "discountPercent": 32,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000066126",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-14",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=600&h=600&fit=crop"
    ],
    "description": "Traditional brass incense burner adorned with sculpted dancing peacock finial. Smoke billows poetically through pierced lattice dome lid during meditation rituals.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "Solid Cast Virgin Brass with Antiqued Bronze Patina",
      "Height": "7 Inches",
      "Compatibility": "Incense Sticks (Agarbatti), Dhoop Cones, Sambrani Cups",
      "Base": "Insulated Base Prevents Table Heat Marks"
    },
    "shipping": {
      "weight": "780 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 53,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P103-INC-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Solid Cast Bronze Dancing Peacock Aromatherapy Incense Dhoop Burner in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P103-INC-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P103-INC-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P103-INC-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Solid Cast Bronze Dancing Peacock Aromatherapy Incense Dhoop Burner brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p104",
    "sku": "VM-CRAF-P104-KAN",
    "name": "Kantha Hand-Embroidered Cotton Cushion Covers 16x16 inch (Set of 2)",
    "category": "Home & Living",
    "brand": "Bengal Kantha",
    "price": 799,
    "mrp": 1199,
    "discountPercent": 33,
    "stock": 60,
    "quantity": 60,
    "barcode": "8901000066768",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-15",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"
    ],
    "description": "Pair of decorative cushion covers hand-stitched by village women in rural Shantiniketan using traditional Kantha running stitch on handloom cotton khadi fabric.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Dimensions": "16\" x 16\" (40 cm x 40 cm)",
      "Fabric": "100% Handloom Cotton Khadi",
      "Embroidery": "Hand-Stitched Shantiniketan Kantha Embroidery",
      "Closure": "Hidden Concealed YKK Zipper"
    },
    "shipping": {
      "weight": "240 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 60
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 56,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P104-KAN-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Kantha Hand-Embroidered Cotton Cushion Covers 16x16 inch (Set of 2) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P104-KAN-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P104-KAN-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P104-KAN-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Kantha Hand-Embroidered Cotton Cushion Covers 16x16 inch (Set of 2) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p105",
    "sku": "VM-CRAF-P105-TER",
    "name": "Hand-Fired Terracotta Hanging Planter with Heavy Macrame Jute Hanger",
    "category": "Home & Living",
    "brand": "MittiGhar",
    "price": 699,
    "mrp": 999,
    "discountPercent": 30,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000067410",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-16",
    "restockLeadDays": 3,
    "vendorId": "v7",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop"
    ],
    "description": "Porous unglazed terracotta bowl planter with bottom drainage hole suspended in a sturdy 4-strand hand-braided natural jute rope hanger with brass mounting ring.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Bowl Diameter": "7.5 Inches x 4\" Deep",
      "Hanger Length": "32 Inches Heavy-Duty Natural Jute",
      "Material": "Natural Kiln-Fired Terracotta Clay",
      "Plant Capacity": "Ideal for Trailing Pothos, String of Pearls"
    },
    "shipping": {
      "weight": "1.2 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 59,
    "reviews": [
      {
        "id": "rev-VM-CRAF-P105-TER-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Hand-Fired Terracotta Hanging Planter with Heavy Macrame Jute Hanger in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P105-TER-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-CRAF-P105-TER-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-CRAF-P105-TER-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Hand-Fired Terracotta Hanging Planter with Heavy Macrame Jute Hanger brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p106",
    "sku": "VM-URB-P106-MON",
    "name": "Solid Natural Oak Dual-Monitor Riser Stand with Wool Felt Shelf",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 4499,
    "mrp": 6499,
    "discountPercent": 31,
    "stock": 20,
    "quantity": 20,
    "barcode": "8901000068052",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-17",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop"
    ],
    "description": "42-inch ergonomic desk shelf handcrafted from 100% solid American white oak with matte water-resistant polyurethane coat, heavy CNC aluminum legs, and acoustic felt catch-all tray.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Dimensions": "42\" Long x 9\" Deep x 4.5\" High",
      "Material": "Solid White Oak Hardwood + Cast Aluminum Legs",
      "Weight Capacity": "Holds up to 45 kg (Supports Dual 27\" Monitors)",
      "Clearance": "Keyboard Stows Underneath"
    },
    "shipping": {
      "weight": "4.8 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 20
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 62,
    "reviews": [
      {
        "id": "rev-VM-URB-P106-MON-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Solid Natural Oak Dual-Monitor Riser Stand with Wool Felt Shelf in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P106-MON-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P106-MON-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P106-MON-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Solid Natural Oak Dual-Monitor Riser Stand with Wool Felt Shelf brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p107",
    "sku": "VM-URB-P107-DES",
    "name": "Premium Vegan Leather Waterproof Non-Slip Desk Blotter Mat (90x45cm)",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 1299,
    "mrp": 1899,
    "discountPercent": 32,
    "stock": 60,
    "quantity": 60,
    "barcode": "8901000068694",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-18",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop"
    ],
    "description": "Dual-textured waterproof desk pad made from thick micro-textured PU leather with non-slip suede base. Smooth surface delivers flawless mouse tracking and writing comfort.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Dimensions": "90 cm x 45 cm (35.4\" x 17.7\")",
      "Material": "Durable Scratch-Resistant Vegan Leather",
      "Spill Protection": "100% Waterproof & Oil-Proof (Wipes Clean)",
      "Base": "Anti-Skid Faux Suede Grip"
    },
    "shipping": {
      "weight": "510 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 60
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 65,
    "reviews": [
      {
        "id": "rev-VM-URB-P107-DES-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Premium Vegan Leather Waterproof Non-Slip Desk Blotter Mat (90x45cm) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P107-DES-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P107-DES-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P107-DES-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Premium Vegan Leather Waterproof Non-Slip Desk Blotter Mat (90x45cm) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p108",
    "sku": "VM-URB-P108-HEA",
    "name": "Handcrafted Solid Walnut Wood Headphone Stand with Cable Notch",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 1499,
    "mrp": 2199,
    "discountPercent": 32,
    "stock": 35,
    "quantity": 35,
    "barcode": "8901000069336",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-1",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1584679109597-c656b19974c9?w=600&h=600&fit=crop"
    ],
    "description": "Sculptural headphone arch carved from genuine American walnut on weighted aluminum base. Contoured top curve distributes headband pressure evenly to prevent leather denting.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Materials": "Solid American Walnut Wood + Matte Black Steel Base",
      "Height": "11 Inches",
      "Base": "Non-Slip Silicone Grip Base with Integrated Cable Trough",
      "Universal Fit": "Fits All Over-Ear Audiophile & Gaming Headphones"
    },
    "shipping": {
      "weight": "620 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 35
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 68,
    "reviews": [
      {
        "id": "rev-VM-URB-P108-HEA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Handcrafted Solid Walnut Wood Headphone Stand with Cable Notch in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P108-HEA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P108-HEA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P108-HEA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Handcrafted Solid Walnut Wood Headphone Stand with Cable Notch brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p109",
    "sku": "VM-URB-P109-CAB",
    "name": "Under-Desk Heavy Powder-Coated Steel Cable Management Tray with Clamps",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 1399,
    "mrp": 1999,
    "discountPercent": 30,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000069978",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-2",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop"
    ],
    "description": "No-drill under-desk wire organizer tray clamps securely onto desks up to 2 inches thick. Heavy-gauge carbon steel mesh conceals bulky power strips, laptop chargers, and HDMI cords.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Length": "17 Inches x 6.3\" Wide x 7.5\" Deep",
      "Installation": "No-Drill Heavy C-Clamps (Zero Desk Damage)",
      "Material": "Powder-Coated Cold-Rolled Carbon Steel",
      "Load Capacity": "Holds up to 10 kg"
    },
    "shipping": {
      "weight": "1.4 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 71,
    "reviews": [
      {
        "id": "rev-VM-URB-P109-CAB-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Under-Desk Heavy Powder-Coated Steel Cable Management Tray with Clamps in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P109-CAB-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P109-CAB-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P109-CAB-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Under-Desk Heavy Powder-Coated Steel Cable Management Tray with Clamps brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p110",
    "sku": "VM-URB-P110-FOO",
    "name": "Ergonomic Teardrop High-Density Memory Foam Under-Desk Footrest",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 1699,
    "mrp": 2499,
    "discountPercent": 32,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000070620",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-3",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1580481077195-731b89fed04f?w=600&h=600&fit=crop"
    ],
    "description": "Curved teardrop ergonomic footrest cushion made with 100% resilient high-density memory foam. Reversible design rocks feet back and forth to boost lower-leg blood circulation.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Dimensions": "17.5\" x 11.5\" x 4.5\" High",
      "Foam": "100% High-Density Therapeutic Memory Foam",
      "Cover": "Removable Breathable Velvet Mesh (Machine Washable)",
      "Base": "Non-Slip Rubberized Grip Dots"
    },
    "shipping": {
      "weight": "780 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 30
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 74,
    "reviews": [
      {
        "id": "rev-VM-URB-P110-FOO-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Ergonomic Teardrop High-Density Memory Foam Under-Desk Footrest in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P110-FOO-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P110-FOO-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P110-FOO-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Ergonomic Teardrop High-Density Memory Foam Under-Desk Footrest brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p111",
    "sku": "VM-URB-P111-MAG",
    "name": "CNC Aluminum Magnetic MagSafe Swivel Desktop Phone & Tablet Stand",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 1799,
    "mrp": 2599,
    "discountPercent": 31,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000071262",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-4",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop"
    ],
    "description": "Precision machined aerospace aluminum stand with 360-degree rotating clicking base and dual-pivot angle adjustment. Includes MagSafe magnetic array for instant one-tap floating mount.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "Aerospace-Grade CNC Anodized Aluminum",
      "Swivel": "360-Degree Ratchet Swivel Base with Tactile Clicks",
      "Compatibility": "All iPhone MagSafe Models, iPads up to 11\"",
      "Padding": "Anti-Scratch Silicone Cushions"
    },
    "shipping": {
      "weight": "380 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 77,
    "reviews": [
      {
        "id": "rev-VM-URB-P111-MAG-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received CNC Aluminum Magnetic MagSafe Swivel Desktop Phone & Tablet Stand in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P111-MAG-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P111-MAG-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P111-MAG-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this CNC Aluminum Magnetic MagSafe Swivel Desktop Phone & Tablet Stand brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p112",
    "sku": "VM-URB-P112-LIG",
    "name": "Minimalist Screenbar LED Monitor Light with Auto-Dimming Sensor",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 2999,
    "mrp": 4299,
    "discountPercent": 30,
    "stock": 25,
    "quantity": 25,
    "barcode": "8901000071904",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-5",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=600&fit=crop"
    ],
    "description": "Asymmetric optical design illuminates only your desktop work area with zero screen glare. Features ambient light sensor for automatic brightness adjustment and wireless touch puck.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Optical Design": "Asymmetric Glare-Free Forward Projection",
      "Color Temp": "2700K Warm to 6500K Cool White Stepless",
      "Brightness": "Up to 500 Lux (Auto-Dimming Sensor)",
      "Power": "USB-C Powered from Monitor or PC"
    },
    "shipping": {
      "weight": "520 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 25
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 80,
    "reviews": [
      {
        "id": "rev-VM-URB-P112-LIG-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Minimalist Screenbar LED Monitor Light with Auto-Dimming Sensor in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P112-LIG-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P112-LIG-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P112-LIG-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Minimalist Screenbar LED Monitor Light with Auto-Dimming Sensor brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p113",
    "sku": "VM-URB-P113-VER",
    "name": "Solid Birch Plywood Vertical Dual-Laptop Docking Stand",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 1499,
    "mrp": 2199,
    "discountPercent": 32,
    "stock": 35,
    "quantity": 35,
    "barcode": "8901000072546",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-6",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop"
    ],
    "description": "Saves 80% desk footprint by docking two laptops vertically in clamshell mode. Laminated architectural birch ply with wool felt lining inside slots to prevent laptop aluminum scratches.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Slots": "Dual Slots (0.75\" Width each fits MacBooks & ThinkPads)",
      "Material": "Multi-Ply Baltic Birch with Walnut Finish",
      "Padding": "100% Merino Wool Felt Inlays",
      "Dimensions": "7.5\" x 4.5\" x 3\" High"
    },
    "shipping": {
      "weight": "450 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 35
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 83,
    "reviews": [
      {
        "id": "rev-VM-URB-P113-VER-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Solid Birch Plywood Vertical Dual-Laptop Docking Stand in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P113-VER-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P113-VER-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P113-VER-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Solid Birch Plywood Vertical Dual-Laptop Docking Stand brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p114",
    "sku": "VM-URB-P114-WIR",
    "name": "Fast Qi Wireless Charging Pad Embedded in Solid Cork & Wool Base",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 1299,
    "mrp": 1899,
    "discountPercent": 32,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000073188",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-7",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop"
    ],
    "description": "15W Qi-certified high-speed fast charging pad encased in Portuguese organic cork with a recycled grey wool felt charging coaster. Blends organic natural aesthetics with tech charging.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Output": "15W / 10W / 7.5W Fast Charging",
      "Materials": "Natural Portuguese Cork + Organic Wool Felt",
      "Safety": "Foreign Object Detection & Overheat Protection",
      "Cable": "Braided 1.5m USB-C Cable Included"
    },
    "shipping": {
      "weight": "190 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 86,
    "reviews": [
      {
        "id": "rev-VM-URB-P114-WIR-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Fast Qi Wireless Charging Pad Embedded in Solid Cork & Wool Base in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P114-WIR-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P114-WIR-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P114-WIR-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Fast Qi Wireless Charging Pad Embedded in Solid Cork & Wool Base brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p115",
    "sku": "VM-URB-P115-DRA",
    "name": "Anodized Aluminum Modular Desk Drawer Organizer Trays (Set of 5)",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 1699,
    "mrp": 2399,
    "discountPercent": 29,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000073830",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-8",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop"
    ],
    "description": "Set of 5 interlocking matte black anodized aluminum trays lined with soft silicone base pads. Neatly segregates pens, AirPods, hard drives, cables, and stationery in shallow drawers.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Set": "5 Modular Trays (Assorted Dimensions)",
      "Material": "1.5mm Gauge Anodized Aluminum Alloy",
      "Base Lining": "Removable Non-Slip Silicone Mats",
      "Color": "Stealth Space Grey"
    },
    "shipping": {
      "weight": "750 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 89,
    "reviews": [
      {
        "id": "rev-VM-URB-P115-DRA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Anodized Aluminum Modular Desk Drawer Organizer Trays (Set of 5) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P115-DRA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P115-DRA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P115-DRA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Anodized Aluminum Modular Desk Drawer Organizer Trays (Set of 5) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p116",
    "sku": "VM-URB-P116-ACO",
    "name": "Acoustic Recycled PET Felt Sound-Dampening Desktop Privacy Screen",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 2199,
    "mrp": 3199,
    "discountPercent": 31,
    "stock": 25,
    "quantity": 25,
    "barcode": "8901000074472",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-9",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop"
    ],
    "description": "Free-standing 24-inch wide foldable acoustic privacy panel molded from 100% recycled PET felt. Absorbs 85% of ambient vocal frequencies for focused calls in shared home spaces.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Sound Absorption": "NRC Rating 0.85 (Sound Dampening)",
      "Material": "100% Recycled PET Felt (Odorless & Non-Toxic)",
      "Dimensions": "24\" Wide x 18\" High x 9mm Thick",
      "Features": "Pin-Friendly Surface for Notes & Photos"
    },
    "shipping": {
      "weight": "890 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 25
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 92,
    "reviews": [
      {
        "id": "rev-VM-URB-P116-ACO-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Acoustic Recycled PET Felt Sound-Dampening Desktop Privacy Screen in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P116-ACO-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P116-ACO-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P116-ACO-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Acoustic Recycled PET Felt Sound-Dampening Desktop Privacy Screen brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p117",
    "sku": "VM-URB-P117-LUM",
    "name": "Adjustable Ergonomic Breathable Mesh Lumbar Support Pillow",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 1199,
    "mrp": 1799,
    "discountPercent": 33,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000075114",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-10",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1580481077195-731b89fed04f?w=600&h=600&fit=crop"
    ],
    "description": "Contoured orthopaedic back cushion with dual elastic adjustable straps that lock onto any office chair. Ventilated 3D spacer mesh promotes active spinal alignment during 8+ hour workdays.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Core": "Slow-Rebound Orthopaedic Memory Foam",
      "Cover": "3D Breathable Cool-Air Flow Mesh",
      "Straps": "Dual Heavy-Duty Adjustable Locking Straps",
      "Support": "Relieves Lower Back & Coccyx Pressure"
    },
    "shipping": {
      "weight": "640 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 25,
    "reviews": [
      {
        "id": "rev-VM-URB-P117-LUM-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Adjustable Ergonomic Breathable Mesh Lumbar Support Pillow in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P117-LUM-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P117-LUM-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P117-LUM-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Adjustable Ergonomic Breathable Mesh Lumbar Support Pillow brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p118",
    "sku": "VM-URB-P118-ARM",
    "name": "Heavy-Duty Gas Spring Full-Motion Single Monitor Desk Mount Arm",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 2499,
    "mrp": 3699,
    "discountPercent": 32,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000075756",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-11",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop"
    ],
    "description": "Precision gas-strut monitor arm supporting displays from 17 to 34 inches (up to 9kg). 360-degree rotation, 90-degree tilt, and 180-degree swivel with integrated internal cable canals.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Screen Compatibility": "17\" to 34\" Screens (Flat & Curved)",
      "Weight Capacity": "2 kg to 9 kg (4.4 to 19.8 lbs)",
      "VESA Standards": "75x75mm and 100x100mm",
      "Mounting Options": "Desk Edge C-Clamp & Grommet Base"
    },
    "shipping": {
      "weight": "2.8 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 30
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 28,
    "reviews": [
      {
        "id": "rev-VM-URB-P118-ARM-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Heavy-Duty Gas Spring Full-Motion Single Monitor Desk Mount Arm in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P118-ARM-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P118-ARM-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P118-ARM-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Heavy-Duty Gas Spring Full-Motion Single Monitor Desk Mount Arm brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p119",
    "sku": "VM-URB-P119-PEN",
    "name": "Full-Grain Tan Leather Handcrafted Pen Holder & Catch-All Valet Tray",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 999,
    "mrp": 1499,
    "discountPercent": 33,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000076398",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-12",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop"
    ],
    "description": "Set of matching desktop accessories handcrafted from thick vegetable-tanned harness leather with hand-burnished edges. Pen pot holds 10+ pens; valet tray organizes keys and watches.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Material": "100% Full-Grain Vegetable-Tanned Leather",
      "Set Includes": "Cylindrical Pen Cup + 6\" x 6\" Snap Valet Tray",
      "Color": "Rich Cognac Tan",
      "Aging": "Develops a Rich Caramel Patina Over Time"
    },
    "shipping": {
      "weight": "280 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 31,
    "reviews": [
      {
        "id": "rev-VM-URB-P119-PEN-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Full-Grain Tan Leather Handcrafted Pen Holder & Catch-All Valet Tray in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P119-PEN-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P119-PEN-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P119-PEN-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Full-Grain Tan Leather Handcrafted Pen Holder & Catch-All Valet Tray brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p120",
    "sku": "VM-URB-P120-MUG",
    "name": "Minimalist Matte Ceramic Coffee Mug 350ml with Bamboo Coaster Lid",
    "category": "Home & Living",
    "brand": "UrbanDen",
    "price": 599,
    "mrp": 899,
    "discountPercent": 33,
    "stock": 65,
    "quantity": 65,
    "barcode": "8901000077040",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-13",
    "restockLeadDays": 3,
    "vendorId": "v8",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop"
    ],
    "description": "Double-walled heat-retaining ceramic coffee mug finished in silky matte charcoal glaze. Includes snug-fitting bamboo lid that doubles as an insulating tabletop coaster.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Capacity": "350 ml (12 oz)",
      "Material": "High-Fired Food-Safe Ceramic Stoneware",
      "Lid": "Natural Bamboo Lid / Coaster with Silicone Gasket",
      "Microwave & Dishwasher": "Ceramic Cup Microwave & Dishwasher Safe"
    },
    "shipping": {
      "weight": "410 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 65
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 34,
    "reviews": [
      {
        "id": "rev-VM-URB-P120-MUG-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Minimalist Matte Ceramic Coffee Mug 350ml with Bamboo Coaster Lid in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P120-MUG-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-URB-P120-MUG-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-URB-P120-MUG-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Minimalist Matte Ceramic Coffee Mug 350ml with Bamboo Coaster Lid brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p121",
    "sku": "VM-GREE-P121-MON",
    "name": "Live Variegated Monstera Deliciosa Indoor Houseplant in Ceramic Pot",
    "category": "Home & Living",
    "brand": "GreenLeaf",
    "price": 1499,
    "mrp": 2199,
    "discountPercent": 32,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000077682",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-14",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&h=600&fit=crop"
    ],
    "description": "Healthy nursery-acclimatized Swiss Cheese plant featuring natural leaf fenestrations. Potted in well-draining aroid soil mix inside a premium 6-inch white ceramic planter with saucer.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Plant Height": "14 to 18 Inches (including pot)",
      "Light Needs": "Bright Indirect Sunlight",
      "Watering": "Once Every 7-10 Days (Allow Topsoil to Dry)",
      "Pot": "6\" Glazed White Ceramic Planter with Drainage"
    },
    "shipping": {
      "weight": "2.4 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 30
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 37,
    "reviews": [
      {
        "id": "rev-VM-GREE-P121-MON-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Live Variegated Monstera Deliciosa Indoor Houseplant in Ceramic Pot in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P121-MON-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P121-MON-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P121-MON-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Live Variegated Monstera Deliciosa Indoor Houseplant in Ceramic Pot brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p122",
    "sku": "VM-GREE-P122-FID",
    "name": "Fiddle Leaf Fig (Ficus Lyrata) Live Indoor Tree in Eco-Planter",
    "category": "Home & Living",
    "brand": "GreenLeaf",
    "price": 1899,
    "mrp": 2799,
    "discountPercent": 32,
    "stock": 20,
    "quantity": 20,
    "barcode": "8901000078324",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-15",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&h=600&fit=crop"
    ],
    "description": "Statement indoor houseplant with large violin-shaped scalloped emerald leaves. Thrives in bright corners, air-conditioned apartments, and modern living spaces.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Height": "2 to 2.5 Feet Tall",
      "Light Requirements": "6+ Hours Filtered Bright Ambient Light",
      "Pot": "8\" Sustainable Recycled Fiber Self-Watering Planter",
      "Air Purifying": "Absorbs Airborne Toxins & Volatile Compounds"
    },
    "shipping": {
      "weight": "3.6 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 20
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 40,
    "reviews": [
      {
        "id": "rev-VM-GREE-P122-FID-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Fiddle Leaf Fig (Ficus Lyrata) Live Indoor Tree in Eco-Planter in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P122-FID-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P122-FID-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P122-FID-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Fiddle Leaf Fig (Ficus Lyrata) Live Indoor Tree in Eco-Planter brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p123",
    "sku": "VM-GREE-P123-POT",
    "name": "Golden Pothos (Money Plant) Live Air-Purifier on Natural Coco Pole",
    "category": "Home & Living",
    "brand": "GreenLeaf",
    "price": 699,
    "mrp": 999,
    "discountPercent": 30,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000078966",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-16",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=600&fit=crop"
    ],
    "description": "Lush trailing Epipremnum aureum trained onto a 2ft natural coir moss pole. NASA clean air study recognized houseplant that thrives even under low light and fluorescent office bulbs.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Height": "2 Feet on Sturdy Coir Pole",
      "Light": "Low to Bright Indirect Light",
      "Difficulty": "Beginner-Friendly (Virtually Indestructible)",
      "Pot": "Self-Watering Injection Molded Plastic Pot"
    },
    "shipping": {
      "weight": "1.6 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 43,
    "reviews": [
      {
        "id": "rev-VM-GREE-P123-POT-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Golden Pothos (Money Plant) Live Air-Purifier on Natural Coco Pole in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P123-POT-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P123-POT-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P123-POT-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Golden Pothos (Money Plant) Live Air-Purifier on Natural Coco Pole brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p124",
    "sku": "VM-GREE-P124-SNA",
    "name": "Sansevieria Snake Plant Low-Maintenance Live Air-Purifying Houseplant",
    "category": "Home & Living",
    "brand": "GreenLeaf",
    "price": 599,
    "mrp": 899,
    "discountPercent": 33,
    "stock": 60,
    "quantity": 60,
    "barcode": "8901000079608",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-17",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=600&h=600&fit=crop"
    ],
    "description": "Architectural upright Mother-in-Law's Tongue with yellow-variegated sword leaves. Produces night-time oxygen via CAM photosynthesis, making it the ideal bedroom plant.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Height": "12 to 15 Inches Tall",
      "Light": "Low Light Tolerant to Full Sun",
      "Watering Frequency": "Once Every 2-3 Weeks (Drought Tolerant)",
      "Pot": "5.5\" Modern Terracotta Matte Planter"
    },
    "shipping": {
      "weight": "1.4 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 60
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 46,
    "reviews": [
      {
        "id": "rev-VM-GREE-P124-SNA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Sansevieria Snake Plant Low-Maintenance Live Air-Purifying Houseplant in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P124-SNA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P124-SNA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P124-SNA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Sansevieria Snake Plant Low-Maintenance Live Air-Purifying Houseplant brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p125",
    "sku": "VM-GREE-P125-TER",
    "name": "Hand-Glazed Terracotta Cylinder Planter Pot with Drainage Tray 8-inch",
    "category": "Home & Living",
    "brand": "GreenLeaf Studio",
    "price": 799,
    "mrp": 1199,
    "discountPercent": 33,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000080250",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-18",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop"
    ],
    "description": "Handmade porous natural terracotta pot finished with breathable sage-green ceramic dip-glaze. Porous clay walls allow roots to breathe and prevent fatal over-watering root rot.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Dimensions": "8\" Diameter x 7.5\" Height",
      "Material": "High-Fired Porous Terracotta",
      "Features": "Drainage Hole + Snug Matching Glazed Catch Saucer",
      "Glaze": "Non-Toxic Water-Based Ceramic Dip Glaze"
    },
    "shipping": {
      "weight": "2.1 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 49,
    "reviews": [
      {
        "id": "rev-VM-GREE-P125-TER-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Hand-Glazed Terracotta Cylinder Planter Pot with Drainage Tray 8-inch in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P125-TER-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P125-TER-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P125-TER-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Hand-Glazed Terracotta Cylinder Planter Pot with Drainage Tray 8-inch brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p126",
    "sku": "VM-GREE-P126-MIS",
    "name": "Hand-Polished Solid Brass Fine Mist Plant Mister Spray Bottle (300ml)",
    "category": "Home & Living",
    "brand": "GreenLeaf Studio",
    "price": 999,
    "mrp": 1499,
    "discountPercent": 33,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000080892",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-1",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=600&h=600&fit=crop"
    ],
    "description": "Vintage Victorian style solid brass continuous misting atomizer. Generates an ultra-fine cloud of water vapor to elevate humidity for ferns, calatheas, orchids, and tropical plants.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Capacity": "300 ml (10 oz)",
      "Material": "100% Heavy Gauge Solid Brass",
      "Mechanism": "Smooth Finger-Pump Plunger Mechanism with Micro Nozzle",
      "Finish": "Mirror-Polished Natural Brass (Ages to Patina)"
    },
    "shipping": {
      "weight": "290 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 52,
    "reviews": [
      {
        "id": "rev-VM-GREE-P126-MIS-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Hand-Polished Solid Brass Fine Mist Plant Mister Spray Bottle (300ml) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P126-MIS-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P126-MIS-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P126-MIS-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Hand-Polished Solid Brass Fine Mist Plant Mister Spray Bottle (300ml) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p127",
    "sku": "VM-GREE-P127-FER",
    "name": "100% Organic Earthworm Vermicompost Soil Enrichment Fertilizer (5kg)",
    "category": "Home & Living",
    "brand": "GreenLeaf Organic",
    "price": 399,
    "mrp": 599,
    "discountPercent": 33,
    "stock": 70,
    "quantity": 70,
    "barcode": "8901000081534",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-2",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"
    ],
    "description": "Odourless black gold plant food produced by Eisenia Fetida earthworms feeding on organic cow dung and crop residue. Packed with macro NPK nutrients and beneficial mycorrhizal microbes.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "NPK Balance": "High Organic Nitrogen, Phosphorus, Potassium",
      "Microbes": "Live Beneficial Soil Bacteria & Mycorrhizae",
      "Usage": "2 Handfuls per Pot Once a Month",
      "Net Weight": "5 kg Heavy Moisture-Proof Bag"
    },
    "shipping": {
      "weight": "5.1 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 70
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 55,
    "reviews": [
      {
        "id": "rev-VM-GREE-P127-FER-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received 100% Organic Earthworm Vermicompost Soil Enrichment Fertilizer (5kg) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P127-FER-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P127-FER-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P127-FER-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this 100% Organic Earthworm Vermicompost Soil Enrichment Fertilizer (5kg) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p128",
    "sku": "VM-GREE-P128-PRU",
    "name": "Carbon Steel Professional Ergonomic Bypass Garden Pruning Shears",
    "category": "Home & Living",
    "brand": "GreenLeaf Tools",
    "price": 849,
    "mrp": 1299,
    "discountPercent": 35,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000082176",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-3",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop"
    ],
    "description": "SK-5 high carbon steel blade coated with rust-proof Teflon for clean, razor-sharp cuts through 20mm live plant branches without tearing bark. Spring-loaded with safety thumb lock.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Blade": "Japanese SK-5 High-Carbon Steel with Titanium Coat",
      "Cutting Capacity": "Up to 20mm (3/4\") Diameter Stems",
      "Handles": "Ergonomic Forged Aluminum with Non-Slip Rubber Grip",
      "Safety": "One-Touch Sliding Safety Lock"
    },
    "shipping": {
      "weight": "280 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 58,
    "reviews": [
      {
        "id": "rev-VM-GREE-P128-PRU-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Carbon Steel Professional Ergonomic Bypass Garden Pruning Shears in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P128-PRU-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P128-PRU-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P128-PRU-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Carbon Steel Professional Ergonomic Bypass Garden Pruning Shears brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p129",
    "sku": "VM-GREE-P129-NEE",
    "name": "Cold-Pressed Pure Organic Neem Oil Plant Foliar Spray (500ml)",
    "category": "Home & Living",
    "brand": "GreenLeaf Care",
    "price": 349,
    "mrp": 499,
    "discountPercent": 30,
    "stock": 80,
    "quantity": 80,
    "barcode": "8901000082818",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-4",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop"
    ],
    "description": "High Azadirachtin (1500 ppm) cold-pressed organic neem oil emulsified with natural Castile soap. Repels mealybugs, aphids, spider mites, and fungal powdery mildew safely.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Active Constituent": "Natural Azadirachtin (1500 PPM)",
      "Type": "Water-Soluble Ready-to-Mix Concentrate",
      "Safe For": "Pet-Friendly & Safe for Edible Herb Gardens",
      "Volume": "500 ml Concentrated Bottle"
    },
    "shipping": {
      "weight": "550 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 80
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 61,
    "reviews": [
      {
        "id": "rev-VM-GREE-P129-NEE-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Cold-Pressed Pure Organic Neem Oil Plant Foliar Spray (500ml) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P129-NEE-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P129-NEE-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P129-NEE-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Cold-Pressed Pure Organic Neem Oil Plant Foliar Spray (500ml) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p130",
    "sku": "VM-GREE-P130-ARE",
    "name": "Areca Palm Live Indoor Air-Cleansing Plant in Self-Watering Planter",
    "category": "Home & Living",
    "brand": "GreenLeaf",
    "price": 899,
    "mrp": 1299,
    "discountPercent": 31,
    "stock": 35,
    "quantity": 35,
    "barcode": "8901000083460",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-5",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&h=600&fit=crop"
    ],
    "description": "Feathery, graceful multi-stem palm that acts as an all-natural room humidifier and formaldehyde filter. Potted in sub-irrigation planter with water level gauge.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Height": "2 to 2.5 Feet",
      "Light": "Bright Dappled Sunlight",
      "Humidity": "Enjoys Average to High Humidity",
      "Planter": "7.5\" Sub-Irrigation Self-Watering Pot"
    },
    "shipping": {
      "weight": "2.8 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 35
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 64,
    "reviews": [
      {
        "id": "rev-VM-GREE-P130-ARE-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Areca Palm Live Indoor Air-Cleansing Plant in Self-Watering Planter in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P130-ARE-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P130-ARE-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P130-ARE-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Areca Palm Live Indoor Air-Cleansing Plant in Self-Watering Planter brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p131",
    "sku": "VM-GREE-P131-ZZP",
    "name": "Live ZZ Plant (Zamioculcas Zamiifolia) Drought-Resistant Houseplant",
    "category": "Home & Living",
    "brand": "GreenLeaf",
    "price": 749,
    "mrp": 1099,
    "discountPercent": 32,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000084102",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-6",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=600&fit=crop"
    ],
    "description": "Waxy, glossy emerald foliage radiating from swollen water-storing rhizomes. Celebrated for thriving in dim basements and surviving with watering just once a month.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Height": "14 to 16 Inches",
      "Light Requirement": "Low Fluorescent Light to Medium Indirect",
      "Watering": "Once Every 3-4 Weeks (Virtually Indestructible)",
      "Pot": "6\" Matte Black Minimalist Pot"
    },
    "shipping": {
      "weight": "1.9 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 67,
    "reviews": [
      {
        "id": "rev-VM-GREE-P131-ZZP-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Live ZZ Plant (Zamioculcas Zamiifolia) Drought-Resistant Houseplant in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P131-ZZP-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P131-ZZP-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P131-ZZP-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Live ZZ Plant (Zamioculcas Zamiifolia) Drought-Resistant Houseplant brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p132",
    "sku": "VM-GREE-P132-SEA",
    "name": "Handwoven Natural Seagrass Belly Planter Basket with Handles",
    "category": "Home & Living",
    "brand": "GreenLeaf Studio",
    "price": 699,
    "mrp": 999,
    "discountPercent": 30,
    "stock": 60,
    "quantity": 60,
    "barcode": "8901000084744",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-7",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop"
    ],
    "description": "Foldable bohemian planter basket hand-braided from natural Vietnamese seagrass. Covers plastic nursery pots seamlessly and includes waterproof inner plastic liner.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Diameter": "10 Inches Top x 12\" Belly x 11\" High",
      "Material": "100% Eco-Friendly Dried Natural Seagrass",
      "Design": "Collapsible Pop-In/Pop-Out Bowl Shape",
      "Liner": "Thick Clear Waterproof Plastic Liner Included"
    },
    "shipping": {
      "weight": "350 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 60
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 70,
    "reviews": [
      {
        "id": "rev-VM-GREE-P132-SEA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Handwoven Natural Seagrass Belly Planter Basket with Handles in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P132-SEA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P132-SEA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P132-SEA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Handwoven Natural Seagrass Belly Planter Basket with Handles brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p133",
    "sku": "VM-GREE-P133-SUC",
    "name": "Indoor Live Succulent Trio Garden in Geometric Ceramic Planters",
    "category": "Home & Living",
    "brand": "GreenLeaf",
    "price": 799,
    "mrp": 1199,
    "discountPercent": 33,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000085386",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-8",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop"
    ],
    "description": "Set of 3 assorted plump live succulents (Echeveria, Haworthia, Crassula Jade) planted in geometric white ceramic pots mounted on custom triangular bamboo display tray.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Plants Included": "Haworthia Zebra, Echeveria Elegans, Mini Jade",
      "Pots": "3x Glazed Geometric Ceramic Pots (3\" Width)",
      "Tray": "Natural Carbonized Bamboo Linking Tray",
      "Watering": "1-2 Tablespoons Once Every 2 Weeks"
    },
    "shipping": {
      "weight": "950 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 73,
    "reviews": [
      {
        "id": "rev-VM-GREE-P133-SUC-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Indoor Live Succulent Trio Garden in Geometric Ceramic Planters in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P133-SUC-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P133-SUC-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P133-SUC-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Indoor Live Succulent Trio Garden in Geometric Ceramic Planters brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p134",
    "sku": "VM-GREE-P134-SEN",
    "name": "3-in-1 Soil Moisture, pH and Ambient Light Sensor Plant Meter",
    "category": "Home & Living",
    "brand": "GreenLeaf Tools",
    "price": 599,
    "mrp": 899,
    "discountPercent": 33,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000086028",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-9",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop"
    ],
    "description": "Dual-probe agricultural soil tester that measures root moisture levels (1-10), soil acidity/alkalinity pH (3.5-8), and ambient sunlight lux without needing any batteries.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Functions": "Soil Moisture, Soil pH, Ambient Sunlight Lux",
      "Power": "No Batteries Required (Photocell & Metal Electrode)",
      "Probe Length": "8\" Copper and Aluminum Dual Probes",
      "Display": "Color-Coded Mechanical Pointer Needle"
    },
    "shipping": {
      "weight": "120 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 76,
    "reviews": [
      {
        "id": "rev-VM-GREE-P134-SEN-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received 3-in-1 Soil Moisture, pH and Ambient Light Sensor Plant Meter in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P134-SEN-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P134-SEN-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P134-SEN-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this 3-in-1 Soil Moisture, pH and Ambient Light Sensor Plant Meter brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p135",
    "sku": "VM-GREE-P135-CAL",
    "name": "Calathea Medallion Living Prayer Plant with Vivid Patterned Leaves",
    "category": "Home & Living",
    "brand": "GreenLeaf",
    "price": 799,
    "mrp": 1199,
    "discountPercent": 33,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000086670",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-10",
    "restockLeadDays": 3,
    "vendorId": "v9",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=600&fit=crop"
    ],
    "description": "Exquisite tropical foliage with feather-painted green top markings and deep burgundy velvet undersides. Leaves raise and fold upright each evening in prayer motion.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Height": "12 to 14 Inches",
      "Movement": "Daily Nyctinasty (Leaves Fold Upward at Night)",
      "Light": "Medium Indirect Light (Avoid Direct Sunlight)",
      "Pot": "6\" Self-Draining Terracotta Pot with Saucer"
    },
    "shipping": {
      "weight": "1.7 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 30
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 79,
    "reviews": [
      {
        "id": "rev-VM-GREE-P135-CAL-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Calathea Medallion Living Prayer Plant with Vivid Patterned Leaves in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P135-CAL-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-GREE-P135-CAL-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-GREE-P135-CAL-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Calathea Medallion Living Prayer Plant with Vivid Patterned Leaves brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p136",
    "sku": "VM-SOUN-P136-ROD",
    "name": "Rode NT1 5th Generation Studio Condenser Microphone (XLR & USB)",
    "category": "Electronics",
    "brand": "Rode",
    "price": 24990,
    "mrp": 29990,
    "discountPercent": 17,
    "stock": 15,
    "quantity": 15,
    "barcode": "8901000087312",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-11",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop"
    ],
    "description": "Groundbreaking studio condenser mic featuring Dual Connect output for both analog XLR and 32-bit float digital USB-C recording. Incredibly low 4dBA self-noise floor.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Capsule": "1-inch Gold-Sputtered Large Diaphragm",
      "Noise Level": "Ultra-Low 4 dBA Self-Noise",
      "Connectivity": "Dual Connect (XLR + 32-Bit Float USB-C)",
      "Includes": "SM6 Shock Mount with Detachable Pop Shield"
    },
    "shipping": {
      "weight": "1.2 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 15
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 2999,
          "stock": 13
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 82,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P136-ROD-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Rode NT1 5th Generation Studio Condenser Microphone (XLR & USB) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P136-ROD-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P136-ROD-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P136-ROD-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Rode NT1 5th Generation Studio Condenser Microphone (XLR & USB) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p137",
    "sku": "VM-SOUN-P137-FOC",
    "name": "Focusrite Scarlett 2i2 4th Generation 2-In/2-Out USB Audio Interface",
    "category": "Electronics",
    "brand": "Focusrite",
    "price": 17990,
    "mrp": 22990,
    "discountPercent": 22,
    "stock": 20,
    "quantity": 20,
    "barcode": "8901000087954",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-12",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop"
    ],
    "description": "Flagship dual preamps with 69dB gain range, studio-grade 192kHz/24-bit converters from Focusrite RedNet range, Auto Gain, Clip Safe, and updated Air Mode with Harmonic Drive.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Preamps": "2x 4th Gen Ultra-Low Noise Preamps (69dB Gain)",
      "Dynamic Range": "Massive 120 dB Dynamic Range Converters",
      "Features": "Auto Gain, Clip Safe, Redesigned Air Mode",
      "Outputs": "Balanced TRS Monitor & High-Power Headphone Out"
    },
    "shipping": {
      "weight": "780 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 20
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 2159,
          "stock": 18
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 85,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P137-FOC-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Focusrite Scarlett 2i2 4th Generation 2-In/2-Out USB Audio Interface in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P137-FOC-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P137-FOC-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P137-FOC-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Focusrite Scarlett 2i2 4th Generation 2-In/2-Out USB Audio Interface brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p138",
    "sku": "VM-SOUN-P138-AUD",
    "name": "Audio-Technica ATH-M50x Professional Studio Monitor Headphones",
    "category": "Electronics",
    "brand": "Audio-Technica",
    "price": 13490,
    "mrp": 16990,
    "discountPercent": 21,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000088596",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-13",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"
    ],
    "description": "Critically acclaimed studio reference headphones with proprietary 45mm large-aperture drivers, copper-clad aluminum wire voice coils, 90-degree swiveling earcups, and 3 detachable cables.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Drivers": "45 mm Neodymium with CCAW Voice Coils",
      "Frequency Response": "15 to 28,000 Hz Flat Reference Tuning",
      "Earcup Swivel": "90\u00b0 Swiveling Earcups for One-Ear Monitoring",
      "Included Cables": "1.2m Coiled, 3.0m Straight, 1.2m Straight Cables"
    },
    "shipping": {
      "weight": "285 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 30
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 1619,
          "stock": 28
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 88,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P138-AUD-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Audio-Technica ATH-M50x Professional Studio Monitor Headphones in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P138-AUD-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P138-AUD-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P138-AUD-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Audio-Technica ATH-M50x Professional Studio Monitor Headphones brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p139",
    "sku": "VM-SOUN-P139-KRK",
    "name": "KRK Classic 5-inch Active Bi-Amp Studio Monitor Pair",
    "category": "Electronics",
    "brand": "KRK Systems",
    "price": 28990,
    "mrp": 35990,
    "discountPercent": 19,
    "stock": 12,
    "quantity": 12,
    "barcode": "8901000089238",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-14",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop"
    ],
    "description": "Pair of nearfield active reference studio monitors with iconic yellow glass-aramid composite woofers, 1-inch soft dome tweeters, and Class A/B bi-amplifiers for honest mix translation.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Amplifier": "50W Class A/B Bi-Amp per Monitor (100W Pair)",
      "Woofer": "5\" Glass-Aramid Composite Cone",
      "Tweeter": "1\" Textile Soft Dome Tweeter",
      "Controls": "High and Low Frequency Acoustic Tuning Knobs"
    },
    "shipping": {
      "weight": "11.2 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard 256GB / Base",
          "priceDelta": 0,
          "stock": 12
        },
        {
          "label": "Pro Bundle (Extended Kit)",
          "priceDelta": 3479,
          "stock": 10
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 91,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P139-KRK-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received KRK Classic 5-inch Active Bi-Amp Studio Monitor Pair in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P139-KRK-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P139-KRK-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P139-KRK-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this KRK Classic 5-inch Active Bi-Amp Studio Monitor Pair brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p140",
    "sku": "VM-SOUN-P140-SHU",
    "name": "Shure SM58 Cardioid Dynamic Vocal Microphone with Pneumatic Mount",
    "category": "Electronics",
    "brand": "Shure",
    "price": 9490,
    "mrp": 11990,
    "discountPercent": 21,
    "stock": 35,
    "quantity": 35,
    "barcode": "8901000089880",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-15",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop"
    ],
    "description": "The worldwide industry-standard legendary stage and vocal recording microphone. Features tailored vocal presence rise, uniform cardioid pickup pattern, and internal shock-mount system.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Type": "Dynamic (Moving Coil)",
      "Polar Pattern": "Uniform Cardioid Polar Pattern",
      "Frequency Response": "50 to 15,000 Hz Tailored for Vocals",
      "Build": "Steel Mesh Grille with Internal Foam Windscreen"
    },
    "shipping": {
      "weight": "298 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 35
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 24,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P140-SHU-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Shure SM58 Cardioid Dynamic Vocal Microphone with Pneumatic Mount in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P140-SHU-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P140-SHU-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P140-SHU-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Shure SM58 Cardioid Dynamic Vocal Microphone with Pneumatic Mount brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p141",
    "sku": "VM-SOUN-P141-AKA",
    "name": "Akai Professional MPK Mini MK3 25-Key USB MIDI Keyboard Controller",
    "category": "Electronics",
    "brand": "Akai",
    "price": 8990,
    "mrp": 11490,
    "discountPercent": 22,
    "stock": 25,
    "quantity": 25,
    "barcode": "8901000090522",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-16",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop"
    ],
    "description": "Ultra-compact 25-key USB MIDI production keyboard with Gen 2 dynamic keybed, 8 backlit velocity-sensitive MPC pads with Note Repeat, 8 assignable endless rotary knobs, and OLED screen.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Keys": "25 Velocity-Sensitive Gen 2 Dynamic Mini Keys",
      "Pads": "8 Bankable MPC Pads with Note Repeat & Full Level",
      "Knobs": "8 360-Degree Endless Assignable Encoders",
      "Software Bundle": "Includes MPC Beats Production DAW + Instruments"
    },
    "shipping": {
      "weight": "750 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 25
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 27,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P141-AKA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Akai Professional MPK Mini MK3 25-Key USB MIDI Keyboard Controller in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P141-AKA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P141-AKA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P141-AKA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Akai Professional MPK Mini MK3 25-Key USB MIDI Keyboard Controller brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p142",
    "sku": "VM-SOUN-P142-FOA",
    "name": "Professional Acoustic Studio Soundproofing Foam Pyramid Panels (12-Pack)",
    "category": "Electronics",
    "brand": "SoundMaster",
    "price": 2199,
    "mrp": 3299,
    "discountPercent": 33,
    "stock": 40,
    "quantity": 40,
    "barcode": "8901000091164",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-17",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop"
    ],
    "description": "Pack of 12 charcoal-black 12x12x2 inch high-density open-cell acoustic polyurethane pyramid panels. Eliminates flutter echoes, room flutter, and standing wave reflections in home studios.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Pack Size": "12 Panels (Covers 12 Square Feet)",
      "Dimensions": "12\" x 12\" x 2\" Thickness per Tile",
      "NRC Rating": "0.75 Acoustic Absorption Coefficient",
      "Safety": "Class B Flame Retardant Certified"
    },
    "shipping": {
      "weight": "1.2 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 40
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 30,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P142-FOA-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Professional Acoustic Studio Soundproofing Foam Pyramid Panels (12-Pack) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P142-FOA-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P142-FOA-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P142-FOA-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Professional Acoustic Studio Soundproofing Foam Pyramid Panels (12-Pack) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p143",
    "sku": "VM-SOUN-P143-BOO",
    "name": "Heavy-Duty Metal Desktop Broadcast Boom Arm Microphone Stand",
    "category": "Electronics",
    "brand": "SoundMaster",
    "price": 2499,
    "mrp": 3799,
    "discountPercent": 34,
    "stock": 35,
    "quantity": 35,
    "barcode": "8901000091806",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf H-18",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop"
    ],
    "description": "All-tube internal spring broadcast studio boom arm with integrated XLR cable channels and heavy desk clamp. Silent 360-degree positioning holds microphones weighing up to 2kg securely.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Reach": "32 Inches (80 cm) Horizontal & Vertical Reach",
      "Max Load": "Holds heavy mics up to 2.0 kg (4.4 lbs)",
      "Springs": "Internal Torsion Springs (Zero Creak Noise)",
      "Thread Adapters": "Includes 3/8\" to 5/8\" Universal Thread Adapter"
    },
    "shipping": {
      "weight": "1.35 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 35
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 33,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P143-BOO-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Heavy-Duty Metal Desktop Broadcast Boom Arm Microphone Stand in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P143-BOO-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P143-BOO-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P143-BOO-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Heavy-Duty Metal Desktop Broadcast Boom Arm Microphone Stand brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p144",
    "sku": "VM-SOUN-P144-MOG",
    "name": "Mogami Gold Studio XLR Microphone Cable with Neutrik Connectors (10ft)",
    "category": "Electronics",
    "brand": "Mogami",
    "price": 3990,
    "mrp": 5290,
    "discountPercent": 25,
    "stock": 30,
    "quantity": 30,
    "barcode": "8901000092448",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf A-1",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop"
    ],
    "description": "World's most revered studio reference audio cable. Wired with Mogami Neglex quad-balanced 4-conductor high-definition cable and gold-contact Neutrik black XLR connectors.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Length": "10 Feet (3.0 Meters)",
      "Wire": "Mogami 2534 Neglex Quad High-Density Copper",
      "Connectors": "Authentic Gold-Contact Neutrik XLR (M/F)",
      "Shielding": "100% Spiral Bare Copper Shield (Zero RF/EMI Noise)"
    },
    "shipping": {
      "weight": "280 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 30
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 36,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P144-MOG-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Mogami Gold Studio XLR Microphone Cable with Neutrik Connectors (10ft) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P144-MOG-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P144-MOG-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P144-MOG-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Mogami Gold Studio XLR Microphone Cable with Neutrik Connectors (10ft) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p145",
    "sku": "VM-SOUN-P145-POP",
    "name": "Dual-Layer Nylon Studio Microphone Pop Filter with Flexible Gooseneck",
    "category": "Electronics",
    "brand": "SoundMaster",
    "price": 699,
    "mrp": 1099,
    "discountPercent": 36,
    "stock": 70,
    "quantity": 70,
    "barcode": "8901000093090",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf B-2",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop"
    ],
    "description": "Double-layer mesh acoustic screen stops harsh vocal plosives ('P', 'B', 'T' popping sounds) while maintaining vocal transparency. 360-degree flexible gooseneck with screw-lock clamp.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Screen Diameter": "6 Inches (15 cm) Dual Micro-Mesh",
      "Gooseneck Length": "14.5 Inches Sturdy Steel Gooseneck",
      "Clamp": "Padded C-Clamp Fits Tube Stands up to 1.5\" Diameter",
      "Benefit": "Eliminates Vocal Plosives & Saliva Degradation"
    },
    "shipping": {
      "weight": "240 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 70
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.9,
    "reviewsCount": 39,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P145-POP-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Dual-Layer Nylon Studio Microphone Pop Filter with Flexible Gooseneck in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P145-POP-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P145-POP-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P145-POP-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Dual-Layer Nylon Studio Microphone Pop Filter with Flexible Gooseneck brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p146",
    "sku": "VM-SOUN-P146-PAD",
    "name": "High-Density Acoustic Studio Monitor Isolation Speaker Pads (Pair)",
    "category": "Electronics",
    "brand": "SoundMaster",
    "price": 999,
    "mrp": 1499,
    "discountPercent": 33,
    "stock": 50,
    "quantity": 50,
    "barcode": "8901000093732",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf C-3",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop"
    ],
    "description": "Two-component acoustic isolation foam wedges decouple 5\" to 8\" studio monitors from desk resonance. Reversible wedges offer 5 distinct listening tilt angles.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Dimensions": "11.8\" x 7.8\" x 1.8\" Thick per Pad",
      "Fit": "Pairs for 5\", 6\", 7\", 8\" Studio Monitors",
      "Material": "High-Density Acoustic Polyurethane (50 kg/m\u00b3)",
      "Tilt Angles": "Flat, +5\u00b0, +10\u00b0, -5\u00b0, -10\u00b0 Elevation Angles"
    },
    "shipping": {
      "weight": "310 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 50
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 42,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P146-PAD-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received High-Density Acoustic Studio Monitor Isolation Speaker Pads (Pair) in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P146-PAD-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P146-PAD-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P146-PAD-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this High-Density Acoustic Studio Monitor Isolation Speaker Pads (Pair) brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p147",
    "sku": "VM-SOUN-P147-TAS",
    "name": "Tascam DR-05X Portable Stereo Handheld Digital Audio Recorder & USB Interface",
    "category": "Electronics",
    "brand": "Tascam",
    "price": 9490,
    "mrp": 12490,
    "discountPercent": 24,
    "stock": 20,
    "quantity": 20,
    "barcode": "8901000094374",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf D-4",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop"
    ],
    "description": "High-resolution 96kHz/24-bit stereo field recorder with dual omnidirectional condenser microphones capturing up to 125dB SPL. Functions as a 2-in/2-out USB audio interface for PC/Mac.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Microphones": "Stereo Omnidirectional Condensers (Handles 125dB SPL)",
      "Recording Format": "WAV (up to 24-bit/96kHz) and MP3",
      "Battery Life": "Up to 17.5 Hours on 2x AA Alkaline Batteries",
      "Media": "MicroSD/MicroSDHC/MicroSDXC (up to 128GB)"
    },
    "shipping": {
      "weight": "165 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 20
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 45,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P147-TAS-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Tascam DR-05X Portable Stereo Handheld Digital Audio Recorder & USB Interface in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P147-TAS-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P147-TAS-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P147-TAS-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Tascam DR-05X Portable Stereo Handheld Digital Audio Recorder & USB Interface brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p148",
    "sku": "VM-SOUN-P148-BEH",
    "name": "Behringer U-Phoria UM2 Audiophile 2x2 USB Audio Interface",
    "category": "Electronics",
    "brand": "Behringer",
    "price": 4490,
    "mrp": 5990,
    "discountPercent": 25,
    "stock": 35,
    "quantity": 35,
    "barcode": "8901000095016",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf E-5",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop"
    ],
    "description": "Entry-level USB audio interface equipped with state-of-the-art XENYX mic preamp with switchable +48V phantom power, dedicated instrument input, and zero-latency direct monitoring.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Preamp": "XENYX Mic Preamp with +48V Phantom Power",
      "Resolution": "48 kHz Converters for Professional Audio",
      "Inputs": "1x XLR/TRS Combo + 1x 1/4\" Instrument Jack",
      "Outputs": "RCA Stereo Monitor Out + 1/4\" Headphone Jack"
    },
    "shipping": {
      "weight": "260 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 35
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 48,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P148-BEH-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Behringer U-Phoria UM2 Audiophile 2x2 USB Audio Interface in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P148-BEH-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P148-BEH-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P148-BEH-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Behringer U-Phoria UM2 Audiophile 2x2 USB Audio Interface brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p149",
    "sku": "VM-SOUN-P149-SHO",
    "name": "Universal Heavy-Duty Spider Shock Mount for Large Diaphragm Condensers",
    "category": "Electronics",
    "brand": "SoundMaster",
    "price": 1299,
    "mrp": 1899,
    "discountPercent": 32,
    "stock": 45,
    "quantity": 45,
    "barcode": "8901000095658",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf F-6",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop"
    ],
    "description": "Elastic suspension spider shock mount isolating large condenser microphones (43mm to 50mm diameter) from mechanical desk vibrations, footsteps, and floor rumble.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Compatibility": "Microphone Diameter 43 mm to 50 mm",
      "Material": "Heavy-Duty Die-Cast Metal with Elastic Cords",
      "Fittings": "Standard 5/8\"-27 Thread with Angle Locking Knob",
      "Includes": "2x Spare Elastic Suspension Bands"
    },
    "shipping": {
      "weight": "320 g",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 45
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.7,
    "reviewsCount": 51,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P149-SHO-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Universal Heavy-Duty Spider Shock Mount for Large Diaphragm Condensers in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P149-SHO-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P149-SHO-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P149-SHO-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Universal Heavy-Duty Spider Shock Mount for Large Diaphragm Condensers brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  },
  {
    "id": "p150",
    "sku": "VM-SOUN-P150-SHI",
    "name": "Neewer Heavy-Duty Portable Microphone Sound Reflection Filter Isolation Shield",
    "category": "Electronics",
    "brand": "Neewer",
    "price": 3490,
    "mrp": 4990,
    "discountPercent": 30,
    "stock": 20,
    "quantity": 20,
    "barcode": "8901000096300",
    "lowStockThreshold": 5,
    "reservedStock": 0,
    "warehouseLocation": "Shelf G-7",
    "restockLeadDays": 3,
    "vendorId": "v10",
    "status": "approved",
    "images": [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop"
    ],
    "description": "5-panel folding acoustic isolation shield with high-density EVA sound absorbing foam front and perforated vented steel back plates. Mounts onto microphone stands to isolate vocal acoustics.",
    "condition": "Brand New (Sealed)",
    "specifications": {
      "Panels": "5 Adjustable Folding Metal Panels",
      "Interior": "2-inch High-Density Acoustic Pyramidal Foam",
      "Dimensions": "Full Fold-Out 23\" Wide x 11\" High",
      "Mounting": "Mounts to Any Standard Microphone Floor Stand"
    },
    "shipping": {
      "weight": "1.8 kg",
      "dispatchTime": "Ships within 24 hours",
      "estimatedDays": "2 - 4 days",
      "courierPartners": [
        "BlueDart Express",
        "Delhivery Surface",
        "DTDC Air"
      ],
      "codAvailable": true,
      "returnWindowDays": 7
    },
    "variants": {
      "colors": [
        {
          "name": "Standard Black",
          "hex": "#1E293B",
          "inStock": true
        },
        {
          "name": "Titanium Grey",
          "hex": "#64748B",
          "inStock": true
        }
      ],
      "options": [
        {
          "label": "Standard Edition",
          "priceDelta": 0,
          "stock": 20
        }
      ],
      "customization": {
        "allowGiftWrap": true,
        "allowEngraving": false,
        "warrantyPlans": [
          {
            "id": "w1",
            "name": "1-Year Direct Brand Warranty",
            "price": 0,
            "duration": "1 Year"
          },
          {
            "id": "w2",
            "name": "2-Year Extended Protection Plan",
            "price": 499,
            "duration": "2 Years"
          }
        ]
      }
    },
    "rating": 4.8,
    "reviewsCount": 54,
    "reviews": [
      {
        "id": "rev-VM-SOUN-P150-SHI-1",
        "customerName": "Arun Mehta",
        "rating": 5,
        "title": "100% Genuine product & ultra-fast delivery!",
        "comment": "Received Neewer Heavy-Duty Portable Microphone Sound Reflection Filter Isolation Shield in original sealed box with GST tax invoice. Verified on brand website without any issues.",
        "date": "2024-09-02",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P150-SHI-2",
        "customerName": "Neha Singh",
        "rating": 5,
        "title": "Outstanding merchant packaging",
        "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
        "date": "2024-09-10",
        "verified": true
      },
      {
        "id": "rev-VM-SOUN-P150-SHI-3",
        "customerName": "Siddharth Verma",
        "rating": 4,
        "title": "Excellent build quality",
        "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
        "date": "2024-09-15",
        "verified": true
      }
    ],
    "inquiries": [
      {
        "id": "qa-VM-SOUN-P150-SHI-1",
        "customerName": "Kavita Rao",
        "date": "2024-09-01",
        "question": "Is this Neewer Heavy-Duty Portable Microphone Sound Reflection Filter Isolation Shield brand new with official manufacturer warranty across India?",
        "answer": "Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
        "answeredAt": "2024-09-01"
      }
    ],
    "createdAt": "2024-08-15"
  }
];

export const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Grocery",
  "Home & Living",
  "Sports",
  "Beauty"
];

// ── Physical Orders & Shipments ───────────────
export const seedOrders = [
  {
    "id": "ord1",
    "customerId": "c1",
    "items": [
      {
        "productId": "p3",
        "sku": "VM-ELEC-P3-SON",
        "name": "Sony WH-1000XM5 Noise-Cancelling Headphones",
        "price": 29990,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
        "vendorId": "v1",
        "vendorName": "TechZone Electronics"
      },
      {
        "productId": "p10",
        "sku": "VM-ELEC-P10-LOG",
        "name": "Logitech MX Master 3S Wireless Performance Mouse",
        "price": 8995,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200&h=200&fit=crop",
        "vendorId": "v1",
        "vendorName": "TechZone Electronics"
      }
    ],
    "total": 38985,
    "status": "Delivered",
    "paymentMethod": "UPI",
    "paymentStatus": "Paid",
    "trackingNumber": "DEL-8492019",
    "courierPartner": "Delhivery Surface Express",
    "shippingAddress": {
      "fullName": "Arun Mehta",
      "phone": "9000011111",
      "street": "45, Sector 12, Dwarka",
      "city": "New Delhi",
      "state": "Delhi",
      "pincode": "110075"
    },
    "address": "45, Sector 12, Dwarka, New Delhi - 110075",
    "createdAt": "2024-08-20",
    "shipmentTimeline": [
      {
        "status": "Order Placed",
        "timestamp": "2024-08-20 10:30 AM",
        "location": "New Delhi",
        "note": "Order verified."
      },
      {
        "status": "Dispatched",
        "timestamp": "2024-08-21 02:15 PM",
        "location": "TechZone Warehouse, Delhi",
        "note": "Courier handed over to Delhivery."
      },
      {
        "status": "Delivered",
        "timestamp": "2024-08-23 04:45 PM",
        "location": "Dwarka, New Delhi",
        "note": "Doorstep OTP verified & signed."
      }
    ],
    "returnRequest": null,
    "supportTickets": []
  },
  {
    "id": "ord2",
    "customerId": "c2",
    "items": [
      {
        "productId": "p16",
        "sku": "VM-FASH-P16-BAN",
        "name": "Handcrafted Pure Silk Katan Banarasi Saree",
        "price": 18999,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=200&fit=crop",
        "vendorId": "v2",
        "vendorName": "StyleHub Fashion"
      }
    ],
    "total": 18999,
    "status": "Dispatched",
    "paymentMethod": "Credit Card",
    "paymentStatus": "Paid",
    "trackingNumber": "BLU-5291048",
    "courierPartner": "BlueDart Priority Air",
    "shippingAddress": {
      "fullName": "Neha Singh",
      "phone": "9000022222",
      "street": "12, Koregaon Park",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411001"
    },
    "address": "12, Koregaon Park, Pune - 411001",
    "createdAt": "2024-09-08",
    "shipmentTimeline": [
      {
        "status": "Order Placed",
        "timestamp": "2024-09-08 11:15 AM",
        "location": "Pune",
        "note": "Payment authorized."
      },
      {
        "status": "Dispatched",
        "timestamp": "2024-09-09 03:00 PM",
        "location": "StyleHub Fashion Warehouse, Mumbai",
        "note": "In transit via BlueDart Air."
      }
    ],
    "returnRequest": null,
    "supportTickets": []
  },
  {
    "id": "ord3",
    "customerId": "c1",
    "items": [
      {
        "productId": "p61",
        "sku": "VM-SPOR-P61-YOG",
        "name": "Apex Pro Grip High-Density Eco-TPE 6mm Yoga Mat with Alignment Lines",
        "price": 1499,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop",
        "vendorId": "v5",
        "vendorName": "Apex Sports & Outdoors"
      },
      {
        "productId": "p62",
        "sku": "VM-SPOR-P62-DUM",
        "name": "Solid Cast Iron Hex Dumbbell Pair (10kg Each) Rubber Coated",
        "price": 3499,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=200&h=200&fit=crop",
        "vendorId": "v5",
        "vendorName": "Apex Sports & Outdoors"
      }
    ],
    "total": 4998,
    "status": "Delivered",
    "paymentMethod": "UPI",
    "paymentStatus": "Paid",
    "trackingNumber": "DEL-9921443",
    "courierPartner": "Delhivery Surface Express",
    "shippingAddress": {
      "fullName": "Arun Mehta",
      "phone": "9000011111",
      "street": "45, Sector 12, Dwarka",
      "city": "New Delhi",
      "state": "Delhi",
      "pincode": "110075"
    },
    "address": "45, Sector 12, Dwarka, New Delhi - 110075",
    "createdAt": "2024-09-12",
    "shipmentTimeline": [
      {
        "status": "Order Placed",
        "timestamp": "2024-09-12 09:30 AM",
        "location": "New Delhi",
        "note": "Payment confirmed."
      },
      {
        "status": "Dispatched",
        "timestamp": "2024-09-12 05:00 PM",
        "location": "Apex Sports, Hyderabad",
        "note": "Courier handed over to Delhivery."
      },
      {
        "status": "Delivered",
        "timestamp": "2024-09-15 01:20 PM",
        "location": "Dwarka, New Delhi",
        "note": "Delivered successfully."
      }
    ],
    "returnRequest": null,
    "supportTickets": []
  }
];

// ── Marketing Promotions ───────────────────────
export const seedPromotions = [
  {
    "id": "promo-tech20",
    "vendorId": "v1",
    "title": "TechZone Grand Electronics Discount",
    "type": "coupon",
    "code": "TECH20",
    "discountType": "percentage",
    "discountValue": 20,
    "minOrderValue": 999,
    "maxDiscount": 1500,
    "usageLimit": 200,
    "usageCount": 14,
    "status": "active",
    "description": "Get 20% discount up to \u20b91,500 on all electronics orders above \u20b9999 at TechZone!",
    "startDate": "2026-01-01",
    "endDate": "2026-12-31"
  },
  {
    "id": "promo-style15",
    "vendorId": "v2",
    "title": "StyleHub Trendsetter Voucher",
    "type": "coupon",
    "code": "STYLE15",
    "discountType": "percentage",
    "discountValue": 15,
    "minOrderValue": 1499,
    "maxDiscount": 800,
    "usageLimit": 150,
    "usageCount": 28,
    "status": "active",
    "description": "Save 15% on the latest apparel and footwear collections at StyleHub.",
    "startDate": "2026-01-01",
    "endDate": "2026-12-31"
  },
  {
    "id": "promo-audio200",
    "vendorId": "v1",
    "title": "Audio Rush \u20b9200 Off",
    "type": "coupon",
    "code": "AUDIO200",
    "discountType": "fixed",
    "discountValue": 200,
    "minOrderValue": 1999,
    "maxDiscount": 200,
    "usageLimit": 100,
    "usageCount": 35,
    "status": "active",
    "description": "Flat \u20b9200 off on premium headphones, true wireless earbuds, and speakers.",
    "startDate": "2026-01-01",
    "endDate": "2026-12-31"
  },
  {
    "id": "promo-banner-tech",
    "vendorId": "v1",
    "title": "Mega Monsoon Electronics Fiesta",
    "subtitle": "Up to 40% Off Genuine Audio, Smartwatches & Gear + Direct Brand Warranty",
    "type": "promotional_banner",
    "bannerUrl": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=350&fit=crop",
    "bannerPlacement": "store_top",
    "bannerLink": "/store/techzone",
    "buttonText": "Claim Tech Deals",
    "badgeText": "VERIFIED BRAND WARRANTY",
    "status": "active",
    "startDate": "2026-01-01",
    "endDate": "2026-12-31"
  },
  {
    "id": "promo-campaign-festive",
    "vendorId": "v1",
    "title": "Festive Soundwave Clearance",
    "type": "discount_campaign",
    "discountType": "percentage",
    "discountValue": 25,
    "applicableCategory": "Electronics",
    "status": "active",
    "badgeText": "FESTIVE SALE",
    "description": "Direct festival markdowns applied automatically across top earwear and mobile accessories.",
    "startDate": "2026-09-01",
    "endDate": "2026-10-31"
  }
];

// ── Customer-Vendor Conversations ─────────────
export const seedConversations = [
  {
    "id": "conv-seed-1",
    "customerId": "c1",
    "customerName": "Arun Mehta",
    "customerEmail": "arun@example.com",
    "customerAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
    "vendorId": "v1",
    "vendorName": "TechZone Electronics",
    "vendorAvatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop",
    "subject": "Samsung Galaxy S24 Ultra \u2014 Warranty & Courier Dispatch Details",
    "category": "product_inquiry",
    "relatedProduct": {
      "productId": "p1",
      "name": "Samsung Galaxy S24 Ultra",
      "price": 129999,
      "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
      "sku": "VM-ELEC-P1-SAM",
      "category": "Electronics"
    },
    "relatedOrder": null,
    "status": "active",
    "unreadVendor": 1,
    "unreadCustomer": 0,
    "lastMessage": "Does the phone arrive sealed in original packaging with tax invoice for warranty registration?",
    "lastMessageSender": "customer",
    "lastMessageAt": "2026-09-22T08:30:00.000Z",
    "messages": [
      {
        "id": "msg-seed-101",
        "senderId": "c1",
        "senderType": "customer",
        "senderName": "Arun Mehta",
        "senderAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
        "text": "Hello Rajesh! I am interested in purchasing the Titanium Silver variant of the S24 Ultra.",
        "attachments": [],
        "createdAt": "2026-09-22T08:15:00.000Z",
        "isRead": true
      },
      {
        "id": "msg-seed-102",
        "senderId": "v1",
        "senderType": "vendor",
        "senderName": "Rajesh Kumar (TechZone)",
        "senderAvatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop",
        "text": "Hello Arun! Yes, we have authentic physical units physically stocked in our Delhi warehouse ready for priority courier dispatch today via BlueDart Air.",
        "attachments": [],
        "createdAt": "2026-09-22T08:22:00.000Z",
        "isRead": true
      },
      {
        "id": "msg-seed-103",
        "senderId": "c1",
        "senderType": "customer",
        "senderName": "Arun Mehta",
        "senderAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
        "text": "Does the phone arrive sealed in original packaging with tax invoice for warranty registration?",
        "attachments": [],
        "createdAt": "2026-09-22T08:30:00.000Z",
        "isRead": false
      }
    ]
  }
];
