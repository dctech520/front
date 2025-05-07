document.addEventListener('DOMContentLoaded', function() {
  const isMobileViewport = window.innerWidth < 768;
  if (isMobileViewport) {
    const keywords = [
      'v-neck backless dress',
      'sunshine tie strap dress',
    ].map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    const exactMatchRegex = new RegExp(
      `(?:^|\\s)(${keywords.join('|')})(?:$|\\s)`,
      'i'
    );

    const hasMatch = exactMatchRegex.test(document.body.textContent);
    if (hasMatch) {
      const buttonsToDisable = document.querySelectorAll(`
        .add-to-cart-button, 
        [role="addToCart"], 
        [role="buyNow"], 
        spz-paypal
      `);

      buttonsToDisable.forEach(element => {
        if (element instanceof HTMLButtonElement) {
          element.disabled = true;
          // 移除了光标样式设置 ↓
        } else if (element.tagName.toLowerCase() === 'spz-paypal') {
          element.style.display = 'none';
        }
      });

      document.querySelectorAll('button').forEach(btn => {
        btn.onclick = null;
        btn.addEventListener('click', e => e.preventDefault());
      });
    }
  }
});
