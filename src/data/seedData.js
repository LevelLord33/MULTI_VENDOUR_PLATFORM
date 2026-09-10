// ─────────────────────────────────────────────
//  Vendour-Mart  ·  Seed Data (25 products)
// ─────────────────────────────────────────────

export const ADMIN_CREDENTIALS = {
  email: 'admin@vendour.com',
  password: 'Admin@1234',
  name: 'Platform Admin',
};

// ── Vendors ──────────────────────────────────
export const seedVendors = [
  {
    id: 'v1',
    businessName: 'TechZone Electronics',
    ownerName: 'Rajesh Kumar',
    email: 'rajesh@techzone.in',
    password: 'Vendor@123',
    mobile: '9876543210',
    businessAddress: '14, Electronics Street, Nehru Place',
    location: 'New Delhi, Delhi',
    joinedDate: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop',
  },
  {
    id: 'v2',
    businessName: 'StyleHub Fashion',
    ownerName: 'Priya Sharma',
    email: 'priya@stylehub.in',
    password: 'Vendor@123',
    mobile: '9123456789',
    businessAddress: '5, Fashion Lane, Linking Road',
    location: 'Mumbai, Maharashtra',
    joinedDate: '2024-02-20',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop',
  },
  {
    id: 'v3',
    businessName: 'FreshBazaar Grocery',
    ownerName: 'Amit Patel',
    email: 'amit@freshbazaar.in',
    password: 'Vendor@123',
    mobile: '9988776655',
    businessAddress: '22, Market Road, Majestic',
    location: 'Bengaluru, Karnataka',
    joinedDate: '2024-03-10',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
  },
  {
    id: 'v4',
    businessName: 'HomeEssentials Store',
    ownerName: 'Sunita Rao',
    email: 'sunita@homeessentials.in',
    password: 'Vendor@123',
    mobile: '9765432100',
    businessAddress: '7, Gandhi Nagar, Park Street',
    location: 'Kolkata, West Bengal',
    joinedDate: '2024-04-05',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop',
  },
];

// ── Customers ─────────────────────────────────
export const seedCustomers = [
  {
    id: 'c1',
    fullName: 'Arun Mehta',
    email: 'arun@example.com',
    password: 'Customer@123',
    mobile: '9000011111',
    address: '45, Sector 12, Dwarka',
    location: 'New Delhi, Delhi',
    joinedDate: '2024-05-01',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
  },
  {
    id: 'c2',
    fullName: 'Neha Singh',
    email: 'neha@example.com',
    password: 'Customer@123',
    mobile: '9000022222',
    address: '12, Koregaon Park',
    location: 'Pune, Maharashtra',
    joinedDate: '2024-05-15',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
  },
];

