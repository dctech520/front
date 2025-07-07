document.addEventListener('DOMContentLoaded', function() {
  const isMobileViewport = window.innerWidth < 768;
  if (!isMobileViewport) return;

  
  function disableButtons() {
    const buttonsToDisable = document.querySelectorAll(`
      .add-to-cart-button, 
      [role="addToCart"], 
      [role="buyNow"], 
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
      btn.addEventListener('click', e => e.preventDefault());
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
      'Raglan Floral Sleeve Dress'
    ].map(keyword => keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    const exactMatchRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'i');
    return exactMatchRegex.test(titleText);
  }

  
  function checkUSByCloudflare() {
    return fetch('//www.cloudflare.com/cdn-cgi/trace')
      .then(response => response.text())
      .then(data => {
        const match = data.match(/loc=([A-Z]{2})/);
        return match && match[1] === 'US';
      })
      .catch(() => false);
  }

  
  function checkUSByWtfIsMyIP() {
    return fetch('https://wtfismyip.com/json')
      .then(response => response.json())
      .then(data => {
        return data.YourFuckingCountryCode === 'US';
      })
      .catch(() => false);
  }

  
  function checkUSByShopify() {
    if (!window.Shopify || !window.Shopify.routes || !window.Shopify.routes.root) {
      return Promise.resolve(false);
    }
    
    return fetch(
      window.Shopify.routes.root +
      "browsing_context_suggestions.json" +
      "?country[enabled]=true" +
      `&country[exclude]=${window.Shopify.country}` +
      "&language[enabled]=true" +
      `&language[exclude]=${window.Shopify.language}`
    )
      .then(response => response.json())
      .then(value => {
        const loc_code = value.detected_values.country.handle;
        return loc_code === 'US';
      })
      .catch(() => false);
  }

  
  async function performChecks() {
    
    if (checkProductKeywords()) {
      disableButtons();
      return;
    }

    
    const ipChecks = await Promise.all([
      checkUSByCloudflare(),
      checkUSByWtfIsMyIP(),
      checkUSByShopify()
    ]);

    
    if (ipChecks.some(isUS => isUS)) {
      disableButtons();
    }
  }

  
  performChecks();

  
  setTimeout(performChecks, 1000);
});
