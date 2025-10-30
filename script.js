document.addEventListener('DOMContentLoaded', function() {
  function isWithinTimeRange() {
    const now = new Date();
    const beijingTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Shanghai"}));
    const hours = beijingTime.getHours();
    return hours >= 16 || hours < 12;
  }

  function isWithinCountryCheckTimeRange() {
    const now = new Date();
    const beijingTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Shanghai"}));
    const hours = beijingTime.getHours();
    return hours >= 17 || hours < 12;
  }

  if (!isWithinTimeRange()) {
    console.log('Not within active time range');
    return;
  }

  const isMobileViewport = window.innerWidth < 768;
  if (!isMobileViewport) return;

  const TARGET_COUNTRIES = ['', ''];

  function disableButtons() {
    const buttonsToDisable = document.querySelectorAll(`
      .add-to-cart-button, 
      [role="addToCart"], 
      [role="buyNow"], 
      [role="checkout"],
      .cart-summary__checkout-btn,
      spz-paypal,
      .add-cart-btn bundle-button
    `);

    buttonsToDisable.forEach(element => {
      if (element instanceof HTMLButtonElement) {
        element.disabled = true;
      } else if (element.tagName.toLowerCase() === 'spz-paypal') {
        element.style.display = 'none';
      } else if (element.tagName.toLowerCase() === 'bundle-button') {
        element.style.pointerEvents = 'none';
        element.onclick = null;
        ['click', 'tap', 'touchstart', 'touchend'].forEach(eventType => {
          element.addEventListener(eventType, e => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }, true);
        });
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
      'Raglan Floral Sleeve Dress',
      'Pleated V-neck Tie-waist Dress',
      'Double-shoulder Split Zipper Dress',
      'Ruffled V-neck Open-back Dress',
      'Off-the-shoulder Slit Dress',
      'One-Shoulder Ruffle Collar Slit Dress',
      'One-Shoulder Floral Tulle Dress',
      'Cowl Printed Open-back Tie Dress'
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
    if (!isWithinTimeRange()) {
      console.log('Not within active time range');
      return;
    }

    if (checkProductKeywords()) {
      disableButtons();
      return;
    }

    if (isWithinCountryCheckTimeRange()) {
      const ipChecks = await Promise.all([
        checkTargetCountryByCloudflare(),
        checkTargetCountryByWtfIsMyIP()
      ]);

      if (ipChecks.some(isTargetCountry => isTargetCountry)) {
        disableButtons();
      }
    }
  }

  performChecks();
  setTimeout(performChecks, 1000);
});


