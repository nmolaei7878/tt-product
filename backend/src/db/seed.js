const { faker } = require('@faker-js/faker');
const { initDatabase, getDatabase } = require('./database');

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Books',
  'Home & Garden',
  'Sports & Outdoors',
  'Toys & Games',
  'Beauty & Personal Care',
  'Automotive',
  'Office Supplies',
  'Pet Supplies',
  'Health & Wellness'
];

const CATEGORY_PREFIXES = {
  'Electronics': 'ELC',
  'Clothing': 'CLO',
  'Food & Beverages': 'FOD',
  'Books': 'BOK',
  'Home & Garden': 'HOM',
  'Sports & Outdoors': 'SPT',
  'Toys & Games': 'TOY',
  'Beauty & Personal Care': 'BEA',
  'Automotive': 'AUT',
  'Office Supplies': 'OFF',
  'Pet Supplies': 'PET',
  'Health & Wellness': 'HEA'
};

function generateSuppliers(count = 50) {
  const suppliers = new Set();
  
  while (suppliers.size < count) {
    const type = faker.helpers.arrayElement([
      'company',
      'companyWithIndustry',
      'international'
    ]);
    
    let supplierName;
    if (type === 'company') {
      supplierName = faker.company.name();
    } else if (type === 'companyWithIndustry') {
      supplierName = `${faker.company.name()} ${faker.helpers.arrayElement(['Inc', 'Corp', 'Ltd', 'LLC', 'Co'])}`;
    } else {
      supplierName = `${faker.location.country()} ${faker.helpers.arrayElement(['Imports', 'Exports', 'Trading', 'Supply'])}`;
    }
    
    suppliers.add(supplierName);
  }
  
  return Array.from(suppliers);
}

