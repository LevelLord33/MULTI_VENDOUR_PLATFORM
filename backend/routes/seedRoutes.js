import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Dispute from '../models/Dispute.js';
import Promotion from '../models/Promotion.js';
import Conversation from '../models/Conversation.js';
import {
  ADMIN_CREDENTIALS,
  seedVendors,
  seedCustomers,
  seedProducts,
  seedOrders
} from '../data/seedData.js';

// Comprehensive seed for 10 vendors and 150 realistic physical products
const router = express.Router();

const INITIAL_SEED_DISPUTES = [
  {
    disputeId: 'DSP-742918',
    orderId: 'ord1',
    customerId: 'c1',
    customerName: 'Arun Mehta',
    customerEmail: 'arun@example.com',
    vendorId: 'v1',
    vendorName: 'TechZone Electronics',
    item: {
      productId: 'p3',
      name: 'Sony WH-1000XM5 Headphones',
      price: 29990,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      sku: 'VM-ELEC-P3-SON'
    },
    category: 'Damaged product',
    description: 'The courier delivery box was severely crushed on one corner, and the headphone right ear cup hinge has visible structural cracks causing audio distortion in the right channel.',
    evidence: [
      {
        fileName: 'damaged_headphone_box.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
        fileType: 'image/jpeg',
        uploadedAt: new Date('2024-08-24T14:30:00.000Z')
      }
    ],
    status: 'Vendor Responded',
    vendorResponse: {
      explanation: 'We thoroughly inspect all audio gear prior to handing over to BlueDart. However, we acknowledge courier mishandling during transit and have initiated a replacement claim with the logistics team. We are ready to ship a brand new sealed replacement unit upon admin approval.',
      evidence: [
        {
          fileName: 'pre_dispatch_inspection_slip.jpg',
          fileUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
          fileType: 'image/jpeg',
          uploadedAt: new Date('2024-08-25T10:15:00.000Z')
        }
      ],
      respondedAt: new Date('2024-08-25T10:15:00.000Z'),
      respondedBy: 'Rajesh Kumar (TechZone Electronics)'
    },
    auditTrail: [
      {
        action: 'DISPUTE_RAISED',
        performedBy: { id: 'c1', name: 'Arun Mehta', role: 'customer' },
        timestamp: new Date('2024-08-24T14:30:00.000Z'),
        notes: 'Customer raised a dispute regarding physical product damage upon arrival.',
        previousStatus: null,
        newStatus: 'Open'
      },
      {
        action: 'UNDER_REVIEW',
        performedBy: { id: 'admin-1', name: 'Platform Admin', role: 'admin' },
        timestamp: new Date('2024-08-24T16:00:00.000Z'),
        notes: 'Admin flagged for immediate merchant response.',
        previousStatus: 'Open',
        newStatus: 'Under Review'
      },
      {
        action: 'VENDOR_RESPONDED',
        performedBy: { id: 'v1', name: 'TechZone Electronics', role: 'vendor' },
        timestamp: new Date('2024-08-25T10:15:00.000Z'),
        notes: 'Merchant agreed to fulfill replacement and submitted inspection proof.',
        previousStatus: 'Under Review',
        newStatus: 'Vendor Responded'
      }
    ]
  },
  {
    disputeId: 'DSP-529104',
    orderId: 'ord2',
    customerId: 'c1',
    customerName: 'Arun Mehta',
    customerEmail: 'arun@example.com',
    vendorId: 'v2',
    vendorName: 'StyleHub Fashion',
    item: {
      productId: 'p11',
      name: "Men's Slim Fit Linen Shirt",
      price: 2499,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop',
      sku: 'VM-FASH-P11-ZAR'
    },
    category: 'Wrong product',
    description: 'Ordered Navy Blue Size L shirts, but the vendor package contained Size S in White color.',
    evidence: [
      {
        fileName: 'wrong_tag_received.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=400&fit=crop',
        fileType: 'image/jpeg',
        uploadedAt: new Date('2024-09-09T11:20:00.000Z')
      }
    ],
    status: 'Open',
    auditTrail: [
      {
        action: 'DISPUTE_RAISED',
        performedBy: { id: 'c1', name: 'Arun Mehta', role: 'customer' },
        timestamp: new Date('2024-09-09T11:20:00.000Z'),
        notes: 'Customer submitted dispute: Wrong size & color delivered.',
        previousStatus: null,
        newStatus: 'Open'
      }
    ]
  }
];

