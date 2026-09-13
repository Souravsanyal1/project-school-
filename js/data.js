/**
 * Default Seed Data for Noor & Luxury Flagship Store
 * Base Currency: BDT (৳)
 * High-Resolution Crystal Clear Photography
 */

const DEFAULT_SETTINGS = {
  storeName: "INSAF Collection",
  brandSubtitle: "Gazipur Zone",
  logoIcon: "diamond",
  logoImage: "",
  tagline: "Elegance Rooted in Faith - ইসলামিক লাক্সারি লাইফস্টাইল ও প্রিমিয়াম কালেকশন",
  currency: "৳",
  currencyCode: "BDT",
  contactPhone: "+8801700000000",
  whatsappNumber: "8801700000000",
  whatsappDefaultMsg: "Assalamu Alaikum, I would like to inquire about your luxury collection.",
  contactEmail: "contact@insaf.com.bd",
  adminEmail: "admin@gmail.com",
  adminPassword: "admin123",
  adminPin: "admin123",
  heroBgImage: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=85",
  heroTitle: "Elegance Rooted in Faith",
  heroSubtitle: "✨ Flagship Collection 2026 • ৳ BDT",
  heroDescription: "Uncompromising craftsmanship blending timeless Islamic heritage with contemporary global luxury standards. Base currency in ৳ (BDT) with nationwide fast delivery.",
  address: "Gazipur, Dhaka, Bangladesh",
  insideDhakaDelivery: 80,
  outsideDhakaDelivery: 150,
  bkashNumber: "01700000000 (Merchant/Send Money)",
  nagadNumber: "01800000000 (Merchant/Send Money)",
  rocketNumber: "01900000000-8 (Personal)",
  announcement: "✨ বিশেষ রমজান ও সিজনাল অফার! প্রতিটি ক্রয়ে আকর্ষণীয় প্রিমিয়াম গিফট বক্স ও ফ্রি শিপিং।"
};

const DEFAULT_CATEGORIES = [
  { 
    id: "all", 
    name: "সকল কালেকশন", 
    icon: "diamond", 
    slug: "all", 
    tag: "All Collection" 
  },
  { 
    id: "apparel", 
    name: "আবায়া ও পোশাক", 
    icon: "styler", 
    slug: "apparel", 
    tag: "01 / Wardrobe", 
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "prayer", 
    name: "জায়নামাজ", 
    icon: "folded_hands", 
    slug: "prayer", 
    tag: "02 / Worship", 
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "books", 
    name: "কুরআন ও বই", 
    icon: "menu_book", 
    slug: "books", 
    tag: "03 / Knowledge", 
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "tasbih", 
    name: "তাসবিহ", 
    icon: "adjust", 
    slug: "tasbih", 
    tag: "04 / Remembrance", 
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "fragrance", 
    name: "আতর ও উদ", 
    icon: "sanitizer", 
    slug: "fragrance", 
    tag: "05 / Scent", 
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "gifts", 
    name: "গিফট বক্স", 
    icon: "featured_seasonal_and_gifts", 
    slug: "gifts", 
    tag: "06 / Gifting", 
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "fashion", 
    name: "হিজাব ও স্কার্ফ", 
    icon: "apparel", 
    slug: "fashion", 
    tag: "07 / Style", 
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85" 
  },
  { 
    id: "living", 
    name: "ইসলামিক ডেকোর", 
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

const DEFAULT_ORDERS = [];
