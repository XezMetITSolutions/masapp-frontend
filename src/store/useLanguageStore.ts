import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { aiTranslationService } from '@/lib/aiTranslation';

type Language = 'en' | 'tr' | 'de';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: {
    [key: string]: {
      en: string;
      tr: string;
      de: string;
    };
  };
  t: (key: string) => string;
  tAI: (text: string, context?: string) => Promise<string>;
  isTranslating: boolean;
}

const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en', // Default language
      isTranslating: false,
      
      setLanguage: (language) => {
        set({ language });
      },
      
      translations: {
        // Common UI elements
        appName: {
          en: 'MASAPP',
          tr: 'MASAPP',
          de: 'MASAPP',
        },
        menu: {
          en: 'Menu',
          tr: 'Menü',
          de: 'Speisekarte',
        },
        cart: {
          en: 'Cart',
          tr: 'Sepet',
          de: 'Warenkorb',
        },
        waiter: {
          en: 'Waiter',
          tr: 'Garson',
          de: 'Kellner',
        },
        table: {
          en: 'Table',
          tr: 'Masa',
          de: 'Tisch',
        },
        
        // Menu page
        categories: {
          en: 'Categories',
          tr: 'Kategoriler',
          de: 'Kategorien',
        },
        popular: {
          en: 'Popular',
          tr: 'Popüler',
          de: 'Beliebt',
        },
        all: {
          en: 'All',
          tr: 'Tümü',
          de: 'Alle',
        },
        addToCart: {
          en: 'Add to Cart',
          tr: 'Sepete Ekle',
          de: 'In den Warenkorb',
        },
        
        // Cart page
        yourOrder: {
          en: 'Your Order',
          tr: 'Siparişiniz',
          de: 'Ihre Bestellung',
        },
        emptyCart: {
          en: 'Your cart is empty',
          tr: 'Sepetiniz boş',
          de: 'Ihr Warenkorb ist leer',
        },
        subtotal: {
          en: 'Subtotal',
          tr: 'Ara Toplam',
          de: 'Zwischensumme',
        },
        discount: {
          en: 'Discount',
          tr: 'İndirim',
          de: 'Rabatt',
        },
        tip: {
          en: 'Tip',
          tr: 'Bahşiş',
          de: 'Trinkgeld',
        },
        total: {
          en: 'Total',
          tr: 'Toplam',
          de: 'Gesamt',
        },
        applyCoupon: {
          en: 'Apply Coupon',
          tr: 'Kupon Uygula',
          de: 'Gutschein anwenden',
        },
        placeOrder: {
          en: 'Place Order',
          tr: 'Sipariş Ver',
          de: 'Bestellung aufgeben',
        },
        
        // Waiter page
        callWaiter: {
          en: 'Call Waiter',
          tr: 'Garson Çağır',
          de: 'Kellner rufen',
        },
        quickRequests: {
          en: 'Quick Requests',
          tr: 'Hızlı İstekler',
          de: 'Schnelle Anfragen',
        },
        customRequest: {
          en: 'Custom Request',
          tr: 'Özel İstek',
          de: 'Benutzerdefinierte Anfrage',
        },
        water: {
          en: 'Water',
          tr: 'Su',
          de: 'Wasser',
        },
        bill: {
          en: 'Bill',
          tr: 'Hesap',
          de: 'Rechnung',
        },
        cleanTable: {
          en: 'Clean Table',
          tr: 'Masa Temizliği',
          de: 'Tisch abräumen',
        },
        help: {
          en: 'Help',
          tr: 'Yardım',
          de: 'Hilfe',
        },
        send: {
          en: 'Send',
          tr: 'Gönder',
          de: 'Senden',
        },
        activeRequests: {
          en: 'Active Requests',
          tr: 'Aktif İstekler',
          de: 'Aktive Anfragen',
        },
        
        // Item detail page
        quantity: {
          en: 'Quantity',
          tr: 'Adet',
          de: 'Menge',
        },
        ingredients: {
          en: 'Ingredients',
          tr: 'İçindekiler',
          de: 'Zutaten',
        },
        allergens: {
          en: 'Allergens',
          tr: 'Alerjenler',
          de: 'Allergene',
        },
        calories: {
          en: 'Calories',
          tr: 'Kalori',
          de: 'Kalorien',
        },
        servingInfo: {
          en: 'Serving Info',
          tr: 'Servis Bilgisi',
          de: 'Portionsinfo',
        },
        
        // Admin
        dashboard: {
          en: 'Dashboard',
          tr: 'Panel',
          de: 'Dashboard',
        },
        qrGenerator: {
          en: 'QR Generator',
          tr: 'QR Oluşturucu',
          de: 'QR-Generator',
        },
        settings: {
          en: 'Settings',
          tr: 'Ayarlar',
          de: 'Einstellungen',
        },
      },
      
      t: (key) => {
        const currentLanguage = get().language;
        const translation = get().translations[key];
        
        if (!translation) {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
        
        return translation[currentLanguage] || key;
      },

      tAI: async (text, context) => {
        const currentLanguage = get().language;
        
        // Eğer zaten hedef dilde ise çeviri yapma
        if (currentLanguage === 'en' && /^[a-zA-Z\s.,!?]+$/.test(text)) {
          return text;
        }
        if (currentLanguage === 'tr' && /^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s.,!?]+$/.test(text)) {
          return text;
        }
        if (currentLanguage === 'de' && /^[a-zA-ZäöüßÄÖÜ\s.,!?]+$/.test(text)) {
          return text;
        }

        set({ isTranslating: true });
        
        try {
          const translatedText = await aiTranslationService.translate(text, {
            targetLanguage: currentLanguage,
            context,
            useCache: true
          });
          
          set({ isTranslating: false });
          return translatedText;
        } catch (error) {
          console.error('AI Translation error:', error);
          set({ isTranslating: false });
          return text; // Hata durumunda orijinal metni döndür
        }
      },
    }),
    {
      name: 'masapp-language-storage',
    }
  )
);

export default useLanguageStore;
