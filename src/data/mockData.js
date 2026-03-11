/**
 * PC Parts & Tech Mock Data - Matches PostgreSQL schema (database_v1.sql)
 * Single source for all product data - technology/PC components only
 */

const img = (id, w = 400, h = 400) => `https://picsum.photos/seed/${id}/${w}/${h}`;

// ============ BRANDS ============
export const brands = [
  { id: 1, name: 'Intel', slug: 'intel' },
  { id: 2, name: 'AMD', slug: 'amd' },
  { id: 3, name: 'NVIDIA', slug: 'nvidia' },
  { id: 4, name: 'Corsair', slug: 'corsair' },
  { id: 5, name: 'G.Skill', slug: 'gskill' },
  { id: 6, name: 'Samsung', slug: 'samsung' },
  { id: 7, name: 'ASUS', slug: 'asus' },
  { id: 8, name: 'MSI', slug: 'msi' },
  { id: 9, name: 'Seagate', slug: 'seagate' },
  { id: 10, name: 'be quiet!', slug: 'be-quiet' },
];

// ============ CATEGORIES ============
export const categories = [
  { id: 1, name: 'CPU', slug: 'cpu', icon: '⚡', image: img('cpu', 400, 400), count: 2 },
  { id: 2, name: 'GPU', slug: 'gpu', icon: '🎮', image: img('gpu', 400, 400), count: 2 },
  { id: 3, name: 'RAM', slug: 'ram', icon: '🧠', image: img('ram', 400, 400), count: 2 },
  { id: 4, name: 'Storage', slug: 'storage', icon: '💾', image: img('storage', 400, 400), count: 2 },
  { id: 5, name: 'Motherboard', slug: 'motherboard', icon: '🔌', image: img('mb', 400, 400), count: 1 },
  { id: 6, name: 'PSU', slug: 'psu', icon: '⚙️', image: img('psu', 400, 400), count: 1 },
  { id: 7, name: 'Case', slug: 'case', icon: '🖥️', image: img('case', 400, 400), count: 1 },
  { id: 8, name: 'Cooling', slug: 'cooling', icon: '❄️', image: img('cooling', 400, 400), count: 1 },
];

// ============ PRODUCTS + VARIANTS (denormalized for display) ============
const productVariants = [
  { product_id: 1, price: 589.99, compare_at: 649.99, variant_name: 'Box' },
  { product_id: 2, price: 549.99, compare_at: 599.99, variant_name: 'Box' },
  { product_id: 3, price: 1599.99, compare_at: 1799.99, variant_name: 'Founders Edition' },
  { product_id: 4, price: 799.99, compare_at: 849.99, variant_name: 'Founders Edition' },
  { product_id: 5, price: 149.99, compare_at: 169.99, variant_name: '32GB (2x16GB)' },
  { product_id: 6, price: 249.99, compare_at: 279.99, variant_name: '64GB (2x32GB)' },
  { product_id: 7, price: 179.99, compare_at: 219.99, variant_name: '2TB' },
  { product_id: 8, price: 79.99, compare_at: 99.99, variant_name: '4TB 5400RPM' },
  { product_id: 9, price: 449.99, compare_at: 499.99, variant_name: 'ATX' },
  { product_id: 10, price: 169.99, compare_at: 189.99, variant_name: '850W' },
  { product_id: 11, price: 94.99, compare_at: 109.99, variant_name: 'Black' },
  { product_id: 12, price: 199.99, compare_at: 229.99, variant_name: '360mm Black' },
];

