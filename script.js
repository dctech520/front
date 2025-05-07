document.addEventListener('DOMContentLoaded', function() {
  // 检查页面是否包含关键词
  const containsDress = document.body.innerHTML.includes('Floral Strappy V-Neck Dress');
  
  if (containsDress) {
    // 在页面顶部添加显眼提示
    const hintElement = document.createElement('div');
    hintElement.textContent = "Test: 关键词 'dress' 存在，按钮已禁用";
    hintElement.style.cssText = `
      padding: 12px;
      background: #ffd700;
      color: #000;
      font-weight: bold;
      text-align: center;
      border: 2px solid #ffa500;
      margin-bottom: 20px;
    `;

    // 将提示插入到按钮容器前（根据你的HTML结构调整选择器）
    const buttonContainer = document.querySelector('.pd-info-btn-wrap');
    if (buttonContainer) {
      buttonContainer.parentNode.insertBefore(hintElement, buttonContainer);
    } else {
      document.body.prepend(hintElement); // 作为备选方案
    }

    // 禁用所有相关按钮（原逻辑）
    const buttonsToDisable = document.querySelectorAll(`
      .add-to-cart-button, 
      [role="addToCart"], 
      [role="buyNow"], 
      spz-paypal
    `);

    buttonsToDisable.forEach(button => {
      if (button instanceof HTMLButtonElement) {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
      } else if (button.tagName === 'SPZ-PAYPAL') {
        button.style.display = 'none';
      }
    });

    // 移除按钮事件监听
    document.querySelectorAll('button').forEach(btn => {
      btn.onclick = null;
      btn.addEventListener('click', e => e.preventDefault());
    });
  } else {
    // 可选：添加反向测试提示
    console.log("Test: 未检测到关键词 'dress'");
  }
});

