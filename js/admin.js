/**
 * Admin Panel Controller & Management Suite
 * Full Control: Products, Orders, Categories, Coupons, Settings & Backup
 */

let isAdminLoggedIn = false;
let currentAdminTab = "dashboard";

// Initialize Admin Portal
function openAdminPortal() {
  const settings = Store.getSettings();
  const sessionAuth = sessionStorage.getItem("sh_admin_auth");

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
    sessionStorage.setItem("sh_admin_auth", "true");
    document.getElementById("admin-login-modal").classList.remove("active");
    if (pinInput) pinInput.value = "";
    showToast("অ্যাডমিন প্যানেলে স্বাগতম!", "success");
    showAdminDashboard();
  } else {
    showToast("ভুল পিন কোড! পুনরায় চেষ্টা করুন। (Default PIN: admin123)", "error");
  }
}

function closeAdminLogin() {
  document.getElementById("admin-login-modal").classList.remove("active");
}

function adminLogout() {
  isAdminLoggedIn = false;
  sessionStorage.removeItem("sh_admin_auth");
  document.getElementById("admin-portal-view").classList.remove("active");
  document.getElementById("storefront-view").style.display = "block";
  showToast("অ্যাডমিন প্যানেল থেকে লগআউট করা হয়েছে", "warning");
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

  // Metrics
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

  // Recent Orders table in dashboard
  const recentOrdersTbody = document.getElementById("admin-recent-orders-tbody");
  if (recentOrdersTbody) {
    const recent = orders.slice(0, 5);
    if (recent.length === 0) {
      recentOrdersTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8;">কোনো অর্ডার নেই</td></tr>`;
    } else {
      recentOrdersTbody.innerHTML = recent.map(o => `
        <tr>
          <td><strong>${o.orderId}</strong></td>
          <td>${escapeHtml(o.customerName)}<br><small style="color:#64748b;">${escapeHtml(o.phone)}</small></td>
          <td>${curr}${Number(o.total).toLocaleString()}</td>
          <td><span class="status-badge status-${o.status}">${o.status}</span></td>
          <td>${o.date}</td>
          <td>
            <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="openOrderDetailsModal('${o.orderId}')">
              <i class="fas fa-eye"></i>
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
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:#64748b;">কোনো পণ্য পাওয়া যায়নি</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <img src="${p.image}" alt="" style="width:45px; height:45px; object-fit:cover; border-radius:6px;" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'">
      </td>
      <td>
        <strong>${escapeHtml(p.name)}</strong>
        ${p.badge ? `<br><span class="badge badge-hot" style="font-size:0.65rem;">${escapeHtml(p.badge)}</span>` : ''}
      </td>
      <td><span class="badge" style="background:#e0f2fe; color:#0284c7;">${getCategoryName(p.category)}</span></td>
      <td>
        <strong>${curr}${Number(p.price).toLocaleString()}</strong>
        ${p.regularPrice ? `<br><small style="text-decoration:line-through; color:#94a3b8;">${curr}${Number(p.regularPrice).toLocaleString()}</small>` : ''}
      </td>
      <td>${p.stock || 0} টি</td>
      <td>⭐ ${p.rating || 5} (${p.reviewsCount || 0})</td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn-secondary" style="padding:6px 10px; font-size:0.8rem; background:#f1f5f9; color:#0284c7;" onclick="openProductEditModal('${p.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-secondary" style="padding:6px 10px; font-size:0.8rem; background:#fee2e2; color:#ef4444;" onclick="deleteProductConfirm('${p.id}')">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function openProductEditModal(productId = null) {
  const form = document.getElementById("admin-product-form");
  form.reset();

  // Populate category options
  const catSelect = document.getElementById("prod-category-select");
  const categories = Store.getCategories().filter(c => c.id !== 'all');
  catSelect.innerHTML = categories.map(c => `
    <option value="${c.id}">${c.name}</option>
  `).join("");

  const modalTitle = document.getElementById("product-modal-title");

  if (productId) {
    const p = Store.getProductById(productId);
    if (!p) return;
    modalTitle.textContent = "পণ্য সম্পাদন করুন (Edit Product)";
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
    modalTitle.textContent = "নতুন পণ্য যুক্ত করুন (Add Product)";
    form.productId.value = "";
    form.prodStock.value = "50";
    form.prodImage.value = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80";
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
  const image = form.prodImage.value.trim() || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80";
  const description = form.prodDescription.value.trim();

  if (!name || isNaN(price) || price <= 0) {
    showToast("দয়া করে পণ্যের নাম ও সঠিক মূল্য দিন", "error");
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
    rating: 4.8,
    reviewsCount: 15
  };

  if (id) {
    productData.id = id;
    const existing = Store.getProductById(id);
    if (existing) {
      productData.rating = existing.rating;
      productData.reviewsCount = existing.reviewsCount;
    }
  }

  Store.saveProduct(productData);
  closeProductEditModal();
  renderAdminProductsTable();
  showToast(id ? "পণ্য সফলভাবে আপডেট করা হয়েছে!" : "নতুন পণ্য যুক্ত করা হয়েছে!", "success");
}

function deleteProductConfirm(productId) {
  const p = Store.getProductById(productId);
  if (!p) return;
  if (confirm(`আপনি কি নিশ্চিতভাবে "${p.name}" পণ্যটি মুছে ফেলতে চান?`)) {
    Store.deleteProduct(productId);
    renderAdminProductsTable();
    showToast("পণ্যটি মুছে ফেলা হয়েছে!", "success");
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
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:#64748b;">কোনো অর্ডার পাওয়া যায়নি</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.orderId}</strong><br><small style="color:#64748b;">${o.date}</small></td>
      <td>
        <strong>${escapeHtml(o.customerName)}</strong><br>
        <span style="font-size:0.8rem; color:#0284c7;"><i class="fas fa-phone"></i> ${escapeHtml(o.phone)}</span>
      </td>
      <td>
        <span style="text-transform:uppercase; font-weight:700; font-size:0.8rem;">${o.paymentMethod}</span><br>
        <small style="color:#64748b;">Trx: ${escapeHtml(o.trxId)}</small>
      </td>
      <td><strong>${curr}${Number(o.total).toLocaleString()}</strong></td>
      <td>
        <select onchange="updateOrderStatusFromTable('${o.orderId}', this.value)" style="padding:4px 8px; border-radius:6px; font-size:0.8rem; font-weight:600; border:1px solid #cbd5e1;">
          <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
          <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn-secondary" style="padding:6px 10px; font-size:0.8rem; background:#f1f5f9;" onclick="openOrderDetailsModal('${o.orderId}')" title="বিস্তারিত">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-secondary" style="padding:6px 10px; font-size:0.8rem; background:#e0f2fe; color:#0284c7;" onclick="printInvoice('${o.orderId}')" title="রশিদ প্রিন্ট">
            <i class="fas fa-print"></i>
          </button>
          <button class="btn-secondary" style="padding:6px 10px; font-size:0.8rem; background:#fee2e2; color:#ef4444;" onclick="deleteOrderConfirm('${o.orderId}')" title="মুছে ফেলুন">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function updateOrderStatusFromTable(orderId, newStatus) {
  Store.updateOrderStatus(orderId, newStatus);
  showToast(`অর্ডার ${orderId} স্ট্যাটাস পরিবর্তন করা হয়েছে: ${newStatus}`, "success");
}

function deleteOrderConfirm(orderId) {
  if (confirm(`আপনি কি নিশ্চিতভাবে অর্ডার "${orderId}" মুছে ফেলতে চান?`)) {
    Store.deleteOrder(orderId);
    renderAdminOrdersTable();
    showToast("অর্ডার মুছে ফেলা হয়েছে!", "success");
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
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:16px;">
      <div>
        <h3 style="font-size:1.3rem; font-weight:800; color:var(--primary);">${order.orderId}</h3>
        <span style="font-size:0.85rem; color:#64748b;">তারিখ: ${order.date}</span>
      </div>
      <span class="status-badge status-${order.status}">${order.status}</span>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; font-size:0.88rem;">
      <div style="background:#f8fafc; padding:12px; border-radius:8px;">
        <h4 style="margin-bottom:6px; color:#1e293b;">গ্রাহকের তথ্য:</h4>
        <p><strong>নাম:</strong> ${escapeHtml(order.customerName)}</p>
        <p><strong>ফোন:</strong> ${escapeHtml(order.phone)}</p>
        <p><strong>ঠিকানা:</strong> ${escapeHtml(order.address)}</p>
        ${order.notes ? `<p><strong>নোট:</strong> ${escapeHtml(order.notes)}</p>` : ''}
      </div>
      <div style="background:#f8fafc; padding:12px; border-radius:8px;">
        <h4 style="margin-bottom:6px; color:#1e293b;">পেমেন্ট ও ডেলিভারি:</h4>
        <p><strong>পেমেন্ট পদ্ধতি:</strong> ${order.paymentMethod.toUpperCase()}</p>
        <p><strong>TrxID:</strong> ${escapeHtml(order.trxId)}</p>
        <p><strong>ডেলিভারি এরিয়া:</strong> ${order.deliveryArea === 'inside' ? 'ঢাকার ভিতরে' : 'ঢাকার বাহিরে'}</p>
        <p><strong>ডেলিভারি চার্জ:</strong> ${curr}${Number(order.deliveryFee).toLocaleString()}</p>
      </div>
    </div>

    <h4 style="margin-bottom:8px;">অর্ডারকৃত পণ্যসমূহ:</h4>
    <div style="border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; margin-bottom:16px;">
      <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
        <thead style="background:#f8fafc;">
          <tr>
            <th style="padding:8px 12px; text-align:left;">পণ্য</th>
            <th style="padding:8px 12px; text-align:center;">পরিমাণ</th>
            <th style="padding:8px 12px; text-align:right;">একক মূল্য</th>
            <th style="padding:8px 12px; text-align:right;">মোট</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr style="border-top:1px solid #e2e8f0;">
              <td style="padding:8px 12px;">${escapeHtml(item.name)}</td>
              <td style="padding:8px 12px; text-align:center;">${item.quantity}</td>
              <td style="padding:8px 12px; text-align:right;">${curr}${Number(item.price).toLocaleString()}</td>
              <td style="padding:8px 12px; text-align:right;">${curr}${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <div style="text-align:right; font-size:0.95rem; margin-bottom:1.5rem;">
      <p>সাবটোটাল: <strong>${curr}${Number(order.subtotal).toLocaleString()}</strong></p>
      ${order.discount ? `<p style="color:#ef4444;">ডিসকাউন্ট: <strong>-${curr}${Number(order.discount).toLocaleString()}</strong></p>` : ''}
      <p>ডেলিভারি চার্জ: <strong>${curr}${Number(order.deliveryFee).toLocaleString()}</strong></p>
      <h3 style="font-size:1.25rem; color:var(--primary); margin-top:4px;">সর্বমোট: ${curr}${Number(order.total).toLocaleString()}</h3>
    </div>

    <div style="display:flex; gap:10px;">
      <button class="btn-primary" style="flex:1; justify-content:center;" onclick="printInvoice('${order.orderId}')">
        <i class="fas fa-print"></i> রশিদ প্রিন্ট করুন
      </button>
      <button class="btn-secondary" style="flex:1; justify-content:center; background:#0f172a;" onclick="closeOrderDetailsModal()">
        বন্ধ করুন
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
      <td><i class="fas ${cat.icon || 'fa-tag'}" style="font-size:1.2rem; color:var(--primary);"></i></td>
      <td><strong>${escapeHtml(cat.name)}</strong></td>
      <td><code>${cat.id}</code></td>
      <td>
        ${cat.id !== 'all' ? `
          <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem; background:#fee2e2; color:#ef4444;" onclick="deleteCategoryClick('${cat.id}')">
            <i class="fas fa-trash-alt"></i>
          </button>
        ` : '<span style="color:#94a3b8; font-size:0.75rem;">ডিফল্ট</span>'}
      </td>
    </tr>
  `).join("");
}

function handleAddCategorySubmit(e) {
  e.preventDefault();
  const name = document.getElementById("new-cat-name").value.trim();
  const id = document.getElementById("new-cat-id").value.trim() || ("cat-" + Date.now());
  const icon = document.getElementById("new-cat-icon").value.trim() || "fa-tag";

  if (!name) return;

  Store.saveCategory({ id, name, icon });
  e.target.reset();
  renderAdminCategoriesTable();
  showToast("নতুন ক্যাটাগরি তৈরি হয়েছে!", "success");
}

function deleteCategoryClick(catId) {
  if (confirm("এই ক্যাটাগরিটি মুছে ফেলতে চান?")) {
    Store.deleteCategory(catId);
    renderAdminCategoriesTable();
    showToast("ক্যাটাগরি মুছে ফেলা হয়েছে!", "success");
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
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:#64748b;">কোনো কুপন সক্রিয় নেই</td></tr>`;
    return;
  }

  tbody.innerHTML = coupons.map(c => `
    <tr>
      <td><strong style="color:var(--primary); letter-spacing:1px;">${escapeHtml(c.code)}</strong></td>
      <td>${c.discountPercent ? `${c.discountPercent}% ছাড়` : `${curr}${c.discountFixed} ছাড়`}</td>
      <td>${curr}${c.minSpend || 0}</td>
      <td><span class="badge ${c.active ? 'badge-new' : 'badge-hot'}">${c.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span></td>
      <td>
        <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem; background:#fee2e2; color:#ef4444;" onclick="deleteCouponClick('${c.code}')">
          <i class="fas fa-trash-alt"></i>
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
    showToast("সঠিক কুপন কোড ও মান দিন", "error");
    return;
  }

  const coupon = {
    code,
    minSpend,
    active: true
  };

  if (type === "percent") {
    coupon.discountPercent = val;
    coupon.maxDiscount = Number(form.couponMaxDiscount.value) || 500;
  } else {
    coupon.discountFixed = val;
  }

  Store.saveCoupon(coupon);
  form.reset();
  renderAdminCouponsTable();
  showToast(`কুপন ${code} সফলভাবে যুক্ত হয়েছে!`, "success");
}

function deleteCouponClick(code) {
  if (confirm(`কুপন "${code}" মুছে ফেলতে চান?`)) {
    Store.deleteCoupon(code);
    renderAdminCouponsTable();
    showToast("কুপন মুছে ফেলা হয়েছে!", "success");
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
  form.insideDhakaDelivery.value = settings.insideDhakaDelivery || 60;
  form.outsideDhakaDelivery.value = settings.outsideDhakaDelivery || 120;
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
    insideDhakaDelivery: Number(form.insideDhakaDelivery.value) || 60,
    outsideDhakaDelivery: Number(form.outsideDhakaDelivery.value) || 120,
    bkashNumber: form.bkashNumber.value.trim(),
    nagadNumber: form.nagadNumber.value.trim(),
    rocketNumber: form.rocketNumber.value.trim(),
    adminPin: form.adminPin.value.trim() || "admin123",
    announcement: form.announcement.value.trim()
  };

  Store.saveSettings(newSettings);
  showToast("ওয়েবসাইটের সকল সেটিংস সফলভাবে সেভ করা হয়েছে!", "success");
}

// 7. Backup & Reset
function exportDatabaseData() {
  const data = Store.exportData();
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup_school_store_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("ব্যাকআপ ফাইল ডাউনলোড সম্পন্ন হয়েছে!", "success");
}

function importDatabaseData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const res = Store.importData(evt.target.result);
    if (res.success) {
      showToast("ডাটা সফলভাবে রিস্টোর করা হয়েছে!", "success");
      switchAdminTab(currentAdminTab);
    } else {
      showToast("ডাটা ইম্পোর্ট ব্যর্থ: " + res.error, "error");
    }
  };
  reader.readAsText(file);
}

function resetAllDataDemo() {
  if (confirm("আপনি কি সমস্ত ডাটা মুছে দিয়ে প্রাথমিক ডেমো ডাটায় রিসেট করতে চান?")) {
    Store.resetToDefault();
    showToast("ওয়েবসাইট সফলভাবে ডেমো ডাটায় রিসেট করা হয়েছে!", "success");
    switchAdminTab("dashboard");
  }
}