const rawProducts = [
  { id: 1, brand_id: 1, name: 'Intel Core i9-14900K', slug: 'intel-core-i9-14900k', category_id: 1, category_slug: 'cpu', description: '24 cores, up to 6.0GHz. Ideal for Gaming, AI Research.', usage_tags: ['Gaming', 'AI Research', 'Graphics'], isFeatured: true, isNew: false },
  { id: 2, brand_id: 2, name: 'AMD Ryzen 9 7950X3D', slug: 'amd-ryzen-9-7950x3d', category_id: 1, category_slug: 'cpu', description: '16 cores, 3D V-Cache. Best for Gaming and AI.', usage_tags: ['Gaming', 'AI Research'], isFeatured: true, isNew: true },
  { id: 3, brand_id: 3, name: 'NVIDIA GeForce RTX 4090', slug: 'nvidia-geforce-rtx-4090', category_id: 2, category_slug: 'gpu', description: '24GB GDDR6X. Top-tier for Gaming, AI, Graphics.', usage_tags: ['Gaming', 'AI Research', 'Graphics'], isFeatured: true, isNew: false },
  { id: 4, brand_id: 3, name: 'NVIDIA GeForce RTX 4070 Ti', slug: 'nvidia-geforce-rtx-4070-ti', category_id: 2, category_slug: 'gpu', description: '12GB GDDR6X. Great for 1440p Gaming.', usage_tags: ['Gaming', 'Graphics'], isFeatured: false, isNew: true },
  { id: 5, brand_id: 5, name: 'G.Skill Trident Z5 RGB 32GB', slug: 'gskill-trident-z5-rgb-32gb', category_id: 3, category_slug: 'ram', description: 'DDR5 6000MHz. For Gaming and AI workloads.', usage_tags: ['Gaming', 'AI Research'], isFeatured: true, isNew: false },
  { id: 6, brand_id: 4, name: 'Corsair Vengeance RGB 64GB', slug: 'corsair-vengeance-rgb-64gb', category_id: 3, category_slug: 'ram', description: 'DDR5 5600MHz. High capacity for AI Research.', usage_tags: ['AI Research', 'Graphics'], isFeatured: false, isNew: false },
  { id: 7, brand_id: 6, name: 'Samsung 990 Pro 2TB NVMe', slug: 'samsung-990-pro-2tb', category_id: 4, category_slug: 'storage', description: 'Gen 4 NVMe. Fast for Gaming, AI datasets.', usage_tags: ['Gaming', 'AI Research', 'Graphics'], isFeatured: true, isNew: false },
  { id: 8, brand_id: 9, name: 'Seagate Barracuda 4TB HDD', slug: 'seagate-barracuda-4tb', category_id: 4, category_slug: 'storage', description: '4TB bulk storage. Cost-effective.', usage_tags: [], isFeatured: false, isNew: false },
  { id: 9, brand_id: 7, name: 'ASUS ROG Maximus Z790', slug: 'asus-rog-maximus-z790', category_id: 5, category_slug: 'motherboard', description: 'Intel Z790. Premium VRM, PCIe 5.0.', usage_tags: ['Gaming'], isFeatured: true, isNew: false },
  { id: 10, brand_id: 10, name: 'be quiet! Straight Power 11 850W', slug: 'be-quiet-straight-power-11-850w', category_id: 6, category_slug: 'psu', description: '80+ Platinum. Silent for high-end builds.', usage_tags: ['Gaming', 'AI Research'], isFeatured: false, isNew: false },
  { id: 11, brand_id: 4, name: 'Corsair 4000D Airflow', slug: 'corsair-4000d-airflow', category_id: 7, category_slug: 'case', description: 'Mid-tower with excellent airflow.', usage_tags: ['Gaming'], isFeatured: false, isNew: true },
  { id: 12, brand_id: 4, name: 'Corsair iCUE H150i Elite', slug: 'corsair-icue-h150i-elite', category_id: 8, category_slug: 'cooling', description: '360mm AIO. For Gaming and AI CPUs.', usage_tags: ['Gaming', 'AI Research'], isFeatured: true, isNew: false },
];

const variantStock = { 1: 25, 2: 18, 3: 8, 4: 22, 5: 45, 6: 30, 7: 60, 8: 100, 9: 15, 10: 35, 11: 50, 12: 28 };

/**
 * Products for display - unified format (ProductCard, cart, wishlist)
 */
export function getProducts() {
  return rawProducts.map((p) => {
    const variant = productVariants.find((v) => v.product_id === p.id);
    const brand = brands.find((b) => b.id === p.brand_id);
    const salePrice = variant?.price ?? 0;
    const compareAt = variant?.compare_at;
    const hasDiscount = compareAt && compareAt > salePrice;
    const cat = categories.find((c) => c.slug === p.category_slug);
    return {
      ...p,
      brand: brand?.name ?? '',
      brand_id: p.brand_id,
      image: img(`pc${p.id}`),
      thumbnail_url: img(`pc${p.id}`),
      price: hasDiscount ? compareAt : salePrice,
      discountPrice: hasDiscount ? salePrice : null,
      compare_at: compareAt,
      category: cat?.name ?? '',
      categorySlug: p.category_slug,
      colors: [],
      sizes: [],
      images: [img(`pc${p.id}`)],
      tags: p.usage_tags || [],
      specifications: {},
      variant_name: variant?.variant_name,
      stock_quantity: variantStock[p.id] ?? 0,
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 500) + 50,
      badge: hasDiscount ? 'Sale' : (p.isNew ? 'New' : null),
      badgeColor: hasDiscount ? 'danger' : (p.isNew ? 'primary' : null),
    };
  });
}

export const products = getProducts();

// ============ FILTER HELPERS ============
export const usagePurposes = [
  { id: 'gaming', label: 'Gaming', keywords: ['gaming', 'game'] },
  { id: 'ai-research', label: 'AI Research', keywords: ['ai', 'research'] },
  { id: 'graphics', label: 'Graphics', keywords: ['graphics', 'render', 'design'] },
];

export const priceRange = {
  min: Math.min(...productVariants.map((v) => v.price)),
  max: Math.max(...productVariants.map((v) => v.price)),
};

export const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'newest', label: 'Newest' },
];

export const priceRanges = [
  { value: '0-100', label: 'Under $100', min: 0, max: 100 },
  { value: '100-300', label: '$100 - $300', min: 100, max: 300 },
  { value: '300-600', label: '$300 - $600', min: 300, max: 600 },
  { value: '600-1000', label: '$600 - $1000', min: 600, max: 1000 },
  { value: '1000+', label: '$1000+', min: 1000, max: Infinity },
];

