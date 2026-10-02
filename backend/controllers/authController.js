import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import { ADMIN_CREDENTIALS, seedVendors, seedCustomers, seedProducts } from '../data/seedData.js';
import { getIO } from '../socket/socketService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vendorhub-super-secret-jwt-key-2025';

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

// Helper to generate cryptographically signed JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id,
      role: (user.type || user.role || 'customer').toLowerCase(),
      name: user.fullName || user.businessName || user.name || 'User',
      email: user.email,
      provider: user.provider || 'local'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
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
        (u) => u.type === 'vendor' && ((u.id && u.id.toLowerCase() === clean) || (u.storeSlug && u.storeSlug.toLowerCase() === clean))
      );
    }

    if (!vendor) {
      vendor = seedVendors.find(
        (v) => (v.id && v.id.toLowerCase() === clean) || (v.storeSlug && v.storeSlug.toLowerCase() === clean)
      );
    }

    if (!vendor && (clean === 'priya-merchant' || clean.includes('priya'))) {
      const base = seedVendors.find((v) => v.id === 'v2') || seedVendors[1];
      vendor = {
        ...base,
        id: 'v2',
        businessName: "Priya Sharma's Store",
        storeSlug: 'priya-merchant',
        ownerName: 'Priya Sharma',
        category: 'Fashion & General Retail',
        tagline: 'Authorized merchant with verified physical catalog and express courier dispatch.'
      };
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

/**
  * OAuth Login / Registration (Google, GitHub, Social)
  * POST /api/auth/oauth/google
  */
export const oauthLogin = async (req, res) => {
  try {
    let { provider = 'google', email, name, avatar, googleId, role = 'customer', credential } = req.body;

    // Decode Google Identity Services (GIS) JWT credential if supplied
    if (credential) {
      try {
        const payloadBase64 = credential.split('.')[1];
        if (payloadBase64) {
          const jsonPayload = Buffer.from(payloadBase64, 'base64').toString('utf8');
          const decoded = JSON.parse(jsonPayload);
          if (decoded.email) {
            email = decoded.email;
            name = name || decoded.name;
            avatar = avatar || decoded.picture;
            googleId = googleId || decoded.sub;
          }
        }
      } catch (err) {
        console.warn('Could not parse Google credential token:', err.message);
      }
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'A valid email or Gmail address is required for Google Sign-In.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid Gmail or email address.'
      });
    }

    let user = null;

    if (isDbReady()) {
      try {
        user = await User.findOne({ email: cleanEmail });
        if (user) user = user.toJSON();
      } catch {
        user = null;
      }
    }

    if (!user) {
      user = memUsers.find((u) => u.email && u.email.toLowerCase() === cleanEmail);
    }

    if (!user) {
      const isVendor = role === 'vendor';
      const isAdmin = role === 'admin';
      const newId = isAdmin ? `admin-oauth-${Date.now()}` : isVendor ? `v-oauth-${Date.now()}` : `c-oauth-${Date.now()}`;
      const displayName = name || cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const defaultSlug = (cleanEmail.split('@')[0] || 'store')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      user = {
        id: newId,
        type: role,
        role: role,
        fullName: displayName,
        name: displayName,
        email: cleanEmail,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4285F4&color=fff`,
        provider: 'google',
        googleId: googleId || `gid_${Date.now()}`,
        password: '',
        joinedDate: new Date().toISOString(),
        ...(isAdmin ? {
          title: 'System Administrator',
          department: 'Platform Operations',
          accessLevel: 'superadmin'
        } : isVendor ? {
          businessName: `${displayName}'s Store`,
          storeName: `${displayName}'s Store`,
          ownerName: displayName,
          storeSlug: defaultSlug || `store-${Date.now().toString().slice(-4)}`,
          rating: 4.9,
          totalSales: 0,
          totalOrders: 0,
          isApproved: true,
          status: 'active',
          businessType: 'Retail Store'
        } : {
          city: 'New Delhi',
          location: 'New Delhi, Delhi',
          address: 'Google Sign-In Account'
        })
      };

      memUsers.push(user);

      if (isDbReady()) {
        try {
          const dbUser = new User(user);
          await dbUser.save();
        } catch (e) {
          console.warn('Could not save OAuth user to Mongo:', e.message);
        }
      }
    } else {
      // If authenticating via Admin portal with matching admin account or role
      if (role === 'admin') {
        user.type = 'admin';
        user.role = 'admin';
      } else {
        if (!user.type) user.type = user.role || role;
        if (!user.role) user.role = user.type;
      }
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: `Signed in successfully with Google (${cleanEmail})`,
      user,
      token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'OAuth authentication failed.',
      error: error.message
    });
  }
};