function generateProductName(category) {
  const productTypes = {
    'Electronics': () => {
      const items = [
        `${faker.company.name()} ${faker.number.int({ min: 15, max: 85 })}-inch ${faker.helpers.arrayElement(['4K', 'HD', 'OLED'])} ${faker.helpers.arrayElement(['Smart TV', 'Monitor', 'Display'])}`,
        `${faker.helpers.arrayElement(['Wireless', 'Bluetooth', 'USB'])} ${faker.helpers.arrayElement(['Headphones', 'Earbuds', 'Speaker'])}`,
        `${faker.company.name()} ${faker.helpers.arrayElement(['Laptop', 'Tablet', 'Smartphone'])} ${faker.helpers.arrayElement(['Pro', 'Plus', 'Ultra'])}`,
        `${faker.helpers.arrayElement(['Smart', 'Digital', 'LED'])} ${faker.helpers.arrayElement(['Watch', 'Camera', 'Keyboard'])}`,
        `${faker.number.int({ min: 500, max: 5000 })}W ${faker.helpers.arrayElement(['Power Bank', 'Charger', 'Adapter'])}`
      ];
      return faker.helpers.arrayElement(items);
    },
    'Clothing': () => {
      const items = [
        `${faker.helpers.arrayElement(['Cotton', 'Silk', 'Wool', 'Polyester'])} ${faker.helpers.arrayElement(['Shirt', 'Pants', 'Dress', 'Jacket'])}`,
        `${faker.helpers.arrayElement(['Men\'s', 'Women\'s', 'Unisex'])} ${faker.helpers.arrayElement(['Casual', 'Formal', 'Sports'])} ${faker.helpers.arrayElement(['T-Shirt', 'Jeans', 'Sneakers'])}`,
        `${faker.color.human()} ${faker.helpers.arrayElement(['Winter', 'Summer', 'All-Season'])} ${faker.helpers.arrayElement(['Coat', 'Sweater', 'Hoodie'])}`,
        `${faker.helpers.arrayElement(['Designer', 'Premium', 'Classic'])} ${faker.helpers.arrayElement(['Suit', 'Blazer', 'Skirt'])}`
      ];
      return faker.helpers.arrayElement(items);
    },
    'Food & Beverages': () => {
      const items = [
        `Organic ${faker.helpers.arrayElement(['Green', 'Black', 'Herbal'])} Tea ${faker.number.int({ min: 20, max: 200 })} Bags`,
        `${faker.helpers.arrayElement(['Premium', 'Artisan', 'Gourmet'])} ${faker.helpers.arrayElement(['Coffee', 'Chocolate', 'Cookies'])} ${faker.number.int({ min: 100, max: 1000 })}g`,
        `${faker.helpers.arrayElement(['Fresh', 'Natural', 'Pure'])} ${faker.helpers.arrayElement(['Orange', 'Apple', 'Grape'])} Juice ${faker.number.int({ min: 1, max: 5 })}L`,
        `${faker.helpers.arrayElement(['Whole Grain', 'Multigrain', 'Wheat'])} ${faker.helpers.arrayElement(['Bread', 'Cereal', 'Pasta'])}`,
        `${faker.helpers.arrayElement(['Dark', 'Milk', 'White'])} Chocolate Bar ${faker.number.int({ min: 50, max: 500 })}g`
      ];
      return faker.helpers.arrayElement(items);
    },
    'Books': () => {
      const items = [
        `${faker.helpers.arrayElement(['The Art of', 'Mastering', 'Complete Guide to'])} ${faker.helpers.arrayElement(['Programming', 'Design', 'Marketing', 'Leadership'])}`,
        `${faker.person.firstName()}'s ${faker.helpers.arrayElement(['Adventure', 'Journey', 'Story', 'Tale'])}`,
        `${faker.helpers.arrayElement(['Modern', 'Classical', 'Contemporary'])} ${faker.helpers.arrayElement(['Fiction', 'Poetry', 'Drama'])} Collection`,
        `${faker.helpers.arrayElement(['Business', 'Self-Help', 'Cooking', 'Travel'])} ${faker.helpers.arrayElement(['Handbook', 'Manual', 'Encyclopedia'])}`
      ];
      return faker.helpers.arrayElement(items);
    },
    'Home & Garden': () => {
      const items = [
        `${faker.helpers.arrayElement(['Stainless Steel', 'Ceramic', 'Glass'])} ${faker.helpers.arrayElement(['Cookware', 'Dinnerware', 'Bakeware'])} Set`,
        `${faker.helpers.arrayElement(['Electric', 'Manual', 'Automatic'])} ${faker.helpers.arrayElement(['Lawn Mower', 'Trimmer', 'Blower'])}`,
        `${faker.number.int({ min: 3, max: 12 })}-Piece ${faker.helpers.arrayElement(['Kitchen', 'Bathroom', 'Bedroom'])} ${faker.helpers.arrayElement(['Furniture', 'Organizer', 'Storage'])} Set`,
        `${faker.helpers.arrayElement(['LED', 'Solar', 'Smart'])} ${faker.helpers.arrayElement(['Garden', 'Patio', 'Outdoor'])} Lighting`
      ];
      return faker.helpers.arrayElement(items);
    },
    'Sports & Outdoors': () => {
      const items = [
        `${faker.helpers.arrayElement(['Professional', 'Premium', 'Pro-Grade'])} ${faker.helpers.arrayElement(['Basketball', 'Football', 'Soccer Ball', 'Tennis Racket'])}`,
        `${faker.helpers.arrayElement(['Camping', 'Hiking', 'Backpacking'])} ${faker.helpers.arrayElement(['Tent', 'Backpack', 'Sleeping Bag'])}`,
        `${faker.helpers.arrayElement(['Yoga', 'Exercise', 'Fitness'])} ${faker.helpers.arrayElement(['Mat', 'Weights', 'Resistance Bands'])} Set`,
        `${faker.number.int({ min: 2, max: 10 })}-Person ${faker.helpers.arrayElement(['Kayak', 'Canoe', 'Inflatable Boat'])}`
      ];
      return faker.helpers.arrayElement(items);
    },
    'Toys & Games': () => {
      const items = [
        `${faker.helpers.arrayElement(['Educational', 'Interactive', 'Electronic'])} ${faker.helpers.arrayElement(['Building', 'Learning', 'Puzzle'])} Set`,
        `${faker.number.int({ min: 100, max: 5000 })}-Piece ${faker.helpers.arrayElement(['Jigsaw', 'Brain', '3D'])} Puzzle`,
        `${faker.helpers.arrayElement(['Classic', 'Modern', 'Vintage'])} ${faker.helpers.arrayElement(['Board Game', 'Card Game', 'Strategy Game'])}`,
        `Remote Control ${faker.helpers.arrayElement(['Car', 'Drone', 'Robot', 'Helicopter'])}`
      ];
      return faker.helpers.arrayElement(items);
    },
    'Beauty & Personal Care': () => {
      const items = [
        `${faker.helpers.arrayElement(['Organic', 'Natural', 'Herbal'])} ${faker.helpers.arrayElement(['Shampoo', 'Conditioner', 'Body Wash'])} ${faker.number.int({ min: 200, max: 1000 })}ml`,
        `${faker.helpers.arrayElement(['Anti-Aging', 'Moisturizing', 'Hydrating'])} ${faker.helpers.arrayElement(['Cream', 'Serum', 'Lotion'])}`,
        `${faker.helpers.arrayElement(['Professional', 'Salon-Quality', 'Premium'])} ${faker.helpers.arrayElement(['Hair Dryer', 'Straightener', 'Curling Iron'])}`,
        `${faker.helpers.arrayElement(['Vitamin C', 'Collagen', 'Retinol'])} ${faker.helpers.arrayElement(['Facial', 'Eye', 'Night'])} Cream`
      ];
      return faker.helpers.arrayElement(items);
    },
    'Automotive': () => {
      const items = [
        `${faker.helpers.arrayElement(['All-Season', 'Winter', 'Summer'])} ${faker.helpers.arrayElement(['Tire', 'Tire Set', 'Wheel'])} ${faker.number.int({ min: 15, max: 22 })}-inch`,
        `${faker.helpers.arrayElement(['Synthetic', 'Conventional', 'High-Performance'])} Motor Oil ${faker.number.int({ min: 1, max: 5 })}L`,
        `${faker.helpers.arrayElement(['LED', 'HID', 'Halogen'])} ${faker.helpers.arrayElement(['Headlight', 'Taillight', 'Fog Light'])} Set`,
        `${faker.helpers.arrayElement(['Leather', 'Fabric', 'Neoprene'])} Car Seat Covers Set`
      ];
      return faker.helpers.arrayElement(items);
    },
    'Office Supplies': () => {
      const items = [
        `${faker.helpers.arrayElement(['Wireless', 'Mechanical', 'Ergonomic'])} ${faker.helpers.arrayElement(['Keyboard', 'Mouse', 'Keyboard & Mouse'])} Combo`,
        `${faker.number.int({ min: 100, max: 1000 })}-Sheet ${faker.helpers.arrayElement(['Premium', 'Recycled', 'Colored'])} ${faker.helpers.arrayElement(['Paper', 'Cardstock', 'Notebook'])}`,
        `${faker.helpers.arrayElement(['Executive', 'Professional', 'Modern'])} ${faker.helpers.arrayElement(['Desk', 'Chair', 'Filing Cabinet'])}`,
        `${faker.helpers.arrayElement(['Laser', 'Inkjet', 'All-in-One'])} ${faker.helpers.arrayElement(['Printer', 'Scanner', 'Copier'])}`
      ];
      return faker.helpers.arrayElement(items);
    },
    'Pet Supplies': () => {
      const items = [
        `${faker.helpers.arrayElement(['Premium', 'Organic', 'Natural'])} ${faker.helpers.arrayElement(['Dog', 'Cat', 'Bird'])} Food ${faker.number.int({ min: 1, max: 20 })}kg`,
        `${faker.helpers.arrayElement(['Interactive', 'Plush', 'Chew'])} ${faker.helpers.arrayElement(['Dog', 'Cat'])} Toy Set`,
        `${faker.helpers.arrayElement(['Automatic', 'Self-Cleaning', 'Designer'])} ${faker.helpers.arrayElement(['Litter Box', 'Feeder', 'Water Fountain'])}`,
        `${faker.helpers.arrayElement(['Comfortable', 'Orthopedic', 'Heated'])} Pet ${faker.helpers.arrayElement(['Bed', 'Mat', 'Cushion'])}`
      ];
      return faker.helpers.arrayElement(items);
    },
    'Health & Wellness': () => {
      const items = [
        `${faker.helpers.arrayElement(['Vitamin', 'Protein', 'Collagen'])} ${faker.helpers.arrayElement(['Supplement', 'Powder', 'Capsules'])} ${faker.number.int({ min: 30, max: 180 })} Count`,
        `${faker.helpers.arrayElement(['Digital', 'Automatic', 'Smart'])} ${faker.helpers.arrayElement(['Blood Pressure Monitor', 'Thermometer', 'Scale'])}`,
        `${faker.helpers.arrayElement(['Essential', 'Aromatherapy', 'Massage'])} Oil ${faker.helpers.arrayElement(['Set', 'Kit', 'Collection'])}`,
        `${faker.helpers.arrayElement(['Fitness', 'Activity', 'Heart Rate'])} Tracker ${faker.helpers.arrayElement(['Watch', 'Band', 'Monitor'])}`
      ];
      return faker.helpers.arrayElement(items);
    }
  };

  return productTypes[category]();
}

