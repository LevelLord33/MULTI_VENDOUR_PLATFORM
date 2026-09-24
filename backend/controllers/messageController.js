import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { INITIAL_SEED_CONVERSATIONS } from '../routes/seedRoutes.js';
import { emitNewMessage } from '../socket/socketService.js';

// In-memory fallback array for resilient operation if MongoDB Atlas is disconnected
let inMemoryConversations = [...(INITIAL_SEED_CONVERSATIONS || [])];

export const setInMemoryConversations = (conversations) => {
  inMemoryConversations = conversations;
};

export const getInMemoryConversations = () => inMemoryConversations;

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Get all conversations for a specific vendor
 * GET /api/messages/vendor/:vendorId
 */
export const getVendorConversations = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { status, category, search } = req.query;

    if (isDbConnected()) {
      const query = { vendorId };
      if (status && status !== 'all') {
        query.status = status;
      }
      if (category && category !== 'all') {
        query.category = category;
      }

      let conversations = await Conversation.find(query).sort({ lastMessageAt: -1 }).lean();

      if (search && search.trim()) {
        const s = search.toLowerCase();
        conversations = conversations.filter(
          (c) =>
            c.customerName?.toLowerCase().includes(s) ||
            c.subject?.toLowerCase().includes(s) ||
            c.relatedProduct?.name?.toLowerCase().includes(s) ||
            c.relatedOrder?.orderId?.toLowerCase().includes(s) ||
            c.lastMessage?.toLowerCase().includes(s)
        );
      }

      const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadVendor || 0), 0);

      return res.json({
        success: true,
        conversations,
        totalUnread,
        count: conversations.length
      });
    }

    // Resilient fallback
    let filtered = inMemoryConversations.filter((c) => c.vendorId === vendorId);
    if (status && status !== 'all') {
      filtered = filtered.filter((c) => c.status === status);
    }
    if (category && category !== 'all') {
      filtered = filtered.filter((c) => c.category === category);
    }
    if (search && search.trim()) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.customerName?.toLowerCase().includes(s) ||
          c.subject?.toLowerCase().includes(s) ||
          c.relatedProduct?.name?.toLowerCase().includes(s) ||
          c.relatedOrder?.orderId?.toLowerCase().includes(s) ||
          c.lastMessage?.toLowerCase().includes(s)
      );
    }

    filtered.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
    const totalUnread = filtered.reduce((sum, c) => sum + (c.unreadVendor || 0), 0);

    return res.json({
      success: true,
      conversations: filtered,
      totalUnread,
      count: filtered.length
    });
  } catch (error) {
    console.error('Error fetching vendor conversations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve vendor messages',
      error: error.message
    });
  }
};

/**
 * Get all conversations for a specific customer
 * GET /api/messages/customer/:customerId
 */
export const getCustomerConversations = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (isDbConnected()) {
      const conversations = await Conversation.find({ customerId }).sort({ lastMessageAt: -1 }).lean();
      const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCustomer || 0), 0);

      return res.json({
        success: true,
        conversations,
        totalUnread,
        count: conversations.length
      });
    }

    const filtered = inMemoryConversations.filter((c) => c.customerId === customerId);
    filtered.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
    const totalUnread = filtered.reduce((sum, c) => sum + (c.unreadCustomer || 0), 0);

    return res.json({
      success: true,
      conversations: filtered,
      totalUnread,
      count: filtered.length
    });
  } catch (error) {
    console.error('Error fetching customer conversations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer messages',
      error: error.message
    });
  }
};

/**
 * Get single conversation by ID
 * GET /api/messages/conversation/:id
 */
export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const conv = await Conversation.findOne({ id }).lean();
      if (!conv) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
      return res.json({ success: true, conversation: conv });
    }

    const conv = inMemoryConversations.find((c) => c.id === id);
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    return res.json({ success: true, conversation: conv });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversation thread',
      error: error.message
    });
  }
};

/**
 * Create a new conversation or return existing active conversation
 * POST /api/messages/conversations
 */