export const autoSeedDatabaseIfEmpty = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Populating initial physical product catalog into database...');
      await Product.insertMany(seedProducts);
      console.log(`✅ Seeded ${seedProducts.length} physical products.`);
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Populating initial users (admin, vendors, customers) into database...');
      // Admin
      await User.create({
        id: 'admin-1',
        type: 'admin',
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password,
        name: ADMIN_CREDENTIALS.name
      });
      // Vendors
      await User.insertMany(seedVendors.map((v) => ({ ...v, type: 'vendor', name: v.businessName })));
      // Customers
      await User.insertMany(seedCustomers.map((c) => ({ ...c, type: 'customer', name: c.fullName })));
      console.log('✅ Seeded admin, vendors, and customers.');
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('🌱 Populating initial physical orders into database...');
      const ordersToInsert = seedOrders.map((o) => ({ ...o, subtotal: o.subtotal || o.total || 0 }));
      await Order.insertMany(ordersToInsert);
      console.log(`✅ Seeded ${ordersToInsert.length} orders.`);
    }

    const disputeCount = await Dispute.countDocuments();
    if (disputeCount === 0) {
      console.log('🌱 Populating initial disputes into database...');
      await Dispute.insertMany(INITIAL_SEED_DISPUTES);
      console.log(`✅ Seeded ${INITIAL_SEED_DISPUTES.length} disputes.`);
    }

    const promoCount = await Promotion.countDocuments();
    if (promoCount === 0) {
      console.log('🌱 Populating initial marketing promotions into database...');
      await Promotion.insertMany(INITIAL_SEED_PROMOTIONS);
      console.log(`✅ Seeded ${INITIAL_SEED_PROMOTIONS.length} marketing promotions & coupons.`);
    }

    const convCount = await Conversation.countDocuments();
    if (convCount === 0) {
      console.log('🌱 Populating initial customer-vendor conversations into database...');
      await Conversation.insertMany(INITIAL_SEED_CONVERSATIONS);
      console.log(`✅ Seeded ${INITIAL_SEED_CONVERSATIONS.length} customer-vendor conversations.`);
    }
  } catch (err) {
    console.warn('⚠️ Auto-seeding notice:', err.message);
  }
};

export const INITIAL_SEED_PROMOTIONS = [
  {
    id: 'promo-tech20',
    vendorId: 'v1',
    title: 'TechZone Grand Electronics Discount',
    type: 'coupon',
    code: 'TECH20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 999,
    maxDiscount: 1500,
    usageLimit: 200,
    usageCount: 14,
    status: 'active',
    description: 'Get 20% discount up to ₹1,500 on all electronics orders above ₹999 at TechZone!',
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  },
  {
    id: 'promo-style15',
    vendorId: 'v2',
    title: 'StyleHub Trendsetter Voucher',
    type: 'coupon',
    code: 'STYLE15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 1499,
    maxDiscount: 800,
    usageLimit: 150,
    usageCount: 28,
    status: 'active',
    description: 'Save 15% on the latest apparel and footwear collections at StyleHub.',
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  },
  {
    id: 'promo-audio200',
    vendorId: 'v1',
    title: 'Audio Rush ₹200 Off',
    type: 'coupon',
    code: 'AUDIO200',
    discountType: 'fixed',
    discountValue: 200,
    minOrderValue: 1999,
    maxDiscount: 200,
    usageLimit: 100,
    usageCount: 35,
    status: 'active',
    description: 'Flat ₹200 off on premium headphones, true wireless earbuds, and speakers.',
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  },
  {
    id: 'promo-banner-tech',
    vendorId: 'v1',
    title: 'Mega Monsoon Electronics Fiesta',
    subtitle: 'Up to 40% Off Genuine Audio, Smartwatches & Gear + Direct Brand Warranty',
    type: 'promotional_banner',
    bannerUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=350&fit=crop',
    bannerPlacement: 'store_top',
    bannerLink: '/store/techzone',
    buttonText: 'Claim Tech Deals',
    badgeText: 'VERIFIED BRAND WARRANTY',
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  },
  {
    id: 'promo-campaign-festive',
    vendorId: 'v1',
    title: 'Festive Soundwave Clearance',
    type: 'discount_campaign',
    discountType: 'percentage',
    discountValue: 25,
    applicableCategory: 'Electronics',
    status: 'active',
    badgeText: 'FESTIVE SALE',
    description: 'Direct festival markdowns applied automatically across top earwear and mobile accessories.',
    startDate: '2026-09-01',
    endDate: '2026-10-31'
  }
];

