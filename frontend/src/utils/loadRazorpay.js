/**
 * Dynamically loads the official Razorpay Checkout SDK script
 * @returns {Promise<boolean>} True if script loaded successfully, false otherwise
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // If Razorpay is already available on window
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById('razorpay-checkout-js');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.warn('⚠️ Unable to load Razorpay Checkout script from CDN.');
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export default loadRazorpayScript;
