const fs = require('fs');
const path = require('path');

// Helper to get random item from array
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to get random number in range
const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to get random float in range (for ratings)
const randomFloat = (min, max, decimals = 1) => {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
};

const brands = {
  smartphones: ['Apple', 'Samsung', 'Google', 'Xiaomi', 'OnePlus', 'Asus', 'Sony', 'Oppo', 'Vivo', 'Realme'],
  tablets: ['Apple', 'Samsung', 'Google', 'Xiaomi', 'Lenovo', 'Huawei'],
  wearables: ['Apple', 'Samsung', 'Google', 'Xiaomi', 'Garmin', 'Fitbit', 'HUAWEI'],
  audio: ['Apple', 'Sony', 'Bose', 'JBL', 'Sennheiser', 'Anker', 'Beats', 'Samsung'],
  accessories: ['Anker', 'Spigen', 'Ugreen', 'Belkin', 'Spigen', 'Baseus', 'Apple', 'Samsung']
};

const colors = [
  'Titanium Gray', 'Space Black', 'Silver', 'Deep Blue', 'Midnight Green', 
  'Charcoal', 'Obsidian', 'Porcelain', 'Cream', 'Graphite', 'Olive', 
  'Rose Gold', 'Sunset Gold', 'Emerald Green', 'Lilac', 'Starlight', 'Sky Blue'
];

const phoneSpecs = {
  processors: {
    Apple: ['A17 Pro Bionic', 'A16 Bionic', 'A15 Bionic'],
    Samsung: ['Snapdragon 8 Gen 3', 'Exynos 2400', 'Snapdragon 8 Gen 2', 'Snapdragon 7+ Gen 2'],
    Google: ['Tensor G3', 'Tensor G2'],
    Asus: ['Snapdragon 8 Gen 3', 'Snapdragon 8 Gen 2'],
    Xiaomi: ['Snapdragon 8 Gen 3', 'MediaTek Dimensity 9300', 'Snapdragon 7+ Gen 3'],
    OnePlus: ['Snapdragon 8 Gen 3', 'Snapdragon 8 Gen 2', 'Snapdragon 7+ Gen 3'],
    Sony: ['Snapdragon 8 Gen 3', 'Snapdragon 8 Gen 2'],
    Oppo: ['MediaTek Dimensity 9200', 'Snapdragon 8 Gen 2'],
    Vivo: ['MediaTek Dimensity 9300', 'Snapdragon 8 Gen 2'],
    Realme: ['Snapdragon 8 Gen 2', 'Snapdragon 7+ Gen 2']
  },
  ram: ['8GB', '12GB', '16GB', '24GB'],
  storage: ['128GB', '256GB', '512GB', '1TB'],
  screens: ['6.1" OLED, 120Hz', '6.7" LTPO AMOLED, 120Hz', '6.8" Dynamic AMOLED 2X, 120Hz', '6.2" OLED, 120Hz', '6.5" OLED, 120Hz'],
  batteries: ['4300mAh, 25W charging', '4500mAh, 30W charging', '5000mAh, 45W charging', '5000mAh, 80W charging', '5400mAh, 100W charging'],
  cameras: ['48MP Main + 12MP UltraWide + 12MP Telephoto', '200MP Main + 50MP Periscope + 12MP UltraWide', '50MP Main + 48MP UltraWide + 48MP Telephoto', '50MP Dual Camera System', '64MP Triple Camera System']
};

const tabletSpecs = {
  processors: {
    Apple: ['M2 Chip', 'M1 Chip', 'A14 Bionic'],
    Samsung: ['Snapdragon 8 Gen 2', 'Snapdragon 8+ Gen 1', 'Exynos 1380'],
    Google: ['Tensor G2'],
    Xiaomi: ['Snapdragon 870', 'Snapdragon 8+ Gen 1'],
    Lenovo: ['MediaTek Kompanio 900T', 'Snapdragon 870'],
    Huawei: ['Kirin 9000S']
  },
  ram: ['6GB', '8GB', '12GB', '16GB'],
  storage: ['64GB', '128GB', '256GB', '512GB', '1TB'],
  screens: ['11.0" IPS LCD, 120Hz', '12.4" Super AMOLED, 120Hz', '10.9" Liquid Retina', '11.5" PaperMatte Display', '12.9" Liquid Retina XDR'],
  batteries: ['7040mAh, 15W', '8000mAh, 33W', '10090mAh, 45W', '7600mAh, 20W', '10000mAh, 67W']
};