function generateDescription(productName, category) {
  const templates = [
    `High-quality ${productName.toLowerCase()} perfect for ${faker.helpers.arrayElement(['everyday use', 'professional use', 'home and office', 'any occasion'])}. ${faker.helpers.arrayElement(['Features durable construction', 'Made with premium materials', 'Designed for maximum comfort', 'Built to last'])} and ${faker.helpers.arrayElement(['exceptional performance', 'outstanding quality', 'superior functionality', 'reliable operation'])}.`,
    `Premium ${productName.toLowerCase()} designed with ${faker.helpers.arrayElement(['cutting-edge technology', 'innovative features', 'modern design', 'user convenience'])} in mind. ${faker.helpers.arrayElement(['Ideal for', 'Perfect for', 'Great for', 'Excellent for'])} both ${faker.helpers.arrayElement(['beginners and professionals', 'personal and commercial use', 'indoor and outdoor use', 'home and travel'])}.`,
    `Experience ${faker.helpers.arrayElement(['superior quality', 'exceptional value', 'outstanding performance', 'unmatched durability'])} with this ${productName.toLowerCase()}. ${faker.helpers.arrayElement(['Trusted by thousands', 'Highly rated by customers', 'Recommended by experts', 'Best-selling product'])} and ${faker.helpers.arrayElement(['backed by warranty', 'built to exceed expectations', 'designed to impress', 'crafted with care'])}.`
  ];
  
  const description = faker.helpers.arrayElement(templates);
  return description.length > 500 ? description.substring(0, 497) + '...' : description;
}

