/**
 * GST Tax Invoice Generator for Vendor Hub
 * Generates structured, compliant Indian GST invoice data from Order & Vendor records.
 */

// Helper: convert number to Indian currency words
export const numberToWordsINR = (num) => {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(num);
  if (n === 0) return 'Zero Rupees Only';

  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  };

  return inWords(n).trim() + ' Rupees Only';
};

/**
 * Generate full GST Invoice object
 */
export const generateGstInvoice = (order, vendor = {}, customer = {}) => {
  if (!order) return null;

  const invoiceNumber = `VH-INV-${new Date().getFullYear()}-${order.id.toUpperCase()}`;
  const invoiceDate = order.createdAt || new Date().toISOString().split('T')[0];

  const vendorName = vendor.businessName || order.items?.[0]?.vendorName || 'Verified Merchant Store';
  const vendorGstin = vendor.gstin || '07AABCT1234F1Z8';
  const vendorAddress = vendor.businessAddress || vendor.location || 'Electronics Street, Commercial Complex';
  const vendorCity = vendor.location?.split(',')?.[0] || 'New Delhi';
  const vendorState = vendor.location?.split(',')?.[1]?.trim() || 'Delhi';
  const vendorEmail = vendor.email || 'support@vendorhub.in';
  const vendorPhone = vendor.mobile || '+91 98765 43210';

  const customerName =
    order.shippingAddress?.fullName || customer.fullName || customer.name || 'Valued Customer';
  const customerPhone = order.shippingAddress?.phone || customer.mobile || '+91 98765 43210';
  const customerEmail = customer.email || 'customer@vendorhub.in';
  const customerAddress =
    order.shippingAddress?.street ||
    order.address ||
    customer.address ||
    '12, Residential Enclave';
  const customerCity = order.shippingAddress?.city || customer.city || 'Bengaluru';
  const customerState = order.shippingAddress?.state || customer.state || 'Karnataka';
  const customerPincode = order.shippingAddress?.pincode || customer.pincode || '560001';

  // Determine Inter-state vs Intra-state tax split
  const isIntraState =
    vendorState.toLowerCase().trim() === customerState.toLowerCase().trim() ||
    vendorCity.toLowerCase() === customerCity.toLowerCase();

  const gstRate = 0.18; // 18% standard GST for catalog items
  const cgstRate = 0.09;
  const sgstRate = 0.09;

  let computedSubtotal = 0;
  const items = (order.items || []).map((item, idx) => {
    const qty = item.quantity || 1;
    const grossPrice = item.price || 0;
    // Base taxable value before GST (18% inclusive)
    const baseUnitRate = Math.round((grossPrice / (1 + gstRate)) * 100) / 100;
    const taxableValue = Math.round(baseUnitRate * qty * 100) / 100;
    computedSubtotal += taxableValue;

    const taxAmount = Math.round(taxableValue * gstRate * 100) / 100;
    const cgst = isIntraState ? Math.round(taxableValue * cgstRate * 100) / 100 : 0;
    const sgst = isIntraState ? Math.round(taxableValue * sgstRate * 100) / 100 : 0;
    const igst = !isIntraState ? taxAmount : 0;

    return {
      srNo: idx + 1,
      productId: item.productId,
      name: item.name,
      sku: item.sku || `SKU-${item.productId}`,
      hsnCode: item.hsnCode || '8518.30.00',
      quantity: qty,
      grossPrice,
      baseUnitRate,
      taxableValue,
      gstRatePercent: '18%',
      cgst,
      sgst,
      igst,
      totalAmount: Math.round((taxableValue + taxAmount) * 100) / 100
    };
  });

  const shippingCharges = order.shippingCost || (order.total > 1500 ? 0 : 99);
  const totalTaxable = Math.round(computedSubtotal * 100) / 100;
  const totalGst = Math.round(totalTaxable * gstRate * 100) / 100;
  const totalCgst = isIntraState ? Math.round(totalTaxable * cgstRate * 100) / 100 : 0;
  const totalSgst = isIntraState ? Math.round(totalTaxable * sgstRate * 100) / 100 : 0;
  const totalIgst = !isIntraState ? totalGst : 0;

  const grandTotal = order.total || (totalTaxable + totalGst + shippingCharges);

  return {
    invoiceNumber,
    invoiceDate,
    orderId: order.id,
    orderDate: order.createdAt,
    placeOfSupply: `${customerState} (${customerCity})`,
    isIntraState,
    courierPartner: order.courierPartner || 'Delhivery Surface Express',
    trackingNumber: order.trackingNumber || `BD-${Math.floor(100000000 + Math.random() * 900000000)}-IN`,
    vendor: {
      name: vendorName,
      gstin: vendorGstin,
      address: vendorAddress,
      city: vendorCity,
      state: vendorState,
      email: vendorEmail,
      phone: vendorPhone,
      pan: vendorGstin.slice(2, 12)
    },
    customer: {
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      address: customerAddress,
      city: customerCity,
      state: customerState,
      pincode: customerPincode
    },
    items,
    totals: {
      subtotalTaxable: totalTaxable,
      shippingCharges,
      totalCgst,
      totalSgst,
      totalIgst,
      totalGst,
      grandTotal: Math.round(grandTotal),
      amountInWords: numberToWordsINR(grandTotal)
    },
    payment: {
      method: order.paymentMethod || 'UPI_QR',
      status: order.paymentStatus || 'Paid',
      transactionRef: order.paymentDetails?.razorpay_payment_id || order.paymentDetails?.upiRef || order.paymentDetails?.codOtp || `TXN-${Date.now().toString().slice(-8)}`
    }
  };
};
