'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaShoppingCart, FaBell, FaUtensils, FaPlus, FaMinus, FaExclamationCircle } from 'react-icons/fa';
import useMenuStore, { MenuItem } from '@/store/useMenuStore';

export default function MenuItemPage() {
  const params = useParams();
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'tr'>('tr');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [tableNumber, setTableNumber] = useState(5); // Demo table number

  const itemId = params.id as string;
  const { items } = useMenuStore.getState();
  const item = items.find((item: MenuItem) => item.id === itemId);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationCircle className="text-6xl text-error mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Item not found</h1>
          <Link href="/demo/menu" className="btn btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const translations = {
    en: {
      menu: 'Menu',
      cart: 'Cart',
      callWaiter: 'Call Waiter',
      addToCart: 'Add to Cart',
      description: 'Description',
      allergens: 'Allergens',
      calories: 'Calories',
      servingInfo: 'Serving Information',
      addedToCart: 'Added to Cart!',
      continueShopping: 'Continue Shopping',
      viewCart: 'View Cart',
      tableNumber: 'Table',
      quantity: 'Quantity',
      none: 'None',
      cal: 'cal',
    },
    tr: {
      menu: 'Menü',
      cart: 'Sepet',
      callWaiter: 'Garson Çağır',
      addToCart: 'Sepete Ekle',
      description: 'Açıklama',
      allergens: 'Alerjenler',
      calories: 'Kalori',
      servingInfo: 'Servis Bilgisi',
      addedToCart: 'Sepete Eklendi!',
      continueShopping: 'Alışverişe Devam Et',
      viewCart: 'Sepeti Görüntüle',
      tableNumber: 'Masa',
      quantity: 'Adet',
      none: 'Yok',
      cal: 'kal',
    }
  };

  const t = translations[language];

  const updateQuantity = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    // In a real app, we would add the item to the cart state here
  };

  if (addedToCart) {
    return (
      <main className="min-h-screen pb-20">
        {/* Header */}
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
          <div className="container mx-auto px-3 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/demo/menu" className="mr-2">
                <FaArrowLeft size={16} />
              </Link>
              <h1 className="text-lg font-bold text-secondary truncate max-w-[120px]">{item.name[language]}</h1>
              <div className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs">
                {t.tableNumber} #{tableNumber}
              </div>
            </div>
            <div className="flex items-center ml-4">
              <button 
                onClick={() => setLanguage('tr')}
                className={`mr-2 px-3 py-1 rounded ${language === 'tr' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                TR
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                EN
              </button>
            </div>
          </div>
        </header>

        <div className="pt-16 pb-4 flex flex-col items-center justify-center h-[70vh] md:h-[60vh] lg:h-[50vh]">
          <div className="text-center px-4 md:px-6 lg:px-8">
            <div className="h-16 w-16 bg-success rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-3">
              <FaShoppingCart />
            </div>
            <h2 className="text-xl font-bold mb-3">{t.addedToCart}</h2>
            <p className="text-gray-600 mb-4 text-sm">{quantity}x {item.name[language]}</p>
            <div className="flex flex-col gap-2 justify-center">
              <Link href="/demo/menu" className="btn btn-outline text-sm py-2">
                {t.continueShopping}
              </Link>
              <Link href="/demo/cart" className="btn btn-primary text-sm py-2">
                {t.viewCart}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto flex justify-around">
            <Link href="/demo/menu" className="flex flex-col items-center text-orange-500">
              <FaUtensils className="mb-1" />
              <span className="text-xs">{t.menu}</span>
            </Link>
            <Link href="/demo/cart" className="flex flex-col items-center text-blue-600">
              <FaShoppingCart className="mb-1" />
              <span className="text-xs">{t.cart}</span>
            </Link>
            <Link href="/demo/waiter" className="flex flex-col items-center text-blue-600">
              <FaBell className="mb-1" />
              <span className="text-xs">{t.callWaiter}</span>
            </Link>
          </div>
        </nav>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-3 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="mr-2">
              <FaArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-bold text-secondary truncate max-w-[120px]">{item.name[language]}</h1>
            <div className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs">
              {t.tableNumber} #{tableNumber}
            </div>
          </div>
          <div className="flex items-center ml-4">
            <button 
              onClick={() => setLanguage('tr')}
              className={`mr-2 px-3 py-1 rounded ${language === 'tr' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              TR
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <div className="pt-16 pb-4">
        <div className="container mx-auto px-3">
          {/* Item Image */}
          <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-200 mb-4">
            <Image
              src={item.image}
              alt={item.name[language]}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          {/* Item Details */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">{item.name[language]}</h2>
              <span className="text-lg font-bold text-primary">{item.price} ₺</span>
            </div>
            
            <div className="card mb-3 p-3 shadow-sm">
              <h3 className="font-semibold mb-1 text-sm">{t.description}</h3>
              <p className="text-gray-700 text-sm">{item.description[language]}</p>
            </div>

            {/* Allergens */}
            <div className="card mb-3 p-3 shadow-sm">
              <h3 className="font-semibold mb-1 text-sm">{t.allergens}</h3>
              <p className="text-gray-700 text-sm">
                {item.allergens && item.allergens.length > 0 
                  ? item.allergens.map((allergen: any) => {
                      // Handle both string[] and {en, tr}[] formats
                      if (typeof allergen === 'string') {
                        return allergen;
                      } else if (typeof allergen === 'object' && allergen !== null && 'tr' in allergen && 'en' in allergen) {
                        return language === 'tr' ? allergen.tr : allergen.en;
                      }
                      return '';
                    }).filter(Boolean).join(', ')
                  : t.none
                }
              </p>
            </div>

            {/* Calories */}
            {item.calories && (
              <div className="card mb-3 p-3 shadow-sm">
                <h3 className="font-semibold mb-1 text-sm">{t.calories}</h3>
                <p className="text-gray-700 text-sm">{item.calories} {t.cal}</p>
              </div>
            )}

            {/* Serving Info */}
            {item.servingInfo && (
              <div className="card mb-3 p-3 shadow-sm">
                <h3 className="font-semibold mb-1 text-sm">{t.servingInfo}</h3>
                <p className="text-gray-700 text-sm">{item.servingInfo[language]}</p>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="card mb-4 p-3 shadow-sm">
            <h3 className="font-semibold mb-2 text-sm">{t.quantity}</h3>
            <div className="flex items-center">
              <button 
                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
                onClick={() => updateQuantity(-1)}
              >
                <FaMinus size={14} />
              </button>
              <span className="mx-4 text-lg font-semibold">{quantity}</span>
              <button 
                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
                onClick={() => updateQuantity(1)}
              >
                <FaPlus size={14} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            className="btn btn-primary w-full py-2.5 text-base shadow-md"
            onClick={handleAddToCart}
          >
            {t.addToCart} - {(item.price * quantity).toFixed(2)} ₺
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 shadow-lg">
        <div className="container mx-auto flex justify-around">
          <Link href="/demo/menu" className="flex flex-col items-center text-orange-500">
            <FaUtensils className="mb-0.5" size={16} />
            <span className="text-[10px]">{t.menu}</span>
          </Link>
          <Link href="/demo/cart" className="flex flex-col items-center text-blue-600">
            <FaShoppingCart className="mb-0.5" size={16} />
            <span className="text-[10px]">{t.cart}</span>
          </Link>
          <Link href="/demo/waiter" className="flex flex-col items-center text-blue-600">
            <FaBell className="mb-0.5" size={16} />
            <span className="text-[10px]">{t.callWaiter}</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