// ============ PROMOTIONS (tech-themed) ============
export const promotions = [
  { id: 1, title: 'PC Build Season', subtitle: 'Up to 15% off on CPU & GPU', code: 'BUILD15', bgColor: 'from-blue-500 to-blue-700', textColor: 'white' },
  { id: 2, title: 'Free Shipping', subtitle: 'On orders over $199', code: 'FREESHIP', bgColor: 'from-blue-600 to-indigo-600', textColor: 'white' },
  { id: 3, title: 'AI Ready Components', subtitle: 'Optimize your AI workflow', code: null, bgColor: 'from-slate-700 to-slate-900', textColor: 'white' },
];

// ============ REVIEWS (mock for product detail) ============
export const reviews = [
  { id: 1, productId: 1, userName: 'TechUser', userAvatar: img('av1', 100, 100), rating: 5, title: 'Excellent CPU', content: 'Perfect for gaming and streaming. No thermal throttling.', comment: 'Perfect for gaming and streaming. No thermal throttling.', date: '2024-01-15', helpful: 12, verified: true, images: [] },
  { id: 2, productId: 1, userName: 'Builder Pro', userAvatar: img('av2', 100, 100), rating: 4, title: 'Great performance', content: 'Handles everything I throw at it.', comment: 'Handles everything I throw at it.', date: '2024-01-10', helpful: 8, verified: true, images: [] },
  { id: 3, productId: 3, userName: 'GamerX', userAvatar: img('av3', 100, 100), rating: 5, title: 'Beast GPU', content: '4K gaming at max settings. Worth every penny.', comment: '4K gaming at max settings. Worth every penny.', date: '2024-01-08', helpful: 25, verified: true, images: [] },
  { id: 4, productId: 7, userName: 'DataSci', userAvatar: img('av4', 100, 100), rating: 5, title: 'Fast storage', content: 'Perfect for AI datasets. Lightning fast transfers.', comment: 'Perfect for AI datasets. Lightning fast transfers.', date: '2024-01-05', helpful: 15, verified: true, images: [] },
];

// ============ COUPONS (matches coupons table) ============
export const coupons = [
  { id: 1, code: 'BUILD15', name: 'PC Build 15% Off', discount_type: 'percent', discount_value: 15, min_order_value: 300, max_discount: 100, usage_limit: 100, usage_count: 12, status: 1 },
  { id: 2, code: 'FREESHIP', name: 'Free Shipping', discount_type: 'fixed', discount_value: 9.99, min_order_value: 50, max_discount: 9.99, usage_limit: 500, usage_count: 89, status: 1 },
  { id: 3, code: 'SAVE50', name: 'Save $50', discount_type: 'fixed', discount_value: 50, min_order_value: 500, max_discount: 50, usage_limit: 50, usage_count: 5, status: 1 },
  { id: 4, code: 'WELCOME10', name: 'New Member 10%', discount_type: 'percent', discount_value: 10, min_order_value: 100, max_discount: 30, usage_limit: 1, usage_count: 0, status: 1 },
  { id: 5, code: 'VIP20', name: 'VIP 20% Off', discount_type: 'percent', discount_value: 20, min_order_value: 1000, max_discount: 200, usage_limit: 20, usage_count: 20, status: 1 },
  { id: 6, code: 'FLAT25', name: 'Flat $25 Off', discount_type: 'fixed', discount_value: 25, min_order_value: 150, max_discount: null, usage_limit: 200, usage_count: 45, status: 1 },
  { id: 7, code: 'EXPIRED', name: 'Expired Coupon', discount_type: 'percent', discount_value: 50, min_order_value: 0, max_discount: null, usage_limit: 10, usage_count: 10, status: 0 },
];

// ============ USER ADDRESSES (for members - matches user_addresses table) ============
export const userAddresses = [
  {
    id: 1,
    user_id: 1,
    recipient: 'Nguyễn Đình Linh',
    phone: '0912892178',
    line1: '123 Nguyễn Huệ',
    line2: 'P. Bến Nghé',
    ward: 'Phường 1',
    district: 'Quận 1',
    province: 'TP. Hồ Chí Minh',
    country: 'Vietnam',
    postal_code: '700000',
    is_default: true,
  },
  {
    id: 2,
    user_id: 1,
    recipient: 'Nguyễn Đình Linh',
    phone: '0912892178',
    line1: '456 Lê Lợi',
    line2: null,
    ward: 'Phường Bến Thành',
    district: 'Quận 1',
    province: 'TP. Hồ Chí Minh',
    country: 'Vietnam',
    postal_code: '700001',
    is_default: false,
  },
];

// ============ ORDERS (mock for account) ============
export const orders = [
  { id: 'ORD-2024-001', date: '2024-01-20', status: 'Delivered', statusColor: 'success', total: 759.98, items: products.slice(0, 2) },
  { id: 'ORD-2024-002', date: '2024-01-18', status: 'In Transit', statusColor: 'primary', total: 549.99, items: products.slice(2, 3) },
];