export const INITIAL_SEED_CONVERSATIONS = [
  {
    id: 'conv-seed-1',
    customerId: 'c1',
    customerName: 'Arun Mehta',
    customerEmail: 'arun@example.com',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
    vendorId: 'v1',
    vendorName: 'TechZone Electronics',
    vendorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop',
    subject: 'Samsung Galaxy S24 Ultra — Warranty & Courier Dispatch Details',
    category: 'product_inquiry',
    relatedProduct: {
      productId: 'p1',
      name: 'Samsung Galaxy S24 Ultra',
      price: 129999,
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop',
      sku: 'VM-ELEC-P1-SAM',
      category: 'Electronics'
    },
    relatedOrder: null,
    status: 'active',
    unreadVendor: 1,
    unreadCustomer: 0,
    lastMessage: 'Does the phone arrive sealed in original packaging with tax invoice for warranty registration?',
    lastMessageSender: 'customer',
    lastMessageAt: '2026-09-22T08:30:00.000Z',
    messages: [
      {
        id: 'msg-seed-101',
        senderId: 'c1',
        senderType: 'customer',
        senderName: 'Arun Mehta',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
        text: 'Hello Rajesh! I am interested in purchasing the Titanium Silver variant of the S24 Ultra.',
        attachments: [],
        createdAt: '2026-09-22T08:15:00.000Z',
        isRead: true
      },
      {
        id: 'msg-seed-102',
        senderId: 'v1',
        senderType: 'vendor',
        senderName: 'Rajesh Kumar (TechZone)',
        senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop',
        text: 'Hello Arun! Yes, we have authentic physical units physically stocked in our Delhi warehouse ready for priority courier dispatch today via BlueDart Air.',
        attachments: [],
        createdAt: '2026-09-22T08:22:00.000Z',
        isRead: true
      },
      {
        id: 'msg-seed-103',
        senderId: 'c1',
        senderType: 'customer',
        senderName: 'Arun Mehta',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
        text: 'Does the phone arrive sealed in original packaging with tax invoice for warranty registration?',
        attachments: [],
        createdAt: '2026-09-22T08:30:00.000Z',
        isRead: false
      }
    ]
  },
  {
    id: 'conv-seed-2',
    customerId: 'c1',
    customerName: 'Arun Mehta',
    customerEmail: 'arun@example.com',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
    vendorId: 'v1',
    vendorName: 'TechZone Electronics',
    vendorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop',
    subject: 'Order #ord1 — Doorstep Verification Assistance',
    category: 'order_inquiry',
    relatedOrder: {
      orderId: 'ord1',
      trackingNumber: 'DEL-8492019',
      courierPartner: 'Delhivery Surface Express',
      status: 'Dispatched',
      total: 31988,
      orderDate: '2024-08-20'
    },
    relatedProduct: {
      productId: 'p3',
      name: 'Sony WH-1000XM5 Headphones',
      price: 29990,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      sku: 'VM-ELEC-P3-SON'
    },
    status: 'resolved',
    unreadVendor: 0,
    unreadCustomer: 0,
    lastMessage: 'Thank you! The package arrived safely and the 4-digit doorstep delivery OTP verified without any issues.',
    lastMessageSender: 'customer',
    lastMessageAt: '2026-09-21T16:00:00.000Z',
    messages: [
      {
        id: 'msg-seed-201',
        senderId: 'c1',
        senderType: 'customer',
        senderName: 'Arun Mehta',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
        text: 'Hi Rajesh, my order tracking shows In Transit. Will the courier delivery executive contact me before arrival?',
        attachments: [],
        createdAt: '2026-09-21T14:10:00.000Z',
        isRead: true
      },
      {
        id: 'msg-seed-202',
        senderId: 'v1',
        senderType: 'vendor',
        senderName: 'Rajesh Kumar (TechZone)',
        senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop',
        text: 'Yes Arun, Delhivery sends an SMS with the executive contact, and remember to share your 4-digit Delivery OTP only after inspecting the package outer carton.',
        attachments: [],
        createdAt: '2026-09-21T14:35:00.000Z',
        isRead: true
      },
      {
        id: 'msg-seed-203',
        senderId: 'c1',
        senderType: 'customer',
        senderName: 'Arun Mehta',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
        text: 'Thank you! The package arrived safely and the 4-digit doorstep delivery OTP verified without any issues.',
        attachments: [],
        createdAt: '2026-09-21T16:00:00.000Z',
        isRead: true
      }
    ]
  },
  {
    id: 'conv-seed-3',
    customerId: 'c2',
    customerName: 'Neha Singh',
    customerEmail: 'neha@example.com',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    vendorId: 'v2',
    vendorName: 'StyleHub Fashion',
    vendorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop',
    subject: 'Sizing & Fabric Advice — Pure Silk Banarasi Saree',
    category: 'product_inquiry',
    relatedProduct: {
      productId: 'p5',
      name: 'Handcrafted Pure Silk Banarasi Saree',
      price: 18999,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop',
      sku: 'VM-FASH-P5-SAR',
      category: 'Fashion'
    },
    relatedOrder: null,
    status: 'active',
    unreadVendor: 1,
    unreadCustomer: 0,
    lastMessage: 'Does this handcrafted saree include an unstitched matching blouse piece inside the box?',
    lastMessageSender: 'customer',
    lastMessageAt: '2026-09-22T09:45:00.000Z',
    messages: [
      {
        id: 'msg-seed-301',
        senderId: 'c2',
        senderType: 'customer',
        senderName: 'Neha Singh',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
        text: 'Hi Priya, I am planning to buy this for an upcoming wedding. Does this handcrafted saree include an unstitched matching blouse piece inside the box?',
        attachments: [],
        createdAt: '2026-09-22T09:45:00.000Z',
        isRead: false
      }
    ]
  }
];

/**
 * Manually trigger full seed
 * POST /api/seed
 */
router.post('/', async (req, res) => {
  try {
    const force = req.query.force === 'true';

    if (force) {
      await Promise.all([
        User.deleteMany({}),
        Product.deleteMany({}),
        Order.deleteMany({}),
        Dispute.deleteMany({}),
        Promotion.deleteMany({}),
        Conversation.deleteMany({})
      ]);
    }

    await autoSeedDatabaseIfEmpty();

    const [userCount, productCount, orderCount, disputeCount, promoCount, convCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Dispute.countDocuments(),
      Promotion.countDocuments(),
      Conversation.countDocuments()
    ]);

    return res.status(201).json({
      success: true,
      message: 'Database successfully seeded with comprehensive marketplace data.',
      stats: {
        users: userCount,
        products: productCount,
        orders: orderCount,
        disputes: disputeCount,
        promotions: promoCount,
        conversations: convCount
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Database seeding failed.',
      error: error.message
    });
  }
});

export default router;