function generateTags(category, productName) {
  const categoryTags = {
    'Electronics': ['technology', 'digital', 'smart', 'wireless', 'portable', 'rechargeable', 'HD', '4K', 'bluetooth'],
    'Clothing': ['fashion', 'comfortable', 'stylish', 'casual', 'formal', 'cotton', 'premium', 'designer'],
    'Food & Beverages': ['organic', 'natural', 'fresh', 'healthy', 'gourmet', 'premium', 'tasty', 'nutritious'],
    'Books': ['bestseller', 'educational', 'inspiring', 'fiction', 'non-fiction', 'classic', 'modern', 'hardcover'],
    'Home & Garden': ['durable', 'decorative', 'functional', 'eco-friendly', 'modern', 'classic', 'space-saving'],
    'Sports & Outdoors': ['athletic', 'durable', 'professional', 'lightweight', 'waterproof', 'outdoor', 'fitness'],
    'Toys & Games': ['fun', 'educational', 'safe', 'interactive', 'creative', 'family', 'entertaining'],
    'Beauty & Personal Care': ['natural', 'organic', 'hypoallergenic', 'moisturizing', 'gentle', 'premium', 'salon-quality'],
    'Automotive': ['reliable', 'high-performance', 'durable', 'all-season', 'quality', 'certified', 'professional'],
    'Office Supplies': ['professional', 'efficient', 'organized', 'ergonomic', 'quality', 'essential', 'practical'],
    'Pet Supplies': ['safe', 'natural', 'healthy', 'comfortable', 'durable', 'fun', 'veterinarian-recommended'],
    'Health & Wellness': ['natural', 'effective', 'safe', 'clinically-tested', 'wellness', 'health', 'premium']
  };

  const baseTags = categoryTags[category] || ['quality', 'popular', 'recommended'];
  const selectedTags = faker.helpers.arrayElements(baseTags, faker.number.int({ min: 2, max: 5 }));
  
  if (productName.toLowerCase().includes('premium') || productName.toLowerCase().includes('professional')) {
    selectedTags.push('premium');
  }
  
  return [...new Set(selectedTags)].slice(0, 5);
}

