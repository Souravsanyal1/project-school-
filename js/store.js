/**
 * Store & LocalStorage State Manager
 */

class DataStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem("sh_settings")) {
      localStorage.setItem("sh_settings", JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem("sh_products")) {
      localStorage.setItem("sh_products", JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem("sh_categories")) {
      localStorage.setItem("sh_categories", JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem("sh_coupons")) {
      localStorage.setItem("sh_coupons", JSON.stringify(DEFAULT_COUPONS));
    }
    if (!localStorage.getItem("sh_orders")) {
      localStorage.setItem("sh_orders", JSON.stringify(DEFAULT_ORDERS));
    }
    if (!localStorage.getItem("sh_cart")) {
      localStorage.setItem("sh_cart", JSON.stringify([]));
    }
  }

  // --- Settings ---
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem("sh_settings")) || DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings) {
    localStorage.setItem("sh_settings", JSON.stringify(settings));
    this.emitChange("settings");
  }

  // --- Products ---
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem("sh_products")) || [];
    } catch {
      return [];
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
    localStorage.setItem("sh_products", JSON.stringify(products));
    this.emitChange("products");
    return productData;
  }

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem("sh_products", JSON.stringify(products));
    this.emitChange("products");
  }

  // --- Categories ---
  getCategories() {
    try {
      return JSON.parse(localStorage.getItem("sh_categories")) || DEFAULT_CATEGORIES;
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
    localStorage.setItem("sh_categories", JSON.stringify(cats));
    this.emitChange("categories");
  }

  deleteCategory(catId) {
    if (catId === 'all') return;
    let cats = this.getCategories().filter(c => c.id !== catId);
    localStorage.setItem("sh_categories", JSON.stringify(cats));
    this.emitChange("categories");
  }

  // --- Coupons ---
  getCoupons() {
    try {
      return JSON.parse(localStorage.getItem("sh_coupons")) || [];
    } catch {
      return [];
    }
  }

  saveCoupon(coupon) {
    let coupons = this.getCoupons();
    const idx = coupons.findIndex(c => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (idx !== -1) coupons[idx] = coupon;
    else coupons.push(coupon);
    localStorage.setItem("sh_coupons", JSON.stringify(coupons));
    this.emitChange("coupons");
  }

  deleteCoupon(code) {
    let coupons = this.getCoupons().filter(c => c.code.toUpperCase() !== code.toUpperCase());
    localStorage.setItem("sh_coupons", JSON.stringify(coupons));
    this.emitChange("coupons");
  }

  validateCoupon(code, subtotal) {
    if (!code) return { valid: false, message: "দয়া করে কুপন কোড দিন" };
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);

    if (!coupon) {
      return { valid: false, message: "অকার্যকর বা মেয়াদোত্তীর্ণ কুপন কোড!" };
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        valid: false,
        message: `এই কুপনের জন্য সর্বনিম্ন ৳${coupon.minSpend} এর অর্ডার প্রয়োজন!`
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
      return JSON.parse(localStorage.getItem("sh_orders")) || [];
    } catch {
      return [];
    }
  }

  createOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      orderId: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }),
      status: "Pending",
      ...orderData
    };
    orders.unshift(newOrder);
    localStorage.setItem("sh_orders", JSON.stringify(orders));
    this.emitChange("orders");
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    let orders = this.getOrders();
    const idx = orders.findIndex(o => o.orderId === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      localStorage.setItem("sh_orders", JSON.stringify(orders));
      this.emitChange("orders");
      return true;
    }
    return false;
  }

  deleteOrder(orderId) {
    let orders = this.getOrders().filter(o => o.orderId !== orderId);
    localStorage.setItem("sh_orders", JSON.stringify(orders));
    this.emitChange("orders");
  }

  // --- Cart ---
  getCart() {
    try {
      return JSON.parse(localStorage.getItem("sh_cart")) || [];
    } catch {
      return [];
    }
  }

  saveCart(cart) {
    localStorage.setItem("sh_cart", JSON.stringify(cart));
    this.emitChange("cart");
  }

  addToCart(product, quantity = 1) {
    let cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        regularPrice: product.regularPrice || product.price,
        image: product.image,
        category: product.category,
        quantity: quantity
      });
    }
    this.saveCart(cart);
  }

  updateCartQty(productId, delta) {
    let cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
      }
      this.saveCart(cart);
    }
  }

  removeFromCart(productId) {
    let cart = this.getCart().filter(i => i.id !== productId);
    this.saveCart(cart);
  }

  clearCart() {
    this.saveCart([]);
  }

  // Reset & Backup
  resetToDefault() {
    localStorage.setItem("sh_settings", JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem("sh_products", JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem("sh_categories", JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem("sh_coupons", JSON.stringify(DEFAULT_COUPONS));
    localStorage.setItem("sh_orders", JSON.stringify(DEFAULT_ORDERS));
    localStorage.setItem("sh_cart", JSON.stringify([]));
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
      if (data.settings) localStorage.setItem("sh_settings", JSON.stringify(data.settings));
      if (data.products) localStorage.setItem("sh_products", JSON.stringify(data.products));
      if (data.categories) localStorage.setItem("sh_categories", JSON.stringify(data.categories));
      if (data.coupons) localStorage.setItem("sh_coupons", JSON.stringify(data.coupons));
      if (data.orders) localStorage.setItem("sh_orders", JSON.stringify(data.orders));
      this.emitChange("all");
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Reactivity Event Bus
  emitChange(topic) {
    window.dispatchEvent(new CustomEvent("storeUpdated", { detail: { topic } }));
  }
}

// Global Store Instance
window.Store = new DataStore();
