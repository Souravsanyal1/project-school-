/**
 * Main Frontend Application Script
 * Base Currency: BDT (৳)
 */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

let currentCategory = "all";
let searchQuery = "";
let currentSort = "featured";
let appliedCoupon = null;

function initApp() {
  applyStoreSettings();
  renderCategories();
  renderProducts();
  updateCartUI();
  setupEventListeners();

  // Listen to data store updates
  window.addEventListener("storeUpdated", (e) => {
    applyStoreSettings();
    renderCategories();
    renderProducts();
    updateCartUI();
  });
}

// Apply Store Settings to Header, Footer, WhatsApp & Announcements
function applyStoreSettings() {
  const settings = Store.getSettings();

  // Titles & Branding
  document.querySelectorAll(".site-name-display").forEach(el => el.textContent = settings.storeName);
  document.querySelectorAll(".site-tagline-display").forEach(el => el.textContent = settings.tagline);
  document.querySelectorAll(".site-phone-display").forEach(el => el.textContent = settings.contactPhone);
  document.querySelectorAll(".site-email-display").forEach(el => el.textContent = settings.contactEmail);
  document.querySelectorAll(".site-address-display").forEach(el => el.textContent = settings.address);
  document.querySelectorAll(".site-announcement-display").forEach(el => el.textContent = settings.announcement);

  // Delivery Fees in checkout
  const insideFeeEl = document.getElementById("inside-dhaka-fee-label");
  const outsideFeeEl = document.getElementById("outside-dhaka-fee-label");
  if (insideFeeEl) insideFeeEl.textContent = `৳${settings.insideDhakaDelivery}`;
  if (outsideFeeEl) outsideFeeEl.textContent = `৳${settings.outsideDhakaDelivery}`;

  // WhatsApp quick text
  const waPromptMsg = document.getElementById("wa-custom-msg-input");
  if (waPromptMsg && !waPromptMsg.value) {
    waPromptMsg.value = settings.whatsappDefaultMsg || "Hello, I want to inquire about products.";
  }
}

// Render Categories
function renderCategories() {
  const container = document.getElementById("categories-bar");
  if (!container) return;

  const categories = Store.getCategories();
  container.innerHTML = categories.map(cat => `
    <button class="category-pill ${currentCategory === cat.id ? 'active' : ''}" data-cat-id="${cat.id}">
      <i class="fas ${cat.icon || 'fa-tag'}"></i>
      <span>${cat.name}</span>
    </button>
  `).join("");

  container.querySelectorAll(".category-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.catId;
      renderCategories();
      renderProducts();
    });
  });
}

