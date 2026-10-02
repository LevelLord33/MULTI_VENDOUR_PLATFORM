import twilio from 'twilio';
import { logActivity } from './activityLogger.js';

/**
 * Twilio Invoice Communication Delivery Service
 * Delivers SMS & WhatsApp notifications for generated digital invoices.
 * Secrets are strictly backend-only and never exposed to client responses.
 */

// Helper to check if valid non-placeholder Twilio credentials exist
export const isTwilioConfigured = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_API_SECRET;
  return Boolean(
    accountSid &&
    authToken &&
    !accountSid.includes('your_') &&
    !accountSid.includes('ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
  );
};

// Mask phone numbers for safe operational display
const maskPhone = (phone) => {
  if (!phone) return 'Not Configured';
  const clean = String(phone).trim();
  if (clean.length <= 4) return '***';
  return clean.slice(0, 3) + ' ••• ••• ' + clean.slice(-4);
};

/**
 * Returns safe operational configuration for Admin Dashboard
 * (NO secret keys or tokens are returned)
 */
export const getTwilioOperationalStatus = () => {
  const isConfigured = isTwilioConfigured();
  const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER || '';
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || '';
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID || '';

  return {
    isConfigured,
    mode: isConfigured ? 'live_production' : 'simulated_resilient',
    smsEnabled: Boolean(phoneNumber || messagingServiceSid),
    whatsAppEnabled: Boolean(whatsappNumber),
    maskedAccountSid: accountSid ? `${accountSid.slice(0, 6)}••••••••••••••••${accountSid.slice(-4)}` : 'Not Set',
    maskedPhoneNumber: maskPhone(phoneNumber),
    maskedWhatsAppNumber: maskPhone(whatsappNumber),
    hasMessagingService: Boolean(messagingServiceSid),
    statusMessage: isConfigured
      ? 'Twilio REST Gateway active for real-time SMS & WhatsApp dispatch'
      : 'Twilio running in simulated resilience mode (instant test dispatch logs recorded)'
  };
};

/**
 * Initialize Twilio Client safely
 */
const getTwilioClient = () => {
  if (!isTwilioConfigured()) return null;
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;

    if (apiKey && apiSecret && accountSid) {
      return twilio(apiKey, apiSecret, { accountSid });
    }
    return twilio(accountSid, authToken);
  } catch (err) {
    console.warn('Twilio client initialization error:', err.message);
    return null;
  }
};

/**
 * Format SMS / WhatsApp invoice body
 */
export const buildInvoiceMessage = (invoice) => {
  const vendorName = invoice.vendorBusinessName || 'Vendor Hub Merchant';
  const orderId = invoice.orderId;
  const invNumber = invoice.invoiceNumber;
  const amount = Number(invoice.grandTotal || invoice.total || 0).toLocaleString('en-IN');
  const date = invoice.invoiceDate || new Date().toISOString().split('T')[0];
  const frontendHost = process.env.FRONTEND_URL || 'http://localhost:5173';
  const invoiceLink = `${frontendHost}/shop/orders?invoice=${encodeURIComponent(invNumber)}`;

  return (
    `📦 Vendor Hub Tax Invoice Ready!\n\n` +
    `Merchant: ${vendorName}\n` +
    `Order ID: #${orderId}\n` +
    `Invoice: ${invNumber}\n` +
    `Amount: ₹${amount}\n` +
    `Date: ${date}\n\n` +
    `View & Download Digital Invoice:\n${invoiceLink}\n\n` +
    `Thank you for shopping on Vendor Hub — Verified Indian Physical Marketplace.`
  );
};

/**
 * Send invoice communication via SMS and/or WhatsApp
 * @param {Object} params
 * @param {Object} params.invoice - Invoice document or object
 * @param {String} [params.recipientPhone] - Optional override phone
 * @param {String} [params.channel] - 'sms' | 'whatsapp' | 'both'
 */
