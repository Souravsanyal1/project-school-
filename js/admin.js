/**
 * Admin Panel Controller & Management Suite
 * Luxury Obsidian & Gold Aesthetic
 * Full Control: Products, Orders (5-Step Tracking), Categories, Coupons, Settings & Backup
 */

let isAdminLoggedIn = false;
let currentAdminTab = "dashboard";

// Initialize Admin Portal
function openAdminPortal() {
  const settings = Store.getSettings();
  const sessionAuth = sessionStorage.getItem("noor_admin_auth");

  if (sessionAuth === "true") {
    isAdminLoggedIn = true;
    showAdminDashboard();
  } else {
    document.getElementById("admin-login-modal").classList.add("active");
  }
}

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
    showToast("Welcome to NOOR Sovereign Admin Panel", "success");
    showAdminDashboard();
  } else {
    showToast("Invalid Security PIN! (Default: admin123)", "error");
  }
}

function closeAdminLogin() {
  document.getElementById("admin-login-modal").classList.remove("active");
}

function adminLogout() {
  isAdminLoggedIn = false;
  sessionStorage.removeItem("noor_admin_auth");
  document.getElementById("admin-portal-view").classList.remove("active");
  document.getElementById("storefront-view").style.display = "block";
  showToast("Logged out of Sovereign Admin Panel", "warning");
}

function exitAdminPortal() {
  document.getElementById("admin-portal-view").classList.remove("active");
  document.getElementById("storefront-view").style.display = "block";
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

  const recentOrdersTbody = document.getElementById("admin-recent-orders-tbody");
  if (recentOrdersTbody) {
    const recent = orders.slice(0, 5);
    if (recent.length === 0) {
      recentOrdersTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:2rem;">No commissions recorded yet.</td></tr>`;
    } else {
      recentOrdersTbody.innerHTML = recent.map(o => `
        <tr>
          <td><strong class="text-secondary font-mono">${o.orderId}</strong></td>
          <td><strong>${o.customerName}</strong><br><small style="color:#747878;">${o.phone}</small></td>
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
    form.prodImage.value = "https://lh3.googleusercontent.com/aida-public/AB6AXuBci9eA1b6uV_3Qbss9IK9fove2dTPOFnmzWm-QQV_duhsLEnC1WV-O9Gg2SCMtiX3xp7b99K5Yx58mBMRBxJS3cPrq6ztj_4Wtbj1em9LQm5g48eDsDtKW0BXOPw5yGb05JmteUzdVWXVHZUv7zQkX6f44vyhULlBAJ3z5C5CuZoewrjgDTU7-xRqEJFQ6n84TD909FLn542i3ts6NiTVQOeruvLuaPiZhxYmQb6yUfEuTOYhOrOs";
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
        <span style="font-size:0.8rem; color:#735c00;"><i class="fas fa-phone mr-1"></i> ${o.phone}</span>
      </td>
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
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
      </div>
      <div style="background:#f3f3f4; padding:16px; border:1px solid #e2e2e2;">
        <h4 style="margin-bottom:6px; color:#1a1c1c; text-transform:uppercase; font-size:12px; letter-spacing:1px;">Payment & Delivery:</h4>
        <p><strong>Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
        <p><strong>TrxID:</strong> ${order.trxId}</p>
        <p><strong>Delivery Zone:</strong> ${order.deliveryArea === 'inside' ? 'Inside Dhaka (৳' + settings.insideDhakaDelivery + ')' : 'Outside Dhaka (৳' + settings.outsideDhakaDelivery + ')'}</p>
        <p><strong>Courier Fee:</strong> ${curr}${Number(order.deliveryFee).toLocaleString()}</p>
      </div>
    </div>

    <h4 style="margin-bottom:8px; text-transform:uppercase; font-size:12px; color:#735c00; letter-spacing:1px;">Curated Items:</h4>
    <div style="border:1px solid #e2e2e2; margin-bottom:16px;">
      <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
        <thead style="background:#f3f3f4;">
          <tr>
            <th style="padding:8px 12px; text-align:left;">Item</th>
            <th style="padding:8px 12px; text-align:center;">Qty</th>
            <th style="padding:8px 12px; text-align:right;">Unit Price</th>
            <th style="padding:8px 12px; text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr style="border-top:1px solid #e2e2e2;">
              <td style="padding:8px 12px;">${item.name}</td>
              <td style="padding:8px 12px; text-align:center;">${item.quantity}</td>
              <td style="padding:8px 12px; text-align:right;">${curr}${Number(item.price).toLocaleString()}</td>
              <td style="padding:8px 12px; text-align:right;">${curr}${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <div style="text-align:right; font-size:0.95rem; margin-bottom:1.5rem;">
      <p>Subtotal: <strong>${curr}${Number(order.subtotal).toLocaleString()}</strong></p>
      ${order.discount ? `<p style="color:#735c00;">VIP Discount: <strong>-${curr}${Number(order.discount).toLocaleString()}</strong></p>` : ''}
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

// 6. Settings Tab
function loadAdminSettingsForm() {
  const settings = Store.getSettings();
  const form = document.getElementById("admin-settings-form");
  if (!form) return;

  form.storeName.value = settings.storeName || "";
  form.tagline.value = settings.tagline || "";
  form.contactPhone.value = settings.contactPhone || "";
  form.whatsappNumber.value = settings.whatsappNumber || "";
  form.whatsappDefaultMsg.value = settings.whatsappDefaultMsg || "";
  form.contactEmail.value = settings.contactEmail || "";
  form.address.value = settings.address || "";
  form.insideDhakaDelivery.value = settings.insideDhakaDelivery || 80;
  form.outsideDhakaDelivery.value = settings.outsideDhakaDelivery || 150;
  form.bkashNumber.value = settings.bkashNumber || "";
  form.nagadNumber.value = settings.nagadNumber || "";
  form.rocketNumber.value = settings.rocketNumber || "";
  form.adminPin.value = settings.adminPin || "admin123";
  form.announcement.value = settings.announcement || "";
}

function handleSaveSettingsSubmit(e) {
  e.preventDefault();
  const form = e.target;

  const newSettings = {
    storeName: form.storeName.value.trim(),
    tagline: form.tagline.value.trim(),
    currency: "৳",
    currencyCode: "BDT",
    contactPhone: form.contactPhone.value.trim(),
    whatsappNumber: form.whatsappNumber.value.trim(),
    whatsappDefaultMsg: form.whatsappDefaultMsg.value.trim(),
    contactEmail: form.contactEmail.value.trim(),
    address: form.address.value.trim(),
    insideDhakaDelivery: Number(form.insideDhakaDelivery.value) || 80,
    outsideDhakaDelivery: Number(form.outsideDhakaDelivery.value) || 150,
    bkashNumber: form.bkashNumber.value.trim(),
    nagadNumber: form.nagadNumber.value.trim(),
    rocketNumber: form.rocketNumber.value.trim(),
    adminPin: form.adminPin.value.trim() || "admin123",
    announcement: form.announcement.value.trim()
  };

  Store.saveSettings(newSettings);
  showToast("All flagship settings saved successfully!", "success");
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
