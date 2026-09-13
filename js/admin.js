/**
 * Admin Panel Controller & Management Suite
 * Luxury Obsidian & Gold Aesthetic
 * Full Control: Products, Orders (5-Step Tracking), Categories, Coupons, Settings & Backup
 */

let isAdminLoggedIn = false;
let currentAdminTab = "dashboard";

// Reliable Universal Toast Notification System
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const iconName = type === 'error' ? 'error' : (type === 'warning' ? 'warning' : 'check_circle');
  const iconColor = type === 'error' ? '#ef4444' : (type === 'warning' ? '#f59e0b' : '#10b981');
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[24px]" style="font-variation-settings: 'FILL' 1; color: ${iconColor}; flex-shrink: 0;">${iconName}</span>
    <span style="flex: 1; font-weight: 600; font-size: 0.95rem;">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-15px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

// Initialize Admin Portal via secret hash or direct trigger
function openAdminPortal() {
  const sessionAuth = sessionStorage.getItem("noor_admin_auth");

  if (window.location.hash !== "#admin-master-panel") {
    history.replaceState(null, null, "#admin-master-panel");
  }

  if (sessionAuth === "true") {
    isAdminLoggedIn = true;
    showAdminDashboard();
  } else {
    document.getElementById("admin-login-modal").classList.add("active");
  }
}

// Switch Auth Mode in index.html (Email vs PIN)
function switchAdminAuthMode(mode) {
  const emailBtn = document.getElementById("tab-btn-email-auth");
  const pinBtn = document.getElementById("tab-btn-pin-auth");
  const emailForm = document.getElementById("admin-email-login-form");
  const pinForm = document.getElementById("admin-pin-login-form");

  if (mode === "email") {
    if (emailBtn) {
      emailBtn.className = "py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all bg-slate-900 text-white shadow-sm";
    }
    if (pinBtn) {
      pinBtn.className = "py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all text-slate-600 hover:text-slate-900";
    }
    if (emailForm) emailForm.classList.remove("hidden");
    if (pinForm) pinForm.classList.add("hidden");
  } else {
    if (pinBtn) {
      pinBtn.className = "py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all bg-slate-900 text-white shadow-sm";
    }
    if (emailBtn) {
      emailBtn.className = "py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all text-slate-600 hover:text-slate-900";
    }
    if (pinForm) pinForm.classList.remove("hidden");
    if (emailForm) emailForm.classList.add("hidden");
  }
}

// Switch Auth Mode in dedicated admin.html
function switchDedicatedAuthMode(mode) {
  const emailBtn = document.getElementById("tab-btn-dedicated-email");
  const pinBtn = document.getElementById("tab-btn-dedicated-pin");
  const emailForm = document.getElementById("dedicated-email-form");
  const pinForm = document.getElementById("dedicated-pin-form");

  if (mode === "email") {
    if (emailBtn) emailBtn.className = "py-2 text-xs font-bold uppercase tracking-wider rounded transition-all bg-secondary text-on-secondary";
    if (pinBtn) pinBtn.className = "py-2 text-xs font-bold uppercase tracking-wider rounded transition-all text-secondary-fixed hover:text-white";
    if (emailForm) emailForm.classList.remove("hidden");
    if (pinForm) pinForm.classList.add("hidden");
  } else {
    if (pinBtn) pinBtn.className = "py-2 text-xs font-bold uppercase tracking-wider rounded transition-all bg-secondary text-on-secondary";
    if (emailBtn) emailBtn.className = "py-2 text-xs font-bold uppercase tracking-wider rounded transition-all text-secondary-fixed hover:text-white";
    if (pinForm) pinForm.classList.remove("hidden");
    if (emailForm) emailForm.classList.add("hidden");
  }
}

function togglePassVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.type = input.type === "password" ? "text" : "password";
  }
}