export const createOrGetConversation = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      customerEmail,
      customerAvatar,
      vendorId,
      vendorName,
      vendorAvatar,
      subject,
      category,
      relatedProduct,
      relatedOrder,
      initialMessage,
      attachments
    } = req.body;

    if (!customerId || !vendorId || !subject) {
      return res.status(400).json({
        success: false,
        message: 'customerId, vendorId, and subject are required fields'
      });
    }

    const now = new Date().toISOString();

    // Check if an existing matching active conversation already exists
    const query = {
      customerId,
      vendorId,
      status: { $in: ['active', 'resolved'] }
    };

    if (relatedProduct?.productId) {
      query['relatedProduct.productId'] = relatedProduct.productId;
    } else if (relatedOrder?.orderId) {
      query['relatedOrder.orderId'] = relatedOrder.orderId;
    }

    let existing = null;
    if (isDbConnected()) {
      existing = await Conversation.findOne(query);
    } else {
      existing = inMemoryConversations.find(
        (c) =>
          c.customerId === customerId &&
          c.vendorId === vendorId &&
          c.status !== 'archived' &&
          ((relatedProduct?.productId && c.relatedProduct?.productId === relatedProduct.productId) ||
            (relatedOrder?.orderId && c.relatedOrder?.orderId === relatedOrder.orderId) ||
            (!relatedProduct?.productId && !relatedOrder?.orderId && !c.relatedProduct && !c.relatedOrder))
      );
    }

    // If existing active conversation found, append message if provided and return
    if (existing) {
      if (initialMessage && initialMessage.trim()) {
        const newMsg = {
          id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          senderId: customerId,
          senderType: 'customer',
          senderName: customerName || existing.customerName || 'Customer',
          senderAvatar: customerAvatar || existing.customerAvatar || '',
          text: initialMessage.trim(),
          attachments: attachments || [],
          createdAt: now,
          isRead: false
        };

        if (isDbConnected()) {
          existing.messages.push(newMsg);
          existing.lastMessage = initialMessage.trim();
          existing.lastMessageSender = 'customer';
          existing.lastMessageAt = now;
          existing.unreadVendor = (existing.unreadVendor || 0) + 1;
          existing.status = 'active'; // Reopen if resolved
          await existing.save();
          const existingJson = existing.toJSON();
          emitNewMessage(existing.id, newMsg, existingJson);
          return res.status(200).json({
            success: true,
            isExisting: true,
            conversation: existingJson
          });
        } else {
          existing.messages.push(newMsg);
          existing.lastMessage = initialMessage.trim();
          existing.lastMessageSender = 'customer';
          existing.lastMessageAt = now;
          existing.unreadVendor = (existing.unreadVendor || 0) + 1;
          existing.status = 'active';
          emitNewMessage(existing.id, newMsg, existing);
          return res.status(200).json({
            success: true,
            isExisting: true,
            conversation: existing
          });
        }
      }

      return res.status(200).json({
        success: true,
        isExisting: true,
        conversation: isDbConnected() ? existing.toJSON() : existing
      });
    }

    // Create new conversation
    const convId = `conv-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const initialMessages = [];

    if (initialMessage && initialMessage.trim()) {
      initialMessages.push({
        id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        senderId: customerId,
        senderType: 'customer',
        senderName: customerName || 'Customer',
        senderAvatar: customerAvatar || '',
        text: initialMessage.trim(),
        attachments: attachments || [],
        createdAt: now,
        isRead: false
      });
    }

    const conversationData = {
      id: convId,
      customerId,
      customerName: customerName || 'Customer',
      customerEmail: customerEmail || '',
      customerAvatar: customerAvatar || '',
      vendorId,
      vendorName: vendorName || 'Vendor Merchant',
      vendorAvatar: vendorAvatar || '',
      subject: subject.trim(),
      category: category || (relatedOrder ? 'order_inquiry' : relatedProduct ? 'product_inquiry' : 'general'),
      relatedProduct: relatedProduct || null,
      relatedOrder: relatedOrder || null,
      status: 'active',
      unreadVendor: initialMessages.length > 0 ? 1 : 0,
      unreadCustomer: 0,
      lastMessage: initialMessage ? initialMessage.trim() : 'Conversation started',
      lastMessageSender: 'customer',
      lastMessageAt: now,
      messages: initialMessages
    };

    if (isDbConnected()) {
      const created = await Conversation.create(conversationData);
      const createdJson = created.toJSON();
      if (initialMessages.length > 0) {
        emitNewMessage(created.id, initialMessages[0], createdJson);
      }
      return res.status(201).json({
        success: true,
        isExisting: false,
        conversation: createdJson
      });
    }

    inMemoryConversations.unshift(conversationData);
    if (initialMessages.length > 0) {
      emitNewMessage(conversationData.id, initialMessages[0], conversationData);
    }
    return res.status(201).json({
      success: true,
      isExisting: false,
      conversation: conversationData
    });
  } catch (error) {
    console.error('Error creating/getting conversation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate conversation',
      error: error.message
    });
  }
};

/**
 * Send a message in an existing conversation
 * POST /api/messages/conversations/:id/messages
 */
export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { senderId, senderType, senderName, senderAvatar, text, attachments } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const now = new Date().toISOString();
    const newMsg = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      senderId: senderId || (senderType === 'vendor' ? 'vendor' : 'customer'),
      senderType: senderType || 'customer',
      senderName: senderName || (senderType === 'vendor' ? 'Store Merchant' : 'Customer'),
      senderAvatar: senderAvatar || '',
      text: text.trim(),
      attachments: attachments || [],
      createdAt: now,
      isRead: false
    };

    if (isDbConnected()) {
      const conv = await Conversation.findOne({ id });
      if (!conv) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }

      conv.messages.push(newMsg);
      conv.lastMessage = text.trim();
      conv.lastMessageSender = senderType;
      conv.lastMessageAt = now;

      if (senderType === 'customer') {
        conv.unreadVendor = (conv.unreadVendor || 0) + 1;
      } else if (senderType === 'vendor') {
        conv.unreadCustomer = (conv.unreadCustomer || 0) + 1;
      }

      conv.status = 'active'; // Reopen if it was marked resolved
      await conv.save();
      const convJson = conv.toJSON();
      emitNewMessage(id, newMsg, convJson);

      return res.status(200).json({
        success: true,
        message: 'Message sent successfully',
        data: newMsg,
        conversation: convJson
      });
    }

    const conv = inMemoryConversations.find((c) => c.id === id);
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    conv.messages.push(newMsg);
    conv.lastMessage = text.trim();
    conv.lastMessageSender = senderType;
    conv.lastMessageAt = now;

    if (senderType === 'customer') {
      conv.unreadVendor = (conv.unreadVendor || 0) + 1;
    } else if (senderType === 'vendor') {
      conv.unreadCustomer = (conv.unreadCustomer || 0) + 1;
    }
    conv.status = 'active';
    emitNewMessage(id, newMsg, conv);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: newMsg,
      conversation: conv
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

/**
 * Mark all messages in conversation as read for a given role
 * PATCH /api/messages/conversations/:id/read
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { userRole } = req.body; // 'vendor' or 'customer'

    if (isDbConnected()) {
      const conv = await Conversation.findOne({ id });
      if (!conv) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }

      if (userRole === 'vendor') {
        conv.unreadVendor = 0;
        conv.messages.forEach((m) => {
          if (m.senderType === 'customer') m.isRead = true;
        });
      } else {
        conv.unreadCustomer = 0;
        conv.messages.forEach((m) => {
          if (m.senderType === 'vendor') m.isRead = true;
        });
      }

      await conv.save();
      return res.json({ success: true, conversation: conv.toJSON() });
    }

    const conv = inMemoryConversations.find((c) => c.id === id);
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (userRole === 'vendor') {
      conv.unreadVendor = 0;
      conv.messages.forEach((m) => {
        if (m.senderType === 'customer') m.isRead = true;
      });
    } else {
      conv.unreadCustomer = 0;
      conv.messages.forEach((m) => {
        if (m.senderType === 'vendor') m.isRead = true;
      });
    }

    return res.json({ success: true, conversation: conv });
  } catch (error) {
    console.error('Error marking conversation read:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
};

/**
 * Update conversation status (active, resolved, archived)
 * PATCH /api/messages/conversations/:id/status
 */
export const updateConversationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'resolved', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (isDbConnected()) {
      const conv = await Conversation.findOneAndUpdate(
        { id },
        { $set: { status } },
        { new: true }
      ).lean();

      if (!conv) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }

      return res.json({ success: true, conversation: conv });
    }

    const conv = inMemoryConversations.find((c) => c.id === id);
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    conv.status = status;

    return res.json({ success: true, conversation: conv });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update conversation status',
      error: error.message
    });
  }
};

/**
 * Get vendor communication analytics & stats
 * GET /api/messages/vendor/:vendorId/stats
 */
export const getVendorMessageStats = async (req, res) => {
  try {
    const { vendorId } = req.params;

    let convs = [];
    if (isDbConnected()) {
      convs = await Conversation.find({ vendorId }).lean();
    } else {
      convs = inMemoryConversations.filter((c) => c.vendorId === vendorId);
    }

    const totalConversations = convs.length;
    const activeInquiries = convs.filter((c) => c.status === 'active').length;
    const unreadMessages = convs.reduce((sum, c) => sum + (c.unreadVendor || 0), 0);
    const resolvedConversations = convs.filter((c) => c.status === 'resolved').length;
    const productQuestions = convs.filter((c) => c.category === 'product_inquiry').length;
    const orderInquiries = convs.filter((c) => c.category === 'order_inquiry').length;

    return res.json({
      success: true,
      stats: {
        totalConversations,
        activeInquiries,
        unreadMessages,
        resolvedConversations,
        productQuestions,
        orderInquiries,
        avgResponseTime: '< 15 mins',
        satisfactionRate: '99.2%'
      }
    });
  } catch (error) {
    console.error('Error getting message stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve message analytics',
      error: error.message
    });
  }
};