function generateRealisticPrice(category) {
  const priceRanges = {
    'Electronics': { min: 19.99, max: 3999.99, sweet: [50, 500] },
    'Clothing': { min: 9.99, max: 499.99, sweet: [20, 150] },
    'Food & Beverages': { min: 0.99, max: 99.99, sweet: [5, 30] },
    'Books': { min: 4.99, max: 199.99, sweet: [10, 40] },
    'Home & Garden': { min: 14.99, max: 1999.99, sweet: [30, 300] },
    'Sports & Outdoors': { min: 9.99, max: 2999.99, sweet: [25, 250] },
    'Toys & Games': { min: 4.99, max: 299.99, sweet: [15, 80] },
    'Beauty & Personal Care': { min: 3.99, max: 299.99, sweet: [10, 60] },
    'Automotive': { min: 19.99, max: 9999.99, sweet: [50, 500] },
    'Office Supplies': { min: 2.99, max: 1999.99, sweet: [10, 100] },
    'Pet Supplies': { min: 4.99, max: 299.99, sweet: [15, 80] },
    'Health & Wellness': { min: 9.99, max: 499.99, sweet: [20, 100] }
  };

  const range = priceRanges[category] || { min: 10, max: 500, sweet: [20, 100] };
  
  const inSweetSpot = Math.random() < 0.7;
  
  let price;
  if (inSweetSpot) {
    price = faker.number.float({ min: range.sweet[0], max: range.sweet[1], multipleOf: 0.01 });
  } else {
    price = faker.number.float({ min: range.min, max: range.max, multipleOf: 0.01 });
  }
  
  return Math.round(price * 100) / 100;
}

function generateSKU(category, existingSKUs) {
  const prefix = CATEGORY_PREFIXES[category];
  let sku;
  let attempts = 0;
  
  do {
    const number = faker.number.int({ min: 1000, max: 9999 });
    sku = `${prefix}-${number}`;
    attempts++;
    
    if (attempts > 100) {
      const randomNumber = faker.number.int({ min: 10000, max: 99999 });
      sku = `${prefix}-${randomNumber}`.substring(0, 8);
      break;
    }
  } while (existingSKUs.has(sku));
  
  existingSKUs.add(sku);
  return sku;
}