export const sendInvoiceCommunication = async ({
  invoice,
  recipientPhone,
  channel = 'both'
}) => {
  const phone = recipientPhone || invoice.customerPhone;
  const messageBody = buildInvoiceMessage(invoice);
  const client = getTwilioClient();
  const results = [];

  const normalizedPhone = phone ? String(phone).replace(/\s+/g, '') : '';
  const e164Phone = normalizedPhone.startsWith('+')
    ? normalizedPhone
    : (normalizedPhone.length === 10 ? `+91${normalizedPhone}` : `+${normalizedPhone}`);

  // 1. Deliver via SMS
  if (channel === 'sms' || channel === 'both') {
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

    if (client && (fromPhone || messagingServiceSid) && e164Phone) {
      try {
        const payload = {
          body: messageBody,
          to: e164Phone
        };
        if (messagingServiceSid) {
          payload.messagingServiceSid = messagingServiceSid;
        } else {
          payload.from = fromPhone;
        }

        const twilioRes = await client.messages.create(payload);
        results.push({
          channel: 'sms',
          recipient: e164Phone,
          status: 'sent',
          sentAt: new Date().toISOString(),
          messageSid: twilioRes.sid,
          content: messageBody,
          errorMessage: null
        });
      } catch (smsErr) {
        console.warn('Twilio SMS delivery failed:', smsErr.message);
        results.push({
          channel: 'sms',
          recipient: e164Phone,
          status: 'failed',
          sentAt: new Date().toISOString(),
          messageSid: '',
          content: messageBody,
          errorMessage: smsErr.message
        });
      }
    } else {
      // Graceful simulated delivery (local / test mode)
      results.push({
        channel: 'sms',
        recipient: e164Phone || '+919876543210',
        status: 'simulated',
        sentAt: new Date().toISOString(),
        messageSid: `SM_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        content: messageBody,
        errorMessage: null
      });
    }
  }

  // 2. Deliver via WhatsApp
  if (channel === 'whatsapp' || channel === 'both') {
    const rawFromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER;
    const cleanFromWhatsApp = rawFromWhatsApp ? String(rawFromWhatsApp).replace(/[\s\(\)\-]/g, '') : '';
    const whatsappRecipient = `whatsapp:${e164Phone}`;

    if (client && cleanFromWhatsApp && e164Phone) {
      try {
        const formattedFrom = cleanFromWhatsApp.startsWith('whatsapp:')
          ? cleanFromWhatsApp
          : `whatsapp:${cleanFromWhatsApp}`;

        const twilioRes = await client.messages.create({
          body: messageBody,
          from: formattedFrom,
          to: whatsappRecipient
        });

        results.push({
          channel: 'whatsapp',
          recipient: whatsappRecipient,
          status: 'sent',
          sentAt: new Date().toISOString(),
          messageSid: twilioRes.sid,
          content: messageBody,
          errorMessage: null
        });
      } catch (waErr) {
        console.warn('Twilio WhatsApp delivery failed:', waErr.message);
        results.push({
          channel: 'whatsapp',
          recipient: whatsappRecipient,
          status: 'failed',
          sentAt: new Date().toISOString(),
          messageSid: '',
          content: messageBody,
          errorMessage: waErr.message
        });
      }
    } else {
      // Graceful simulated WhatsApp delivery
      results.push({
        channel: 'whatsapp',
        recipient: whatsappRecipient || 'whatsapp:+919876543210',
        status: 'simulated',
        sentAt: new Date().toISOString(),
        messageSid: `WA_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        content: messageBody,
        errorMessage: null
      });
    }
  }

  // Determine overall status
  const hasSent = results.some((r) => r.status === 'sent');
  const hasSimulated = results.some((r) => r.status === 'simulated');
  const allFailed = results.length > 0 && results.every((r) => r.status === 'failed');

  let overallStatus = 'pending';
  if (hasSent) overallStatus = 'sent';
  else if (hasSimulated) overallStatus = 'simulated';
  else if (allFailed) overallStatus = 'failed';

  // Audit log
  await logActivity({
    action: 'invoice_delivery_attempted',
    actorId: 'system',
    actorRole: 'system',
    actorName: 'Twilio Notification Gateway',
    targetType: 'communication',
    targetId: invoice.invoiceNumber || invoice.id,
    title: `Invoice #${invoice.invoiceNumber} delivered via ${channel.toUpperCase()}`,
    details: {
      invoiceNumber: invoice.invoiceNumber,
      orderId: invoice.orderId,
      customerPhone: maskPhone(phone),
      channel,
      overallStatus,
      attempts: results.map((r) => ({ channel: r.channel, status: r.status, sid: r.messageSid }))
    }
  });

  return {
    success: overallStatus !== 'failed',
    overallStatus,
    results
  };
};

/**
 * Send subscriber updates (SMS / WhatsApp) about New Products, Offers, Discounts, Deals
 */