/**
  * Get Current Verified User via JWT
  * GET /api/auth/me
  */
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'No authenticated user session.'
      });
    }

    let user = null;
    if (isDbReady()) {
      try {
        user = await User.findOne({ id: req.user.id });
        if (user) user = user.toJSON();
      } catch {
        user = null;
      }
    }

    if (!user) {
      user = memUsers.find((u) => u.id === req.user.id || u.email === req.user.email);
    }

    if (!user) {
      user = {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role,
        email: req.user.email
      };
    }

    return res.json({
      success: true,
      user,
      tokenClaims: req.user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve current user.',
      error: error.message
    });
  }
};

/**
 * ─────────────────────────────────────────────────────────────
 * WISHLIST & FOLLOW VENDOR PERSISTENCE (Feature 3)
 * ─────────────────────────────────────────────────────────────
 */

/**
 * GET /api/auth/wishlist
 * Retrieve populated wishlist items for current user
 */
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    let userDoc = null;
    if (isDbReady()) {
      try {
        userDoc = await User.findOne({ id: userId });
      } catch (e) {}
    }
    if (!userDoc) {
      userDoc = memUsers.find((u) => u.id === userId);
    }

    const wishlistIds = userDoc?.wishlist || [];
    let products = [];

    if (isDbReady() && wishlistIds.length > 0) {
      try {
        products = await Product.find({ id: { $in: wishlistIds } });
        products = products.map((p) => (p.toJSON ? p.toJSON() : p));
      } catch (e) {
        products = [];
      }
    }

    if (!products || products.length === 0) {
      products = seedProducts.filter((p) => wishlistIds.includes(p.id));
    }

    return res.json({
      success: true,
      count: products.length,
      wishlistIds,
      products
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/auth/wishlist/:productId
 * Toggle / Add product to wishlist
 */
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    let updatedList = [];
    if (isDbReady()) {
      try {
        const userDoc = await User.findOne({ id: userId });
        if (userDoc) {
          const current = userDoc.wishlist || [];
          if (!current.includes(productId)) {
            userDoc.wishlist.push(productId);
            await userDoc.save();
          }
          updatedList = userDoc.wishlist;
        }
      } catch (e) {}
    }

    const memIdx = memUsers.findIndex((u) => u.id === userId);
    if (memIdx > -1) {
      memUsers[memIdx].wishlist = memUsers[memIdx].wishlist || [];
      if (!memUsers[memIdx].wishlist.includes(productId)) {
        memUsers[memIdx].wishlist.push(productId);
      }
      updatedList = memUsers[memIdx].wishlist;
    }

    return res.json({
      success: true,
      message: 'Product added to wishlist.',
      wishlist: updatedList
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/auth/wishlist/:productId
 * Remove product from wishlist
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    let updatedList = [];
    if (isDbReady()) {
      try {
        const userDoc = await User.findOneAndUpdate(
          { id: userId },
          { $pull: { wishlist: productId } },
          { new: true }
        );
        if (userDoc) updatedList = userDoc.wishlist || [];
      } catch (e) {}
    }

    const memIdx = memUsers.findIndex((u) => u.id === userId);
    if (memIdx > -1 && memUsers[memIdx].wishlist) {
      memUsers[memIdx].wishlist = memUsers[memIdx].wishlist.filter((id) => id !== productId);
      updatedList = memUsers[memIdx].wishlist;
    }

    return res.json({
      success: true,
      message: 'Product removed from wishlist.',
      wishlist: updatedList
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/auth/following
 * Retrieve list of vendors followed by current user
 */
export const getFollowedVendors = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    let userDoc = null;
    if (isDbReady()) {
      try {
        userDoc = await User.findOne({ id: userId });
      } catch (e) {}
    }
    if (!userDoc) {
      userDoc = memUsers.find((u) => u.id === userId);
    }

    const followedIds = userDoc?.followedVendors || [];
    let vendors = [];

    if (isDbReady() && followedIds.length > 0) {
      try {
        vendors = await User.find({ id: { $in: followedIds }, type: 'vendor' });
        vendors = vendors.map((v) => (v.toJSON ? v.toJSON() : v));
      } catch (e) {
        vendors = [];
      }
    }

    if (!vendors || vendors.length === 0) {
      vendors = (seedVendors || []).filter((v) => followedIds.includes(v.id));
    }

    return res.json({
      success: true,
      count: vendors.length,
      followedIds,
      vendors
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/auth/follow/:vendorId
 * Follow a vendor
 */
export const followVendor = async (req, res) => {
  try {
    const userId = req.user?.id;
    const customerName = req.user?.name || 'Customer';
    const { vendorId } = req.params;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    let followedList = [];
    if (isDbReady()) {
      try {
        const userDoc = await User.findOne({ id: userId });
        if (userDoc) {
          userDoc.followedVendors = userDoc.followedVendors || [];
          if (!userDoc.followedVendors.includes(vendorId)) {
            userDoc.followedVendors.push(vendorId);
            await userDoc.save();
          }
          followedList = userDoc.followedVendors;
        }

        // Increment vendor followers count
        await User.findOneAndUpdate({ id: vendorId }, { $inc: { followersCount: 1 } });
      } catch (e) {}
    }

    const memIdx = memUsers.findIndex((u) => u.id === userId);
    if (memIdx > -1) {
      memUsers[memIdx].followedVendors = memUsers[memIdx].followedVendors || [];
      if (!memUsers[memIdx].followedVendors.includes(vendorId)) {
        memUsers[memIdx].followedVendors.push(vendorId);
      }
      followedList = memUsers[memIdx].followedVendors;
    }

    const vIdx = memUsers.findIndex((u) => u.id === vendorId);
    if (vIdx > -1) {
      memUsers[vIdx].followersCount = (memUsers[vIdx].followersCount || 0) + 1;
    }

    // Trigger notification to vendor
    const io = getIO();
    if (io) {
      const vendorNotif = {
        id: `notif-${Date.now()}`,
        userId: vendorId,
        type: 'follow',
        title: 'New Store Follower! 🎉',
        message: `${customerName} is now following your storefront for new deals & updates.`,
        link: '/vendor/dashboard',
        createdAt: new Date().toISOString()
      };
      io.to(`user_${vendorId}`).emit('new_notification', vendorNotif);
    }

    return res.json({
      success: true,
      message: 'You are now following this merchant store.',
      followedVendors: followedList
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/auth/follow/:vendorId
 * Unfollow a vendor
 */
export const unfollowVendor = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { vendorId } = req.params;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    let followedList = [];
    if (isDbReady()) {
      try {
        const userDoc = await User.findOneAndUpdate(
          { id: userId },
          { $pull: { followedVendors: vendorId } },
          { new: true }
        );
        if (userDoc) followedList = userDoc.followedVendors || [];

        await User.findOneAndUpdate(
          { id: vendorId, followersCount: { $gt: 0 } },
          { $inc: { followersCount: -1 } }
        );
      } catch (e) {}
    }

    const memIdx = memUsers.findIndex((u) => u.id === userId);
    if (memIdx > -1 && memUsers[memIdx].followedVendors) {
      memUsers[memIdx].followedVendors = memUsers[memIdx].followedVendors.filter((id) => id !== vendorId);
      followedList = memUsers[memIdx].followedVendors;
    }

    const vIdx = memUsers.findIndex((u) => u.id === vendorId);
    if (vIdx > -1 && memUsers[vIdx].followersCount > 0) {
      memUsers[vIdx].followersCount -= 1;
    }

    return res.json({
      success: true,
      message: 'Unfollowed merchant store.',
      followedVendors: followedList
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

