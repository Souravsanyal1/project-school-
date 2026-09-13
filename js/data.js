/**
 * Default Seed Data for Noor & Luxury Flagship Store
 * Base Currency: BDT (৳)
 * High-Resolution Crystal Clear Photography
 */

const DEFAULT_SETTINGS = {
  storeName: "NOOR Flagship BD",
  tagline: "Elegance Rooted in Faith - ইসলামিক লাক্সারি লাইফস্টাইল ও প্রিমিয়াম কালেকশন",
  currency: "৳",
  currencyCode: "BDT",
  contactPhone: "+8801700000000",
  whatsappNumber: "8801700000000",
  whatsappDefaultMsg: "Assalamu Alaikum, I would like to inquire about your luxury collection.",
  contactEmail: "concierge@noor.com.bd",
  address: "House 12, Road 4, Gulshan-2, Dhaka - 1212, Bangladesh",
  insideDhakaDelivery: 80,
  outsideDhakaDelivery: 150,
  bkashNumber: "01700000000 (Merchant/Send Money)",
  nagadNumber: "01800000000 (Merchant/Send Money)",
  rocketNumber: "01900000000-8 (Personal)",
  adminPin: "admin123",
  announcement: "✨ বিশেষ রমজান ও সিজনাল অফার! প্রতিটি ক্রয়ে আকর্ষণীয় প্রিমিয়াম গিফট বক্স ও ফ্রি শিপিং।"
};

const DEFAULT_CATEGORIES = [
  { 
    id: "all", 
    name: "সকল কালেকশন (All Masterpieces)", 
    icon: "diamond", 
    slug: "all", 
    tag: "Curated Collection" 
  },
  { 
    id: "apparel", 
    name: "আবায়া ও থোব (Abaya & Apparel)", 
    icon: "styler", 
    slug: "apparel", 
    tag: "01 / Wardrobe", 
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "prayer", 
    name: "রয়েল জায়নামাজ (Prayer Rugs)", 
    icon: "folded_hands", 
    slug: "prayer", 
    tag: "02 / Worship", 
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "books", 
    name: "কুরআন ও ইসলামিক বই (Quran & Books)", 
    icon: "menu_book", 
    slug: "books", 
    tag: "03 / Knowledge", 
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "tasbih", 
    name: "হ্যান্ডক্রাফটেড তাসবিহ (Tasbih)", 
    icon: "adjust", 
    slug: "tasbih", 
    tag: "04 / Remembrance", 
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "fragrance", 
    name: "খাঁটি আতর ও উদ (Attar & Oud)", 
    icon: "sanitizer", 
    slug: "fragrance", 
    tag: "05 / Scent", 
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "gifts", 
    name: "লাক্সারি গিফট বক্স (Gift Hampers)", 
    icon: "featured_seasonal_and_gifts", 
    slug: "gifts", 
    tag: "06 / Gifting", 
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "fashion", 
    name: "মডেস্ট সিল্ক হিজাব (Modest Fashion)", 
    icon: "apparel", 
    slug: "fashion", 
    tag: "07 / Style", 
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "living", 
    name: "ক্যালিগ্রাফি ও ডেকোর (Home Sanctuary)", 
    icon: "home", 
    slug: "living", 
    tag: "08 / Living", 
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85" 
  }
];

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "The Medina Cashmere Abaya (মেদিনা ক্যাশমিয়ার আবায়া)",
    category: "apparel",
    price: 14500,
    regularPrice: 18000,
    stock: 25,
    rating: 5.0,
    reviewsCount: 48,
    badge: "Masterpiece",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85"
    ],
    colors: ["Onyx Black", "Desert Sand", "Midnight Navy", "Olive Heritage"],
    sizes: ["52 (Petite)", "54 (Standard)", "56 (Tall)", "58 (Grand)"],
    description: "বিশুদ্ধ মঙ্গোলিয়ান ক্যাশমিয়ার ও প্রিমিয়াম সিল্ক ব্লেন্ড দিয়ে নিখুঁত হাতে বোনা রাজকীয় আবায়া। হাতায় রয়েছে সূক্ষ্ম গোল্ডেন জ্যামিতিক নকশা ও আরামদায়ক ব্রিদেবল ফেব্রিক।"
  },
  {
    id: "prod-2",
    name: "The Royal Velvet Prayer Mat (রয়েল ভেলভেট মেমোরি ফোম জায়নামাজ)",
    category: "prayer",
    price: 6800,
    regularPrice: 8500,
    stock: 40,
    rating: 4.9,
    reviewsCount: 124,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=85",
    colors: ["Emerald & Gold", "Obsidian Charcoal", "Royal Navy"],
    sizes: ["Standard (70x115 cm)", "Grand Luxury (80x130 cm)"],
    description: "হাতে বোনা প্রিমিয়াম ভেলভেট মেমোরি ফোম জায়নামাজ। দীর্ঘক্ষণ নামাজে আরামদায়ক কুশনিং সাপোর্ট ও ইসলামিক আর্চ এমব্রয়ডারি ডিজাইন সমৃদ্ধ।"
  },
  {
    id: "prod-3",
    name: "Royal Cambodian Aged Oud Extrait (রয়েল কম্বোডিয়ান আগর আতর)",
    category: "fragrance",
    price: 9500,
    regularPrice: 12000,
    stock: 18,
    rating: 5.0,
    reviewsCount: 31,
    badge: "Limited Edition",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
    sizes: ["12ml Extrait Flacon", "30ml Crystal Decanter"],
    description: "২৫ বছরের পুরোনো ওক ব্যারেলে প্রক্রিয়াজাত ১০০% প্রাকৃতিক কম্বোডিয়ান আগর কাঠের আতর। অসাধারণ দীর্ঘস্থায়ী সুবাস ও প্রিমিয়াম ক্রিস্টাল বোতল।"
  },
  {
    id: "prod-4",
    name: "The Al-Malik Silk Thobe (আল-মালিক মালবেরি সিল্ক থোব)",
    category: "apparel",
    price: 8500,
    regularPrice: 10500,
    stock: 30,
    rating: 4.8,
    reviewsCount: 48,
    badge: "New Arrival",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85",
    colors: ["Jet Black", "Ivory Cream", "Midnight Blue"],
    sizes: ["52", "54", "56", "58"],
    description: "খাঁটি মালবেরি সিল্কের হাতে বোনা প্রিমিয়াম থোব। কলার ও হাতায় সূক্ষ্ম সোনালী সুতার এমব্রয়ডারি ও সফট ফিনিশিং।"
  },
  {
    id: "prod-5",
    name: "Onyx Gemstone & Hand-Hammered Brass Tasbih (তাসবিহ)",
    category: "tasbih",
    price: 4200,
    regularPrice: 5500,
    stock: 50,
    rating: 4.9,
    reviewsCount: 88,
    badge: "Heritage",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
    sizes: ["33 Beads", "99 Beads Deluxe"],
    description: "প্রাকৃতিক ব্ল্যাক অনিক্স রত্নপাথর এবং খাঁটি পিতলের সূক্ষ্ম কারুকার্যময় তাসবিহ। রাজকীয় মখমল গিফট বক্সে সুরক্ষিত।"
  },
  {
    id: "prod-6",
    name: "Habutai Pure Silk Gold Calligraphy Hijab (সিল্ক হিজাব)",
    category: "fashion",
    price: 2900,
    regularPrice: 3800,
    stock: 65,
    rating: 4.9,
    reviewsCount: 92,
    badge: "VIP Choice",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
    colors: ["Champagne Gold", "Pearl White", "Obsidian Rose"],
    sizes: ["Free Size (75 x 190 cm)"],
    description: "বিশুদ্ধ হাবুতাই সিল্ক ফেব্রিকের তৈরি ডিজিটাল গোল্ডেন ইসলামিক ক্যালিগ্রাফি প্রিন্টেড প্রিমিয়াম হিজাব।"
  },
  {
    id: "prod-7",
    name: "Leather-Bound Gold Leaf Artisan Holy Quran (পবিত্র কুরআন শরীফ)",
    category: "books",
    price: 5500,
    regularPrice: 7000,
    stock: 35,
    rating: 5.0,
    reviewsCount: 160,
    badge: "Sacred Edition",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=85",
    sizes: ["Large Deluxe Gift Edition"],
    description: "খাঁটি চামড়ার হার্ডকভার ও ২৪ ক্যারেট গোল্ড লিফ ক্যালিগ্রাফি সম্বলিত বৃহৎ ফন্টের পবিত্র কুরআন শরীফ ও রেহাল সেট।"
  },
  {
    id: "prod-8",
    name: "The Sultan Luxury Islamic Gift Hamper (লাক্সারি গিফট হ্যাম্পার)",
    category: "gifts",
    price: 11800,
    regularPrice: 15000,
    stock: 20,
    rating: 5.0,
    reviewsCount: 42,
    badge: "Exclusive",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85",
    description: "মদিনার খাঁটি আজওয়া খেজুর, রয়েল উদ আতর, মেটাল অনিক্স তাসবিহ এবং প্রিমিয়াম সিল্ক হিজাব সমন্বিত রাজকীয় গিফট ট্রাঙ্ক।"
  }
];

