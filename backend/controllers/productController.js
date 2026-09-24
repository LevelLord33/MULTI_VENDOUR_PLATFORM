import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { seedProducts, seedVendors } from '../data/seedData.js';
import { rankProductsFairly } from '../utils/fairRanking.js';

// Hybrid in-memory catalog for offline / development resilience
let memProducts = [...seedProducts];

const isDbReady = () => mongoose.connection.readyState === 1;

/**
 * 1. Get all products with rich filtering, search, and sorting
 * GET /api/products
 */
export const getProducts = async (req, res) => {
  try {
    const { category, search, status, vendorId, inStock, sort } = req.query;

    let products = [];

    if (isDbReady()) {
      try {
        const query = {};

        if (category && category !== 'All') {
          query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        if (status && status !== 'all') {
          query.status = status.toLowerCase();
        }

        if (vendorId) {
          query.vendorId = vendorId;
        }

        if (inStock === 'true') {
          query.$or = [{ stock: { $gt: 0 } }, { quantity: { $gt: 0 } }];
        }

        if (search) {
          const searchRegex = new RegExp(search, 'i');
          query.$or = [
            { name: searchRegex },
            { brand: searchRegex },
            { sku: searchRegex },
            { description: searchRegex },
            { category: searchRegex }
          ];
        }

        let sortOptions = { createdAt: -1 };
        if (sort === 'price_asc') sortOptions = { price: 1 };
        else if (sort === 'price_desc') sortOptions = { price: -1 };
        else if (sort === 'rating_desc') sortOptions = { rating: -1 };

        products = await Product.find(query).sort(sortOptions);
        products = products.map((p) => (p.toJSON ? p.toJSON() : p));

        // Apply Fair Exposure & Smart Discovery ranking unless explicit standard sorting requested
        if (!sort || sort === 'smart_discovery' || sort === 'default' || search) {
          let vendorDocs = [];
          try {
            vendorDocs = await User.find({ type: 'vendor' }).lean();
          } catch {}
          const vendorMap = {};
          (vendorDocs.length ? vendorDocs : seedVendors).forEach((v) => {
            vendorMap[v.id] = v;
          });
          products = rankProductsFairly(products, { query: search, vendorMap, sortBy: sort });
        }
      } catch {
        products = [];
      }
    }

    if (!products || products.length === 0) {
      let filtered = [...memProducts];

      if (category && category !== 'All') {
        filtered = filtered.filter(
          (p) => p.category?.toLowerCase() === category.toLowerCase()
        );
      }

      if (status && status !== 'all') {
        filtered = filtered.filter((p) => p.status === status.toLowerCase());
      }

      if (vendorId) {
        filtered = filtered.filter((p) => p.vendorId === vendorId);
      }

      if (inStock === 'true') {
        filtered = filtered.filter((p) => (p.stock || p.quantity || 0) > 0);
      }

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name?.toLowerCase().includes(s) ||
            p.brand?.toLowerCase().includes(s) ||
            p.sku?.toLowerCase().includes(s) ||
            p.description?.toLowerCase().includes(s) ||
            p.category?.toLowerCase().includes(s)
        );
      }

      if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
      else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
      else if (sort === 'rating_desc') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      products = filtered;
    }

    return res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products.',
      error: error.message
    });
  }
};

/**
 * 2. Get single product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (isDbReady()) {
      try {
        product = await Product.findOne({ id });
        if (product) product = product.toJSON();
      } catch {
        product = null;
      }
    }

    if (!product) {
      product = memProducts.find((p) => p.id === id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    return res.json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product.',
      error: error.message
    });
  }
};

/**
 * 3. Create a new physical product (Vendor action)
 * POST /api/products
 */
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const vendorId = req.user?.id || productData.vendorId || 'v1';

    if (!productData.name || !productData.price || !productData.category) {
      return res.status(400).json({
        success: false,
        message: 'Product title, category, and price are required.'
      });
    }

    const newId = productData.id || ('p' + Date.now());
    const newSku = productData.sku || `VM-SKU-${Date.now().toString().slice(-6)}`;
    const parsedStock = parseInt(productData.stock || productData.quantity, 10) || 10;
    const parsedMrp = productData.mrp || Math.round(productData.price * 1.2);
    const parsedDiscount = productData.mrp
      ? Math.round(((parsedMrp - productData.price) / parsedMrp) * 100)
      : 15;

    const newProduct = {
      ...productData,
      id: newId,
      sku: newSku,
      stock: parsedStock,
      quantity: parsedStock,
      mrp: parsedMrp,
      discountPercent: parsedDiscount,
      vendorId,
      status: 'pending', // Pending admin approval queue
      createdAt: new Date().toISOString().split('T')[0],
      variants: productData.variants || { colors: [], options: [], customization: null },
      shipping: productData.shipping || {
        weight: '500 g',
        dispatchTime: 'Ships within 24 hours',
        estimatedDays: '2 - 4 days',
        courierPartners: ['BlueDart', 'Delhivery'],
        codAvailable: true,
        returnWindowDays: 7
      },
      reviews: [],
      inquiries: []
    };

    if (isDbReady()) {
      try {
        const doc = new Product(newProduct);
        await doc.save();
      } catch (err) {
        console.warn('DB product save note:', err.message);
      }
    }

    memProducts.unshift(newProduct);

    return res.status(201).json({
      success: true,
      message: 'Physical product submitted for administrative verification.',
      product: newProduct
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create product.',
      error: error.message
    });
  }
};

