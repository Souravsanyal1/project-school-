/**
 * Default Seed Data for Noor & Luxury Flagship Store
 * Base Currency: BDT (৳)
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
  announcement: "✨ বিশেষ রমজান ও সিজনাল অফার! প্রতিটি ক্রয়ে কমপ্লিমেন্টারি প্রিমিয়াম গিফট বক্স ও ফ্রি শিপিং।"
};

const DEFAULT_CATEGORIES = [
  { id: "all", name: "All Masterpieces", icon: "diamond", slug: "all", tag: "Curated" },
  { id: "apparel", name: "Islamic Clothing & Abaya", icon: "styler", slug: "apparel", tag: "01 / Wardrobe", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoPaBnB_Y1XTIkinl8FBFUFnIxV5VrOTeXn8hosj2DrWbgeRxPEQDQlFqqRROHonINhnSS6jP73e3cWgJni_X_nrPk6DkYQf5vpYkUKit9x7YZyYqONIC09F9Lg9Ud7hGRQpbQ1ypOhwk0ER670xvY0D3QixABNtqk6_FB-mMT8f7lNrplbSBD7n2_g3AyAovs-Ba_aUZybxzPjSp52oNUeymZ1uBIEFeAmpPmTPDGgDHt4UkZou4" },
  { id: "prayer", name: "Prayer Essentials & Rugs", icon: "folded_hands", slug: "prayer", tag: "02 / Worship", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5c_E6oOYAt0ZSUZun_eYjf4g2o-Qi1WY6v94BfpX1Gu0wU6sjTgIitblTFVXphXpV6zVV-RXP9uoDjK53l5c1udvygXWVo5Eip8drkZN-XV8-luX5zad0Eq2q7BI3qd6sUMfhRx0KAMqBk_IkfXKW_7F-Ccx81U3ON0PoObROZRE-PpqAmQzcAUnvFmX57bUDFDPxZYyWXDYNboFJT36_kgp3VWI26-wDUoN6MNsDEHaT8vD-_fM" },
  { id: "books", name: "Quran & Islamic Books", icon: "menu_book", slug: "books", tag: "03 / Knowledge", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgkJY6Q2dKSBihhM4nwQeZfwVFSNJqQfS9tPAK1Q9lTOxogBvYTkX_2G7pMF2MVZjxK-JxMLq1-ENkP8rpWU9M2hnAO6gqRadnWFKybpa-sva_bWUra9_ZhH54Xe0Pm6ajR9zQ7samdNNGHtYuNouAk7GHySpLfoo6gnxzvXXSGd44U11yo2Y279D_fb45IKoKVEdzcZySv42c1Ke_gviMpAKJg7bRbH4Vsyo6URyRh0rmdzhQSwc" },
  { id: "tasbih", name: "Handcrafted Tasbih", icon: "adjust", slug: "tasbih", tag: "04 / Remembrance", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdSgtwCYODPPu0CqQe8h-G2qBqJfzAyu6GXKY3WWyevFy7I6z5ZB-ATICyxvpUdQOokhoayelzC8hEPCwwz_KTjew39271EKHd8S36xGvcrN7P4yJ8FxhcFPqRiF_iJ7PegSEKbuqoO868dtYVV1S-1ba4KUDjPrSBXi0Kok09gwcBIrdq_Y7T9a4qGawifS3wTRExw_lxn14XE7aMlWt6YR-MOSfE7cpny_5BYcdCNQIOdeICrhk" },
  { id: "fragrance", name: "Pure Attar & Royal Oud", icon: "sanitizer", slug: "fragrance", tag: "05 / Scent", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0b1M1Xhculd_jtARezejLLsq0WVeoCzeB8qx2nrojGY2qgvEpaTN2GTWGG8c6AfXXJVQs2hFxIQtiaUyayCWr_xojiKAEmV5fH5sLahbYUwuyhDiTWS6gH890L9si8O6ByeVO9bUhRapUIOQzAxmRUuBJeqyO3BpW4h9GwIXvgCIFaKLfO_7Xm3McTvV98huH5rqtszhKmkzociXXXaw-gKhxb8l5BOMMiweeJ90aCZEuJCeLeSI" },
  { id: "gifts", name: "Luxury Gift Sets", icon: "featured_seasonal_and_gifts", slug: "gifts", tag: "06 / Gifting", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIMbJjv3q72U0boX9oXTkap13wGYpus4VyIQ0VshE6GrFqjoZDoEhuD2JTxflJ8YOB5q7lwAJKwFBqmJkDW-yI12uD-aBGP84FZ7IoXaqy4gJZDvyCynqbCeHA1k23if4nIvX5lhM9mkFgUvQPpf1pyny8HgSZKwM6gS6wAn3Vi5AaTdjV_7Gu0XLfRtSXpaQhNX3LSbQAnpm4PaB3dYbci4_4Cm5DyLESfCHea6JxDED0Tp7LPu0" },
  { id: "fashion", name: "Modest Fashion & Capes", icon: "apparel", slug: "fashion", tag: "07 / Style", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQtmVtpRBgpjNTh4I9HkRqck2rJ9uOiAClTBO6b2pTJS2NFbGTGs6LFNzoyayqpmAkFg5eOjf5R50aJ4L1J8CzGQup9LH8FrS7t88C14392QeErO-XnpDOwFt5gFOzQY9RViEMzLDYrIz85nlgHuwoBdnQ-hinOZL9yfeuuv3bBoPOUsYiGq9cjkNwepHYJeoa2d8f-lN9UiXIRsp9JA6xzyEn6hWitpKmWaAyqMPmADca-q4R44s" },
  { id: "living", name: "Calligraphy & Home Decor", icon: "home", slug: "living", tag: "08 / Living", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVo-JpoX4AXv7C_pY__r20SQWR6yorieZOx4bQn8VGbe8b0MM8H4b4V7KsUXmvSs6KIcpb-_xqSHJufXNsBWvyrKqfINyEedxv9Ff23GRHB-c5SDSVnTk-5Llk48Rim6B6sBQXjrQMRgmhXqnuIEtibav-aTa1d4zBPgXxl4BKyVi7WAu7vPQRYMcb1yixRYE7ziOuUf_SUrfiam-ruoVbV6d-7FwDGps5qF__iiDZmt3x1wqPdRY" }
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBci9eA1b6uV_3Qbss9IK9fove2dTPOFnmzWm-QQV_duhsLEnC1WV-O9Gg2SCMtiX3xp7b99K5Yx58mBMRBxJS3cPrq6ztj_4Wtbj1em9LQm5g48eDsDtKW0BXOPw5yGb05JmteUzdVWXVHZUv7zQkX6f44vyhULlBAJ3z5C5CuZoewrjgDTU7-xRqEJFQ6n84TD909FLn542i3ts6NiTVQOeruvLuaPiZhxYmQb6yUfEuTOYhOrOs",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBci9eA1b6uV_3Qbss9IK9fove2dTPOFnmzWm-QQV_duhsLEnC1WV-O9Gg2SCMtiX3xp7b99K5Yx58mBMRBxJS3cPrq6ztj_4Wtbj1em9LQm5g48eDsDtKW0BXOPw5yGb05JmteUzdVWXVHZUv7zQkX6f44vyhULlBAJ3z5C5CuZoewrjgDTU7-xRqEJFQ6n84TD909FLn542i3ts6NiTVQOeruvLuaPiZhxYmQb6yUfEuTOYhOrOs",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5MIG-kBmv6_UtHfx8sDLNrfdR6SCCauBzqD195GuJ_f3oNdUTApF6AtwYFK6qnjjNgGKq9aJSDXsbEa_o3q-mVKYTMjg-5zI5hvR4C7uG8-HGK7DjIpfo2sV3-rR8FHCuVIEBO2LOJfAu9sQBMmQ5R7R-dK14Gw-rhilxEe0XxEjP-QzGs4NcmswHS4I9mcLRRgOXpkVc2YE3HgTF0ahjYjQJnzN7va7HaGykKX29uJWbm5p5C9Y",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBekxkmWavVst1_sXFL3F9G_NhoTo5NDCRYXQIWn_T7nuxUIcBAcdcC2djYgloNtApEaHMXcbAOdY7EqeYPQlMo5Q57fFNp5IAmJIsagjHPslV0AV35mj0U7hDCQrnqhv7fjbys1mTzXwdo1Apb3IbxHA0ECWkf4MoQ-YoeJ1Yuf_bvgoNvqsDh42VjxIp_Thth--OJPU8I3PbEVzakHhJ023nUCWl4EjwvV-rYmZS5czoc-hxIpog",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATd0Pd8X56o7Cqf8vmPxfGhujciPyNUFERMXQDlHCdGTPJ8UOoCz_aNonnv33tzMJEpWffmw6Su8Tzk63jYlOLkRLMlgFeTmoD7ljbDDP8orrR-3qmiktA8sD53EHIkyT_a2HZPw0fufy1OPrPdLbvNK7LiMM60y5kMkxOQL4Y4DwFhrQiYH-e9baZESJlD_bvHhccyYsjt7Sar52b9IG4SL0lFvzEP1p9wchWpjheQ1YYWA7Cm9M"
    ],
    colors: ["Onyx Black", "Desert Sand", "Midnight Navy", "Olive Heritage"],
    sizes: ["52", "54", "56", "58"],
    description: "Hand-loomed from pure Mongolian cashmere, this exquisite piece merges centuries-old nomadic textile traditions with modern architectural draping. Finished with delicate tone-on-tone geometric embroidery along the sleeves."
  },
  {
    id: "prod-2",
    name: "The Royal Velvet Prayer Mat (রয়েল ভেলভেট জায়নামাজ)",
    category: "prayer",
    price: 6800,
    regularPrice: 8500,
    stock: 40,
    rating: 4.9,
    reviewsCount: 124,
    badge: "Best Seller",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDlf7WxiW0Di0Lo-Efds93X4gSdKoswEAd90W3rDP_8FHJw5iztWjZTUj7vfDIsqp3pylkfzteaP70HQEWgrobkXnexpHq9FxdB_w3HlLIYtaVYr8jaXOB9fTundHiJi3NwsPvnFhUQhJ86ednsmXUFAXMb5heJSBNutmvHyIisdqtKNpDi1mBFaQv_GwpoSs2TazlCQWXzOEzdCLCtcPV63YMYK4m4YoW_7-uctjCXEZfvsMGRac",
    colors: ["Emerald & Gold", "Obsidian Charcoal", "Royal Navy"],
    sizes: ["Standard", "Grand Luxury"],
    description: "Handcrafted velvet prayer mat in deep emerald green with intricate gold bullion geometric arch embroidery and memory foam plush padded cushioning."
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHr1zdS4VFGWN5zmPztcCMSZdeE1mhNkHIdHu9Ov9wQJim0PAV1VTy-2SEP-8LdmCrSSdmoXlI1CWPfCvExtmhE71MiRaFVLGpdOK023Os3nIqU0ItqAEl0xvMLeR2ifGlR6YIRQ-pYKUkOStRIPz49GSZx6AziYrmfnTcQZHl7-EOdRkJmAzIg9zgEf_VjWEFmQHOoH1bCZPI439i1syRfqFur16WsALCr1VjpeNkFCVM83xBWcA",
    sizes: ["12ml Extrait", "30ml Crystal Decanter"],
    description: "Aged 25 years in oak barrels, delivering deep resinous, woody, and smoky floral notes in a hand-cut crystal flacon."
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcvQdjj3UCL4DeIfoV0NctpFVSv_qZI6WDxfE-93kVHEOq5YR82Cgo1BXPZnZp3mIRPr_70jkO30kaEEP5E_jS5rfj2Qk9Z0hnIgz4U8sZovpuWsaSdGoPXeEeZQHheru-gUDy9DRRphtM9nha_A1MmnHCo6sbyXJxtQVwBlYIfCcTlINWI6hu92vWKs1JGIaaTdyIWZrEGN1O7h-0IlR5nWDLoMvU88-TOLsmipaqnaL9CIXnHAc",
    colors: ["Jet Black", "Ivory Cream", "Midnight Blue"],
    sizes: ["52", "54", "56", "58"],
    description: "Hand-woven pure mulberry silk thobe tailored with bespoke gold thread embroidery along the collar and cuffs."
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfrwNXicmpc7eu_KikngzkgVUSXbG2Ph0wVsMozRNSYezaywxTiW_DmJh23OtBHSbClbAc7M2kxQNQU9rfCCg4KGSpgjhj-_3efXC3COU-7JFe88L6QnNgSuQUl0juWjeR5CYvpmozihdeSmQIIJZxOCQj2J8CQLZdulnxA1aUjPSK9SCIy5_3LBWgrOzZr9n7K5sTjFSxNGW8dPZV7B5_UodFVCed-UUPriNDMmuinE7LmEn4QIo",
    sizes: ["33 Beads", "99 Beads Deluxe"],
    description: "Hand-hammered pure brass tasbih prayer beads infused with natural black onyx gemstones, encased in a velvet keepsake presentation box."
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVqeenT9ZgO7DyLaqiaawcAEivRR0LI7R6tPKn4vSE-wDMoBPQc5AXxBistrBebSYDQiDv3sW082hif8sjC5V20bWE7wgeTJSxRVb04N9vlZa5ZlE5B8M6O9z3iSlfucTmjXIpIn5jQWuDsNpzsOqWGCkx6dGcd1P30SDtxPYwo8vkML_xNCv0Iv2texCDPTtIaWk-XQcdPby-XuXC8OO0tAzFTYWO5NCXn_n9Jopp3GMdeT-hWXo",
    colors: ["Champagne Gold", "Pearl White", "Obsidian Rose"],
    sizes: ["Free Size (75 x 190 cm)"],
    description: "Pure Habutai silk scarf with hand-rolled edges and subtle watermark Islamic geometric lattice and calligraphy prints."
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgkJY6Q2dKSBihhM4nwQeZfwVFSNJqQfS9tPAK1Q9lTOxogBvYTkX_2G7pMF2MVZjxK-JxMLq1-ENkP8rpWU9M2hnAO6gqRadnWFKybpa-sva_bWUra9_ZhH54Xe0Pm6ajR9zQ7samdNNGHtYuNouAk7GHySpLfoo6gnxzvXXSGd44U11yo2Y279D_fb45IKoKVEdzcZySv42c1Ke_gviMpAKJg7bRbH4Vsyo6URyRh0rmdzhQSwc",
    sizes: ["Large Deluxe Gift Edition"],
    description: "Hand-bound Quran in genuine rich leather with 24k gold leaf calligraphy and gilded page edges, resting on an ornate mahogany stand."
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIMbJjv3q72U0boX9oXTkap13wGYpus4VyIQ0VshE6GrFqjoZDoEhuD2JTxflJ8YOB5q7lwAJKwFBqmJkDW-yI12uD-aBGP84FZ7IoXaqy4gJZDvyCynqbCeHA1k23if4nIvX5lhM9mkFgUvQPpf1pyny8HgSZKwM6gS6wAn3Vi5AaTdjV_7Gu0XLfRtSXpaQhNX3LSbQAnpm4PaB3dYbci4_4Cm5DyLESfCHea6JxDED0Tp7LPu0",
    description: "An opulent gift trunk featuring pure Ajwa dates, 12ml Royal Oud attar, hand-engraved brass tasbih, and Habutai silk scarf, tied with gold satin ribbon."
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
      { id: "prod-1", name: "The Medina Cashmere Abaya", price: 14500, quantity: 1, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBci9eA1b6uV_3Qbss9IK9fove2dTPOFnmzWm-QQV_duhsLEnC1WV-O9Gg2SCMtiX3xp7b99K5Yx58mBMRBxJS3cPrq6ztj_4Wtbj1em9LQm5g48eDsDtKW0BXOPw5yGb05JmteUzdVWXVHZUv7zQkX6f44vyhULlBAJ3z5C5CuZoewrjgDTU7-xRqEJFQ6n84TD909FLn542i3ts6NiTVQOeruvLuaPiZhxYmQb6yUfEuTOYhOrOs" }
    ],
    subtotal: 14500,
    discount: 2175,
    couponCode: "NOORVIP",
    total: 12405,
    status: "Processing",
    currentStep: 3, // 1: Order Placed, 2: Artisanal Crafting, 3: Quality Inspection, 4: Dispatched, 5: Delivered
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
      { id: "prod-2", name: "The Royal Velvet Prayer Mat", price: 6800, quantity: 1, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDlf7WxiW0Di0Lo-Efds93X4gSdKoswEAd90W3rDP_8FHJw5iztWjZTUj7vfDIsqp3pylkfzteaP70HQEWgrobkXnexpHq9FxdB_w3HlLIYtaVYr8jaXOB9fTundHiJi3NwsPvnFhUQhJ86ednsmXUFAXMb5heJSBNutmvHyIisdqtKNpDi1mBFaQv_GwpoSs2TazlCQWXzOEzdCLCtcPV63YMYK4m4YoW_7-uctjCXEZfvsMGRac" }
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