// Render Products Grid
function renderProducts() {
  const grid = document.getElementById("products-grid");
  const countEl = document.getElementById("product-count-display");
  if (!grid) return;

  let products = Store.getProducts();

  // Filter Category
  if (currentCategory !== "all") {
    products = products.filter(p => p.category === currentCategory);
  }

  // Filter Search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Sort
  if (currentSort === "price-low") {
    products.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-high") {
    products.sort((a, b) => b.price - a.price);
  } else if (currentSort === "rating") {
    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  if (countEl) countEl.textContent = `${products.length} টি পণ্য পাওয়া গেছে`;

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: #64748b;">
        <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; color: #cbd5e1;"></i>
        <h3>কোন পণ্য খুঁজে পাওয়া যায়নি!</h3>
        <p style="margin-top: 6px;">দয়া করে অন্য ক্যাটাগরি বা সার্চ কি-ওয়ার্ড ব্যবহার করে দেখুন।</p>
      </div>
    `;
    return;
  }

  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  grid.innerHTML = products.map(product => {
    const discount = product.regularPrice && product.regularPrice > product.price
      ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
      : null;

    return `
      <div class="product-card">
        <div class="product-img-box">
          <img src="${product.image}" alt="${escapeHtml(product.name)}" class="product-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'">
          ${product.badge ? `<div class="product-badge-pos"><span class="badge badge-hot">${escapeHtml(product.badge)}</span></div>` : ''}
          <button class="quick-view-btn" onclick="openQuickView('${product.id}')">
            <i class="fas fa-eye"></i> বিস্তারিত
          </button>
        </div>
        <div class="product-info">
          <span class="product-category-tag">${getCategoryName(product.category)}</span>
          <h3 class="product-title" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h3>
          <div class="product-rating">
            ${getStarRatingHtml(product.rating || 5)}
            <span class="rating-count">(${product.reviewsCount || 10})</span>
          </div>
          <div class="product-price-row">
            <span class="current-price">${curr}${Number(product.price).toLocaleString()}</span>
            ${product.regularPrice && product.regularPrice > product.price ? `
              <span class="regular-price">${curr}${Number(product.regularPrice).toLocaleString()}</span>
              <span class="discount-tag">-${discount}%</span>
            ` : ''}
          </div>
          <div class="product-actions">
            <button class="btn-add-cart" onclick="addToCartClick('${product.id}')">
              <i class="fas fa-cart-plus"></i> ব্যাগে নিন
            </button>
            <button class="btn-buy-now" onclick="buyNowClick('${product.id}')">
              অর্ডার করুন
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Helpers
function getCategoryName(catId) {
  const cats = Store.getCategories();
  const found = cats.find(c => c.id === catId);
  return found ? found.name : catId;
}

function getStarRatingHtml(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += `<i class="fas fa-star"></i>`;
    } else if (i - 0.5 <= rating) {
      stars += `<i class="fas fa-star-half-alt"></i>`;
    } else {
      stars += `<i class="far fa-star"></i>`;
    }
  }
  return stars;
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Toast Notifications
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  let icon = "fa-check-circle";
  if (type === "error") icon = "fa-exclamation-circle";
  if (type === "warning") icon = "fa-info-circle";

  toast.innerHTML = `
    <i class="fas ${icon}" style="font-size: 1.2rem; color: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981'};"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Cart Interactions
function addToCartClick(productId) {
  const product = Store.getProductById(productId);
  if (!product) return;
  Store.addToCart(product, 1);
  showToast(`"${product.name.slice(0, 20)}..." কার্টে যুক্ত করা হয়েছে!`, "success");
}

function buyNowClick(productId) {
  const product = Store.getProductById(productId);
  if (!product) return;
  Store.addToCart(product, 1);
  openCheckoutModal();
}

function updateCartUI() {
  const cart = Store.getCart();
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  // Badges
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count-badge").forEach(el => el.textContent = totalCount);

  // Drawer list
  const drawerBody = document.getElementById("cart-drawer-body");
  const subtotalEl = document.getElementById("cart-drawer-subtotal");
  if (!drawerBody) return;

  if (cart.length === 0) {
    drawerBody.innerHTML = `
      <div class="cart-empty-view">
        <i class="fas fa-shopping-basket"></i>
        <h4>আপনার কার্ট বর্তমানে খালি</h4>
        <p style="font-size: 0.85rem; margin-top: 4px;">পণ্য দেখতে ব্রাউজ করুন এবং কার্টে যোগ করুন</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = `${curr}0`;
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (subtotalEl) subtotalEl.textContent = `${curr}${subtotal.toLocaleString()}`;

  drawerBody.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${escapeHtml(item.name)}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${escapeHtml(item.name)}</h4>
        <div class="cart-item-price">${curr}${Number(item.price).toLocaleString()}</div>
        <div class="cart-qty-controls">
          <button class="cart-qty-btn" onclick="Store.updateCartQty('${item.id}', -1)"><i class="fas fa-minus"></i></button>
          <span class="cart-qty-num">${item.quantity}</span>
          <button class="cart-qty-btn" onclick="Store.updateCartQty('${item.id}', 1)"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="Store.removeFromCart('${item.id}')" title="মুছে ফেলুন">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join("");
}

// Drawer Controls
function openCartDrawer() {
  document.getElementById("cart-drawer-modal").classList.add("active");
}
function closeCartDrawer() {
  document.getElementById("cart-drawer-modal").classList.remove("active");
}

