document.addEventListener('DOMContentLoaded', function() {
  const bodyContent = document.body.innerHTML.toLowerCase();
  const containsDress = bodyContent.includes('v-neck backless dress') || bodyContent.includes('sunshine tie strap dress');
  
  if (containsDress) {
    const buttonsToDisable = document.querySelectorAll(`.add-to-cart-button, [role="addToCart"], [role="buyNow"], spz-paypal`);
    
    buttonsToDisable.forEach(button => {
      if (button instanceof HTMLButtonElement) {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
      }
      else if (button.tagName === 'SPZ-PAYPAL') {
        button.style.display = 'none';
      }
    });

    document.querySelectorAll('button').forEach(btn => {
      btn.onclick = null;
      btn.addEventListener('click', e => e.preventDefault());
    });
  }
});
