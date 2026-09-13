/**
 * Store & LocalStorage State Manager
 * Base Currency: BDT (৳)
 */

class DataStore {
  constructor() {
    this.init();
  }

  init() {
    const DATA_VERSION = "v6_custom_hero_clean_orders";
    const currentVersion = localStorage.getItem("noor_data_version");

    if (currentVersion !== DATA_VERSION) {
      // Refresh default products, categories and settings with crystal-clear high-res assets & clean slate
      localStorage.setItem("noor_settings", JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem("noor_products", JSON.stringify(DEFAULT_PRODUCTS));
      localStorage.setItem("noor_categories", JSON.stringify(DEFAULT_CATEGORIES));
      localStorage.setItem("noor_coupons", JSON.stringify(DEFAULT_COUPONS));
      localStorage.setItem("noor_orders", JSON.stringify([]));
      localStorage.setItem("noor_data_version", DATA_VERSION);
    }

    if (!localStorage.getItem("noor_cart")) {
      localStorage.setItem("noor_cart", JSON.stringify([]));
    }
    if (!localStorage.getItem("noor_wishlist")) {
      localStorage.setItem("noor_wishlist", JSON.stringify(["prod-1", "prod-2", "prod-3"]));
    }
  }

  // --- Settings ---
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem("noor_settings")) || DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings) {
    localStorage.setItem("noor_settings", JSON.stringify(settings));
    this.emitChange("settings");
    if (window.FirebaseRealtime?.syncSettingsToFirebase) {
      window.FirebaseRealtime.syncSettingsToFirebase(settings);
    }
  }

  // --- Products ---
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem("noor_products")) || DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  saveProduct(productData) {
    let products = this.getProducts();
    if (productData.id) {
      const index = products.findIndex(p => p.id === productData.id);
      if (index !== -1) {
        products[index] = { ...products[index], ...productData };
      } else {
        products.unshift(productData);
      }
    } else {
      productData.id = "prod-" + Date.now();
      products.unshift(productData);
    }
    localStorage.setItem("noor_products", JSON.stringify(products));
    this.emitChange("products");
    if (window.FirebaseRealtime?.syncProductToFirebase) {
      window.FirebaseRealtime.syncProductToFirebase(productData);
    }
    return productData;
  }

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem("noor_products", JSON.stringify(products));
    this.emitChange("products");
    if (window.FirebaseRealtime?.deleteProductFromFirebase) {
      window.FirebaseRealtime.deleteProductFromFirebase(id);
    }
  }

  // --- Categories ---
  getCategories() {
    try {
      return JSON.parse(localStorage.getItem("noor_categories")) || DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  saveCategory(cat) {
    let cats = this.getCategories();
    if (cat.id) {
      const idx = cats.findIndex(c => c.id === cat.id);
      if (idx !== -1) cats[idx] = cat;
      else cats.push(cat);
    } else {
      cat.id = "cat-" + Date.now();
      cats.push(cat);
    }
    localStorage.setItem("noor_categories", JSON.stringify(cats));
    this.emitChange("categories");
    if (window.FirebaseRealtime?.syncCategoryToFirebase) {
      window.FirebaseRealtime.syncCategoryToFirebase(cat);
    }
  }

  deleteCategory(catId) {
    if (catId === 'all') return;
    let cats = this.getCategories().filter(c => c.id !== catId);
    localStorage.setItem("noor_categories", JSON.stringify(cats));
    this.emitChange("categories");
    if (window.FirebaseRealtime?.deleteCategoryFromFirebase) {
      window.FirebaseRealtime.deleteCategoryFromFirebase(catId);
    }
  }

  // --- Coupons ---
  getCoupons() {
    try {
      return JSON.parse(localStorage.getItem("noor_coupons")) || DEFAULT_COUPONS;
    } catch {
      return DEFAULT_COUPONS;
    }
  }

  saveCoupon(coupon) {
    let coupons = this.getCoupons();
    const idx = coupons.findIndex(c => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (idx !== -1) coupons[idx] = coupon;
    else coupons.push(coupon);
    localStorage.setItem("noor_coupons", JSON.stringify(coupons));
    this.emitChange("coupons");
    if (window.FirebaseRealtime?.syncCouponToFirebase) {
      window.FirebaseRealtime.syncCouponToFirebase(coupon);
    }
  }

  deleteCoupon(code) {
    let coupons = this.getCoupons().filter(c => c.code.toUpperCase() !== code.toUpperCase());
    localStorage.setItem("noor_coupons", JSON.stringify(coupons));
    this.emitChange("coupons");
    if (window.FirebaseRealtime?.deleteCouponFromFirebase) {
      window.FirebaseRealtime.deleteCouponFromFirebase(code);
    }
  }

  validateCoupon(code, subtotal) {
    if (!code) return { valid: false, message: "Please provide a VIP Invitation / Coupon code" };
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);

    if (!coupon) {
      return { valid: false, message: "Invalid or expired VIP Invitation code!" };
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        valid: false,
        message: `This coupon requires a minimum order of ৳${coupon.minSpend.toLocaleString()}`
      };
    }

    let discount = 0;
    if (coupon.discountPercent) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountFixed) {
      discount = coupon.discountFixed;
    }

    return {
      valid: true,
      discount: Math.min(discount, subtotal),
      coupon
    };
  }

  // --- Orders ---
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem("noor_orders")) || DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  }

  createOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      orderId: "NR-" + Math.floor(10000 + Math.random() * 90000) + "-BD",
      date: new Date().toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }),
      status: "Processing",
      currentStep: 2, // 1: Order Placed, 2: Artisanal Crafting, 3: Quality Inspection, 4: Dispatched, 5: Delivered
      ...orderData
    };
    orders.unshift(newOrder);
    localStorage.setItem("noor_orders", JSON.stringify(orders));
    this.emitChange("orders");
    if (window.FirebaseRealtime?.syncOrderToFirebase) {
      window.FirebaseRealtime.syncOrderToFirebase(newOrder);
    }
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    let orders = this.getOrders();
    const idx = orders.findIndex(o => o.orderId === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      let step = 2;
      if (status === "Pending") step = 1;
      else if (status === "Processing" || status === "Crafting") step = 2;
      else if (status === "Confirmed" || status === "Inspecting") step = 3;
      else if (status === "Shipped" || status === "Dispatched") step = 4;
      else if (status === "Delivered" || status === "Completed") step = 5;
      else if (status === "Cancelled") step = 0;
      orders[idx].currentStep = step;

      localStorage.setItem("noor_orders", JSON.stringify(orders));
      this.emitChange("orders");
      if (window.FirebaseRealtime?.updateOrderStatusInFirebase) {
        window.FirebaseRealtime.updateOrderStatusInFirebase(orderId, status, step);
      }
      return true;
    }
    return false;
  }

  deleteOrder(orderId) {
    let orders = this.getOrders().filter(o => o.orderId !== orderId);
    localStorage.setItem("noor_orders", JSON.stringify(orders));
    this.emitChange("orders");
  }

  // --- Cart ---
  getCart() {
    try {
      return JSON.parse(localStorage.getItem("noor_cart")) || [];
    } catch {
      return [];
    }
  }

  saveCart(cart) {
    localStorage.setItem("noor_cart", JSON.stringify(cart));
    this.emitChange("cart");
  }

  addToCart(product, quantity = 1, options = {}) {
    let cart = this.getCart();
    const color = options.color || (product.colors ? product.colors[0] : "Default");
    const size = options.size || (product.sizes ? product.sizes[0] : "Standard");
    const cartItemId = `${product.id}-${color}-${size}`;

    const existing = cart.find(item => item.cartItemId === cartItemId || item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        cartItemId: cartItemId,
        name: product.name,
        price: product.price,
        regularPrice: product.regularPrice || product.price,
        image: product.image,
        category: product.category,
        color: color,
        size: size,
        quantity: quantity
      });
    }
    this.saveCart(cart);
  }

  updateCartQty(cartItemId, delta) {
    let cart = this.getCart();
    const item = cart.find(i => i.cartItemId === cartItemId || i.id === cartItemId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        cart = cart.filter(i => (i.cartItemId || i.id) !== cartItemId);
      }
      this.saveCart(cart);
    }
  }

  removeFromCart(cartItemId) {
    let cart = this.getCart().filter(i => (i.cartItemId || i.id) !== cartItemId);
    this.saveCart(cart);
  }

  clearCart() {
    this.saveCart([]);
  }

  // --- Wishlist ---
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem("noor_wishlist")) || [];
    } catch {
      return [];
    }
  }

  toggleWishlist(productId) {
    let list = this.getWishlist();
    if (list.includes(productId)) {
      list = list.filter(id => id !== productId);
    } else {
      list.push(productId);
    }
    localStorage.setItem("noor_wishlist", JSON.stringify(list));
    this.emitChange("wishlist");
    return list.includes(productId);
  }

  // Reset & Backup
  resetToDefault() {
    localStorage.setItem("noor_settings", JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem("noor_products", JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem("noor_categories", JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem("noor_coupons", JSON.stringify(DEFAULT_COUPONS));
    localStorage.setItem("noor_orders", JSON.stringify(DEFAULT_ORDERS));
    localStorage.setItem("noor_cart", JSON.stringify([]));
    localStorage.setItem("noor_wishlist", JSON.stringify(["prod-1", "prod-2", "prod-3"]));
    this.emitChange("all");
  }

  exportData() {
    return JSON.stringify({
      settings: this.getSettings(),
      products: this.getProducts(),
      categories: this.getCategories(),
      coupons: this.getCoupons(),
      orders: this.getOrders()
    }, null, 2);
  }

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) localStorage.setItem("noor_settings", JSON.stringify(data.settings));
      if (data.products) localStorage.setItem("noor_products", JSON.stringify(data.products));
      if (data.categories) localStorage.setItem("noor_categories", JSON.stringify(data.categories));
      if (data.coupons) localStorage.setItem("noor_coupons", JSON.stringify(data.coupons));
      if (data.orders) localStorage.setItem("noor_orders", JSON.stringify(data.orders));
      this.emitChange("all");
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  emitChange(topic) {
    window.dispatchEvent(new CustomEvent("storeUpdated", { detail: { topic } }));
  }
}

// Global Store Instance
window.Store = new DataStore();