/**
 * 4. Update an existing product
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let updated = null;
    if (isDbReady()) {
      try {
        updated = await Product.findOneAndUpdate(
          { id },
          { $set: updateData },
          { new: true }
        );
        if (updated) updated = updated.toJSON();
      } catch {
        updated = null;
      }
    }

    const idx = memProducts.findIndex((p) => p.id === id);
    if (idx > -1) {
      memProducts[idx] = { ...memProducts[idx], ...updateData };
      if (!updated) updated = memProducts[idx];
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Product not found to update.'
      });
    }

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update product.',
      error: error.message
    });
  }
};

/**
 * 5. Delete a product
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbReady()) {
      try {
        await Product.findOneAndDelete({ id });
      } catch {}
    }

    memProducts = memProducts.filter((p) => p.id !== id);

    return res.json({
      success: true,
      message: 'Product removed from catalog.',
      id
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product.',
      error: error.message
    });
  }
};

/**
 * 6. Admin: Approve or Reject a product
 * PATCH /api/products/:id/status
 */
export const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved, rejected, or pending.'
      });
    }

    let updated = null;
    if (isDbReady()) {
      try {
        updated = await Product.findOneAndUpdate(
          { id },
          { $set: { status } },
          { new: true }
        );
        if (updated) updated = updated.toJSON();
      } catch {
        updated = null;
      }
    }

    const idx = memProducts.findIndex((p) => p.id === id);
    if (idx > -1) {
      memProducts[idx] = { ...memProducts[idx], status };
      if (!updated) updated = memProducts[idx];
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    return res.json({
      success: true,
      message: `Product marked as ${status}.`,
      product: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update product status.',
      error: error.message
    });
  }
};

/**
 * 7. Update product warehouse stock
 * PATCH /api/products/:id/stock
 */
export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, quantity } = req.body;
    const newStock = Math.max(0, parseInt(stock !== undefined ? stock : quantity, 10) || 0);

    let updated = null;
    if (isDbReady()) {
      try {
        updated = await Product.findOneAndUpdate(
          { id },
          { $set: { stock: newStock, quantity: newStock } },
          { new: true }
        );
        if (updated) updated = updated.toJSON();
      } catch {
        updated = null;
      }
    }

    const idx = memProducts.findIndex((p) => p.id === id);
    if (idx > -1) {
      memProducts[idx] = { ...memProducts[idx], stock: newStock, quantity: newStock };
      if (!updated) updated = memProducts[idx];
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Warehouse stock updated successfully.',
      stock: newStock,
      product: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update stock.',
      error: error.message
    });
  }
};

/**
 * 8. Add review & rating
 * POST /api/products/:id/reviews
 */
export const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewData = req.body;

    const newReview = {
      id: `rev-${Date.now()}`,
      customerName: req.user?.name || reviewData.customerName || 'Customer',
      rating: Number(reviewData.rating) || 5,
      title: reviewData.title || '',
      comment: reviewData.comment || '',
      date: new Date().toISOString().split('T')[0],
      verified: true
    };

    if (isDbReady()) {
      try {
        const product = await Product.findOne({ id });
        if (product) {
          product.reviews.unshift(newReview);
          product.reviewsCount = product.reviews.length;
          const sumRating = product.reviews.reduce((acc, r) => acc + r.rating, 0);
          product.rating = Number((sumRating / product.reviewsCount).toFixed(1));
          await product.save();
        }
      } catch {}
    }

    const p = memProducts.find((item) => item.id === id);
    if (p) {
      p.reviews = [newReview, ...(p.reviews || [])];
      p.reviewsCount = p.reviews.length;
      const sumRating = p.reviews.reduce((acc, r) => acc + r.rating, 0);
      p.rating = Number((sumRating / p.reviewsCount).toFixed(1));
    }

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      review: newReview,
      product: p
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit review.',
      error: error.message
    });
  }
};

