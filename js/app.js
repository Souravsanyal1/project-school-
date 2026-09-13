/**
 * Luxury Noor Flagship Application Script
 * Base Currency: BDT (৳)
 */

let activeView = "home"; // "home" | "shop" | "pdp" | "checkout" | "member"
let currentPdpProduct = null;
let selectedColor = "";
let selectedSize = "";
let currentPdpQty = 1;
let currentCategory = "all";
let searchQuery = "";
let currentSort = "featured";
let appliedCoupon = null;

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  checkAdminSecretHash();
});

window.addEventListener("hashchange", () => {
  checkAdminSecretHash();
});

function checkAdminSecretHash() {
  if (window.location.hash === "#admin-master-panel") {
    openAdminPortal();
  }
}

function initApp() {
  applyStoreSettings();
  renderCategories();
  renderFeaturedProducts();
  renderShopProducts();
  updateCartUI();
  updateWishlistUI();
  setupEventListeners();

  // Load initial view or product
  const defaultProduct = Store.getProductById("prod-1");
  if (defaultProduct) {
    loadProductDetail(defaultProduct.id, false);
  }

  // React to store updates
  window.addEventListener("storeUpdated", () => {
    applyStoreSettings();
    renderCategories();
    renderFeaturedProducts();
    renderShopProducts();
    updateCartUI();
    updateWishlistUI();
    if (activeView === "member") renderMemberOrders();
  });
}