// Quick View Modal
function openQuickView(productId) {
  const product = Store.getProductById(productId);
  if (!product) return;

  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  const modal = document.getElementById("quick-view-modal");
  const container = document.getElementById("quick-view-content");

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; align-items: center;">
      <div style="border-radius: 12px; overflow: hidden; background: #f8fafc; height: 280px;">
        <img src="${product.image}" alt="${escapeHtml(product.name)}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div>
        <span class="badge badge-best" style="margin-bottom: 8px;">${getCategoryName(product.category)}</span>
        <h2 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 8px;">${escapeHtml(product.name)}</h2>
        <div class="product-rating" style="margin-bottom: 12px;">
          ${getStarRatingHtml(product.rating || 5)}
          <span class="rating-count">(${product.reviewsCount || 25} গ্রাহক রিভিউ)</span>
        </div>
        <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 1rem;">
          <span style="font-size: 1.6rem; font-weight: 800; color: var(--text-main);">${curr}${Number(product.price).toLocaleString()}</span>
          ${product.regularPrice ? `<span style="text-decoration: line-through; color: var(--text-muted);">${curr}${Number(product.regularPrice).toLocaleString()}</span>` : ''}
        </div>
        <p style="font-size: 0.9rem; color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
          ${escapeHtml(product.description || "উন্নত মানের ও দীর্ঘস্থায়ী কোয়ালিটি সম্পন্ন অরিজিনাল পণ্য।")}
        </p>
        <div style="display: flex; gap: 10px;">
          <button class="btn-primary" style="flex: 1; justify-content: center;" onclick="addToCartClick('${product.id}'); closeQuickView();">
            <i class="fas fa-cart-plus"></i> কার্টে নিন
          </button>
          <button class="btn-buy-now" style="flex: 1; justify-content: center;" onclick="buyNowClick('${product.id}'); closeQuickView();">
            সরাসরি কিনুন
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
}
function closeQuickView() {
  document.getElementById("quick-view-modal").classList.remove("active");
}

// Checkout Modal & Calculation
function openCheckoutModal() {
  closeCartDrawer();
  const cart = Store.getCart();
  if (cart.length === 0) {
    showToast("আপনার কার্ট খালি! অনুগ্রহ করে পণ্য যুক্ত করুন।", "warning");
    return;
  }
  appliedCoupon = null;
  renderCheckoutSummary();
  updatePaymentInstruction();
  document.getElementById("checkout-modal").classList.add("active");
}
function closeCheckoutModal() {
  document.getElementById("checkout-modal").classList.remove("active");
}

function renderCheckoutSummary() {
  const cart = Store.getCart();
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  const itemsContainer = document.getElementById("checkout-items-list");
  if (!itemsContainer) return;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Delivery Area Check
  const deliveryRadio = document.querySelector('input[name="deliveryArea"]:checked');
  const deliveryArea = deliveryRadio ? deliveryRadio.value : "inside";
  const deliveryFee = deliveryArea === "inside" ? Number(settings.insideDhakaDelivery) : Number(settings.outsideDhakaDelivery);

  // Discount
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

  itemsContainer.innerHTML = cart.map(item => `
    <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 6px;">
      <span>${escapeHtml(item.name)} <strong style="color: var(--primary);">x${item.quantity}</strong></span>
      <strong>${curr}${(item.price * item.quantity).toLocaleString()}</strong>
    </div>
  `).join("");

  document.getElementById("checkout-subtotal").textContent = `${curr}${subtotal.toLocaleString()}`;
  document.getElementById("checkout-delivery-fee").textContent = `${curr}${deliveryFee.toLocaleString()}`;
  document.getElementById("checkout-discount").textContent = `-${curr}${discount.toLocaleString()}`;
  document.getElementById("checkout-grand-total").textContent = `${curr}${grandTotal.toLocaleString()}`;
}

function applyCouponCode() {
  const input = document.getElementById("coupon-input");
  const code = input ? input.value.trim() : "";
  if (!code) {
    showToast("দয়া করে কুপন কোড লিখুন", "warning");
    return;
  }

  const cart = Store.getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const result = Store.validateCoupon(code, subtotal);

  if (result.valid) {
    appliedCoupon = result.coupon;
    showToast(`কুপন কোড প্রযোজ্য হয়েছে! ৳${result.discount} ডিসকাউন্ট পেয়েছেন।`, "success");
    renderCheckoutSummary();
  } else {
    showToast(result.message, "error");
  }
}