/**
 * 9. Add customer inquiry
 * POST /api/products/:id/inquiries
 */
export const addProductInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, customerName } = req.body;

    if (!question || question.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Question must be at least 5 characters.' });
    }

    const newInquiry = {
      id: `qa-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      question: question.trim(),
      customerName: req.user?.name || customerName || 'Customer',
      answer: null,
      answeredAt: null
    };

    if (isDbReady()) {
      try {
        const product = await Product.findOne({ id });
        if (product) {
          product.inquiries.unshift(newInquiry);
          await product.save();
        }
      } catch {}
    }

    const p = memProducts.find((item) => item.id === id);
    if (p) {
      p.inquiries = [newInquiry, ...(p.inquiries || [])];
    }

    return res.status(201).json({
      success: true,
      message: 'Question posted successfully.',
      inquiry: newInquiry,
      product: p
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to post inquiry.',
      error: error.message
    });
  }
};

/**
 * 10. Vendor answer customer inquiry
 * PATCH /api/products/:id/inquiries/:inquiryId
 */
export const answerProductInquiry = async (req, res) => {
  try {
    const { id, inquiryId } = req.params;
    const { answer } = req.body;

    if (!answer || answer.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'A valid answer is required.' });
    }

    if (isDbReady()) {
      try {
        const product = await Product.findOne({ id });
        if (product) {
          const inq = product.inquiries.find((q) => q.id === inquiryId);
          if (inq) {
            inq.answer = answer.trim();
            inq.answeredAt = new Date().toISOString().split('T')[0];
            await product.save();
          }
        }
      } catch {}
    }

    const p = memProducts.find((item) => item.id === id);
    let inquiry = null;
    if (p && p.inquiries) {
      inquiry = p.inquiries.find((q) => q.id === inquiryId);
      if (inquiry) {
        inquiry.answer = answer.trim();
        inquiry.answeredAt = new Date().toISOString().split('T')[0];
      }
    }

    return res.json({
      success: true,
      message: 'Inquiry answered successfully.',
      inquiry,
      product: p
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to answer inquiry.',
      error: error.message
    });
  }
};

/**
 * 11. Seed Products from seedData
 * POST /api/products/seed
 */
export const seedProductsCatalog = async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.json({
        success: true,
        message: `Running in hybrid mode. (${memProducts.length} physical products in memory).`,
        count: memProducts.length
      });
    }

    const count = await Product.countDocuments();
    if (count > 0 && req.query.force !== 'true') {
      return res.json({
        success: true,
        message: `Catalog already seeded (${count} products found).`,
        count
      });
    }

    if (req.query.force === 'true') {
      await Product.deleteMany({});
    }

    await Product.insertMany(seedProducts);
    const total = await Product.countDocuments();

    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${total} physical products into MongoDB Atlas.`,
      count: total
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to seed product catalog.',
      error: error.message
    });
  }
};

/**
 * 12. Compare 2 to 4 products
 * POST /api/products/compare
 */
export const compareProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length < 2 || productIds.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'Product comparison requires selecting between 2 and 4 products.'
      });
    }

    let products = [];
    if (isDbReady()) {
      try {
        products = await Product.find({ id: { $in: productIds } });
        products = products.map((p) => (p.toJSON ? p.toJSON() : p));
      } catch {
        products = [];
      }
    }

    if (!products || products.length < 2) {
      products = memProducts.filter((p) => productIds.includes(p.id));
    }

    if (products.length < 2) {
      return res.status(404).json({
        success: false,
        message: 'Could not find enough matching products for comparison.'
      });
    }

    const categories = new Set(products.map((p) => p.category));
    const isCompatible = categories.size === 1;

    const allSpecKeys = new Set();
    products.forEach((p) => {
      if (p.specifications) {
        if (p.specifications instanceof Map) {
          p.specifications.forEach((_, key) => allSpecKeys.add(key));
        } else {
          Object.keys(p.specifications).forEach((key) => allSpecKeys.add(key));
        }
      }
    });

    const comparisonMatrix = Array.from(allSpecKeys).map((specKey) => {
      const values = {};
      products.forEach((p) => {
        const specVal =
          p.specifications instanceof Map
            ? p.specifications.get(specKey)
            : p.specifications?.[specKey];
        values[p.id] = specVal || '—';
      });
      return {
        attribute: specKey,
        values
      };
    });

    return res.json({
      success: true,
      count: products.length,
      isCompatible,
      incompatibleWarning: !isCompatible
        ? `Selected products span different categories: [${Array.from(categories).join(', ')}]. Comparisons are most effective within the same category.`
        : null,
      products,
      specMatrix: comparisonMatrix
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate product comparison.',
      error: error.message
    });
  }
};