const DEFAULT_COUPONS = [
  { code: "NOORVIP", discountPercent: 15, minSpend: 3000, maxDiscount: 2500, active: true },
  { code: "EID2026", discountPercent: 20, minSpend: 5000, maxDiscount: 4000, active: true },
  { code: "WELCOME500", discountFixed: 500, minSpend: 2000, active: true }
];

const DEFAULT_ORDERS = [
  {
    orderId: "NR-89240-DXB",
    customerName: "Princess Yasmin Al-Sabah",
    phone: "01712345678",
    address: "Villa 42, Road 11, Gulshan 2, Dhaka",
    deliveryArea: "inside",
    deliveryFee: 80,
    paymentMethod: "bkash",
    trxId: "9K7X82LM1",
    items: [
      { id: "prod-1", name: "The Medina Cashmere Abaya", price: 14500, quantity: 1, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85" }
    ],
    subtotal: 14500,
    discount: 2175,
    couponCode: "NOORVIP",
    total: 12405,
    status: "Processing",
    currentStep: 3,
    date: "2026-09-12 14:32",
    notes: "Signature keepsake packaging required."
  },
  {
    orderId: "NR-78102-DHK",
    customerName: "Tariq Mahmud",
    phone: "01898765432",
    address: "House 18, Block D, Bashundhara R/A, Dhaka",
    deliveryArea: "inside",
    deliveryFee: 80,
    paymentMethod: "cod",
    trxId: "N/A (Cash on Delivery)",
    items: [
      { id: "prod-2", name: "The Royal Velvet Prayer Mat", price: 6800, quantity: 1, image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=85" }
    ],
    subtotal: 6800,
    discount: 500,
    couponCode: "WELCOME500",
    total: 6380,
    status: "Shipped",
    currentStep: 4,
    date: "2026-09-11 11:20",
    notes: "Call before arrival."
  }
];