export const sendSubscriberBroadcastTwilio = async ({
  vendor,
  subscribers = [],
  title,
  message,
  updateType = 'updates',
  channel = 'both',
  link = ''
}) => {
  const client = getTwilioClient();
  const frontendHost = process.env.FRONTEND_URL || 'http://localhost:5173';
  const fullLink = link.startsWith('http')
    ? link
    : `${frontendHost}${link.startsWith('/') ? '' : '/'}${link}`;

  const categoryLabels = {
    new_product: '✨ NEW PRODUCT ALERT',
    newProducts: '✨ NEW PRODUCT ALERT',
    promotion: '🏷️ EXCLUSIVE OFFER & DISCOUNT',
    promotions: '🏷️ EXCLUSIVE OFFER & DISCOUNT',
    deal: '⚡ FLASH DEAL & BUNDLE SAVINGS',
    deals: '⚡ FLASH DEAL & BUNDLE SAVINGS',
    updates: '📢 STORE NOTICE & UPDATE'
  };
  const categoryHeader = categoryLabels[updateType] || '📢 STORE UPDATE';

  const vendorName = vendor.businessName || 'Verified Merchant';

  const formatBody = (recipientName) => {
    return (
      `${categoryHeader} — ${vendorName}\n\n` +
      `Hello ${recipientName || 'Valued Subscriber'}! 👋\n\n` +
      `📣 ${title}\n\n` +
      `${message}\n\n` +
      `🛒 Explore & Purchase Now:\n${fullLink}\n\n` +
      `You received this verified alert because you subscribed to ${vendorName} on Vendor Hub.`
    );
  };

  const dispatchResults = {
    totalEligible: subscribers.length,
    smsSent: 0,
    smsFailed: 0,
    whatsappSent: 0,
    whatsappFailed: 0,
    simulated: 0,
    details: []
  };

  const fromSMS = process.env.TWILIO_PHONE_NUMBER;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const rawFromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || '';
  const cleanFromWhatsApp = rawFromWhatsApp.replace(/[\s\(\)\-]/g, '');
  const fromWhatsApp = cleanFromWhatsApp.startsWith('whatsapp:')
    ? cleanFromWhatsApp
    : (cleanFromWhatsApp ? `whatsapp:${cleanFromWhatsApp}` : '');

  for (const sub of subscribers) {
    const rawPhone = sub.phone || sub.mobile;
    if (!rawPhone) continue;

    const normalized = String(rawPhone).replace(/[\s\(\)\-]/g, '');
    const e164Phone = normalized.startsWith('+')
      ? normalized
      : (normalized.length === 10 ? `+91${normalized}` : `+${normalized}`);

    const bodyText = formatBody(sub.name || sub.customerName);

    // SMS Channel
    if (channel === 'sms' || channel === 'both') {
      if (client && (fromSMS || messagingServiceSid)) {
        try {
          const payload = { body: bodyText, to: e164Phone };
          if (messagingServiceSid) payload.messagingServiceSid = messagingServiceSid;
          else payload.from = fromSMS;

          const res = await client.messages.create(payload);
          dispatchResults.smsSent += 1;
          dispatchResults.details.push({
            recipient: maskPhone(e164Phone),
            channel: 'sms',
            status: 'sent',
            sid: res.sid
          });
        } catch (err) {
          console.warn(`Twilio broadcast SMS failed for ${e164Phone}:`, err.message);
          dispatchResults.smsFailed += 1;
          dispatchResults.details.push({
            recipient: maskPhone(e164Phone),
            channel: 'sms',
            status: 'failed',
            error: err.message
          });
        }
      } else {
        dispatchResults.simulated += 1;
        dispatchResults.smsSent += 1;
        dispatchResults.details.push({
          recipient: maskPhone(e164Phone),
          channel: 'sms',
          status: 'simulated',
          sid: `SM_sim_${Date.now()}`
        });
      }
    }

    // WhatsApp Channel
    if (channel === 'whatsapp' || channel === 'both') {
      const waRecipient = `whatsapp:${e164Phone}`;
      if (client && fromWhatsApp) {
        try {
          const res = await client.messages.create({
            body: bodyText,
            from: fromWhatsApp,
            to: waRecipient
          });
          dispatchResults.whatsappSent += 1;
          dispatchResults.details.push({
            recipient: maskPhone(waRecipient),
            channel: 'whatsapp',
            status: 'sent',
            sid: res.sid
          });
        } catch (err) {
          console.warn(`Twilio broadcast WhatsApp failed for ${waRecipient}:`, err.message);
          dispatchResults.whatsappFailed += 1;
          dispatchResults.details.push({
            recipient: maskPhone(waRecipient),
            channel: 'whatsapp',
            status: 'failed',
            error: err.message
          });
        }
      } else {
        dispatchResults.simulated += 1;
        dispatchResults.whatsappSent += 1;
        dispatchResults.details.push({
          recipient: maskPhone(waRecipient),
          channel: 'whatsapp',
          status: 'simulated',
          sid: `WA_sim_${Date.now()}`
        });
      }
    }
  }

  // Audit activity log
  await logActivity({
    action: 'vendor_broadcast_dispatched',
    actorId: vendor.id,
    actorRole: 'vendor',
    actorName: vendorName,
    targetType: 'subscription_broadcast',
    targetId: `bcast_${Date.now()}`,
    title: `Subscriber update sent via ${channel.toUpperCase()}: ${title}`,
    details: {
      vendorId: vendor.id,
      category: updateType,
      channel,
      targetedSubscribers: subscribers.length,
      smsSent: dispatchResults.smsSent,
      whatsappSent: dispatchResults.whatsappSent,
      smsFailed: dispatchResults.smsFailed,
      whatsappFailed: dispatchResults.whatsappFailed,
      simulated: dispatchResults.simulated
    }
  });

  return dispatchResults;
};
