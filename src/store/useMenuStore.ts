import { create } from 'zustand';
import { useCache } from '@/hooks/useCache';
import { menuData } from '@/data/menu-data';

export interface MenuItem {
  id: string;
  name: {
    en: string;
    tr: string;
  };
  description: {
    en: string;
    tr: string;
  };
  price: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  popular: boolean;
  ingredients?: string[];
  allergens?: { en: string; tr: string }[];
  calories?: number;
  preparationTime?: number;
  servingInfo?: {
    en: string;
    tr: string;
  };
  isAvailable?: boolean;
}

export interface MenuSubcategory {
  id: string;
  name: {
    en: string;
    tr: string;
  };
  parentId: string;
}

export interface MenuCategory {
  id: string;
  name: {
    en: string;
    tr: string;
  };
  description?: {
    en: string;
    tr: string;
  };
  image?: string;
  subcategories?: MenuSubcategory[];
  isActive?: boolean;
}

interface MenuState {
  items: MenuItem[];
  categories: MenuCategory[];
  subcategories: MenuSubcategory[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchMenu: () => Promise<void>;
  getItemsByCategory: (categoryId: string) => MenuItem[];
  getItemsBySubcategory: (subcategoryId: string) => MenuItem[];
  getPopularItems: () => MenuItem[];
  getItemById: (id: string) => MenuItem | undefined;
  getSubcategoriesByParent: (parentId: string) => MenuSubcategory[];
  updateItemPrice: (itemId: string, newPrice: number) => void;
  bulkUpdatePrices: (categoryId: string | 'all', operation: 'increase' | 'decrease', type: 'percentage' | 'fixed', value: number) => void;
}

// Sample menu data
const sampleSubcategories: MenuSubcategory[] = [
  // Starters subcategories
  {
    id: 'soups',
    name: {
      en: 'Soups',
      tr: 'Çorbalar'
    },
    parentId: 'starters'
  },
  {
    id: 'salads',
    name: {
      en: 'Salads',
      tr: 'Salatalar'
    },
    parentId: 'starters'
  },
  {
    id: 'appetizers',
    name: {
      en: 'Appetizers',
      tr: 'Mezeler'
    },
    parentId: 'starters'
  },
  
  // Main Courses subcategories
  {
    id: 'meat',
    name: {
      en: 'Meat',
      tr: 'Et'
    },
    parentId: 'main-courses'
  },
  {
    id: 'chicken',
    name: {
      en: 'Chicken',
      tr: 'Tavuk'
    },
    parentId: 'main-courses'
  },
  {
    id: 'seafood',
    name: {
      en: 'Seafood',
      tr: 'Deniz Ürünleri'
    },
    parentId: 'main-courses'
  },
  {
    id: 'pasta',
    name: {
      en: 'Pasta',
      tr: 'Makarna'
    },
    parentId: 'main-courses'
  },
  
  // Desserts subcategories
  {
    id: 'cakes',
    name: {
      en: 'Cakes',
      tr: 'Pastalar'
    },
    parentId: 'desserts'
  },
  {
    id: 'ice-cream',
    name: {
      en: 'Ice Cream',
      tr: 'Dondurma'
    },
    parentId: 'desserts'
  },
  
  // Drinks subcategories
  {
    id: 'hot-drinks',
    name: {
      en: 'Hot Drinks',
      tr: 'Sıcak İçecekler'
    },
    parentId: 'drinks'
  },
  {
    id: 'cold-drinks',
    name: {
      en: 'Cold Drinks',
      tr: 'Soğuk İçecekler'
    },
    parentId: 'drinks'
  },
  {
    id: 'alcoholic',
    name: {
      en: 'Alcoholic',
      tr: 'Alkollü'
    },
    parentId: 'drinks'
  }
];

const sampleCategories: MenuCategory[] = [
  {
    id: 'starters',
    name: {
      en: 'Starters',
      tr: 'Başlangıçlar'
    },
    image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?q=80&w=300'
  },
  {
    id: 'main-courses',
    name: {
      en: 'Main Courses',
      tr: 'Ana Yemekler'
    },
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=300'
  },
  {
    id: 'desserts',
    name: {
      en: 'Desserts',
      tr: 'Tatlılar'
    },
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=300'
  },
  {
    id: 'drinks',
    name: {
      en: 'Drinks',
      tr: 'İçecekler'
    },
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=300'
  }
];

const sampleItems: MenuItem[] = [
  {
    id: 'bruschetta',
    name: {
      en: 'Bruschetta',
      tr: 'Bruschetta'
    },
    description: {
      en: 'Grilled bread rubbed with garlic and topped with olive oil, salt, and tomato.',
      tr: 'Sarımsaklı, zeytinyağlı ve domatesli kızarmış ekmek.'
    },
    price: 45,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?q=80&w=500',
    category: 'starters',
    subcategory: 'appetizers',
    popular: true,
    ingredients: ['Bread', 'Tomato', 'Garlic', 'Olive oil', 'Basil'],
    allergens: [{ en: 'Gluten', tr: 'Gluten' }],
    calories: 220,
    preparationTime: 10
  },
  {
    id: 'caesar-salad',
    name: {
      en: 'Caesar Salad',
      tr: 'Sezar Salata'
    },
    description: {
      en: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese.',
      tr: 'Taze marul, Sezar sosu, kruton ve parmesan peyniri.'
    },
    price: 85,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=500',
      'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?q=80&w=500',
      'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=500'
    ],
    category: 'starters',
    subcategory: 'salads',
    popular: true,
    ingredients: ['Romaine lettuce', 'Caesar dressing', 'Croutons', 'Parmesan'],
    allergens: [
      { en: 'Gluten', tr: 'Gluten' },
      { en: 'Dairy', tr: 'Süt Ürünleri' },
      { en: 'Eggs', tr: 'Yumurta' }
    ],
    calories: 320,
    preparationTime: 15
  },
  {
    id: 'beef-burger',
    name: {
      en: 'Gourmet Beef Burger',
      tr: 'Gurme Burger'
    },
    description: {
      en: 'Premium beef patty with cheese, lettuce, tomato, and special sauce.',
      tr: 'Özel peynir, marul, domates ve özel soslu premium dana köfte.'
    },
    price: 120,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500',
    category: 'main-courses',
    subcategory: 'meat',
    popular: true,
    ingredients: ['Beef', 'Cheese', 'Lettuce', 'Tomato', 'Special sauce', 'Bun'],
    allergens: [
      { en: 'Gluten', tr: 'Gluten' },
      { en: 'Dairy', tr: 'Süt Ürünleri' },
      { en: 'Eggs', tr: 'Yumurta' }
    ],
    calories: 750,
    preparationTime: 20
  },
  {
    id: 'salmon',
    name: {
      en: 'Grilled Salmon',
      tr: 'Izgara Somon'
    },
    description: {
      en: 'Fresh salmon fillet grilled to perfection with lemon butter sauce.',
      tr: 'Limon tereyağı sosu ile mükemmel pişirilmiş taze somon fileto.'
    },
    price: 160,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=500',
    category: 'main-courses',
    subcategory: 'seafood',
    popular: false,
    ingredients: ['Salmon', 'Butter', 'Lemon', 'Herbs'],
    allergens: [
      { en: 'Fish', tr: 'Balık' },
      { en: 'Dairy', tr: 'Süt Ürünleri' }
    ],
    calories: 450,
    preparationTime: 25
  },
  {
    id: 'tiramisu',
    name: {
      en: 'Tiramisu',
      tr: 'Tiramisu'
    },
    description: {
      en: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
      tr: 'Kahveli kedi dili bisküvi ve mascarpone kreması ile klasik İtalyan tatlısı.'
    },
    price: 65,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500',
    category: 'desserts',
    subcategory: 'cakes',
    popular: true,
    ingredients: ['Ladyfingers', 'Mascarpone', 'Coffee', 'Cocoa'],
    allergens: [
      { en: 'Gluten', tr: 'Gluten' },
      { en: 'Dairy', tr: 'Süt Ürünleri' },
      { en: 'Eggs', tr: 'Yumurta' }
    ],
    calories: 380,
    preparationTime: 15
  },
  {
    id: 'cheesecake',
    name: {
      en: 'New York Cheesecake',
      tr: 'New York Cheesecake'
    },
    description: {
      en: 'Creamy cheesecake with a graham cracker crust and berry compote.',
      tr: 'Graham kraker tabanı ve berry sos ile kremsi cheesecake.'
    },
    price: 70,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500',
    category: 'desserts',
    subcategory: 'cakes',
    popular: false,
    ingredients: ['Cream cheese', 'Graham crackers', 'Sugar', 'Berries'],
    allergens: [
  { en: 'Gluten', tr: 'Gluten' },
  { en: 'Dairy', tr: 'Süt Ürünleri' },
  { en: 'Eggs', tr: 'Yumurta' }
],
    calories: 450,
    preparationTime: 20
  },
  {
    id: 'mojito',
    name: {
      en: 'Mojito',
      tr: 'Mojito'
    },
    description: {
      en: 'Refreshing cocktail with rum, mint, lime, sugar, and soda water.',
      tr: 'Rom, nane, misket limonu, şeker ve soda ile ferahlatıcı kokteyl.'
    },
    price: 55,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=500',
    category: 'drinks',
    subcategory: 'alcoholic',
    popular: true,
    ingredients: ['Rum', 'Mint', 'Lime', 'Sugar', 'Soda water'],
    allergens: [],
    calories: 180,
    preparationTime: 5
  },
  {
    id: 'latte',
    name: {
      en: 'Caffe Latte',
      tr: 'Caffe Latte'
    },
    description: {
      en: 'Espresso with steamed milk and a light layer of foam.',
      tr: 'Buharda ısıtılmış süt ve hafif bir köpük tabakası ile espresso.'
    },
    price: 35,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=500',
    category: 'drinks',
    subcategory: 'hot-drinks',
    popular: false,
    ingredients: ['Espresso', 'Milk'],
    allergens: [
      { en: 'Dairy', tr: 'Süt Ürünleri' }
    ],
    calories: 120,
    preparationTime: 5
  }
];

