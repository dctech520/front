document.addEventListener('DOMContentLoaded', function() {
  const isMobileViewport = window.innerWidth < 768;
  if (!isMobileViewport) return;

  // 禁用按钮的函数
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

  // 检查产品关键词
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

  // 方法1: Cloudflare trace API
  function checkUSByCloudflare() {
    return fetch('//www.cloudflare.com/cdn-cgi/trace')
      .then(response => response.text())
      .then(data => {
        const match = data.match(/loc=([A-Z]{2})/);
        return match && match[1] === 'US';
      })
      .catch(() => false);
  }

  // 方法2: wtfismyip API
  function checkUSByWtfIsMyIP() {
    return fetch('https://wtfismyip.com/json')
      .then(response => response.json())
      .then(data => {
        return data.YourFuckingCountryCode === 'US';
      })
      .catch(() => false);
  }

  // 方法3: Shopify browsing context API
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

  // 执行检查
  async function performChecks() {
    // 首先检查产品关键词
    if (checkProductKeywords()) {
      disableButtons();
      return;
    }

    // 并行检查所有IP检测方法
    const ipChecks = await Promise.all([
      checkUSByCloudflare(),
      checkUSByWtfIsMyIP(),
      checkUSByShopify()
    ]);

    // 如果任何一个方法检测到是美国IP，就禁用按钮
    if (ipChecks.some(isUS => isUS)) {
      disableButtons();
    }
  }

  // 立即执行检查
  performChecks();

  // 对于动态加载的内容，延迟再次检查
  setTimeout(performChecks, 1000);
});
