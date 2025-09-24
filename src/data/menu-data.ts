export interface MenuItem {
  id: string;
  name: {
    en: string;
    tr: string;
    de?: string;
  };
  description: {
    en: string;
    tr: string;
    de?: string;
  };
  price: number;
  image: string;
  category: string;
  popular: boolean;
  isAvailable?: boolean;
  allergens?: Array<string | {en: string; tr: string; de?: string}>;
  calories?: number;
  servingInfo?: {
    en: string;
    tr: string;
    de?: string;
  };
}

export const menuData: MenuItem[] = [
  // Popular Items
  {
    id: 'beef-burger',
    name: {
      en: 'Gourmet Beef Burger',
      tr: 'Gurme Burger',
      de: 'Gourmet-Burger'
    },
    description: {
      en: 'Premium beef patty with caramelized onions, cheddar cheese, and special sauce on a brioche bun',
      tr: 'Özel soslu, karamelize soğanlı, cheddar peynirli premium dana köfte ve brioche ekmek',
      de: 'Premium-Rindfleischpatty mit karamellisierten Zwiebeln, Cheddar und Spezialsauce im Brioche-Brötchen'
    },
    price: 120,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500',
    category: 'mains',
    popular: true,
    allergens: [
      { en: 'Gluten', tr: 'Gluten' },
      { en: 'Dairy', tr: 'Süt Ürünleri' }
    ],
    calories: 850,
    servingInfo: {
      en: 'Served with french fries and coleslaw',
      tr: 'Patates kızartması ve coleslaw ile servis edilir',
      de: 'Mit Pommes Frites und Krautsalat serviert'
    }
  },
  {
    id: 'caesar-salad',
    name: {
      en: 'Chicken Caesar Salad',
      tr: 'Tavuklu Sezar Salata',
      de: 'Hähnchen-Caesar-Salat'
    },
    description: {
      en: 'Crisp romaine lettuce, grilled chicken, parmesan cheese, croutons, and Caesar dressing',
      tr: 'Taze marul, ızgara tavuk, parmesan peyniri, kruton ve Sezar sosu',
      de: 'Knuspriger Römersalat, gegrilltes Hähnchen, Parmesan, Croutons und Caesar-Dressing'
    },
    price: 85,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=500',
    category: 'starters',
    popular: true,
    allergens: [
      { en: 'Gluten', tr: 'Gluten', de: 'Gluten' },
      { en: 'Dairy', tr: 'Süt Ürünleri', de: 'Milchprodukte' },
      { en: 'Eggs', tr: 'Yumurta', de: 'Eier' },
      { en: 'Fish', tr: 'Balık', de: 'Fisch' }
    ],
    calories: 450,
    servingInfo: {
      en: 'Available as a starter or main course',
      tr: 'Başlangıç veya ana yemek olarak servis edilebilir',
      de: 'Als Vorspeise oder Hauptgericht erhältlich'
    }
  },
  {
    id: 'tiramisu',
    name: {
      en: 'Classic Tiramisu',
      tr: 'Klasik Tiramisu',
      de: 'Klassisches Tiramisu'
    },
    description: {
      en: 'Layers of coffee-soaked ladyfingers and mascarpone cream dusted with cocoa powder',
      tr: 'Kahve ile ıslatılmış kedidili bisküvi ve mascarpone kreması katmanları, kakao ile süslenmiş',
      de: 'Schichten aus kaffeegetränkten Löffelbiskuits und Mascarpone-Sahne, mit Kakaopulver bestäubt'
    },
    price: 65,
    image: 'https://images.unsplash.com/photo-1571877899317-1c3e516f3d51?q=80&w=500',
    category: 'desserts',
    popular: true,
    allergens: [
      { en: 'Gluten', tr: 'Gluten', de: 'Gluten' },
      { en: 'Dairy', tr: 'Süt Ürünleri', de: 'Milchprodukte' },
      { en: 'Eggs', tr: 'Yumurta', de: 'Eier' }
    ],
    calories: 420,
    servingInfo: {
      en: 'Served chilled',
      tr: 'Soğuk servis edilir',
      de: 'Kalt serviert'
    }
  },
  
  // Starters
  {
    id: 'bruschetta',
    name: {
      en: 'Tomato Bruschetta',
      tr: 'Domates Bruschetta',
      de: 'Tomaten-Bruschetta'
    },
    description: {
      en: 'Toasted bread topped with fresh tomatoes, basil, garlic, and extra virgin olive oil',
      tr: 'Taze domates, fesleğen, sarımsak ve sızma zeytinyağı ile süslenmiş kızarmış ekmek',
      de: 'Geröstetes Brot mit frischen Tomaten, Basilikum, Knoblauch und nativem Olivenöl'
    },
    price: 55,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?q=80&w=500',
    category: 'starters',
    popular: false,
    allergens: [
      { en: 'Gluten', tr: 'Gluten', de: 'Gluten' }
    ],
    calories: 320,
    servingInfo: {
      en: 'Served as 4 pieces',
      tr: '4 parça olarak servis edilir',
      de: 'Als 4 Stück serviert'
    }
  },
  {
    id: 'calamari',
    name: {
      en: 'Crispy Calamari',
      tr: 'Çıtır Kalamar',
      de: 'Knusprige Calamari'
    },
    description: {
      en: 'Lightly battered and fried squid rings served with lemon aioli',
      tr: 'Hafif hamurlu ve kızarmış kalamar halkaları, limonlu aioli ile servis edilir',
      de: 'Leicht panierte und frittierte Tintenfischringe mit Zitronen-Aioli'
    },
    price: 75,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500',
    category: 'starters',
    popular: false,
    allergens: [
      { en: 'Dairy', tr: 'Süt Ürünleri', de: 'Milchprodukte' },
      { en: 'Eggs', tr: 'Yumurta', de: 'Eier' },
      { en: 'Seafood', tr: 'Deniz Ürünleri', de: 'Meeresfrüchte' }
    ],
    calories: 380,
    servingInfo: {
      en: 'Served with lemon wedges',
      tr: 'Limon dilimleri ile servis edilir',
      de: 'Mit Zitronenspalten serviert'
    }
  },
  
  // Main Dishes - Meats
  {
    id: 'ribeye-steak',
    name: {
      en: 'Ribeye Steak',
      tr: 'Antrikot Steak',
      de: 'Ribeye-Steak'
    },
    description: {
      en: '300g prime ribeye steak cooked to your preference with herb butter',
      tr: 'Tercihinize göre pişirilmiş 300g birinci sınıf antrikot, otlu tereyağı ile',
      de: '300g Premium-Ribeye-Steak nach Ihren Wünschen zubereitet mit Kräuterbutter'
    },
    price: 220,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=500',
    category: 'meats',
    popular: false,
    allergens: [
      { en: 'Dairy', tr: 'Süt Ürünleri', de: 'Milchprodukte' }
    ],
    calories: 720,
    servingInfo: {
      en: 'Served with roasted vegetables and choice of potato',
      tr: 'Fırınlanmış sebzeler ve patates seçeneği ile servis edilir',
      de: 'Mit gebratenem Gemüse und Kartoffelwahl serviert'
    }
  },
  {
    id: 'lamb-chops',
    name: {
      en: 'Herb-Crusted Lamb Chops',
      tr: 'Otlu Kuzu Pirzola',
      de: 'Kräuterkrustierte Lammkoteletts'
    },
    description: {
      en: 'Tender lamb chops with a Mediterranean herb crust, grilled to perfection',
      tr: 'Akdeniz otları ile kaplanmış, mükemmel pişirilmiş yumuşak kuzu pirzolalar',
      de: 'Zarte Lammkoteletts mit mediterraner Kräuterkruste, perfekt gegrillt'
    },
    price: 190,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=500',
    category: 'meats',
    popular: false,
    allergens: [
      { en: 'Nuts', tr: 'Kuruyemiş', de: 'Nüsse' }
    ],
    calories: 650,
    servingInfo: {
      en: 'Served with mint sauce and roasted potatoes',
      tr: 'Nane sosu ve fırınlanmış patates ile servis edilir',
      de: 'Mit Minzsauce und gebratenen Kartoffeln serviert'
    }
  },
  
  // Main Dishes - Chicken
  {
    id: 'chicken-parmesan',
    name: {
      en: 'Chicken Parmesan',
      tr: 'Tavuk Parmesan',
      de: 'Hähnchen Parmesan'
    },
    description: {
      en: 'Breaded chicken breast topped with marinara sauce and melted mozzarella',
      tr: 'Domates sosu ve eritilmiş mozzarella ile kaplanmış galeta unlu tavuk göğsü',
      de: 'Panierte Hähnchenbrust mit Marinara-Sauce und geschmolzenem Mozzarella'
    },
    price: 110,
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=500',
    category: 'chicken',
    popular: false,
    allergens: [
      { en: 'Gluten', tr: 'Gluten', de: 'Gluten' },
      { en: 'Dairy', tr: 'Süt Ürünleri', de: 'Milchprodukte' },
      { en: 'Eggs', tr: 'Yumurta', de: 'Eier' }
    ],
    calories: 680,
    servingInfo: {
      en: 'Served with spaghetti marinara',
      tr: 'Domates soslu spagetti ile servis edilir',
      de: 'Mit Spaghetti Marinara serviert'
    }
  },
  {
    id: 'grilled-chicken',
    name: {
      en: 'Lemon Herb Grilled Chicken',
      tr: 'Limonlu Otlu Izgara Tavuk',
      de: 'Zitronen-Kräuter-Gegrilltes Hähnchen'
    },
    description: {
      en: 'Marinated chicken breast grilled with lemon, garlic, and fresh herbs',
      tr: 'Limon, sarımsak ve taze otlarla marine edilmiş ızgara tavuk göğsü',
      de: 'Marinierte Hähnchenbrust gegrillt mit Zitrone, Knoblauch und frischen Kräutern'
    },
    price: 95,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500',
    category: 'chicken',
    popular: false,
    allergens: [
      { en: 'Nuts', tr: 'Kuruyemiş', de: 'Nüsse' }
    ],
    calories: 420,
    servingInfo: {
      en: 'Served with quinoa salad and grilled vegetables',
      tr: 'Kinoa salatası ve ızgara sebzeler ile servis edilir',
      de: 'Mit Quinoa-Salat und gegrilltem Gemüse serviert'
    }
  },
  
  // Main Dishes - Pasta
  {
    id: 'spaghetti-carbonara',
    name: {
      en: 'Spaghetti Carbonara',
      tr: 'Spagetti Carbonara',
      de: 'Spaghetti Carbonara'
    },
    description: {
      en: 'Classic Italian pasta with pancetta, egg, pecorino cheese, and black pepper',
      tr: 'Pancetta, yumurta, pecorino peyniri ve karabiber ile klasik İtalyan makarnası',
      de: 'Klassische italienische Pasta mit Pancetta, Ei, Pecorino-Käse und schwarzem Pfeffer'
    },
    price: 90,
    image: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?q=80&w=500',
    category: 'pasta',
    popular: false,
    allergens: [
      { en: 'Gluten', tr: 'Gluten', de: 'Gluten' },
      { en: 'Dairy', tr: 'Süt Ürünleri', de: 'Milchprodukte' },
      { en: 'Eggs', tr: 'Yumurta', de: 'Eier' }
    ],
    calories: 650,
    servingInfo: {
      en: 'Served with garlic bread',
      tr: 'Sarımsaklı ekmek ile servis edilir',
      de: 'Mit Knoblauchbrot serviert'
    }
  },
  {
    id: 'penne-arrabbiata',
    name: {
      en: 'Penne Arrabbiata',
      tr: 'Penne Arrabbiata',
      de: 'Penne Arrabbiata'
    },
    description: {
      en: 'Penne pasta in a spicy tomato sauce with garlic, chili, and fresh parsley',
      tr: 'Sarımsak, acı biber ve taze maydanozlu baharatlı domates soslu penne makarna',
      de: 'Penne-Pasta in scharfer Tomatensauce mit Knoblauch, Chili und frischer Petersilie'
    },
    price: 80,
    image: 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?q=80&w=500',
    category: 'pasta',
    popular: false,
    allergens: [
      { en: 'Gluten', tr: 'Gluten', de: 'Gluten' }
    ],
    calories: 550,
    servingInfo: {
      en: 'Vegetarian option available',
      tr: 'Vejetaryen seçeneği mevcuttur',
      de: 'Vegetarische Option verfügbar'
    }
  },
  
  // Main Dishes - Seafood
  {
    id: 'grilled-salmon',
    name: {
      en: 'Grilled Salmon Fillet',
      tr: 'Izgara Somon Fileto',
      de: 'Gegrilltes Lachsfilet'
    },
    description: {
      en: 'Fresh Atlantic salmon fillet grilled with lemon butter and dill',
      tr: 'Limonlu tereyağı ve dereotu ile ızgara taze Atlantik somon fileto',
      de: 'Frisches Atlantik-Lachsfilet gegrillt mit Zitronenbutter und Dill'
    },
    price: 160,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=500',
    category: 'seafood',
    popular: false,
    allergens: [
      { en: 'Nuts', tr: 'Kuruyemiş', de: 'Nüsse' },
      { en: 'Dairy', tr: 'Süt Ürünleri', de: 'Milchprodukte' }
    ],
    calories: 480,
    servingInfo: {
      en: 'Served with asparagus and lemon rice',
      tr: 'Kuşkonmaz ve limonlu pilav ile servis edilir',
      de: 'Mit Spargel und Zitronenreis serviert'
    }
  },
  {
    id: 'seafood-paella',
    name: {
      en: 'Seafood Paella',
      tr: 'Deniz Mahsullü Paella',
      de: 'Meeresfrüchte-Paella'
    },
    description: {
      en: 'Traditional Spanish rice dish with shrimp, mussels, calamari, and saffron',
      tr: 'Karides, midye, kalamar ve safranla geleneksel İspanyol pilav yemeği',
      de: 'Traditionelles spanisches Reisgericht mit Garnelen, Miesmuscheln, Calamari und Safran'
    },
    price: 180,
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=500',
    category: 'seafood',
    popular: false,
    allergens: [
      { en: 'Seafood', tr: 'Deniz Ürünleri', de: 'Meeresfrüchte' },
      { en: 'Shellfish', tr: 'Kabuklu Deniz Ürünleri', de: 'Schalenfrüchte' }
    ],
    calories: 720,
    servingInfo: {
      en: 'Serves 2 people',
      tr: '2 kişilik',
      de: 'Für 2 Personen'
    }
  },
  
  // Desserts
  {
    id: 'chocolate-souffle',
    name: {
      en: 'Chocolate Soufflé',
      tr: 'Çikolatalı Sufle',
      de: 'Schokoladen-Soufflé'
    },
    description: {
      en: 'Warm chocolate soufflé with a molten center, served with vanilla ice cream',
      tr: 'Akışkan merkezli sıcak çikolatalı sufle, vanilyalı dondurma ile servis edilir',
      de: 'Warmes Schokoladen-Soufflé mit flüssigem Kern, mit Vanilleeis serviert'
    },
    price: 70,
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=500',
    category: 'desserts',
    popular: false,
    allergens: [
      { en: 'Gluten', tr: 'Gluten', de: 'Gluten' },
      { en: 'Dairy', tr: 'Süt Ürünleri', de: 'Milchprodukte' },
      { en: 'Eggs', tr: 'Yumurta', de: 'Eier' }
    ],
    calories: 450,
    servingInfo: {
      en: 'Please allow 15 minutes preparation time',
      tr: 'Lütfen 15 dakika hazırlık süresi bekleyiniz',
      de: 'Bitte 15 Minuten Zubereitungszeit einplanen'
    }
  },
  {
    id: 'baklava',
    name: {
      en: 'Pistachio Baklava',
      tr: 'Fıstıklı Baklava',
      de: 'Pistazien-Baklava'
    },
    description: {
      en: 'Layers of phyllo pastry filled with chopped pistachios, sweetened with syrup',
      tr: 'Şerbetle tatlandırılmış, kıyılmış Antep fıstığı ile doldurulmuş yufka katmanları',
      de: 'Blätterteigschichten gefüllt mit gehackten Pistazien, mit Sirup gesüßt'
    },
    price: 60,
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=500',
    category: 'desserts',
    popular: false,
    allergens: [
      { en: 'Gluten', tr: 'Gluten', de: 'Gluten' },
      { en: 'Nuts', tr: 'Kuruyemiş', de: 'Nüsse' }
    ],
    calories: 380,
    servingInfo: {
      en: 'Served with a scoop of ice cream',
      tr: 'Bir top dondurma ile servis edilir',
      de: 'Mit einer Kugel Eis serviert'
    }
  },
  
  // Drinks
  {
    id: 'fresh-lemonade',
    name: {
      en: 'Fresh Lemonade',
      tr: 'Taze Limonata'
    },
    description: {
      en: 'Freshly squeezed lemon juice with mint leaves and a hint of honey',
      tr: 'Nane yaprakları ve bir tutam bal ile taze sıkılmış limon suyu'
    },
    price: 35,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=500',
    category: 'drinks',
    popular: false,
    allergens: [
      { en: 'Nuts', tr: 'Kuruyemiş' }
    ],
    calories: 120,
    servingInfo: {
      en: 'Served with ice',
      tr: 'Buz ile servis edilir'
    }
  },
  {
    id: 'turkish-coffee',
    name: {
      en: 'Turkish Coffee',
      tr: 'Türk Kahvesi'
    },
    description: {
      en: 'Traditional Turkish coffee brewed in a copper pot with your choice of sugar',
      tr: 'Bakır cezvede pişirilmiş, şeker tercihinize göre geleneksel Türk kahvesi'
    },
    price: 25,
    image: 'https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?q=80&w=500',
    category: 'drinks',
    popular: false,
    allergens: [
      { en: 'Nuts', tr: 'Kuruyemiş' }
    ],
    calories: 5,
    servingInfo: {
      en: 'Served with Turkish delight',
      tr: 'Lokum ile servis edilir'
    }
  },
  
  // Demo: Tükendi Durumunda Olan Ürünler
  {
    id: 'lobster-thermidor',
    name: {
      en: 'Lobster Thermidor',
      tr: 'Istakoz Termidor'
    },
    description: {
      en: 'Classic French lobster dish with creamy sauce and cheese',
      tr: 'Klasik Fransız istakoz yemeği, kremalı sos ve peynir ile'
    },
    price: 450,
    image: 'https://images.unsplash.com/photo-1551218808-b8f9d5b0a9c5?q=80&w=500',
    category: 'mains',
    popular: false,
    isAvailable: false, // TÜKENDİ
    allergens: [
      { en: 'Shellfish', tr: 'Kabuklu Deniz Ürünleri' },
      { en: 'Dairy', tr: 'Süt Ürünleri' }
    ],
    calories: 650,
    servingInfo: {
      en: 'Served with seasonal vegetables',
      tr: 'Mevsim sebzeleri ile servis edilir'
    }
  },
  {
    id: 'truffle-pasta',
    name: {
      en: 'Truffle Pasta',
      tr: 'Trüf Mantarlı Makarna'
    },
    description: {
      en: 'Handmade pasta with black truffle and parmesan cheese',
      tr: 'Siyah trüf mantarlı ve parmesan peynirli el yapımı makarna'
    },
    price: 280,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?q=80&w=500',
    category: 'mains',
    popular: true,
    isAvailable: false, // TÜKENDİ
    allergens: [
      { en: 'Gluten', tr: 'Gluten' },
      { en: 'Dairy', tr: 'Süt Ürünleri' }
    ],
    calories: 520,
    servingInfo: {
      en: 'Served with fresh herbs',
      tr: 'Taze otlar ile servis edilir'
    }
  },
  {
    id: 'chocolate-souffle',
    name: {
      en: 'Chocolate Soufflé',
      tr: 'Çikolatalı Sufle'
    },
    description: {
      en: 'Warm chocolate soufflé with vanilla ice cream',
      tr: 'Vanilyalı dondurma ile sıcak çikolatalı sufle'
    },
    price: 85,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500',
    category: 'desserts',
    popular: false,
    isAvailable: false, // TÜKENDİ
    allergens: [
      { en: 'Eggs', tr: 'Yumurta' },
      { en: 'Dairy', tr: 'Süt Ürünleri' }
    ],
    calories: 420,
    servingInfo: {
      en: 'Served immediately',
      tr: 'Hemen servis edilir'
    }
  }
];