const wearablesSpecs = {
  sensors: ['Heart Rate, SpO2, ECG, Temp', 'Heart Rate, GPS, Step Tracker', 'Heart Rate, Sleep Tracker, GPS', 'Heart Rate, Blood Pressure, ECG, BIA'],
  batteries: ['Up to 18 hours', 'Up to 40 hours', 'Up to 7 days', 'Up to 14 days', 'Up to 21 days'],
  materials: ['Aluminum Case, Sport Band', 'Titanium Case, Ocean Band', 'Stainless Steel, Leather Band', 'Armor Aluminum, Sport Band']
};

const audioSpecs = {
  types: ['In-Ear TWS', 'Over-Ear ANC', 'On-Ear Wireless', 'Neckband Sport'],
  batteries: ['Up to 6 hours (24h with case)', 'Up to 8 hours (32h with case)', 'Up to 30 hours (ANC ON)', 'Up to 40 hours', 'Up to 50 hours'],
  waterproof: ['IPX4', 'IPX7', 'IP54', 'IP67', 'Not Rated']
};

const accessoriesSpecs = {
  types: ['GaN Fast Charger', 'MagSafe Power Bank', 'USB-C Braided Cable', 'Armor Case', 'Tempered Glass Screen Protector', '3-in-1 Charging Stand', 'Active Stylus Pen', 'Car Mount Charger']
};

