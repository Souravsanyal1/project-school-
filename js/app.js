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
  renderMemberAddresses();
  renderCheckoutAddressPicker();
  renderGoogleProfileState();
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
    if (activeView === "member") {
      renderMemberOrders();
      renderMemberAddresses();
      renderGoogleProfileState();
    }
    if (activeView === "checkout") {
      renderCheckoutAddressPicker();
    }
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
    renderCheckoutAddressPicker();
    updatePaymentInstruction();
  } else if (viewName === "member") {
    renderMemberOrders();
    renderMemberAddresses();
    renderGoogleProfileState();
  }

  if (scroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Apply Store Settings
function applyStoreSettings() {
  const settings = Store.getSettings();
  document.querySelectorAll(".site-name-display").forEach(el => el.textContent = settings.storeName || "INSAF");
  document.querySelectorAll(".site-brand-subtitle-display").forEach(el => el.textContent = settings.brandSubtitle || "Collection Gazipur");
  document.querySelectorAll(".site-tagline-display").forEach(el => el.textContent = settings.tagline || "");
  document.querySelectorAll(".site-phone-display").forEach(el => el.textContent = settings.contactPhone || "");
  document.querySelectorAll(".site-email-display").forEach(el => el.textContent = settings.contactEmail || "");
  document.querySelectorAll(".site-address-display").forEach(el => el.textContent = settings.address || "");
  document.querySelectorAll(".site-announcement-display").forEach(el => el.textContent = settings.announcement || "");

  // Dynamic Logo (Image or Material Symbol Icon)
  document.querySelectorAll(".header-logo-container").forEach(el => {
    if (settings.logoImage && settings.logoImage.trim()) {
      el.innerHTML = `<img src="${settings.logoImage.trim()}" alt="Logo" class="w-full h-full object-cover">`;
    } else {
      el.innerHTML = `<span class="material-symbols-outlined text-[20px] text-amber-400">${settings.logoIcon || 'diamond'}</span>`;
    }
  });

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

  // Dynamic Archive Banner Section
  const archiveBg = document.getElementById("archive-banner-bg");
  if (archiveBg) {
    if (settings.archiveBgImage && settings.archiveBgImage.trim()) {
      archiveBg.style.backgroundImage = `url('${settings.archiveBgImage.trim()}')`;
      archiveBg.style.display = "block";
    } else {
      archiveBg.style.backgroundImage = "none";
      archiveBg.style.display = "none";
    }
  }
  const archiveBadgeEl = document.getElementById("archive-badge-display");
  if (archiveBadgeEl) archiveBadgeEl.textContent = settings.archiveBadge || "The Royal Archive";
  const archiveTitleEl = document.getElementById("archive-title-display");
  if (archiveTitleEl) archiveTitleEl.textContent = settings.archiveTitle || "The Heritage of Andalusian Craft";
  const archiveDescEl = document.getElementById("archive-desc-display");
  if (archiveDescEl) archiveDescEl.textContent = settings.archiveDesc || "A limited release honoring the golden age of Islamic craftsmanship. Each piece is individually numbered and accompanied by a certificate of authenticity.";
  const archiveBtnEl = document.getElementById("archive-btn-display");
  if (archiveBtnEl) {
    archiveBtnEl.innerHTML = `<span class="material-symbols-outlined text-[18px]">explore</span> ${settings.archiveBtnText || "Discover The Archive"}`;
  }

  const insideFeeEl = document.getElementById("inside-dhaka-fee-label");
  const outsideFeeEl = document.getElementById("outside-dhaka-fee-label");
  if (insideFeeEl) insideFeeEl.textContent = `৳${settings.insideDhakaDelivery}`;
  if (outsideFeeEl) outsideFeeEl.textContent = `৳${settings.outsideDhakaDelivery}`;

  const waPromptMsg = document.getElementById("wa-custom-msg-input");
  if (waPromptMsg && !waPromptMsg.value) {
    waPromptMsg.value = settings.whatsappDefaultMsg || "Assalamu Alaikum, I want to inquire about your luxury items.";
  }
}

// Mobile Search Action
function openMobileSearch() {
  switchView("shop");
  setTimeout(() => {
    const searchInput = document.querySelector(".global-search-input") || document.getElementById("mobile-search-input");
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
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
    shopFilterContainer.innerHTML = categories.map(cat => {
      const cleanName = (cat.name || cat.id).replace(/\s*\([^)]*\)/g, "").trim() || cat.name;
      return `
        <button type="button" class="category-filter-btn ${currentCategory === cat.id ? 'active' : 'inactive'}" onclick="setCategoryFilter('${cat.id}')">
          ${cleanName}
        </button>
      `;
    }).join("");
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

  // Customer Reviews & Ratings
  renderProductReviews(product.id);
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

// ==========================================
// VERIFIED BUYER REVIEWS & RATINGS LOGIC
// ==========================================
let currentVerifiedPurchaseData = null;

function renderProductReviews(productId) {
  const container = document.getElementById("pdp-reviews-list-container");
  if (!container) return;

  const reviews = Store.getReviews(productId);
  const totalReviews = reviews.length;

  // Calculate Average Rating
  let avgRating = 5.0;
  if (totalReviews > 0) {
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    avgRating = (sum / totalReviews).toFixed(1);
  }

  // Update Summary UI
  const scoreEl = document.getElementById("pdp-review-summary-score");
  if (scoreEl) scoreEl.textContent = avgRating;

  const totalEl = document.getElementById("pdp-review-summary-total");
  if (totalEl) totalEl.textContent = `Based on ${totalReviews} Verified Reviews`;

  const pdpCountEl = document.getElementById("pdp-reviews-count");
  if (pdpCountEl) pdpCountEl.textContent = `(${totalReviews} Reviews)`;

  const starsEl = document.getElementById("pdp-review-summary-stars");
  if (starsEl) {
    const fullStars = Math.round(Number(avgRating));
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      starsHtml += `<span class="material-symbols-outlined text-[24px] text-amber-500" style="font-variation-settings: 'FILL' ${i <= fullStars ? 1 : 0};">star</span>`;
    }
    starsEl.innerHTML = starsHtml;
  }

  // If no reviews
  if (reviews.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-10 text-center bg-surface-container-lowest border border-dashed border-secondary/30 p-6 space-y-3">
        <span class="material-symbols-outlined text-[32px] text-secondary">rate_review</span>
        <h4 class="font-headline-sm text-on-surface">No Customer Reviews Yet</h4>
        <p class="text-body-sm text-on-surface-variant max-w-md mx-auto">Be the first verified patron to review this masterpiece after placing your order.</p>
        <button type="button" class="px-5 py-2.5 bg-primary text-on-primary hover:bg-secondary hover:text-on-secondary transition-colors font-headline-sm uppercase text-xs inline-flex items-center gap-2" onclick="openWriteReviewModal()">
          <span class="material-symbols-outlined text-[16px]">edit</span> Write First Review
        </button>
      </div>
    `;
    return;
  }

  // Render review cards
  container.innerHTML = reviews.map(rev => {
    let starIcons = "";
    for (let i = 1; i <= 5; i++) {
      starIcons += `<span class="material-symbols-outlined text-[16px] text-amber-500" style="font-variation-settings: 'FILL' ${i <= rev.rating ? 1 : 0};">star</span>`;
    }

    return `
      <div class="bg-surface-container-lowest p-6 border border-secondary/20 relative flex flex-col justify-between shadow-sm hover:border-secondary transition-colors">
        <div class="space-y-3">
          <!-- Top Row: Rating & Verified Badge -->
          <div class="flex justify-between items-start gap-2">
            <div class="flex items-center gap-1 text-amber-500">
              ${starIcons}
            </div>
            <span class="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded font-bold">
              <span class="material-symbols-outlined text-[14px] text-emerald-700">verified</span>
              <span>Verified Buyer</span>
            </span>
          </div>

          <!-- Review Title & Comment -->
          <div>
            <h4 class="font-headline-sm text-on-surface font-bold text-sm">${rev.title || 'Exquisite Piece'}</h4>
            <p class="text-body-sm text-on-surface-variant mt-1.5 leading-relaxed font-light">${rev.comment}</p>
          </div>
        </div>

        <!-- Author, Variant & Date -->
        <div class="pt-4 mt-4 border-t border-secondary/10 flex justify-between items-end text-xs">
          <div>
            <strong class="text-on-surface font-semibold block">${rev.author || 'Anonymous Patron'}</strong>
            ${rev.variant ? `<span class="text-[11px] text-slate-500 block">${rev.variant}</span>` : ''}
            <span class="text-[11px] text-on-surface-variant font-mono">${rev.date || 'Recent'}</span>
          </div>
          <button type="button" class="text-slate-600 hover:text-amber-600 flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-surface-container rounded border border-outline-variant/50 transition-colors" onclick="handleLikeReview('${rev.id}', this)">
            <span class="material-symbols-outlined text-[14px]">thumb_up</span>
            <span class="like-count">${rev.likes || 0}</span>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function handleLikeReview(reviewId, btn) {
  const newLikes = Store.likeReview(reviewId);
  const countSpan = btn.querySelector(".like-count");
  if (countSpan) countSpan.textContent = newLikes;
  btn.classList.add("text-secondary", "font-bold");
}

function openWriteReviewModal() {
  const modal = document.getElementById("write-review-modal");
  const form = document.getElementById("verified-review-form");
  const msgEl = document.getElementById("review-verification-msg");
  const verifierInput = document.getElementById("review-verifier-input");

  if (!modal || !currentPdpProduct) return;

  if (form) form.reset();
  if (form) form.classList.add("hidden");
  if (msgEl) msgEl.innerHTML = "";
  if (verifierInput) verifierInput.value = "";
  setReviewRating(5);
  currentVerifiedPurchaseData = null;

  // Auto-check if the user placed an order for this product in current browser
  const autoCheck = Store.hasUserPurchasedProduct(currentPdpProduct.id);
  if (autoCheck.hasPurchased && autoCheck.order) {
    currentVerifiedPurchaseData = autoCheck;
    if (verifierInput) verifierInput.value = autoCheck.orderId || autoCheck.phone;
    
    // Auto-unlock Step 2
    if (msgEl) {
      msgEl.innerHTML = `
        <div class="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-medium flex items-center gap-1.5 mt-2">
          <span class="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
          <span>স্বয়ংক্রিয়ভাবে আপনার পূর্ববর্তী ক্রয়ের অর্ডার (${autoCheck.orderId}) পাওয়া গেছে! নিচে আপনার রিভিউ লিখুন।</span>
        </div>
      `;
    }
    document.getElementById("review-verified-patron-name").textContent = autoCheck.customerName || "Valued Patron";
    document.getElementById("review-verified-order-id").textContent = autoCheck.orderId;
    if (form) form.classList.remove("hidden");
  }

  modal.classList.add("active");
}

function closeWriteReviewModal() {
  const modal = document.getElementById("write-review-modal");
  if (modal) modal.classList.remove("active");
}

function verifyBuyerForReview() {
  const input = document.getElementById("review-verifier-input");
  const msgEl = document.getElementById("review-verification-msg");
  const form = document.getElementById("verified-review-form");
  const val = input ? input.value.trim() : "";

  if (!val) {
    if (msgEl) {
      msgEl.innerHTML = `<span class="text-error font-medium">⚠️ অনুগ্রহ করে আপনার অর্ডার নম্বর (Order ID) অথবা ফোন নম্বর প্রদান করুন।</span>`;
    }
    return;
  }

  if (!currentPdpProduct) return;

  const result = Store.hasUserPurchasedProduct(currentPdpProduct.id, val);

  if (result.hasPurchased) {
    currentVerifiedPurchaseData = result;
    if (msgEl) {
      msgEl.innerHTML = `
        <div class="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-medium flex items-center gap-1.5 mt-2">
          <span class="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
          <span>✓ ভেরিফিকেশন সফল! আপনি এই পণ্যটির ভেরিফাইড ক্রেতা।</span>
        </div>
      `;
    }
    document.getElementById("review-verified-patron-name").textContent = result.customerName || "Valued Patron";
    document.getElementById("review-verified-order-id").textContent = result.orderId;
    if (form) form.classList.remove("hidden");
  } else {
    currentVerifiedPurchaseData = null;
    if (form) form.classList.add("hidden");
    if (msgEl) {
      msgEl.innerHTML = `
        <div class="p-3 bg-red-50 text-red-800 border border-red-200 rounded text-xs space-y-1.5 mt-2">
          <div class="font-bold flex items-center gap-1">
            <span class="material-symbols-outlined text-red-600 text-[16px]">lock</span>
            <span>ক্রয় রেকর্ড পাওয়া যায়নি (Purchase Not Found)</span>
          </div>
          <p>শুধুমাত্র এই পণ্যটি ক্রয়কারী ক্রেতারা রিভিউ দিতে পারবেন। আপনি যদি পণ্যটি কিনে থাকেন, অনুগ্রহ করে অর্ডারে ব্যবহৃত সঠিক ফোন নম্বর বা অর্ডার আইডি দিয়ে চেষ্টা করুন।</p>
        </div>
      `;
    }
  }
}

function setReviewRating(rating) {
  document.getElementById("review-rating-value").value = rating;
  const ratingLabels = {
    1: "1 Star (Poor)",
    2: "2 Stars (Fair)",
    3: "3 Stars (Good)",
    4: "4 Stars (Very Good)",
    5: "5 Stars (Excellent)"
  };
  const labelEl = document.getElementById("review-rating-label");
  if (labelEl) labelEl.textContent = ratingLabels[rating] || `${rating} Stars`;

  document.querySelectorAll(".star-picker-btn").forEach(btn => {
    const starNum = Number(btn.getAttribute("data-star"));
    if (starNum <= rating) {
      btn.classList.add("text-amber-400");
      btn.classList.remove("text-slate-300");
    } else {
      btn.classList.remove("text-amber-400");
      btn.classList.add("text-slate-300");
    }
  });
}

function handleReviewSubmit(e) {
  if (e) e.preventDefault();
  if (!currentPdpProduct || !currentVerifiedPurchaseData) {
    showToast("Please verify your purchase before submitting", "error");
    return;
  }

  const rating = Number(document.getElementById("review-rating-value")?.value || 5);
  const title = document.getElementById("review-title-input")?.value.trim() || "";
  const comment = document.getElementById("review-comment-input")?.value.trim() || "";

  if (!title || !comment) {
    showToast("Please provide both a review headline and detailed comments", "warning");
    return;
  }

  const reviewData = {
    productId: currentPdpProduct.id,
    author: currentVerifiedPurchaseData.customerName || "Valued Patron",
    phone: currentVerifiedPurchaseData.phone || "",
    orderId: currentVerifiedPurchaseData.orderId || "",
    variant: currentVerifiedPurchaseData.variant || "Standard",
    rating: rating,
    title: title,
    comment: comment
  };

  Store.addReview(reviewData);
  showToast("✓ আপনার ভেরিফাইড রিভিউ সফলভাবে প্রকাশিত হয়েছে!", "success");
  closeWriteReviewModal();
  renderProductReviews(currentPdpProduct.id);
  renderFeaturedProducts();
  renderShopProducts();
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

  if (tabId === "addresses") {
    renderMemberAddresses();
  } else if (tabId === "profile") {
    renderGoogleProfileState();
  }
}

// ==========================================
// GOOGLE AUTHENTICATION & PROFILE FUNCTIONS
// ==========================================
function getGoogleUserProfile() {
  try {
    return JSON.parse(localStorage.getItem("noor_google_user")) || null;
  } catch {
    return null;
  }
}

function renderGoogleProfileState() {
  const container = document.getElementById("google-auth-status-card");
  const welcomeTitle = document.getElementById("member-welcome-title");
  const googleUser = getGoogleUserProfile();
  const savedProfile = JSON.parse(localStorage.getItem("noor_user_profile") || "null");

  const activeName = (googleUser && googleUser.name) || (savedProfile && savedProfile.name) || "Princess Yasmin Al-Sabah";
  const activeEmail = (googleUser && googleUser.email) || (savedProfile && savedProfile.email) || "patron@noor.com.bd";
  const activePhone = (googleUser && googleUser.phone) || (savedProfile && savedProfile.phone) || "+8801712345678";

  if (welcomeTitle) {
    welcomeTitle.textContent = `Welcome back, ${activeName}`;
  }

  const nameInput = document.getElementById("member-profile-name");
  const emailInput = document.getElementById("member-profile-email");
  const phoneInput = document.getElementById("member-profile-phone");

  if (nameInput) nameInput.value = activeName;
  if (emailInput) emailInput.value = activeEmail;
  if (phoneInput) phoneInput.value = activePhone;

  if (!container) return;

  if (googleUser && googleUser.email) {
    container.innerHTML = `
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-3.5">
          <div class="relative">
            <img src="${googleUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}" alt="${googleUser.name}" class="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500 shadow-sm" />
            <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-headline-sm text-slate-900 font-bold text-base">${googleUser.name}</h4>
              <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-full tracking-wider border border-emerald-300">
                ✓ Google Verified
              </span>
            </div>
            <p class="text-xs text-slate-600">${googleUser.email}</p>
          </div>
        </div>
        <button type="button" class="px-4 py-2 border border-slate-300 hover:border-red-400 text-slate-700 hover:text-red-600 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5" onclick="handleGoogleSignOut()">
          <span class="material-symbols-outlined text-[16px]">logout</span>
          <span>গুগল সাইন-আউট • Disconnect</span>
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
            Google Account Integration
          </span>
          <span class="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">1-Click Fast Connect</span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          আপনার গুগল একাউন্ট যুক্ত করে সরাসরি এক ক্লিকে অর্ডার ট্র্যাকিং, উইশলিস্ট ও ভিআইপি প্রিভিলেজ ক্লাবে যুক্ত থাকুন।
        </p>
        <button type="button" class="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-3 hover:shadow-md" onclick="handleGoogleSignIn()">
          <svg class="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" overflow="hidden" viewBox="0 0 268.152 273.883"><defs><linearGradient id="google__a"><stop offset="0" stop-color="#0fbc5c"/><stop offset="1" stop-color="#0cba65"/></linearGradient><linearGradient id="google__g"><stop offset=".231" stop-color="#0fbc5f"/><stop offset=".312" stop-color="#0fbc5f"/><stop offset=".366" stop-color="#0fbc5e"/><stop offset=".458" stop-color="#0fbc5d"/><stop offset=".54" stop-color="#12bc58"/><stop offset=".699" stop-color="#28bf3c"/><stop offset=".771" stop-color="#38c02b"/><stop offset=".861" stop-color="#52c218"/><stop offset=".915" stop-color="#67c30f"/><stop offset="1" stop-color="#86c504"/></linearGradient><linearGradient id="google__h"><stop offset=".142" stop-color="#1abd4d"/><stop offset=".248" stop-color="#6ec30d"/><stop offset=".312" stop-color="#8ac502"/><stop offset=".366" stop-color="#a2c600"/><stop offset=".446" stop-color="#c8c903"/><stop offset=".54" stop-color="#ebcb03"/><stop offset=".616" stop-color="#f7cd07"/><stop offset=".699" stop-color="#fdcd04"/><stop offset=".771" stop-color="#fdce05"/><stop offset=".861" stop-color="#ffce0a"/></linearGradient><linearGradient id="google__f"><stop offset=".316" stop-color="#ff4c3c"/><stop offset=".604" stop-color="#ff692c"/><stop offset=".727" stop-color="#ff7825"/><stop offset=".885" stop-color="#ff8d1b"/><stop offset="1" stop-color="#ff9f13"/></linearGradient><linearGradient id="google__b"><stop offset=".231" stop-color="#ff4541"/><stop offset=".312" stop-color="#ff4540"/><stop offset=".458" stop-color="#ff4640"/><stop offset=".54" stop-color="#ff473f"/><stop offset=".699" stop-color="#ff5138"/><stop offset=".771" stop-color="#ff5b33"/><stop offset=".861" stop-color="#ff6c29"/><stop offset="1" stop-color="#ff8c18"/></linearGradient><linearGradient id="google__d"><stop offset=".408" stop-color="#fb4e5a"/><stop offset="1" stop-color="#ff4540"/></linearGradient><linearGradient id="google__c"><stop offset=".132" stop-color="#0cba65"/><stop offset=".21" stop-color="#0bb86d"/><stop offset=".297" stop-color="#09b479"/><stop offset=".396" stop-color="#08ad93"/><stop offset=".477" stop-color="#0aa6a9"/><stop offset=".568" stop-color="#0d9cc6"/><stop offset=".667" stop-color="#1893dd"/><stop offset=".769" stop-color="#258bf1"/><stop offset=".859" stop-color="#3086ff"/></linearGradient><linearGradient id="google__e"><stop offset=".366" stop-color="#ff4e3a"/><stop offset=".458" stop-color="#ff8a1b"/><stop offset=".54" stop-color="#ffa312"/><stop offset=".616" stop-color="#ffb60c"/><stop offset=".771" stop-color="#ffcd0a"/><stop offset=".861" stop-color="#fecf0a"/><stop offset=".915" stop-color="#fecf08"/><stop offset="1" stop-color="#fdcd01"/></linearGradient><linearGradient xlink:href="#google__a" id="google__s" x1="219.7" x2="254.467" y1="329.535" y2="329.535" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#google__b" id="google__m" cx="109.627" cy="135.862" r="71.46" fx="109.627" fy="135.862" gradientTransform="matrix(-1.93688 1.043 1.45573 2.55542 290.525 -400.634)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#google__c" id="google__n" cx="45.259" cy="279.274" r="71.46" fx="45.259" fy="279.274" gradientTransform="matrix(-3.5126 -4.45809 -1.69255 1.26062 870.8 191.554)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#google__d" id="google__l" cx="304.017" cy="118.009" r="47.854" fx="304.017" fy="118.009" gradientTransform="matrix(2.06435 0 0 2.59204 -297.679 -151.747)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#google__e" id="google__o" cx="181.001" cy="177.201" r="71.46" fx="181.001" fy="177.201" gradientTransform="matrix(-.24858 2.08314 2.96249 .33417 -255.146 -331.164)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#google__f" id="google__p" cx="207.673" cy="108.097" r="41.102" fx="207.673" fy="108.097" gradientTransform="matrix(-1.2492 1.34326 -3.89684 -3.4257 880.501 194.905)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#google__g" id="google__r" cx="109.627" cy="135.862" r="71.46" fx="109.627" fy="135.862" gradientTransform="matrix(-1.93688 -1.043 1.45573 -2.55542 290.525 838.683)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#google__h" id="google__j" cx="154.87" cy="145.969" r="71.46" fx="154.87" fy="145.969" gradientTransform="matrix(-.0814 -1.93722 2.92674 -.11625 -215.135 632.86)" gradientUnits="userSpaceOnUse"/><filter id="google__q" width="1.097" height="1.116" x="-.048" y="-.058" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.701"/></filter><filter id="google__k" width="1.033" height="1.02" x="-.017" y="-.01" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".242"/></filter><clipPath id="google__i" clipPathUnits="userSpaceOnUse"><path d="M371.378 193.24H237.083v53.438h77.167c-1.241 7.563-4.026 15.003-8.105 21.786-4.674 7.773-10.451 13.69-16.373 18.196-17.74 13.498-38.42 16.258-52.783 16.258-36.283 0-67.283-23.286-79.285-54.928-.484-1.149-.805-2.335-1.197-3.507a81.115 81.115 0 0 1-4.101-25.448c0-9.226 1.569-18.057 4.43-26.398 11.285-32.897 42.985-57.467 80.179-57.467 7.481 0 14.685.884 21.517 2.648a77.668 77.668 0 0 1 33.425 18.25l40.834-39.712c-24.839-22.616-57.219-36.32-95.844-36.32-30.878 0-59.386 9.553-82.748 25.7-18.945 13.093-34.483 30.625-44.97 50.985-9.753 18.879-15.094 39.8-15.094 62.294 0 22.495 5.35 43.633 15.103 62.337v.126c10.302 19.857 25.368 36.954 43.678 49.988 15.997 11.386 44.68 26.551 84.031 26.551 22.63 0 42.687-4.051 60.375-11.644 12.76-5.478 24.065-12.622 34.301-21.804 13.525-12.132 24.117-27.139 31.347-44.404 7.23-17.265 11.097-36.79 11.097-57.957 0-9.858-.998-19.87-2.689-28.968Z"/></clipPath></defs><g clip-path="url(#google__i)" transform="matrix(.95792 0 0 .98525 -90.174 -78.856)"><path fill="url(#google__j)" d="M92.076 219.958c.148 22.14 6.501 44.983 16.117 63.424v.127c6.949 13.392 16.445 23.97 27.26 34.452l65.327-23.67c-12.36-6.235-14.246-10.055-23.105-17.026-9.054-9.066-15.802-19.473-20.004-31.677h-.17l.17-.127c-2.765-8.058-3.037-16.613-3.14-25.503Z" filter="url(#google__k)"/><path fill="url(#google__l)" d="M237.083 79.025c-6.456 22.526-3.988 44.421 0 57.161 7.457.006 14.64.888 21.45 2.647a77.662 77.662 0 0 1 33.424 18.25l41.88-40.726c-24.81-22.59-54.667-37.297-96.754-37.332Z" filter="url(#google__k)"/><path fill="url(#google__m)" d="M236.943 78.847c-31.67 0-60.91 9.798-84.871 26.359a145.533 145.533 0 0 0-24.332 21.15c-1.904 17.744 14.257 39.551 46.262 39.37 15.528-17.936 38.495-29.542 64.056-29.542l.07.002-1.044-57.335c-.048 0-.093-.004-.14-.004Z" filter="url(#google__k)"/><path fill="url(#google__n)" d="m341.475 226.379-28.268 19.285c-1.24 7.562-4.028 15.002-8.107 21.786-4.674 7.772-10.45 13.69-16.373 18.196-17.702 13.47-38.328 16.244-52.687 16.255-14.842 25.102-17.444 37.675 1.043 57.934 22.877-.016 43.157-4.117 61.046-11.796 12.931-5.551 24.388-12.792 34.761-22.097 13.706-12.295 24.442-27.503 31.769-45 7.327-17.497 11.245-37.282 11.245-58.734Z" filter="url(#google__k)"/><path fill="#3086ff" d="M234.996 191.21v57.498h136.006c1.196-7.874 5.152-18.064 5.152-26.5 0-9.858-.996-21.899-2.687-30.998Z" filter="url(#google__k)"/><path fill="url(#google__o)" d="M128.39 124.327c-8.394 9.119-15.564 19.326-21.249 30.364-9.753 18.879-15.094 41.83-15.094 64.324 0 .317.026.627.029.944 4.32 8.224 59.666 6.649 62.456 0-.004-.31-.039-.613-.039-.924 0-9.226 1.57-16.026 4.43-24.367 3.53-10.289 9.056-19.763 16.123-27.926 1.602-2.031 5.875-6.397 7.121-9.016.475-.997-.862-1.557-.937-1.908-.083-.393-1.876-.077-2.277-.37-1.275-.929-3.8-1.414-5.334-1.845-3.277-.921-8.708-2.953-11.725-5.06-9.536-6.658-24.417-14.612-33.505-24.216Z" filter="url(#google__k)"/><path fill="url(#google__p)" d="M162.099 155.857c22.112 13.301 28.471-6.714 43.173-12.977l-25.574-52.664a144.74 144.74 0 0 0-26.543 14.504c-12.316 8.512-23.192 18.9-32.176 30.72Z" filter="url(#google__q)"/><path fill="url(#google__r)" d="M171.099 290.222c-29.683 10.641-34.33 11.023-37.062 29.29a144.806 144.806 0 0 0 16.792 13.984c15.996 11.386 46.766 26.551 86.118 26.551.046 0 .09-.004.137-.004v-59.157l-.094.002c-14.736 0-26.512-3.843-38.585-10.527-2.977-1.648-8.378 2.777-11.123.799-3.786-2.729-12.9 2.35-16.183-.938Z" filter="url(#google__k)"/><path fill="url(#google__s)" d="M219.7 299.023v59.996c5.506.64 11.236 1.028 17.247 1.028 6.026 0 11.855-.307 17.52-.872v-59.748a105.119 105.119 0 0 1-17.477 1.461c-5.932 0-11.7-.686-17.29-1.865Z" filter="url(#google__k)" opacity=".5"/></g></svg>
          <span>Continue with Google • গুগল দিয়ে সাইন-ইন করুন</span>
        </button>
      </div>
    `;
  }
}

async function handleGoogleSignIn() {
  if (!window.FirebaseAuth?.loginWithGoogle) {
    showToast("Firebase Google Auth initializing...", "warning");
    return;
  }

  showToast("Opening Google Sign-In...", "info");
  const res = await window.FirebaseAuth.loginWithGoogle();
  if (res.success) {
    showToast(`✓ Welcome ${res.user.name}! Connected with Google.`, "success");
    renderGoogleProfileState();
  } else {
    showToast(res.error || "Google sign-in cancelled or failed", "warning");
  }
}

async function handleGoogleSignOut() {
  if (window.FirebaseAuth?.logoutAdminFromFirebase) {
    await window.FirebaseAuth.logoutAdminFromFirebase();
  }
  localStorage.removeItem("noor_google_user");
  showToast("Google account disconnected", "info");
  renderGoogleProfileState();
}

function handleSaveMemberProfile(e) {
  if (e) e.preventDefault();
  const name = document.getElementById("member-profile-name")?.value.trim() || "";
  const email = document.getElementById("member-profile-email")?.value.trim() || "";
  const phone = document.getElementById("member-profile-phone")?.value.trim() || "";

  if (!name || !email) {
    showToast("Please enter your name and email", "error");
    return;
  }

  const profile = {
    name,
    email,
    phone,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem("noor_user_profile", JSON.stringify(profile));

  const welcomeTitle = document.getElementById("member-welcome-title");
  if (welcomeTitle) welcomeTitle.textContent = `Welcome back, ${name}`;

  showToast("✓ Profile preferences saved successfully!", "success");
}

// ==========================================
// USER ADDRESS MANAGEMENT FUNCTIONS
// ==========================================
function renderMemberAddresses() {
  const container = document.getElementById("member-addresses-grid");
  if (!container) return;

  const addresses = Store.getAddresses();
  if (!addresses || addresses.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-surface-container-lowest border border-dashed border-secondary/30 p-8 space-y-4">
        <div class="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mx-auto">
          <span class="material-symbols-outlined text-[28px]">home_pin</span>
        </div>
        <h4 class="font-headline-sm text-on-surface">No Saved Addresses Found</h4>
        <p class="text-body-sm text-on-surface-variant max-w-md mx-auto">You have not added any delivery residence yet. Add your home or office address for fast, 1-click checkout.</p>
        <button type="button" class="px-6 py-2.5 bg-primary text-on-primary hover:bg-secondary hover:text-on-secondary transition-colors font-headline-sm uppercase text-xs inline-flex items-center gap-2 shadow-sm" onclick="openUserAddressModal()">
          <span class="material-symbols-outlined text-[16px]">add</span> Add First Residence
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = addresses.map(addr => `
    <div class="bg-surface-container-lowest p-6 border ${addr.isDefault ? 'border-secondary shadow-md' : 'border-secondary/30'} relative flex flex-col justify-between group shadow-sm transition-all hover:border-secondary">
      <div>
        <div class="flex justify-between items-start mb-3 gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs px-2.5 py-0.5 bg-surface-container-high text-secondary font-bold uppercase tracking-wider border border-secondary/30">
              ${addr.title || 'Residence'}
            </span>
            <span class="text-[10px] px-2 py-0.5 bg-surface-container text-on-surface-variant uppercase">
              ${addr.deliveryArea === 'outside' ? 'Outside Dhaka (৳150)' : 'Inside Dhaka (৳80)'}
            </span>
          </div>
          ${addr.isDefault ? `
            <span class="px-2.5 py-1 bg-secondary text-on-secondary font-label-md uppercase text-[10px] tracking-wider font-bold">
              Default Residence
            </span>
          ` : `
            <button type="button" class="text-[11px] text-secondary hover:underline font-bold uppercase tracking-wider" onclick="makeAddressDefault('${addr.id}')">
              Set as Default
            </button>
          `}
        </div>

        <h3 class="font-headline-sm text-on-surface mt-2 font-bold">${addr.name}</h3>
        <p class="text-body-sm text-on-surface-variant mt-1 leading-relaxed">${addr.street}</p>
        <p class="text-body-sm text-on-surface-variant font-medium">${addr.city}</p>
        <p class="text-body-sm text-secondary pt-2 flex items-center gap-1.5 font-mono">
          <span class="material-symbols-outlined text-[16px]">call</span>
          <span>${addr.phone}</span>
        </p>
      </div>

      <div class="flex items-center gap-3 pt-4 mt-4 border-t border-secondary/15">
        <button type="button" class="text-xs text-primary hover:text-secondary font-bold flex items-center gap-1 transition-colors" onclick="openUserAddressModal('${addr.id}')">
          <span class="material-symbols-outlined text-[15px]">edit</span> Edit
        </button>
        <button type="button" class="text-xs text-error/80 hover:text-error font-bold flex items-center gap-1 transition-colors ml-auto" onclick="deleteUserAddress('${addr.id}')">
          <span class="material-symbols-outlined text-[15px]">delete</span> Delete
        </button>
      </div>
    </div>
  `).join("");
}

function openUserAddressModal(addressId = null) {
  const modal = document.getElementById("user-address-modal");
  const form = document.getElementById("user-address-form");
  const titleEl = document.getElementById("user-address-modal-title");
  if (!modal || !form) return;

  form.reset();

  if (addressId) {
    const addr = Store.getAddressById(addressId);
    if (addr) {
      if (titleEl) titleEl.textContent = "Edit Delivery Residence";
      document.getElementById("user-addr-id").value = addr.id;
      document.getElementById("user-addr-title-custom").value = addr.title || "Home / বাসা";
      document.getElementById("user-addr-name").value = addr.name || "";
      document.getElementById("user-addr-phone").value = addr.phone || "";
      document.getElementById("user-addr-street").value = addr.street || "";
      document.getElementById("user-addr-city").value = addr.city || "";
      document.getElementById("user-addr-zone").value = addr.deliveryArea || "inside";
      document.getElementById("user-addr-default").checked = !!addr.isDefault;

      const radio = form.querySelector(`input[name="userAddrLabel"][value="${addr.title}"]`);
      if (radio) radio.checked = true;
    }
  } else {
    if (titleEl) titleEl.textContent = "Add Delivery Residence";
    document.getElementById("user-addr-id").value = "";
    document.getElementById("user-addr-title-custom").value = "Home / বাসা";
    document.getElementById("user-addr-name").value = "";
    document.getElementById("user-addr-phone").value = "";
    document.getElementById("user-addr-street").value = "";
    document.getElementById("user-addr-city").value = "Dhaka";
    document.getElementById("user-addr-zone").value = "inside";
    document.getElementById("user-addr-default").checked = Store.getAddresses().length === 0;
  }

  modal.classList.add("active");
}

function closeUserAddressModal() {
  const modal = document.getElementById("user-address-modal");
  if (modal) modal.classList.remove("active");
}

function handleUserAddressSubmit(e) {
  if (e) e.preventDefault();
  const id = document.getElementById("user-addr-id")?.value || "";
  const title = document.getElementById("user-addr-title-custom")?.value.trim() || "Home";
  const name = document.getElementById("user-addr-name")?.value.trim() || "";
  const phone = document.getElementById("user-addr-phone")?.value.trim() || "";
  const street = document.getElementById("user-addr-street")?.value.trim() || "";
  const city = document.getElementById("user-addr-city")?.value.trim() || "";
  const deliveryArea = document.getElementById("user-addr-zone")?.value || "inside";
  const isDefault = document.getElementById("user-addr-default")?.checked || false;

  if (!name || !phone || !street || !city) {
    showToast("Please fill in all required address fields", "error");
    return;
  }

  const addrData = {
    title,
    name,
    phone,
    street,
    city,
    deliveryArea,
    isDefault
  };

  if (id) {
    addrData.id = id;
  }

  Store.saveAddress(addrData);
  showToast(id ? "Residence updated successfully!" : "New residence added successfully!", "success");
  closeUserAddressModal();
  renderMemberAddresses();
  renderCheckoutAddressPicker();
}

function makeAddressDefault(id) {
  Store.setDefaultAddress(id);
  showToast("Default residence updated!", "success");
  renderMemberAddresses();
  renderCheckoutAddressPicker();
}

function deleteUserAddress(id) {
  if (confirm("Are you sure you want to remove this delivery address?")) {
    Store.deleteAddress(id);
    showToast("Residence removed", "success");
    renderMemberAddresses();
    renderCheckoutAddressPicker();
  }
}

// Checkout Address Quick Picker
function renderCheckoutAddressPicker() {
  const wrapper = document.getElementById("checkout-saved-addresses-wrapper");
  const container = document.getElementById("checkout-saved-addresses-pills");
  if (!wrapper || !container) return;

  const addresses = Store.getAddresses();
  if (!addresses || addresses.length === 0) {
    wrapper.style.display = "none";
    return;
  }

  wrapper.style.display = "block";
  container.innerHTML = addresses.map(addr => `
    <button type="button" class="px-3 py-1.5 bg-surface border ${addr.isDefault ? 'border-secondary text-secondary font-bold ring-1 ring-secondary/30' : 'border-outline-variant text-on-surface hover:border-secondary'} text-xs rounded transition-all flex items-center gap-1.5 shadow-sm" onclick="selectCheckoutAddress('${addr.id}')">
      <span class="material-symbols-outlined text-[15px]">${addr.isDefault ? 'verified' : 'location_on'}</span>
      <span>${addr.title} (${addr.name.split(" ")[0]})</span>
    </button>
  `).join("");
}

function selectCheckoutAddress(id) {
  const addr = Store.getAddressById(id);
  if (!addr) return;

  const nameParts = addr.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const firstNameInput = document.getElementById("checkout-first-name");
  const lastNameInput = document.getElementById("checkout-last-name");
  const phoneInput = document.getElementById("checkout-phone");
  const streetInput = document.getElementById("checkout-street");
  const cityInput = document.getElementById("checkout-city");

  if (firstNameInput) firstNameInput.value = firstName;
  if (lastNameInput) lastNameInput.value = lastName;
  if (phoneInput) phoneInput.value = addr.phone;
  if (streetInput) streetInput.value = addr.street;
  if (cityInput) cityInput.value = addr.city;

  const deliveryRadio = document.querySelector(`input[name="checkoutDelivery"][value="${addr.deliveryArea || 'inside'}"]`);
  if (deliveryRadio) {
    deliveryRadio.checked = true;
  }

  renderCheckoutSummary();
  showToast(`Autofilled with ${addr.title} (${addr.name})`, "success");
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

  // Enable mouse wheel horizontal scroll on desktop
  const catFilters = document.getElementById("shop-category-filters");
  if (catFilters) {
    catFilters.addEventListener("wheel", (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        catFilters.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }
}
