// Загрузка каталога из products.json и рендер карточек
async function loadProducts() {
  try {
    const res = await fetch('products.json');
    const products = await res.json();
    const container = document.getElementById('products');
    container.innerHTML = '';

    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div class="product-info">
          <h3 class="product-title">${p.name}</h3>
          <p class="product-price">${p.price} ₸</p>
        </div>
        <button class="button" data-id="${p.id}">Добавить в корзину</button>
      `;
      container.appendChild(card);
    });

    // простой обработчик кнопок
    container.addEventListener('click', e => {
      if (e.target.matches('.button')) {
        const id = e.target.dataset.id;
        alert('Добавлен товар id=' + id);
      }
    });

  } catch (err) {
    console.error(err);
    document.getElementById('products').textContent = 'Не удалось загрузить товары.';
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);