// Generate realistic details for a product
function generateProduct(id, category, brandIndex, modelIndex) {
  const brand = brands[category][brandIndex % brands[category].length];
  
  let name = '';
  let price = 0;
  let description = '';
  const specs = {};
  const productColors = [randomItem(colors), randomItem(colors)];
  let storage = undefined;
  
  if (category === 'smartphones') {
    // Generate smartphone names
    const series = {
      Apple: ['iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14', 'iPhone SE'],
      Samsung: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy A55', 'Galaxy Z Fold 5', 'Galaxy Z Flip 5'],
      Google: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Pixel Fold'],
      Asus: ['ROG Phone 8 Pro', 'Zenfone 11 Ultra', 'ROG Phone 7 Ultimate'],
      Xiaomi: ['Xiaomi 14 Ultra', 'Xiaomi 14', 'Redmi Note 13 Pro', 'POCO F6 Pro'],
      OnePlus: ['OnePlus 12', 'OnePlus 12R', 'OnePlus Nord 4'],
      Sony: ['Xperia 1 VI', 'Xperia 5 V', 'Xperia 10 VI'],
      Oppo: ['Find X7 Ultra', 'Reno 11 Pro', 'Find N3 Flip'],
      Vivo: ['X100 Pro', 'V30 Pro', 'Y100'],
      Realme: ['GT 5 Pro', '12 Pro+ 5G', 'C67']
    };
    
    const baseSeries = series[brand][modelIndex % series[brand].length];
    // Add variations like color/storage/spec combinations or just generation indexes
    const suffix = modelIndex >= series[brand].length ? ` Gen ${Math.floor(modelIndex / series[brand].length) + 1}` : '';
    name = `${brand} ${baseSeries}${suffix}`;
    
    // Determine price based on brand and tier
    if (name.includes('Pro') || name.includes('Ultra') || name.includes('Fold') || name.includes('VI')) {
      price = randomRange(12000000, 26000000); // 12m - 26m IDR
    } else if (name.includes('Lite') || name.includes('Redmi') || name.includes('Y100') || name.includes('C67') || name.includes('SE')) {
      price = randomRange(2500000, 6000000); // 2.5m - 6m IDR
    } else {
      price = randomRange(7000000, 12000000); // 7m - 12m IDR
    }
    
    const brandProcessors = phoneSpecs.processors[brand] || ['Octa-core Processor'];
    specs.Processor = randomItem(brandProcessors);
    specs.RAM = randomItem(phoneSpecs.ram);
    specs.Storage = randomItem(phoneSpecs.storage);
    specs.Screen = randomItem(phoneSpecs.screens);
    specs.Battery = randomItem(phoneSpecs.batteries);
    specs.Camera = randomItem(phoneSpecs.cameras);
    storage = ['128GB', '256GB', '512GB', '1TB'].slice(0, randomRange(2, 4));
    
    description = `Experience cutting-edge mobile technology with the ${name}. Equipped with a premium ${specs.Processor}, ${specs.Screen} display, and advanced ${specs.Camera} to capture every moment in stunning detail. Designed for power, elegance, and durability.`;
    
  } else if (category === 'tablets') {
    const series = {
      Apple: ['iPad Pro 12.9', 'iPad Air', 'iPad mini', 'iPad 10th Gen'],
      Samsung: ['Galaxy Tab S9 Ultra', 'Galaxy Tab S9 FE', 'Galaxy Tab A9'],
      Google: ['Pixel Tablet'],
      Xiaomi: ['Pad 6 Max', 'Pad 6 Pro', 'Redmi Pad SE'],
      Lenovo: ['Tab P12', 'Tab M10 Plus'],
      Huawei: ['MatePad Pro 11', 'MatePad 11.5']
    };
    
    const baseSeries = series[brand][modelIndex % series[brand].length];
    const suffix = modelIndex >= series[brand].length ? ` (${Math.floor(modelIndex / series[brand].length) + 2024})` : '';
    name = `${brand} ${baseSeries}${suffix}`;
    
    if (name.includes('Pro') || name.includes('Ultra')) {
      price = randomRange(11000000, 22000000);
    } else if (name.includes('SE') || name.includes('A9') || name.includes('M10')) {
      price = randomRange(2000000, 5000000);
    } else {
      price = randomRange(5500000, 10500000);
    }
    
    const brandProcessors = tabletSpecs.processors[brand] || ['High-speed Tablet Processor'];
    specs.Processor = randomItem(brandProcessors);
    specs.RAM = randomItem(tabletSpecs.ram);
    specs.Storage = randomItem(tabletSpecs.storage);
    specs.Screen = randomItem(tabletSpecs.screens);
    specs.Battery = randomItem(tabletSpecs.batteries);
    specs.Connectivity = randomItem(['Wi-Fi Only', 'Wi-Fi + 5G Cellular']);
    storage = ['64GB', '128GB', '256GB', '512GB'].slice(0, randomRange(2, 4));
    
    description = `Elevate your digital canvas and productivity with the ${name}. Featuring a stunning ${specs.Screen} screen and powered by the robust ${specs.Processor}. Perfect for creatives, students, and professionals alike.`;
    
  } else if (category === 'wearables') {
    const series = {
      Apple: ['Watch Ultra 2', 'Watch Series 9', 'Watch SE'],
      Samsung: ['Watch 6 Classic', 'Watch 6', 'Watch Fit 3'],
      Google: ['Pixel Watch 2', 'Pixel Watch'],
      Xiaomi: ['Watch S3', 'Smart Band 8 Pro', 'Redmi Watch 4'],
      Garmin: ['Fenix 7X Pro', 'Venu 3', 'Forerunner 265'],
      Fitbit: ['Sense 2', 'Versa 4', 'Charge 6'],
      HUAWEI: ['Watch GT 4', 'Watch Fit 3', 'Band 9']
    };
    
    const baseSeries = series[brand][modelIndex % series[brand].length];
    const suffix = modelIndex >= series[brand].length ? ` Smart Edition` : '';
    name = `${brand} ${baseSeries}${suffix}`;
    
    if (name.includes('Ultra') || name.includes('Fenix')) {
      price = randomRange(8000000, 16000000);
    } else if (name.includes('Band') || name.includes('Fit') || name.includes('Charge')) {
      price = randomRange(500000, 1800000);
    } else {
      price = randomRange(2500000, 6500000);
    }
    
    specs.Material = randomItem(wearablesSpecs.materials);
    specs.Battery = randomItem(wearablesSpecs.batteries);
    specs.Sensors = randomItem(wearablesSpecs.sensors);
    specs.Waterproof = '50m (5 ATM) Water Resistant';
    specs.Compatibility = 'iOS & Android';
    
    description = `Track your health, stay connected, and push your workout limits with the ${name}. Built with premium ${specs.Material} and offering ${specs.Battery} battery life, it keeps up with your active lifestyle day and night.`;
    
  } else if (category === 'audio') {
    const series = {
      Apple: ['AirPods Pro 2', 'AirPods Max', 'AirPods 3'],
      Sony: ['WH-1000XM5 Over-Ear', 'WF-1000XM5 TWS', 'LinkBuds S', 'WH-CH720N'],
      Bose: ['QuietComfort Ultra', 'QuietComfort Headphones', 'QuietComfort Earbuds II'],
      JBL: ['Tour Pro 2 TWS', 'Live 660NC', 'Tune 770NC', 'Flip 6 Portable Speaker'],
      Sennheiser: ['Momentum 4 Wireless', 'Momentum True Wireless 4', 'Accentum ANC'],
      Anker: ['Soundcore Liberty 4 NC', 'Soundcore Space Q45', 'Soundcore Motion X600'],
      Beats: ['Studio Pro', 'Fit Pro', 'Studio Buds+'],
      Samsung: ['Galaxy Buds2 Pro', 'Galaxy Buds FE']
    };
    
    const baseSeries = series[brand][modelIndex % series[brand].length];
    const suffix = modelIndex >= series[brand].length ? ` Pro Edition` : '';
    name = `${brand} ${baseSeries}${suffix}`;
    
    if (name.includes('Max') || name.includes('Ultra') || name.includes('WH-1000XM5') || name.includes('Momentum 4')) {
      price = randomRange(4500000, 8500000);
    } else if (name.includes('Buds FE') || name.includes('CH720N') || name.includes('Liberty') || name.includes('Flip')) {
      price = randomRange(1000000, 2200000);
    } else {
      price = randomRange(2300000, 4200000);
    }
    
    specs.Type = randomItem(audioSpecs.types);
    specs.Battery = randomItem(audioSpecs.batteries);
    specs.Waterproof = randomItem(audioSpecs.waterproof);
    specs.Connectivity = 'Bluetooth 5.3, Multipoint Connection';
    specs.NoiseCancelling = name.includes('Buds') || name.includes('Pro') || name.includes('Comfort') || name.includes('XM5') || name.includes('NC') || name.includes('ANC') ? 'Active Noise Cancellation (ANC)' : 'Passive Isolation';
    
    description = `Immerse yourself in audiophile-grade sound quality with the ${name}. Featuring industry-leading ${specs.NoiseCancelling}, rich bass, crisp highs, and an ergonomic design for long-lasting comfort.`;
    
  } else {
    // Accessories
    const items = accessoriesSpecs.types;
    const baseItem = items[modelIndex % items.length];
    name = `${brand} ${baseItem}`;
    
    if (name.includes('3-in-1') || name.includes('MagSafe Power') || name.includes('Stylus')) {
      price = randomRange(600000, 1500000);
    } else if (name.includes('Case') || name.includes('Glass') || name.includes('Cable')) {
      price = randomRange(150000, 400000);
    } else {
      price = randomRange(350000, 800000);
    }
    
    specs.Type = baseItem;
    specs.Compatibility = 'Multi-device compatible';
    specs.Material = randomItem(['Premium Polycarbonate', 'TPU Protective Gel', 'Braided Nylon & Copper', 'Aramid Fiber', 'Tempered Glass (9H hardness)']);
    
    if (baseItem.includes('Charger') || baseItem.includes('Power Bank')) {
      specs.Output = randomItem(['30W Power Delivery', '45W GaN Fast Charge', '65W Dual Port PD', '100W Quad Port GaN', '15W Wireless Charging']);
    } else if (baseItem.includes('Cable')) {
      specs.Length = randomItem(['1.0 meter (3.3 ft)', '1.8 meters (6 ft)', '3.0 meters (10 ft)']);
    }
    
    description = `Enhance your tech ecosystem with the highly durable ${name}. Built using ${specs.Material} to provide premium utility and style for your devices.`;
  }
  
  const rating = randomFloat(3.8, 5.0);
  const reviewsCount = randomRange(10, 850);
  const stock = randomRange(0, 120); // Some out of stock (stock = 0)
  const featured = randomRange(1, 100) <= 8; // ~8% featured products
  const onSale = randomRange(1, 100) <= 20; // ~20% on sale
  let discountPrice = undefined;
  if (onSale) {
    const discountPercent = randomItem([10, 15, 20, 25, 30]);
    discountPrice = Math.floor(price * (1 - discountPercent / 100));
  }
  
  // High quality Unsplash placeholder images matching the brand/category
  // Using reliable Unsplash Source IDs for gadget representations
  const imageIds = {
    smartphones: ['photo-1511707171634-5f897ff02aa9', 'photo-1598327105666-5b89351aff97', 'photo-1580910051074-3eb694886505', 'photo-1565849906111-50d4a1b078f4'],
    tablets: ['photo-1544244015-0df4b3ffc6b0', 'photo-1589739900243-4b52cd9b104e', 'photo-1527698266440-12104e498b76'],
    wearables: ['photo-1508685096489-7aacd43bd3b1', 'photo-1579586337278-3befd40fd17a', 'photo-1434494878577-86c23bcb06b9'],
    audio: ['photo-1505740420928-5e560c06d30e', 'photo-1546435770-a3e426bf472b', 'photo-1583394838336-acd977736f90', 'photo-1487215078519-e21cc028cb29'],
    accessories: ['photo-1608248597279-f99d160bfcbc', 'photo-1622445262465-248197522559', 'photo-1583863788434-e58a36330cf0']
  };
  
  const selectedImageId = imageIds[category][(brandIndex + modelIndex) % imageIds[category].length];
  const image = `https://images.unsplash.com/${selectedImageId}?auto=format&fit=crop&w=600&q=80`;
  
  return {
    id: `prod-${id}`,
    name,
    brand,
    category,
    price,
    rating,
    reviewsCount,
    image,
    specs,
    description,
    stock,
    featured,
    onSale,
    discountPrice,
    colors: productColors,
    storage
  };
}

// Generate the array of 1000 items
const products = [];
let id = 1;

// Distribute products across categories:
// smartphones: ~250
// tablets: ~150
// wearables: ~200
// audio: ~200
// accessories: ~200
const categoryDistribution = {
  smartphones: 250,
  tablets: 150,
  wearables: 200,
  audio: 200,
  accessories: 200
};

Object.entries(categoryDistribution).forEach(([category, count]) => {
  const brandList = brands[category];
  for (let i = 0; i < count; i++) {
    const brandIndex = i % brandList.length;
    const modelIndex = Math.floor(i / brandList.length);
    products.push(generateProduct(id, category, brandIndex, modelIndex));
    id++;
  }
});

// Double check length is exactly 1000
console.log(`Generated ${products.length} products.`);

// Write the file
const dirPath = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFileSync(
  path.join(dirPath, 'products.json'),
  JSON.stringify(products, null, 2),
  'utf8'
);

console.log(`Successfully wrote products.json to ${path.join(dirPath, 'products.json')}`);
