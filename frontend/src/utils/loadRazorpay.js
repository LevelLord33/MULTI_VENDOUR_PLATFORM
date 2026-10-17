/**
 * Dynamically loads the official Razorpay Checkout SDK script
 * @returns {Promise<boolean>} True if script loaded successfully, false otherwise
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // 1. If Razorpay is already available on window
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    // 2. Quick polling check in case script is in index.html and initializing
    let checks = 0;
    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (++checks > 20) {
        clearInterval(checkInterval);
        // Continue to script injection check if still missing
        injectScript();
      }
    }, 100);

    function injectScript() {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript = document.getElementById('razorpay-checkout-js');
      if (existingScript) {
        if (typeof window !== 'undefined' && window.Razorpay) {
          resolve(true);
        } else {
          // If script tag exists but Razorpay not yet on window, give it a moment or resolve false
          setTimeout(() => resolve(Boolean(window.Razorpay)), 1200);
        }
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

      // Safety timeout after 5 seconds to prevent hanging promises
      setTimeout(() => {
        resolve(Boolean(window.Razorpay));
      }, 5000);
    }
  });
};

export default loadRazorpayScript;
