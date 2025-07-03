document.addEventListener('DOMContentLoaded', function() {
  const isMobileViewport = window.innerWidth < 768;
  if (!isMobileViewport) return;

  const productTitle = document.querySelector('.pd-info-title.product-info-title');
  if (!productTitle) return;

  const titleText = productTitle.textContent.toLowerCase();
  
  const keywords = [
    'v-neck backless dress',
    'sunshine tie strap dress',
    'Halter Pressure Pleat Dress',
    'Floral Strappy V-Neck Dress'
    'Raglan Floral Sleeve Dress'
  ].map(keyword => keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  const exactMatchRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'i');
  if (!exactMatchRegex.test(titleText)) return;

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
});
