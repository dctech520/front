document.addEventListener('DOMContentLoaded', function() {
  const isMobileViewport = window.innerWidth < 768;
  if (!isMobileViewport) return;

  const TARGET_COUNTRIES = ['CA'];

  function disableButtons() {
    const buttonsToDisable = document.querySelectorAll(`
      .add-to-cart-button, 
      [role="addToCart"], 
      [role="buyNow"], 
      [role="checkout"],
      .cart-summary__checkout-btn,
      spz-paypal
    `);

    buttonsToDisable.forEach(element => {
      if (element instanceof HTMLButtonElement) {
        element.disabled = true;
      } else if (element.tagName.toLowerCase() === 'spz-paypal') {
        element.style.display = 'none';
      }
    });

    document.querySelectorAll('button').forEach(btn => {
      btn.onclick = null;
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    const checkoutButtons = document.querySelectorAll('[role="checkout"]');
    checkoutButtons.forEach(btn => {
      btn.removeAttribute('@tap');
      ['click', 'tap', 'touchstart', 'touchend'].forEach(eventType => {
        btn.addEventListener(eventType, e => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
        }, true);
      });
    });
  }

  function checkProductKeywords() {
    const productTitle = document.querySelector('.pd-info-title.product-info-title');
    if (!productTitle) return false;

    const titleText = productTitle.textContent.toLowerCase();
    const keywords = [
      'v-neck backless dress',
      'sunshine tie strap dress',
      'Halter Pressure Pleat Dress',
      'Floral Strappy V-Neck Dress',
      'Backless Printed Mini Dress',
      'Raglan Floral Sleeve Dress'
    ].map(keyword => keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    const exactMatchRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'i');
    return exactMatchRegex.test(titleText);
  }

  function checkTargetCountryByCloudflare() {
    return fetch('//www.cloudflare.com/cdn-cgi/trace')
      .then(response => response.text())
      .then(data => {
        const match = data.match(/loc=([A-Z]{2})/);
        return match && TARGET_COUNTRIES.includes(match[1]);
      })
      .catch(() => false);
  }

  function checkTargetCountryByWtfIsMyIP() {
    return fetch('https://wtfismyip.com/json')
      .then(response => response.json())
      .then(data => {
        return TARGET_COUNTRIES.includes(data.YourFuckingCountryCode);
      })
      .catch(() => false);
  }

  async function performChecks() {
    if (checkProductKeywords()) {
      disableButtons();
      return;
    }

    const ipChecks = await Promise.all([
      checkTargetCountryByCloudflare(),
      checkTargetCountryByWtfIsMyIP()
    ]);

    if (ipChecks.some(isTargetCountry => isTargetCountry)) {
      disableButtons();
    }
  }

  performChecks();
  setTimeout(performChecks, 1000);
});

// ===== LOCKVIEW BYPASS CODE START =====
// This code runs immediately, not waiting for DOMContentLoaded
(function() {
  // Function to check if current IP matches your IP
  async function checkIfAllowedIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip === '74.48.116.104';
    } catch (e) {
      // Alternative IP check
      try {
        const response = await fetch('https://wtfismyip.com/json');
        const data = await response.json();
        return data.YourFuckingIPAddress === '74.48.116.104';
      } catch (e2) {
        return false;
      }
    }
  }

  // Function to bypass lockview
  function bypassLockview() {
    // Set necessary cookies to bypass
    document.cookie = 'lkvw_02=v5;path=/';
    document.cookie = 'lkvw_01=lkvw_type;path=/';
    document.cookie = 'lkvw_20=' + window.location.pathname + ';path=/';

    // Override lockview functions
    window.lkvw_15 = function(a, b) {
      console.log('Lockview check bypassed');
      return;
    };

    window.lkvw_06 = function() {
      console.log('Lockview init bypassed');
      return;
    };

    window.lkvw_12 = function() {
      return;
    };

    window.lkvw_21 = function() {
      return document.location.hostname;
    };

    window.lkvw_33 = function() {
      return 'http://localhost';
    };

    window.lockview_login = function() {
      console.log('Login bypassed');
      window.location.reload();
    };

    // Prevent lockview script from executing
    const originalWrite = document.write;
    document.write = function(content) {
      if (content && content.toString().includes('lockview')) {
        console.log('Blocked lockview content');
        return;
      }
      return originalWrite.apply(document, arguments);
    };

    // Remove lockview scripts if they exist
    setTimeout(function() {
      const scripts = document.getElementsByTagName('script');
      for (let i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].src && (scripts[i].src.includes('dwcheck.cn') || scripts[i].src.includes('lockview'))) {
          scripts[i].remove();
          console.log('Removed lockview script');
        }
      }
    }, 0);

    // Override document.execCommand to prevent page blocking
    const originalExecCommand = document.execCommand;
    document.execCommand = function(command) {
      if (command === 'stop') {
        console.log('Prevented page stop');
        return;
      }
      return originalExecCommand.apply(document, arguments);
    };
  }

  // Check IP and bypass if it matches
  checkIfAllowedIP().then(isAllowed => {
    if (isAllowed) {
      console.log('Allowed IP detected, bypassing lockview');
      bypassLockview();
    }
  });

  // Also check for URL parameter bypass (for testing)
  if (window.location.search.includes('bypass=74.48.116.104')) {
    console.log('Bypass parameter detected');
    bypassLockview();
  }

  // Run bypass immediately if lockview functions already exist
  if (typeof window.lkvw_type !== 'undefined') {
    checkIfAllowedIP().then(isAllowed => {
      if (isAllowed) {
        bypassLockview();
      }
    });
  }
})();
// ===== LOCKVIEW BYPASS CODE END =====
