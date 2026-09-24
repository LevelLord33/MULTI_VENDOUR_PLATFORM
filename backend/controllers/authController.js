import mongoose from 'mongoose';
import User from '../models/User.js';
import { ADMIN_CREDENTIALS, seedVendors, seedCustomers } from '../data/seedData.js';

// Hybrid in-memory state for resilient offline/development fallback
let memUsers = [
  {
    id: 'admin-1',
    type: 'admin',
    email: ADMIN_CREDENTIALS.email,
    password: ADMIN_CREDENTIALS.password,
    name: ADMIN_CREDENTIALS.name
  },
  ...seedVendors.map((v) => ({ ...v, type: 'vendor', name: v.businessName })),
  ...seedCustomers.map((c) => ({ ...c, type: 'customer', name: c.fullName }))
];

const isDbReady = () => mongoose.connection.readyState === 1;

// Helper to generate simple token
const generateToken = (user) => {
  return Buffer.from(
    JSON.stringify({
      id: user.id,
      role: user.type,
      name: user.fullName || user.businessName || user.name || 'User',
      email: user.email
    })
  ).toString('base64');
};

/**
 * Login handler for Customer, Vendor, and Admin
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { type, email, password } = req.body;

    if (!type || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Role type, email, and password are required.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Admin Login
    if (type === 'admin') {
      if (cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
        const adminUser = {
          id: 'admin-1',
          type: 'admin',
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name
        };
        const token = generateToken(adminUser);
        return res.json({
          success: true,
          message: 'Admin authentication successful.',
          user: adminUser,
          token
        });
      }

      if (isDbReady()) {
        const dbAdmin = await User.findOne({ type: 'admin', email: cleanEmail });
        if (dbAdmin && dbAdmin.password === password) {
          const userObj = dbAdmin.toJSON();
          return res.json({
            success: true,
            message: 'Admin authentication successful.',
            user: userObj,
            token: generateToken(userObj)
          });
        }
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.'
      });
    }

    // 2. Vendor Login
    if (type === 'vendor') {
      let vendor = null;

      if (isDbReady()) {
        try {
          vendor = await User.findOne({ type: 'vendor', email: cleanEmail });
          if (vendor) vendor = vendor.toJSON();
        } catch {
          vendor = null;
        }
      }

      if (!vendor) {
        vendor = memUsers.find((u) => u.type === 'vendor' && u.email.toLowerCase() === cleanEmail);
      }

      if (!vendor || vendor.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid vendor credentials.'
        });
      }

      return res.json({
        success: true,
        message: 'Vendor authentication successful.',
        user: vendor,
        token: generateToken(vendor)
      });
    }

    // 3. Customer Login
    if (type === 'customer') {
      let customer = null;

      if (isDbReady()) {
        try {
          customer = await User.findOne({ type: 'customer', email: cleanEmail });
          if (customer) customer = customer.toJSON();
        } catch {
          customer = null;
        }
      }

      if (!customer) {
        customer = memUsers.find((u) => u.type === 'customer' && u.email.toLowerCase() === cleanEmail);
      }

      if (!customer || customer.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      return res.json({
        success: true,
        message: 'Customer authentication successful.',
        user: customer,
        token: generateToken(customer)
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid user type specified.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Login server error.',
      error: error.message
    });
  }
};

/**
 * Register Customer
 * POST /api/auth/register-customer
 */
export const registerCustomer = async (req, res) => {
  try {
    const { email, password, fullName, mobile, address, city, state, pincode } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDbReady()) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }
    } else {
      const existingMem = memUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existingMem) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }
    }

    const newCustomerId = 'c' + Date.now();
    const newCustomerData = {
      id: newCustomerId,
      type: 'customer',
      email: cleanEmail,
      password,
      fullName,
      name: fullName,
      mobile: mobile || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=4F46E5&color=fff`,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    if (isDbReady()) {
      const newCustomer = new User(newCustomerData);
      await newCustomer.save();
    }

    memUsers.push(newCustomerData);

    return res.status(201).json({
      success: true,
      message: 'Customer registered successfully.',
      user: newCustomerData,
      token: generateToken(newCustomerData)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to register customer.',
      error: error.message
    });
  }
};

/**
 * Register Vendor
 * POST /api/auth/register-vendor
 */
export const registerVendor = async (req, res) => {
  try {
    const data = req.body;
    const { email, password, businessName, ownerName, mobile, businessAddress, location, gstin } = data;

    if (!email || !password || !businessName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and business name are required.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDbReady()) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }
    } else {
      const existingMem = memUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existingMem) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }
    }

    let defaultSlug = (businessName || 'store')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const slugCollision = memUsers.some((u) => u.storeSlug === defaultSlug);
    if (slugCollision) {
      defaultSlug = `${defaultSlug}-${Date.now().toString().slice(-4)}`;
    }

    const newVendorId = 'v' + Date.now();
    const newVendorData = {
      ...data,
      id: newVendorId,
      type: 'vendor',
      email: cleanEmail,
      password,
      businessName,
      ownerName: ownerName || businessName,
      name: businessName,
      mobile: mobile || '',
      businessAddress: businessAddress || '',
      location: location || 'India',
      gstin: gstin || '07AABCV9999Z1Z0',
      storeSlug: defaultSlug,
      tagline: `Welcome to the official ${businessName} storefront`,
      themeColor: '#4F46E5',
      themePreset: 'indigo',
      storeStatus: 'published',
      isVerified: true,
      announcement: '🎉 Fast Courier Dispatch with Verified Brand Warranty!',
      featuredProductIds: [],
      banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=300&fit=crop',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerName || businessName)}&background=4F46E5&color=fff`,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    if (isDbReady()) {
      const newVendor = new User(newVendorData);
      await newVendor.save();
    }

    memUsers.push(newVendorData);

    return res.status(201).json({
      success: true,
      message: 'Vendor onboarded successfully.',
      user: newVendorData,
      token: generateToken(newVendorData)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to register vendor.',
      error: error.message
    });
  }
};