/// Option 1: Handle Email & Password Login with Firebase Auth
async function handleAdminEmailLogin(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const emailInput = document.getElementById("admin-email-input");
  const passInput = document.getElementById("admin-pass-input");

  const enteredEmail = emailInput ? emailInput.value.trim().toLowerCase() : "";
  const enteredPass = passInput ? passInput.value.trim() : "";

  if (!enteredEmail || !enteredPass) {
    showToast("Please enter Admin Gmail and Password", "error");
    return;
  }

  const originalBtnText = submitBtn ? submitBtn.innerHTML : "";
  if (submitBtn) {
    submitBtn.innerHTML = `<span class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> Authenticating with Firebase...`;
    submitBtn.disabled = true;
  }

  try {
    let result = { success: false };
    if (window.FirebaseAuth && window.FirebaseAuth.loginAdminWithFirebase) {
      result = await window.FirebaseAuth.loginAdminWithFirebase(enteredEmail, enteredPass);
    } else {
      const settings = Store.getSettings();
      const validEmail = (settings.adminEmail || "admin@gmail.com").toLowerCase();
      const validPass = settings.adminPassword || "admin123";
      if ((enteredEmail === validEmail || enteredEmail === "admin@noor.com.bd") && enteredPass === validPass) {
        result = { success: true };
      }
    }

    if (result.success) {
      isAdminLoggedIn = true;
      sessionStorage.setItem("noor_admin_auth", "true");
      document.getElementById("admin-login-modal").classList.remove("active");
      showToast("🔥 Firebase Auth: Welcome Sovereign Admin!", "success");
      showAdminDashboard();
    } else {
      showToast(result.error || "Incorrect Gmail or Password in Firebase Auth!", "error");
    }
  } catch (err) {
    showToast("Authentication error: " + err.message, "error");
  } finally {
    if (submitBtn) {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  }
}

// Option 2: Handle Security PIN Login
function handleAdminLogin(e) {
  e.preventDefault();
  const pinInput = document.getElementById("admin-pin-input");
  const settings = Store.getSettings();
  const enteredPin = pinInput ? pinInput.value.trim() : "";

  if (enteredPin === (settings.adminPin || "admin123")) {
    isAdminLoggedIn = true;
    sessionStorage.setItem("noor_admin_auth", "true");
    document.getElementById("admin-login-modal").classList.remove("active");
    if (pinInput) pinInput.value = "";
    showToast("Welcome to Sovereign Admin Panel", "success");
    showAdminDashboard();
  } else {
    showToast("Invalid Security PIN! (Default: admin123)", "error");
  }
}

// Option 3: Handle Google Admin Sign In
async function handleAdminGoogleLogin() {
  if (!window.FirebaseAuth || !window.FirebaseAuth.loginWithGoogle) {
    showToast("Firebase Google Auth initializing. Please retry in a second.", "warning");
    return;
  }

  showToast("Opening Google Authentication popup...", "info");
  const result = await window.FirebaseAuth.loginWithGoogle();
  if (result.success) {
    isAdminLoggedIn = true;
    sessionStorage.setItem("noor_admin_auth", "true");
    const modal = document.getElementById("admin-login-modal");
    if (modal) modal.classList.remove("active");
    showToast(`✓ Welcome Admin (${result.user.name || result.user.email})!`, "success");
    showAdminDashboard();
  } else {
    showToast(result.error || "Google Sign-In was cancelled or failed", "error");
  }
}

// Dedicated admin.html Email Login with Firebase Auth
async function handleDedicatedEmailLogin(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const email = document.getElementById("dedicated-admin-email").value.trim().toLowerCase();
  const pass = document.getElementById("dedicated-admin-pass").value.trim();

  if (!email || !pass) {
    showToast("Please enter Admin Gmail and Password", "error");
    return;
  }

  const originalBtnText = submitBtn ? submitBtn.innerHTML : "";
  if (submitBtn) {
    submitBtn.innerHTML = `<span class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> Authenticating with Firebase...`;
    submitBtn.disabled = true;
  }

  try {
    let result = { success: false };
    if (window.FirebaseAuth && window.FirebaseAuth.loginAdminWithFirebase) {
      result = await window.FirebaseAuth.loginAdminWithFirebase(email, pass);
    } else {
      const settings = Store.getSettings();
      const validEmail = (settings.adminEmail || "admin@gmail.com").toLowerCase();
      const validPass = settings.adminPassword || "admin123";
      if ((email === validEmail || email === "admin@noor.com.bd") && pass === validPass) {
        result = { success: true };
      }
    }

    if (result.success) {
      isAdminLoggedIn = true;
      sessionStorage.setItem("noor_admin_auth", "true");
      document.getElementById("admin-auth-screen").classList.add("hidden");
      document.getElementById("admin-main-interface").classList.remove("hidden");
      showToast("🔥 Firebase Auth: Welcome to Admin Portal", "success");
      switchAdminTab("dashboard");
    } else {
      showToast(result.error || "Incorrect Gmail or Password in Firebase Auth!", "error");
    }
  } catch (err) {
    showToast("Authentication error: " + err.message, "error");
  } finally {
    if (submitBtn) {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  }
}

// Dedicated admin.html PIN Login
function handleDedicatedAdminLogin(e) {
  e.preventDefault();
  const pinInput = document.getElementById("dedicated-admin-pin");
  const settings = Store.getSettings();
  const enteredPin = pinInput ? pinInput.value.trim() : "";

  if (enteredPin === (settings.adminPin || "admin123")) {
    isAdminLoggedIn = true;
    sessionStorage.setItem("noor_admin_auth", "true");
    document.getElementById("admin-auth-screen").classList.add("hidden");
    document.getElementById("admin-main-interface").classList.remove("hidden");
    showToast("Access Granted via Security PIN", "success");
    switchAdminTab("dashboard");
  } else {
    showToast("Invalid PIN Code! (Default: admin123)", "error");
  }
}

function closeAdminLogin() {
  document.getElementById("admin-login-modal").classList.remove("active");
  if (window.location.hash === "#admin-master-panel") {
    history.replaceState(null, null, window.location.pathname);
  }
}

function adminLogout() {
  isAdminLoggedIn = false;
  sessionStorage.removeItem("noor_admin_auth");
  if (window.FirebaseAuth && window.FirebaseAuth.logoutAdminFromFirebase) {
    window.FirebaseAuth.logoutAdminFromFirebase();
  }
  document.getElementById("admin-portal-view").classList.remove("active");
  if (window.location.hash === "#admin-master-panel") {
    history.replaceState(null, null, window.location.pathname);
  }
  showToast("Logged out of Sovereign Admin Panel", "warning");
}

function dedicatedAdminLogout() {
  sessionStorage.removeItem("noor_admin_auth");
  if (window.FirebaseAuth && window.FirebaseAuth.logoutAdminFromFirebase) {
    window.FirebaseAuth.logoutAdminFromFirebase();
  }
  location.reload();
}

function exitAdminPortal() {
  document.getElementById("admin-portal-view").classList.remove("active");
  document.getElementById("storefront-view").style.display = "block";
  history.replaceState(null, null, window.location.pathname);
}

function showAdminDashboard() {
  document.getElementById("storefront-view").style.display = "none";
  document.getElementById("admin-portal-view").classList.add("active");
  switchAdminTab("dashboard");
}

function switchAdminTab(tabName) {
  currentAdminTab = tabName;

  document.querySelectorAll(".admin-nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  document.querySelectorAll(".admin-tab-pane").forEach(pane => {
    pane.style.display = pane.id === `admin-tab-${tabName}` ? "block" : "none";
  });

  if (tabName === "dashboard") renderAdminDashboardStats();
  if (tabName === "products") renderAdminProductsTable();
  if (tabName === "orders") renderAdminOrdersTable();
  if (tabName === "categories") renderAdminCategoriesTable();
  if (tabName === "coupons") renderAdminCouponsTable();
  if (tabName === "settings") loadAdminSettingsForm();
}

function formatAdminBagItems(items = []) {
  if (!items || items.length === 0) {
    return '<span style="color:#94a3b8; font-size:0.75rem;">Bag empty</span>';
  }
  return `
    <div style="display:flex; flex-direction:column; gap:6px; max-width:220px;">
      ${items.slice(0, 2).map(it => `
        <div style="display:flex; align-items:center; gap:8px; font-size:0.78rem;">
          <img src="${it.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=100&q=80'}" style="width:28px; height:34px; object-fit:cover; border-radius:3px; border:1px solid rgba(115,92,0,0.3); flex-shrink:0;" alt="">
          <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            <strong style="display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#1a1c1c;" title="${it.name}">${it.name}</strong>
            <span style="color:#747878; font-size:0.72rem;">${it.quantity}x ${it.color && it.color !== 'Default' ? '• ' + it.color : ''} ${it.size && it.size !== 'Standard' ? '• ' + it.size : ''}</span>
          </div>
        </div>
      `).join("")}
      ${items.length > 2 ? `<span style="font-size:0.72rem; color:#735c00; font-weight:700;">+${items.length - 2} more masterpiece(s)</span>` : ''}
    </div>
  `;
}

// 1. Dashboard Tab
function renderAdminDashboardStats() {
  const orders = Store.getOrders();
  const products = Store.getProducts();
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  const totalSales = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Processing").length;
  const totalProducts = products.length;

  document.getElementById("admin-stat-sales").textContent = `${curr}${totalSales.toLocaleString()}`;
  document.getElementById("admin-stat-orders").textContent = totalOrders;
  document.getElementById("admin-stat-pending").textContent = pendingOrders;
  document.getElementById("admin-stat-products").textContent = totalProducts;

  // Update sidebar badges
  document.querySelectorAll(".admin-products-badge").forEach(el => {
    el.textContent = totalProducts;
  });
  document.querySelectorAll(".admin-orders-badge").forEach(el => {
    el.textContent = pendingOrders > 0 ? pendingOrders : totalOrders;
    el.style.display = totalOrders > 0 ? "inline-flex" : "none";
  });

  const recentOrdersTbody = document.getElementById("admin-recent-orders-tbody");
  if (recentOrdersTbody) {
    const recent = orders.slice(0, 5);
    if (recent.length === 0) {
      recentOrdersTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding:2rem;">No commissions recorded yet.</td></tr>`;
    } else {
      recentOrdersTbody.innerHTML = recent.map(o => `
        <tr>
          <td><strong class="text-secondary font-mono">${o.orderId}</strong></td>
          <td><strong>${o.customerName}</strong><br><small style="color:#747878;">${o.phone}</small></td>
          <td>${formatAdminBagItems(o.items)}</td>
          <td><strong class="text-primary">${curr}${Number(o.total).toLocaleString()}</strong></td>
          <td><span class="status-badge status-${o.status}">${o.status}</span></td>
          <td>${o.date}</td>
          <td>
            <button class="px-3 py-1.5 border border-secondary text-secondary hover:bg-secondary hover:text-on-secondary text-xs uppercase transition-colors" onclick="openOrderDetailsModal('${o.orderId}')">
              Review
            </button>
          </td>
        </tr>
      `).join("");
    }
  }
}

// 2. Products Tab & Modal CRUD
function renderAdminProductsTable() {
  const products = Store.getProducts();
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";
  const tbody = document.getElementById("admin-products-tbody");
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:#747878;">No masterpieces in catalog</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <img src="${p.image}" alt="" class="w-12 h-14 object-cover border border-secondary/20">
      </td>
      <td>
        <strong class="text-on-surface">${p.name}</strong>
        ${p.badge ? `<br><span class="badge badge-hot text-[10px] mt-1">${p.badge}</span>` : ''}
      </td>
      <td><span class="badge bg-secondary/10 text-secondary uppercase font-semibold">${getCategoryName(p.category)}</span></td>
      <td>
        <strong>${curr}${Number(p.price).toLocaleString()}</strong>
        ${p.regularPrice ? `<br><small class="line-through text-on-surface-variant">${curr}${Number(p.regularPrice).toLocaleString()}</small>` : ''}
      </td>
      <td>${p.stock || 0} units</td>
      <td>⭐ ${p.rating || 5} (${p.reviewsCount || 0})</td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="px-3 py-1 bg-surface-container border border-secondary/30 text-secondary hover:bg-secondary hover:text-on-secondary transition-colors text-xs" onclick="openProductEditModal('${p.id}')">
            Edit
          </button>
          <button class="px-3 py-1 bg-error/10 text-error hover:bg-error hover:text-on-error transition-colors text-xs" onclick="deleteProductConfirm('${p.id}')">
            Delete
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function openProductEditModal(productId = null) {
  const form = document.getElementById("admin-product-form");
  form.reset();

  const catSelect = document.getElementById("prod-category-select");
  const categories = Store.getCategories().filter(c => c.id !== 'all');
  catSelect.innerHTML = categories.map(c => `
    <option value="${c.id}">${c.name}</option>
  `).join("");

  const modalTitle = document.getElementById("product-modal-title");

  if (productId) {
    const p = Store.getProductById(productId);
    if (!p) return;
    modalTitle.textContent = "Edit Masterpiece (পণ্য সম্পাদন)";
    form.productId.value = p.id;
    form.prodName.value = p.name || "";
    form.prodCategory.value = p.category || categories[0]?.id;
    form.prodPrice.value = p.price || "";
    form.prodRegularPrice.value = p.regularPrice || "";
    form.prodStock.value = p.stock || "";
    form.prodBadge.value = p.badge || "";
    form.prodImage.value = p.image || "";
    form.prodDescription.value = p.description || "";
  } else {
    modalTitle.textContent = "Add New Masterpiece (নতুন পণ্য)";
    form.productId.value = "";
    form.prodStock.value = "30";
    form.prodImage.value = "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85";
  }

  document.getElementById("admin-product-modal").classList.add("active");
}

function closeProductEditModal() {
  document.getElementById("admin-product-modal").classList.remove("active");
}

function handleSaveProductSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.productId.value;
  const name = form.prodName.value.trim();
  const category = form.prodCategory.value;
  const price = Number(form.prodPrice.value);
  const regularPrice = form.prodRegularPrice.value ? Number(form.prodRegularPrice.value) : price;
  const stock = Number(form.prodStock.value) || 0;
  const badge = form.prodBadge.value.trim();
  const image = form.prodImage.value.trim();
  const description = form.prodDescription.value.trim();

  if (!name || isNaN(price) || price <= 0) {
    showToast("Please provide valid product name and BDT price", "error");
    return;
  }

  const productData = {
    name,
    category,
    price,
    regularPrice,
    stock,
    badge,
    image,
    description,
    rating: 5.0,
    reviewsCount: 30
  };

  if (id) {
    productData.id = id;
    const existing = Store.getProductById(id);
    if (existing) {
      productData.rating = existing.rating;
      productData.reviewsCount = existing.reviewsCount;
      productData.colors = existing.colors;
      productData.sizes = existing.sizes;
      productData.gallery = existing.gallery;
    }
  }

  Store.saveProduct(productData);
  closeProductEditModal();
  renderAdminProductsTable();
  showToast(id ? "Masterpiece updated successfully!" : "New Masterpiece created successfully!", "success");
}

function deleteProductConfirm(productId) {
  const p = Store.getProductById(productId);
  if (!p) return;
  if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
    Store.deleteProduct(productId);
    renderAdminProductsTable();
    showToast("Product removed from catalog", "success");
  }
}

