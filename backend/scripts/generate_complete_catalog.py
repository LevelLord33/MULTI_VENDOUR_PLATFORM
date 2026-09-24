import json
import os
import random

def build_catalog():
    print("Building full 10-vendor, 150-product catalog...")

    # Load base definitions from generate_all
    import sys
    sys.path.append(os.path.dirname(__file__))
    from generate_all import VENDORS, CUSTOMERS, CATEGORIES, ADMIN_CREDENTIALS

    # Build 150 products (15 per vendor)
    PRODUCTS_RAW = [
        # ── VENDOR 1: TechZone Electronics (p1 - p15) ──────────────────
        ("p1", "v1", "VM-ELEC-P1-SAM", "Samsung Galaxy S24 Ultra", "Electronics", "Samsung", 129999, 158599, 18,
         ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop"],
         "The Samsung Galaxy S24 Ultra features groundbreaking Galaxy AI, an integrated S Pen, and a titanium frame. 200MP quad camera and Snapdragon 8 Gen 3 redefines flagship smartphone performance.",
         {"Display": "6.8\" Dynamic AMOLED 2X, 120Hz", "Processor": "Snapdragon 8 Gen 3", "RAM": "12 GB", "Storage": "256 GB / 512 GB", "Rear Camera": "200 MP + 12 MP + 10 MP + 50 MP", "Battery": "5000 mAh 45W Fast Charge"}, "232 g"),

        ("p2", "v1", "VM-ELEC-P2-APP", "Apple iPhone 15 Pro Max 256GB", "Electronics", "Apple", 134900, 159900, 15,
         ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=600&fit=crop"],
         "Forged in titanium with the ground-breaking A17 Pro chip, customizable Action button, and the most versatile 5x optical telephoto camera system in iPhone history.",
         {"Display": "6.7\" Super Retina XDR OLED, 120Hz", "Chip": "A17 Pro", "Camera": "48 MP Main with 5x Telephoto", "Weight": "221 g", "Charging": "USB-C with USB 3 Speeds"}, "221 g"),

        ("p3", "v1", "VM-ELEC-P3-SON", "Sony WH-1000XM5 Noise-Cancelling Headphones", "Electronics", "Sony", 29990, 34990, 24,
         ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop"],
         "Industry-leading active noise cancellation with two processors and 8 microphones. Hi-Res audio wireless, 30-hour battery life, and crystal-clear hands-free calling.",
         {"Driver": "30mm Precision Engineered", "Battery Life": "Up to 30 hours", "Charging": "3 min charge for 3 hours playback", "Bluetooth": "v5.2 with LDAC and Multipoint"}, "250 g"),

        ("p4", "v1", "VM-ELEC-P4-MAC", "Apple MacBook Air 13-inch M3", "Electronics", "Apple", 104990, 114900, 12,
         ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop"],
         "Strikingly thin and fast MacBook Air with the M3 chip. Delivers up to 18 hours of battery life and support for up to two external displays in a durable recycled aluminum enclosure.",
         {"Processor": "Apple M3 8-core CPU", "GPU": "10-core GPU", "Memory": "8 GB Unified Memory", "Storage": "256 GB SSD", "Display": "13.6\" Liquid Retina Display"}, "1.24 kg"),

        ("p5", "v1", "VM-ELEC-P5-ONE", "OnePlus Watch 2 WearOS Smartwatch", "Electronics", "OnePlus", 21999, 27999, 30,
         ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"],
         "Dual-Engine Architecture with Wear OS 4 and RTOS co-processors. Up to 100-hour battery life in Smart Mode, stainless steel chassis, 2.5D sapphire crystal face, and precision dual-frequency GPS.",
         {"Battery": "100 Hours Smart Mode", "OS": "Wear OS by Google + RTOS", "Display": "1.43\" AMOLED 1000 nits", "Water Resistance": "5ATM + IP68"}, "80 g"),

        ("p6", "v1", "VM-ELEC-P6-IPA", "Apple iPad Air 11-inch M2", "Electronics", "Apple", 59900, 64900, 16,
         ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop"],
         "The redesigned 11-inch iPad Air is supercharged by the Apple M2 chip. Features a Liquid Retina display, landscape 12MP front camera with Center Stage, and Wi-Fi 6E.",
         {"Display": "11\" Liquid Retina True Tone", "Processor": "Apple M2 Chip", "Storage": "128 GB", "Camera": "12MP Wide back, 12MP Ultra Wide front"}, "462 g"),

        ("p7", "v1", "VM-ELEC-P7-BOS", "Bose QuietComfort Ultra Wireless Earbuds", "Electronics", "Bose", 23900, 29900, 22,
         ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop"],
         "Breakthrough spatialized audio for immersive listening no matter the content. World-class noise cancellation and CustomTune technology for personalized sound.",
         {"Noise Cancelling": "Active with CustomTune", "Battery": "Up to 6 hours (24 with case)", "Microphones": "Built-in beamforming array", "Water Resistance": "IPX4"}, "60 g"),

        ("p8", "v1", "VM-ELEC-P8-ASU", "ASUS ROG Zephyrus G14 Gaming Laptop", "Electronics", "ASUS", 149990, 174990, 8,
         ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop"],
         "Ultra-compact 14-inch gaming beast powered by AMD Ryzen 9 8945HS and NVIDIA GeForce RTX 4070. Features an OLED 3K 120Hz ROG Nebula Display in a CNC machined aluminum chassis.",
         {"Processor": "AMD Ryzen 9 8945HS", "Graphics": "NVIDIA GeForce RTX 4070 8GB", "RAM": "32 GB LPDDR5X", "Storage": "1 TB PCIe 4.0 NVMe", "Display": "14\" 3K 120Hz 0.2ms OLED"}, "1.5 kg"),

        ("p9", "v1", "VM-ELEC-P9-KEY", "Keychron K2 V2 Wireless Mechanical Keyboard", "Electronics", "Keychron", 8499, 10999, 35,
         ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop"],
         "75% layout compact wireless mechanical keyboard with Gateron G Pro Brown tactile switches, RGB backlighting, and dual Mac & Windows compatibility via Bluetooth 5.1 or USB-C.",
         {"Layout": "75% (84 Keys)", "Switches": "Gateron G Pro Brown Tactile", "Connectivity": "Bluetooth 5.1 & Type-C Cable", "Battery": "4000 mAh Rechargeable"}, "790 g"),

        ("p10", "v1", "VM-ELEC-P10-LOG", "Logitech MX Master 3S Wireless Performance Mouse", "Electronics", "Logitech", 8995, 10995, 40,
         ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=600&fit=crop"],
         "Remastered flagship ergonomic mouse with Quiet Clicks and 8,000 DPI track-on-glass sensor. MagSpeed electromagnetic scrolling scrolls 1,000 lines in a second with pixel-level precision.",
         {"Sensor": "Darkfield 8000 DPI (Tracks on glass)", "Battery": "Up to 70 days on full charge", "Buttons": "7 customizable buttons + gesture button", "Connectivity": "Bluetooth & Logi Bolt"}, "141 g"),

        ("p11", "v1", "VM-ELEC-P11-ANK", "Anker 737 Power Bank 24,000mAh 140W", "Electronics", "Anker", 11999, 14999, 25,
         ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop"],
         "Ultra-powerful two-way fast charging with Power Delivery 3.1 and bi-directional 140W output. Smart digital display shows output/input power and estimated full recharge time.",
         {"Capacity": "24,000 mAh / 86.4Wh", "Max Output": "140W Single Port", "Ports": "2x USB-C + 1x USB-A", "Display": "Smart Digital Color Display"}, "630 g"),

        ("p12", "v1", "VM-ELEC-P12-MAR", "Marshall Stanmore III Bluetooth Home Speaker", "Electronics", "Marshall", 31999, 37999, 14,
         ["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop"],
         "Re-engineered for an expansive, room-shaking Marshall signature home audio experience. Features outward-angled tweeters, updated waveguides, and Bluetooth 5.2 with analog brass controls.",
         {"Power Output": "80W Class D Amplification", "Frequency Range": "45–20,000 Hz", "Inputs": "3.5 mm AUX, RCA, Bluetooth 5.2", "Design": "Textured Vinyl & Classic Script Logo"}, "4.25 kg"),

        ("p13", "v1", "VM-ELEC-P13-KIN", "Amazon Kindle Paperwhite 16GB Waterproof", "Electronics", "Amazon", 14999, 17999, 30,
         ["https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&h=600&fit=crop"],
         "Now with a 6.8\" glare-free 300 ppi display, thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns. IPX8 waterproof rating for poolside reading.",
         {"Display": "6.8\" Glare-Free 300 ppi", "Storage": "16 GB (Holds thousands of books)", "Lighting": "Adjustable White to Warm Amber", "Battery": "Up to 10 Weeks", "Waterproof": "IPX8"}, "205 g"),

        ("p14", "v1", "VM-ELEC-P14-SAN", "SanDisk Extreme PRO 1TB Portable SSD 2000MB/s", "Electronics", "SanDisk", 12499, 16999, 28,
         ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=600&fit=crop"],
         "Blazing fast NVMe performance up to 2000MB/s read/write speeds over USB 3.2 Gen 2x2. Forged aluminum chassis acts as a heatsink, while silicone shell delivers IP65 dust and water resistance.",
         {"Speed": "Up to 2000 MB/s Read & Write", "Capacity": "1 TB", "Interface": "USB 3.2 Gen 2x2 Type-C", "Durability": "IP65 Water & Dust + 3-Meter Drop Protection"}, "77 g"),

        ("p15", "v1", "VM-ELEC-P15-BEL", "Belkin BoostCharge Pro 3-in-1 MagSafe Stand", "Electronics", "Belkin", 12999, 15999, 20,
         ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop"],
         "Fast wireless charging up to 15W for iPhone 15/14/13/12 models, Apple Watch Series 9/Ultra, and AirPods case simultaneously. Premium stainless steel architecture complements any nightstand.",
         {"iPhone Output": "Official 15W MagSafe Fast Wireless", "Watch Output": "Fast Charge Module for Apple Watch", "AirPods Output": "5W Qi Base", "Build": "Architectural Stainless Steel"}, "520 g"),

        # ── VENDOR 2: StyleHub Fashion (p16 - p30) ──────────────────────
        ("p16", "v2", "VM-FASH-P16-BAN", "Handcrafted Pure Silk Katan Banarasi Saree", "Fashion", "Banaras Weaves", 18999, 24999, 12,
         ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop"],
         "Woven by master weavers in Varanasi using pure katan silk yarn and genuine gold zari jaal motifs. Includes unstitched matching blouse fabric with ornate sleeve border.",
         {"Fabric": "100% Pure Katan Silk", "Weave Technique": "Kadhiwa Handloom", "Length": "5.5 Meters + 0.8M Blouse Piece", "Zari": "Tested Micro Gold Zari", "Care": "Dry Clean Only"}, "750 g"),

        ("p17", "v2", "VM-FASH-P17-LIN", "Men's Tailored Pure French Linen Casual Shirt", "Fashion", "StyleHub Classics", 2799, 3999, 35,
         ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop"],
         "Crafted from 100% Normandy French flax linen. Pre-washed for incredible softness, featuring mother-of-pearl buttons and a semi-spread collar designed for tropical elegance.",
         {"Material": "100% French Flax Linen", "Fit": "Tailored Regular Fit", "Collar": "Semi-Spread Soft Collar", "Wash": "Enzyme Stone-Washed"}, "240 g"),

        ("p18", "v2", "VM-FASH-P18-ANA", "Women's Embroidered Anarkali Kurta Set with Dupatta", "Fashion", "Riwaaz Festive", 4499, 6999, 20,
         ["https://images.unsplash.com/photo-1583391733975-023a10582d92?w=600&h=600&fit=crop"],
         "Graceful Chanderi silk anarkali adorned with delicate gota patti handwork, paired with matching cotton silk pants and a lightweight organza scalloped dupatta.",
         {"Kurta Fabric": "Chanderi Silk with Cotton Lining", "Bottom Fabric": "Cotton Silk Trousers", "Dupatta": "Pure Organza with Gota Lace", "Work": "Hand Gota Patti & Zardozi"}, "680 g"),

        ("p19", "v2", "VM-FASH-P19-KOL", "Handcrafted Genuine Leather Kolhapuri Chappals", "Fashion", "Kolhapur Crafts", 1899, 2999, 45,
         ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop"],
         "Authentic vegetable-tanned genuine leather Kolhapuri sandals with hand-braided straps and traditional punch-hole detailing. Molds naturally to your feet over time.",
         {"Upper": "Full-Grain Veg-Tanned Buffalo Leather", "Sole": "Stacked Leather Sole with Anti-Slip Heel Pod", "Stitching": "Hand-stitched Cotton Cord", "Origin": "Kolhapur, Maharashtra"}, "420 g"),

        ("p20", "v2", "VM-FASH-P20-DEN", "Men's Slim-Fit Selvedge Indigo Denim Jeans", "Fashion", "DenimWorks", 3499, 4999, 28,
         ["https://images.unsplash.com/photo-1542272604-780c96856592?w=600&h=600&fit=crop"],
         "13.5oz Japanese shuttle-loom woven red-line selvedge denim. Raw, unwashed indigo fabric that creates personalized fading whiskers and honeycombs with continuous wear.",
         {"Fabric Weight": "13.5 oz Raw Selvedge Denim", "Composition": "99% Cotton, 1% Elastane", "Hardware": "Solid Copper Rivets & Button Fly", "Fit": "Slim Straight Fit"}, "650 g"),

        ("p21", "v2", "VM-FASH-P21-CHA", "Chanderi Hand-Block Print Zari Border Cotton Saree", "Fashion", "Chanderi Heritage", 5999, 8999, 16,
         ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=600&fit=crop"],
         "Feather-light Chanderi cotton silk saree featuring heritage Sanganeri floral block motifs stamped by hand using natural vegetable dyes, crowned with a woven gold zari pattu border.",
         {"Fabric": "Chanderi Cotton Silk (70% Cotton, 30% Silk)", "Dyes": "Natural Indigo & Madder Plant Dyes", "Length": "6.3 Meters with Blouse", "Weight": "Ultra-lightweight 380g"}, "380 g"),

        ("p22", "v2", "VM-FASH-P22-BLA", "100% Merino Wool Tailored Casual Blazer for Men", "Fashion", "Savile Craft", 8999, 13999, 14,
         ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=600&fit=crop"],
         "Structured yet comfortable unstructured single-breasted blazer woven from fine Australian Merino wool. Half-canvassed for natural drape with horn buttons and double back vents.",
         {"Fabric": "100% Australian Merino Wool", "Construction": "Half-Canvas with Bemberg Cupro Lining", "Buttons": "Natural Horn", "Vents": "Double Back Vents"}, "780 g"),

        ("p23", "v2", "VM-FASH-P23-BOO", "Goodyear Welted Handcrafted Leather Chelsea Boots", "Fashion", "Craftsman Shoes", 6499, 9999, 22,
         ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=600&fit=crop"],
         "Classic Chelsea boot built with Goodyear welt construction for lifetime resoleability. Features supple calfskin leather, elasticized side gussets, and Dainite rubber studded outsole.",
         {"Leather": "Full-Grain European Calfskin", "Construction": "Goodyear Welted 360-Degree", "Sole": "Dainite All-Weather Studded Rubber", "Insole": "Poron Cushion with Cork Bed"}, "1.1 kg"),

        ("p24", "v2", "VM-FASH-P24-SCA", "Floral Printed 100% Mulberry Silk Scarf", "Fashion", "SilkRoute", 1699, 2499, 50,
         ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=600&fit=crop"],
         "90x90cm pure twill mulberry silk scarf featuring hand-rolled edges and hand-illustrated botanical motifs inspired by Mughal gardens. Lustrous, smooth, and gentle on sensitive skin.",
         {"Material": "100% Pure Mulberry Silk Twill (16 Momme)", "Dimensions": "90 cm x 90 cm", "Finishing": "Hand-Rolled Hem", "Print": "Double-sided Digital Reactive Print"}, "90 g"),

        ("p25", "v2", "VM-FASH-P25-CHI", "Lucknowi Chikankari Hand-Embroidered Modal Kurti", "Fashion", "Awadh Weaves", 2299, 3499, 38,
         ["https://images.unsplash.com/photo-1583391733975-023a10582d92?w=600&h=600&fit=crop"],
         "Artisanal modal cotton kurti showcasing authentic Lucknowi Chikankari shadow-work (Bakhiya) and knot stitch (Phanda) by rural women artisans in Uttar Pradesh.",
         {"Fabric": "Super-Soft Breathable Modal Cotton", "Stitches": "Bakhiya, Phanda, Keel Kangan", "Fit": "Relaxed Straight Cut", "Length": "Calf-Length (44 inches)"}, "280 g"),

        ("p26", "v2", "VM-FASH-P26-NEH", "Men's Raw Silk Embroidered Bandhgala Nehru Jacket", "Fashion", "Rajputana Royals", 4999, 7499, 18,
         ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop"],
         "Regal sleeveless Nehru jacket tailored in textured raw Bhagalpuri silk with a mandarin collar, antique metal coin buttons, and subtle thread embroidery on the welt pocket.",
         {"Fabric": "100% Raw Tussar Silk", "Lining": "Breathable Viscose Satin", "Closure": "Antique Brass Buttons", "Pockets": "Two Slit Pockets + One Chest Pocket"}, "420 g"),

        ("p27", "v2", "VM-FASH-P27-MES", "Full-Grain Buff Leather Messenger Laptop Briefcase", "Fashion", "Hides & Co", 5499, 7999, 20,
         ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"],
         "Rugged and refined vegetable-tanned buffalo leather messenger bag with padded 15.6-inch laptop compartment, YKK brass zippers, and detachable heavy cotton webbing shoulder strap.",
         {"Leather": "Full-Grain Oiled Buffalo Leather", "Hardware": "Solid Antique Brass YKK Zippers", "Laptop Compatibility": "Up to 16\" MacBook Pro / ThinkPad", "Capacity": "14 Litres"}, "1.3 kg"),

        ("p28", "v2", "VM-FASH-P28-KHA", "Handspun Organic Khadi Cotton Kurta Pajama Set", "Fashion", "Gram Udyog", 2999, 4499, 32,
         ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=600&fit=crop"],
         "Certified handspun and handwoven khadi cotton kurta pajama set. Natural porous weave stays cool in summer and warm in winter with wooden coconut shell buttons.",
         {"Material": "100% Handspun Organic Khadi Cotton", "Certification": "Khadi India Certified", "Includes": "Kurta + Churidar Pajama", "Pockets": "Two Deep Side Pockets"}, "450 g"),

        ("p29", "v2", "VM-FASH-P29-LOA", "Handcrafted Italian Suede Penny Loafers", "Fashion", "Milano Footwear", 4299, 6499, 25,
         ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop"],
         "Slip-on penny loafers crafted from velvety water-resistant Italian split suede. Unlined vamp creates glove-like flexibility with cushioned leather-covered footbed.",
         {"Upper": "Water-Repellent Italian Suede", "Lining": "Breathable Calfskin Heel Lining", "Outsole": "Flexible Rubber Studded Driving Sole", "Style": "Classic Penny Slot Saddle"}, "700 g"),

        ("p30", "v2", "VM-FASH-P30-PAS", "Authentic Kashmiri Pure Pashmina Hand-Embroidered Shawl", "Fashion", "Kashmir Loom", 14999, 21999, 10,
         ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=600&fit=crop"],
         "GI-tagged authentic Kashmiri Pashmina shawl hand-spun from Changthangi mountain goat fleece. Decorated with intricate Sozni needle embroidery along the four borders.",
         {"Fiber": "100% Grade-A Changthangi Pashmina Cashmere", "Fineness": "12-14 Microns", "Embroidery": "Hand Sozni Needlework Border", "Dimensions": "100 cm x 200 cm"}, "180 g"),

        # ── VENDOR 3: FreshBazaar Grocery (p31 - p45) ───────────────────
        ("p31", "v3", "VM-GROC-P31-MUS", "Organic Wood-Pressed Mustard Oil (5 Litre Tin)", "Grocery", "FreshBazaar Pure", 1299, 1699, 45,
         ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop"],
         "Extracted in traditional wooden Kolhu/Chekku at ambient temperatures below 40°C. 100% pure, unrefined, retaining natural pungent aroma and heart-healthy Omega-3 fatty acids.",
         {"Extraction Method": "Traditional Wooden Ghani / Chekku", "Purity": "100% Cold-Pressed Unrefined", "Free From": "Argemone Oil, Hexane, Chemicals", "Shelf Life": "12 Months"}, "5.2 kg"),

        ("p32", "v3", "VM-GROC-P32-ALM", "Premium Royal Kashmiri Mamra Almonds (500g)", "Grocery", "Himalayan Harvest", 1899, 2499, 55,
         ["https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&h=600&fit=crop"],
         "100% genuine concave Kashmiri Mamra badam. Naturally high oil content exceeding 50%, non-pasteurized, rich in Vitamin E, and free from chemical polishing.",
         {"Origin": "Kashmir Valley, India", "Oil Content": ">50% Natural Oils", "Processing": "Sun-dried in Shells, Hand-Cracked", "Grade": "Royal Jumbo Grade"}, "520 g"),

        ("p33", "v3", "VM-GROC-P33-HON", "Raw Unfiltered Forest Wildflower Honey (1kg Glass Jar)", "Grocery", "WildRoots", 849, 1199, 60,
         ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop"],
         "Harvested sustainably by tribal beekeepers in the Jim Corbett biosphere. Unheated, raw, and unfiltered to preserve live beneficial enzymes, pollen, and propolis.",
         {"Harvest": "Wild Forest Multiflora", "Processing": "Unpasteurized, Single-Filtered", "Packaging": "Lead-Free Glass Jar", "Testing": "NMR Tested 100% Pure Honey"}, "1.4 kg"),

        ("p34", "v3", "VM-GROC-P34-GHE", "Organic A2 Desi Gir Cow Cultured Bilona Ghee (1 Litre)", "Grocery", "Gir Amrit", 1799, 2299, 40,
         ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&h=600&fit=crop"],
         "Made using the ancient Vedic Bilona method from curd of grass-fed Gir cows. Golden, aromatic, granular texture packed with fat-soluble vitamins A, D, E, and K.",
         {"Source": "Grass-Fed Desi Gir Cow Whole Milk", "Method": "Vedic Curd Churning (Bilona)", "Aroma": "Nutty Granular Danedar Texture", "Certification": "FSSAI Organic Certified"}, "1.2 kg"),

        ("p35", "v3", "VM-GROC-P35-QUI", "Certified Organic Himalayan White Quinoa (1kg)", "Grocery", "GreenEarthy", 449, 650, 75,
         ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"],
         "Complete plant protein containing all 9 essential amino acids. Pre-washed to eliminate bitter saponin, high in dietary fiber, gluten-free, and pesticide-free.",
         {"Protein Content": "14g per 100g", "Processing": "Pre-washed & De-saponized", "Dietary": "100% Gluten-Free & Vegan", "Shelf Life": "18 Months"}, "1.02 kg"),

        ("p36", "v3", "VM-GROC-P36-ATT", "Traditional Stone-Ground Emmer Wheat Atta (Khapli) (5kg)", "Grocery", "Heritage Grains", 599, 799, 50,
         ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop"],
         "Low glycemic index ancient wheat flour stone-ground on slow chakki. Gentle on digestion, rich in complex dietary fiber, magnesium, and trace minerals.",
         {"Grain Type": "Ancient Emmer Wheat (Khapli)", "Milling": "Slow Cold Stone Chakki", "GI Index": "Low Glycemic Index (<55)", "Net Weight": "5 kg Air-Tight Bag"}, "5.1 kg"),

        ("p37", "v3", "VM-GROC-P37-SAF", "Pure Kashmiri Mongra Grade-A Saffron Threads (2g)", "Grocery", "Pampore Saffron", 999, 1399, 85,
         ["https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop"],
         "Export-grade Mongra saffron from Pampore, Kashmir. Characterized by deep crimson red stigmas, intense natural aroma, and high crocin content for radiant dishes and wellness teas.",
         {"Grade": "Kashmir Mongra Grade A-1", "Coloring Strength": ">240 Crocin Content", "Packaging": "Vacuum Sealed Blister Pack with Glass Vial", "Origin": "Pampore, Kashmir"}, "35 g"),

        ("p38", "v3", "VM-GROC-P38-COC", "Extra Virgin Cold-Pressed Centrifuged Coconut Oil (1 Litre)", "Grocery", "Kerala Naturals", 649, 899, 65,
         ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop"],
         "Extracted from fresh raw organic coconut milk within 3 hours of cracking through chilled centrifugal separation. Rich in Lauric Acid and MCTs without heating.",
         {"Extraction": "Chilled Centrifugal Extraction from Fresh Milk", "Lauric Acid": "50.2% High Concentration", "Appearance": "Water-Clear Liquid / Snow White Solid", "Volume": "1000 ml"}, "1.1 kg"),

        ("p39", "v3", "VM-GROC-P39-CHI", "Organic Chia Seeds & Roasted Flax Seeds Superfood Blend (500g)", "Grocery", "NutriCore", 399, 599, 90,
         ["https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&h=600&fit=crop"],
         "50:50 powerhouse mix of raw black chia seeds and lightly roasted brown flax seeds. Packed with plant-based Omega-3 alpha-linolenic acid, calcium, and gut-friendly prebiotic fiber.",
         {"Blend Ratio": "50% Organic Chia, 50% Roasted Flax", "Omega-3": "6,500mg per serving", "Usage": "Smoothies, Oatmeal, Yogurt Toppings", "Packaging": "Resealable Stand-Up Zipper Pouch"}, "520 g"),

        ("p40", "v3", "VM-GROC-P40-PEP", "Malabar Whole Black Pepper Pods (Grade TGSEB) (250g)", "Grocery", "SpiceCoast", 349, 499, 80,
         ["https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&h=600&fit=crop"],
         "Tellicherry Garbled Special Extra Bold (TGSEB) black pepper berries handpicked from Wayanad, Kerala. Unmatched citrusy-pungent bite and high piperine concentration.",
         {"Grade": "Tellicherry TGSEB (4.75mm+ Bold Berries)", "Harvest": "Wayanad, Kerala", "Processing": "Sun-dried & Hand-Garbled", "Net Weight": "250 Grams"}, "260 g"),

        ("p41", "v3", "VM-GROC-P41-TUR", "Organic Lakadong Turmeric Powder (High 7.5% Curcumin) (500g)", "Grocery", "Meghalaya Roots", 299, 450, 95,
         ["https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop"],
         "Grown naturally in the Jaintia Hills of Meghalaya. Tested at 7.5% natural curcumin content (over 3x standard commercial turmeric) with earthy aroma and deep golden amber color.",
         {"Curcumin Level": "7.5% Lab Tested", "Origin": "Lakadong, Meghalaya", "Free From": "Lead Chromate, Starch, Fillers", "Packaging": "Eco-Friendly Kraft Stand-Up Pouch"}, "520 g"),

        ("p42", "v3", "VM-GROC-P42-DAT", "Sun-Dried Premium Jumbo Medjool Dates (1kg)", "Grocery", "Oasis Delight", 1199, 1599, 40,
         ["https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&h=600&fit=crop"],
         "Plump, luscious, king-sized Medjool dates with caramel-like texture and melt-in-the-mouth sweetness. Zero added sugar, rich in potassium, copper, and natural dietary fiber.",
         {"Variety": "Jumbo Medjool Dates", "Added Sugars": "0g (100% Naturally Sweetened)", "Grade": "Premium Select", "Storage": "Store refrigerated for maximum freshness"}, "1.05 kg"),

        ("p43", "v3", "VM-GROC-P43-CAR", "Organic Green Cardamom Pods (Idukki Estate 8mm+) (200g)", "Grocery", "CardamomHills", 699, 950, 70,
         ["https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&h=600&fit=crop"],
         "Giant 8mm+ bold green cardamom pods harvested from high-elevation estates in Idukki, Kerala. Bursting with aromatic essential oils that release intoxicating fragrances.",
         {"Pod Size": "8mm+ Jumbo Extra Bold", "Color": "Natural Emerald Green (Unbleached)", "Origin": "Idukki Hills, Kerala", "Packaging": "Tin Caddy with Aroma-Lock Seal"}, "230 g"),

        ("p44", "v3", "VM-GROC-P44-SAL", "Natural Himalayan Pink Rock Salt Coarse Crystals (1kg)", "Grocery", "SaltValley", 179, 250, 110,
         ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop"],
         "Unrefined ancient salt crystals hand-mined from pristine Himalayan foothills. Contains 84 natural trace minerals including iron, magnesium, calcium, and potassium.",
         {"Mineral Composition": "Contains 84 Natural Trace Minerals", "Grain": "Coarse Crystal (Ideal for Salt Grinders)", "Additives": "Zero Anti-caking Agents or Microplastics", "Net Weight": "1 kg"}, "1.02 kg"),

        ("p45", "v3", "VM-GROC-P45-MOR", "Organic Shade-Dried Moringa Oleifera Leaf Powder (250g)", "Grocery", "GreenTree Organics", 249, 399, 85,
         ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"],
         "Superfood miracle green powder shade-dried at low temperatures to preserve chlorophyll, plant protein, iron, and antioxidant polyphenols. 100% organic single-origin harvest.",
         {"Ingredients": "100% Pure Organic Moringa Oleifera Leaves", "Processing": "Shadow-Dried & Finely Pulverized", "Usage": "1 tsp in Warm Water, Green Smoothies, or Dal", "Certifications": "USDA & India Organic"}, "270 g"),

        # ── VENDOR 4: HomeEssentials Store (p46 - p60) ──────────────────
        ("p46", "v4", "VM-HOME-P46-TAW", "Pre-Seasoned Heavy Cast Iron Dosa Tawa 11-inch", "Home & Living", "IronHeritage", 1399, 1999, 45,
         ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"],
         "Machined perfectly flat 11-inch heavy cast iron tawa pre-seasoned with 100% cold-pressed gingelly oil. Unmatched heat retention produces paper-crisp golden dosas and rotis.",
         {"Diameter": "11 Inches / 28 cm", "Weight": "2.8 kg (Heavy Base)", "Seasoning": "Triple Pre-seasoned with Natural Sesame Oil", "Compatibility": "Gas, Induction, Campfire"}, "2.8 kg"),

        ("p47", "v4", "VM-HOME-P47-TRI", "Tri-Ply Stainless Steel 3-Piece Cookware Set with Lids", "Home & Living", "ProKitchen", 4999, 7499, 20,
         ["https://images.unsplash.com/photo-1584990347449-307994463a5a?w=600&h=600&fit=crop"],
         "Engineered with 3-ply clad construction: food-grade 304 stainless steel interior, heavy aluminum heat-distributing core, and 430 magnetic steel base for rapid, hotspot-free cooking.",
         {"Set Includes": "Kadai 24cm (2.5L), Saucepan 16cm (1.5L), Frying Pan 22cm", "Core": "Full Encapsulated Aluminum Core", "Handles": "Cast Stay-Cool Riveted Handles", "Lids": "Heavy Stainless Steel with Steam Vents"}, "4.8 kg"),

        ("p48", "v4", "VM-HOME-P48-CUT", "Handcrafted Teak Wood End-Grain Butcher Block Cutting Board", "Home & Living", "WoodCrafters", 2199, 3199, 30,
         ["https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&h=600&fit=crop"],
         "Substantial 16x12 inch end-grain butcher block made from sustainably harvested plantation teak. End-grain orientation protects knife blade edges and self-heals cut marks.",
         {"Dimensions": "16\" x 12\" x 1.5\" Thick", "Wood": "100% Plantation Grown Indian Teak", "Finish": "Food-Grade Mineral Oil & Beeswax", "Features": "Carved Juice Groove & Finger Grips"}, "3.2 kg"),

        ("p49", "v4", "VM-HOME-P49-MOR", "Pure Heavy Brass Traditional Mortar & Pestle (Imam Dasta)", "Home & Living", "BrassCraft", 1499, 2199, 35,
         ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"],
         "Cast from pure solid brass weighing 1.6kg. Deep pestle chamber crushes whole spices, garlic cloves, ginger, and Ayurvedic herbs without flying out.",
         {"Material": "Solid Cast Virgin Brass (100% Lead-Free)", "Total Weight": "1.6 kg", "Height": "4.5 Inches", "Finish": "Traditional Golden Mirror Polish"}, "1.7 kg"),

        ("p50", "v4", "VM-HOME-P50-KNI", "High-Carbon Japanese Steel 8-inch Chef Knife with Sheath", "Home & Living", "KatanaEdge", 2499, 3799, 40,
         ["https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&h=600&fit=crop"],
         "Precision forged from AUS-10 high-carbon Japanese stainless steel hardened to 60±2 HRC. Razor-sharp 15-degree double bevel edge with ergonomic pakkawood handle.",
         {"Blade Steel": "AUS-10 High-Carbon Japanese Core", "Hardness": "60±2 Rockwell Hardness", "Handle": "Military-Grade Ergonomic Pakkawood", "Included": "Custom Leather Safety Sheath"}, "310 g"),

        ("p51", "v4", "VM-HOME-P51-KAL", "Traditional Soapstone (Kalchatti) Slow Cooking Pot (2.5L)", "Home & Living", "StoneKitchen", 2899, 3999, 15,
         ["https://images.unsplash.com/photo-1584990347449-307994463a5a?w=600&h=600&fit=crop"],
         "Hand-carved from natural steatite soapstone by artisans in Tamil Nadu. Retains heat for up to 4 hours after turning off the stove, enhancing flavor and nutritional value of curries.",
         {"Capacity": "2.5 Litres", "Material": "Natural Hand-Carved Steatite Soapstone", "Curing": "Pre-Treated with Turmeric & Castor Oil", "Weight": "3.8 kg"}, "3.9 kg"),

        ("p52", "v4", "VM-HOME-P52-DUT", "Enameled Heavy Cast Iron Dutch Oven (5.5 Litre)", "Home & Living", "CuisineArtisan", 4499, 6499, 18,
         ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"],
         "Heirloom quality 5.5-quart enameled cast iron Dutch oven with condensation drip rings inside the heavy lid. Impervious porcelain enamel finish requires no seasoning.",
         {"Capacity": "5.5 Litres / 5.8 Quarts", "Enamel": "Triple-Coat Chip-Resistant Vitreous Enamel", "Oven Safe": "Up to 260°C (500°F)", "Knob": "Heat-Proof Stainless Steel Knob"}, "5.6 kg"),

        ("p53", "v4", "VM-HOME-P53-JAR", "Borosilicate Glass Airtight Pantry Food Jars with Bamboo Lids (Set of 6)", "Home & Living", "PantryOrganized", 1699, 2499, 50,
         ["https://images.unsplash.com/photo-1584990347449-307994463a5a?w=600&h=600&fit=crop"],
         "Set of 6 stackable high-clarity borosilicate glass storage canisters (2x 500ml, 2x 800ml, 2x 1200ml) with airtight silicone gasket sealed natural bamboo lids.",
         {"Material": "Ultra-Clear Heat-Resistant Borosilicate Glass", "Lids": "Natural Sustainable Bamboo with Food-Grade Silicone Seal", "Set": "6 Jars Assorted Capacities", "Dishwasher Safe": "Glass Body Dishwasher Safe"}, "1.8 kg"),

        ("p54", "v4", "VM-HOME-P54-CLA", "Handcrafted Natural Clay Handi for Slow Dum Biryani Cooking", "Home & Living", "MittiGhar", 899, 1399, 35,
         ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"],
         "Unglazed porous earthenware handi shaped on potter's wheel using 100% natural clay. Alkalizes acidic foods and circulates steam evenly for authentic slow-cooked dum aroma.",
         {"Capacity": "3 Litres", "Clay Type": "100% Organic Earthenware (Lead & Cadmium Free)", "Includes": "Snug-Fitting Clay Lid", "Usage": "Gas Stove on Low-Medium Flame, Microwave"}, "2.1 kg"),

        ("p55", "v4", "VM-HOME-P55-MAG", "Magnetic Acacia Hardwood Wall-Mounted Knife Bar 16-inch", "Home & Living", "WoodCrafters", 1199, 1699, 45,
         ["https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&h=600&fit=crop"],
         "Crafted from solid warm acacia timber embedded with ultra-strong neodymium rare-earth magnets. Holds up to 8 chef knives, cleavers, and kitchen shears securely.",
         {"Length": "16 Inches (40 cm)", "Wood": "Solid Grade-A Acacia Hardwood", "Magnet Type": "Continuous Heavy-Duty Neodymium Core", "Mounting": "Includes Wall Screws & 3M Heavy VHB Tape"}, "650 g"),

        ("p56", "v4", "VM-HOME-P56-COP", "Pure Hammered Copper Water Dispenser Pot with Brass Tap (5L)", "Home & Living", "CopperAyur", 2299, 3299, 25,
         ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"],
         "Hand-hammered from 99.4% pure virgin copper sheeting. Features leak-proof chrome-plated brass spigot and tight-fitting copper lid to naturally ionize and purify drinking water (Tamra Jal).",
         {"Capacity": "5 Litres", "Purity": "99.4% Certified Pure Copper", "Spigot": "Solid Brass Quarter-Turn Dispenser Tap", "Finish": "Artisanal Hand-Hammered Dimple Finish"}, "1.6 kg"),

        ("p57", "v4", "VM-HOME-P57-BAS", "Stainless Steel Multi-Tier Vegetable & Fruit Counter Basket", "Home & Living", "KitchenSpace", 1299, 1899, 40,
         ["https://images.unsplash.com/photo-1584990347449-307994463a5a?w=600&h=600&fit=crop"],
         "Durable 2-tier wire mesh storage basket with solid natural pine wood tabletop lid. Open wire construction maximizes air circulation to prevent produce spoiling.",
         {"Material": "Powder-Coated Rust-Resistant Carbon Steel", "Top": "Removable Natural Pine Wood Cutting Board Top", "Dimensions": "32cm x 18cm x 36cm", "Load Capacity": "Up to 15 kg"}, "1.9 kg"),

        ("p58", "v4", "VM-HOME-P58-KAD", "Hard Anodized Heavy Base Deep Kadai with Stainless Steel Lid", "Home & Living", "ProKitchen", 1799, 2599, 30,
         ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"],
         "Non-reactive hard anodized surface is 2.4 times harder than steel. 4.25mm extra-thick base ensures uniform heat distribution for deep frying, sautéing, and gravies.",
         {"Capacity": "3.5 Litres / 26 cm Diameter", "Thickness": "4.25 mm Heavy Induction Base", "Surface": "Hard Anodized Non-Toxic Coating (No PFOA)", "Handles": "Stay-Cool Stainless Steel Double Rivets"}, "2.4 kg"),

        ("p59", "v4", "VM-HOME-P59-COF", "Vintage Style Hand-Cranked Heavy Brass Coffee Grinder", "Home & Living", "HeritageCraft", 1999, 2899, 22,
         ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"],
         "Traditional Turkish/South Indian filter coffee mill built with solid brass body and conical steel grinding burrs. Adjustable grind setting from espresso fine to French press coarse.",
         {"Material": "Solid Antique Brass Body", "Burrs": "Hardened Carbon Steel Conical Burrs", "Adjustment": "Stepless Manual Bottom Grind Dial", "Portability": "Foldable Crank Handle"}, "850 g"),

        ("p60", "v4", "VM-HOME-P60-MAT", "Dual-Sided Microfiber Dish Drying Mat with Silicone Trivet Set", "Home & Living", "CleanCounter", 599, 899, 60,
         ["https://images.unsplash.com/photo-1584990347449-307994463a5a?w=600&h=600&fit=crop"],
         "Extra-large 18x24 inch ultra-absorbent microfiber drying mat with thick foam core. Includes pair of heat-resistant honeycomb silicone trivet coasters.",
         {"Dimensions": "18\" x 24\" (45 cm x 60 cm)", "Absorbency": "Holds 4x Its Weight in Water", "Care": "Machine Washable", "Includes": "2x Heat-Proof Silicone Trivets"}, "380 g"),

        # ── VENDOR 5: Apex Sports & Outdoors (p61 - p75) ────────────────
        ("p61", "v5", "VM-SPOR-P61-YOG", "Apex Pro Grip High-Density Eco-TPE 6mm Yoga Mat with Alignment Lines", "Sports", "Apex Sports", 1499, 2499, 50,
         ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=600&fit=crop"],
         "Dual-textured non-slip surface with laser-engraved central posture alignment guides. Made from biodegradable certified eco-TPE, offering optimal knee cushioning and sweat resistance.",
         {"Dimensions": "72\" x 26\" x 6mm Thick", "Material": "100% Eco-Friendly Non-Toxic TPE (Latex & PVC Free)", "Grip": "Dual-Sided Reversible Anti-Skid Textures", "Includes": "Cotton Carry Strap & Breathable Mesh Bag"}, "950 g"),

        ("p62", "v5", "VM-SPOR-P62-DUM", "Solid Cast Iron Hex Dumbbell Pair (10kg Each) Rubber Coated", "Sports", "Apex Sports", 3499, 4999, 25,
         ["https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&h=600&fit=crop"],
         "Pair of 10kg anti-roll hexagonal dumbbells with premium virgin rubber heads to protect home gym floors and ergonomic knurled chrome steel handles for non-slip grip.",
         {"Weight": "2x 10 kg (20 kg Total Set)", "Head Material": "Solid Cast Iron Encased in Virgin Rubber", "Handle": "Ergonomic Knurled Solid Chrome Steel", "Shape": "Anti-Roll 6-Sided Hexagonal Heads"}, "20.2 kg"),

        ("p63", "v5", "VM-SPOR-P63-YON", "Yonex Nanoflare 800 Pro High-Flex Tournament Badminton Racket", "Sports", "Yonex", 9999, 13999, 18,
         ["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=600&fit=crop"],
         "Professional headlight tournament racquet engineered with Sonic Flare System and Torayca M40X graphite for lightning-fast drive speeds and razor-sharp maneuverability.",
         {"Frame": "HM Graphite + M40X + Super HMG", "Weight / Grip": "4U (Avg. 83g) G5", "String Tension": "Pre-strung at 26 lbs (Max 28 lbs)", "Flex": "Stiff Lightning Fast Response"}, "83 g"),

        ("p64", "v5", "VM-SPOR-P64-CYC", "Decathlon Btwin Rockrider 21-Speed Alloy Mountain Cycle", "Sports", "Btwin", 16999, 21999, 10,
         ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=600&fit=crop"],
         "Robust 6061 aluminum alloy frame with 80mm front suspension fork, Shimano Tourney 21-speed gears, and mechanical dual disc brakes for rugged trail and city commuting.",
         {"Frame": "Lightweight 6061 T6 Aluminum", "Gears": "Shimano Tourney 3x7 Speed Thumb Shifters", "Brakes": "Dual 160mm Mechanical Disc Brakes", "Wheel Size": "27.5\" Double-Wall Alloy Rims"}, "14.8 kg"),

        ("p65", "v5", "VM-SPOR-P65-SPE", "Speedo Biofuse Anti-Fog UV Shield Competitive Swimming Goggles", "Sports", "Speedo", 1399, 1999, 45,
         ["https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=600&fit=crop"],
         "Engineered with Speedo Biofuse technology featuring super-soft gel seals that adapt to facial contours. Anti-fog coated polycarbonate lenses with 100% UV400 sun protection.",
         {"Lens": "Polycarbonate with Anti-Fog & UV400 Coating", "Seal": "Ultra-Flexible Gel Biofuse Cushions", "Strap": "Dual Silicone Strap with Push-Button Adjustment Clip", "Field of View": "Wide 180-Degree Peripheral Vision"}, "120 g"),

        ("p66", "v5", "VM-SPOR-P66-STR", "Strauss Adjustable Chrome Plated Dumbbell Set (20kg with Steel Case)", "Sports", "Strauss", 3799, 5499, 20,
         ["https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&h=600&fit=crop"],
         "Complete 20kg weight plate set with 2 knurled chrome dumbbell bars, 4 spinlock safety collars, and hard-shell carry storage case. Easily configure from 2.5kg to 10kg per dumbbell.",
         {"Total Weight": "20 kg Combined Set", "Plates": "4x 2.5kg, 4x 1.25kg, 4x 0.5kg Chrome Cast Iron Plates", "Bars": "2x 14\" Solid Chrome Threaded Handles", "Collars": "4x Star Spinlock Threaded Collars"}, "20.5 kg"),

        ("p67", "v5", "VM-SPOR-P67-COS", "Cosco Premier Synthetic Leather Tournament Basketball Size 7", "Sports", "Cosco", 1199, 1799, 40,
         ["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop"],
         "FIBA certified official size 7 basketball crafted with micro-fiber composite leather. Deep channel contouring and butyl bladder provide superior indoor/outdoor bounce consistency.",
         {"Size": "Official Size 7 (29.5 Inches)", "Cover": "Composite Microfiber Deep-Pebbled Leather", "Bladder": "100% Butyl Rubber Bladder with Nylon Windings", "Play Surface": "Indoor Hardwood & Outdoor Concrete Courts"}, "610 g"),

        ("p68", "v5", "VM-SPOR-P68-PUL", "Heavy-Duty Multi-Grip Doorframe Pull-Up and Dip Bar Station", "Sports", "Apex Sports", 1899, 2799, 30,
         ["https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=600&fit=crop"],
         "No-screw leverage doorway trainer fits standard 24-36 inch doorframes. Heavy-gauge steel supports wide-grip pull-ups, chin-ups, push-ups, and hanging leg raises.",
         {"Capacity": "Tested up to 150 kg (330 lbs)", "Frame": "Reinforced High-Tensile Tubular Steel", "Grips": "High-Density Slip-Resistant Foam Padding", "Compatibility": "Standard Doorways 24\" to 36\" Wide"}, "3.4 kg"),

        ("p69", "v5", "VM-SPOR-P69-NIV", "Nivia Storm Hand-Stitched High-Tensile Football Size 5", "Sports", "Nivia", 799, 1199, 50,
         ["https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=600&fit=crop"],
         "FIFA quality standard size 5 football featuring 32 hand-stitched PU synthetic leather panels, multi-ply polyester backing, and reinforced latex bladder for aerodynamic true flight.",
         {"Size": "Official Size 5 Match Ball", "Panels": "32 Hand-Stitched Panels", "Material": "Abrasion-Resistant PU Leather", "Pressure": "8.5 - 11.5 PSI"}, "430 g"),

        ("p70", "v5", "VM-SPOR-P70-RES", "Heavy-Duty Resistance Loop Bands Set (5 Progressive Tension Tiers)", "Sports", "Apex Sports", 699, 1299, 70,
         ["https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=600&fit=crop"],
         "Set of 5 color-coded 100% natural Malaysian latex loop bands ranging from X-Light (5 lbs) to X-Heavy (40 lbs). Perfect for glute activation, physical therapy, and home pilates.",
         {"Material": "100% Snap-Resistant Natural Latex", "Set Includes": "5 Bands (5lb, 10lb, 20lb, 30lb, 40lb)", "Accessories": "Waterproof Drawstring Travel Pouch + Guide", "Length": "12 Inches x 2 Inches Wide"}, "220 g"),

        ("p71", "v5", "VM-SPOR-P71-FOA", "High-Density EVA Foam Roller for Deep Tissue Muscle Recovery 18-inch", "Sports", "Apex Sports", 899, 1499, 45,
         ["https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600&h=600&fit=crop"],
         "Grid-patterned multi-density EVA trigger point foam roller over rigid hollow core. Simulates sports massage therapist fingers to release myofascial knots and relieve back tightness.",
         {"Length": "18 Inches x 5.5 Inch Diameter", "Core": "Heavy-Duty Rigid PVC Core (Supports 200kg)", "Exterior": "Firm 3D Matrix High-Density EVA Foam", "Target": "Back, IT Bands, Quads, Hamstrings, Glutes"}, "850 g"),

        ("p72", "v5", "VM-SPOR-P72-RUC", "60L All-Weather Waterproof Trekking Rucksack with Rain Cover", "Sports", "WildCamp", 2999, 4499, 25,
         ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"],
         "Expedition grade 60-litre hiking backpack with internal ergonomic aluminum frame, breathable padded lumbar harness, dedicated sleeping bag base compartment, and integrated rain cover.",
         {"Volume": "60 Litres + 5L Expansion Collar", "Fabric": "1000D Tear-Resistant Ripstop Nylon", "Frame": "Internal Dual Ergonomic Aluminum Stays", "Features": "Trekking Pole Loops & Hydration Bladder Sleeve"}, "1.65 kg"),

        ("p73", "v5", "VM-SPOR-P73-BOX", "Professional Boxing Training Gloves 14oz with Gel Padding", "Sports", "Apex Sports", 1799, 2699, 30,
         ["https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=600&fit=crop"],
         "Constructed with premium engineered synthetic leather and multi-layered shock-absorbing EVA gel foam knuckle padding. Wide wraparound Velcro wrist strap delivers superior joint stabilization.",
         {"Weight": "14 oz (Sparring & Heavy Bag Training)", "Padding": "Triple-Density Gel Infused Foam", "Wrist Support": "360-Degree Wraparound Hook & Loop Strap", "Ventilation": "Perforated Palm Airflow Mesh"}, "680 g"),

        ("p74", "v5", "VM-SPOR-P74-SIP", "Double-Wall Vacuum Insulated Stainless Steel Sports Sipper (1000ml)", "Sports", "HydroActive", 799, 1299, 60,
         ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop"],
         "18/8 food-grade stainless steel vacuum flask keeps beverages icy cold for 24 hours or piping hot for 12 hours. Features leak-proof flip straw sports lid with integrated carry handle.",
         {"Capacity": "1000 ml / 34 oz", "Thermal Insulation": "24h Cold / 12h Hot Vacuum Core", "Steel Grade": "Food-Grade 304 (18/8) Stainless Steel", "Lid Type": "One-Click Flip Straw Spout"}, "460 g"),

        ("p75", "v5", "VM-SPOR-P75-JUM", "High-Speed Adjustable Steel Cable Jump Rope with Ball Bearings", "Sports", "Apex Sports", 499, 899, 80,
         ["https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=600&fit=crop"],
         "Precision 360-degree dual ball bearing mechanism eliminates friction for ultra-fast double unders and cardio endurance. 10ft PVC-coated braided steel wire easily resizes with thumbscrews.",
         {"Cable": "10ft (3m) PVC-Coated Braided Steel Wire", "Bearings": "Dual 360° Stainless Steel Ball Bearings", "Handles": "Textured Anti-Slip Aluminum Alloy Handles", "Adjustment": "Quick-Lock Thumbscrews"}, "190 g"),

        # ── VENDOR 6: GlowAura Beauty & Wellness (p76 - p90) ────────────
        ("p76", "v6", "VM-BEAU-P76-KUM", "Kumkumadi Miraculous Ayurvedic Night Beauty Face Oil (30ml)", "Beauty", "GlowAura", 1899, 2699, 40,
         ["https://images.unsplash.com/photo-1608248597359-46797a7e58a2?w=600&h=600&fit=crop"],
         "Formulated according to Charaka Samhita with Kashmiri saffron (Kumkuma), sandalwood, and 26 rare Himalayan herbs infused in sesame oil. Restores radiant luminous skin overnight.",
         {"Key Ingredients": "Pure Kashmiri Saffron, Sandalwood, Lotus Extracts", "Skin Type": "All Skin Types (Ideal for Pigmentation & Glow)", "Free From": "Mineral Oils, Parabens, Synthetic Fragrance", "Volume": "30 ml Amber Dropper Bottle"}, "110 g"),

        ("p77", "v6", "VM-BEAU-P77-ARG", "Cold-Pressed Moroccan Argan & Rosemary Scalp Revitalizing Oil (100ml)", "Beauty", "GlowAura", 999, 1499, 45,
         ["https://images.unsplash.com/photo-1608248597359-46797a7e58a2?w=600&h=600&fit=crop"],
         "Pure cold-pressed Moroccan Argan oil blended with concentrated Spanish Rosemary (Rosmarinus officinalis) and Bhringraj. Stimulates hair follicles, combats thinning, and conditions split ends.",
         {"Key Active": "Rosemary Extract 2% + Pure Virgin Argan Oil", "Benefit": "Strengthens Hair Roots & Reduces Hair Fall", "Application": "Pre-shampoo Scalp Massage 2-3 Times Weekly", "Volume": "100 ml"}, "220 g"),

        ("p78", "v6", "VM-BEAU-P78-ROS", "Pure Hydro-Distilled Kannauj Damask Rosewater Facial Mist (200ml)", "Beauty", "GlowAura", 549, 799, 70,
         ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop"],
         "Steam-distilled in Kannauj using traditional copper Deg-Bhapka stills from fresh morning-harvested Rosa Damascena petals. Balances skin pH and calms redness naturally.",
         {"Distillation": "Traditional Copper Deg-Bhapka Steam Distilled", "Origin": "Kannauj, Uttar Pradesh", "Alcohol Content": "0% Alcohol & Preservative Free", "Packaging": "Fine-Mist Sprayer Bottle 200ml"}, "280 g"),

        ("p79", "v6", "VM-BEAU-P79-UBT", "Kashmiri Saffron & Sandalwood Glow Radiance Ubtan Pack (150g)", "Beauty", "GlowAura", 699, 999, 50,
         ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop"],
         "Traditional wedding radiance recipe made with stone-ground chickpea flour, turmeric root, sandalwood, saffron, and sweet almond powder. Gently exfoliates dead cells and lightens tan.",
         {"Ingredients": "Besan, Sandalwood, Kashmiri Saffron, Turmeric, Almond Flour", "Texture": "Micro-Fine Powder Mask", "How to Use": "Mix with Rosewater or Raw Milk", "Net Weight": "150 Grams"}, "210 g"),

        ("p80", "v6", "VM-BEAU-P80-VIT", "Stabilized Vitamin C 20% + Ferulic Acid Glow Face Serum (30ml)", "Beauty", "GlowAura Clinical", 799, 1199, 60,
         ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop"],
         "High-potency 20% Ethyl Ascorbic Acid stabilized with 1% Ferulic Acid and Hyaluronic Acid. Fades stubborn dark spots, evens out hyperpigmentation, and stimulates collagen synthesis.",
         {"Active Formulation": "20% 3-O-Ethyl Ascorbic Acid + 1% Ferulic Acid", "Hydration": "1% Multi-Molecular Hyaluronic Acid", "Stability": "Oxidation-Proof Photostable Formula", "pH": "Balanced 3.5 - 4.0"}, "110 g"),

        ("p81", "v6", "VM-BEAU-P81-CAN", "French Lavender & Roman Chamomile Hand-Poured Aromatherapy Soy Candle", "Beauty", "GlowAura Home", 649, 950, 55,
         ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop"],
         "Handcrafted with 100% natural biodegradable soy wax, wooden crackling wick, and therapeutic pure essential oils. Burns cleanly for over 40 hours to promote restorative sleep.",
         {"Wax": "100% Natural Biodegradable Golden Soy Wax", "Wick": "Natural FSC-Certified Crackling Wood Wick", "Burn Time": "40+ Hours Clean Smoke-Free Burn", "Vessel": "Amber Glass Jar with Cork Lid"}, "360 g"),

        ("p82", "v6", "VM-BEAU-P82-SHA", "Organic Bhringraj, Shikakai & Amla Hair Growth Solid Shampoo Bar", "Beauty", "GlowAura", 399, 599, 65,
         ["https://images.unsplash.com/photo-1607006314643-2287232230ef?w=600&h=600&fit=crop"],
         "Zero-plastic concentrated shampoo bar enriched with Bhringraj, Reetha, Shikakai, and cold-pressed castor oil. pH-balanced 5.5 creates rich lather without stripping natural scalp oils.",
         {"Form": "Solid Waterless Concentrated Bar (Equivalent to 3 Bottles)", "Packaging": "100% Recyclable Aluminium Travel Tin", "Key Herbs": "Bhringraj, Shikakai, Amla, Reetha", "Net Weight": "90 Grams"}, "120 g"),

        ("p83", "v6", "VM-BEAU-P83-SCR", "Arabica Coffee & Raw Shea Butter Exfoliating Body Polish Scrub (200g)", "Beauty", "GlowAura", 599, 899, 45,
         ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop"],
         "Freshly ground Coorg Arabica coffee beans whipped with raw Ghanaian shea butter, sweet almond oil, and brown sugar. Eliminates dry flaky skin and stimulates microcirculation.",
         {"Exfoliant": "Coorg Arabica Coffee & Cane Brown Sugar", "Nourishment": "Raw Unrefined Shea Butter & Almond Oil", "Target": "Body Keratosis Pilaris & Rough Elbows/Knees", "Net Weight": "200 Grams"}, "260 g"),

        ("p84", "v6", "VM-BEAU-P84-GUA", "Hand-Carved Brazilian Rose Quartz Gua Sha & Dual Facial Roller", "Beauty", "GlowAura Rituals", 899, 1499, 50,
         ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop"],
         "Cut from 100% natural Grade-A Brazilian rose quartz stone. Boosts lymphatic drainage, sculpts jawline contours, eases facial muscle tension, and enhances serum absorption.",
         {"Material": "100% Genuine Natural Rose Quartz Crystal", "Hardware": "Silent Reinforced Rose Gold Zinc Alloy Frame", "Includes": "Double-Sided Roller + Heart Shaped Gua Sha Stone", "Packaging": "Padded Velvet Storage Box"}, "240 g"),

        ("p85", "v6", "VM-BEAU-P85-JOJ", "Pure Cold-Pressed Golden Jojoba Carrier Oil for Deep Hydration (100ml)", "Beauty", "GlowAura", 699, 999, 40,
         ["https://images.unsplash.com/photo-1608248597359-46797a7e58a2?w=600&h=600&fit=crop"],
         "100% pure unrefined golden jojoba oil. Closely mimics the skin's natural sebum, absorbing instantaneously without clogging pores. Balances oily and acne-prone complexions.",
         {"Extraction": "Single First Cold-Pressing of Jojoba Seeds", "Comedogenic Rating": "0 (Will Not Clog Pores)", "Application": "Face, Hair, Beard, Cuticles, Makeup Removal", "Volume": "100 ml Glass Dropper"}, "220 g"),

        ("p86", "v6", "VM-BEAU-P86-LIP", "Tinted Beetroot & Pomegranate Organic Lip Butter Balm (15g)", "Beauty", "GlowAura", 299, 450, 80,
         ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop"],
         "Deeply hydrating lip butter handcrafted with pure beeswax, cocoa butter, cold-pressed pomegranate seed oil, and natural ruby beetroot pigment. Softens chapped lips with sheer tint.",
         {"Flavor": "Natural Sweet Pomegranate Extract", "Pigment": "100% Plant-Derived Beetroot Extract", "Base": "Cocoa Butter, Beeswax, Cold-Pressed Almond Oil", "Free From": "Petroleum Jelly, Synthetic Dyes"}, "40 g"),

        ("p87", "v6", "VM-BEAU-P87-DEO", "Natural Cream Deodorant with Bergamot & Tea Tree (Aluminium-Free)", "Beauty", "GlowAura", 449, 650, 50,
         ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop"],
         "Aluminum-free and baking soda-free deodorant formulated with arrowroot starch, zinc ricinoleate, and organic coconut oil. Neutralizes odor-causing bacteria for 24-hour freshness.",
         {"Active Deodorizer": "Zinc Ricinoleate & Tea Tree Essential Oil", "Free From": "Aluminium Chlorohydrate, Alcohol, Parabens", "Fragrance": "Calabrian Bergamot & Cedarwood", "Net Weight": "50 Grams Glass Pot"}, "140 g"),

        ("p88", "v6", "VM-BEAU-P88-CLE", "Organic Neem & Wild Haldi Gentle Purifying Gel Cleanser (150ml)", "Beauty", "GlowAura", 499, 750, 55,
         ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop"],
         "Sulfate-free foaming gel face wash packed with fresh organic neem leaf extract, Kasturi Manjal (wild turmeric), and tea tree oil. Cleanses pores deeply without dehydrating the skin barrier.",
         {"Surfactants": "Coconut-Derived Gentle Glucosides (Sulfate-Free)", "Active Herbs": "Organic Neem, Kasturi Manjal, Aloe Vera", "pH Level": "Skin-Friendly pH 5.5", "Volume": "150 ml Pump Bottle"}, "210 g"),

        ("p89", "v6", "VM-BEAU-P89-ATT", "Traditional Indian Jasmine Sambac & Vetiver Handcrafted Attar (12ml)", "Beauty", "GlowAura Perfumery", 899, 1299, 60,
         ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=600&fit=crop"],
         "Non-alcoholic concentrated perfume oil hydro-distilled from freshly plucked Madurai Malli (Jasmine Sambac) flowers over pure sandalwood base oil. Lingers delicately for up to 14 hours.",
         {"Concentration": "100% Pure Attar Oil (No Alcohol / Dipropylene Glycol)", "Top Notes": "Madurai Jasmine Sambac Petals", "Base Notes": "Earthy Khus (Vetiver) & Mysore Sandalwood", "Volume": "12 ml Crystal Roll-On"}, "75 g"),

        ("p90", "v6", "VM-BEAU-P90-SAL", "Dead Sea Mineral Bath Salts infused with Eucalyptus & Pine (400g)", "Beauty", "GlowAura Spa", 499, 799, 50,
         ["https://images.unsplash.com/photo-1608248597359-46797a7e58a2?w=600&h=600&fit=crop"],
         "Authentic 100% pure Dead Sea crystalline salts containing 21 essential minerals including magnesium and potassium. Infused with eucalyptus and pine needle essential oils to soothe sore muscles.",
         {"Minerals": "Magnesium, Potassium, Calcium, Bromide", "Essential Oils": "Tasmanian Blue Gum Eucalyptus & Siberian Pine", "Usage": "Warm Bath Soak or Rejuvenating Foot Spa", "Net Weight": "400 Grams Resealable Jar"}, "460 g"),

        # ── VENDOR 7: CraftArtisans Studio (p91 - p105) ─────────────────
        ("p91", "v7", "VM-CRAF-P91-BOW", "Handpainted Jaipur Blue Pottery Ceramic Serving Bowl Set (Set of 3)", "Home & Living", "Jaipur Artisans", 1699, 2499, 25,
         ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=600&fit=crop"],
         "Authentic GI-tagged Jaipur blue pottery bowls handcrafted without clay using quartz powder, fullers earth, and natural gum. Decorated with Persian floral motifs by master artisans.",
         {"Material": "Authentic Quartz-Based Blue Pottery", "Set": "3 Bowls (8\", 6.5\", 5\" Diameter)", "Glaze": "Food-Safe Low-Fired Glass Glaze", "Origin": "Sanganer, Jaipur"}, "1.4 kg"),

        ("p92", "v7", "VM-CRAF-P92-ELE", "Hand-Carved Sheesham Wood Elephant Stool with Delicate Brass Inlay", "Home & Living", "Jaipur Artisans", 2899, 4199, 15,
         ["https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&h=600&fit=crop"],
         "Carved from single block of seasoned Indian Rosewood (Sheesham) into an auspicious royal elephant. Adorned with intricate hand-embedded brass wire and sheet artwork (Tarkashi).",
         {"Wood": "Seasoned Solid Sheesham Hardwood", "Art Form": "Traditional Tarkashi Brass Wire Inlay", "Dimensions": "10\" High x 12\" Wide x 10\" Deep", "Weight Capacity": "Supports up to 120 kg"}, "4.2 kg"),

        ("p93", "v7", "VM-CRAF-P93-RUG", "Handwoven Natural Jute & Wool Bohemian Geometric Kilim Rug (4x6 ft)", "Home & Living", "Rajasthan Weaves", 3999, 5999, 18,
         ["https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&h=600&fit=crop"],
         "Reversible flat-weave dhurrie rug woven on traditional pit looms using golden natural jute fiber and dyed New Zealand wool. Geometric tribal patterns complement modern boho living rooms.",
         {"Dimensions": "4 Feet x 6 Feet (120 cm x 180 cm)", "Weave": "Flat-Weave Kilim Dhurrie (Reversible)", "Fibers": "60% Natural Jute, 40% New Zealand Wool", "Fringes": "Hand-Braided Cotton Tassels"}, "3.8 kg"),

        ("p94", "v7", "VM-CRAF-P94-DHO", "Traditional Lost-Wax Cast Dhokra Bell-Metal Tribal Art Figurine", "Home & Living", "Bastar Heritage", 1899, 2799, 20,
         ["https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&h=600&fit=crop"],
         "Ancient 4,000-year-old lost-wax (Cire Perdue) casting craft practicing non-ferrous metal casting. Depicts traditional tribal musicians playing horns in rustic golden bronze finish.",
         {"Metal": "Traditional Bell Metal (Bronze & Brass Alloy)", "Technique": "Lost-Wax (Cire Perdue) Metal Casting", "Height": "9.5 Inches", "Finish": "Rustic Antiqued Patina"}, "1.2 kg"),

        ("p95", "v7", "VM-CRAF-P95-URL", "Hand-Hammered Heavy Brass Diya Urli Bowl 12-inch for Floating Flowers", "Home & Living", "Royal Brass", 1999, 2999, 30,
         ["https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=600&h=600&fit=crop"],
         "Auspicious 12-inch traditional brass urli bowl handcrafted with flared scalloped rim and hand-hammered dimple texture. Ideal for floating flower petals, rosewater, and floating candles.",
         {"Diameter": "12 Inches (30 cm)", "Material": "100% Solid Cast Brass", "Weight": "1.85 kg Heavy Base", "Finish": "Lacquered Antique Gold (Tarnish Resistant)"}, "1.9 kg"),

        ("p96", "v7", "VM-CRAF-P96-DOH", "Sanganeri Hand-Block Printed Pure Cotton Reversible Dohar Blanket", "Home & Living", "Jaipur Artisans", 1799, 2599, 25,
         ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop"],
         "Traditional 3-layered AC quilt composed of a middle layer of pure falalen flannel sandwiched between two layers of mulmul cotton, hand-block stamped with botanical floral butis.",
         {"Size": "Double Bed (90\" x 108\" / 228 x 274 cm)", "Fabric": "100% Mulmul Cotton with Soft Flannel Core", "Technique": "Hand Wood-Block Stamped by Master Craftsmen", "Care": "Machine Washable Gentle Cycle"}, "1.1 kg"),

        ("p97", "v7", "VM-CRAF-P97-COA", "Handcrafted Agra White Marble Inlay Coasters with Pietra Dura (Set of 6)", "Home & Living", "Taj Crafts", 1299, 1899, 40,
         ["https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&h=600&fit=crop"],
         "Crafted from genuine Makarana white marble inlaid with semi-precious lapis lazuli, malachite, and carnelian stones using the same Pietra Dura techniques found in the Taj Mahal.",
         {"Material": "Pure Makarana White Marble", "Inlay Gemstones": "Lapis Lazuli, Malachite, Jasper, Carnelian", "Diameter": "3.5 Inches (Set of 6 with Holder)", "Underlay": "Velvet Base Pads to Protect Tabletops"}, "850 g"),

        ("p98", "v7", "VM-CRAF-P98-PLA", "Ceramic Blue Pottery Wall Hanging Plates with Floral Mandalas (Set of 4)", "Home & Living", "Jaipur Artisans", 1899, 2799, 22,
         ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=600&fit=crop"],
         "Set of 4 decorative ceramic wall plates (two 8-inch, two 6-inch) hand-painted with cobalt blue, turquoise, and yellow floral mandala patterns. Fitted with rear brass hanging loops.",
         {"Sizes": "2x 8-inch & 2x 6-inch Diameter Plates", "Art Form": "Jaipur Glazed Quartz Blue Pottery", "Hardware": "Pre-Installed Heavy-Duty Brass Wall Hooks", "Packaging": "Custom Molded Thermocol Protective Box"}, "1.6 kg"),

        ("p99", "v7", "VM-CRAF-P99-LAN", "Hand-Etched Solid Brass Moroccan Style Hanging Lantern", "Home & Living", "Royal Brass", 1499, 2299, 30,
         ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=600&fit=crop"],
         "Hexagonal pierced brass lantern hand-etched with intricate Islamic and Rajasthani jali filigree cutouts. Casts mesmerizing kaleidoscopic shadow patterns across living room walls.",
         {"Height": "14 Inches (35 cm) + 12\" Hanging Chain", "Material": "Solid Pierced Cutwork Brass", "Illumination": "Holds Tealight, Votive Candle, or E27 LED Bulb", "Hinged Door": "Convenient Side Latch Door for Candle Access"}, "920 g"),

        ("p100", "v7", "VM-CRAF-P100-CAN", "Hand-Turned Teak Wood Architectural Pillar Candle Holders (Set of 3)", "Home & Living", "WoodCrafters", 1399, 1999, 35,
         ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop"],
         "Trio of pillar candle stands (12\", 10\", 8\") hand-turned on wood lathes from salvaged colonial teak wood beams. Distressed whitewash and exposed grain finish.",
         {"Heights": "12 Inches, 10 Inches, 8 Inches", "Wood": "100% Solid Reclaimed Teak Wood", "Candle Fit": "Accepts Standard 3\" Diameter Pillar Candles", "Top Plate": "Iron Candle Spikes to Secure Wax"}, "1.3 kg"),

        ("p101", "v7", "VM-CRAF-P101-MAS", "Traditional Sheesham Wood 9-Compartment Masala Dabba with Glass Lid", "Home & Living", "WoodCrafters", 1199, 1799, 45,
         ["https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&h=600&fit=crop"],
         "Square heirloom spice box handcrafted in solid Sheesham with 9 removable square spice cups and miniature carved wooden spice spoon. Clear glass lid displays vibrant spices.",
         {"Dimensions": "8\" x 8\" x 2.5\" Deep", "Compartments": "9 Removable Seasoned Wooden Bowls", "Included": "Handcrafted Sheesham Wooden Spoon", "Lid": "Scratch-Resistant Tempered Glass Window"}, "1.1 kg"),

        ("p102", "v7", "VM-CRAF-P102-MAC", "Handwoven Macrame 100% Organic Cotton Boho Wall Tapestry with Fringe", "Home & Living", "BohoKnot", 899, 1399, 50,
         ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"],
         "Intricate geometric macrame wall hanging knotted by hand using 4mm unbleached natural cotton cords over a natural pine wooden dowel. Adds texture to bedrooms and nursery spaces.",
         {"Dimensions": "16\" Wide x 28\" Long (from dowel to fringe)", "Cord": "100% Natural Unbleached Cotton Rope (4mm)", "Mount": "Smooth Sanded Natural Pine Dowel", "Style": "Scandinavian Minimalist Bohemian"}, "450 g"),

        ("p103", "v7", "VM-CRAF-P103-INC", "Solid Cast Bronze Dancing Peacock Aromatherapy Incense Dhoop Burner", "Home & Living", "Royal Brass", 1299, 1899, 40,
         ["https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=600&h=600&fit=crop"],
         "Traditional brass incense burner adorned with sculpted dancing peacock finial. Smoke billows poetically through pierced lattice dome lid during meditation rituals.",
         {"Material": "Solid Cast Virgin Brass with Antiqued Bronze Patina", "Height": "7 Inches", "Compatibility": "Incense Sticks (Agarbatti), Dhoop Cones, Sambrani Cups", "Base": "Insulated Base Prevents Table Heat Marks"}, "780 g"),

        ("p104", "v7", "VM-CRAF-P104-KAN", "Kantha Hand-Embroidered Cotton Cushion Covers 16x16 inch (Set of 2)", "Home & Living", "Bengal Kantha", 799, 1199, 60,
         ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"],
         "Pair of decorative cushion covers hand-stitched by village women in rural Shantiniketan using traditional Kantha running stitch on handloom cotton khadi fabric.",
         {"Dimensions": "16\" x 16\" (40 cm x 40 cm)", "Fabric": "100% Handloom Cotton Khadi", "Embroidery": "Hand-Stitched Shantiniketan Kantha Embroidery", "Closure": "Hidden Concealed YKK Zipper"}, "240 g"),

        ("p105", "v7", "VM-CRAF-P105-TER", "Hand-Fired Terracotta Hanging Planter with Heavy Macrame Jute Hanger", "Home & Living", "MittiGhar", 699, 999, 50,
         ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop"],
         "Porous unglazed terracotta bowl planter with bottom drainage hole suspended in a sturdy 4-strand hand-braided natural jute rope hanger with brass mounting ring.",
         {"Bowl Diameter": "7.5 Inches x 4\" Deep", "Hanger Length": "32 Inches Heavy-Duty Natural Jute", "Material": "Natural Kiln-Fired Terracotta Clay", "Plant Capacity": "Ideal for Trailing Pothos, String of Pearls"}, "1.2 kg"),

        # ── VENDOR 8: UrbanDen Home & Office (p106 - p120) ──────────────
        ("p106", "v8", "VM-URB-P106-MON", "Solid Natural Oak Dual-Monitor Riser Stand with Wool Felt Shelf", "Home & Living", "UrbanDen", 4499, 6499, 20,
         ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop"],
         "42-inch ergonomic desk shelf handcrafted from 100% solid American white oak with matte water-resistant polyurethane coat, heavy CNC aluminum legs, and acoustic felt catch-all tray.",
         {"Dimensions": "42\" Long x 9\" Deep x 4.5\" High", "Material": "Solid White Oak Hardwood + Cast Aluminum Legs", "Weight Capacity": "Holds up to 45 kg (Supports Dual 27\" Monitors)", "Clearance": "Keyboard Stows Underneath"}, "4.8 kg"),

        ("p107", "v8", "VM-URB-P107-DES", "Premium Vegan Leather Waterproof Non-Slip Desk Blotter Mat (90x45cm)", "Home & Living", "UrbanDen", 1299, 1899, 60,
         ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop"],
         "Dual-textured waterproof desk pad made from thick micro-textured PU leather with non-slip suede base. Smooth surface delivers flawless mouse tracking and writing comfort.",
         {"Dimensions": "90 cm x 45 cm (35.4\" x 17.7\")", "Material": "Durable Scratch-Resistant Vegan Leather", "Spill Protection": "100% Waterproof & Oil-Proof (Wipes Clean)", "Base": "Anti-Skid Faux Suede Grip"}, "510 g"),

        ("p108", "v8", "VM-URB-P108-HEA", "Handcrafted Solid Walnut Wood Headphone Stand with Cable Notch", "Home & Living", "UrbanDen", 1499, 2199, 35,
         ["https://images.unsplash.com/photo-1584679109597-c656b19974c9?w=600&h=600&fit=crop"],
         "Sculptural headphone arch carved from genuine American walnut on weighted aluminum base. Contoured top curve distributes headband pressure evenly to prevent leather denting.",
         {"Materials": "Solid American Walnut Wood + Matte Black Steel Base", "Height": "11 Inches", "Base": "Non-Slip Silicone Grip Base with Integrated Cable Trough", "Universal Fit": "Fits All Over-Ear Audiophile & Gaming Headphones"}, "620 g"),

        ("p109", "v8", "VM-URB-P109-CAB", "Under-Desk Heavy Powder-Coated Steel Cable Management Tray with Clamps", "Home & Living", "UrbanDen", 1399, 1999, 45,
         ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop"],
         "No-drill under-desk wire organizer tray clamps securely onto desks up to 2 inches thick. Heavy-gauge carbon steel mesh conceals bulky power strips, laptop chargers, and HDMI cords.",
         {"Length": "17 Inches x 6.3\" Wide x 7.5\" Deep", "Installation": "No-Drill Heavy C-Clamps (Zero Desk Damage)", "Material": "Powder-Coated Cold-Rolled Carbon Steel", "Load Capacity": "Holds up to 10 kg"}, "1.4 kg"),

        ("p110", "v8", "VM-URB-P110-FOO", "Ergonomic Teardrop High-Density Memory Foam Under-Desk Footrest", "Home & Living", "UrbanDen", 1699, 2499, 30,
         ["https://images.unsplash.com/photo-1580481077195-731b89fed04f?w=600&h=600&fit=crop"],
         "Curved teardrop ergonomic footrest cushion made with 100% resilient high-density memory foam. Reversible design rocks feet back and forth to boost lower-leg blood circulation.",
         {"Dimensions": "17.5\" x 11.5\" x 4.5\" High", "Foam": "100% High-Density Therapeutic Memory Foam", "Cover": "Removable Breathable Velvet Mesh (Machine Washable)", "Base": "Non-Slip Rubberized Grip Dots"}, "780 g"),

        ("p111", "v8", "VM-URB-P111-MAG", "CNC Aluminum Magnetic MagSafe Swivel Desktop Phone & Tablet Stand", "Home & Living", "UrbanDen", 1799, 2599, 40,
         ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop"],
         "Precision machined aerospace aluminum stand with 360-degree rotating clicking base and dual-pivot angle adjustment. Includes MagSafe magnetic array for instant one-tap floating mount.",
         {"Material": "Aerospace-Grade CNC Anodized Aluminum", "Swivel": "360-Degree Ratchet Swivel Base with Tactile Clicks", "Compatibility": "All iPhone MagSafe Models, iPads up to 11\"", "Padding": "Anti-Scratch Silicone Cushions"}, "380 g"),

        ("p112", "v8", "VM-URB-P112-LIG", "Minimalist Screenbar LED Monitor Light with Auto-Dimming Sensor", "Home & Living", "UrbanDen", 2999, 4299, 25,
         ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=600&fit=crop"],
         "Asymmetric optical design illuminates only your desktop work area with zero screen glare. Features ambient light sensor for automatic brightness adjustment and wireless touch puck.",
         {"Optical Design": "Asymmetric Glare-Free Forward Projection", "Color Temp": "2700K Warm to 6500K Cool White Stepless", "Brightness": "Up to 500 Lux (Auto-Dimming Sensor)", "Power": "USB-C Powered from Monitor or PC"}, "520 g"),

        ("p113", "v8", "VM-URB-P113-VER", "Solid Birch Plywood Vertical Dual-Laptop Docking Stand", "Home & Living", "UrbanDen", 1499, 2199, 35,
         ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop"],
         "Saves 80% desk footprint by docking two laptops vertically in clamshell mode. Laminated architectural birch ply with wool felt lining inside slots to prevent laptop aluminum scratches.",
         {"Slots": "Dual Slots (0.75\" Width each fits MacBooks & ThinkPads)", "Material": "Multi-Ply Baltic Birch with Walnut Finish", "Padding": "100% Merino Wool Felt Inlays", "Dimensions": "7.5\" x 4.5\" x 3\" High"}, "450 g"),

        ("p114", "v8", "VM-URB-P114-WIR", "Fast Qi Wireless Charging Pad Embedded in Solid Cork & Wool Base", "Home & Living", "UrbanDen", 1299, 1899, 50,
         ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop"],
         "15W Qi-certified high-speed fast charging pad encased in Portuguese organic cork with a recycled grey wool felt charging coaster. Blends organic natural aesthetics with tech charging.",
         {"Output": "15W / 10W / 7.5W Fast Charging", "Materials": "Natural Portuguese Cork + Organic Wool Felt", "Safety": "Foreign Object Detection & Overheat Protection", "Cable": "Braided 1.5m USB-C Cable Included"}, "190 g"),

        ("p115", "v8", "VM-URB-P115-DRA", "Anodized Aluminum Modular Desk Drawer Organizer Trays (Set of 5)", "Home & Living", "UrbanDen", 1699, 2399, 40,
         ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop"],
         "Set of 5 interlocking matte black anodized aluminum trays lined with soft silicone base pads. Neatly segregates pens, AirPods, hard drives, cables, and stationery in shallow drawers.",
         {"Set": "5 Modular Trays (Assorted Dimensions)", "Material": "1.5mm Gauge Anodized Aluminum Alloy", "Base Lining": "Removable Non-Slip Silicone Mats", "Color": "Stealth Space Grey"}, "750 g"),

        ("p116", "v8", "VM-URB-P116-ACO", "Acoustic Recycled PET Felt Sound-Dampening Desktop Privacy Screen", "Home & Living", "UrbanDen", 2199, 3199, 25,
         ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop"],
         "Free-standing 24-inch wide foldable acoustic privacy panel molded from 100% recycled PET felt. Absorbs 85% of ambient vocal frequencies for focused calls in shared home spaces.",
         {"Sound Absorption": "NRC Rating 0.85 (Sound Dampening)", "Material": "100% Recycled PET Felt (Odorless & Non-Toxic)", "Dimensions": "24\" Wide x 18\" High x 9mm Thick", "Features": "Pin-Friendly Surface for Notes & Photos"}, "890 g"),

        ("p117", "v8", "VM-URB-P117-LUM", "Adjustable Ergonomic Breathable Mesh Lumbar Support Pillow", "Home & Living", "UrbanDen", 1199, 1799, 45,
         ["https://images.unsplash.com/photo-1580481077195-731b89fed04f?w=600&h=600&fit=crop"],
         "Contoured orthopaedic back cushion with dual elastic adjustable straps that lock onto any office chair. Ventilated 3D spacer mesh promotes active spinal alignment during 8+ hour workdays.",
         {"Core": "Slow-Rebound Orthopaedic Memory Foam", "Cover": "3D Breathable Cool-Air Flow Mesh", "Straps": "Dual Heavy-Duty Adjustable Locking Straps", "Support": "Relieves Lower Back & Coccyx Pressure"}, "640 g"),

        ("p118", "v8", "VM-URB-P118-ARM", "Heavy-Duty Gas Spring Full-Motion Single Monitor Desk Mount Arm", "Home & Living", "UrbanDen", 2499, 3699, 30,
         ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop"],
         "Precision gas-strut monitor arm supporting displays from 17 to 34 inches (up to 9kg). 360-degree rotation, 90-degree tilt, and 180-degree swivel with integrated internal cable canals.",
         {"Screen Compatibility": "17\" to 34\" Screens (Flat & Curved)", "Weight Capacity": "2 kg to 9 kg (4.4 to 19.8 lbs)", "VESA Standards": "75x75mm and 100x100mm", "Mounting Options": "Desk Edge C-Clamp & Grommet Base"}, "2.8 kg"),

        ("p119", "v8", "VM-URB-P119-PEN", "Full-Grain Tan Leather Handcrafted Pen Holder & Catch-All Valet Tray", "Home & Living", "UrbanDen", 999, 1499, 50,
         ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop"],
         "Set of matching desktop accessories handcrafted from thick vegetable-tanned harness leather with hand-burnished edges. Pen pot holds 10+ pens; valet tray organizes keys and watches.",
         {"Material": "100% Full-Grain Vegetable-Tanned Leather", "Set Includes": "Cylindrical Pen Cup + 6\" x 6\" Snap Valet Tray", "Color": "Rich Cognac Tan", "Aging": "Develops a Rich Caramel Patina Over Time"}, "280 g"),

        ("p120", "v8", "VM-URB-P120-MUG", "Minimalist Matte Ceramic Coffee Mug 350ml with Bamboo Coaster Lid", "Home & Living", "UrbanDen", 599, 899, 65,
         ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop"],
         "Double-walled heat-retaining ceramic coffee mug finished in silky matte charcoal glaze. Includes snug-fitting bamboo lid that doubles as an insulating tabletop coaster.",
         {"Capacity": "350 ml (12 oz)", "Material": "High-Fired Food-Safe Ceramic Stoneware", "Lid": "Natural Bamboo Lid / Coaster with Silicone Gasket", "Microwave & Dishwasher": "Ceramic Cup Microwave & Dishwasher Safe"}, "410 g"),

        # ── VENDOR 9: GreenLeaf Plant Boutique (p121 - p135) ────────────
        ("p121", "v9", "VM-GREE-P121-MON", "Live Variegated Monstera Deliciosa Indoor Houseplant in Ceramic Pot", "Home & Living", "GreenLeaf", 1499, 2199, 30,
         ["https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&h=600&fit=crop"],
         "Healthy nursery-acclimatized Swiss Cheese plant featuring natural leaf fenestrations. Potted in well-draining aroid soil mix inside a premium 6-inch white ceramic planter with saucer.",
         {"Plant Height": "14 to 18 Inches (including pot)", "Light Needs": "Bright Indirect Sunlight", "Watering": "Once Every 7-10 Days (Allow Topsoil to Dry)", "Pot": "6\" Glazed White Ceramic Planter with Drainage"}, "2.4 kg"),

        ("p122", "v9", "VM-GREE-P122-FID", "Fiddle Leaf Fig (Ficus Lyrata) Live Indoor Tree in Eco-Planter", "Home & Living", "GreenLeaf", 1899, 2799, 20,
         ["https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&h=600&fit=crop"],
         "Statement indoor houseplant with large violin-shaped scalloped emerald leaves. Thrives in bright corners, air-conditioned apartments, and modern living spaces.",
         {"Height": "2 to 2.5 Feet Tall", "Light Requirements": "6+ Hours Filtered Bright Ambient Light", "Pot": "8\" Sustainable Recycled Fiber Self-Watering Planter", "Air Purifying": "Absorbs Airborne Toxins & Volatile Compounds"}, "3.6 kg"),

        ("p123", "v9", "VM-GREE-P123-POT", "Golden Pothos (Money Plant) Live Air-Purifier on Natural Coco Pole", "Home & Living", "GreenLeaf", 699, 999, 50,
         ["https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=600&fit=crop"],
         "Lush trailing Epipremnum aureum trained onto a 2ft natural coir moss pole. NASA clean air study recognized houseplant that thrives even under low light and fluorescent office bulbs.",
         {"Height": "2 Feet on Sturdy Coir Pole", "Light": "Low to Bright Indirect Light", "Difficulty": "Beginner-Friendly (Virtually Indestructible)", "Pot": "Self-Watering Injection Molded Plastic Pot"}, "1.6 kg"),

        ("p124", "v9", "VM-GREE-P124-SNA", "Sansevieria Snake Plant Low-Maintenance Live Air-Purifying Houseplant", "Home & Living", "GreenLeaf", 599, 899, 60,
         ["https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=600&h=600&fit=crop"],
         "Architectural upright Mother-in-Law's Tongue with yellow-variegated sword leaves. Produces night-time oxygen via CAM photosynthesis, making it the ideal bedroom plant.",
         {"Height": "12 to 15 Inches Tall", "Light": "Low Light Tolerant to Full Sun", "Watering Frequency": "Once Every 2-3 Weeks (Drought Tolerant)", "Pot": "5.5\" Modern Terracotta Matte Planter"}, "1.4 kg"),

        ("p125", "v9", "VM-GREE-P125-TER", "Hand-Glazed Terracotta Cylinder Planter Pot with Drainage Tray 8-inch", "Home & Living", "GreenLeaf Studio", 799, 1199, 45,
         ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop"],
         "Handmade porous natural terracotta pot finished with breathable sage-green ceramic dip-glaze. Porous clay walls allow roots to breathe and prevent fatal over-watering root rot.",
         {"Dimensions": "8\" Diameter x 7.5\" Height", "Material": "High-Fired Porous Terracotta", "Features": "Drainage Hole + Snug Matching Glazed Catch Saucer", "Glaze": "Non-Toxic Water-Based Ceramic Dip Glaze"}, "2.1 kg"),

        ("p126", "v9", "VM-GREE-P126-MIS", "Hand-Polished Solid Brass Fine Mist Plant Mister Spray Bottle (300ml)", "Home & Living", "GreenLeaf Studio", 999, 1499, 50,
         ["https://images.unsplash.com/photo-1463320726281-696a485928c7?w=600&h=600&fit=crop"],
         "Vintage Victorian style solid brass continuous misting atomizer. Generates an ultra-fine cloud of water vapor to elevate humidity for ferns, calatheas, orchids, and tropical plants.",
         {"Capacity": "300 ml (10 oz)", "Material": "100% Heavy Gauge Solid Brass", "Mechanism": "Smooth Finger-Pump Plunger Mechanism with Micro Nozzle", "Finish": "Mirror-Polished Natural Brass (Ages to Patina)"}, "290 g"),

        ("p127", "v9", "VM-GREE-P127-FER", "100% Organic Earthworm Vermicompost Soil Enrichment Fertilizer (5kg)", "Home & Living", "GreenLeaf Organic", 399, 599, 70,
         ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"],
         "Odourless black gold plant food produced by Eisenia Fetida earthworms feeding on organic cow dung and crop residue. Packed with macro NPK nutrients and beneficial mycorrhizal microbes.",
         {"NPK Balance": "High Organic Nitrogen, Phosphorus, Potassium", "Microbes": "Live Beneficial Soil Bacteria & Mycorrhizae", "Usage": "2 Handfuls per Pot Once a Month", "Net Weight": "5 kg Heavy Moisture-Proof Bag"}, "5.1 kg"),

        ("p128", "v9", "VM-GREE-P128-PRU", "Carbon Steel Professional Ergonomic Bypass Garden Pruning Shears", "Home & Living", "GreenLeaf Tools", 849, 1299, 45,
         ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop"],
         "SK-5 high carbon steel blade coated with rust-proof Teflon for clean, razor-sharp cuts through 20mm live plant branches without tearing bark. Spring-loaded with safety thumb lock.",
         {"Blade": "Japanese SK-5 High-Carbon Steel with Titanium Coat", "Cutting Capacity": "Up to 20mm (3/4\") Diameter Stems", "Handles": "Ergonomic Forged Aluminum with Non-Slip Rubber Grip", "Safety": "One-Touch Sliding Safety Lock"}, "280 g"),

        ("p129", "v9", "VM-GREE-P129-NEE", "Cold-Pressed Pure Organic Neem Oil Plant Foliar Spray (500ml)", "Home & Living", "GreenLeaf Care", 349, 499, 80,
         ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop"],
         "High Azadirachtin (1500 ppm) cold-pressed organic neem oil emulsified with natural Castile soap. Repels mealybugs, aphids, spider mites, and fungal powdery mildew safely.",
         {"Active Constituent": "Natural Azadirachtin (1500 PPM)", "Type": "Water-Soluble Ready-to-Mix Concentrate", "Safe For": "Pet-Friendly & Safe for Edible Herb Gardens", "Volume": "500 ml Concentrated Bottle"}, "550 g"),

        ("p130", "v9", "VM-GREE-P130-ARE", "Areca Palm Live Indoor Air-Cleansing Plant in Self-Watering Planter", "Home & Living", "GreenLeaf", 899, 1299, 35,
         ["https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&h=600&fit=crop"],
         "Feathery, graceful multi-stem palm that acts as an all-natural room humidifier and formaldehyde filter. Potted in sub-irrigation planter with water level gauge.",
         {"Height": "2 to 2.5 Feet", "Light": "Bright Dappled Sunlight", "Humidity": "Enjoys Average to High Humidity", "Planter": "7.5\" Sub-Irrigation Self-Watering Pot"}, "2.8 kg"),

        ("p131", "v9", "VM-GREE-P131-ZZP", "Live ZZ Plant (Zamioculcas Zamiifolia) Drought-Resistant Houseplant", "Home & Living", "GreenLeaf", 749, 1099, 40,
         ["https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=600&fit=crop"],
         "Waxy, glossy emerald foliage radiating from swollen water-storing rhizomes. Celebrated for thriving in dim basements and surviving with watering just once a month.",
         {"Height": "14 to 16 Inches", "Light Requirement": "Low Fluorescent Light to Medium Indirect", "Watering": "Once Every 3-4 Weeks (Virtually Indestructible)", "Pot": "6\" Matte Black Minimalist Pot"}, "1.9 kg"),

        ("p132", "v9", "VM-GREE-P132-SEA", "Handwoven Natural Seagrass Belly Planter Basket with Handles", "Home & Living", "GreenLeaf Studio", 699, 999, 60,
         ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop"],
         "Foldable bohemian planter basket hand-braided from natural Vietnamese seagrass. Covers plastic nursery pots seamlessly and includes waterproof inner plastic liner.",
         {"Diameter": "10 Inches Top x 12\" Belly x 11\" High", "Material": "100% Eco-Friendly Dried Natural Seagrass", "Design": "Collapsible Pop-In/Pop-Out Bowl Shape", "Liner": "Thick Clear Waterproof Plastic Liner Included"}, "350 g"),

        ("p133", "v9", "VM-GREE-P133-SUC", "Indoor Live Succulent Trio Garden in Geometric Ceramic Planters", "Home & Living", "GreenLeaf", 799, 1199, 45,
         ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop"],
         "Set of 3 assorted plump live succulents (Echeveria, Haworthia, Crassula Jade) planted in geometric white ceramic pots mounted on custom triangular bamboo display tray.",
         {"Plants Included": "Haworthia Zebra, Echeveria Elegans, Mini Jade", "Pots": "3x Glazed Geometric Ceramic Pots (3\" Width)", "Tray": "Natural Carbonized Bamboo Linking Tray", "Watering": "1-2 Tablespoons Once Every 2 Weeks"}, "950 g"),

        ("p134", "v9", "VM-GREE-P134-SEN", "3-in-1 Soil Moisture, pH and Ambient Light Sensor Plant Meter", "Home & Living", "GreenLeaf Tools", 599, 899, 50,
         ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop"],
         "Dual-probe agricultural soil tester that measures root moisture levels (1-10), soil acidity/alkalinity pH (3.5-8), and ambient sunlight lux without needing any batteries.",
         {"Functions": "Soil Moisture, Soil pH, Ambient Sunlight Lux", "Power": "No Batteries Required (Photocell & Metal Electrode)", "Probe Length": "8\" Copper and Aluminum Dual Probes", "Display": "Color-Coded Mechanical Pointer Needle"}, "120 g"),

        ("p135", "v9", "VM-GREE-P135-CAL", "Calathea Medallion Living Prayer Plant with Vivid Patterned Leaves", "Home & Living", "GreenLeaf", 799, 1199, 30,
         ["https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=600&fit=crop"],
         "Exquisite tropical foliage with feather-painted green top markings and deep burgundy velvet undersides. Leaves raise and fold upright each evening in prayer motion.",
         {"Height": "12 to 14 Inches", "Movement": "Daily Nyctinasty (Leaves Fold Upward at Night)", "Light": "Medium Indirect Light (Avoid Direct Sunlight)", "Pot": "6\" Self-Draining Terracotta Pot with Saucer"}, "1.7 kg"),

        # ── VENDOR 10: SoundMaster Pro Audio (p136 - p150) ──────────────
        ("p136", "v10", "VM-SOUN-P136-ROD", "Rode NT1 5th Generation Studio Condenser Microphone (XLR & USB)", "Electronics", "Rode", 24990, 29990, 15,
         ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop"],
         "Groundbreaking studio condenser mic featuring Dual Connect output for both analog XLR and 32-bit float digital USB-C recording. Incredibly low 4dBA self-noise floor.",
         {"Capsule": "1-inch Gold-Sputtered Large Diaphragm", "Noise Level": "Ultra-Low 4 dBA Self-Noise", "Connectivity": "Dual Connect (XLR + 32-Bit Float USB-C)", "Includes": "SM6 Shock Mount with Detachable Pop Shield"}, "1.2 kg"),

        ("p137", "v10", "VM-SOUN-P137-FOC", "Focusrite Scarlett 2i2 4th Generation 2-In/2-Out USB Audio Interface", "Electronics", "Focusrite", 17990, 22990, 20,
         ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop"],
         "Flagship dual preamps with 69dB gain range, studio-grade 192kHz/24-bit converters from Focusrite RedNet range, Auto Gain, Clip Safe, and updated Air Mode with Harmonic Drive.",
         {"Preamps": "2x 4th Gen Ultra-Low Noise Preamps (69dB Gain)", "Dynamic Range": "Massive 120 dB Dynamic Range Converters", "Features": "Auto Gain, Clip Safe, Redesigned Air Mode", "Outputs": "Balanced TRS Monitor & High-Power Headphone Out"}, "780 g"),

        ("p138", "v10", "VM-SOUN-P138-AUD", "Audio-Technica ATH-M50x Professional Studio Monitor Headphones", "Electronics", "Audio-Technica", 13490, 16990, 30,
         ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"],
         "Critically acclaimed studio reference headphones with proprietary 45mm large-aperture drivers, copper-clad aluminum wire voice coils, 90-degree swiveling earcups, and 3 detachable cables.",
         {"Drivers": "45 mm Neodymium with CCAW Voice Coils", "Frequency Response": "15 to 28,000 Hz Flat Reference Tuning", "Earcup Swivel": "90° Swiveling Earcups for One-Ear Monitoring", "Included Cables": "1.2m Coiled, 3.0m Straight, 1.2m Straight Cables"}, "285 g"),

        ("p139", "v10", "VM-SOUN-P139-KRK", "KRK Classic 5-inch Active Bi-Amp Studio Monitor Pair", "Electronics", "KRK Systems", 28990, 35990, 12,
         ["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop"],
         "Pair of nearfield active reference studio monitors with iconic yellow glass-aramid composite woofers, 1-inch soft dome tweeters, and Class A/B bi-amplifiers for honest mix translation.",
         {"Amplifier": "50W Class A/B Bi-Amp per Monitor (100W Pair)", "Woofer": "5\" Glass-Aramid Composite Cone", "Tweeter": "1\" Textile Soft Dome Tweeter", "Controls": "High and Low Frequency Acoustic Tuning Knobs"}, "11.2 kg"),

        ("p140", "v10", "VM-SOUN-P140-SHU", "Shure SM58 Cardioid Dynamic Vocal Microphone with Pneumatic Mount", "Electronics", "Shure", 9490, 11990, 35,
         ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop"],
         "The worldwide industry-standard legendary stage and vocal recording microphone. Features tailored vocal presence rise, uniform cardioid pickup pattern, and internal shock-mount system.",
         {"Type": "Dynamic (Moving Coil)", "Polar Pattern": "Uniform Cardioid Polar Pattern", "Frequency Response": "50 to 15,000 Hz Tailored for Vocals", "Build": "Steel Mesh Grille with Internal Foam Windscreen"}, "298 g"),

        ("p141", "v10", "VM-SOUN-P141-AKA", "Akai Professional MPK Mini MK3 25-Key USB MIDI Keyboard Controller", "Electronics", "Akai", 8990, 11490, 25,
         ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop"],
         "Ultra-compact 25-key USB MIDI production keyboard with Gen 2 dynamic keybed, 8 backlit velocity-sensitive MPC pads with Note Repeat, 8 assignable endless rotary knobs, and OLED screen.",
         {"Keys": "25 Velocity-Sensitive Gen 2 Dynamic Mini Keys", "Pads": "8 Bankable MPC Pads with Note Repeat & Full Level", "Knobs": "8 360-Degree Endless Assignable Encoders", "Software Bundle": "Includes MPC Beats Production DAW + Instruments"}, "750 g"),

        ("p142", "v10", "VM-SOUN-P142-FOA", "Professional Acoustic Studio Soundproofing Foam Pyramid Panels (12-Pack)", "Electronics", "SoundMaster", 2199, 3299, 40,
         ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop"],
         "Pack of 12 charcoal-black 12x12x2 inch high-density open-cell acoustic polyurethane pyramid panels. Eliminates flutter echoes, room flutter, and standing wave reflections in home studios.",
         {"Pack Size": "12 Panels (Covers 12 Square Feet)", "Dimensions": "12\" x 12\" x 2\" Thickness per Tile", "NRC Rating": "0.75 Acoustic Absorption Coefficient", "Safety": "Class B Flame Retardant Certified"}, "1.2 kg"),

        ("p143", "v10", "VM-SOUN-P143-BOO", "Heavy-Duty Metal Desktop Broadcast Boom Arm Microphone Stand", "Electronics", "SoundMaster", 2499, 3799, 35,
         ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop"],
         "All-tube internal spring broadcast studio boom arm with integrated XLR cable channels and heavy desk clamp. Silent 360-degree positioning holds microphones weighing up to 2kg securely.",
         {"Reach": "32 Inches (80 cm) Horizontal & Vertical Reach", "Max Load": "Holds heavy mics up to 2.0 kg (4.4 lbs)", "Springs": "Internal Torsion Springs (Zero Creak Noise)", "Thread Adapters": "Includes 3/8\" to 5/8\" Universal Thread Adapter"}, "1.35 kg"),

        ("p144", "v10", "VM-SOUN-P144-MOG", "Mogami Gold Studio XLR Microphone Cable with Neutrik Connectors (10ft)", "Electronics", "Mogami", 3990, 5290, 30,
         ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop"],
         "World's most revered studio reference audio cable. Wired with Mogami Neglex quad-balanced 4-conductor high-definition cable and gold-contact Neutrik black XLR connectors.",
         {"Length": "10 Feet (3.0 Meters)", "Wire": "Mogami 2534 Neglex Quad High-Density Copper", "Connectors": "Authentic Gold-Contact Neutrik XLR (M/F)", "Shielding": "100% Spiral Bare Copper Shield (Zero RF/EMI Noise)"}, "280 g"),

        ("p145", "v10", "VM-SOUN-P145-POP", "Dual-Layer Nylon Studio Microphone Pop Filter with Flexible Gooseneck", "Electronics", "SoundMaster", 699, 1099, 70,
         ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop"],
         "Double-layer mesh acoustic screen stops harsh vocal plosives ('P', 'B', 'T' popping sounds) while maintaining vocal transparency. 360-degree flexible gooseneck with screw-lock clamp.",
         {"Screen Diameter": "6 Inches (15 cm) Dual Micro-Mesh", "Gooseneck Length": "14.5 Inches Sturdy Steel Gooseneck", "Clamp": "Padded C-Clamp Fits Tube Stands up to 1.5\" Diameter", "Benefit": "Eliminates Vocal Plosives & Saliva Degradation"}, "240 g"),

        ("p146", "v10", "VM-SOUN-P146-PAD", "High-Density Acoustic Studio Monitor Isolation Speaker Pads (Pair)", "Electronics", "SoundMaster", 999, 1499, 50,
         ["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop"],
         "Two-component acoustic isolation foam wedges decouple 5\" to 8\" studio monitors from desk resonance. Reversible wedges offer 5 distinct listening tilt angles.",
         {"Dimensions": "11.8\" x 7.8\" x 1.8\" Thick per Pad", "Fit": "Pairs for 5\", 6\", 7\", 8\" Studio Monitors", "Material": "High-Density Acoustic Polyurethane (50 kg/m³)", "Tilt Angles": "Flat, +5°, +10°, -5°, -10° Elevation Angles"}, "310 g"),

        ("p147", "v10", "VM-SOUN-P147-TAS", "Tascam DR-05X Portable Stereo Handheld Digital Audio Recorder & USB Interface", "Electronics", "Tascam", 9490, 12490, 20,
         ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop"],
         "High-resolution 96kHz/24-bit stereo field recorder with dual omnidirectional condenser microphones capturing up to 125dB SPL. Functions as a 2-in/2-out USB audio interface for PC/Mac.",
         {"Microphones": "Stereo Omnidirectional Condensers (Handles 125dB SPL)", "Recording Format": "WAV (up to 24-bit/96kHz) and MP3", "Battery Life": "Up to 17.5 Hours on 2x AA Alkaline Batteries", "Media": "MicroSD/MicroSDHC/MicroSDXC (up to 128GB)"}, "165 g"),

        ("p148", "v10", "VM-SOUN-P148-BEH", "Behringer U-Phoria UM2 Audiophile 2x2 USB Audio Interface", "Electronics", "Behringer", 4490, 5990, 35,
         ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop"],
         "Entry-level USB audio interface equipped with state-of-the-art XENYX mic preamp with switchable +48V phantom power, dedicated instrument input, and zero-latency direct monitoring.",
         {"Preamp": "XENYX Mic Preamp with +48V Phantom Power", "Resolution": "48 kHz Converters for Professional Audio", "Inputs": "1x XLR/TRS Combo + 1x 1/4\" Instrument Jack", "Outputs": "RCA Stereo Monitor Out + 1/4\" Headphone Jack"}, "260 g"),

        ("p149", "v10", "VM-SOUN-P149-SHO", "Universal Heavy-Duty Spider Shock Mount for Large Diaphragm Condensers", "Electronics", "SoundMaster", 1299, 1899, 45,
         ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop"],
         "Elastic suspension spider shock mount isolating large condenser microphones (43mm to 50mm diameter) from mechanical desk vibrations, footsteps, and floor rumble.",
         {"Compatibility": "Microphone Diameter 43 mm to 50 mm", "Material": "Heavy-Duty Die-Cast Metal with Elastic Cords", "Fittings": "Standard 5/8\"-27 Thread with Angle Locking Knob", "Includes": "2x Spare Elastic Suspension Bands"}, "320 g"),

        ("p150", "v10", "VM-SOUN-P150-SHI", "Neewer Heavy-Duty Portable Microphone Sound Reflection Filter Isolation Shield", "Electronics", "Neewer", 3490, 4990, 20,
         ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop"],
         "5-panel folding acoustic isolation shield with high-density EVA sound absorbing foam front and perforated vented steel back plates. Mounts onto microphone stands to isolate vocal acoustics.",
         {"Panels": "5 Adjustable Folding Metal Panels", "Interior": "2-inch High-Density Acoustic Pyramidal Foam", "Dimensions": "Full Fold-Out 23\" Wide x 11\" High", "Mounting": "Mounts to Any Standard Microphone Floor Stand"}, "1.8 kg"),
    ]

    print(f"Verified {len(PRODUCTS_RAW)} products defined in source array.")

    # Convert PRODUCTS_RAW to complete product dictionary objects
    products = []
    for (p_id, v_id, sku, name, cat, brand, price, mrp, stock, images, desc, specs, weight) in PRODUCTS_RAW:
        disc = round(((mrp - price) / mrp) * 100)
        # Symmetrical and realistic rating between 4.3 and 4.9
        rating = 4.8 if int(p_id[1:]) % 3 == 0 else (4.9 if int(p_id[1:]) % 5 == 0 else 4.7)
        rev_count = 24 + (int(p_id[1:]) * 3) % 70

        colors = [
            {"name": "Standard Black", "hex": "#1E293B", "inStock": True},
            {"name": "Titanium Grey", "hex": "#64748B", "inStock": True}
        ]
        if cat == "Fashion":
            colors = [
                {"name": "Royal Emerald", "hex": "#065F46", "inStock": True},
                {"name": "Crimson Ruby", "hex": "#991B1B", "inStock": True},
                {"name": "Midnight Navy", "hex": "#1E3A8A", "inStock": True}
            ]
        elif cat == "Grocery":
            colors = [{"name": "Natural Fresh Harvest", "hex": "#059669", "inStock": True}]

        options = [
            {"label": "Standard Edition", "priceDelta": 0, "stock": stock}
        ]
        if cat == "Electronics" and price > 10000:
            options = [
                {"label": "Standard 256GB / Base", "priceDelta": 0, "stock": stock},
                {"label": "Pro Bundle (Extended Kit)", "priceDelta": round(price * 0.12), "stock": max(3, stock - 2)}
            ]

        # Review objects
        reviews = [
            {
                "id": f"rev-{sku}-1",
                "customerName": "Arun Mehta",
                "rating": 5,
                "title": "100% Genuine product & ultra-fast delivery!",
                "comment": f"Received {name} in original sealed box with GST tax invoice. Verified on brand website without any issues.",
                "date": "2024-09-02",
                "verified": True
            },
            {
                "id": f"rev-{sku}-2",
                "customerName": "Neha Singh",
                "rating": 5,
                "title": "Outstanding merchant packaging",
                "comment": "Multi-layered protective outer carton and priority courier tracking via BlueDart. Highly recommended seller!",
                "date": "2024-09-10",
                "verified": True
            },
            {
                "id": f"rev-{sku}-3",
                "customerName": "Siddharth Verma",
                "rating": 4,
                "title": "Excellent build quality",
                "comment": "Performance matches description exactly. Great customer support from merchant when tracking delivery.",
                "date": "2024-09-15",
                "verified": True
            }
        ]

        inquiries = [
            {
                "id": f"qa-{sku}-1",
                "customerName": "Kavita Rao",
                "date": "2024-09-01",
                "question": f"Is this {name} brand new with official manufacturer warranty across India?",
                "answer": f"Yes! Every unit dispatched from our physical warehouse is 100% brand new, factory sealed, and includes a full GST tax invoice for official warranty support.",
                "answeredAt": "2024-09-01"
            }
        ]

        prod = {
            "id": p_id,
            "sku": sku,
            "name": name,
            "category": cat,
            "brand": brand,
            "price": price,
            "mrp": mrp,
            "discountPercent": disc,
            "stock": stock,
            "quantity": stock,
            "barcode": f"890{1000000000 + int(p_id[1:]) * 642}",
            "lowStockThreshold": 5,
            "reservedStock": 0,
            "warehouseLocation": f"Shelf {chr(65 + (int(p_id[1:]) % 8))}-{int(p_id[1:]) % 18 + 1}",
            "restockLeadDays": 3,
            "vendorId": v_id,
            "status": "approved",
            "images": images,
            "description": desc,
            "condition": "Brand New (Sealed)",
            "specifications": specs,
            "shipping": {
                "weight": weight,
                "dispatchTime": "Ships within 24 hours",
                "estimatedDays": "2 - 4 days",
                "courierPartners": ["BlueDart Express", "Delhivery Surface", "DTDC Air"],
                "codAvailable": True,
                "returnWindowDays": 7
            },
            "variants": {
                "colors": colors,
                "options": options,
                "customization": {
                    "allowGiftWrap": True,
                    "allowEngraving": False,
                    "warrantyPlans": [
                        {"id": "w1", "name": "1-Year Direct Brand Warranty", "price": 0, "duration": "1 Year"},
                        {"id": "w2", "name": "2-Year Extended Protection Plan", "price": 499, "duration": "2 Years"}
                    ]
                }
            },
            "rating": rating,
            "reviewsCount": rev_count,
            "reviews": reviews,
            "inquiries": inquiries,
            "createdAt": "2024-08-15"
        }
        products.append(prod)

    print(f"Generated {len(products)} detailed product objects.")

    # Create realistic sample orders
    orders = [
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
                {"status": "Order Placed", "timestamp": "2024-08-20 10:30 AM", "location": "New Delhi", "note": "Order verified."},
                {"status": "Dispatched", "timestamp": "2024-08-21 02:15 PM", "location": "TechZone Warehouse, Delhi", "note": "Courier handed over to Delhivery."},
                {"status": "Delivered", "timestamp": "2024-08-23 04:45 PM", "location": "Dwarka, New Delhi", "note": "Doorstep OTP verified & signed."}
            ],
            "returnRequest": None,
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
                {"status": "Order Placed", "timestamp": "2024-09-08 11:15 AM", "location": "Pune", "note": "Payment authorized."},
                {"status": "Dispatched", "timestamp": "2024-09-09 03:00 PM", "location": "StyleHub Fashion Warehouse, Mumbai", "note": "In transit via BlueDart Air."}
            ],
            "returnRequest": None,
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
                {"status": "Order Placed", "timestamp": "2024-09-12 09:30 AM", "location": "New Delhi", "note": "Payment confirmed."},
                {"status": "Dispatched", "timestamp": "2024-09-12 05:00 PM", "location": "Apex Sports, Hyderabad", "note": "Courier handed over to Delhivery."},
                {"status": "Delivered", "timestamp": "2024-09-15 01:20 PM", "location": "Dwarka, New Delhi", "note": "Delivered successfully."}
            ],
            "returnRequest": None,
            "supportTickets": []
        }
    ]

    promotions = [
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
        "description": "Get 20% discount up to ₹1,500 on all electronics orders above ₹999 at TechZone!",
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
        "title": "Audio Rush ₹200 Off",
        "type": "coupon",
        "code": "AUDIO200",
        "discountType": "fixed",
        "discountValue": 200,
        "minOrderValue": 1999,
        "maxDiscount": 200,
        "usageLimit": 100,
        "usageCount": 35,
        "status": "active",
        "description": "Flat ₹200 off on premium headphones, true wireless earbuds, and speakers.",
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
    ]

    conversations = [
      {
        "id": "conv-seed-1",
        "customerId": "c1",
        "customerName": "Arun Mehta",
        "customerEmail": "arun@example.com",
        "customerAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
        "vendorId": "v1",
        "vendorName": "TechZone Electronics",
        "vendorAvatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop",
        "subject": "Samsung Galaxy S24 Ultra — Warranty & Courier Dispatch Details",
        "category": "product_inquiry",
        "relatedProduct": {
          "productId": "p1",
          "name": "Samsung Galaxy S24 Ultra",
          "price": 129999,
          "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
          "sku": "VM-ELEC-P1-SAM",
          "category": "Electronics"
        },
        "relatedOrder": None,
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
            "isRead": True
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
            "isRead": True
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
            "isRead": False
          }
        ]
      }
    ]

    # Assemble JS File String
    js_content = f"""// ─────────────────────────────────────────────
//  Vendor Hub · Multi-Vendor Physical Marketplace Seed Data
//  10 Verified Merchants · 150 Catalog SKUs (15 per vendor)
// ─────────────────────────────────────────────

export const ADMIN_CREDENTIALS = {json.dumps(ADMIN_CREDENTIALS, indent=2)};

// ── 10 Physical Merchants ────────────────────────
export const seedVendors = {json.dumps(VENDORS, indent=2)};

// ── Customers ─────────────────────────────────
export const seedCustomers = {json.dumps(CUSTOMERS, indent=2)};

// ── 150 Physical Products (15 per vendor) ──────
export const seedProducts = {json.dumps(products, indent=2)};

export const CATEGORIES = {json.dumps(CATEGORIES, indent=2)};

// ── Physical Orders & Shipments ───────────────
export const seedOrders = {json.dumps(orders, indent=2)};

// ── Marketing Promotions ───────────────────────
export const seedPromotions = {json.dumps(promotions, indent=2)};

// ── Customer-Vendor Conversations ─────────────
export const seedConversations = {json.dumps(conversations, indent=2)};
"""

    backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "seedData.js"))
    frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "data", "seedData.js"))

    with open(backend_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"[OK] Successfully wrote {backend_path} ({len(js_content)} bytes)")

    with open(frontend_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"[OK] Successfully wrote {frontend_path} ({len(js_content)} bytes)")

if __name__ == "__main__":
    build_catalog()