/**
 * Get all published vendors
 * GET /api/auth/vendors
 */
export const getVendors = async (req, res) => {
  try {
    let vendors = [];
    if (isDbReady()) {
      try {
        vendors = await User.find({ type: 'vendor' });
        vendors = vendors.map((v) => (v.toJSON ? v.toJSON() : v));
      } catch {
        vendors = [];
      }
    }

    if (!vendors || vendors.length === 0) {
      vendors = memUsers.filter((u) => u.type === 'vendor');
    }

    return res.json({
      success: true,
      count: vendors.length,
      vendors
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor list.',
      error: error.message
    });
  }
};

/**
 * Get vendor profile by ID or Slug
 * GET /api/auth/vendors/:idOrSlug
 */
export const getVendorByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const clean = idOrSlug.toLowerCase().trim();

    let vendor = null;
    if (isDbReady()) {
      try {
        vendor = await User.findOne({
          type: 'vendor',
          $or: [{ id: clean }, { storeSlug: clean }]
        });
        if (vendor) vendor = vendor.toJSON();
      } catch {
        vendor = null;
      }
    }

    if (!vendor) {
      vendor = memUsers.find(
        (u) => u.type === 'vendor' && (u.id.toLowerCase() === clean || u.storeSlug?.toLowerCase() === clean)
      );
    }

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor storefront not found.'
      });
    }

    return res.json({
      success: true,
      vendor
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor.',
      error: error.message
    });
  }
};

/**
 * Check storeSlug availability
 * GET /api/auth/check-slug/:slug
 */
export const checkSlugAvailability = async (req, res) => {
  try {
    const { slug } = req.params;
    const { vendorId } = req.query;
    const clean = slug.toLowerCase().trim();

    let match = null;
    if (isDbReady()) {
      try {
        const query = { type: 'vendor', storeSlug: clean };
        if (vendorId) query.id = { $ne: vendorId };
        match = await User.findOne(query);
      } catch {
        match = null;
      }
    }

    if (!match) {
      match = memUsers.find(
        (u) => u.type === 'vendor' && u.storeSlug?.toLowerCase() === clean && u.id !== vendorId
      );
    }

    return res.json({
      success: true,
      slug: clean,
      available: !match
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to check slug availability.',
      error: error.message
    });
  }
};

/**
 * Update Customer Profile
 * PUT /api/auth/customer/:id
 */
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let updated = null;
    if (isDbReady()) {
      try {
        updated = await User.findOneAndUpdate(
          { id, type: 'customer' },
          { $set: updateData },
          { new: true }
        );
        if (updated) updated = updated.toJSON();
      } catch {
        updated = null;
      }
    }

    const memIdx = memUsers.findIndex((u) => u.id === id);
    if (memIdx > -1) {
      memUsers[memIdx] = { ...memUsers[memIdx], ...updateData };
      if (!updated) updated = memUsers[memIdx];
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: error.message
    });
  }
};

/**
 * Update Vendor Store (StoreBuilder & Profile)
 * PUT /api/auth/vendor/:id/store
 */
export const updateVendorStore = async (req, res) => {
  try {
    const { id } = req.params;
    const storeData = req.body;

    let updated = null;
    if (isDbReady()) {
      try {
        updated = await User.findOneAndUpdate(
          { id, type: 'vendor' },
          { $set: storeData },
          { new: true }
        );
        if (updated) updated = updated.toJSON();
      } catch {
        updated = null;
      }
    }

    const memIdx = memUsers.findIndex((u) => u.id === id);
    if (memIdx > -1) {
      memUsers[memIdx] = { ...memUsers[memIdx], ...storeData };
      if (!updated) updated = memUsers[memIdx];
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Storefront updated successfully.',
      vendor: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update storefront.',
      error: error.message
    });
  }
};

/**
 * Seed Users (Admin, Vendors, Customers)
 * POST /api/auth/seed
 */
export const seedAuth = async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.json({
        success: true,
        message: `Database in hybrid mode. (${memUsers.length} in-memory users active).`,
        count: memUsers.length
      });
    }

    const userCount = await User.countDocuments();
    if (userCount > 0 && req.query.force !== 'true') {
      return res.json({
        success: true,
        message: `Users already seeded (${userCount} users found).`,
        count: userCount
      });
    }

    if (req.query.force === 'true') {
      await User.deleteMany({});
    }

    // 1. Admin
    await User.create({
      id: 'admin-1',
      type: 'admin',
      email: ADMIN_CREDENTIALS.email,
      password: ADMIN_CREDENTIALS.password,
      name: ADMIN_CREDENTIALS.name
    });

    // 2. Vendors & Customers
    await User.insertMany(seedVendors.map((v) => ({ ...v, type: 'vendor', name: v.businessName })));
    await User.insertMany(seedCustomers.map((c) => ({ ...c, type: 'customer', name: c.fullName })));

    const total = await User.countDocuments();
    return res.status(201).json({
      success: true,
      message: 'Auth users successfully seeded into MongoDB Atlas.',
      total
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to seed users.',
      error: error.message
    });
  }
};