// 3. Orders Tab & Status Updater
function renderAdminOrdersTable(filterStatus = "all") {
  let orders = Store.getOrders();
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";
  const tbody = document.getElementById("admin-orders-tbody");
  if (!tbody) return;

  if (filterStatus !== "all") {
    orders = orders.filter(o => o.status === filterStatus);
  }

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:#747878;">No commissions found.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong class="text-secondary font-mono">${o.orderId}</strong><br><small style="color:#747878;">${o.date}</small></td>
      <td>
        <strong>${o.customerName}</strong><br>
        <span style="font-size:0.8rem; color:#735c00;"><i class="fas fa-phone mr-1"></i> ${o.phone}</span><br>
        <small style="color:#747878; display:block; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${o.address}">${o.address}</small>
      </td>
      <td>${formatAdminBagItems(o.items)}</td>
      <td>
        <span style="text-transform:uppercase; font-weight:700; font-size:0.8rem;">${o.paymentMethod}</span><br>
        <small style="color:#747878;">Trx: ${o.trxId}</small>
      </td>
      <td><strong>${curr}${Number(o.total).toLocaleString()}</strong></td>
      <td>
        <select onchange="updateOrderStatusFromTable('${o.orderId}', this.value)" style="padding:6px 10px; border-radius:4px; font-size:0.82rem; font-weight:600; border:1px solid #c4c7c7; background:#fff;">
          <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>1. Order Placed</option>
          <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>2. Artisanal Crafting</option>
          <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>3. Quality Inspection</option>
          <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>4. Dispatched</option>
          <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>5. Delivered</option>
          <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="px-2.5 py-1.5 border border-secondary text-secondary hover:bg-secondary hover:text-on-secondary transition-colors" onclick="openOrderDetailsModal('${o.orderId}')" title="Details">
            <i class="fas fa-eye"></i>
          </button>
          <button class="px-2.5 py-1.5 bg-primary text-on-primary hover:bg-secondary transition-colors" onclick="printInvoice('${o.orderId}')" title="Print Invoice">
            <i class="fas fa-print"></i>
          </button>
          <button class="px-2.5 py-1.5 bg-error/10 text-error hover:bg-error hover:text-on-error transition-colors" onclick="deleteOrderConfirm('${o.orderId}')" title="Delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function updateOrderStatusFromTable(orderId, newStatus) {
  Store.updateOrderStatus(orderId, newStatus);
  showToast(`Order ${orderId} status updated: ${newStatus}`, "success");
}