function generateProduct(category, suppliers, existingSKUs) {
  const productName = generateProductName(category);
  const sku = generateSKU(category, existingSKUs);
  const description = generateDescription(productName, category);
  const price = generateRealisticPrice(category);
  
  const hasCostPrice = Math.random() < 0.3;
  const costPrice = hasCostPrice 
    ? Math.round(price * faker.number.float({ min: 0.70, max: 0.90, multipleOf: 0.01 }) * 100) / 100
    : null;
  
  const statusRoll = Math.random();
  let status;
  if (statusRoll < 0.70) status = 'Active';
  else if (statusRoll < 0.90) status = 'Inactive';
  else status = 'Discontinued';
  
  const isOutOfStock = Math.random() < 0.05;
  const stockQuantity = isOutOfStock 
    ? 0 
    : faker.number.int({ min: 1, max: 10000 });
  
  const hasReorderLevel = stockQuantity > 0 && Math.random() < 0.4;
  const reorderLevel = hasReorderLevel
    ? faker.number.int({ min: 0, max: Math.max(1, Math.floor(stockQuantity * 0.3)) })
    : null;
  
  const tags = generateTags(category, productName);
  const supplier = faker.helpers.arrayElement(suppliers);
  
  const hasNotes = Math.random() < 0.2;
  const notes = hasNotes ? faker.helpers.arrayElement([
    'Popular item - restocks quickly',
    'Seasonal availability',
    'Limited edition',
    'Bulk discounts available',
    'New arrival',
    'Clearance item',
    'Customer favorite',
    'Trending product'
  ]) : null;
  
  const daysAgo = faker.number.int({ min: 0, max: 730 });
  const lastUpdated = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  
  const createdDaysAgo = faker.number.int({ min: daysAgo, max: 730 });
  const createdAt = new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1000).toISOString();

  return {
    product_name: productName,
    sku,
    category,
    description,
    price,
    cost_price: costPrice,
    stock_quantity: stockQuantity,
    reorder_level: reorderLevel,
    status,
    tags: JSON.stringify(tags),
    supplier,
    notes,
    last_updated: lastUpdated,
    created_at: createdAt
  };
}

function seedDatabase() {
  console.log(`[${new Date().toISOString()}] [INFO] Starting database seeding...`);
  
  const db = initDatabase();
  
  const existingProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (existingProducts.count > 0) {
    console.log(`[${new Date().toISOString()}] [INFO] Database already seeded with ${existingProducts.count} products. Skipping seed.`);
    return;
  }

  db.prepare('DELETE FROM products').run();
  db.prepare('DELETE FROM categories').run();
  db.prepare('DELETE FROM suppliers').run();

  const insertCategory = db.prepare('INSERT INTO categories (name) VALUES (?)');
  CATEGORIES.forEach(category => {
    insertCategory.run(category);
  });
  console.log(`[${new Date().toISOString()}] [INFO] Seeded ${CATEGORIES.length} categories`);

  const suppliers = generateSuppliers(50);
  const insertSupplier = db.prepare('INSERT INTO suppliers (name) VALUES (?)');
  suppliers.forEach(supplier => {
    insertSupplier.run(supplier);
  });
  console.log(`[${new Date().toISOString()}] [INFO] Seeded ${suppliers.length} suppliers`);

  const insertProduct = db.prepare(`
    INSERT INTO products (
      product_name, sku, category, description, price, cost_price,
      stock_quantity, reorder_level, status, tags, supplier, notes,
      last_updated, created_at
    ) VALUES (
      @product_name, @sku, @category, @description, @price, @cost_price,
      @stock_quantity, @reorder_level, @status, @tags, @supplier, @notes,
      @last_updated, @created_at
    )
  `);

  const existingSKUs = new Set();
  const insertMany = db.transaction((products) => {
    for (const product of products) {
      insertProduct.run(product);
    }
  });

  const products = [];
  for (let i = 0; i < 1000; i++) {
    const category = faker.helpers.arrayElement(CATEGORIES);
    const product = generateProduct(category, suppliers, existingSKUs);
    products.push(product);
  }

  insertMany(products);
  
  console.log(`[${new Date().toISOString()}] [INFO] Successfully seeded 1000 products`);
  console.log(`[${new Date().toISOString()}] [INFO] Database seeding completed`);
  
  db.close();
}

function resetDatabase() {
  console.log(`[${new Date().toISOString()}] [INFO] Resetting database...`);
  
  const db = getDatabase();
  
  db.prepare('DELETE FROM products').run();
  db.prepare('DELETE FROM categories').run();
  db.prepare('DELETE FROM suppliers').run();
  
  db.close();
  
  seedDatabase();
  
  console.log(`[${new Date().toISOString()}] [INFO] Database reset completed`);
}

if (require.main === module) {
  require('dotenv').config();
  seedDatabase();
}

module.exports = { seedDatabase, resetDatabase };