// ── Products ──────────────────────────────────
export const seedProducts = [

  // ── Electronics ──
  {
    id: 'p1',
    vendorId: 'v1',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop',
    ],
    price: 129999,
    description:
      'The Samsung Galaxy S24 Ultra features the groundbreaking Galaxy AI, an integrated S Pen, and a titanium frame. With a 200 MP camera and Snapdragon 8 Gen 3, it redefines mobile photography.',
    specifications: {
      Display: '6.8" Dynamic AMOLED 2X, 120Hz',
      Processor: 'Snapdragon 8 Gen 3',
      RAM: '12 GB',
      Storage: '256 GB / 512 GB / 1 TB',
      'Rear Camera': '200 MP + 12 MP + 10 MP + 50 MP',
      Battery: '5000 mAh with 45W Fast Charging',
      OS: 'Android 14, One UI 6.1',
    },
    quantity: 25,
    brand: 'Samsung',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-06-01',
  },
  {
    id: 'p2',
    vendorId: 'v1',
    name: 'Apple iPad Air (M2) 11"',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=600&h=600&fit=crop',
    ],
    price: 74900,
    description:
      'The iPad Air with M2 chip features a Liquid Retina display, 12 MP front camera with Centre Stage, and up to 10 hours of battery. Compatible with Apple Pencil Pro and Magic Keyboard.',
    specifications: {
      Display: '11" Liquid Retina, 2360×1640',
      Chip: 'Apple M2 (8-core CPU)',
      RAM: '8 GB',
      Storage: '128 GB / 256 GB / 512 GB',
      Camera: '12 MP rear + 12 MP front (Centre Stage)',
      Battery: 'Up to 10 hours',
      Connectivity: 'Wi-Fi 6E, Bluetooth 5.3, USB-C',
    },
    quantity: 18,
    brand: 'Apple',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-06-02',
  },
  {
    id: 'p3',
    vendorId: 'v1',
    name: 'Sony WH-1000XM5 Headphones',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
    ],
    price: 29990,
    description:
      'Sony WH-1000XM5 delivers industry-leading noise cancelling with 8 microphones and two processors. 30 hours of battery, multipoint connection, and auto-detect functionality.',
    specifications: {
      'Driver Unit': '30 mm',
      'Noise Cancellation': 'Industry-leading ANC (8 mics)',
      Battery: '30 hours (NC on)',
      'Charging Time': '3.5 hours (USB-C)',
      Codec: 'LDAC, AAC, SBC',
      Weight: '250 g',
    },
    quantity: 40,
    brand: 'Sony',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-06-03',
  },
  {
    id: 'p4',
    vendorId: 'v1',
    name: 'Lenovo IdeaPad Slim 5 Laptop',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=600&fit=crop',
    ],
    price: 56999,
    description:
      'Lenovo IdeaPad Slim 5 with AMD Ryzen 5 7530U, 16 GB RAM, 512 GB SSD, and a 14" FHD display. Backlit keyboard, fingerprint reader, and 14-hour battery life in a slim form factor.',
    specifications: {
      Processor: 'AMD Ryzen 5 7530U',
      RAM: '16 GB DDR4',
      Storage: '512 GB NVMe SSD',
      Display: '14" FHD IPS Anti-glare',
      Graphics: 'AMD Radeon Graphics',
      Battery: '56 Wh, up to 14 hours',
      OS: 'Windows 11 Home',
    },
    quantity: 15,
    brand: 'Lenovo',
    condition: 'New',
    status: 'pending',
    createdAt: '2024-06-04',
  },
  {
    id: 'p16',
    vendorId: 'v1',
    name: 'boAt Airdopes 141 TWS Earbuds',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop',
    ],
    price: 1299,
    description:
      'The boAt Airdopes 141 features BEAST Mode™ for ultra-low latency gaming, 42 hours of total playback, and IPX4 water resistance — perfect for an active lifestyle.',
    specifications: {
      'Driver Size': '8 mm',
      Battery: '42 hours total (6+36 case)',
      Connectivity: 'Bluetooth 5.1',
      'Latency Mode': 'BEAST Mode™ 60 ms',
      'Water Resistance': 'IPX4',
      Microphone: 'ENx™ Environmental Noise Cancellation',
    },
    quantity: 120,
    brand: 'boAt',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-07-01',
  },
  {
    id: 'p17',
    vendorId: 'v1',
    name: 'Realme Narzo 70 Pro 5G',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=600&fit=crop',
    ],
    price: 19999,
    description:
      'The Realme Narzo 70 Pro 5G brings a 50 MP Sony IMX890 camera, Dimensity 7050 processor, and a stunning 120Hz AMOLED display at a price that disrupts the segment.',
    specifications: {
      Display: '6.67" AMOLED 120Hz',
      Processor: 'MediaTek Dimensity 7050',
      RAM: '8 GB',
      Storage: '128 GB',
      'Rear Camera': '50 MP Sony IMX890 OIS',
      Battery: '5000 mAh with 67W SUPERVOOC',
      OS: 'Android 14, Realme UI 5.0',
    },
    quantity: 60,
    brand: 'Realme',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-07-03',
  },

  // ── Fashion ──
  {
    id: 'p5',
    vendorId: 'v2',
    name: "Men's Classic Oxford Shirt",
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop',
    ],
    price: 1499,
    description:
      "StyleHub's classic Oxford shirt in premium 100% cotton poplin. Features a button-down collar, single chest pocket, and a regular fit that suits both formal and casual occasions.",
    specifications: {
      Material: '100% Cotton Poplin',
      Fit: 'Regular Fit',
      Collar: 'Button-Down',
      Sizes: 'S, M, L, XL, XXL',
      Colors: 'White, Blue, Navy, Light Grey',
      'Care Instructions': 'Machine Wash Cold',
    },
    quantity: 150,
    brand: 'StyleHub',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-06-01',
  },
  {
    id: 'p6',
    vendorId: 'v2',
    name: 'Women Embroidered Anarkali Kurti',
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583744946564-b52d01e7f922?w=600&h=600&fit=crop',
    ],
    price: 899,
    description:
      'Beautifully hand-embroidered Anarkali-style kurti in soft rayon fabric. Ideal for festivals, casual outings, and family gatherings.',
    specifications: {
      Material: 'Rayon',
      Pattern: 'Hand Embroidered',
      Sizes: 'XS, S, M, L, XL',
      Colors: 'Rose Pink, Mustard, Teal',
      Length: 'Knee Length',
    },
    quantity: 200,
    brand: 'StyleHub',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-06-04',
  },
  {
    id: 'p7',
    vendorId: 'v2',
    name: 'Premium Leather Wallet',
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=600&fit=crop',
    ],
    price: 699,
    description:
      'Slim bi-fold wallet in genuine top-grain leather with 6 card slots, a cash compartment, and an ID window. RFID-blocking inner lining for digital security.',
    specifications: {
      Material: 'Top-Grain Genuine Leather',
      'Card Slots': '6 slots + 1 ID window',
      'Cash Compartment': '1 main compartment',
      Feature: 'RFID Blocking',
      Dimensions: '12 × 9.5 × 0.8 cm (closed)',
      Colors: 'Tan Brown, Black, Dark Olive',
    },
    quantity: 300,
    brand: 'StyleHub',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-06-05',
  },
  {
    id: 'p18',
    vendorId: 'v2',
    name: "Women's Printed Palazzo Set",
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=600&fit=crop',
    ],
    price: 1199,
    description:
      'Flowy printed palazzo co-ord set in lightweight georgette fabric. Comes with a matching kurti top. Ideal for casual outings, office wear, and festive occasions.',
    specifications: {
      Material: '100% Georgette',
      Set: 'Kurti + Palazzo',
      Sizes: 'XS, S, M, L, XL, XXL',
      Colors: 'Floral Blue, Botanical Green, Rust Floral',
      'Care Instructions': 'Gentle Machine Wash',
    },
    quantity: 180,
    brand: 'StyleHub',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-07-05',
  },
  {
    id: 'p19',
    vendorId: 'v2',
    name: "Men's Running Shorts (Pack of 2)",
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=600&h=600&fit=crop',
    ],
    price: 799,
    description:
      'Ultra-lightweight 4-way stretch running shorts with a built-in compression layer and sweat-wicking fabric. Ideal for gym, running, and outdoor sports.',
    specifications: {
      Material: '88% Polyester, 12% Spandex',
      Pack: '2 pieces',
      Waistband: 'Elastic with drawstring',
      Sizes: 'S, M, L, XL, XXL',
      Colors: 'Black+Navy, Grey+Red',
      Feature: '4-way stretch, quick dry',
    },
    quantity: 220,
    brand: 'StyleHub',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-07-07',
  },

  // ── Grocery ──
  {
    id: 'p8',
    vendorId: 'v3',
    name: 'Organic Desi Cow Milk (1L)',
    category: 'Grocery',
    images: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1619451427882-6aeaded7ee15?w=600&h=600&fit=crop',
    ],
    price: 89,
    description:
      'Farm-fresh A2 desi cow milk from free-grazing cows. No added hormones, preservatives, or artificial flavours. Delivered fresh daily from FreshBazaar partner farms.',
    specifications: {
      Type: 'A2 Desi Cow Milk',
      Volume: '1 Litre',
      Fat: '3.5% (min)',
      SNF: '8.5% (min)',
      'Shelf Life': '2 days (refrigerated)',
      Certification: 'FSSAI Certified, No Hormones',
    },
    quantity: 500,
    brand: 'FreshBazaar',
    condition: 'N/A',
    status: 'approved',
    createdAt: '2024-06-05',
  },
  {
    id: 'p20',
    vendorId: 'v3',
    name: 'Tata Tea Gold Leaf Tea (500g)',
    category: 'Grocery',
    images: [
      'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop',
    ],
    price: 249,
    description:
      'Tata Tea Gold is a premium blend of select whole-leaf teas from the finest gardens of Assam and Darjeeling, delivering a rich, malty, golden-brown cup every time.',
    specifications: {
      Weight: '500 g',
      Type: 'CTC Whole Leaf Blend',
      Origin: 'Assam & Darjeeling, India',
      Packaging: 'Zip-lock foil pouch',
      'Shelf Life': '18 months',
      FSSAI: 'Licensed',
    },
    quantity: 400,
    brand: 'Tata',
    condition: 'N/A',
    status: 'approved',
    createdAt: '2024-07-09',
  },
  {
    id: 'p21',
    vendorId: 'v3',
    name: 'Amul Ghee Pure Cow Ghee (1L)',
    category: 'Grocery',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1635424710928-0544e8512eae?w=600&h=600&fit=crop',
    ],
    price: 599,
    description:
      'Amul Pure Cow Ghee made from pasteurised cow milk using the traditional bilona process. Rich in natural CLA, Vitamin A, D, E and K for a healthy lifestyle.',
    specifications: {
      Volume: '1 Litre',
      Type: 'Pure Cow Milk Ghee',
      'Fat Content': '99.5% Milk Fat (min)',
      'Shelf Life': '12 months',
      Certification: 'AGMARK, FSSAI',
      Packaging: 'Tin Container',
    },
    quantity: 350,
    brand: 'Amul',
    condition: 'N/A',
    status: 'approved',
    createdAt: '2024-07-10',
  },

  // ── Home & Living ──
  {
    id: 'p9',
    vendorId: 'v4',
    name: 'Philips Air Purifier AC1215',
    category: 'Home & Living',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
    ],
    price: 9999,
    description:
      'Philips AC1215 uses a True HEPA and Active Carbon filter to remove 99.97% of dust, pollen, smoke, and harmful gases from rooms up to 333 sq. ft.',
    specifications: {
      'CADR Rating': '270 m³/h',
      'Room Coverage': 'Up to 333 sq. ft.',
      Filter: 'True HEPA + Active Carbon',
      'Filter Life': 'Up to 17,000 hours',
      'Noise Level': '33 dB (min)',
      'Auto Mode': 'Yes (Air Quality Sensor)',
    },
    quantity: 30,
    brand: 'Philips',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-06-06',
  },
  {
    id: 'p22',
    vendorId: 'v4',
    name: 'Prestige Svachh Induction Cooktop',
    category: 'Home & Living',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&h=600&fit=crop',
    ],
    price: 2799,
    description:
      'The Prestige Svachh Induction Cooktop features a push-button panel, 8 preset cooking functions, auto shut-off, and an anti-magnetic wall for safer, faster cooking.',
    specifications: {
      Power: '2000 Watts',
      'Preset Functions': '8 (Boil, Fry, Roti, Dosa, Curry, Idli, Milk, Keep Warm)',
      Panel: 'Push-button (anti-magnetic)',
      'Auto Shut-Off': 'Yes',
      Voltage: '230V AC, 50Hz',
      Dimensions: '33 x 25 x 7 cm',
    },
    quantity: 45,
    brand: 'Prestige',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-07-12',
  },
  {
    id: 'p23',
    vendorId: 'v4',
    name: 'Solimo Cotton Bath Towel Set (4 Pcs)',
    category: 'Home & Living',
    images: [
      'https://images.unsplash.com/photo-1560185127-6a688c2b4d72?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600&h=600&fit=crop',
    ],
    price: 999,
    description:
      'Premium 550 GSM ring-spun cotton bath towels. Highly absorbent, ultra-soft, and quick-drying. Set of 4 in coordinated colours — perfect for gifting or everyday use.',
    specifications: {
      Material: '100% Ring-Spun Cotton',
      GSM: '550',
      Pack: '4 bath towels',
      Dimensions: '70 x 140 cm each',
      Colors: 'Aqua, Grey, Cream, White',
      Care: 'Machine wash warm',
    },
    quantity: 90,
    brand: 'Solimo',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-07-14',
  },

  // ── Sports ──
  {
    id: 'p10',
    vendorId: 'v1',
    name: 'Yonex Arcsaber 11 Pro Badminton Racket',
    category: 'Sports',
    images: [
      'https://images.unsplash.com/photo-1619534878378-702c9e7ed1e5?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&h=600&fit=crop',
    ],
    price: 8999,
    description:
      'Professional-grade badminton racket used by world champions. Featuring Yonex\'s exclusive Namd graphite fibre for explosive repulsion power.',
    specifications: {
      'Weight': '83 g (4U)',
      'Shaft': 'Stiff flex Namd graphite',
      'Balance': 'Even balance',
      'String Tension': 'Up to 27 lbs',
      'Grip Size': 'G4',
      'Frame': 'HM Graphite + Nanomesh NEO',
    },
    quantity: 35,
    brand: 'Yonex',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-06-08',
  },
  {
    id: 'p24',
    vendorId: 'v1',
    name: 'Cosco Championship Cricket Kit (Junior)',
    category: 'Sports',
    images: [
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600&h=600&fit=crop',
    ],
    price: 3499,
    description:
      'Complete junior cricket kit by Cosco — includes willow bat, pads, gloves, helmet, abdominal guard, thigh guard, kit bag, and a leather cricket ball. Ready to play right away.',
    specifications: {
      Bat: 'English Willow, Junior size',
      Pads: 'Foam + Cane Junior pads',
      Gloves: 'Padded junior gloves',
      Helmet: 'Steel grille helmet (adjustable)',
      Ball: '5.5 oz leather cricket ball',
      'Kit Bag': 'Padded wheels carry bag',
      'For Age': '8–16 years',
    },
    quantity: 30,
    brand: 'Cosco',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-07-15',
  },

  // ── Beauty ──
  {
    id: 'p11',
    vendorId: 'v2',
    name: "Lakmé Absolute Matte Lipstick",
    category: 'Beauty',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4e6232bf4b85?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631214524020-3c69a98b4e64?w=600&h=600&fit=crop',
    ],
    price: 349,
    description:
      'Lakmé Absolute Matte Lipstick delivers rich colour payoff with a 12-hour wear formula. Infused with Vitamin E and Argan Oil to keep lips moisturised all day.',
    specifications: {
      'Finish': 'Matte',
      'Net Weight': '3.7 g',
      'Shades Available': '30+',
      'Key Ingredients': 'Vitamin E, Argan Oil',
      'Wear': '12 hours',
      'Dermatologically Tested': 'Yes',
    },
    quantity: 500,
    brand: 'Lakmé',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-06-15',
  },
  {
    id: 'p12',
    vendorId: 'v2',
    name: 'Minimalist 10% Niacinamide Serum',
    category: 'Beauty',
    images: [
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop',
    ],
    price: 399,
    description:
      'The Minimalist 10% Niacinamide + Zinc PCA serum reduces pores, controls sebum, and fades dark spots. Clinically proven for blemish-prone and oily skin types.',
    specifications: {
      'Active': '10% Niacinamide + 1% Zinc PCA',
      Volume: '30 ml',
      'Skin Type': 'Oily, Combination, Blemish-Prone',
      pH: '6.0–6.5',
      'Free Of': 'Fragrance, Alcohol, Parabens',
      'Cruelty-Free': 'Yes (PETA certified)',
    },
    quantity: 350,
    brand: 'Minimalist',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-06-16',
  },
  {
    id: 'p15',
    vendorId: 'v2',
    name: 'Mamaearth Vitamin C Face Wash (100ml)',
    category: 'Beauty',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop',
    ],
    price: 299,
    description:
      'Mamaearth Vitamin C Face Wash with Vitamin C & Turmeric gently cleanses skin while brightening dull complexion. Dermatologically tested, toxin-free, and MADE SAFE certified.',
    specifications: {
      'Key Ingredients': 'Vitamin C, Turmeric Extract',
      Volume: '100 ml',
      'Skin Type': 'All skin types',
      'Free Of': 'Parabens, SLS, Mineral Oil, Artificial Fragrance',
      Certifications: 'MADE SAFE, Dermatologically Tested',
      'Shelf Life': '24 months',
    },
    quantity: 250,
    brand: 'Mamaearth',
    condition: 'New',
    status: 'approved',
    createdAt: '2024-07-16',
  },

  // ── Pending / Rejected demo ──
  {
    id: 'p13',
    vendorId: 'v3',
    name: 'Cold Pressed Virgin Coconut Oil (500ml)',
    category: 'Grocery',
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop',
    ],
    price: 349,
    description: 'Pure cold-pressed virgin coconut oil extracted without heat, retaining all natural nutrients, antioxidants, and Medium Chain Triglycerides (MCTs).',
    specifications: {
      Volume: '500 ml',
      Type: 'Cold Pressed Virgin',
      'Processing': 'No heat, no chemicals',
      'Shelf Life': '24 months',
      Certification: 'FSSAI, Organic',
    },
    quantity: 200,
    brand: 'FreshBazaar',
    condition: 'N/A',
    status: 'pending',
    createdAt: '2024-06-20',
  },
  {
    id: 'p14',
    vendorId: 'v4',
    name: 'Futon Folding Mattress Sofa Bed',
    category: 'Home & Living',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
    ],
    price: 5999,
    description: 'Multi-functional folding futon that converts from a sofa to a single or double bed. Memory foam comfort layer, easy-fold mechanism, washable velvet cover.',
    specifications: {
      Dimensions: '195 × 80 × 12 cm (flat)',
      'Fill': 'High-density foam + Memory foam topper',
      Cover: 'Removable velvet (machine washable)',
      'Fold Positions': '3 (sofa, lounge, bed)',
      'Weight Capacity': '200 kg',
    },
    quantity: 20,
    brand: 'HomeEssentials',
    condition: 'New',
    status: 'rejected',
    createdAt: '2024-06-18',
  },

  // ── NEW EXPANDED PRODUCTS (p25–p60) ──
  {
    "id": "p25",
    "vendorId": "v1",
    "name": "boAt Airdopes 141 ANC TWS Earbuds",
    "category": "Electronics",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=600&fit=crop"
    ],
    "price": 1499,
    "description": "Crisp audio with 42-hour playtime, Active Noise Cancellation up to 32dB, ENx tech for clear calls, and Beast Mode for ultra-low latency mobile gaming.",
    "specifications": {
      "Playtime": "Up to 42 hours total",
      "Drivers": "10mm Dynamic Drivers",
      "Noise Cancellation": "Active Noise Cancellation (up to 32dB)",
      "Connectivity": "Bluetooth 5.3 with Insta Wake N Pair",
      "Water Resistance": "IPX5 Sweat & Water Resistant",
      "Charging": "Type-C ASAP Charge (5 min = 60 min play)"
    },
    "quantity": 60,
    "brand": "boAt",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-02"
  },

  {
    "id": "p26",
    "vendorId": "v1",
    "name": "OnePlus 12 5G (Flowy Emerald, 16GB RAM, 512GB)",
    "category": "Electronics",
    "images": [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop"
    ],
    "price": 69999,
    "description": "Flagship smartphone powered by Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera system, 2K 120Hz ProXDR display, and 5400mAh battery with 100W SUPERVOOC charging.",
    "specifications": {
      "Display": "6.82\" 2K 120Hz ProXDR AMOLED",
      "Processor": "Qualcomm Snapdragon 8 Gen 3",
      "RAM / Storage": "16 GB LPDDR5X / 512 GB UFS 4.0",
      "Camera": "50MP Sony LYT-808 + 64MP 3X Periscope + 48MP Ultra-Wide",
      "Battery": "5400 mAh with 100W Wired + 50W Wireless",
      "OS": "OxygenOS 14 based on Android 14"
    },
    "quantity": 18,
    "brand": "OnePlus",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-05"
  },

  {
    "id": "p27",
    "vendorId": "v1",
    "name": "Canon EOS R50 Mirrorless Camera (18-45mm Kit)",
    "category": "Electronics",
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop"
    ],
    "price": 58990,
    "description": "Compact and lightweight mirrorless camera with 24.2 MP APS-C CMOS sensor, 4K uncropped video up to 30p, Dual Pixel CMOS AF II with subject detection, and vari-angle touchscreen.",
    "specifications": {
      "Sensor": "24.2 Megapixel APS-C CMOS",
      "Video": "4K uncropped 30p (6K oversampled) & FHD 120p",
      "Autofocus": "Dual Pixel CMOS AF II (Humans, Animals, Vehicles)",
      "Burst Speed": "Up to 15 fps electronic shutter",
      "Lens": "RF-S 18-45mm f/4.5-6.3 IS STM Lens Included",
      "Weight": "375 g (body only)"
    },
    "quantity": 12,
    "brand": "Canon",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-08"
  },

  {
    "id": "p28",
    "vendorId": "v1",
    "name": "Kindle Paperwhite (16 GB, 6.8\" 300 ppi Display)",
    "category": "Electronics",
    "images": [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop"
    ],
    "price": 14999,
    "description": "Dedicated e-reader with glare-free 300 ppi display that reads like real paper, adjustable warm light, up to 10 weeks battery life, and waterproof design for bath or poolside reading.",
    "specifications": {
      "Display": "6.8\" Paperwhite display, 300 ppi, glare-free",
      "Storage": "16 GB (holds thousands of books)",
      "Battery Life": "Up to 10 weeks on a single USB-C charge",
      "Lighting": "17 LEDs with adjustable warm light (white to amber)",
      "Waterproofing": "IPX8 rated (immersible up to 2m fresh water)",
      "Weight": "205 g"
    },
    "quantity": 40,
    "brand": "Amazon",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-10"
  },

  {
    "id": "p29",
    "vendorId": "v2",
    "name": "Nike Air Max SC Men's Running Sneakers",
    "category": "Fashion",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop"
    ],
    "price": 5995,
    "description": "Classic running look with visible Max Air cushioning. Mixed material upper combines leather, textile, and mesh for durable, breathable comfort all day long.",
    "specifications": {
      "Upper Material": "Genuine Leather, Textile and Mesh blend",
      "Sole Material": "Rubber outsole with flex grooves",
      "Cushioning": "Max Air unit in heel",
      "Closure": "Lace-Up",
      "Sizes": "UK 6, 7, 8, 9, 10, 11",
      "Care": "Wipe with clean dry cloth"
    },
    "quantity": 45,
    "brand": "Nike",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-11"
  },

  {
    "id": "p30",
    "vendorId": "v2",
    "name": "Fossil Grant Chronograph Brown Leather Watch",
    "category": "Fashion",
    "images": [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop"
    ],
    "price": 9495,
    "description": "Vintage-inspired timepiece with blue dial, Roman numeral hour markers, three chronograph subdials, and a rich genuine luggage brown leather strap.",
    "specifications": {
      "Case Size": "44 mm Stainless Steel",
      "Dial Color": "Sunray Blue with Roman Numerals",
      "Movement": "Quartz Chronograph",
      "Strap": "22 mm Genuine Brown Leather with Buckle",
      "Water Resistance": "5 ATM (50 meters)",
      "Warranty": "2 Years International Manufacturer Warranty"
    },
    "quantity": 22,
    "brand": "Fossil",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-12"
  },

  {
    "id": "p31",
    "vendorId": "v2",
    "name": "Ray-Ban Aviator Classic Sunglasses (Gold/G-15 Green)",
    "category": "Fashion",
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&h=600&fit=crop"
    ],
    "price": 8590,
    "description": "Iconic tear-drop pilot shaped frames originally designed for US aviators in 1937. Delivers high visual clarity and 100% UV protection with classic mineral crystal glass lenses.",
    "specifications": {
      "Frame Material": "Polished Metal (Gold)",
      "Lens Color": "Classic G-15 Green Mineral Glass",
      "Lens Size": "58 mm (Standard)",
      "Bridge Width": "14 mm",
      "Temple Length": "135 mm",
      "UV Protection": "100% UVA & UVB Protection"
    },
    "quantity": 30,
    "brand": "Ray-Ban",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-13"
  },

  {
    "id": "p32",
    "vendorId": "v2",
    "name": "Pure Silk Kanjeevaram Saree with Gold Zari Border",
    "category": "Fashion",
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=600&fit=crop"
    ],
    "price": 14500,
    "description": "Handwoven pure mulberry silk saree featuring traditional temple motifs along rich metallic zari borders. Comes with an unstitched contrast matching blouse piece.",
    "specifications": {
      "Fabric": "100% Pure Mulberry Silk (Silk Mark Certified)",
      "Zari": "Half-Fine Golden Zari work",
      "Saree Length": "5.5 meters",
      "Blouse Piece": "0.8 meters unstitched included",
      "Occasion": "Weddings, Festivals, Ceremonies",
      "Care": "Dry clean only"
    },
    "quantity": 15,
    "brand": "StyleHub Heritage",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-14"
  },

  {
    "id": "p33",
    "vendorId": "v2",
    "name": "Wildcraft 45L Trekking Rucksack Travel Backpack",
    "category": "Fashion",
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=600&fit=crop"
    ],
    "price": 2999,
    "description": "Rugged 45-litre multi-compartment travel rucksack with ergonomic padded shoulder straps, sternum strap, integrated rain cover, and durable ripstop polyester fabric.",
    "specifications": {
      "Capacity": "45 Litres",
      "Material": "Water-resistant Ripstop Nylon & Polyester",
      "Compartments": "Top loader main + 3 exterior utility pockets",
      "Back Support": "Air mesh padded back panel with lumbar support",
      "Rain Cover": "Included in bottom zipper pouch",
      "Weight": "850 g"
    },
    "quantity": 40,
    "brand": "Wildcraft",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-15"
  },

  {
    "id": "p34",
    "vendorId": "v3",
    "name": "Kashmiri Mogra Pure Saffron Threads (Kesar, 1g)",
    "category": "Grocery",
    "images": [
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop"
    ],
    "price": 649,
    "description": "Grade-A1 authentic Kashmiri Mongra saffron stigmas hand-picked from Pampore, Kashmir. Rich aroma, deep red color, and intense natural flavoring for sweets and milk.",
    "specifications": {
      "Origin": "Pampore, Jammu & Kashmir",
      "Grade": "Grade 1 Mongra (Stigma tips only)",
      "Weight": "1 gram in airtight acrylic container",
      "Purity": "100% pure without adulterants or coloring",
      "Usage": "Sweets, Biryani, Milk, Ayurvedic preparations",
      "Shelf Life": "24 months from packaging"
    },
    "quantity": 80,
    "brand": "FreshBazaar Naturals",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-16"
  },

  {
    "id": "p35",
    "vendorId": "v3",
    "name": "Tata Tea Gold Premium CTC Leaf Tea (1kg)",
    "category": "Grocery",
    "images": [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop"
    ],
    "price": 520,
    "description": "Carefully selected Assam CTC tea leaves blended with 15% gently rolled long leaves for an irresistible aroma and rich strength in every cup of chai.",
    "specifications": {
      "Type": "CTC Black Tea with 15% Long Leaves",
      "Weight": "1 kg Foil Pack",
      "Origin": "Assam, India",
      "Flavor Profile": "Rich, brisk, aromatic, full-bodied",
      "Form": "Granules & Whole Leaves",
      "Shelf Life": "12 months"
    },
    "quantity": 120,
    "brand": "Tata Tea",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-17"
  },

  {
    "id": "p36",
    "vendorId": "v3",
    "name": "Raw Unprocessed Forest Honey (500g Glass Jar)",
    "category": "Grocery",
    "images": [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop"
    ],
    "price": 450,
    "description": "100% pure wild honey collected sustainably from the dense forests of the Western Ghats. Unheated, unfiltered, and free from added sugar or corn syrup.",
    "specifications": {
      "Type": "Raw Multi-Flora Wild Forest Honey",
      "Weight": "500 g in glass bottle",
      "Processing": "Cold-filtered without pasteurization",
      "Additives": "Zero added sugar, zero artificial flavors",
      "Origin": "Western Ghats, India",
      "Shelf Life": "18 months"
    },
    "quantity": 65,
    "brand": "FreshBazaar Organics",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-18"
  },

  {
    "id": "p37",
    "vendorId": "v3",
    "name": "California Almonds Premium Jumbo Size (1kg)",
    "category": "Grocery",
    "images": [
      "https://images.unsplash.com/photo-1508061252224-237ff54ed0a4?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=600&fit=crop"
    ],
    "price": 899,
    "description": "Crisp, whole, nutrient-packed California jumbo badam. High in vitamin E, magnesium, and dietary fibre. Vacuum sealed to retain maximum freshness and crunch.",
    "specifications": {
      "Variety": "Nonpareil Jumbo California Almonds",
      "Weight": "1 kg Nitrogen-flushed ziplock pouch",
      "Nutritional Content": "Rich in Vitamin E, Protein, Healthy Fats",
      "Quality": "Zero broken nuts, hand-sorted",
      "Dietary": "Gluten-free, Vegan, Keto-friendly",
      "Shelf Life": "9 months"
    },
    "quantity": 90,
    "brand": "FreshBazaar Pantry",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-19"
  },

  {
    "id": "p38",
    "vendorId": "v3",
    "name": "Fortune Sunlite Refined Sunflower Oil (5L Can)",
    "category": "Grocery",
    "images": [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&h=600&fit=crop"
    ],
    "price": 680,
    "description": "Light and healthy refined sunflower oil enriched with Vitamin A and D. High smoke point makes it ideal for daily Indian cooking, deep frying, and sauteing.",
    "specifications": {
      "Volume": "5 Litre Jar with sturdy handle",
      "Oil Type": "Refined Sunflower Seed Oil",
      "Fortification": "Fortified with Vitamin A & Vitamin D",
      "Smoke Point": "225°C (Great for frying)",
      "Packaging": "Food-grade recyclable HDPE can",
      "Shelf Life": "9 months from packaging"
    },
    "quantity": 50,
    "brand": "Fortune",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-20"
  },

  {
    "id": "p39",
    "vendorId": "v3",
    "name": "Kellogg's Muesli with 21% Fruit, Nut & Seeds (750g)",
    "category": "Grocery",
    "images": [
      "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=600&fit=crop"
    ],
    "price": 435,
    "description": "Wholesome multigrain breakfast cereal packed with 5 nutritious grains (oats, wheat, corn, rice, barley) along with dried fruits, California almonds, and pumpkin seeds.",
    "specifications": {
      "Weight": "750 g Box",
      "Grains": "Rolled Oats, Wheat flakes, Corn flakes, Barley",
      "Nuts & Fruits": "Almonds, Raisins, Candied Cranberries, Papaya",
      "Fiber": "High fiber, source of protein",
      "Preparation": "Enjoy with cold or warm milk or yogurt",
      "Shelf Life": "9 months"
    },
    "quantity": 75,
    "brand": "Kellogg's",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-21"
  },

  {
    "id": "p40",
    "vendorId": "v4",
    "name": "Philips Hue Smart 9W LED Bulb (E27, 16M Colors)",
    "category": "Home & Living",
    "images": [
      "https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop"
    ],
    "price": 2499,
    "description": "Transform your room with 16 million colors and tunable warm-to-cool white light. Controls via Bluetooth and Zigbee, fully compatible with Alexa, Google Home, and Apple HomeKit.",
    "specifications": {
      "Fitting": "E27 Screw Base (806 Lumens)",
      "Wattage": "9 Watts (Equivalent to 60W traditional)",
      "Color Range": "16 Million Colors + 2200K to 6500K White",
      "Connectivity": "Bluetooth + Zigbee",
      "Voice Assistant": "Alexa, Google Assistant, Apple HomeKit",
      "Lifespan": "25,000 hours"
    },
    "quantity": 50,
    "brand": "Philips",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-22"
  },

  {
    "id": "p41",
    "vendorId": "v4",
    "name": "Wakefit Orthopedic Memory Foam Mattress (Queen 78x60)",
    "category": "Home & Living",
    "images": [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop"
    ],
    "price": 11999,
    "description": "Doctor recommended orthopedic memory foam mattress engineered with NextGen memory foam for pressure relief, zoned spinal alignment, and breathable high-resilience base foam.",
    "specifications": {
      "Dimensions": "78 × 60 × 6 inches (Queen Size)",
      "Foam Layers": "Cooling Gel Memory Foam + High Resilience Base",
      "Cover": "Removable, breathable zipper fabric cover",
      "Firmness": "Medium Firm (Optimal orthopedic support)",
      "Warranty": "10 Years Manufacturer Warranty",
      "Trial": "100-night risk-free trial eligible"
    },
    "quantity": 14,
    "brand": "Wakefit",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-23"
  },

  {
    "id": "p42",
    "vendorId": "v4",
    "name": "Handcrafted Ceramic Dinner Set (18-Piece, Ocean Glaze)",
    "category": "Home & Living",
    "images": [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=600&fit=crop"
    ],
    "price": 3899,
    "description": "Artisanal stoneware dinner set with reactive ocean blue glaze finish. Includes 6 dinner plates, 6 side plates, and 6 katori bowls. Microwave, dishwasher, and food safe.",
    "specifications": {
      "Pieces": "18 Pieces (6 Dinner Plates, 6 Side Plates, 6 Bowls)",
      "Material": "High-fired durable Stoneware Ceramic",
      "Finish": "Handmade reactive glossy glaze",
      "Safety": "100% Lead-free, Cadmium-free, Food grade",
      "Appliance Compatibility": "Microwave and Dishwasher safe",
      "Weight": "8.2 kg"
    },
    "quantity": 25,
    "brand": "HomeEssentials Crafted",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-24"
  },

  {
    "id": "p43",
    "vendorId": "v4",
    "name": "Dyson V8 Absolute Cordless Stick Vacuum Cleaner",
    "category": "Home & Living",
    "images": [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=600&fit=crop"
    ],
    "price": 29900,
    "description": "Powerful, versatile, lightweight cord-free vacuum with up to 40 minutes of fade-free suction. Features anti-tangle de-tangling Motorbar cleaner head and whole-machine filtration.",
    "specifications": {
      "Suction Power": "115 Air Watts (Max mode)",
      "Run Time": "Up to 40 minutes on single charge",
      "Bin Volume": "0.54 Litres with hygienic point-and-shoot emptying",
      "Weight": "2.61 kg (ultra-lightweight)",
      "Filtration": "Advanced whole-machine filtration captures 99.99% particles",
      "Attachments": "Motorbar head, Fluffy cleaner head, Crevice tool, Mini motorized"
    },
    "quantity": 10,
    "brand": "Dyson",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-25"
  },

  {
    "id": "p44",
    "vendorId": "v4",
    "name": "Prestige Iris 750W Mixer Grinder with 3 Stainless Jars",
    "category": "Home & Living",
    "images": [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"
    ],
    "price": 2899,
    "description": "Heavy-duty 750-watt copper motor mixer grinder capable of grinding tough Indian spices and batters. Includes 3 heavy gauge stainless steel jars plus a juicer jar with sieve.",
    "specifications": {
      "Motor": "750 Watts powerful pure copper motor",
      "Jars": "1.5L Wet jar, 1.0L Dry jar, 300ml Chutney jar, 1.5L Juicer jar",
      "Blades": "Forged high grade Stainless Steel blades",
      "Speed Settings": "3 Speed control with incher pulse button",
      "Safety": "Overload protector button with thermal cut-off",
      "Warranty": "2 Years Prestige product warranty"
    },
    "quantity": 35,
    "brand": "Prestige",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-26"
  },

  {
    "id": "p45",
    "vendorId": "v4",
    "name": "Solimo Solid Sheesham Wood Coffee Table (Walnut Finish)",
    "category": "Home & Living",
    "images": [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&h=600&fit=crop"
    ],
    "price": 5499,
    "description": "Crafted from 100% solid Sheesham Indian rosewood with a rich walnut lacquer polish. Features bottom open shelf for magazines and remotes, and termite-resistant seasoning.",
    "specifications": {
      "Dimensions": "85 × 50 × 40 cm (L × W × H)",
      "Wood Type": "100% Solid Sheesham Wood",
      "Finish": "Natural Walnut Polish with Clear Lacquer",
      "Storage": "Full lower shelf storage compartment",
      "Assembly": "Do-it-yourself with provided hardware & guide",
      "Weight": "16 kg"
    },
    "quantity": 18,
    "brand": "Solimo",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-27"
  },

  {
    "id": "p46",
    "vendorId": "v1",
    "name": "Cosco Premier Match Football Size 5 (FIFA Spec)",
    "category": "Sports",
    "images": [
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=600&fit=crop"
    ],
    "price": 1199,
    "description": "Professional high-grade PU leather 32-panel match football with reinforced latex bladder. Delivers true flight trajectory and consistent bounce on grass and turf.",
    "specifications": {
      "Size": "Official Size 5 (Ages 12+)",
      "Panel Construction": "32 hand-stitched PU composite panels",
      "Bladder": "High-retention butyl latex bladder",
      "Suitable Surfaces": "Natural grass, Artificial turf, Hard ground",
      "Weight": "420–440 grams (FIFA Standard)",
      "Includes": "Inflation needle included"
    },
    "quantity": 50,
    "brand": "Cosco",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-28"
  },

  {
    "id": "p47",
    "vendorId": "v1",
    "name": "Nivia Pro Carbon Cricket Bat (Kashmir Willow, Short Handle)",
    "category": "Sports",
    "images": [
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=600&fit=crop"
    ],
    "price": 2199,
    "description": "Expertly pressed Kashmir Willow cricket bat with thick edges, massive sweet spot, and Singapore cane handle with rubber grip for maximum vibration control.",
    "specifications": {
      "Wood": "Grade 1 Hand-Selected Kashmir Willow",
      "Handle": "3-piece Singapore Cane Handle with Chevron Grip",
      "Weight": "1180–1220 grams",
      "Edge Thickness": "38–40 mm thick contoured edges",
      "Blade Size": "Full Men's Size (Short Handle)",
      "Cover": "Full length padded bat cover with carry strap"
    },
    "quantity": 28,
    "brand": "Nivia",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-29"
  },

  {
    "id": "p48",
    "vendorId": "v1",
    "name": "Boldfit Eco-Friendly TPE Yoga Mat with Carry Strap (6mm)",
    "category": "Sports",
    "images": [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop"
    ],
    "price": 899,
    "description": "Double-sided non-slip high-density TPE workout mat. Provides joint cushioning for yoga, pilates, stretching, and floor workouts. Moisture resistant and odorless.",
    "specifications": {
      "Thickness": "6 mm High Density Cushioning",
      "Dimensions": "183 × 61 cm (6ft × 2ft)",
      "Material": "100% Recyclable, Non-Toxic TPE (Latex & PVC Free)",
      "Texture": "Dual-textured non-slip grip on both surfaces",
      "Includes": "Durable adjustable nylon carrying strap",
      "Care": "Wipe clean with mild soap water"
    },
    "quantity": 65,
    "brand": "Boldfit",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-30"
  },

  {
    "id": "p49",
    "vendorId": "v1",
    "name": "Strauss Adjustable Chrome Dumbbell Set (20kg with Hard Case)",
    "category": "Sports",
    "images": [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=600&fit=crop"
    ],
    "price": 3799,
    "description": "Complete home gym dumbbell package with solid steel chrome weight plates, 2 knurled ergonomic bars, 4 star spinlock collars, and hard molded storage travel case.",
    "specifications": {
      "Total Weight": "20 kg (Plates: 4x2.5kg, 4x1.25kg, 4x0.5kg)",
      "Bars": "2 × 14-inch solid chrome textured steel handles",
      "Collars": "4 × Heavy spin-lock collars with rubber washers",
      "Finish": "Rust-resistant mirror chrome polish",
      "Case": "Heavy-duty molded plastic carry case included",
      "Warranty": "1 Year Manufacturer Warranty"
    },
    "quantity": 20,
    "brand": "Strauss",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-07-31"
  },

  {
    "id": "p50",
    "vendorId": "v1",
    "name": "Speedo Adult Biofuse Swimming Goggles (Anti-Fog UV Lens)",
    "category": "Sports",
    "images": [
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560090995-01632a28895b?w=600&h=600&fit=crop"
    ],
    "price": 1399,
    "description": "Engineered with Speedo Biofuse technology for cushioned comfort around the eye socket. Features wide-vision anti-fog coated lenses with 100% UV protection.",
    "specifications": {
      "Lens": "Wide vision curved polycarbonate with anti-fog coating",
      "Protection": "100% UV400 Protection against glare",
      "Seal": "Super-soft gel-like silicone seal",
      "Strap": "Easy push-button dual silicone adjustment strap",
      "Fit": "Unisex Adult Standard Fit",
      "Use": "Pool training, Open water swimming"
    },
    "quantity": 45,
    "brand": "Speedo",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-08-01"
  },

  {
    "id": "p51",
    "vendorId": "v1",
    "name": "Decathlon Btwin Rockrider Mountain Cycle (21-Speed, 27.5\")",
    "category": "Sports",
    "images": [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&h=600&fit=crop"
    ],
    "price": 16999,
    "description": "Rugged all-terrain MTB with 6061 alloy frame, 80mm front suspension fork, Microshift 21-speed gear system, and dual mechanical disc brakes for dependable stopping power.",
    "specifications": {
      "Frame": "6061 Lightweight Aircraft Aluminium Alloy",
      "Wheel Size": "27.5\" Double-Wall Alloy Rims",
      "Gears": "21-Speed Microshift index shifters & derailleurs",
      "Brakes": "Front & Rear 160mm Mechanical Disc Brakes",
      "Suspension": "80mm Travel Front Coil Spring Fork",
      "Weight": "14.5 kg"
    },
    "quantity": 8,
    "brand": "Decathlon",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-08-02"
  },

  {
    "id": "p52",
    "vendorId": "v1",
    "name": "Li-Ning Wind Lite Badminton Shoes (Non-Marking Gum Sole)",
    "category": "Sports",
    "images": [
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600&h=600&fit=crop"
    ],
    "price": 3299,
    "description": "Professional court shoes with non-marking anti-slip rubber outsole, cushion EVA midsole for shock absorption, and breathable mesh upper with TPU side support.",
    "specifications": {
      "Sole": "100% Non-Marking Natural Gum Rubber (Court Safe)",
      "Midsole": "Phylon EVA Foam shock dampening",
      "Upper": "Synthetic Leather + Multi-layer Breathable Mesh",
      "Torsion": "TPU anti-torsion plate embedded in midfoot",
      "Sizes": "UK 6, 7, 8, 9, 10, 11",
      "Weight": "310 grams per shoe"
    },
    "quantity": 30,
    "brand": "Li-Ning",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-08-03"
  },

  {
    "id": "p53",
    "vendorId": "v1",
    "name": "Stag Pro 2-Player Table Tennis Racket Set with 3 Balls",
    "category": "Sports",
    "images": [
      "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600&h=600&fit=crop"
    ],
    "price": 1299,
    "description": "ITTF approved tournament-style table tennis pair with 5-ply wood blade, 2.0mm sponge rubber for spin control, flared handle grip, and 3 seamless 40+ celluloid-free balls.",
    "specifications": {
      "Blade": "5-Ply Selected Poplar & Basswood Blade",
      "Rubber": "ITTF Approved pimples-in rubber with 2.0mm sponge",
      "Rating": "Speed: 75 | Spin: 80 | Control: 90",
      "Handle": "Flared Concave Ergo Grip",
      "Includes": "2 Rackets, 3 Seamless 40+ Orange Balls, Zip Case",
      "Warranty": "6 Months Manufacturer Warranty"
    },
    "quantity": 40,
    "brand": "Stag",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-08-04"
  },

  {
    "id": "p54",
    "vendorId": "v2",
    "name": "Maybelline Colossal Waterproof Mascara (Black, 10.7ml)",
    "category": "Beauty",
    "images": [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop"
    ],
    "price": 399,
    "description": "Iconic collagen-infused volumizing mascara that delivers up to 9x instant lash volume without clumping. Waterproof, smudge-proof, and ophthalmologist tested.",
    "specifications": {
      "Volume": "10.7 ml",
      "Color": "Glam Black",
      "Formula": "Collagen-enriched waterproof, 24h wear",
      "Brush": "Mega Brush with custom bristles for full coverage",
      "Safe for": "Contact lens wearers & sensitive eyes",
      "Removal": "Removes with oil-based cleanser"
    },
    "quantity": 110,
    "brand": "Maybelline",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-08-05"
  },

  {
    "id": "p55",
    "vendorId": "v2",
    "name": "Plum Green Tea Mattifying Oil-Free Moisturizer (50ml)",
    "category": "Beauty",
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608248597359-58d31985392e?w=600&h=600&fit=crop"
    ],
    "price": 470,
    "description": "100% vegan lightweight daily moisturizer enriched with green tea extracts, glycolic acid, and non-comedogenic hydration for clear, acne-free matte skin.",
    "specifications": {
      "Skin Type": "Oily, Combination & Acne-Prone skin",
      "Key Actives": "Green Tea Extract, Glycolic Acid, Niacinamide",
      "Texture": "Ultralight matte gel-cream",
      "Formula": "100% Vegan, Cruelty-Free, Paraben-Free",
      "Volume": "50 ml pump dispenser",
      "Shelf Life": "24 months"
    },
    "quantity": 85,
    "brand": "Plum",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-08-06"
  },

  {
    "id": "p56",
    "vendorId": "v2",
    "name": "WOW Skin Science Apple Cider Vinegar Shampoo (300ml)",
    "category": "Beauty",
    "images": [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop"
    ],
    "price": 375,
    "description": "Formulated with 100% natural raw Himalayan apple cider vinegar, argan oil, and sweet almond oil to clarify scalp buildup, restore pH balance, and boost gloss.",
    "specifications": {
      "Volume": "300 ml with pump",
      "Key Ingredients": "Raw Apple Cider Vinegar, Argan Oil, Almond Oil",
      "Hair Type": "All hair types, especially oily & dull hair",
      "Free From": "No Sulphates, Silicones, Parabens, Mineral Oil",
      "Benefit": "Clears dandruff buildup, restores natural shine",
      "Shelf Life": "24 months"
    },
    "quantity": 95,
    "brand": "WOW Skin Science",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-08-07"
  },

  {
    "id": "p57",
    "vendorId": "v2",
    "name": "Kama Ayurveda Pure Rose Water Face Toner (200ml)",
    "category": "Beauty",
    "images": [
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop"
    ],
    "price": 1350,
    "description": "Steam distilled from the fragrant roses of Kannauj, Uttar Pradesh. Natural astringent that balances and restores skin pH, tightens pores, and revives tired skin.",
    "specifications": {
      "Source": "Taruni (Kannauj) Desi Rose Petals",
      "Extraction": "Traditional steam distillation",
      "Volume": "200 ml fine mist spray bottle",
      "Skin Type": "Suitable for all skin types including sensitive",
      "Purity": "100% natural, alcohol-free, preservative-free",
      "Shelf Life": "24 months"
    },
    "quantity": 40,
    "brand": "Kama Ayurveda",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-08-08"
  },

  {
    "id": "p58",
    "vendorId": "v2",
    "name": "The Derma Co 1% Hyaluronic Sunscreen Aqua Gel (50g, SPF 50)",
    "category": "Beauty",
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop"
    ],
    "price": 499,
    "description": "Broad spectrum PA++++ sunscreen with ultra-lightweight water-like gel consistency. Zero white cast, non-sticky, infused with Hyaluronic Acid and Vitamin E for deep hydration.",
    "specifications": {
      "SPF / PA": "SPF 50 PA++++ Broad Spectrum",
      "Key Actives": "1% Hyaluronic Acid, Vitamin E, Titanium Dioxide",
      "Finish": "Dewy, invisible, zero white cast",
      "Weight": "50 grams pump bottle",
      "Protection": "UVA, UVB and Blue Light Protection",
      "Safety": "Dermatologist tested, fragrance-free"
    },
    "quantity": 120,
    "brand": "The Derma Co",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-08-09"
  },

  {
    "id": "p59",
    "vendorId": "v2",
    "name": "Mamaearth Onion Hair Oil for Hair Fall Control (250ml)",
    "category": "Beauty",
    "images": [
      "https://images.unsplash.com/photo-1608248597359-58d31985392e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop"
    ],
    "price": 419,
    "description": "Enriched with Onion seed oil, Redensyl, Bhringraj, and Castor oil to accelerate hair growth, reduce breakage, nourish hair follicles, and add silkiness.",
    "specifications": {
      "Volume": "250 ml with comb applicator nozzle",
      "Key Actives": "Onion Seed Oil, Redensyl, Almond Oil, Bhringraj",
      "Hair Benefit": "Boosts hair regrowth, prevents hair fall",
      "Toxin Free": "Made Safe Certified, No Parabens or Mineral Oil",
      "Application": "Direct-to-scalp comb applicator included",
      "Shelf Life": "24 months"
    },
    "quantity": 80,
    "brand": "Mamaearth",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-08-10"
  },

  {
    "id": "p60",
    "vendorId": "v2",
    "name": "Philips BHH880/10 Heated Hair Straightening Brush",
    "category": "Beauty",
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&h=600&fit=crop"
    ],
    "price": 2795,
    "description": "ThermoProtect heated straightening brush with tourmaline ceramic coating for naturally straight, shiny, frizz-free hair in just 5 minutes with triple bristle design.",
    "specifications": {
      "Technology": "ThermoProtect constant temperature technology",
      "Coating": "Tourmaline Ceramic coated bristles",
      "Temperature Settings": "2 Settings (170°C and 200°C)",
      "Heat Up Time": "Fast 50 seconds heat-up with ready LED indicator",
      "Cord Length": "1.8 meter swivel cord for flexibility",
      "Warranty": "2 Years worldwide manufacturer guarantee"
    },
    "quantity": 35,
    "brand": "Philips",
    "condition": "New",
    "status": "approved",
    "createdAt": "2024-08-11"
  },
];

export const CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Grocery',
  'Home & Living',
  'Sports',
  'Beauty',
];

export const seedOrders = [
  {
    id: 'ord1',
    customerId: 'c1',
    items: [
      { productId: 'p1', name: 'Samsung Galaxy S24 Ultra', price: 129999, quantity: 1, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=200&fit=crop' },
      { productId: 'p3', name: 'Sony WH-1000XM5 Headphones', price: 29990, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
    ],
    total: 159989,
    status: 'Delivered',
    address: '45, Sector 12, Dwarka, New Delhi',
    createdAt: '2024-06-20',
  },
  {
    id: 'ord2',
    customerId: 'c1',
    items: [
      { productId: 'p5', name: "Men's Classic Oxford Shirt", price: 1499, quantity: 2, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop' },
    ],
    total: 2998,
    status: 'Processing',
    address: '45, Sector 12, Dwarka, New Delhi',
    createdAt: '2024-07-01',
  },
];