function deleteOrderConfirm(orderId) {
  if (confirm(`Delete commission order "${orderId}" permanently?`)) {
    Store.deleteOrder(orderId);
    renderAdminOrdersTable();
    showToast("Order removed", "success");
  }
}

function openOrderDetailsModal(orderId) {
  const orders = Store.getOrders();
  const order = orders.find(o => o.orderId === orderId);
  if (!order) return;

  const settings = Store.getSettings();
  const curr = settings.currency || "৳";

  const modal = document.getElementById("admin-order-details-modal");
  const content = document.getElementById("admin-order-details-content");

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #735c00; padding-bottom:12px; margin-bottom:16px;">
      <div>
        <span style="text-transform:uppercase; font-size:11px; letter-spacing:2px; color:#735c00;">Order Dossier</span>
        <h3 style="font-size:1.3rem; font-weight:800; color:var(--text-main);">${order.orderId}</h3>
        <span style="font-size:0.85rem; color:#747878;">Date: ${order.date}</span>
      </div>
      <span class="status-badge status-${order.status}">${order.status}</span>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; font-size:0.88rem;">
      <div style="background:#f3f3f4; padding:16px; border:1px solid #e2e2e2;">
        <h4 style="margin-bottom:6px; color:#1a1c1c; text-transform:uppercase; font-size:12px; letter-spacing:1px;">Patron Information:</h4>
        <p><strong>Name:</strong> ${order.customerName}</p>
        <p><strong>Phone:</strong> <a href="tel:${order.phone}" style="color:#735c00; font-weight:700;">${order.phone}</a></p>
        <p><strong>Email:</strong> ${order.email || 'N/A'}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
      </div>
      <div style="background:#f3f3f4; padding:16px; border:1px solid #e2e2e2;">
        <h4 style="margin-bottom:6px; color:#1a1c1c; text-transform:uppercase; font-size:12px; letter-spacing:1px;">Payment & Delivery:</h4>
        <p><strong>Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
        <p><strong>TrxID:</strong> <strong style="color:#735c00;">${order.trxId}</strong></p>
        <p><strong>Delivery Zone:</strong> ${order.deliveryArea === 'inside' ? 'Inside Dhaka (৳' + settings.insideDhakaDelivery + ')' : 'Outside Dhaka (৳' + settings.outsideDhakaDelivery + ')'}</p>
        <p><strong>Courier Fee:</strong> ${curr}${Number(order.deliveryFee).toLocaleString()}</p>
      </div>
    </div>

    <!-- Live Status Updater in Modal -->
    <div style="margin-bottom:16px; padding:12px 16px; background:#fff9e6; border:1px solid #735c00; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <div>
        <strong style="font-size:0.85rem; color:#735c00; text-transform:uppercase; letter-spacing:0.5px; display:block;">⚡ Live 5-Step Status (লাইভ অর্ডার আপডেট)</strong>
        <span style="font-size:0.75rem; color:#747878;">স্ট্যাটাস পরিবর্তন করলে ইউজারের ড্যাশবোর্ডে সাথে সাথে রিয়েল-টাইম আপডেট হবে</span>
      </div>
      <select onchange="updateOrderStatusFromTable('${order.orderId}', this.value); openOrderDetailsModal('${order.orderId}');" style="padding:8px 12px; font-weight:700; font-size:0.85rem; border:1px solid #735c00; background:#fff; cursor:pointer;">
        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>1. Order Placed (অর্ডার গৃহীত)</option>
        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>2. Artisanal Crafting (প্রস্তুত হচ্ছে)</option>
        <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>3. Quality Inspection (মান পরীক্ষা)</option>
        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>4. Dispatched (ডেলিভারিতে পাঠানো হয়েছে)</option>
        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>5. Delivered (ডেলিভারি সম্পন্ন)</option>
        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled (বাতিল)</option>
      </select>
    </div>

    <h4 style="margin-bottom:8px; text-transform:uppercase; font-size:12px; color:#735c00; letter-spacing:1px;">Curated Items:</h4>
    <div style="border:1px solid #e2e2e2; margin-bottom:16px;">
      <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
        <thead style="background:#f3f3f4;">
          <tr>
            <th style="padding:8px 12px; text-align:left;">Item</th>
            <th style="padding:8px 12px; text-align:center;">Variant</th>
            <th style="padding:8px 12px; text-align:center;">Qty</th>
            <th style="padding:8px 12px; text-align:right;">Unit Price</th>
            <th style="padding:8px 12px; text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr style="border-top:1px solid #e2e2e2;">
              <td style="padding:8px 12px;"><strong>${item.name}</strong></td>
              <td style="padding:8px 12px; text-align:center; color:#747878; font-size:0.8rem;">${(item.color && item.color !== 'Default' ? item.color : '') + (item.size && item.size !== 'Standard' ? ' • ' + item.size : '') || 'Standard'}</td>
              <td style="padding:8px 12px; text-align:center; font-weight:700;">${item.quantity}</td>
              <td style="padding:8px 12px; text-align:right;">${curr}${Number(item.price).toLocaleString()}</td>
              <td style="padding:8px 12px; text-align:right; font-weight:700;">${curr}${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <div style="text-align:right; font-size:0.95rem; margin-bottom:1.5rem;">
      <p>Subtotal: <strong>${curr}${Number(order.subtotal).toLocaleString()}</strong></p>
      ${order.discount ? `<p style="color:#735c00;">VIP Discount (${order.couponCode || 'Code'}): <strong>-${curr}${Number(order.discount).toLocaleString()}</strong></p>` : ''}
      <p>Courier Fee: <strong>${curr}${Number(order.deliveryFee).toLocaleString()}</strong></p>
      <h3 style="font-size:1.35rem; color:#1a1c1c; margin-top:4px;">Grand Total: <strong style="color:#735c00;">${curr}${Number(order.total).toLocaleString()}</strong></h3>
    </div>

    <div style="display:flex; gap:10px;">
      <button class="px-6 py-3 bg-secondary text-on-secondary uppercase text-xs font-semibold tracking-wider hover:bg-primary transition-colors flex-1" onclick="printInvoice('${order.orderId}')">
        <i class="fas fa-print mr-1"></i> Print Official Receipt
      </button>
      <button class="px-6 py-3 bg-primary text-on-primary uppercase text-xs font-semibold tracking-wider hover:bg-secondary transition-colors flex-1" onclick="closeOrderDetailsModal()">
        Close
      </button>
    </div>
  `;

  modal.classList.add("active");
}

function closeOrderDetailsModal() {
  document.getElementById("admin-order-details-modal").classList.remove("active");
}

// 4. Categories Tab
function renderAdminCategoriesTable() {
  const categories = Store.getCategories();
  const tbody = document.getElementById("admin-categories-tbody");
  if (!tbody) return;

  tbody.innerHTML = categories.map(cat => `
    <tr>
      <td><span class="material-symbols-outlined text-secondary">${cat.icon || 'diamond'}</span></td>
      <td><strong>${cat.name}</strong></td>
      <td><code>${cat.id}</code></td>
      <td>
        ${cat.id !== 'all' ? `
          <button class="px-3 py-1 bg-error/10 text-error hover:bg-error hover:text-on-error text-xs uppercase transition-colors" onclick="deleteCategoryClick('${cat.id}')">
            Delete
          </button>
        ` : '<span style="color:#747878; font-size:0.75rem;">Default</span>'}
      </td>
    </tr>
  `).join("");
}

function handleAddCategorySubmit(e) {
  e.preventDefault();
  const name = document.getElementById("new-cat-name").value.trim();
  const id = document.getElementById("new-cat-id").value.trim() || ("cat-" + Date.now());
  const icon = document.getElementById("new-cat-icon").value.trim() || "diamond";

  if (!name) return;

  Store.saveCategory({ id, name, icon });
  e.target.reset();
  renderAdminCategoriesTable();
  showToast("New category created successfully!", "success");
}

function deleteCategoryClick(catId) {
  if (confirm("Delete this category?")) {
    Store.deleteCategory(catId);
    renderAdminCategoriesTable();
    showToast("Category removed", "success");
  }
}

// 5. Coupons Tab
function renderAdminCouponsTable() {
  const coupons = Store.getCoupons();
  const settings = Store.getSettings();
  const curr = settings.currency || "৳";
  const tbody = document.getElementById("admin-coupons-tbody");
  if (!tbody) return;

  if (coupons.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:#747878;">No active VIP codes</td></tr>`;
    return;
  }

  tbody.innerHTML = coupons.map(c => `
    <tr>
      <td><strong class="text-secondary font-mono tracking-widest uppercase">${c.code}</strong></td>
      <td>${c.discountPercent ? `${c.discountPercent}% Privilege Off` : `${curr}${c.discountFixed} Off`}</td>
      <td>${curr}${c.minSpend || 0}</td>
      <td><span class="badge ${c.active ? 'badge-new' : 'badge-hot'}">${c.active ? 'Active' : 'Disabled'}</span></td>
      <td>
        <button class="px-3 py-1 bg-error/10 text-error hover:bg-error hover:text-on-error text-xs uppercase transition-colors" onclick="deleteCouponClick('${c.code}')">
          Delete
        </button>
      </td>
    </tr>
  `).join("");
}

function handleAddCouponSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const code = form.couponCode.value.trim().toUpperCase();
  const type = form.couponType.value;
  const val = Number(form.couponValue.value);
  const minSpend = Number(form.couponMinSpend.value) || 0;

  if (!code || isNaN(val) || val <= 0) {
    showToast("Please enter valid coupon code & discount amount", "error");
    return;
  }

  const coupon = {
    code,
    minSpend,
    active: true
  };

  if (type === "percent") {
    coupon.discountPercent = val;
    coupon.maxDiscount = Number(form.couponMaxDiscount.value) || 3000;
  } else {
    coupon.discountFixed = val;
  }

  Store.saveCoupon(coupon);
  form.reset();
  renderAdminCouponsTable();
  showToast(`VIP Code ${code} registered successfully!`, "success");
}

function deleteCouponClick(code) {
  if (confirm(`Delete VIP code "${code}"?`)) {
    Store.deleteCoupon(code);
    renderAdminCouponsTable();
    showToast("VIP Code removed", "success");
  }
}

// Hero Image Customization Helpers
function updateHeroPreview(url) {
  const preview = document.getElementById("admin-hero-preview-img");
  if (preview && url) {
    preview.src = url;
  }
}

function setHeroPreset(url) {
  const input = document.getElementById("admin-hero-img-input");
  if (input) {
    input.value = url;
    updateHeroPreview(url);
    showToast("Hero preset image selected! Click 'Save All Settings' to apply.", "success");
  }
}