const useMenuStore = create<MenuState>()((set, get) => ({
  items: sampleItems,
  categories: sampleCategories,
  subcategories: sampleSubcategories,
  isLoading: false,
  error: null,
  
  fetchMenu: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Check cache first
      const cacheKey = 'menu_data';
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        const cacheAge = now - timestamp;
        const cacheTTL = 5 * 60 * 1000; // 5 minutes
        
        if (cacheAge < cacheTTL) {
          // Use cached data
          set({ 
            items: data.items,
            categories: data.categories,
            subcategories: data.subcategories,
            isLoading: false 
          });
          return;
        }
      }
      
      // In a real app, this would be an API call
      // For now, we'll just simulate a delay and use our sample data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const menuDataToCache = {
        items: sampleItems,
        categories: sampleCategories,
        subcategories: sampleSubcategories,
      };
      
      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify({
        data: menuDataToCache,
        timestamp: Date.now()
      }));
      
      set({ 
        ...menuDataToCache,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch menu data',
        isLoading: false 
      });
    }
  },
  
  getItemsByCategory: (categoryId) => {
    return get().items.filter(item => item.category === categoryId);
  },
  
  getItemsBySubcategory: (subcategoryId) => {
    return get().items.filter(item => item.subcategory === subcategoryId);
  },
  
  getPopularItems: () => {
    return get().items.filter(item => item.popular);
  },
  
  getItemById: (id) => {
    return get().items.find(item => item.id === id);
  },
  
  getSubcategoriesByParent: (parentId) => {
    return get().subcategories.filter(subcategory => subcategory.parentId === parentId);
  },

  updateItemPrice: (itemId, newPrice) => {
    const state = get();
    const updatedItems = state.items.map(item => 
      item.id === itemId ? { ...item, price: newPrice } : item
    );
    set({ items: updatedItems });
  },

  bulkUpdatePrices: (categoryId, operation, type, value) => {
    const state = get();
    const items = [...state.items];
    const itemsToUpdate = categoryId === 'all' 
      ? items 
      : items.filter(item => item.category === categoryId);

    const updatedItems = items.map(item => {
      if (categoryId !== 'all' && item.category !== categoryId) {
        return item;
      }

      let newPrice = item.price;
      
      if (type === 'percentage') {
        const percentage = value / 100;
        if (operation === 'increase') {
          newPrice = item.price * (1 + percentage);
        } else {
          newPrice = item.price * (1 - percentage);
        }
      } else {
        if (operation === 'increase') {
          newPrice = item.price + value;
        } else {
          newPrice = Math.max(0, item.price - value);
        }
      }
      
      return { ...item, price: Math.round(newPrice * 100) / 100 }; // 2 decimal places
    });

    set({ items: updatedItems });
  }
}));

export default useMenuStore;
