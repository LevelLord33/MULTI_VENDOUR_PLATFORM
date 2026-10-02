import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Configure Nodemailer Transporter
 * If SMTP / Gmail credentials exist in process.env, uses those.
 * Otherwise, creates an Ethereal test transporter or fallback logger.
 */
let cachedTransporter = null;

export const getMailTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD;

  if (user && pass) {
    if (host) {
      cachedTransporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });
    } else {
      // Default to Gmail service if user is a gmail address
      cachedTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });
    }
    return cachedTransporter;
  }

  // Create an Ethereal test transporter for development & testing
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('[EmailService] Using Ethereal test mailer account:', testAccount.user);
    return cachedTransporter;
  } catch (err) {
    console.warn('[EmailService] Could not create Ethereal account, using fallback json transporter:', err.message);
    cachedTransporter = nodemailer.createTransport({
      jsonTransport: true
    });
    return cachedTransporter;
  }
};

/**
 * Send an update broadcast email to a subscriber via VendorHub Private Relay
 */
export const sendSubscriberBroadcastEmail = async ({
  vendor,
  toEmail,
  subscriberAlias = 'Valued Subscriber',
  title,
  message,
  updateType = 'updates',
  link = ''
}) => {
  try {
    const transporter = await getMailTransporter();
    const vendorName = vendor?.businessName || 'Verified Store';
    const storeSlug = vendor?.storeSlug || vendor?.id || '';
    const storeUrl = link || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop/vendor/${storeSlug}`;

    const updateTypeBadge = {
      new_product: '✨ New Catalog Drop',
      promotion: '🏷️ Exclusive Voucher / Discount',
      deal: '⚡ Flash Combo Deal',
      updates: '📢 Store & Delivery Notice'
    }[updateType] || '📢 Store Update';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B; }
          .container { max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 28px 24px; color: #FFFFFF; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
          .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
          .body { padding: 24px; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; background: #EEF2FF; color: #4F46E5; font-size: 12px; font-weight: 700; margin-bottom: 14px; }
          .title { font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 12px; line-height: 1.35; }
          .message { font-size: 14px; line-height: 1.6; color: #334155; background: #F8FAFC; border-left: 4px solid #4F46E5; padding: 14px 16px; border-radius: 4px; margin: 16px 0 24px; white-space: pre-wrap; }
          .btn { display: inline-block; background: #4F46E5; color: #FFFFFF !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; text-align: center; }
          .privacy-shield { background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 8px; padding: 12px 14px; font-size: 12px; color: #065F46; margin-top: 24px; line-height: 1.45; }
          .footer { background: #F1F5F9; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${vendorName}</h1>
            <p>Storefront Subscriber Digest</p>
          </div>
          <div class="body">
            <span class="badge">${updateTypeBadge}</span>
            <h2 class="title">${title}</h2>
            <p style="font-size: 13px; color: #64748B; margin-top: 0;">Hello ${subscriberAlias},</p>
            <div class="message">${message}</div>
            <div style="text-align: center; margin: 24px 0 16px;">
              <a href="${storeUrl}" class="btn">View Store & Products →</a>
            </div>
            <div class="privacy-shield">
              🔒 <strong>Your Privacy is 100% Protected:</strong> This email was dispatched via VendorHub's Zero-Knowledge Relay. Your personal email address and identity are never exposed to ${vendorName}.
            </div>
          </div>
          <div class="footer">
            You are receiving this because you subscribed to <strong>${vendorName}</strong> on VendorHub.<br>
            Manage your subscription preferences anytime from your <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop/subscriptions" style="color: #4F46E5;">Subscriber Dashboard</a>.
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"${vendorName} via VendorHub" <${process.env.EMAIL_FROM || 'relay@vendorhub.in'}>`,
      to: toEmail,
      subject: `[${vendorName}] ${title}`,
      text: `${title}\n\n${message}\n\nVisit store: ${storeUrl}\n\n(Your personal email is hidden from the merchant via VendorHub Private Relay)`,
      html: htmlContent
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[EmailService] Preview URL for ${toEmail}: ${previewUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null,
      to: toEmail
    };
  } catch (err) {
    console.error(`[EmailService] Failed to send email to ${toEmail}:`, err.message);
    return {
      success: false,
      error: err.message
    };
  }
};