// Archive Banner Customization Helpers
function updateArchivePreview(url) {
  const preview = document.getElementById("admin-archive-preview-img");
  const noImg = document.getElementById("admin-archive-no-img");
  if (preview && noImg) {
    if (url && url.trim()) {
      preview.src = url.trim();
      preview.classList.remove("hidden");
      noImg.classList.add("hidden");
    } else {
      preview.src = "";
      preview.classList.add("hidden");
      noImg.classList.remove("hidden");
    }
  }
}

function setArchivePreset(url) {
  const input = document.getElementById("admin-archive-img-input");
  if (input) {
    input.value = url;
    updateArchivePreview(url);
    showToast(url ? "Archive preset selected! Click 'Save All Settings' to apply." : "Archive image cleared (Dark background set).", "success");
  }
}

// 6. Settings Tab
function loadAdminSettingsForm() {
  const settings = Store.getSettings();
  const form = document.getElementById("admin-settings-form");
  if (!form) return;

  form.storeName.value = settings.storeName || "";
  if (form.brandSubtitle) form.brandSubtitle.value = settings.brandSubtitle || "";
  if (form.logoIcon) form.logoIcon.value = settings.logoIcon || "diamond";
  if (form.logoImage) form.logoImage.value = settings.logoImage || "";
  form.tagline.value = settings.tagline || "";
  form.contactPhone.value = settings.contactPhone || "";
  form.whatsappNumber.value = settings.whatsappNumber || "";
  if (form.whatsappDefaultMsg) form.whatsappDefaultMsg.value = settings.whatsappDefaultMsg || "";
  form.contactEmail.value = settings.contactEmail || "";
  form.address.value = settings.address || "";
  form.insideDhakaDelivery.value = settings.insideDhakaDelivery || 80;
  form.outsideDhakaDelivery.value = settings.outsideDhakaDelivery || 150;
  form.bkashNumber.value = settings.bkashNumber || "";
  form.nagadNumber.value = settings.nagadNumber || "";
  form.rocketNumber.value = settings.rocketNumber || "";
  if (form.adminEmail) form.adminEmail.value = settings.adminEmail || "admin@gmail.com";
  if (form.adminPassword) form.adminPassword.value = settings.adminPassword || "admin123";
  form.adminPin.value = settings.adminPin || "admin123";
  form.announcement.value = settings.announcement || "";

  // Hero section settings
  if (form.heroBgImage) {
    const heroImg = settings.heroBgImage || "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=85";
    form.heroBgImage.value = heroImg;
    updateHeroPreview(heroImg);
  }
  if (form.heroTitle) form.heroTitle.value = settings.heroTitle || "Elegance Rooted in Faith";
  if (form.heroSubtitle) form.heroSubtitle.value = settings.heroSubtitle || "✨ Flagship Collection 2026 • ৳ BDT";
  if (form.heroDescription) form.heroDescription.value = settings.heroDescription || "Uncompromising craftsmanship blending timeless Islamic heritage with contemporary global luxury standards. Base currency in ৳ (BDT) with nationwide fast delivery.";

  // Archive banner settings
  if (form.archiveBgImage) {
    const archImg = settings.archiveBgImage || "";
    form.archiveBgImage.value = archImg;
    updateArchivePreview(archImg);
  }
  if (form.archiveTitle) form.archiveTitle.value = settings.archiveTitle || "The Heritage of Andalusian Craft";
  if (form.archiveBadge) form.archiveBadge.value = settings.archiveBadge || "The Royal Archive";
  if (form.archiveDesc) form.archiveDesc.value = settings.archiveDesc || "A limited release honoring the golden age of Islamic craftsmanship. Each piece is individually numbered and accompanied by a certificate of authenticity.";
}

function handleSaveSettingsSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  const newSettings = {
    storeName: form.storeName.value.trim(),
    brandSubtitle: form.brandSubtitle ? form.brandSubtitle.value.trim() : "Gazipur Zone",
    logoIcon: form.logoIcon ? form.logoIcon.value.trim() : "diamond",
    logoImage: form.logoImage ? form.logoImage.value.trim() : "",
    tagline: form.tagline.value.trim(),
    currency: "৳",
    currencyCode: "BDT",
    contactPhone: form.contactPhone.value.trim(),
    whatsappNumber: form.whatsappNumber.value.trim(),
    whatsappDefaultMsg: form.whatsappDefaultMsg ? form.whatsappDefaultMsg.value.trim() : "",
    contactEmail: form.contactEmail.value.trim(),
    adminEmail: form.adminEmail ? form.adminEmail.value.trim().toLowerCase() : "admin@gmail.com",
    adminPassword: form.adminPassword ? form.adminPassword.value.trim() : "admin123",
    adminPin: form.adminPin.value.trim() || "admin123",
    heroBgImage: form.heroBgImage ? form.heroBgImage.value.trim() : "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=85",
    heroTitle: form.heroTitle ? form.heroTitle.value.trim() : "Elegance Rooted in Faith",
    heroSubtitle: form.heroSubtitle ? form.heroSubtitle.value.trim() : "✨ Flagship Collection 2026 • ৳ BDT",
    heroDescription: form.heroDescription ? form.heroDescription.value.trim() : "Uncompromising craftsmanship blending timeless Islamic heritage with contemporary global luxury standards. Base currency in ৳ (BDT) with nationwide fast delivery.",
    archiveBgImage: form.archiveBgImage ? form.archiveBgImage.value.trim() : "",
    archiveTitle: form.archiveTitle ? form.archiveTitle.value.trim() : "The Heritage of Andalusian Craft",
    archiveBadge: form.archiveBadge ? form.archiveBadge.value.trim() : "The Royal Archive",
    archiveDesc: form.archiveDesc ? form.archiveDesc.value.trim() : "A limited release honoring the golden age of Islamic craftsmanship. Each piece is individually numbered and accompanied by a certificate of authenticity.",
    address: form.address.value.trim(),
    insideDhakaDelivery: Number(form.insideDhakaDelivery.value) || 80,
    outsideDhakaDelivery: Number(form.outsideDhakaDelivery.value) || 150,
    bkashNumber: form.bkashNumber.value.trim(),
    nagadNumber: form.nagadNumber.value.trim(),
    rocketNumber: form.rocketNumber.value.trim(),
    announcement: form.announcement.value.trim()
  };

  Store.saveSettings(newSettings);

  // Instant Button Confirmation State
  if (submitBtn) {
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `✅ সফলভাবে সংরক্ষিত হয়েছে! (SAVED SUCCESSFULLY)`;
    submitBtn.style.background = "#059669";
    submitBtn.style.color = "#ffffff";
    submitBtn.style.borderColor = "#10b981";
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = "";
      submitBtn.style.color = "";
      submitBtn.style.borderColor = "";
      submitBtn.disabled = false;
    }, 3000);
  }

  showToast("✅ সেটিংস ও ব্র্যান্ড তথ্য সফলভাবে সংরক্ষিত হয়েছে! (All Settings Saved Successfully!)", "success");
}

// 7. Backup & Reset
function exportDatabaseData() {
  const data = Store.exportData();
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `noor_flagship_backup_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Backup file exported successfully!", "success");
}

function importDatabaseData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const res = Store.importData(evt.target.result);
    if (res.success) {
      showToast("Data restored successfully!", "success");
      switchAdminTab(currentAdminTab);
    } else {
      showToast("Import failed: " + res.error, "error");
    }
  };
  reader.readAsText(file);
}

function resetAllDataDemo() {
  if (confirm("Reset all catalog and orders to initial flagship demo state?")) {
    Store.resetToDefault();
    showToast("Reset completed!", "success");
    switchAdminTab("dashboard");
  }
}