// Switch Master Views (Home, Shop, PDP, Checkout, Member)
function switchView(viewName, scroll = true) {
  activeView = viewName;

  const views = ["home", "shop", "pdp", "checkout", "member"];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.style.display = (v === viewName) ? "block" : "none";
  });

  // Nav Links Active State
  document.querySelectorAll("[data-nav-target]").forEach(link => {
    const target = link.getAttribute("data-nav-target");
    if (target === viewName) {
      link.classList.add("text-secondary", "font-bold");
      link.classList.remove("text-on-surface-variant");
    } else {
      link.classList.remove("text-secondary", "font-bold");
      link.classList.add("text-on-surface-variant");
    }
  });

  if (viewName === "checkout") {
    renderCheckoutSummary();
    updatePaymentInstruction();
  } else if (viewName === "member") {
    renderMemberOrders();
  }

  if (scroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Apply Store Settings
function applyStoreSettings() {
  const settings = Store.getSettings();
  document.querySelectorAll(".site-name-display").forEach(el => el.textContent = settings.storeName);
  document.querySelectorAll(".site-tagline-display").forEach(el => el.textContent = settings.tagline);
  document.querySelectorAll(".site-phone-display").forEach(el => el.textContent = settings.contactPhone);
  document.querySelectorAll(".site-email-display").forEach(el => el.textContent = settings.contactEmail);
  document.querySelectorAll(".site-address-display").forEach(el => el.textContent = settings.address);
  document.querySelectorAll(".site-announcement-display").forEach(el => el.textContent = settings.announcement);

  // Dynamic Hero Section
  const heroBg = document.getElementById("hero-bg-container");
  if (heroBg) {
    const heroImgUrl = settings.heroBgImage || "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=85";
    heroBg.style.backgroundImage = `url('${heroImgUrl}')`;
  }
  const heroTitleEl = document.getElementById("hero-title-display");
  if (heroTitleEl && settings.heroTitle) heroTitleEl.textContent = settings.heroTitle;
  const heroSubEl = document.getElementById("hero-subtitle-display");
  if (heroSubEl && settings.heroSubtitle) heroSubEl.textContent = settings.heroSubtitle;
  const heroDescEl = document.getElementById("hero-desc-display");
  if (heroDescEl && settings.heroDescription) heroDescEl.textContent = settings.heroDescription;

  const insideFeeEl = document.getElementById("inside-dhaka-fee-label");
  const outsideFeeEl = document.getElementById("outside-dhaka-fee-label");
  if (insideFeeEl) insideFeeEl.textContent = `৳${settings.insideDhakaDelivery}`;
  if (outsideFeeEl) outsideFeeEl.textContent = `৳${settings.outsideDhakaDelivery}`;

  const waPromptMsg = document.getElementById("wa-custom-msg-input");
  if (waPromptMsg && !waPromptMsg.value) {
    waPromptMsg.value = settings.whatsappDefaultMsg || "Assalamu Alaikum, I want to inquire about your luxury items.";
  }
}

// Render Categories Grid (Homepage & Shop Filters)
function renderCategories() {
  const categories = Store.getCategories();
  const homeGrid = document.getElementById("home-categories-grid");
  const shopFilterContainer = document.getElementById("shop-category-filters");

  if (homeGrid) {
    homeGrid.innerHTML = categories.filter(c => c.id !== "all").map(cat => `
      <div class="group relative h-96 rounded-xl overflow-hidden flex flex-col justify-end p-6 border border-slate-200 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer bg-slate-900" onclick="filterByCategoryAndShop('${cat.id}')">
        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style="background-image: url('${cat.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}')"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
        <div class="relative z-10 flex flex-col justify-end">
          <span class="font-label-md text-amber-400 font-bold uppercase tracking-widest text-xs mb-1 drop-shadow">${cat.tag || cat.id}</span>
          <h3 class="font-headline-md text-white font-extrabold text-lg group-hover:text-amber-300 transition-colors drop-shadow-md">${cat.name}</h3>
          <div class="mt-3 flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Explore Collection <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </span>
          </div>
        </div>
      </div>
    `).join("");
  }

  if (shopFilterContainer) {
    shopFilterContainer.innerHTML = categories.map(cat => `
      <button class="category-filter-btn ${currentCategory === cat.id ? 'active' : 'inactive'}" onclick="setCategoryFilter('${cat.id}')">
        <span class="material-symbols-outlined text-[15px]">${cat.icon || 'diamond'}</span>
        <span>${cat.name}</span>
      </button>
    `).join("");
  }
}

function filterByCategoryAndShop(catId) {
  currentCategory = catId;
  renderCategories();
  renderShopProducts();
  switchView("shop");
}

function setCategoryFilter(catId) {
  currentCategory = catId;
  renderCategories();
  renderShopProducts();
}

// Render Featured Editions on Homepage
function renderFeaturedProducts() {
  const container = document.getElementById("home-featured-grid");
  if (!container) return;

  const products = Store.getProducts().slice(0, 3);
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  container.innerHTML = products.map(product => `
    <div class="group flex flex-col bg-white rounded-xl border border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div class="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 cursor-pointer" onclick="openProductDetailPage('${product.id}')">
        ${product.badge ? `<span class="absolute top-4 left-4 z-10 px-3 py-1 bg-slate-950 text-amber-400 font-label-md font-bold uppercase tracking-wider rounded border border-amber-500/50 shadow-md text-xs">${product.badge}</span>` : ''}
        <button class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-slate-700 hover:text-amber-600 shadow-md transition-colors" onclick="event.stopPropagation(); toggleWishlist('${product.id}')" title="Save to Wishlist">
          <span class="material-symbols-outlined text-[20px]" style="${isWishlisted(product.id) ? "font-variation-settings: 'FILL' 1; color: #d97706;" : ''}">favorite</span>
        </button>
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
      </div>
      <div class="p-6 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <div class="flex items-center gap-1 text-amber-500 mb-2">
            ${getStarRatingIcons(product.rating || 5)}
            <span class="font-body-sm text-slate-500 font-bold ml-2">(${product.reviewsCount || 20} Reviews)</span>
          </div>
          <h3 class="font-headline-sm text-slate-900 font-extrabold text-lg cursor-pointer hover:text-amber-600 transition-colors" onclick="openProductDetailPage('${product.id}')">${product.name}</h3>
          <p class="font-body-sm text-slate-600 font-normal mt-1.5 line-clamp-2 leading-relaxed">${product.description || ''}</p>
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span class="font-headline-md text-amber-700 font-extrabold text-xl">${curr}${Number(product.price).toLocaleString()}</span>
            ${product.regularPrice && product.regularPrice > product.price ? `<span class="text-xs text-slate-400 line-through block font-medium">${curr}${Number(product.regularPrice).toLocaleString()}</span>` : ''}
          </div>
          <button class="btn-black px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg" onclick="addToBagDirect('${product.id}')">
            <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// Render Full Shop Catalog
function renderShopProducts() {
  const container = document.getElementById("shop-products-grid");
  const countEl = document.getElementById("shop-product-count");
  if (!container) return;

  let products = Store.getProducts();

  // Category filter
  if (currentCategory !== "all") {
    products = products.filter(p => p.category === currentCategory);
  }

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (currentSort === "price-low") {
    products.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-high") {
    products.sort((a, b) => b.price - a.price);
  } else if (currentSort === "rating") {
    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  if (countEl) countEl.textContent = `Showing ${products.length} Curated Masterpieces`;

  if (products.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200">
        <span class="material-symbols-outlined text-[54px] text-amber-500/60 mb-3">inventory_2</span>
        <h3 class="font-headline-md text-slate-900 font-bold">No Masterpieces Found</h3>
        <p class="text-body-md mt-2 text-slate-600">Try adjusting your search criteria or selecting another category.</p>
      </div>
    `;
    return;
  }

  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  container.innerHTML = products.map(product => `
    <div class="group flex flex-col bg-white rounded-xl border border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div class="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 cursor-pointer" onclick="openProductDetailPage('${product.id}')">
        ${product.badge ? `<span class="absolute top-4 left-4 z-10 px-3 py-1 bg-slate-950 text-amber-400 font-label-md font-bold uppercase tracking-wider rounded border border-amber-500/50 shadow-md text-xs">${product.badge}</span>` : ''}
        <button class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-slate-700 hover:text-amber-600 shadow-md transition-colors" onclick="event.stopPropagation(); toggleWishlist('${product.id}')" title="Save to Wishlist">
          <span class="material-symbols-outlined text-[20px]" style="${isWishlisted(product.id) ? "font-variation-settings: 'FILL' 1; color: #d97706;" : ''}">favorite</span>
        </button>
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
      </div>
      <div class="p-6 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <div class="flex items-center gap-1 text-amber-500 mb-2">
            ${getStarRatingIcons(product.rating || 5)}
            <span class="font-body-sm text-slate-500 font-bold ml-2">(${product.reviewsCount || 24} Reviews)</span>
          </div>
          <h3 class="font-headline-sm text-slate-900 font-extrabold text-lg cursor-pointer hover:text-amber-600 transition-colors" onclick="openProductDetailPage('${product.id}')">${product.name}</h3>
          <p class="font-body-sm text-slate-600 font-normal mt-1.5 line-clamp-2 leading-relaxed">${product.description || ''}</p>
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span class="font-headline-md text-amber-700 font-extrabold text-xl">${curr}${Number(product.price).toLocaleString()}</span>
            ${product.regularPrice && product.regularPrice > product.price ? `<span class="text-xs text-slate-400 line-through block font-medium">${curr}${Number(product.regularPrice).toLocaleString()}</span>` : ''}
          </div>
          <button class="btn-black px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg" onclick="addToBagDirect('${product.id}')">
            <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// Open and populate PDP (Product Detail Page)
function openProductDetailPage(productId) {
  loadProductDetail(productId, true);
  switchView("pdp");
}

function loadProductDetail(productId, shouldScroll = false) {
  const product = Store.getProductById(productId);
  if (!product) return;

  currentPdpProduct = product;
  currentPdpQty = 1;
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  // Breadcrumbs & Ref
  document.getElementById("pdp-breadcrumb-title").textContent = product.name;
  document.getElementById("pdp-ref-code").textContent = `Ref. NOOR-${product.id.toUpperCase()}`;

  // Title, Category, Rating & Pricing
  document.getElementById("pdp-title").textContent = product.name;
  document.getElementById("pdp-category").textContent = getCategoryName(product.category);
  document.getElementById("pdp-reviews-count").textContent = `(${product.reviewsCount || 48} Reviews)`;
  document.getElementById("pdp-price").textContent = `${curr}${Number(product.price).toLocaleString()}`;
  
  const regPriceEl = document.getElementById("pdp-regular-price");
  if (product.regularPrice && product.regularPrice > product.price) {
    regPriceEl.textContent = `${curr}${Number(product.regularPrice).toLocaleString()}`;
    regPriceEl.style.display = "inline";
  } else {
    regPriceEl.style.display = "none";
  }

  document.getElementById("pdp-desc").textContent = product.description || "An exquisite piece celebrating Islamic heritage and master craftsmanship.";

  // Images & Gallery
  const gallery = (product.gallery && product.gallery.length) ? product.gallery : [product.image];
  const thumbsContainer = document.getElementById("pdp-thumbnails-container");
  const mainImg = document.getElementById("pdp-main-img");
  if (mainImg) mainImg.src = gallery[0];

  if (thumbsContainer) {
    thumbsContainer.innerHTML = gallery.map((imgUrl, idx) => `
      <button class="thumb-btn relative w-20 h-24 flex-shrink-0 bg-surface-container overflow-hidden border-2 ${idx === 0 ? 'border-secondary' : 'border-transparent hover:border-secondary/50'} transition-all" onclick="switchPdpImage('${imgUrl}', this)">
        <img class="w-full h-full object-cover" src="${imgUrl}" alt="">
      </button>
    `).join("");
  }

  // Colors
  const colors = product.colors || ["Onyx Black", "Desert Sand", "Midnight Navy", "Olive Heritage"];
  selectedColor = colors[0];
  document.getElementById("selected-color-name").textContent = selectedColor;
  const colorSwatchesBox = document.getElementById("pdp-color-swatches");
  if (colorSwatchesBox) {
    const colorHexMap = {
      "Onyx Black": "#111111",
      "Desert Sand": "#D4C3A3",
      "Midnight Navy": "#1A2530",
      "Olive Heritage": "#4A4E3D",
      "Emerald & Gold": "#064e3b",
      "Champagne Gold": "#d4af37",
      "Jet Black": "#000000",
      "Ivory Cream": "#fdfbf7"
    };
    colorSwatchesBox.innerHTML = colors.map((col, idx) => `
      <button class="color-swatch w-10 h-10 rounded-full transition-all ${idx === 0 ? 'ring-2 ring-secondary ring-offset-2 ring-offset-surface' : 'ring-1 ring-secondary/30 hover:ring-secondary'}" style="background-color: ${colorHexMap[col] || '#333333'};" onclick="selectPdpColor('${col}', this)" title="${col}"></button>
    `).join("");
  }

  // Sizes
  const sizes = product.sizes || ["52 (Petite)", "54 (Standard)", "56 (Tall)", "58 (Grand)"];
  selectedSize = sizes[0];
  const sizeGridBox = document.getElementById("pdp-sizes-grid");
  if (sizeGridBox) {
    sizeGridBox.innerHTML = sizes.map((sz, idx) => `
      <button class="size-btn py-3 border text-body-sm text-on-surface font-medium transition-all ${idx === 0 ? 'border-secondary bg-secondary/5' : 'border-outline-variant hover:border-secondary'}" onclick="selectPdpSize('${sz}', this)">
        ${sz}
      </button>
    `).join("");
  }

  document.getElementById("pdp-qty-display").innerText = "1";

  // Related Products Grid on PDP
  renderPdpRelatedProducts(product.id, product.category);
}

function switchPdpImage(imgUrl, btn) {
  const mainImg = document.getElementById("pdp-main-img");
  if (mainImg) mainImg.src = imgUrl;

  document.querySelectorAll(".thumb-btn").forEach(b => {
    b.classList.remove("border-secondary");
    b.classList.add("border-transparent");
  });
  if (btn) {
    btn.classList.add("border-secondary");
    btn.classList.remove("border-transparent");
  }
}

function selectPdpColor(colorName, btn) {
  selectedColor = colorName;
  document.getElementById("selected-color-name").innerText = colorName;
  document.querySelectorAll(".color-swatch").forEach(b => {
    b.classList.remove("ring-2", "ring-secondary", "ring-offset-2", "ring-offset-surface");
    b.classList.add("ring-1", "ring-secondary/30");
  });
  btn.classList.remove("ring-1", "ring-secondary/30");
  btn.classList.add("ring-2", "ring-secondary", "ring-offset-2", "ring-offset-surface");
}

function selectPdpSize(sizeName, btn) {
  selectedSize = sizeName;
  document.querySelectorAll(".size-btn").forEach(b => {
    b.classList.remove("border-secondary", "bg-secondary/5");
    b.classList.add("border-outline-variant");
  });
  btn.classList.remove("border-outline-variant");
  btn.classList.add("border-secondary", "bg-secondary/5");
}

function incrementPdpQty() {
  currentPdpQty++;
  document.getElementById("pdp-qty-display").innerText = currentPdpQty;
}

function decrementPdpQty() {
  if (currentPdpQty > 1) {
    currentPdpQty--;
    document.getElementById("pdp-qty-display").innerText = currentPdpQty;
  }
}

function addCurrentPdpToCart() {
  if (!currentPdpProduct) return;
  Store.addToCart(currentPdpProduct, currentPdpQty, { color: selectedColor, size: selectedSize });
  showToast(`"${currentPdpProduct.name.slice(0, 24)}..." added to your bag!`, "success");
  openCartDrawer();
}

function buyCurrentPdpNow() {
  if (!currentPdpProduct) return;
  Store.addToCart(currentPdpProduct, currentPdpQty, { color: selectedColor, size: selectedSize });
  switchView("checkout");
}

function addToBagDirect(productId) {
  const product = Store.getProductById(productId);
  if (!product) return;
  Store.addToCart(product, 1);
  showToast(`"${product.name.slice(0, 24)}..." added to your bag!`, "success");
}

function renderPdpRelatedProducts(currentId, category) {
  const container = document.getElementById("pdp-related-grid");
  if (!container) return;

  const products = Store.getProducts().filter(p => p.id !== currentId).slice(0, 3);
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  container.innerHTML = products.map(product => `
    <div class="group cursor-pointer space-y-4" onclick="openProductDetailPage('${product.id}')">
      <div class="relative bg-surface-container overflow-hidden aspect-[4/5]">
        <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${product.image}" alt="">
        <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-headline-sm text-on-surface group-hover:text-secondary transition-colors">${product.name}</h3>
          <p class="text-body-sm text-on-surface-variant">${getCategoryName(product.category)}</p>
        </div>
        <span class="font-headline-sm text-on-surface">${curr}${Number(product.price).toLocaleString()}</span>
      </div>
    </div>
  `).join("");
}

// Accordion Toggle
function toggleAccordion(id) {
  const content = document.getElementById(id);
  const icon = document.getElementById(id + "-icon");
  if (!content) return;
  if (content.classList.contains("hidden")) {
    content.classList.remove("hidden");
    if (icon) icon.innerText = "remove";
  } else {
    content.classList.add("hidden");
    if (icon) icon.innerText = "add";
  }
}

// Cart Drawer & Checkout UI Updates
function updateCartUI() {
  const cart = Store.getCart();
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count-badge").forEach(el => el.textContent = totalCount);

  const drawerBody = document.getElementById("cart-drawer-body");
  const subtotalEl = document.getElementById("cart-drawer-subtotal");
  if (!drawerBody) return;

  if (cart.length === 0) {
    drawerBody.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center py-24 text-on-surface-variant">
        <span class="material-symbols-outlined text-[54px] text-secondary/40 mb-3">shopping_bag</span>
        <h4 class="font-headline-sm text-on-surface">Your Bag is Empty</h4>
        <p class="text-body-sm mt-1">Explore our curated collections and add bespoke items.</p>
        <button class="mt-6 px-6 py-3 bg-primary text-on-primary font-label-md uppercase tracking-wider hover:bg-secondary hover:text-on-secondary transition-colors" onclick="closeCartDrawer(); switchView('shop');">
          Explore Collection
        </button>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = `${curr}0`;
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (subtotalEl) subtotalEl.textContent = `${curr}${subtotal.toLocaleString()}`;

  drawerBody.innerHTML = cart.map(item => `
    <div class="flex gap-4 py-4 border-b border-secondary/10 items-center relative">
      <img src="${item.image}" alt="" class="w-20 h-24 object-cover bg-surface-container flex-shrink-0">
      <div class="flex-grow min-w-0">
        <div class="flex justify-between items-start">
          <h4 class="font-headline-sm text-on-surface truncate pr-6">${item.name}</h4>
          <button class="text-on-surface-variant hover:text-error transition-colors" onclick="Store.removeFromCart('${item.cartItemId || item.id}')">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
        <p class="text-body-sm text-on-surface-variant mt-0.5">${item.color || 'Standard'} • ${item.size || 'Free Size'}</p>
        <div class="flex justify-between items-center mt-3">
          <div class="flex items-center border border-outline-variant">
            <button class="px-2 py-0.5 text-on-surface-variant hover:text-secondary" onclick="Store.updateCartQty('${item.cartItemId || item.id}', -1)">-</button>
            <span class="px-3 text-body-sm font-medium">${item.quantity}</span>
            <button class="px-2 py-0.5 text-on-surface-variant hover:text-secondary" onclick="Store.updateCartQty('${item.cartItemId || item.id}', 1)">+</button>
          </div>
          <span class="font-headline-sm text-primary">${curr}${Number(item.price * item.quantity).toLocaleString()}</span>
        </div>
      </div>
    </div>
  `).join("");
}

function openCartDrawer() {
  document.getElementById("cart-drawer-modal").classList.add("active");
}
function closeCartDrawer() {
  document.getElementById("cart-drawer-modal").classList.remove("active");
}

// Checkout Breakdown
function renderCheckoutSummary() {
  const cart = Store.getCart();
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  const itemsContainer = document.getElementById("checkout-items-list");
  const countBadge = document.getElementById("checkout-items-count");
  if (!itemsContainer) return;

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (countBadge) countBadge.textContent = `(${totalCount} Items)`;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryRadio = document.querySelector('input[name="checkoutDelivery"]:checked');
  const deliveryArea = deliveryRadio ? deliveryRadio.value : "inside";
  const deliveryFee = deliveryArea === "inside" ? Number(settings.insideDhakaDelivery) : Number(settings.outsideDhakaDelivery);

  let discount = 0;
  if (appliedCoupon) {
    const validCheck = Store.validateCoupon(appliedCoupon.code, subtotal);
    if (validCheck.valid) {
      discount = validCheck.discount;
    } else {
      appliedCoupon = null;
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  if (cart.length === 0) {
    itemsContainer.innerHTML = `<p class="text-body-sm text-on-surface-variant py-4">Your bag is empty.</p>`;
  } else {
    itemsContainer.innerHTML = cart.map(item => `
      <div class="flex gap-4 py-4 border-b border-secondary/10 items-center">
        <img src="${item.image}" alt="" class="w-16 h-20 bg-surface-container object-cover flex-shrink-0">
        <div class="flex-grow min-w-0">
          <div class="flex justify-between items-start">
            <h4 class="font-headline-sm text-on-surface truncate">${item.name}</h4>
            <button class="text-on-surface-variant hover:text-error transition-colors" onclick="Store.removeFromCart('${item.cartItemId || item.id}')">
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <p class="text-body-sm text-on-surface-variant">${item.color || 'Standard'} • ${item.size || 'Standard'}</p>
          <div class="flex justify-between items-center mt-2">
            <div class="flex items-center border border-outline-variant">
              <button class="px-2 py-0.5 text-on-surface-variant hover:text-secondary" onclick="Store.updateCartQty('${item.cartItemId || item.id}', -1)">-</button>
              <span class="px-3 text-body-sm font-medium">${item.quantity}</span>
              <button class="px-2 py-0.5 text-on-surface-variant hover:text-secondary" onclick="Store.updateCartQty('${item.cartItemId || item.id}', 1)">+</button>
            </div>
            <span class="font-headline-sm text-primary">${curr}${Number(item.price * item.quantity).toLocaleString()}</span>
          </div>
        </div>
      </div>
    `).join("");
  }

  document.getElementById("checkout-subtotal").textContent = `${curr}${subtotal.toLocaleString()}`;
  document.getElementById("checkout-delivery-fee").textContent = `${curr}${deliveryFee.toLocaleString()}`;
  document.getElementById("checkout-discount").textContent = `-${curr}${discount.toLocaleString()}`;
  document.getElementById("checkout-grand-total").textContent = `${curr}${grandTotal.toLocaleString()}`;
}

function applyCheckoutCoupon() {
  const input = document.getElementById("checkout-coupon-input");
  const code = input ? input.value.trim() : "";
  if (!code) {
    showToast("Please enter a VIP code", "warning");
    return;
  }

  const cart = Store.getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const result = Store.validateCoupon(code, subtotal);

  const msgEl = document.getElementById("checkout-coupon-msg");

  if (result.valid) {
    appliedCoupon = result.coupon;
    if (msgEl) {
      msgEl.textContent = `✓ VIP Privilege Applied (-৳${result.discount.toLocaleString()})`;
      msgEl.className = "text-body-sm text-secondary font-medium block";
    }
    showToast(`VIP Code ${code} applied successfully!`, "success");
    renderCheckoutSummary();
  } else {
    if (msgEl) {
      msgEl.textContent = result.message;
      msgEl.className = "text-body-sm text-error font-medium block";
    }
    showToast(result.message, "error");
  }
}

function updatePaymentInstruction() {
  const method = document.querySelector('input[name="paymentMethod"]:checked')?.value || "cod";
  const settings = Store.getSettings();
  const box = document.getElementById("checkout-payment-instruction-box");
  const trxGroup = document.getElementById("checkout-trxid-group");

  if (!box) return;

  if (method === "bkash") {
    if (trxGroup) trxGroup.style.display = "block";
    box.innerHTML = `
      <div class="p-4 bg-surface-container-low border border-secondary/20 text-body-sm space-y-2">
        <h5 class="font-headline-sm text-[#e2136e] flex items-center gap-2"><i class="fas fa-mobile-alt"></i> bKash Payment Instructions:</h5>
        <p>1. Open your bKash App & select <strong>Send Money</strong>.</p>
        <p>2. bKash Number: <strong>${settings.bkashNumber || '01700000000'}</strong></p>
        <p>3. Input the required total BDT amount and enter your <strong>TrxID</strong> below.</p>
      </div>
    `;
  } else if (method === "nagad") {
    if (trxGroup) trxGroup.style.display = "block";
    box.innerHTML = `
      <div class="p-4 bg-surface-container-low border border-secondary/20 text-body-sm space-y-2">
        <h5 class="font-headline-sm text-[#f7931e] flex items-center gap-2"><i class="fas fa-wallet"></i> Nagad Payment Instructions:</h5>
        <p>1. Send Money from your Nagad App to: <strong>${settings.nagadNumber || '01800000000'}</strong></p>
        <p>2. Enter the received Transaction ID (TrxID) in the input field below.</p>
      </div>
    `;
  } else if (method === "rocket") {
    if (trxGroup) trxGroup.style.display = "block";
    box.innerHTML = `
      <div class="p-4 bg-surface-container-low border border-secondary/20 text-body-sm space-y-2">
        <h5 class="font-headline-sm text-[#8c3494] flex items-center gap-2"><i class="fas fa-rocket"></i> Rocket Payment Instructions:</h5>
        <p>1. Send Money to: <strong>${settings.rocketNumber || '01900000000-8'}</strong></p>
        <p>2. Input the Transaction ID (TrxID) below.</p>
      </div>
    `;
  } else {
    if (trxGroup) trxGroup.style.display = "none";
    box.innerHTML = `
      <div class="p-4 bg-surface-container-low border border-secondary/20 text-body-sm space-y-1">
        <h5 class="font-headline-sm text-secondary flex items-center gap-2"><i class="fas fa-truck"></i> Cash on Delivery (COD):</h5>
        <p>Inspect your curated parcel upon arrival before completing payment. White-glove delivery across Bangladesh.</p>
      </div>
    `;
  }
}

// Handle Checkout Form Submission
function handleCompleteOrder(e) {
  if (e) e.preventDefault();
  const cart = Store.getCart();
  if (cart.length === 0) {
    showToast("Your bag is empty! Please add masterpieces before checkout.", "warning");
    return;
  }

  const name = (document.getElementById("checkout-first-name")?.value || "") + " " + (document.getElementById("checkout-last-name")?.value || "");
  const email = document.getElementById("checkout-email")?.value || "";
  const phone = document.getElementById("checkout-phone")?.value || "";
  const address = (document.getElementById("checkout-street")?.value || "") + ", " + (document.getElementById("checkout-city")?.value || "");
  const deliveryArea = document.querySelector('input[name="checkoutDelivery"]:checked')?.value || "inside";
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "cod";
  const trxId = document.getElementById("checkout-trxid-input")?.value || (paymentMethod === "cod" ? "N/A (Cash on Delivery)" : "Pending");

  if (!phone || !address) {
    showToast("Please provide your delivery address and contact telephone number", "error");
    return;
  }

  const settings = Store.getSettings();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryArea === "inside" ? Number(settings.insideDhakaDelivery) : Number(settings.outsideDhakaDelivery);

  let discount = 0;
  let couponCode = "";
  if (appliedCoupon) {
    const valid = Store.validateCoupon(appliedCoupon.code, subtotal);
    if (valid.valid) {
      discount = valid.discount;
      couponCode = appliedCoupon.code;
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const orderData = {
    customerName: name.trim() || "Valued Patron",
    email: email,
    phone: phone,
    address: address,
    deliveryArea: deliveryArea,
    deliveryFee: deliveryFee,
    paymentMethod: paymentMethod,
    trxId: trxId,
    items: [...cart],
    subtotal: subtotal,
    discount: discount,
    couponCode: couponCode,
    total: grandTotal
  };

  const createdOrder = Store.createOrder(orderData);
  Store.clearCart();
  showOrderSuccessModal(createdOrder);
}

// Order Confirmation Modal
function showOrderSuccessModal(order) {
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  const modal = document.getElementById("order-success-modal");
  const container = document.getElementById("order-success-content");

  container.innerHTML = `
    <div class="text-center space-y-4">
      <div class="w-16 h-16 rounded-full bg-secondary/10 text-secondary border border-secondary flex items-center justify-center mx-auto text-2xl">
        <span class="material-symbols-outlined text-[32px]" style="font-variation-settings: 'FILL' 1;">verified</span>
      </div>
      <span class="font-label-md text-secondary uppercase tracking-[0.2em] block">Commission Confirmed</span>
      <h2 class="font-headline-lg text-on-surface">Thank You for Your Patronage</h2>
      <p class="text-body-md text-on-surface-variant">Your order reference is <strong class="text-secondary font-mono tracking-wider">${order.orderId}</strong></p>
    </div>

    <div class="my-6 p-6 bg-surface-container-low border border-secondary/20 space-y-3 text-body-sm">
      <div class="flex justify-between">
        <span class="text-on-surface-variant">Patron:</span>
        <strong class="text-on-surface">${order.customerName}</strong>
      </div>
      <div class="flex justify-between">
        <span class="text-on-surface-variant">Contact:</span>
        <strong class="text-on-surface">${order.phone}</strong>
      </div>
      <div class="flex justify-between">
        <span class="text-on-surface-variant">Payment Method:</span>
        <strong class="text-secondary uppercase">${order.paymentMethod} (${order.trxId})</strong>
      </div>
      <div class="flex justify-between pt-3 border-t border-secondary/15 font-headline-sm">
        <span class="text-on-surface">Total BDT:</span>
        <strong class="text-primary">${curr}${Number(order.total).toLocaleString()}</strong>
      </div>
    </div>

    <div class="flex gap-4">
      <button class="flex-1 py-3 bg-secondary text-on-secondary font-label-md uppercase tracking-wider hover:bg-primary transition-colors" onclick="printInvoice('${order.orderId}')">
        <i class="fas fa-print mr-2"></i> Print Invoice
      </button>
      <button class="flex-1 py-3 bg-primary text-on-primary font-label-md uppercase tracking-wider hover:bg-secondary hover:text-on-secondary transition-colors" onclick="closeOrderSuccessModal(); switchView('member');">
        Track in Portal
      </button>
    </div>
  `;

  modal.classList.add("active");
}

function closeOrderSuccessModal() {
  document.getElementById("order-success-modal").classList.remove("active");
}

// Member Portal & Live 5-Step Order Tracking
function renderMemberOrders() {
  const orders = Store.getOrders();
  const container = document.getElementById("member-orders-container");
  if (!container) return;

  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  if (orders.length === 0) {
    container.innerHTML = `<p class="text-body-sm text-on-surface-variant p-6">No recent commissions found.</p>`;
    return;
  }

  const latest = orders[0];
  const step = latest.currentStep || 2;

  container.innerHTML = `
    <!-- Active Order Tracking Card -->
    <div class="bg-surface-container-low p-8 border border-secondary/30 shadow-sm relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-secondary/10">
        <div>
          <span class="font-label-md text-secondary uppercase tracking-widest block mb-1">Order #${latest.orderId}</span>
          <h3 class="font-headline-md text-on-surface">${latest.items.map(i => i.name).join(" & ")}</h3>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 bg-secondary-container text-on-secondary-container font-label-md uppercase tracking-wider">${latest.status}</span>
          <span class="text-body-sm text-on-surface-variant">${latest.date}</span>
        </div>
      </div>

      <!-- Modern Visual Order Tracking Timeline (5 Steps) -->
      <div class="py-6">
        <div class="relative">
          <div class="absolute top-1/2 left-0 w-full h-[2px] bg-secondary/20 -translate-y-1/2 hidden md:block"></div>
          <div class="absolute top-1/2 left-0 h-[2px] bg-secondary -translate-y-1/2 hidden md:block transition-all duration-1000" style="width: ${(step / 5) * 100}%;"></div>
          
          <div class="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            <!-- Step 1 -->
            <div class="flex md:flex-col items-center gap-4 md:text-center ${step >= 1 ? '' : 'opacity-50'}">
              <div class="w-10 h-10 rounded-full ${step >= 1 ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant'} flex items-center justify-center shadow-md shrink-0">
                <span class="material-symbols-outlined text-[20px]">check</span>
              </div>
              <div>
                <span class="font-label-md text-secondary uppercase block mb-1">Step 01</span>
                <h4 class="font-headline-sm text-on-surface">Order Placed</h4>
                <p class="text-body-sm text-on-surface-variant">Confirmed</p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="flex md:flex-col items-center gap-4 md:text-center ${step >= 2 ? '' : 'opacity-50'}">
              <div class="w-10 h-10 rounded-full ${step >= 2 ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant'} flex items-center justify-center shadow-md shrink-0">
                <span class="material-symbols-outlined text-[20px]">handyman</span>
              </div>
              <div>
                <span class="font-label-md text-secondary uppercase block mb-1">Step 02</span>
                <h4 class="font-headline-sm text-on-surface">Artisanal Crafting</h4>
                <p class="text-body-sm text-on-surface-variant">Atelier Tailoring</p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="flex md:flex-col items-center gap-4 md:text-center ${step >= 3 ? '' : 'opacity-50'}">
              <div class="w-10 h-10 rounded-full ${step === 3 ? 'bg-primary text-secondary-fixed ring-4 ring-secondary/30' : (step > 3 ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant')} flex items-center justify-center shadow-lg shrink-0">
                <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">verified</span>
              </div>
              <div>
                <span class="font-label-md text-secondary uppercase block mb-1">Step 03</span>
                <h4 class="font-headline-sm text-on-surface ${step === 3 ? 'font-bold' : ''}">Quality Inspection</h4>
                <p class="text-body-sm text-secondary">${step === 3 ? 'In Progress' : 'Inspected'}</p>
              </div>
            </div>

            <!-- Step 4 -->
            <div class="flex md:flex-col items-center gap-4 md:text-center ${step >= 4 ? '' : 'opacity-50'}">
              <div class="w-10 h-10 rounded-full ${step >= 4 ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant'} flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[20px]">local_shipping</span>
              </div>
              <div>
                <span class="font-label-md text-on-surface-variant uppercase block mb-1">Step 04</span>
                <h4 class="font-headline-sm text-on-surface">Dispatched</h4>
                <p class="text-body-sm text-on-surface-variant">Courier En Route</p>
              </div>
            </div>

            <!-- Step 5 -->
            <div class="flex md:flex-col items-center gap-4 md:text-center ${step >= 5 ? '' : 'opacity-50'}">
              <div class="w-10 h-10 rounded-full ${step >= 5 ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant'} flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[20px]">home</span>
              </div>
              <div>
                <span class="font-label-md text-on-surface-variant uppercase block mb-1">Step 05</span>
                <h4 class="font-headline-sm text-on-surface">Delivered</h4>
                <p class="text-body-sm text-on-surface-variant">White-Glove Handover</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-secondary/10 flex flex-wrap justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <img src="${latest.items[0]?.image || ''}" class="w-14 h-14 object-cover bg-surface-container border border-secondary/20 shrink-0">
          <div>
            <span class="font-headline-sm text-on-surface block">${latest.items[0]?.name || ''}</span>
            <span class="text-body-sm text-on-surface-variant">Total Bill: <strong>${curr}${Number(latest.total).toLocaleString()}</strong></span>
          </div>
        </div>
        <div class="flex gap-3">
          <button class="px-4 py-2 border border-secondary text-secondary hover:bg-secondary hover:text-on-secondary transition-colors font-headline-sm text-body-sm uppercase" onclick="printInvoice('${latest.orderId}')">
            View Invoice
          </button>
          <button class="px-4 py-2 bg-primary text-on-primary hover:bg-secondary hover:text-on-secondary transition-colors font-headline-sm text-body-sm uppercase" onclick="toggleWhatsAppPopup()">
            Contact Concierge
          </button>
        </div>
      </div>
    </div>

    <!-- Past Orders List -->
    <div class="bg-surface-container-low p-6 border border-secondary/20 space-y-4">
      <h3 class="font-headline-sm uppercase text-on-surface tracking-wider mb-4">Past Commissions & Orders</h3>
      ${orders.map(o => `
        <div class="p-4 bg-surface-container-lowest border border-secondary/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <img src="${o.items[0]?.image || ''}" class="w-12 h-12 object-cover bg-surface-container border border-secondary/20 shrink-0">
            <div>
              <span class="font-label-md text-secondary uppercase">Order #${o.orderId}</span>
              <h4 class="font-headline-sm text-on-surface">${o.items.map(i => i.name).join(", ")}</h4>
              <p class="text-body-sm text-on-surface-variant">${o.date} • Total: ${curr}${Number(o.total).toLocaleString()}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 bg-surface-container text-on-surface font-label-md uppercase">${o.status}</span>
            <button class="px-3 py-1 border border-secondary text-secondary hover:bg-secondary hover:text-on-secondary text-body-sm uppercase transition-colors" onclick="printInvoice('${o.orderId}')">Invoice</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function switchMemberTab(tabId) {
  const tabs = ["orders", "wishlist", "addresses", "rewards", "profile"];
  tabs.forEach(t => {
    const content = document.getElementById(`member-tab-${t}`);
    const navBtn = document.getElementById(`member-nav-${t}`);
    if (t === tabId) {
      if (content) content.classList.remove("hidden");
      if (navBtn) navBtn.className = "w-full flex items-center justify-between px-4 py-3 bg-primary text-on-primary font-headline-sm transition-all text-left";
    } else {
      if (content) content.classList.add("hidden");
      if (navBtn) navBtn.className = "w-full flex items-center justify-between px-4 py-3 hover:bg-surface-container-high text-on-surface font-headline-sm transition-all text-left";
    }
  });
}

// Wishlist Functionality
function isWishlisted(productId) {
  return Store.getWishlist().includes(productId);
}

function toggleWishlist(productId) {
  const isNowIn = Store.toggleWishlist(productId);
  showToast(isNowIn ? "Added to your curated wishlist" : "Removed from wishlist", "success");
  updateWishlistUI();
  renderFeaturedProducts();
  renderShopProducts();
}

function updateWishlistUI() {
  const list = Store.getWishlist();
  const countEls = document.querySelectorAll(".wishlist-count-badge");
  countEls.forEach(el => el.textContent = list.length);

  const container = document.getElementById("member-wishlist-grid");
  if (!container) return;

  const products = list.map(id => Store.getProductById(id)).filter(Boolean);
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  if (products.length === 0) {
    container.innerHTML = `<p class="col-span-full py-12 text-center text-on-surface-variant">Your wishlist is currently empty.</p>`;
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="bg-surface-container-lowest border border-secondary/30 flex flex-col group relative">
      <div class="absolute top-3 right-3 z-10 bg-surface/80 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-secondary hover:text-on-secondary transition-colors" onclick="toggleWishlist('${p.id}')">
        <span class="material-symbols-outlined text-[18px]">close</span>
      </div>
      <div class="w-full h-72 bg-cover bg-center relative overflow-hidden cursor-pointer" style="background-image: url('${p.image}')" onclick="openProductDetailPage('${p.id}')">
        <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div class="p-6 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <span class="font-label-md text-secondary uppercase tracking-widest block mb-1">${getCategoryName(p.category)}</span>
          <h3 class="font-headline-sm text-on-surface">${p.name}</h3>
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-secondary/10">
          <span class="font-headline-md text-on-surface">${curr}${Number(p.price).toLocaleString()}</span>
          <button class="px-4 py-2 bg-primary text-on-primary hover:bg-secondary hover:text-on-secondary transition-colors font-headline-sm text-body-sm uppercase" onclick="addToBagDirect('${p.id}')">Add to Bag</button>
        </div>
      </div>
    </div>
  `).join("");
}

// Helpers
function getCategoryName(catId) {
  const cats = Store.getCategories();
  const found = cats.find(c => c.id === catId);
  return found ? found.name : catId;
}

function getStarRatingIcons(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>`;
  }
  return stars;
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-secondary text-[20px]" style="font-variation-settings: 'FILL' 1;">${type === 'error' ? 'error' : 'verified'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Print Invoice
function printInvoice(orderId) {
  const orders = Store.getOrders();
  const order = orders.find(o => o.orderId === orderId);
  if (!order) return;

  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  const win = window.open("", "_blank");
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>NOOR Flagship - Invoice ${order.orderId}</title>
      <style>
        body { font-family: 'Plus Jakarta Sans', 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #1a1c1c; max-width: 780px; margin: auto; background: #fff; }
        .invoice-box { border: 1px solid #735c00; padding: 36px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #735c00; padding-bottom: 24px; margin-bottom: 24px; }
        .table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        .table th, .table td { padding: 12px; border-bottom: 1px solid #e2e2e2; text-align: left; }
        .table th { background: #f3f3f4; color: #735c00; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
        .total-box { margin-left: auto; width: 300px; }
        .total-box div { display: flex; justify-content: space-between; padding: 6px 0; }
        .gold-seal { color: #735c00; font-weight: bold; letter-spacing: 2px; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div>
            <h1 style="margin:0; letter-spacing: 4px; font-weight:300;">NOOR</h1>
            <p style="margin: 4px 0; color: #735c00; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Flagship Atelier & Vault</p>
            <p style="margin: 4px 0; font-size: 13px;">${settings.address}</p>
            <p style="margin: 2px 0; font-size: 13px;">Phone: ${settings.contactPhone}</p>
          </div>
          <div style="text-align: right;">
            <h3 style="margin:0; text-transform: uppercase; letter-spacing: 2px; color: #735c00;">Official Receipt</h3>
            <p style="margin: 4px 0; font-weight: bold;">${order.orderId}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #666;">Date: ${order.date}</p>
            <p style="margin: 4px 0; font-size: 13px;"><span class="gold-seal">AUTHENTIC COMMISSION</span></p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="margin:0 0 8px; text-transform: uppercase; font-size: 12px; color:#735c00; letter-spacing: 1px;">Patron Information:</h4>
          <p style="margin: 2px 0;"><strong>Name:</strong> ${order.customerName}</p>
          <p style="margin: 2px 0;"><strong>Phone:</strong> ${order.phone}</p>
          <p style="margin: 2px 0;"><strong>Destination:</strong> ${order.address}</p>
          <p style="margin: 2px 0;"><strong>Method:</strong> ${order.paymentMethod.toUpperCase()} | <strong>TrxID:</strong> ${order.trxId}</p>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Commission Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit BDT</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td><strong>${item.name}</strong><br><small style="color:#666;">${item.color || 'Standard'} • ${item.size || 'Standard'}</small></td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">${curr}${Number(item.price).toLocaleString()}</td>
                <td style="text-align: right;">${curr}${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="total-box">
          <div><span>Subtotal:</span> <strong>${curr}${Number(order.subtotal).toLocaleString()}</strong></div>
          ${order.discount ? `<div><span style="color:#735c00;">VIP Privilege Discount:</span> <strong style="color:#735c00;">-${curr}${Number(order.discount).toLocaleString()}</strong></div>` : ''}
          <div><span>Insured Courier:</span> <strong>${curr}${Number(order.deliveryFee).toLocaleString()}</strong></div>
          <div style="border-top: 2px solid #735c00; margin-top: 6px; padding-top: 8px; font-size: 18px;">
            <span>Grand Total:</span> <strong>${curr}${Number(order.total).toLocaleString()}</strong>
          </div>
        </div>

        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #e2e2e2; padding-top: 20px;">
          <p>Thank you for choosing ${settings.storeName}. Elegance Rooted in Faith.</p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px;" class="no-print">
        <button onclick="window.print()" style="padding: 12px 28px; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; background: #000; color: #fff; border: 1px solid #735c00; cursor: pointer;">Print Official Slip</button>
      </div>
    </body>
    </html>
  `);
  win.document.close();
}

// WhatsApp Floating Button Logic
function toggleWhatsAppPopup() {
  const popup = document.getElementById("whatsapp-popup-card");
  if (popup) popup.classList.toggle("active");
}

function sendWhatsAppMessage() {
  const settings = Store.getSettings();
  const phone = settings.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, "") : "8801700000000";
  const customInput = document.getElementById("wa-custom-msg-input");
  const msg = customInput && customInput.value.trim() ? customInput.value.trim() : (settings.whatsappDefaultMsg || "Hello!");

  const encodedMsg = encodeURIComponent(msg);
  const waUrl = `https://wa.me/${phone}?text=${encodedMsg}`;
  window.open(waUrl, "_blank");
}

// Global Event Listeners Setup
function setupEventListeners() {
  // Global Search input
  const searchInputs = document.querySelectorAll(".global-search-input");
  searchInputs.forEach(input => {
    input.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderShopProducts();
      if (activeView !== "shop" && searchQuery.trim()) {
        switchView("shop", false);
      }
    });
  });

  // Shop sort selector
  const sortSelect = document.getElementById("shop-sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderShopProducts();
    });
  }

  // Payment method radio change
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener("change", () => {
      updatePaymentInstruction();
    });
  });

  // Delivery radio change
  document.querySelectorAll('input[name="checkoutDelivery"]').forEach(radio => {
    radio.addEventListener("change", () => renderCheckoutSummary());
  });
}
