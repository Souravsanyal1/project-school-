/**
 * Default Seed Data for the Website
 * Base Currency: BDT (৳)
 */

const DEFAULT_SETTINGS = {
  storeName: "SchoolHub & Mega Store BD",
  tagline: "আপনার বিশ্বস্ত অনলাইন শপ - সেরা দামে সেরা পণ্য",
  currency: "৳",
  currencyCode: "BDT",
  contactPhone: "+8801700000000",
  whatsappNumber: "8801700000000",
  whatsappDefaultMsg: "আসসালামু আলাইকুম, আমি আপনার ওয়েবসাইট থেকে পণ্য সম্পর্কে জানতে চাই।",
  contactEmail: "info@schoolhub.com.bd",
  address: "House 42, Road 11, Dhanmondi, Dhaka - 1209",
  insideDhakaDelivery: 60,
  outsideDhakaDelivery: 120,
  bkashNumber: "01700000000 (Personal/Send Money)",
  nagadNumber: "01800000000 (Personal/Send Money)",
  rocketNumber: "01900000000-8 (Personal)",
  adminPin: "admin123",
  announcement: "🎉 বিশেষ অফার! ৫০০ টাকার বেশি অর্ডারে আকর্ষণীয় উপহার! দ্রুত অর্ডার করুন।"
};

const DEFAULT_CATEGORIES = [
  { id: "all", name: "সকল পণ্য (All)", icon: "fa-th-large" },
  { id: "books", name: "বই ও গাইড (Books)", icon: "fa-book-open" },
  { id: "stationery", name: "স্টেশনারি ও খাতা (Stationery)", icon: "fa-pen-nib" },
  { id: "bags", name: "স্কুল ব্যাগ ও ওয়াটার পট (Bags & Bottles)", icon: "fa-backpack" },
  { id: "uniform", name: "ইউনিফর্ম ও জুতা (Uniform & Shoes)", icon: "fa-tshirt" },
  { id: "gadgets", name: "ইলেকট্রনিক্স ও গ্যাজেট (Gadgets)", icon: "fa-laptop-code" },
  { id: "art", name: "আর্ট ও ক্রাফট (Art & Craft)", icon: "fa-palette" }
];

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "প্রিমিয়াম ওয়াটারপ্রুফ স্কুল ব্যাগ (Ergonomic School Backpack)",
    category: "bags",
    price: 1250,
    regularPrice: 1650,
    stock: 45,
    rating: 4.9,
    reviewsCount: 38,
    badge: "Hot Deal",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    description: "উচ্চমানের ওয়াটারপ্রুফ মেটেরিয়াল দিয়ে তৈরি ভারী ও আরামদায়ক স্কুল ব্যাগ। এতে রয়েছে মাল্টিপল কম্পার্টমেন্ট, ল্যাপটপ স্লট ও নরম ব্যাক কুশন।"
  },
  {
    id: "prod-2",
    name: "ক্লাসিক হার্ডকভার নোটবুক সেট (Pack of 5 Ruled Notebooks)",
    category: "stationery",
    price: 450,
    regularPrice: 550,
    stock: 120,
    rating: 4.8,
    reviewsCount: 52,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    description: "৮০ জিএসএম প্রিমিয়াম স্মুথ কাগজের ৫টি নোটবুকের কম্বো প্যাক। লেখা মসৃণ এবং কালি ছড়ায় না।"
  },
  {
    id: "prod-3",
    name: "সায়েন্টিফিক ক্যালকুলেটর FX-991EX (Original)",
    category: "gadgets",
    price: 1850,
    regularPrice: 2200,
    stock: 25,
    rating: 5.0,
    reviewsCount: 94,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80",
    description: "উচ্চ মাধ্যমিক ও ইঞ্জিনিয়ারিং শিক্ষার্থীদের জন্য ৫৫২ ফাংশন বিশিষ্ট অরিজিনাল সায়েন্টিফিক ক্যালকুলেটর।"
  },
  {
    id: "prod-4",
    name: "স্টেইনলেস স্টিল থার্মাল ওয়াটার বোতল (750ml Insulated Bottle)",
    category: "bags",
    price: 650,
    regularPrice: 850,
    stock: 60,
    rating: 4.7,
    reviewsCount: 29,
    badge: "New",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    description: "১২ ঘণ্টা গরম ও ২৪ ঘণ্টা ঠান্ডা রাখার ডাবল-ওয়াল ভ্যাকুয়াম ইনসুলেটেড ফুড গ্রেড স্টিল ওয়াটার পট।"
  },
  {
    id: "prod-5",
    name: "প্রফেশনাল আর্ট কালার পেন্সিল ও ব্রাশ সেট (48 Colors Kit)",
    category: "art",
    price: 890,
    regularPrice: 1150,
    stock: 35,
    rating: 4.9,
    reviewsCount: 41,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
    description: "৪৮ রঙের ভাইব্রেন্ট কালার পেন্সিল, স্কেচিং ব্রাশ ও মেটাল বক্স সমন্বিত আর্ট কম্বো সেট।"
  },
  {
    id: "prod-6",
    name: "ইংলিশ গ্রামার ও ভোকাবুলারি মাস্টারবুক (Hardcover Edition)",
    category: "books",
    price: 520,
    regularPrice: 650,
    stock: 80,
    rating: 4.8,
    reviewsCount: 63,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    description: "সহজ বাংলা ব্যাখ্যা ও প্র্যাকটিস টেস্ট সমৃদ্ধ সম্পূর্ণ ইংলিশ লার্নিং গাইডবুক।"
  },
  {
    id: "prod-7",
    name: "স্মার্ট ডিজিটাল রিডিং ও স্টাডি ল্যাম্প (Rechargeable LED)",
    category: "gadgets",
    price: 990,
    regularPrice: 1350,
    stock: 40,
    rating: 4.6,
    reviewsCount: 31,
    badge: "Featured",
    image: "https://images.unsplash.com/photo-1534972195531-a756b1126f24?auto=format&fit=crop&w=800&q=80",
    description: "চোখের সুরক্ষা ফিচারযুক্ত ৩-স্টেপ ব্রাইটনেস ও রিচার্জেবল ব্যাটারি চালিত আধুনিক স্টাডি ল্যাম্প।"
  },
  {
    id: "prod-8",
    name: "কমপ্লিট জ্যামিতি বক্স ও ড্রয়িং কম্পাস কিট (Deluxe Edition)",
    category: "stationery",
    price: 320,
    regularPrice: 420,
    stock: 95,
    rating: 4.7,
    reviewsCount: 48,
    badge: "Best Value",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80",
    description: "মেটাল কম্পাস, প্রোটেক্টর, রুলার ও ড্রয়িং টুলস সহ টেকসই মেটাল কেসিং জ্যামিতি বক্স।"
  }
];