function updatePaymentInstruction() {
  const method = document.querySelector('input[name="paymentMethod"]:checked')?.value || "cod";
  const settings = Store.getSettings();
  const instructionBox = document.getElementById("payment-instruction-box");
  const trxGroup = document.getElementById("trxid-form-group");

  if (!instructionBox) return;

  if (method === "bkash") {
    trxGroup.style.display = "block";
    instructionBox.innerHTML = `
      <div style="color: var(--bkash); font-weight: 700; margin-bottom: 4px;">
        <i class="fas fa-mobile-alt"></i> bKash পেমেন্ট নির্দেশনা:
      </div>
      <p>১. আপনার বিকাশ অ্যাপ থেকে Send Money অপশনে যান।</p>
      <p>২. বিকাশ নাম্বার: <strong>${settings.bkashNumber || '01700000000'}</strong></p>
      <p>৩. মোট টাকার পরিমাণ পাঠিয়ে প্রাপ্ত <strong>TrxID (ট্রানজেকশন আইডি)</strong> নিচের বক্সে দিন।</p>
    `;
  } else if (method === "nagad") {
    trxGroup.style.display = "block";
    instructionBox.innerHTML = `
      <div style="color: var(--nagad); font-weight: 700; margin-bottom: 4px;">
        <i class="fas fa-wallet"></i> Nagad পেমেন্ট নির্দেশনা:
      </div>
      <p>১. নগদ অ্যাপ থেকে Send Money করুন।</p>
      <p>২. নগদ নাম্বার: <strong>${settings.nagadNumber || '01800000000'}</strong></p>
      <p>৩. সেন্ড মানি শেষে প্রাপ্ত <strong>TrxID</strong> নিচের ঘরে প্রদান করুন।</p>
    `;
  } else if (method === "rocket") {
    trxGroup.style.display = "block";
    instructionBox.innerHTML = `
      <div style="color: var(--rocket); font-weight: 700; margin-bottom: 4px;">
        <i class="fas fa-rocket"></i> Rocket পেমেন্ট নির্দেশনা:
      </div>
      <p>১. রকেট একাউন্ট থেকে Send Money করুন।</p>
      <p>২. রকেট নাম্বার: <strong>${settings.rocketNumber || '01900000000-8'}</strong></p>
      <p>৩. প্রাপ্ত ট্রানজেকশন আইডি নিচের বক্সে ইনপুট দিন।</p>
    `;
  } else {
    trxGroup.style.display = "none";
    instructionBox.innerHTML = `
      <div style="color: #15803d; font-weight: 700; margin-bottom: 4px;">
        <i class="fas fa-truck"></i> ক্যাশ অন ডেলিভারি (Cash on Delivery):
      </div>
      <p>পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন। সারা দেশে দ্রুত হোম ডেলিভারি সুবিধা।</p>
    `;
  }
}

// Place Order Form Submission
function handleCheckoutSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.customerName.value.trim();
  const phone = form.customerPhone.value.trim();
  const address = form.customerAddress.value.trim();
  const deliveryArea = form.deliveryArea.value;
  const paymentMethod = form.paymentMethod.value;
  const trxId = form.trxId ? form.trxId.value.trim() : "";
  const notes = form.customerNotes ? form.customerNotes.value.trim() : "";

  if (!name || !phone || !address) {
    showToast("দয়া করে নাম, মোবাইল নম্বর এবং ঠিকানা পূরণ করুন!", "error");
    return;
  }

  if ((paymentMethod === "bkash" || paymentMethod === "nagad" || paymentMethod === "rocket") && !trxId) {
    showToast("অনলাইন পেমেন্টের ক্ষেত্রে TrxID প্রদান করা আবশ্যক!", "error");
    return;
  }

  const cart = Store.getCart();
  if (cart.length === 0) return;

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
    customerName: name,
    phone: phone,
    address: address,
    deliveryArea: deliveryArea,
    deliveryFee: deliveryFee,
    paymentMethod: paymentMethod,
    trxId: trxId || (paymentMethod === "cod" ? "N/A (Cash on Delivery)" : "Pending"),
    items: [...cart],
    subtotal: subtotal,
    discount: discount,
    couponCode: couponCode,
    total: grandTotal,
    notes: notes
  };

  const createdOrder = Store.createOrder(orderData);
  Store.clearCart();
  closeCheckoutModal();
  form.reset();

  showOrderSuccessModal(createdOrder);
}

