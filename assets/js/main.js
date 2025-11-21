document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('products-container');
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-filter');

  const cartCount = document.getElementById('cartCount');
  const cartModal = document.getElementById('cartModal');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const openCartBtn = document.getElementById('openCart');
  const closeCartBtn = document.getElementById('closeCart');
  const clearCartBtn = document.getElementById('clearCart');

  const productModal = document.getElementById('productModal');
  const closeProductModalBtn = document.getElementById('closeProductModal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalPrice = document.getElementById('modal-price');
  const addToCartModalBtn = document.getElementById('addToCartModal');
  const modalQuantity = document.getElementById('modal-quantity');
  const modalDelivery = document.getElementById('modal-delivery');
  const toastEl = document.getElementById('toast');

  const products = [
    {id:"jeans-001", name:"Джинсы", image:"assets/images/jeans.jpg", price:15000, description:"Ыңғайлы көк джинсы.", sizes:["S","M","L","XL"], category:"jeans"},
    {id:"jeans-002", name:"Кең джинсы", image:"assets/images/jeans2.jpg", price:17000, description:"Заманауи кең дизайн.", sizes:["S","M","L","XL"], category:"jeans"},
    {id:"tshirt-001", name:"Футболка", image:"assets/images/tshirt.jpg", price:3500, description:"Жеңіл мақта футболка.", sizes:["S","M","L","XL"], category:"tshirt"},
    {id:"tshirt-002", name:"Оверсайз футболка", image:"assets/images/tshirt2.jpg", price:4000, description:"Оверсайз фасоны.", sizes:["S","M","L","XL"], category:"tshirt"},
    {id:"bag-001", name:"Сумка", image:"assets/images/bag.jpg", price:8000, description:"Сәнді мини сөмке.", sizes:[], category:"bag"},
    {id:"bag-002", name:"Үлкен сөмке", image:"assets/images/bag2.jpg", price:9000, description:"Ыңғайлы үлкен сөмке.", sizes:[], category:"bag"},
    {id:"jacket-001", name:"Жеңіл куртка", image:"assets/images/jacket.jpg", price:28000, description:"Жылы/салқын күндерге арналған.", sizes:["M","L","XL"], category:"jacket"},
    {id:"jacket-002", name:"Куртка", image:"assets/images/jacket2.jpg", price:22000, description:"Көктем мен күзге арналған.", sizes:["S","M","L"], category:"jacket"},
    {id:"hoodie-001", name:"Худи", image:"assets/images/hoodie.jpg", price:16000, description:"Жұмсақ және ыңғайлы худи.", sizes:["S","M","L","XL"], category:"hoodie"},
    {id:"hoodie-002", name:"Универсал худи", image:"assets/images/hoodie2.jpg", price:18000, description:"Жұмсақ, жылы және стильді худи.", sizes:["S","M","L","XL"], category:"hoodie"},
    {id:"sweater-001", name:"Свитер", price:20000, description:"Жылы, жұмсақ және ыңғайлы свитер.", sizes:["S","M","L","XL"], colors:[
      {name:"Pink", image:"assets/images/sweater/white.jpg"},
      {name:"Blue", image:"assets/images/sweater/blue.jpg"},
      {name:"White", image:"assets/images/sweater/pink.jpg"}
    ], category:"sweater"},
    {id:"sneakers-001", name:"Кроссовки", price:25000, description:"Ыңғайлы, жазғы аяқ киім.", sizes:["37","38","39","40"], colors:[
      {name:"Dark Blue", image:"assets/images/sneakers/dark blue.jpg"},
      {name:"Beige", image:"assets/images/sneakers/beige.jpg"},
      {name:"Light Pink", image:"assets/images/sneakers/light-pink.jpg"}
    ], category:"sneakers"}
  ];

  let cart = [];
  let selectedProduct = null;
  let selectedSize = null;
  let selectedColor = null;

  function showToast(msg){
    toastEl.textContent=msg;
    toastEl.classList.add('show');
    setTimeout(()=>toastEl.classList.remove('show'),1800);
  }

  function updateCart(){
    cartCount.textContent = cart.reduce((sum,item)=>sum+item.quantity,0);
    cartItemsContainer.innerHTML='';
    let total=0;
    cart.forEach(item=>{
      const sum=item.price*item.quantity;
      total+=sum;
      const div=document.createElement('div');
      div.className='cart-item';
      div.innerHTML=`
        <div class="meta">
          <strong>${item.name}</strong>
          <div>${item.size?`Размер: ${item.size}`:''}</div>
          <div>Түсі: ${item.color?item.color:''}</div>
          <div>Доставка: ${item.delivery}</div>
        </div>
        <div class="right">${item.quantity} × ${item.price}₸ = ${sum}₸</div>
      `;
      cartItemsContainer.appendChild(div);
    });
    cartTotal.textContent=total;
  }

  function addToCart(product,size=null,quantity=1,delivery="Самовывоз", color=null){
    cart.push({id:product.id,name:product.name,price:product.price,size,quantity,delivery,color});
    updateCart();
    showToast(`"${product.name}" добавлен в корзину`);
  }

  openCartBtn.addEventListener('click',()=>cartModal.classList.remove('hidden'));
  closeCartBtn.addEventListener('click',()=>cartModal.classList.add('hidden'));
  clearCartBtn.addEventListener('click',()=>{cart=[];updateCart();});

  function openProductModal(product){
    selectedProduct=product;
    selectedSize=null;
    selectedColor=null;

    modalImg.src = product.image || (product.colors ? product.colors[0].image : '');
    modalTitle.textContent = product.name;
    modalDesc.textContent = product.description;
    modalPrice.textContent = product.price + "₸";
    modalQuantity.value=1;

    // Размеры
    const sizeContainer = productModal.querySelector('.size-selection');
    sizeContainer.querySelectorAll('.size-btn').forEach(b=>b.remove());
    if(product.sizes && product.sizes.length>0){
      product.sizes.forEach(s=>{
        const btn=document.createElement('button');
        btn.className='size-btn';
        btn.textContent=s;
        btn.addEventListener('click',()=>{
          sizeContainer.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('selected'));
          btn.classList.add('selected');
          selectedSize=s;
        });
        sizeContainer.appendChild(btn);
      });
    }

    // Цвета
    const colorContainer = productModal.querySelector('.color-selection');
    colorContainer.querySelectorAll('.color-btn').forEach(b=>b.remove());
    if(product.colors && product.colors.length>0){
      product.colors.forEach(c=>{
        const btn=document.createElement('span');
        btn.className='color-btn';
        btn.style.backgroundImage = `url(${c.image})`;
        btn.addEventListener('click',()=>{
          colorContainer.querySelectorAll('.color-btn').forEach(b=>b.classList.remove('selected'));
          btn.classList.add('selected');
          modalImg.src=c.image;
          selectedColor=c.name;
        });
        colorContainer.appendChild(btn);
      });
    }

    productModal.classList.remove('hidden');
  }

  closeProductModalBtn.addEventListener('click',()=>productModal.classList.add('hidden'));
  addToCartModalBtn.addEventListener('click',()=>{
    const qty=Math.max(1,parseInt(modalQuantity.value));
    const delivery=modalDelivery.value==="courier"?"Курьер":"Самовывоз";
    addToCart(selectedProduct,selectedSize,qty,delivery,selectedColor);
    productModal.classList.add('hidden');
  });

  function createCard(product){
    const card=document.createElement('div');
    card.className='product-card';
    card.innerHTML=`
      <img src="${product.image || (product.colors ? product.colors[0].image : '')}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${product.price}₸</p>
      <div class="card-actions">
        <button class="view-product btn">Толығырақ</button>
        <button class="add-to-cart btn">Себетке қосу</button>
      </div>
    `;
    card.querySelector('.view-product').addEventListener('click',()=>openProductModal(product));
    card.querySelector('.add-to-cart').addEventListener('click',()=>addToCart(product,null,1,"Самовывоз", product.colors ? product.colors[0].name : null));
    return card;
  }

  function renderProducts(list){
    container.innerHTML='';
    list.forEach(p=>container.appendChild(createCard(p)));
  }

  function filterProducts(){
    let list=products.slice();
    const s=searchInput.value.toLowerCase();
    const c=categorySelect.value;
    if(c!=='all') list=list.filter(p=>p.category===c);
    if(s) list=list.filter(p=>p.name.toLowerCase().includes(s)||p.description.toLowerCase().includes(s));
    renderProducts(list);
  }

  function populateCategories(){
    categorySelect.innerHTML='<option value="all">Барлық категориялар</option>';
    [...new Set(products.map(p=>p.category))].forEach(c=>{
      const op=document.createElement('option'); op.value=c; op.textContent=c; categorySelect.appendChild(op);
    });
  }

  populateCategories();
  renderProducts(products);
  updateCart();
  searchInput.addEventListener('input',filterProducts);
  categorySelect.addEventListener('change',filterProducts);
});