const DEFAULT_COUPONS = [
  { code: "WELCOME10", discountPercent: 10, minSpend: 500, maxDiscount: 200, active: true },
  { code: "SAVE100", discountFixed: 100, minSpend: 1000, active: true },
  { code: "EID20", discountPercent: 20, minSpend: 1500, maxDiscount: 500, active: true }
];

const DEFAULT_ORDERS = [
  {
    orderId: "ORD-8921",
    customerName: "Md. Tanvir Hasan",
    phone: "01712345678",
    address: "House 12, Road 4, Dhanmondi, Dhaka",
    deliveryArea: "inside",
    deliveryFee: 60,
    paymentMethod: "bkash",
    trxId: "9K7X82LM1",
    items: [
      { id: "prod-1", name: "প্রিমিয়াম ওয়াটারপ্রুফ স্কুল ব্যাগ", price: 1250, quantity: 1, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" },
      { id: "prod-2", name: "ক্লাসিক হার্ডকভার নোটবুক সেট", price: 450, quantity: 1, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80" }
    ],
    subtotal: 1700,
    discount: 170,
    couponCode: "WELCOME10",
    total: 1590,
    status: "Processing",
    date: "2026-09-12 14:35",
    notes: "Please deliver in afternoon"
  },
  {
    orderId: "ORD-8920",
    customerName: "Ayesha Rahman",
    phone: "01898765432",
    address: "Chittagong University Gate, Hathazari, Chattogram",
    deliveryArea: "outside",
    deliveryFee: 120,
    paymentMethod: "cod",
    trxId: "N/A (Cash on Delivery)",
    items: [
      { id: "prod-3", name: "সায়েন্টিফিক ক্যালকুলেটর FX-991EX", price: 1850, quantity: 1, image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80" }
    ],
    subtotal: 1850,
    discount: 100,
    couponCode: "SAVE100",
    total: 1870,
    status: "Shipped",
    date: "2026-09-11 11:20",
    notes: "Call before coming"
  }
];