// Order Confirmation Modal & Invoice
function showOrderSuccessModal(order) {
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  const modal = document.getElementById("order-success-modal");
  const container = document.getElementById("order-success-content");

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      <div style="width: 60px; height: 60px; border-radius: 50%; background: #dcfce7; color: #16a34a; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
        <i class="fas fa-check"></i>
      </div>
      <h2 style="font-size: 1.5rem; font-weight: 800; color: #1e293b;">ধন্যবাদ! আপনার অর্ডারটি সফল হয়েছে।</h2>
      <p style="color: #64748b; font-size: 0.9rem; margin-top: 4px;">অর্ডার ট্র্যাকিং কোড: <strong style="color: var(--primary); font-size: 1.1rem;">${order.orderId}</strong></p>
    </div>

    <div style="background: #f8fafc; border-radius: 12px; padding: 1.25rem; border: 1px solid var(--border-color); font-size: 0.88rem; margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="color: #64748b;">গ্রাহকের নাম:</span>
        <strong>${escapeHtml(order.customerName)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="color: #64748b;">মোবাইল নম্বর:</span>
        <strong>${escapeHtml(order.phone)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="color: #64748b;">পেমেন্ট পদ্ধতি:</span>
        <strong style="text-transform: uppercase;">${order.paymentMethod}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="color: #64748b;">সর্বমোট মূল্য:</span>
        <strong style="color: var(--primary); font-size: 1rem;">${curr}${Number(order.total).toLocaleString()}</strong>
      </div>
    </div>

    <div style="display: flex; gap: 10px;">
      <button class="btn-primary" style="flex: 1; justify-content: center;" onclick="printInvoice('${order.orderId}')">
        <i class="fas fa-print"></i> রশিদ ডাউনলোড / প্রিন্ট
      </button>
      <button class="btn-secondary" style="flex: 1; justify-content: center; background: #0f172a;" onclick="closeOrderSuccessModal()">
        ঠিক আছে
      </button>
    </div>
  `;

  modal.classList.add("active");
}
function closeOrderSuccessModal() {
  document.getElementById("order-success-modal").classList.remove("active");
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
      <title>Invoice - ${order.orderId}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #1e293b; max-width: 750px; margin: auto; }
        .invoice-box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left; }
        .table th { background: #f8fafc; }
        .total-row { display: flex; justify-content: flex-end; margin-top: 15px; }
        .total-box { width: 280px; }
        .total-box div { display: flex; justify-content: space-between; padding: 4px 0; }
        .badge { padding: 4px 8px; border-radius: 4px; background: #e0f2fe; color: #0284c7; font-size: 12px; font-weight: bold; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div>
            <h2 style="margin:0; color: #0284c7;">${settings.storeName}</h2>
            <p style="margin: 4px 0; color: #64748b; font-size: 13px;">${settings.tagline}</p>
            <p style="margin: 4px 0; font-size: 13px;">Phone: ${settings.contactPhone}</p>
          </div>
          <div style="text-align: right;">
            <h3 style="margin:0;">INVOICE</h3>
            <p style="margin: 4px 0; font-weight: bold; color: #0284c7;">${order.orderId}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #64748b;">${order.date}</p>
          </div>
        </div>

        <div>
          <h4>Customer Details:</h4>
          <p style="margin: 2px 0;"><strong>Name:</strong> ${escapeHtml(order.customerName)}</p>
          <p style="margin: 2px 0;"><strong>Phone:</strong> ${escapeHtml(order.phone)}</p>
          <p style="margin: 2px 0;"><strong>Address:</strong> ${escapeHtml(order.address)}</p>
          <p style="margin: 2px 0;"><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()} | <strong>TrxID:</strong> ${escapeHtml(order.trxId)}</p>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${escapeHtml(item.name)}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">${curr}${Number(item.price).toLocaleString()}</td>
                <td style="text-align: right;">${curr}${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="total-row">
          <div class="total-box">
            <div><span>Subtotal:</span> <strong>${curr}${Number(order.subtotal).toLocaleString()}</strong></div>
            ${order.discount ? `<div><span>Discount (${order.couponCode || 'Coupon'}):</span> <strong>-${curr}${Number(order.discount).toLocaleString()}</strong></div>` : ''}
            <div><span>Delivery Fee:</span> <strong>${curr}${Number(order.deliveryFee).toLocaleString()}</strong></div>
            <div style="border-top: 1px solid #1e293b; margin-top: 4px; padding-top: 6px; font-size: 16px;">
              <span>Grand Total:</span> <strong>${curr}${Number(order.total).toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8;">
          <p>Thank you for shopping with ${settings.storeName}!</p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px;" class="no-print">
        <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px; background: #0284c7; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Print Invoice</button>
      </div>
    </body>
    </html>
  `);
  win.document.close();
}

// Order Tracking System
function handleTrackOrder(e) {
  e.preventDefault();
  const input = document.getElementById("track-order-input").value.trim();
  if (!input) {
    showToast("অর্ডার আইডি অথবা মোবাইল নম্বর লিখুন", "warning");
    return;
  }

  const orders = Store.getOrders();
  const found = orders.filter(o =>
    o.orderId.toLowerCase() === input.toLowerCase() ||
    o.phone.includes(input)
  );

  const resultContainer = document.getElementById("track-order-result-box");
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  if (found.length === 0) {
    resultContainer.innerHTML = `
      <div style="padding: 1.5rem; background: #fff; border-radius: 12px; border: 1px solid var(--border-color); text-align: center; color: #ef4444;">
        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 8px;"></i>
        <p>দুঃখিত! <strong>"${escapeHtml(input)}"</strong> দিয়ে কোনো অর্ডার পাওয়া যায়নি।</p>
      </div>
    `;
    return;
  }

  resultContainer.innerHTML = found.map(order => `
    <div style="background: #fff; border-radius: 12px; padding: 1.5rem; border: 1.5px solid var(--border-color); margin-bottom: 12px; box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 10px;">
        <div>
          <h4 style="color: var(--primary); font-weight: 800;">${order.orderId}</h4>
          <span style="font-size: 0.78rem; color: #64748b;">${order.date}</span>
        </div>
        <span class="status-badge status-${order.status}">${order.status}</span>
      </div>
      <p style="font-size: 0.88rem; margin-bottom: 4px;"><strong>গ্রাহক:</strong> ${escapeHtml(order.customerName)} (${escapeHtml(order.phone)})</p>
      <p style="font-size: 0.88rem; margin-bottom: 6px;"><strong>পেমেন্ট:</strong> ${order.paymentMethod.toUpperCase()} | <strong>সর্বমোট:</strong> ${curr}${Number(order.total).toLocaleString()}</p>
      <div style="font-size: 0.82rem; color: #64748b; margin-top: 8px;">
        <strong>পণ্যসমূহ:</strong> ${order.items.map(i => `${escapeHtml(i.name)} (x${i.quantity})`).join(", ")}
      </div>
      <button class="btn-secondary" style="margin-top: 10px; padding: 6px 14px; font-size: 0.8rem; background: #f1f5f9; color: var(--text-main);" onclick="printInvoice('${order.orderId}')">
        <i class="fas fa-file-invoice"></i> রশিদ দেখুন
      </button>
    </div>
  `).join("");
}

// WhatsApp Floating Button Logic
function toggleWhatsAppPopup() {
  const popup = document.getElementById("whatsapp-popup-card");
  popup.classList.toggle("active");
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
  // Search bar
  const searchInput = document.getElementById("main-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Sort selector
  const sortSelect = document.getElementById("product-sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  // Checkout Delivery Area toggle
  document.querySelectorAll('input[name="deliveryArea"]').forEach(radio => {
    radio.addEventListener("change", () => renderCheckoutSummary());
  });

  // Payment method selection toggle
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener("change", () => {
      document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
      radio.closest('.payment-option').classList.add('active');
      updatePaymentInstruction();
    });
  });

  // Track Order Form
  const trackForm = document.getElementById("track-order-form");
  if (trackForm) {
    trackForm.addEventListener("submit", handleTrackOrder);
  }

  // Checkout Form
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  }
}
